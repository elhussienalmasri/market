export const getUserCountry = (req) => {
  // cookie might be empty, undefined, or invalid JSON
  const cookie = req.cookies?.userCountry;

  const defaultCountry = {
    name: "United States",
    code: "US",
  };

  // If cookie doesn't exist or empty → return default
  if (!cookie || typeof cookie !== "string" || cookie.trim() === "") {
    return defaultCountry;
  }

  try {
    const parsed = JSON.parse(cookie);

    if (
      parsed &&
      typeof parsed === "object" &&
      "name" in parsed &&
      "code" in parsed
    ) {
      return parsed;
    }

    return defaultCountry;
  } catch (e) {
    console.error("Failed to parse userCountryCookie", e);
    return defaultCountry;
  }
};

export const formatProductResponse = (
  product,
  shippingDetails,
  storeFollowersCount,
  isUserFollowingStore,
  ratingStatistics
) => {
  if (!product) return null;

  const variant = product.variants[0]; // Default to first variant
  const { storeId, categoryId, subCategoryId, offerTag, questions, reviews } = product;
  const { images, colors, sizes } = variant;

  return {
    productId: product._id,
    variantId: variant._id,
    productSlug: product.slug,
    variantSlug: variant.slug,
    name: product.name,
    description: product.description,
    variantName: variant.variantName,
    variantDescription: variant.variantDescription,
    images,
    category: categoryId,
    subCategory: subCategoryId,
    offerTag,
    isSale: variant.isSale,
    saleEndDate: variant.saleEndDate,
    brand: product.brand,
    sku: variant.sku,
    weight: variant.weight,
    variantImage: variant.variantImage,
    store: {
      id: storeId._id,
      url: storeId.url,
      name: storeId.name,
      logo: storeId.logo,
      followersCount: storeFollowersCount,
      isUserFollowingStore,
    },
    colors,
    sizes,
    specs: {
      product: product.specs,
      variant: variant.specs,
    },
    questions,
    rating: product.rating,
    reviews,
    reviewsStatistics: ratingStatistics,
    shippingDetails,
    relatedProducts: [],
    variantInfo: product.variantsInfo,
  };
};

/**
 * Calculate shipping fee based on the shipping method.
 * 
 * @param {string} shippingFeeMethod - The shipping fee method ('ITEM', 'WEIGHT', 'FIXED')
 * @param {object} details - The shipping details object containing fee info.
 * @param {number} quantity - The quantity of the product being ordered.
 * @param {number} weight - The weight of the product (used for 'WEIGHT' shipping method).
 * 
 * @returns {number} - The calculated shipping fee.
 */
export const calculateShippingFee = (shippingFeeMethod, details, quantity, weight) => {
  let shippingFee = 0;

  if (shippingFeeMethod === "ITEM") {
    shippingFee = quantity === 1 ? details.shippingFee : details.shippingFee + details.extraShippingFee * (quantity - 1);
  } else if (shippingFeeMethod === "WEIGHT") {
    shippingFee = details.shippingFee * weight * quantity;
  } else if (shippingFeeMethod === "FIXED") {
    shippingFee = details.shippingFee;
  }

  return shippingFee;
};

