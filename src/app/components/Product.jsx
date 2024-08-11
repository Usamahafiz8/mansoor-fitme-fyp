import React from "react";
import { ShoppingCart, Search, Check } from "react-feather";
import clsx from "clsx";

import Card from "./Card";
import Link from "next/link";

export default function Product({
  link,
  imgSrc,
  price,
  onAddToCart,
  isInCart,
  product,
}) {
  console.log("product", isInCart);
  return (
    <Card
      imgSrc={
        imgSrc ||
        "https://oldnavy.gap.com/webcontent/0052/539/840/cn52539840.jpg"
      }
      className={clsx(
        "!max-w-72 !max-h-xs",
        "rounded-lg m-2 bg-white relative"
      )}>
      <div className="p-4">
        <h3 className="text-lg text-black font-semibold mb-2">{product?.name}</h3>
        <p className="text-sm text-gray-500 mb-4">Size: {product?.size}</p>
      </div>

      <div
        className={"relative bg-[#dddd] text-black text-center flex flex-col justify-center items-center"}
        >
        {isInCart ? (
          <Link href="/cart">
            <ProductButton className="!bg-green-500 text-white">
              <Check className="min-w-8" />
            </ProductButton>
          </Link>
        ) : (
          <ProductButton onClick={onAddToCart}>
            <ShoppingCart className="min-w-8" />
          </ProductButton>
        )}
      </div>

      <div
        className={clsx(
          "absolute bottom-40 right-0 w-16 h-16 m-4",
          "flex justify-center items-center",
          "bg-black/50 font-bold text-white rounded-full"
        )}>
        $ {price}
      </div>

    
    </Card>
  );
}

function ProductButton({ children, className, ...props }) {
  return (
    <button
      className={`m-6 bg-white w-12 h-12 flex justify-center items-center rounded-full transition-all duration-300 ease-out hover:(px-14) focus:outline-none ${className}`}
      {...props}>
      {children}
    </button>
  );
}
