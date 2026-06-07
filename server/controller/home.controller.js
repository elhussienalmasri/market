import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";

export const getHomeDataDynamic = async (req, res) => {
  const params = req.body.params;

  if (!Array.isArray(params) || !params.length) {
    throw new Error("Invalid input: params must be a non-empty array.");
  }

  const getCheapestSize = (sizes) => {
    if (!sizes.length) return { discountedPrice: 0 };

    return sizes
      .map((size) => ({
        ...size,
        discountedPrice: size.price * (1 - size.discount / 100),
      }))
      .sort((a, b) => a.discountedPrice - b.discountedPrice)[0];
  };

  const formatProducts = (products, type) => {
    if (type === "simple") {
      return products
        .map((product) => {
          const variant = product.variants?.[0];

          if (!variant) return null;

          const cheapestSize = getCheapestSize(variant.sizes || []);

          return {
            name: product.name,
            slug: product.slug,
            variantName: variant.variantName,
            variantSlug: variant.slug,
            price: cheapestSize.discountedPrice,
            image: variant.images?.[0]?.url || variant.variantImage || "",
          };
        })
        .filter(Boolean);
    }

    return products.map((product) => {
      const variants = product.variants.map((variant) => ({
        variantId: variant._id,
        variantSlug: variant.slug,
        variantName: variant.variantName,
        variantImage: variant.variantImage,
        images: variant.images,
        sizes: variant.sizes,
      }));

      const variantImages = variants.map((variant) => ({
        url: `/product/${product.slug}/${variant.variantSlug}`,
        image: variant.variantImage || variant.images?.[0]?.url || "",
      }));

      return {
        id: product._id,
        slug: product.slug,
        name: product.name,
        rating: product.rating,
        sales: product.sales,
        numReviews: product.reviews?.length || 0,
        variants,
        variantImages,
      };
    });
  };

  const results = await Promise.all(
    params.map(async ({ property, value, type }) => {
      let products = [];

      switch (property) {
        case "category": {
          products = await Product.find()
            .populate({
              path: "categoryId",
              match: { url: value },
            })
            .populate({
              path: "variants",
              populate: [{ path: "sizes" }, { path: "images" }],
            })
            .populate("reviews")
            .lean();

          products = products.filter((p) => p.categoryId);
          break;
        }

        case "subCategory": {
          products = await Product.find()
            .populate({
              path: "subCategoryId",
              match: { url: value },
            })
            .populate({
              path: "variants",
              populate: [{ path: "sizes" }, { path: "images" }],
            })
            .populate("reviews")
            .lean();

          products = products.filter((p) => p.subCategoryId);
          break;
        }

        case "offer": {
          products = await Product.find()
            .populate({
              path: "offerTag",
              match: { url: value },
            })
            .populate({
              path: "variants",
              populate: [{ path: "sizes" }, { path: "images" }],
            })
            .populate("reviews")
            .lean();

          products = products.filter((p) => p.offerTag);
          break;
        }

        default:
          throw new Error(`Invalid property: ${property}`);
      }

      const formattedData = formatProducts(products, type);

      const outputKey = `products_${value.replace(/-/g, "_")}`;

      return {
        [outputKey]: formattedData,
      };
    }),
  );

  const finalResult = results.reduce(
    (acc, result) => ({ ...acc, ...result }),
    {},
  );

  return res.status(200).json(finalResult);
};

export const getHomeFeaturedCategories = async (req, res) => {
  try {
    const categories = await Category.find({ featured: true })
      .populate({
        path: "subCategories",
        match: { featured: true },
        select: "name url image products",
        populate: {
          path: "products",
          select: "_id",
        },
      })
      .populate({
        path: "products",
        select: "_id",
      })
      .lean();

    const formatted = categories
      .map((category) => {
        const subCategories = (category.subCategories || [])
          .map((sub) => ({
            id: sub._id,
            name: sub.name,
            url: sub.url,
            image: sub.image,
            productCount: sub.products?.length || 0,
          }))
          .sort((a, b) => b.productCount - a.productCount) // orderBy products count
          .slice(0, 3); // take 3

        return {
          id: category._id,
          name: category.name,
          url: category.url,
          productCount: category.products?.length || 0,
          subCategories,
        };
      })
      .sort((a, b) => b.productCount - a.productCount) // orderBy categories count
      .slice(0, 6); // take 6

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching featured categories:", error);
    throw new Error("Failed to fetch featured categories");
  }
};
