import dbConnect from "@/utils/dbConnect";
import Cart from "@/app/models/Cart";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Middleware for authorization
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

  // Authorization check
  const decoded = await verifyAuthorization(req);
  if (!decoded) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    // Clear the user's cart
    await Cart.updateOne(
      { userID: decoded.userId },
      { $set: { products: [] } }
    );

    return new Response(
      JSON.stringify({ success: true, message: "Cart cleared successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error clearing cart:", err);
    return new Response(
      JSON.stringify({ message: "Unexpected error occurred" }),
      { status: 500 }
    );
  }
}
