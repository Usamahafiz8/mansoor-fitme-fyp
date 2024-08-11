"use client";
import { createContext, useContext, useReducer, useEffect } from "react";
import api from '@/utils/fetchData'
const CartContext = createContext();

const initialCartState = {
  products: [], // Start with an empty array of products
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_PRODUCTS":
      // Check if the product already exists in the cart
      const existingProductIndex = state.products.findIndex(
        (p) => p.productID === action.payload.productID
      );

      if (existingProductIndex >= 0) {
        // Update the quantity if the product is already in the cart
        const updatedProducts = [...state.products];
        updatedProducts[existingProductIndex].quantity +=
          action.payload.quantity;
        return { ...state, products: updatedProducts };
      } else {
        // Add new product to the cart
        return { ...state, products: [...state.products, action.payload] };
      }

    case "REMOVE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.productID !== action.payload),
      };

    case "CLEAR_CART":
      return initialCartState;

    case "SET_CART":
      return { ...state, products: action.payload };

    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("/api/cart", {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            dispatch({ type: "SET_CART", payload: data.data?.products });
          }
        })
        .catch((err) => {
          console.error("Error fetching cart:", err);
        });
    }
  }, []);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
