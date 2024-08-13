import dbConnect from "@/utils/dbConnect";
import User from "@/app/models/User";

export async function PUT(req, { params }) {
  await dbConnect();

  try {
    const { id } = params; // Extract user ID from the route parameters
    const data = await req.json(); // Extract updated user information from the request body

    // Find the user by ID and update the fields
    const updatedUser = await User.findByIdAndUpdate(
      id,
      data,
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: updatedUser._id,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          role: updatedUser.role,
          brandVerified: updatedUser.brandVerified,
          brandApplied: updatedUser.brandApplied,
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
    console.error("Error updating user:", err);
    return new Response(
      JSON.stringify({ message: "Failed to update user", error: err.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
