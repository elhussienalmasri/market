import mongoose from "mongoose";

export const OrderStatus = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "OutforDelivery",
  "Delivered",
  "Cancelled",
  "Failed",
  "Refunded",
  "Returned",
  "PartiallyShipped",
  "OnHold",
];

export const PaymentStatus = [
  "Pending",
  "Paid",
  "Failed",
  "Declined",
  "Cancelled",
  "Refunded",
  "PartiallyRefunded",
  "Chargeback",
];

const OrderSchema = new mongoose.Schema(
  {
    shippingFees: { type: Number, required: true },
    subTotal: { type: Number, required: true },
    total: { type: Number, required: true },

    // References to OrderGroups (one-to-many)
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderGroup",
      },
    ],

    orderStatus: {
      type: String,
      enum: OrderStatus,
      default: "Pending",
    },

    paymentStatus: {
      type: String,
      enum: PaymentStatus,
      default: "Pending",
    },

    // References
    shippingAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShippingAddress",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const OrderGroupSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: OrderStatus,
      default: "Pending",
    },

    // References to OrderItem (one-to-many)
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
      },
    ],

    shippingService: { type: String, required: true },
    shippingDeliveryMin: { type: Number, required: true },
    shippingDeliveryMax: { type: Number, required: true },

    shippingFees: { type: Number, required: true },
    subTotal: { type: Number, required: true },
    total: { type: Number, required: true },

    // References
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    variantId: { type: String, required: true },
    sizeId: { type: String, required: true },

    productSlug: { type: String, required: true },
    variantSlug: { type: String, required: true },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    size: { type: String, required: true },

    quantity: { type: Number, default: 1 },
    shippingFee: { type: Number, default: 0 },
    price: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    
    orderGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderGroup",
      required: true,
      index: true, // corresponds to @@index([orderGroupId])
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", OrderSchema);
export const OrderGroup = mongoose.model("OrderGroup", OrderGroupSchema);
export const OrderItem = mongoose.model("OrderItem", OrderItemSchema);