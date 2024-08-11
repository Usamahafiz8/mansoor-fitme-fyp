import React, { useContext } from "react";

import Product from "../components/Product";
import { useCart } from "../context/CartContext";
//import { CartContext } from "@/App"

export default function ProductList({ products, onAddToCart }) {
  const { state: cart, dispatch: cartDispatch } = useCart();
  console.log("dscs", products);
  return (
    <div className="flex flex-wrap justify-center">
      {products?.map((product) => (
        <Product
          key={product._id}
          imgSrc={product.image}
          price={product.price}
          product={product}
          link={`/products/${product._id}`}
          onAddToCart={() => onAddToCart(product)}
          isInCart={cart?.products.some((p) => p.id === product._id)}
        />
      ))}
    </div>
  );
}
