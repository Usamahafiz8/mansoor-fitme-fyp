// pages/shop/index.js (Shop Page)
'use client'
import { useState, useEffect } from "react";
import { sliderItems } from "@/utils/dummydata";
import LoginForm from "./LoginForm";
import { useCart } from "@/app/context/CartContext";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import api from '../../../utils/fetchData'
import Alert from "@/app/components/Alert";
const Login = () => {
   const { state: cart, dispatch: cartDispatch } = useCart();
 	const { state: user, dispatch: setUser } = useUser();
 	const navigate = useRouter()
	console.log('us',user)
	 useEffect(() => {
     if (user?.user && user?.user?.email) {
       // If user is logged in, redirect to the dashboard
       navigate.push("/");
     }
   }, [user, navigate]);
	const handleLogin = async userData => {
		 const resp = await api.loginUser(userData)
		if (resp.success) {
			if (cart?.products.length) {
				await api.addProductsToCart(cart.products.map(p => ({
					productID: p.id,
					quantity: p.quantity
				})))
			}
			setUser({ type: "LOGIN", payload: resp.data})
			if (cart.products.length) {
				navigate.push("/cart")
			} else {
				navigate.push("/account")
			}
		}
		else{
			alert(resp.message)
		}
		return resp
	}
  const randomSlide = sliderItems[Math.floor(Math.random() * sliderItems.length)]

  return (
    <main
      className="flex justify-center h-screen items-center bg-cover bg-center sm:bg-left"
      style={{ backgroundImage: `url(${randomSlide.image})` }}>
      <div className="min-w-sm p-6 rounded-lg bg-white filter drop-shadow-2xl">
        <h3 className="text-2xl font-bold text-center mb-6">
          Login to your account
        </h3>
        <LoginForm onSubmit={handleLogin} />
      </div>
    </main>
  );
};

export default Login;
