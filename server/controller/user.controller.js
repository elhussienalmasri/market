import { Store } from "../models/store.model.js";
import { User } from "../models/user.model.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { ShippingAddress } from "../models/user.model.js";
import { Order, OrderGroup, OrderItem } from "../models/order.model.js";

import { getShippingDetails } from "../services/product.service.js";
import { calculateShippingFee } from "../utils/product.utils.js";
import { Country } from "../models/country.model.js"

export const followStoreController = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { userId } = req.auth;

    if (!userId) return res.status(401).json({ error: "Unauthenticated" });

    const following = await followStore(userId, storeId);

    res.status(200).json({ following });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @name followStore
 * @description - Toggle follow status for a store by the current user.
 *               - If the user is not following the store, it follows the store.
 *               - If the user is already following the store, it unfollows the store.
 * @access User
 * @param storeId - The ID of the store to be followed/unfollowed.
 * @returns {boolean} - Returns true if the user is now following the store, false if unfollowed.
 */
export const followStore = async (req, res) => {
  try {
    const { storeId } = req.body; // Assuming storeId is provided in the request body

    // Ensure the user is authenticated
    const { userId } = req.auth;

    const user = await User.findOne({ clerkId: req.auth.userId });

    if (!userId) return res.status(401).json({ error: "Unauthenticated." });

    // Check if the store exists
    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ error: "Store not found." });

    // Check if the user is already following the store
    const userFollowingStore = store.followers.some(follower => follower.toString() === user._id.toString());

    if (userFollowingStore) {
      // Unfollow the store
      store.followers = store.followers.filter(follower => follower.toString() !== user._id.toString());
      await store.save();
      return res.status(200).json({ following: false });
    } else {
      // Follow the store
      store.followers.push(user._id);
      await store.save();
      return res.status(200).json({ following: true });
    }
  } catch (error) {
    console.error("Error in toggling store follow status:", error);
    return res.status(500).json({ error: "Server error" });
  }
};


export const saveUserCart = async (req, res) => {
  try {
    const { cartProducts } = req.body;
    // Get current user
    const { userId } = req.auth;
    if (!userId) return res.status(401).json({ message: "Unauthenticated." });

    // Remove any existing cart
    await Cart.findOneAndDelete({ userId });

    // Validate products
    const validatedCartItems = await Promise.all(
      cartProducts.map(async (cartProduct) => {
        const { productId, variantId, sizeId, quantity } = cartProduct;

        // Fetch product with variants and sizes
        const product = await Product.findById(productId)
          .populate({
            path: "variants",
            match: { _id: variantId },
            populate: { path: "sizes", match: { _id: sizeId } },
          })
          .populate("store")
          .populate({
            path: "freeShipping.eligibaleCountries",
          });

        if (
          !product ||
          !product.variants.length ||
          !product.variants[0].sizes.length
        ) {
          throw new Error(
            `Invalid product, variant, or size combination for productId ${productId}, variantId ${variantId}, sizeId ${sizeId}`
          );
        }

        const variant = product.variants[0];
        const size = variant.sizes[0];

        const validQuantity = Math.min(quantity, size.quantity);

        const price = size.discount
          ? size.price - size.price * (size.discount / 100)
          : size.price;

        // Shipping calculation (assuming country is in req.cookies.userCountry)
        let shippingDetails = { shippingFee: 0, extraShippingFee: 0, isFreeShipping: false };
        const countryCookie = req.cookies.userCountry;
        if (countryCookie) {
          const country = JSON.parse(countryCookie);
          const tempDetails = await getShippingDetails(
            product.shippingFeeMethod,
            country,
            product.store,
            product.freeShipping
          );
          if (typeof tempDetails !== "boolean") shippingDetails = tempDetails;
        }

        let shippingFee = 0;
        switch (product.shippingFeeMethod) {
          case "ITEM":
            shippingFee =
              quantity === 1
                ? shippingDetails.shippingFee
                : shippingDetails.shippingFee +
                shippingDetails.extraShippingFee * (quantity - 1);
            break;
          case "WEIGHT":
            shippingFee = shippingDetails.shippingFee * variant.weight * quantity;
            break;
          case "FIXED":
            shippingFee = shippingDetails.shippingFee;
            break;
        }

        const totalPrice = price * validQuantity + shippingFee;

        return {
          productId,
          variantId,
          productSlug: product.slug,
          variantSlug: variant.slug,
          sizeId,
          storeId: product.store._id,
          sku: variant.sku,
          name: `${product.name} · ${variant.variantName}`,
          image: variant.images[0]?.url || "",
          size: size.size,
          quantity: validQuantity,
          price,
          shippingFee,
          totalPrice,
        };
      })
    );

    const subTotal = validatedCartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const shippingFees = validatedCartItems.reduce(
      (acc, item) => acc + item.shippingFee,
      0
    );

    const total = subTotal + shippingFees;

    // Save new cart
    const cart = new Cart({
      userId,
      cartItems: validatedCartItems,
      subTotal,
      shippingFees,
      total,
    });

    await cart.save();

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getUserShippingAddresses = async (req, res) => {
  try {
    const { userId } = req.auth;
    if (!userId) return res.status(401).json({ error: "Unauthenticated." });

    const shippingAddresses = await ShippingAddress.find({ userId: user._id })
      .populate("country");

    return res.json(shippingAddresses);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const upsertShippingAddress = async (req, res) => {
  try {
    const { userId } = req.auth;
    const address = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthenticated." });
    if (!address) return res.status(400).json({ error: "Please provide address data." });

    const { id, default: isDefault } = address;

    // If making this address default, set all others to default: false
    if (isDefault) {
      await ShippingAddress.updateMany(
        { userId: user._id, default: true },
        { default: false }
      );
    }

    // Upsert logic
    const upsertedAddress = await ShippingAddress.findOneAndUpdate(
      { _id: id },                     // match existing
      { ...address, userId: user._id }, // new values
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.json(upsertedAddress);

  } catch (error) {
    console.error("Error upserting shipping address:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, cartId } = req.body;

    const { userId } = req.auth;
    if (!userId) return res.status(401).json({ error: "Unauthenticated." });

    // Fetch user's cart with all items
    const cart = await Cart.findOne({ _id: cartId }).populate("cartItems");
    if (!cart) return res.status(404).json({ error: "Cart not found." });

    const cartItems = cart.cartItems;

    // Fetch and validate each cart item
    const validatedCartItems = await Promise.all(
      cartItems.map(async (cartItem) => {
        const { productId, variantId, sizeId, quantity } = cartItem;

        const product = await Product.findOne({ _id: productId }).populate({
          path: 'variants',
          match: { _id: variantId },
          populate: { path: 'sizes', match: { _id: sizeId } }
        });

        if (!product || !product.variants.length || !product.variants[0].sizes.length) {
          throw new Error(`Invalid product, variant, or size for productId ${productId}, variantId ${variantId}, sizeId ${sizeId}`);
        }

        const variant = product.variants[0];
        const size = variant.sizes[0];

        // Validate stock and price
        const validQuantity = Math.min(quantity, size.quantity);

        const price = size.discount
          ? size.price - size.price * (size.discount / 100)
          : size.price;

        // Fetch country and calculate shipping
        const country = await ShippingAddress.findById(shippingAddress.id).populate("country");
        if (!country) throw new Error("Failed to get shipping details.");

        const shippingDetails = await getShippingDetails(product.shippingFeeMethod, country, product.storeId, product.freeShipping);
        const shippingFee = calculateShippingFee(product.shippingFeeMethod, shippingDetails, quantity, variant.weight);

        const totalPrice = price * validQuantity + shippingFee;

        return {
          productId,
          variantId,
          productSlug: product.slug,
          variantSlug: variant.slug,
          sizeId,
          storeId: product.storeId,
          sku: variant.sku,
          name: `${product.name} · ${variant.variantName}`,
          image: variant.images[0].url,
          size: size.size,
          quantity: validQuantity,
          price,
          shippingFee,
          totalPrice,
        };
      })
    );

    // Group items by store
    const groupedItems = validatedCartItems.reduce((acc, item) => {
      if (!acc[item.storeId]) acc[item.storeId] = [];
      acc[item.storeId].push(item);
      return acc;
    }, {});

    // Create the order
    const order = await Order.create({
      userId,
      shippingAddressId: shippingAddress.id,
      orderStatus: "Pending",
      paymentStatus: "Pending",
    });

    let orderTotalPrice = 0;
    let orderShippingFee = 0;

    // Iterate over grouped items and create OrderGroups & OrderItems
    for (const [storeId, items] of Object.entries(groupedItems)) {
      const groupedTotalPrice = items.reduce((acc, item) => acc + item.totalPrice, 0);
      const groupShippingFees = items.reduce((acc, item) => acc + item.shippingFee, 0);

      const { shippingService, deliveryTimeMin, deliveryTimeMax } = await getDeliveryDetailsForStoreByCountry(storeId, shippingAddress.countryId);

      const orderGroup = await OrderGroup.create({
        orderId: order._id,
        storeId,
        status: "Pending",
        subTotal: groupedTotalPrice - groupShippingFees,
        shippingFees: groupShippingFees,
        total: groupedTotalPrice,
        shippingService: shippingService || "International Delivery",
        shippingDeliveryMin: deliveryTimeMin || 7,
        shippingDeliveryMax: deliveryTimeMax || 30,
      });

      // Create OrderItems
      for (const item of items) {
        await OrderItem.create({
          orderGroupId: orderGroup._id,
          productId: item.productId,
          variantId: item.variantId,
          sizeId: item.sizeId,
          productSlug: item.productSlug,
          variantSlug: item.variantSlug,
          sku: item.sku,
          name: item.name,
          image: item.image,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          shippingFee: item.shippingFee,
          totalPrice: item.totalPrice,
        });
      }

      // Update order totals
      orderTotalPrice += groupedTotalPrice;
      orderShippingFee += groupShippingFees;
    }

    // Update the main order with final totals
    await Order.findByIdAndUpdate(order._id, {
      subTotal: orderTotalPrice - orderShippingFee,
      shippingFees: orderShippingFee,
      total: orderTotalPrice,
    });

    // Optionally delete the cart
    // await Cart.findByIdAndDelete(cartId);

    return res.json({ orderId: order._id });

  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ error: "Server error" });
  }
};


export const emptyUserCart = async (req, res) => {
  try {
    // Ensure the user is authenticated
    const { userId } = req.auth;  
    if (!userId) return res.status(401).json({ error: "Unauthenticated." });

    // Delete the user's cart
    const result = await Cart.deleteOne({ userId }); 

    if (result.deletedCount > 0) {
      return res.status(200).json({ message: "Cart emptied successfully." });
    } else {
      return res.status(404).json({ error: "Cart not found." });
    }

  } catch (error) {
    console.error("Error emptying user cart:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getUserCart = async (req, res) => {
  try {
    const { userId } = req.auth;

    const cart = await Cart.findOne({ userId })
      .populate('cartItems')
      .exec();

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: cart
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const getCountries = async (req, res) => {
  try {
    const countries = await Country.find().sort({ name: -1 }); // -1 = desc, 1 = asc

    res.status(200).json({
      success: true,
      data: countries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};