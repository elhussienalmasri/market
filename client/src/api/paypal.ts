"use server";

import { currentUser } from "@clerk/nextjs/server";
import { axiosInstance } from "@/lib/axios";

// Function: createPayPalPayment
// Description: Creates a PayPal payment and return payment details.
// Permission Level: User only
// Parameters:
//   - orderId: The ID of the order to process payment for.
// Returns: Details of the created payment from paypal.
export const createPayPalPayment = async (orderId: string) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthenticated.");

    const order = await axiosInstance.get(`/orders/${orderId}`);

    if (!order) throw new Error("Order not found.");

    // call the PayPal API to create a payment
    const response = await fetch(
      "https://api.sandbox.paypal.com/v2/checkout/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
          ).toString("base64")}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: order.total.toFixed(2).toString(),
              },
            },
          ],
        }),
      },
    );
    const paymentData = await response.json();
    return paymentData;
  } catch (error) {
    throw error;
  }
};

// Function: capturePayPalPayment
// Description: Captures a PayPal payment and updates the order status in the database.
// Permission Level: User only
// Parameters:
//   - orderId: The ID of the order to update.
//   - paymentId: The PayPal payment ID to capture.
// Returns: Updated order details.

export const capturePayPalPayment = async (
  orderId: string,
  paymentId: string,
) => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthenticated.");

  // Capture the payment using PayPal API
  const captureResponse = await fetch(
    `https://api.sandbox.paypal.com/v2/checkout/orders/${paymentId}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
        ).toString("base64")}`,
      },
    },
  );

  const captureData = await captureResponse.json();

  // Check if capture was successful
  if (captureData.status !== "COMPLETED") {
    await axiosInstance.put(`/orders/${orderId}/payment-status`, {
      paymentStatus: "Failed",
    });
    throw new Error("Payment capture failed.");
  }

  // Upsert payment details record
  const newPaymentDetails = await axiosInstance.post(
    "/payment/upsert-payment-details",
    {
      orderId,
      paymentId,
      captureData,
      user,
      paymentMethod: "Paypal",
    },
  );

  // Update the order with the new payment details
  const updatedOrder = async () => {
    try {
      const { data } = await axiosInstance.put(
        `/orders/capture-payment/${orderId}`,
        {
          captureData: {
            status: "COMPLETED",
          },

          newPaymentDetails: {
            _id: newPaymentDetails.id,
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  return updatedOrder;
};
