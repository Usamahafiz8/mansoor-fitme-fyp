import dbConnect from "@/utils/dbConnect";
import Product from "@/app/models/Product";

export async function POST(req) {
  await dbConnect();

  try {
    const { name, description, size, color, price, userId , quantity} = await req.json();

    // Create a new product with a reference to the brand (user)
    const newProduct = new Product({
      name,
      description,
      size,
      color,
      quantity,
      price,
      brand: userId, // Associating the product with the brand (user)
    });

    await newProduct.save();

    return new Response(
      JSON.stringify({
        success: true,
        data: newProduct,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Error adding product:", err);
    return new Response(
      JSON.stringify({ message: "Failed to add product", error: err.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
