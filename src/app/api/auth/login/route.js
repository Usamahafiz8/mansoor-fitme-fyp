import dbConnect from "@/utils/dbConnect";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await dbConnect();

  try {
    const { email, password } = await req.json();
    console.log("Login attempt:", email);

    // Check if the user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return new Response(
        JSON.stringify({
          message: "User does not exist",
        }),
        {
          status: 404, // Not Found
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({
          message: "Invalid credentials",
        }),
        {
          status: 401, // Unauthorized
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    if (!existingUser.verified) {
      return new Response(
        JSON.stringify({
          message: "Account not verified",
        }),
        {
          status: 400, // Unauthorized
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      process.env.NEXT_PUBLIC_SECRET, // Use a strong secret key stored in environment variables
      { expiresIn: "1h" } // Token expiration time
    );

    // Respond with the user data (excluding the password)
    return new Response(
      JSON.stringify({
        success: true,
        token: `Bearer ${token}`,
        data: {
          id: existingUser._id,
          fullname: existingUser.fullname,
          email: existingUser.email,
          role: existingUser.role,
          brandVerified: existingUser.brandVerified,
          brandApplied: existingUser.brandApplied
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
    console.error("Error during login:", err);
    return new Response(
      JSON.stringify({
        message: "Failed to login",
        error: err.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
