import Coupon from "../models/coupon.model.js";
import { Store } from "../models/store.model.js";
import { Cart } from "../models/cart.model.js";

/**
 * Upsert Coupon
 * Create or update a coupon
 * Seller only
 */
export const upsertCoupon = async (req, res) => {
  try {
    const { userId } = req.auth;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthenticated.",
      });
    }

    if (user.role !== "SELLER") {
      return res.status(403).json({
        message: "Unauthorized Access: Seller Privileges Required for Entry.",
      });
    }

    const { coupon, storeUrl } = req.body;

    if (!coupon) {
      return res.status(400).json({
        message: "Please provide coupon data.",
      });
    }

    if (!storeUrl) {
      return res.status(400).json({
        message: "Store URL is required.",
      });
    }

    // Find store
    const store = await Store.findOne({
      url: storeUrl,
    });

    if (!store) {
      return res.status(404).json({
        message: "Store not found.",
      });
    }

    // Check duplicate coupon code
    const existingCoupon = await Coupon.findOne({
      code: coupon.code,
      storeId: store._id,
      _id: { $ne: coupon._id },
    });

    if (existingCoupon) {
      return res.status(400).json({
        message: "A coupon with the same code already exists for this store.",
      });
    }

    let couponDetails;

    // Update
    if (coupon._id) {
      couponDetails = await Coupon.findByIdAndUpdate(
        coupon._id,
        {
          ...coupon,
          storeId: store._id,
        },
        {
          new: true,
          runValidators: true,
        },
      );
    }

    // Create
    else {
      couponDetails = await Coupon.create({
        ...coupon,
        storeId: store._id,
      });
    }

    return res.status(200).json(couponDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Get all coupons for a store
 * Seller only
 */
export const getStoreCoupons = async (req, res) => {
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthenticated.",
      });
    }

    if (user.role !== "SELLER") {
      return res.status(403).json({
        message: "Unauthorized Access: Seller Privileges Required for Entry.",
      });
    }

    const { storeUrl } = req.params;

    if (!storeUrl) {
      return res.status(400).json({
        message: "Store URL is required.",
      });
    }

    const store = await Store.findOne({
      url: storeUrl,
    });

    if (!store) {
      return res.status(404).json({
        message: "Store not found.",
      });
    }

    if (store.userId.toString() !== userId) {
      return res.status(403).json({
        message: "Unauthorized Access: You do not own this store.",
      });
    }

    const coupons = await Coupon.find({
      storeId: store._id,
    });

    return res.status(200).json(coupons);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Get single coupon
 * Public
 */
export const getCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;

    if (!couponId) {
      return res.status(400).json({
        message: "Please provide coupon ID.",
      });
    }

    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found.",
      });
    }

    return res.status(200).json(coupon);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Delete Coupon
 * Seller only
 */
export const deleteCoupon = async (req, res) => {
  const { couponId, storeUrl } = req.params;
  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthenticated.",
      });
    }

    if (user.role !== "SELLER") {
      return res.status(403).json({
        message: "Unauthorized Access: Seller Privileges Required.",
      });
    }

    const { couponId, storeUrl } = req.params;

    if (!couponId || !storeUrl) {
      return res.status(400).json({
        message: "Please provide coupon ID and store URL.",
      });
    }

    const store = await Store.findOne({
      url: storeUrl,
    });

    if (!store) {
      return res.status(404).json({
        message: "Store not found.",
      });
    }

    if (store.userId.toString() !== userId) {
      return res.status(403).json({
        message: "You are not the owner of this store.",
      });
    }

    const deletedCoupon = await Coupon.findOneAndDelete({
      _id: couponId,
      storeId: store._id,
    });

    if (!deletedCoupon) {
      return res.status(404).json({
        message: "Coupon not found.",
      });
    }

    return res.status(200).json({
      message: "Coupon deleted successfully.",
      deletedCoupon,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * Apply Coupon
 */
export const applyCoupon = async (req, res) => {
  try {
    const { couponCode, cartId } = req.body;

    // Find coupon
    const coupon = await Coupon.findOne({
      code: couponCode,
    }).populate("storeId");

    if (!coupon) {
      return res.status(400).json({
        message: "Invalid coupon code.",
      });
    }

    // Validate dates
    const currentDate = new Date();

    if (
      currentDate < new Date(coupon.startDate) ||
      currentDate > new Date(coupon.endDate)
    ) {
      return res.status(400).json({
        message: "Coupon is expired or not yet active.",
      });
    }

    // Find cart
    const cart = await Cart.findById(cartId)
      .populate("cartItems")
      .populate("couponId");

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found.",
      });
    }

    // Prevent multiple coupons
    if (cart.couponId) {
      return res.status(400).json({
        message: "A coupon is already applied to this cart.",
      });
    }

    // Filter store items
    const storeItems = cart.cartItems.filter(
      (item) => item.storeId.toString() === coupon.storeId._id.toString(),
    );

    if (storeItems.length === 0) {
      return res.status(400).json({
        message:
          "No items in the cart belong to the store associated with this coupon.",
      });
    }

    // Calculate totals
    const storeSubTotal = storeItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    const storeShippingTotal = storeItems.reduce(
      (acc, item) => acc + item.shippingFee,
      0,
    );

    const storeTotal = storeSubTotal + storeShippingTotal;

    const discountedAmount = (storeTotal * coupon.discount) / 100;

    const newTotal = cart.total - discountedAmount;

    // Update cart
    cart.couponId = coupon._id;
    cart.total = newTotal;

    await cart.save();

    const updatedCart = await Cart.findById(cartId)
      .populate("cartItems")
      .populate({
        path: "couponId",
        populate: {
          path: "storeId",
        },
      });

    return res.status(200).json({
      message: `Coupon applied successfully. Discount: -$${discountedAmount.toFixed(
        2,
      )} applied to items from ${coupon.storeId.name}.`,
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error applying coupon:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
