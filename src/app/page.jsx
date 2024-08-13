'use client'
import React, { useContext, useEffect, useState } from "react";
import { ChevronRight, Frown, Smile } from "react-feather";
import { categories, sliderItems } from "@/utils/dummydata";
import Button from "./components/Button";
import Container from "./components/Container";
import CategoryList from "./ui/CategoryList";
import ProductList from "./ui/ProductList";
import Newsletter from "./ui/Newsletter";
import api from "../utils/fetchData";
import Carousel from "./components/Carousel";
import Link from "next/link";
import { useUser } from "./context/UserContext";
import { useCart } from "./context/CartContext";
import Hero from "./components/Hero";
import ProductsGrid from "./components/ProductsGrid";
export default function HomePage() {
  const { state: user, dispatch: userDispatch } = useUser();
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const [products, setProducts] = useState([]);
   useEffect(() => {
    fetchProducts()
   }, []);

   const fetchProducts= async()=>{
      const resp = await api.fetchProducts("",true);
      if (resp?.length > 0) {
        setProducts(resp);
      }
   }
 const addToCart = async (product, quantity = 1) => {
   const existingProductIndex = cartState.products.findIndex(
     (item) => item._id === product._id
   );

   if (existingProductIndex !== -1) {
     // If product exists in the cart, update its quantity
     const updatedProducts = cartState.products.map((item, index) => {
       if (index === existingProductIndex) {
         return {
           ...item,
           quantity: item.quantity + quantity,
         };
       }
       return item;
     });

     cartDispatch({
       type: "ADD_PRODUCTS",
       payload: { ...cartState, products: updatedProducts },
     });
   } else {
     // If product does not exist in the cart, add it to the existing cart array
     const updatedProducts = [
       ...cartState.products,
       { ...product, quantity: 1 },
     ];

     cartDispatch({
       type: "ADD_PRODUCTS",
       payload: { ...cartState, products: updatedProducts },
     });
   }
   // Reduce the product quantity in the local state
   axios
     .put(`/api/products/${product._id}`, {
       quantity: product.quantity - 1,
     })
     .then((response) => {
       fetchProducts();
     })
     .catch((error) => {
       console.error("There was an error submitting the review!", error);
     });
   product.quantity -= quantity;
 };

useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cartState));
}, [products]);
  return (
    <main className="bg-white min-h-screen">
      <div className="bg-white">
        <Hero />
        {/* main products grid */}
        <section
          aria-labelledby="products-heading"
          className="xl:max-w-7xl xl:mx-auto xl:px-8 mx-10">
          <div className="flex px-4 sm:px-6 py-4 sm:items-center sm:justify-between lg:px-8 xl:px-0">
            <h2
              id="favorites-heading"
              className="text-2xl font-extrabold tracking-tight text-gray-900">
              New Arrivals
            </h2>
            <Link href={"/products"} passHref>
              <p className="hidden md:block text-sm font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">
                Browse all<span aria-hidden="true"> &rarr;</span>
              </p>
            </Link>
          </div>
          {products.length>0 ? <ProductsGrid
            products={products?.slice(0, 8)}
            onAddToCart={addToCart}
          />
          : 
          <div className="flex gap-20 items-center p-20 mx-auto">
              <p className="text-xl text-black">Sorry No Products!!</p>
              <Frown color="black"/>
          </div>
          }
          <div className="block md:hidden pb-10">
            <Link href={"/products"} passHref>
              <p className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">
                Browse all<span aria-hidden="true"> &rarr;</span>
              </p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
