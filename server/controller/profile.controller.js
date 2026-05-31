import { subMonths, subYears } from "date-fns";
import { PaymentDetails } from "../models/order.model.js";
import { Review } from "../models/product.model.js";
import Wishlist from "../models/wishlist.model.js";
import { Store } from "../models/store.model.js";

export const getUserPayments = async (req, res) => {
  try {
    // Authenticated user
    const { userId } = req.auth;
    // Check authentication
    if (!userId) {
      return res.status(401).json({
        message: "Unauthenticated",
      });
    }

    // Query params
    const {
      filter = "",
      period = "",
      search = "",
      page = "1",
      pageSize = "10",
    } = req.query;

    // Pagination
    const pageNumber = Math.max(1, Number(page));
    const limit = Math.max(1, Number(pageSize));

    const skip = (pageNumber - 1) * limit;

    // Base query
    const query = {
      userId,
    };

    // Payment method filters
    if (filter === "paypal") {
      query.paymentMethod = "Paypal";
    }

    if (filter === "credit-card") {
      query.paymentMethod = "Stripe";
    }

    // Date filters
    const now = new Date();

    if (period === "last-6-months") {
      query.createdAt = {
        $gte: subMonths(now, 6),
      };
    }

    if (period === "last-1-year") {
      query.createdAt = {
        $gte: subYears(now, 1),
      };
    }

    if (period === "last-2-years") {
      query.createdAt = {
        $gte: subYears(now, 2),
      };
    }

    // Search filter
    if (search.trim()) {
      query.$or = [
        {
          _id: {
            $regex: search,
            $options: "i",
          },
        },
        {
          paymentIntentId: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Fetch payments
    const payments = await PaymentDetails.find(query)
      .populate("order")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Count total
    const totalCount = await PaymentDetails.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Response
    return res.status(200).json({
      payments,
      totalPages,
      currentPage: pageNumber,
      pageSize: limit,
      totalCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    // Authenticated user
    const { userId } = req.auth;

    // Check auth
    if (!userId) {
      return res.status(401).json({
        message: "Unauthenticated",
      });
    }

    // Query params
    const {
      filter = "",
      period = "",
      search = "",
      page = "1",
      pageSize = "10",
    } = req.query;

    // Pagination
    const pageNumber = Math.max(1, Number(page));

    const limit = Math.max(1, Number(pageSize));

    const skip = (pageNumber - 1) * limit;

    // Base query
    const query = {
      userId,
    };

    // Rating filter
    if (filter) {
      query.rating = Number(filter);
    }

    // Period filters
    const now = new Date();

    if (period === "last-6-months") {
      query.createdAt = {
        $gte: subMonths(now, 6),
      };
    }

    if (period === "last-1-year") {
      query.createdAt = {
        $gte: subYears(now, 1),
      };
    }

    if (period === "last-2-years") {
      query.createdAt = {
        $gte: subYears(now, 2),
      };
    }

    // Search filter
    if (search.trim()) {
      query.review = {
        $regex: search,
        $options: "i",
      };
    }

    // Fetch reviews
    const reviews = await Review.find(query)
      .populate("user")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Total count
    const totalCount = await Review.countDocuments(query);

    // Total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Response
    return res.status(200).json({
      reviews,
      totalPages,
      currentPage: pageNumber,
      pageSize: limit,
      totalCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthenticated",
      });
    }

    // Query params
    const { page = "1", pageSize = "10" } = req.query;

    const pageNumber = Math.max(1, Number(page));

    const limit = Math.max(1, Number(pageSize));

    const skip = (pageNumber - 1) * limit;

    // Fetch wishlist
    const wishlist = await Wishlist.find({
      userId,
    })
      .populate({
        path: "product",
        select: "id slug name rating sales variants",
      })
      .skip(skip)
      .limit(limit);

    // Transform result
    const formattedWishlist = wishlist
      .map((item) => {
        if (!item.product || !item.product.variants?.length) {
          return null;
        }

        return {
          id: item.product._id,
          slug: item.product.slug,
          name: item.product.name,
          rating: item.product.rating,
          sales: item.product.sales,

          variants: [
            {
              variantId: item.product.variants[0]._id,
              variantSlug: item.product.variants[0].slug,
              variantName: item.product.variants[0].variantName,
              images: item.product.variants[0].images,
              sizes: item.product.variants[0].sizes,
            },
          ],

          variantImages: [],
        };
      })
      .filter(Boolean);

    // Count total
    const totalCount = await Wishlist.countDocuments({
      userId,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      wishlist: formattedWishlist,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getUserFollowedStores = async (req, res) => {
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthenticated",
      });
    }

    const { page = "1", pageSize = "10" } = req.query;

    const pageNumber = Math.max(1, Number(page));

    const limit = Math.max(1, Number(pageSize));

    const skip = (pageNumber - 1) * limit;

    // Get followed stores
    const followedStores = await Store.find({
      followers: userId,
    })
      .select("id url name logo followers")
      .skip(skip)
      .limit(limit);

    // Count total
    const totalCount = await Store.countDocuments({
      followers: userId,
    });

    const totalPages = Math.ceil(totalCount / limit);

    // Transform response
    const stores = followedStores.map((store) => ({
      id: store._id,
      url: store.url,
      name: store.name,
      logo: store.logo,
      followersCount: store.followers.length,
      isUserFollowingStore: true,
    }));

    return res.status(200).json({
      stores,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
