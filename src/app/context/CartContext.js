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
     console.log("action.oaye",action.payload)
        // Add new product to the cart
      return action.payload ;
      

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
    const savedCart = localStorage.getItem("cart");
    console.log("saved",savedCart)
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        console.log("parsed",cartData)
        if (Array.isArray(cartData.products)) {
          console.log("hscj",cartData.products)
          dispatch({ type: "ADD_PRODUCTS", payload: cartData });
        }
      } catch (error) {
        console.error("Error parsing cart from local storage:", error);
      }
    }
  }, []);

 
  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
