import dbConnect from "@/utils/dbConnect"; // Correct path based on your directory structure
import Product from "@/app/models/Product";

export async function GET(req, { params }) {
  try {
    // Connect to the database
    await dbConnect();
    // Fetch products from the database
    const products = await Product.findById(params.id);
    console.log("Products:", products);

    await products.populate({
      path: "brand",
      select: ["brandInfo"],
    });

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

export async function PUT(req, { params }) {
  await dbConnect(); // Ensure database connection

  try {
    // Parse the request body to get the review details
    const { quantity } = await req.json();

    // Update the product by pushing the new review into the reviews array
    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      { quantity } ,
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Review added successfully",
        data: updatedProduct,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating product:", err);
    return new Response(
      JSON.stringify({
        message: "Unexpected error occurred",
        error: err.message,
      }),
      { status: 500 }
    );
  }
}
