'use client'
import React, { useContext, useState } from "react";
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

export default function CartPage() {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const { state: user, dispatch: userDispatch } = useUser();
  const { state: cart, dispatch: cartDispatch } = useCart();

  const setProductQuantity = async (id, quantity) => {
    if (quantity < 1) {
      cartDispatch({ type: "REMOVE_PRODUCT", payload: id });
      if (user) api.removeProductFromCart(id);
    } else {
      cartDispatch({ type: "SET_PRODUCT_QUANTITY", payload: { id, quantity } });
      if (user) api.patchCart(id, quantity);
    }
  };

  const handleCreateOrder = async () => {
    const resp = await api.createOrder(
      cart.products,
      cart.total,
      "abc street, abc city, abc state, abc zip"
    );
    if (resp.status === "ok") {
      console.log(resp.orderID);
      api.clearCart();
      // cartDispatch({type: "CLEAR_CART"})
    }
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
            setItemQuantity={(id, qty) => setProductQuantity(id, qty)}
          />
        </section>

        <section className="w-full md:w-auto border border-gray-300 rounded shadow py-4 md:(sticky top-20)">
          <CartSummary
            onCheckout={() => setShowCheckoutModal(true)}
            subtotal={cart?.products.reduce((total, item) => {
              return total + item.productID.price * item.quantity;
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
