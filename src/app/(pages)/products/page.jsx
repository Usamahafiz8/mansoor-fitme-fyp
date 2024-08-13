"use client";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { ChevronDown, Frown } from "react-feather";

import ProductList from "@/app/ui/ProductList";
import Container from "@/app/components/Container";
import Button from "@/app/components/Button";
import DropDown, { Select, Option } from "@/app/components/DropDown";
import useClickOutside from "@/app/hooks/useClickOutside";
import api from "../../../utils/fetchData";
import { useUser } from "@/app/context/UserContext";
import { useCart } from "@/app/context/CartContext";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import ProductsGrid from "@/app/components/ProductsGrid";

const sortOptions = [
  "Shirts",
  "Trousers",
  "Shoes",
];

const sort1Options = [
  "All",
  "Under $50",
  "$50-$200",
  "above $200"
];

function ProductsPageComponent() {
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const { state: user, dispatch: userDispatch } = useUser();
  const searchparams = useSearchParams();
  const category = searchparams.get("category");
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState(0);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const dropDownRef = useClickOutside(() => setShowSortOptions(false));
  console.log("cartstate",cartState)
  useEffect(() => {
    fetchProducts()
    
    
  }, [category]);

  const fetchProducts = async()=>{
   
      const resp = await api.fetchProducts(category);
      if (resp?.length > 0) {
        setProducts(resp);
      }
    
  }

  useEffect(() => {
     localStorage.setItem("cart", JSON.stringify(cartState));
  }, [products]);
  useEffect(() => sortProducts(sort), [sort]);

  const sortProducts = (sortType) => {
    switch (sortType) {
      case 1:
        setProducts([...products].sort((a, b) => a.updatedAt - b.updatedAt));
      case 2:
        setProducts([...products].sort((a, b) => a.price - b.price));
        break;
      case 3:
        setProducts([...products].sort((a, b) => b.price - a.price));
        break;
      default:
        return;
    }
  };

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
          { ...product ,quantity:1},
        ];

        cartDispatch({
          type: "ADD_PRODUCTS",
          payload: { ...cartState, products: updatedProducts },
        });
      }
    // Reduce the product quantity in the local state
    axios
      .put(`/api/products/${product._id}`, {
        quantity: product.quantity-1
      })
      .then((response) => {
        fetchProducts();
      })
      .catch((error) => {
        console.error("There was an error submitting the review!", error);
      });
    product.quantity -= quantity;

  };

  return (
    <main className="bg-white min-h-screen">
      <Container
        heading={`Products${category ? " for: " + category : ""}`}
        type="page">
      
        {products.length > 0 ? (
          <ProductsGrid products={products} onAddToCart={addToCart} />
        ) : (
          <div className="flex gap-20 items-center p-20 mx-auto">
            <p className="text-xl text-black">Sorry No Products!!</p>
            <Frown color="black" />
          </div>
        )}
      </Container>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPageComponent />
    </Suspense>
  );
}
