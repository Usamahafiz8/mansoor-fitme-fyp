"use client";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { ChevronDown } from "react-feather";

import ProductList from "@/app/ui/ProductList";
import Container from "@/app/components/Container";
import Button from "@/app/components/Button";
import DropDown, { Select, Option } from "@/app/components/DropDown";
import useClickOutside from "@/app/hooks/useClickOutside";
import api from "../../../utils/fetchData";
import { useUser } from "@/app/context/UserContext";
import { useCart } from "@/app/context/CartContext";
import { useSearchParams } from "next/navigation";

const sortOptions = [
  "popular",
  "new",
  "price: low to high",
  "price: high to low",
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
    (async () => {
      const resp = await api.fetchProducts(category);
      console.log("res", resp);
      if (resp?.length > 0) {
        setProducts(resp);
      }
    })();
  }, [category]);

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
    if (user) {
      const resp = await api.addProductsToCart([
        { productID: product._id, quantity },
      ]);
      if (resp.status === "ok") {
        cartDispatch({
          type: "ADD_PRODUCTS",
          payload: [{ productID: product._id, quantity }],
        });
      }
    } else {
      cartDispatch({
        type: "ADD_PRODUCTS",
        payload: [{ productID: product._id, quantity }],
      });
    }
  };

  return (
    <main>
      <Container
        heading={`Products${category ? " for: " + category : ""}`}
        type="page">
        <section className="flex justify-end mb-10">
          <div className="relative" ref={dropDownRef}>
            <span className="font-bold">Sort by:</span>
            <Button
              secondary
              onClick={() => setShowSortOptions((prev) => !prev)}>
              {sortOptions[sort]} <ChevronDown className="ml-2" />
            </Button>

            {showSortOptions && (
              <DropDown
                className="mt-10 inset-x-0"
                onClick={() => setShowSortOptions(false)}>
                <Select>
                  {sortOptions.map((option, i) => (
                    <Option key={option} onClick={() => setSort(i)}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </DropDown>
            )}
          </div>
        </section>
        <ProductList products={products} onAddToCart={addToCart} />
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
