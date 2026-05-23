import { Product } from "../models/product.model.js";
import { getShippingDetails } from "../services/product.service.js";

/**
 * Validates cart products and enriches them with latest DB data.
 */
export const updateCartWithLatest = async (cartProducts, userCountry) => {
  const validatedCartItems = await Promise.all(
    cartProducts.map(async (cartProduct) => {
      const { productId, variantId, sizeId, quantity } = cartProduct;

      const product = await Product.findById(productId)
        .populate("store")
        .populate({
          path: "freeShipping",
          populate: { path: "eligibaleCountries" },
        });

      if (!product) {
        throw new Error(`Invalid product ${productId}`);
      }

      const variant = product.variants.find(
        (v) => v._id.toString() === variantId,
      );

      if (!variant) {
        throw new Error(`Invalid variant ${variantId}`);
      }

      const size = variant.sizes.find((s) => s._id.toString() === sizeId);

      if (!size) {
        throw new Error(`Invalid size ${sizeId}`);
      }

      // Shipping calculation
      let details = {
        shippingService: product.store.defaultShippingService,
        shippingFee: 0,
        extraShippingFee: 0,
        isFreeShipping: false,
        deliveryTimeMin: 0,
        deliveryTimeMax: 0,
      };

      if (userCountry) {
        const temp = await getShippingDetails(
          product.shippingFeeMethod,
          userCountry,
          product.store,
          product.freeShipping,
        );

        if (typeof temp !== "boolean") {
          details = temp;
        }
      }

      const price = size.discount
        ? size.price - (size.price * size.discount) / 100
        : size.price;

      const validatedQty = Math.min(quantity, size.quantity);

      return {
        productId,
        variantId,
        sizeId,
        productSlug: product.slug,
        variantSlug: variant.slug,
        name: product.name,
        variantName: variant.variantName,
        sku: variant.sku,
        image: variant.images?.[0]?.url,
        stock: size.quantity,
        weight: variant.weight,
        quantity: validatedQty,
        price,
        shippingService: details.shippingService,
        shippingFee: details.shippingFee,
        extraShippingFee: details.extraShippingFee,
        deliveryTimeMin: details.deliveryTimeMin,
        deliveryTimeMax: details.deliveryTimeMax,
        isFreeShipping: details.isFreeShipping,
      };
    }),
  );

  return validatedCartItems;
};
