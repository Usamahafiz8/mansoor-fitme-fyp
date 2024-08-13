import React, { useContext } from "react";

import Product from "../components/Product";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
//import { CartContext } from "@/App"

export default function ProductList({ products, onAddToCart }) {
  const { state: cart, dispatch: cartDispatch } = useCart();
  return (
    <div className="flex flex-wrap justify-center">
      {products?.map((product) => (
        <div >
          <Product
            key={product._id}
            imgSrc={product.images[0]}
            price={product.price}
            product={product}
            link={`/products/${product._id}`}
            onAddToCart={() => onAddToCart(product)}
            isInCart={cart?.products.some((p) => p.id === product._id)}
          />
        </div>
      ))}
    </div>
  );
}
