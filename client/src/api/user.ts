import { axiosInstance } from "@/lib/axios";
// --------------------------------------------------
// FOLLOW STORE
// --------------------------------------------------
export const followStore = async (storeId: string, token: string) => {
  try {
    const response = await axiosInstance.post(
      "/user/follow-store",
      { storeId },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return response.data;
  } catch (error) {
    console.error(error, "error following store");
    throw error;
  }
};

// --------------------------------------------------
// CART: SAVE USER CART
// --------------------------------------------------
export const saveUserCart = async (cartProducts: any, token: string) => {
  try {
    const response = await axiosInstance.post(
      "/user/cart/save",
      { cartProducts },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return response.data;
  } catch (error) {
    console.error(error, "error saving user cart");
    throw error;
  }
};

// --------------------------------------------------
// CART: EMPTY USER CART
// --------------------------------------------------
export const emptyUserCart = async (token: string) => {
  try {
    const response = await axiosInstance.delete("/user/cart/empty", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error(error, "error emptying user cart");
    throw error;
  }
};

// --------------------------------------------------
// SHIPPING: GET ALL ADDRESSES
// --------------------------------------------------
export const getUserShippingAddresses = async (token: string) => {
  try {
    const response = await axiosInstance.get("/user/shipping-addresses", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error(error, "error fetching shipping addresses");
    throw error;
  }
};

// --------------------------------------------------
// SHIPPING: UPSERT ADDRESS
// --------------------------------------------------
export const upsertShippingAddress = async (
  addressData: any,
  token: string,
) => {
  try {
    const response = await axiosInstance.post(
      "/user/shipping-addresses/upsert",
      addressData,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return response.data;
  } catch (error) {
    console.error(error, "error upserting shipping address");
    throw error;
  }
};

// --------------------------------------------------
// PLACE ORDER
// --------------------------------------------------
export const placeOrder = async (orderData: any, token: string) => {
  try {
    const response = await axiosInstance.post("/user/order/place", orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error(error, "error placing order");
    throw error;
  }
};

// --------------------------------------------------
// GET USER CART
// --------------------------------------------------
export const getUserCart = async (token: string) => {
  try {
    const response = await axiosInstance.get("/user/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error(error, "error fetching cart");
    throw error;
  }
};

// --------------------------------------------------
// GET COUNTRIES
// --------------------------------------------------
export const getCountries = async (token?: string) => {
  try {
    const response = await axiosInstance.get("/user/countries", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return response.data;
  } catch (error) {
    console.error(error, "error fetching countries");
    throw error;
  }
};

export const updateCartWithLatest = async (
  cartProducts: any[],
  token?: string,
) => {
  try {
    const res = await axiosInstance.post(
      "/user/cart/update",
      cartProducts,

      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return res.data;
  } catch (error) {
    console.error("Cart update error:", error);
    throw error;
  }
};

export const addToWishlist = async ({
  productId,
  variantId,
  sizeId,
  token,
}: {
  productId: string;
  variantId: string;
  sizeId?: string;
  token?: string;
}) => {
  try {
    const response = await axiosInstance.post(
      "/user/wishlist",
      {
        productId: productId,
        variantId: variantId,
        sizeId: sizeId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.wishlist;
  } catch (error) {
    console.error("Wishlist API error:", error);
    throw error;
  }
};

export const updateCheckout = async ({
  cartProducts,
  country,
}: {
  cartProducts: any[];
  country: any;
}) => {
  try {
    const response = await axiosInstance.post("/user/checkout/update", {
      cartProducts,
      country,
    });

    return response.data;
  } catch (error) {
    console.error("Checkout API error:", error);
    throw error;
  }
};
