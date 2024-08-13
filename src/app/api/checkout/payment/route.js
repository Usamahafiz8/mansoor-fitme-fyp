import dbConnect from "@/utils/dbConnect";
import Cart from "@/app/models/Cart";
import stripe from "stripe";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const stripeClient = stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

// Middleware for token verification
async function verifyAuthorization(req) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token and return the decoded payload
    return jwt.verify(token, process.env.NEXT_PUBLIC_SECRET);
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
}

export async function POST(req) {
  await dbConnect(); // Ensure database connection

  try {
    // Find the user's cart
    
    const {products} = await req.json()
    // Calculate the total cart value
    let cartTotal = 0;
    for (let product of products) {
      cartTotal += product.quantity * product.price;
    }

    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(cartTotal * 100), // amount in cents
      currency: "inr",
    });

    // Return the payment intent and final order details
    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        finalOrder: {
          products:products,
          amount: cartTotal,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Error processing payment:", err);
    return new Response(
      JSON.stringify({
        message: "Unexpected error occurred",
        error: err.message,
      }),
      {
        status: 500,
      }
    );
  }
}
