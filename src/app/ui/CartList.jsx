import React, { useState } from 'react'

import CartItem from '../components/CartItem'
export default function CartList({ items, removeItem }) {
	console.log("ada",items)
	return (
    <>
      {items?.map((item) => (
        <CartItem
          key={item?._id}
          imgSrc={item?.images[0]}
          name={item?.name}
          color={item?.color}
          size={item?.size}
          price={item?.price}
          id={item?._id}
          quantity={item?.quantity}
          product={item}
          removeItem={removeItem}
        />
      ))}
    </>
  );
}