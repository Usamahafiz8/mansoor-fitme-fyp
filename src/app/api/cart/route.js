import dbConnect from "@/utils/dbConnect";
import Cart from "@/app/models/Cart";
import jwt, { decode } from "jsonwebtoken";
import { NextResponse } from "next/server";

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

  // Verify user token
  const decoded = await verifyAuthorization(req);
  if (!decoded) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    // Parse the request body
    const { products } = await req.json();

    // Create a new cart
    const newCart = await Cart.create({
      userID: decoded.userId,
      products,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Cart created successfully",
        data: newCart,
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating cart:", err);
    return new Response(
      JSON.stringify({
        message: "Unexpected error occurred",
        error: err.message,
      }),
      { status: 500 }
    );
  }
}

export async function GET(req) {
  await dbConnect(); // Ensure database connection

  // Authorization check
  const decoded = await verifyAuthorization(req);
  if (!decoded) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    // Find the cart by user ID
    const cart = await Cart.findOne({ userID: decoded.userId });

    if (!cart) {
      return new Response(JSON.stringify({ message: "Cart not found" }), {
        status: 404,
      });
    }

    // Populate the cart with product details
    await cart.populate({
      path: "products.productID",
      select: ["name", "price", "color",'size'],
    });
     const totalPrice = cart.products.reduce((total, item) => {
       return total + item.productID.price * item.quantity;
     }, 0);

    cart.total = totalPrice;

    return new Response(
      JSON.stringify({
        success: true,
        data: cart,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Error fetching cart:", err);
    return new Response(
      JSON.stringify({ message: "Unexpected error occurred" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}