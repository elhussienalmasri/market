"use server";

import { currentUser } from "@clerk/nextjs/server";
import { PaymentIntent } from "@stripe/stripe-js";
import Stripe from "stripe";
import { axiosInstance } from "@/lib/axios";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-11-20.acacia",
});

export const createStripePaymentIntent = async (orderId: string) => {
  try {
    const user = await currentUser();

    if (!user) throw new Error("Unauthenticated.");

    const order = await axiosInstance.get(`/orders/${orderId}`);

    if (!order) throw new Error("Order not found.");

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createStripePayment = async (
  orderId: string,
  paymentIntent: PaymentIntent,
) => {
  try {
    const user = await currentUser();

    if (!user) throw new Error("Unauthenticated.");

    // Fetch the order to get total price
    const order = await axiosInstance.get(`/orders/${orderId}`);

    if (!order) throw new Error("Order not found.");

    const updatedPaymentDetails = await axiosInstance.post(
      "/payment/upsert-payment-details",
      {
        orderId,
        paymentIntent: paymentIntent.id,
        user,
        paymentMethod: "Stripe",
      },
    );
    // Update the order with payment details
    const updatedOrder = async () => {
      try {
        const { data } = await axiosInstance.put(
          `/orders/capture-payment/${orderId}`,
          {
            captureData: {
              status: "COMPLETED",
            },

            newPaymentDetails: {
              _id: updatedPaymentDetails.id,
            },
          },
        );
        return data;
      } catch (error) {
        console.log(error);
      }
    };

    return updatedOrder;
  } catch (error) {
    throw error;
  }
};
