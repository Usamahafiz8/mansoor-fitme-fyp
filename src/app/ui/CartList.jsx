import React, { useState } from 'react'

import CartItem from '../components/CartItem'
export default function CartList({ items, setItemQuantity }) {
	console.log("ada",items)
	return (
    <>
      {items?.map((item) => (
        <CartItem
          key={item?.productID?._id}
          imgSrc={item?.productID?.image}
          name={item?.productID?.name}
          color={item?.productID?.color}
          size={item?.productID?.size}
          price={item?.productID?.price}
          id={item?.productID?._id}
          quantity={item.quantity}
        />
      ))}
    </>
  );
}