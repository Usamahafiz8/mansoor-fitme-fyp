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
  return (
    <Card
      link={link}
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
        className={"relative h-16 py-2 bg-[#dddd] text-black text-center flex flex-col justify-center items-center"}
        >
         {product.quantity > 0  ? <ProductButton onClick={onAddToCart}>
            <ShoppingCart className="min-w-8" />
          </ProductButton>
          :
          <p className="  my-auto items-center">out of stock</p>
          }
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
      className={` bg-white w-12 h-12  flex justify-center items-center rounded-full transition-all duration-300 ease-out hover:(px-14) focus:outline-none ${className}`}
      {...props}>
      {children}
    </button>
  );
}
