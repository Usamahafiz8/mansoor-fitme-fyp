'use client'
import React, { useContext, useEffect, useState } from "react";
import { ChevronRight } from "react-feather";
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
export default function HomePage() {
  const { state: user, dispatch: userDispatch } = useUser();
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const [products, setProducts] = useState([]);
   useEffect(() => {
     (async () => {
       const resp = await api.fetchProducts("", true);
       console.log(resp);
       if (resp.status !== "error") {
         setProducts(resp);
       }
     })();
   }, []);

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      const resp = await api.addProductsToCart([
        { productID: product._id, quantity },
      ]);
      if (resp.status === "ok") {
        cartDispatch({
          type: "ADD_PRODUCTS",
          payload: [{ ...product, quantity }],
        });
      }
    } else {
      cartDispatch({
        type: "ADD_PRODUCTS",
        payload: [{ ...product, quantity }],
      });
    }
  };

  return (
    <main>
      <section>
        <Carousel slides={sliderItems} />
      </section>

 

      <Container heading="Latest Arrivals">
        <ProductList
          products={[...products].splice(0, 1)}
          onAddToCart={addToCart}
        />

        <Link href="/products" className="flex justify-center">
          <Button className="text-lg mt-6" link>
            View More <ChevronRight className="ml-2" />
          </Button>
        </Link>
      </Container>

    </main>
  );
}
