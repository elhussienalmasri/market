import { Store } from "../models/store.model.js";
import slugify from "slugify";

import { Product, Question, Spec } from "../models/product.model.js"

import { createProductVariant } from "../utils/createProductVariant.js";
import { generateUniqueSlug } from "../utils/generateUniqueSlug.js";


// upsertProduct (create or update product + variant)
// Controller: Upsert product and variant
export const upsertProduct = async (req, res) => {
  try {
    const { product } = req.body;
    const { storeUrl } = req.params
    const { userId } = req.auth;

    if (!userId) return res.status(401).json({ error: "Unauthenticated." });
    if (user.role !== "SELLER")
      return res
        .status(403)
        .json({ error: "Unauthorized Access: Seller Privileges Required." });

    if (!product) return res.status(400).json({ error: "Missing product data." });

    // Check if store exists
    const store = await Store.findOne({ url: storeUrl });
    if (!store) return res.status(404).json({ error: "Store not found." });

    // Check for existing product
    const existingProduct = await Product.findById(product.productId);

    // Generate unique slugs
    const productSlug = await generateUniqueSlug(
      slugify(product.name, { lower: true, trim: true }),
      Product
    );

    if (!existingProduct) {
      //  Create the main Product
      const newProduct = await Product.create({
        name: product.name,
        description: product.description,
        slug: await generateUniqueSlug(productSlug, Product),
        brand: product.brand,
        storeId: store._id,
        categoryId: product.categoryId,
        subCategoryId: product.subCategoryId || null,
        offerTag: product.offerTagId,
      });

      // 2. Create specs and questions in parallel
      const [specDocs, questionDocs] = await Promise.all([
        Spec.insertMany(
          product.product_specs.map((spec) => ({
            name: spec.name,
            value: spec.value,
            productId: newProduct._id,
          }))
        ),
        Question.insertMany(
          product.questions.map((q) => ({
            question: q.question,
            answer: q.answer,
            productId: newProduct._id,
          }))
        ),
      ]);

      // 3. Update the product with the created spec/question IDs
      newProduct.specs = specDocs.map((s) => s._id);
      newProduct.questions = questionDocs.map((q) => q._id);
      await newProduct.save();

      const result = await createProductVariant(product, newProduct);
      res.status(201).json(result);

    } else {

      const result = await createProductVariant(product, existingProduct)
      res.status(201).json(result);
    }
  } catch (error) {
    console.error("Error upserting product:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

//  getProductVariant
export const getProductVariant = async (req, res) => {
  try {
    const { productId, variantId } = req.params;

    const product = await Product.findById(productId)
      .populate("categoryId subCategoryId")
      .populate({
        path: "variants",
        match: { _id: variantId },
        populate: ["images", "colors", "sizes"],
      });
    if (!product) throw new Error("Product not found.");
    const variant = product.variants[0];

    res.json({
      productId: product._id,
      variantId: variant._id,
      name: product.name,
      description: product.description,
      variantName: variant.variantName,
      variantDescription: variant.variantDescription,
      images: variant.images,
      categoryId: product.category,
      subCategoryId: product.subCategory,
      isSale: variant.isSale,
      brand: product.brand,
      sku: variant.sku,
      colors: variant.colors,
      sizes: variant.sizes,
      keywords: variant.keywords,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// getProductMainInfo
export const getProductMainInfo = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({
      productId: product._id,
      name: product.name,
      description: product.description,
      brand: product.brand,
      categoryId: product.categoryId,
      subCategoryId: product.subCategoryId,
      storeId: product.store,
      offerTag: product.offerTag
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//  getAllStoreProducts
export const getAllStoreProducts = async (req, res) => {
  try {
    const { storeUrl } = req.params;

    const store = await Store.findOne({ url: storeUrl });
    if (!store) throw new Error("Please provide a valid store URL.");

    const products = await Product.find({ storeId: store._id })
      .populate("categoryId subCategoryId storeId")
      .populate({
        path: 'variants',
        populate: [
          {
            path: 'images',
            options: { sort: { order: 1 } }, //  order by `order` ascending
          },
          {
            path: 'colors',
          },
          {
            path: 'sizes',
          },
        ],
      });
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// deleteProduct
export const deleteProduct = async (req, res) => {
  try {
    const user = req.user;
    const { productId } = req.params;

    if (!user) throw new Error("Unauthenticated.");
    if (user.role !== "SELLER")
      throw new Error("Unauthorized Access: Seller Privileges Required for Entry.");
    if (!productId) throw new Error("Please provide product id.");

    await Product.findByIdAndDelete(productId);
    res.json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Retrieves products based on filters (category, size, brand, etc.), returns matching variants with pagination and metadata like total pages and current page.
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      sortBy = '',
      ...filters
    } = req.query;

    const currentPage = parseInt(page);
    const limit = parseInt(pageSize);
    const skip = (currentPage - 1) * limit;

    // Construct the base query
    const query = {};

    //     if (filters.category) {
    //   query.category = filters.category;
    // }

    // if (filters.brand) {
    //   query.brand = filters.brand;
    // }

    // Get all filtered, sorted products
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      // .sort(sortOptions)
      .populate({
        path: 'variants',
        populate: [
          { path: 'sizes' },
          { path: 'images' },
          { path: 'colors' },
        ],
      })
      .lean();

    const totalCount = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    // Transform the products with filtered variants into ProductCardType structure
    const productsWithFilteredVariants = products.map((product) => {
      const filteredVariants = product.variants || [];

      const variants = filteredVariants.map((variant) => ({
        variantId: variant._id,
        variantSlug: variant.slug,
        variantName: variant.variantName,
        images: variant.images,
        sizes: variant.sizes,
      }));

      const variantImages = filteredVariants.map((variant) => ({
        url: `/product/${product.slug}/${variant.slug}`,
        image: variant.variantImage || (variant.images?.[0]?.url ?? ''),
      }));

      return {
        id: product._id,
        slug: product.slug,
        name: product.name,
        rating: product.rating,
        sales: product.sales,
        variants,
        variantImages,
      };
    });

    // Return the paginated data along with metadata
    res.json({
      products: productsWithFilteredVariants,
      totalPages,
      currentPage,
      pageSize: limit,
      totalCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
                                                                                                                                                                                                                                                                                                                                                                   
