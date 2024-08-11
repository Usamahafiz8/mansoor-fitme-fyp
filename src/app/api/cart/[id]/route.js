import dbConnect from "@/utils/dbConnect";
import Cart from "@/app/models/Cart";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Middleware for authorization (like verifyAuthorization)
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

export async function GET(req, { params }) {
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
    const cart = await Cart.findOne({ userID: params.id });

    if (!cart) {
      return new Response(JSON.stringify({ message: "Cart not found" }), {
        status: 404,
      });
    }

    // Populate the cart with product details
    await cart.populate({
      path: "products.productID",
      select: ["name", "price", "color", "size"],
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

export async function PUT(req, { params }) {
  await dbConnect(); // Ensure database connection

  // Authorization check
  const decoded = await verifyAuthorization(req);
  if (!decoded) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    // Parse the request body
    const { products } = await req.json();

    // Update the cart by pushing new products
    const updatedCart = await Cart.findOneAndUpdate(
      { userID: params.id },
      { $push: { products: { $each: products } } },
      { new: true }
    );

    if (!updatedCart) {
      return new Response(JSON.stringify({ message: "Cart not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Cart updated successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating cart:", err);
    return new Response(
      JSON.stringify({ message: "Unexpected error occurred" }),
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  await dbConnect(); // Ensure database connection

  // Authorization check
  const decoded = await verifyAuthorization(req);
  if (!decoded) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    // Parse the request body
    const { productID, quantity } = await req.json();
    const updatedCart = await Cart.updateOne(
      { userID: params.id },
      { $pull: { products: { productID } } }
    );

    return new Response(
      JSON.stringify({ success: true, message: "Cart patched successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error patching cart:", err);
    return new Response(
      JSON.stringify({ message: "Unexpected error occurred" }),
      { status: 500 }
    );
  }
}