'use client'
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "react-feather";

import CartList from "@/app/ui/CartList";
import CartSummary from "@/app/ui/CartSummary";
import Button from "@/app/components/Button";
import PageHeader from "@/app/components/PageHeader";
import api from "../../../utils/fetchData";
import CheckoutModal from "@/app/components/Checkout";
import { useUser } from "@/app/context/UserContext";
import { useCart } from "@/app/context/CartContext";
import axios from "axios";

export default function CartPage() {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const { state: user, dispatch: userDispatch } = useUser();
  const { state: cart, dispatch: cartDispatch } = useCart();
  const [cartFlag,setCart] = useState(false)
  const removeItem = async (product) => {
    const updatedProducts = cart.products.filter(
      (item) => item._id !== product._id
    );
    cartDispatch({
      type: "ADD_PRODUCTS",
      payload: { ...cart, products: updatedProducts },
    });
    axios.get(`/api/products/${product._id}`).then((response) => {
      axios
        .put(`/api/products/${product._id}`, {
          quantity: response.data.quantity+product.quantity,
        })
        .then((response) => {
          setCart(true)
        })
        .catch((error) => {
          console.error("There was an error submitting the review!", error);
        });

    });
          setCart(false);

     
  };

  useEffect(() => {
    if(cartFlag){
      localStorage.setItem("cart", JSON.stringify(cart));
    }

  }, [cartFlag]);

  const handleCreateOrder = async () => {
     
      cartDispatch({
        type: "ADD_PRODUCTS",
        payload: { ...cart, products: [] },
      });
      setCart(true)
      // cartDispatch({type: "CLEAR_CART"})
      setCart(false);

    
  };

  if (cart?.products?.length === 0) {
    return (
      <main className="h-screen flex flex-col items-center text-center my-14 p-4">
        <PageHeader>Your Shopping Cart is Empty</PageHeader>
        <Link href="/products">
          <Button link className="text-xl">
            <ShoppingBag className="mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="my-14">
      <PageHeader>Your Shopping Cart</PageHeader>
      <section className="max-w-6xl mx-auto my-16 relative gap-8 flex flex-col p-4 md:(flex-row items-start)">
        <section className="flex-1 sm:min-w-md divide-y divide-gray-200 border border-gray-300 rounded shadow">
          <CartList
            items={cart?.products}
            removeItem={removeItem}
          />
        </section>

        <section className="w-full md:w-auto border border-gray-300 rounded shadow py-4 md:(sticky top-20)">
          <CartSummary
            onCheckout={() => setShowCheckoutModal(true)}
            subtotal={cart?.products?.reduce((total, item) => {
              return total + item?.price * item?.quantity;
            }, 0)}
            charges={[{ name: "Shipping Charges", amount: 9 }]}
            discounts={[{ name: "Shipping Discount", amount: 9 }]}
          />
        </section>
      </section>

      {showCheckoutModal && (
        <CheckoutModal
          onCancel={() => setShowCheckoutModal(false)}
          onSuccess={handleCreateOrder}
        />
      )}
    </main>
  );
}
