import dbConnect from "@/utils/dbConnect"; // Correct path based on your directory structure
import Product from "@/app/models/Product";

export async function GET(req) {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch products from the database
    const products = await Product.find({});
    console.log("Products:", products);

    // Return the products as a JSON response
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Handle any errors
    console.error("Error fetching products:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to fetch products",
        error: error.message,
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
