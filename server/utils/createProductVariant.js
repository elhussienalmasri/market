// utils/createProductVariant.js

import slugify from "slugify";
import { generateUniqueSlug } from "./generateUniqueSlug.js"; // adjust path as needed
import {Product, ProductVariant, Color, Size, ProductVariantImage } from "../models/product.model.js"

// Main function
export const createProductVariant = async (product, existingProduct) => {
  //  Generate unique slug
  const variantSlug = await generateUniqueSlug(
    slugify(product.variantName, { lower: true, trim: true }),
    ProductVariant
  );

      // Common Variant Data
    const variantData = {
      variantName: product.variantName,
      variantDescription: product.variantDescription,
      slug: variantSlug,
      isSale: product.isSale,
      sku: product.sku,
      keywords: product.keywords.join(","),
      productId: existingProduct._id,
    };

  //  Create the ProductVariant document
  const newVariant = await ProductVariant.create(variantData);

     await Product.findByIdAndUpdate(
          existingProduct._id,
          { $push: { variants: newVariant._id } },
          { new: true }
        );

  // Create related docs (images, colors, sizes)
  const [imageDocs, colorDocs, sizeDocs] = await Promise.all([
    ProductVariantImage.insertMany(
      product.images.map((i) => ({
        url: i.url,
        alt: i.url.split("/").pop() || "",
        productVariantId: newVariant._id,
      }))
    ),
    Color.insertMany(
      product.colors.map((c) => ({
        name: c.color,
        productVariantId: newVariant._id,
      }))
    ),
    Size.insertMany(
      product.sizes.map((s) => ({
        size: s.size,
        quantity: s.quantity,
        price: s.price,
        discount: s.discount,
        productVariantId: newVariant._id,
      }))
    ),
  ]);

  // Update ProductVariant references
  newVariant.images = imageDocs.map((img) => img._id);
  newVariant.colors = colorDocs.map((c) => c._id);
  newVariant.sizes = sizeDocs.map((s) => s._id);

  await newVariant.save();

  return {
    message: "Product and variant created successfully",
    slug: existingProduct.slug,
  };
};
