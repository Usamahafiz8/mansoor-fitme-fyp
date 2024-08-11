import mongoose from "mongoose";

const { Schema, model, models } = mongoose;
const ObjectId = Schema.Types.ObjectId;

const CartSchema = new Schema(
  {
    userID: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productID: {
          type: ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Export the model
export default models.Cart || model("Cart", CartSchema);
