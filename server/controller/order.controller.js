import { Order, PaymentDetails } from "../models/order.model.js";
import { subMonths, subYears } from "date-fns";

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    // Allowed statuses
    const validStatuses = ["Pending", "Paid", "Failed"];

    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true },
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Payment status updated to ${paymentStatus}`,
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const capturePayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const captureData = req.body.captureData;
    const newPaymentDetails = req.body.newPaymentDetails;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: captureData.status === "COMPLETED" ? "Paid" : "Failed",

        paymentMethod: "Paypal",

        paymentDetails: newPaymentDetails._id,
      },
      {
        new: true,
      },
    ).populate("paymentDetails");

    return res.status(200).json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const upsertPaymentDetails = async (req, res) => {
  try {
    const { orderId, paymentId, captureData, user, paymentMethod } = req.body;

    const newPaymentDetails = await PaymentDetails.findOneAndUpdate(
      { orderId },

      {
        paymentIntentId: paymentId,

        status:
          captureData.status === "COMPLETED" ? "Completed" : captureData.status,

        amount: Number(
          captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount
            ?.value || 0,
        ),

        currency:
          captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount
            ?.currency_code,

        paymentMethod, // dynamic now

        userId: user._id,

        orderId,
      },

      {
        upsert: true,
        new: true,
      },
    );

    return res.status(200).json({
      success: true,
      newPaymentDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { userId } = req.auth;
    const orderId = req.params.orderId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthenticated." });
    }

    const order = await Order.findOne({
      _id: orderId,
      userId,
    })
      .populate({
        path: "groups.store groups.coupon groups.items",
      })
      .populate({
        path: "shippingAddressId",
        populate: ["countryId"],
      })
      .populate("paymentDetails");

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Sort groups by total descending
    order.groups.sort((a, b) => (b.total || 0) - (a.total || 0));

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const {
      filter = "",
      period = "",
      search = "",
      page = 1,
      pageSize = 10,
    } = req.query;

    // Current user
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthenticated",
      });
    }

    // Pagination
    const pageNumber = Number(page);
    const limit = Number(pageSize);

    const skip = (pageNumber - 1) * limit;

    // Base query
    const query = {
      userId: userId,
    };

    // Filter by payment/order status
    if (filter === "unpaid") {
      query.paymentStatus = "Pending";
    }

    if (filter === "toShip") {
      query.orderStatus = "Processing";
    }

    if (filter === "shipped") {
      query.orderStatus = "Shipped";
    }

    if (filter === "delivered") {
      query.orderStatus = "Delivered";
    }

    // Period filter
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
          "groups.store.name": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "groups.items.name": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Fetch orders
    const orders = await Order.find(query)
      .populate("shippingAddressId")
      .populate("groups.store")
      .populate("groups.items")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Total count
    const totalCount = await Order.countDocuments(query);

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      orders,
      totalPages,
      currentPage: pageNumber,
      pageSize: limit,
      totalCount,
    });
  } catch (error) {
    console.error("GET_USER_ORDERS_ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
