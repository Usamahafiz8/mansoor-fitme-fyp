import dbConnect from "@/utils/dbConnect";
import User from "@/app/models/User";

export async function PUT(req) {
  await dbConnect();

  try {
    const { userId, brandInfo } = await req.json();
    console.log("bat", brandInfo);
    // Find the user by ID and update their brand information
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { brandInfo: brandInfo },
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
        data: updatedUser,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Error updating brand info:", err);
    return new Response(
      JSON.stringify({
        message: "Failed to update brand info",
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
