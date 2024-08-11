'use client'
import React, { useContext, useEffect } from "react";

//import { UserContext, CartContext } from "@/App";
import { sliderItems } from "@/utils/dummydata";
import RegisterForm from "@/app/ui/RegisterForm";
import { useRouter } from "next/navigation";
import api from "@/utils/fetchData";
import { useUser } from "@/app/context/UserContext";
import { useCart } from "@/app/context/CartContext";

export default function RegisterPage() {
  const { state: user, dispatch: userDispatch } = useUser();
  const { state: cart, dispatch: cartDispatch } = useCart();
  const navigate = useRouter();
  console.log("user in reg",user)
  useEffect(() => {
    if (user?.user && user?.user?.email) {
      // If user is logged in, redirect to the dashboard
      navigate.push("/");
    }
  }, [user, navigate]);

  const handleRegister = async (userData) => {
    
    const resp = await api.registerUser(userData);
    console.log("es",resp)
    if (resp.success) {
      const loginResp = await api.loginUser(userData);
      if (loginResp.success) {
        userDispatch({ type: "LOGIN", payload: loginResp.data });
        await api.createUserCart(
          cart.products.map((p) => ({
            productID: p.id,
            quantity: p.quantity,
          }))
        );

        if (cart.products.length) {
          navigate.push("/cart");
        } else {
          navigate.push("/account");
        }
      }
    }
    return resp;
  };

  const randomSlide =
    sliderItems[Math.floor(Math.random() * sliderItems.length)];

  return (
    <main
      className="flex justify-center h-screen items-center bg-cover bg-center sm:bg-left"
      style={{ backgroundImage: `url(${randomSlide.image})` }}>
      <div className="min-w-sm p-6 rounded-lg bg-white filter drop-shadow-2xl">
        <h3 className="text-2xl font-bold text-center mb-6">
          Create a new account
        </h3>
        <RegisterForm onSubmit={handleRegister} />
      </div>
    </main>
  );
}
