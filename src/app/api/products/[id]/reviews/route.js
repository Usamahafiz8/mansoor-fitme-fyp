import dbConnect from "@/utils/dbConnect";
import Product from "@/app/models/Product";

export async function PUT(req, { params }) {
  await dbConnect(); // Ensure database connection

  try {
    // Parse the request body to get the review details
    const { reviews } = await req.json();

    // Update the product by pushing the new review into the reviews array
    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      { reviews } ,
      { new: true } // Return the updated document
    );

    console.log("feds",updatedProduct)
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
