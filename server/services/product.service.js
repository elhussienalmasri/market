import { Product, ProductVariant, Review } from "../models/product.model.js";
import { Store } from "../models/store.model.js";
import { Country, ShippingRate } from "../models/country.model.js"


export const retrieveProductDetails = async (productSlug, variantSlug) => {
  // Get product with related documents
  const product = await Product.findOne({ slug: productSlug })
    .populate("categoryId")
    .populate("subCategoryId")
    .populate("offerTag")
    .populate("storeId")
    .populate("specs")
    .populate("questions")
    .populate({
      path: "reviews",
      options: { limit: 4 },
      populate: [
        { path: "images" },
        { path: "user" },
      ],
    })
    .populate({
      path: "freeShipping",
      populate: { path: "eligibaleCountries" }
    })
    .populate({
      path: "variants",
      match: { slug: variantSlug },
      populate: [
        { path: "images" },
        { path: "colors" },
        { path: "sizes" },
        { path: "specs" },
      ],
    });

  if (!product) return null;

  // Get all variants info
  const variantsInfo = await ProductVariant.find({ productId: product._id })
    .populate("images")
    .populate("sizes")
    .populate("colors")
    .populate({
      path: "productId",
      select: "slug"
    });

  return {
    ...product.toObject(),
    variantsInfo: variantsInfo.map((variant) => ({
      variantName: variant.variantName,
      variantSlug: variant.slug,
      variantImage: variant.variantImage,
      variantUrl: `/product/${productSlug}/${variant.slug}`,
      images: variant.images,
      sizes: variant.sizes,
      colors: variant.colors,
    })),
  };
};

export const getStoreFollowersCount = async (storeId) => {
  // Option 1: If followers are stored as an array in the store document
  const store = await Store.findById(storeId).select("followers");
  return store?.followers?.length || 0;

  // Option 2: If followers are in a separate collection (e.g., Follower model)
  // return await Follower.countDocuments({ store: storeId });
};

export const checkIfUserFollowingStore = async (storeId, userId) => {

  if (!userId) return false;

  // Fetch store with followers
  const store = await Store.findById(storeId).select("followers");

  if (!store) return false;

  // Check if userId exists in the followers array
  const isFollowing = store.followers.some(
    (followerId) => String(followerId) === String(userId)
  );

  return isFollowing;
};

export const getRatingStatistics = async (productId) => {
  // 1. Aggregate ratings count per rating value
  const ratingStats = await Review.aggregate([
    { $match: { product: productId } }, // Filter by product
    {
      $group: {
        _id: "$rating",           // Group by rating
        count: { $sum: 1 },       // Count reviews per rating
      },
    },
  ]);

  // Total number of reviews
  const totalReviews = ratingStats.reduce((sum, stat) => sum + stat.count, 0);

  // Initialize counts for 1-5 stars
  const ratingCounts = Array(5).fill(0);

  ratingStats.forEach((stat) => {
    const rating = Math.floor(stat._id); // Ensure integer
    if (rating >= 1 && rating <= 5) {
      ratingCounts[rating - 1] = stat.count;
    }
  });

  // Reviews with images
  const reviewsWithImagesCount = await Review.countDocuments({
    product: productId,
    images: { $exists: true, $not: { $size: 0 } }, // images array exists & not empty
  });

  // Build response
  return {
    ratingStatistics: ratingCounts.map((count, index) => ({
      rating: index + 1,
      numReviews: count,
      percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
    })),
    reviewsWithImagesCount,
    totalReviews,
  };
};

export const getShippingDetails = async (
  shippingFeeMethod,
  userCountry,
  store,
  freeShipping
) => {
  let shippingDetails = {
    shippingFeeMethod,
    shippingService: "",
    shippingFee: 0,
    extraShippingFee: 0,
    deliveryTimeMin: 0,
    deliveryTimeMax: 0,
    returnPolicy: "",
    countryCode: userCountry.code,
    countryName: userCountry.name,
    city: userCountry.city,
    isFreeShipping: false,
  };

  // 1. Find country (Mongoose)
  const country = await Country.findOne({
    name: userCountry.name,
    code: userCountry.code,
  });

  if (!country) return false;

  // 2. Find shipping rate for this store + country
  const shippingRate = await ShippingRate.findOne({
    countryId: country._id,
    storeId: store._id,
  });

  // 3. Extract values (rate fallback -> store defaults)
  const returnPolicy = shippingRate?.returnPolicy || store.returnPolicy;
  const shippingService =
    shippingRate?.shippingService || store.defaultShippingService;

  const shippingFeePerItem =
    shippingRate?.shippingFeePerItem || store.defaultShippingFeePerItem;

  const shippingFeeForAdditionalItem =
    shippingRate?.shippingFeeForAdditionalItem ||
    store.defaultShippingFeeForAdditionalItem;

  const shippingFeePerKg =
    shippingRate?.shippingFeePerKg || store.defaultShippingFeePerKg;

  const shippingFeeFixed =
    shippingRate?.shippingFeeFixed || store.defaultShippingFeeFixed;

  const deliveryTimeMin =
    shippingRate?.deliveryTimeMin || store.defaultDeliveryTimeMin;

  const deliveryTimeMax =
    shippingRate?.deliveryTimeMax || store.defaultDeliveryTimeMax;

  // 4. Check free shipping
  if (freeShipping) {
    const eligibleCountries = freeShipping.eligibaleCountries;

    const isEligible = eligibleCountries.some(
      (c) => String(c.countryId) === String(country._id)
    );

    if (isEligible) {
      shippingDetails.isFreeShipping = true;
    }
  }

  // 5. Build final shipping details structure
  shippingDetails = {
    shippingFeeMethod,
    shippingService,
    shippingFee: 0,
    extraShippingFee: 0,
    deliveryTimeMin,
    deliveryTimeMax,
    returnPolicy,
    countryCode: userCountry.code,
    countryName: userCountry.name,
    city: userCountry.city,
    isFreeShipping: shippingDetails.isFreeShipping,
  };

  const { isFreeShipping } = shippingDetails;

  // 6. Calculate fee type
  switch (shippingFeeMethod) {
    case "ITEM":
      shippingDetails.shippingFee = isFreeShipping ? 0 : shippingFeePerItem;
      shippingDetails.extraShippingFee = isFreeShipping
        ? 0
        : shippingFeeForAdditionalItem;
      break;

    case "WEIGHT":
      shippingDetails.shippingFee = isFreeShipping ? 0 : shippingFeePerKg;
      break;

    case "FIXED":
      shippingDetails.shippingFee = isFreeShipping ? 0 : shippingFeeFixed;
      break;

    default:
      break;
  }

  return shippingDetails;
};

export const getDeliveryDetailsForStoreByCountry = async (storeId, countryId) => {
  // Find shipping rate for this store & country
  const shippingRate = await ShippingRate.findOne({
    store: storeId,
    country: countryId,
  }).lean();

  let storeDetails;
  if (!shippingRate) {
    // Fall back to store default shipping info
    storeDetails = await Store.findById(storeId)
      .select("defaultShippingService defaultDeliveryTimeMin defaultDeliveryTimeMax")
      .lean();
  }

  const shippingService = shippingRate
    ? shippingRate.shippingService
    : storeDetails?.defaultShippingService;

  const deliveryTimeMin = shippingRate
    ? shippingRate.deliveryTimeMin
    : storeDetails?.defaultDeliveryTimeMin;

  const deliveryTimeMax = shippingRate
    ? shippingRate.deliveryTimeMax
    : storeDetails?.defaultDeliveryTimeMax;

  return {
    shippingService,
    deliveryTimeMin,
    deliveryTimeMax,
  };
};