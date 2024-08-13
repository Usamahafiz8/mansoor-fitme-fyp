'use client'
import React, { useContext, useState } from 'react'
import clsx from "clsx"
import { Menu, Search, User, LogIn, X, ShoppingCart } from "react-feather"

import Button from './Button'
import Input from "./Input"
import UserDropDown from './UserDropDown'
import Link from 'next/link'

import api from "../../utils/fetchData"
import useClickOutside from '../hooks/useClickOutside'
import { useUser } from "../context/UserContext";
import { useCart } from "../context/CartContext";
export default function Navbar() {
	const { state: user, dispatch: userDispatch } = useUser();
    const { state: cartState, dispatch: cartDispatch } = useCart();

    const handleLogin = () => {
      userDispatch({ type: "LOGIN", payload: { name: "John Doe" } });
    };

    const handleLogout = () => {
      userDispatch({ type: "LOGOUT" });
      cartDispatch({ type: "RESET" }); // Reset the cart when the user logs out
    };
	 const [showMenu, setShowMenu] = useState(false)
	 const navbarRef = useClickOutside(() => setShowMenu(false))

	return (
    <nav
      className={clsx(
        "w-full flex flex-wrap justify-between items-center",
        "sticky top-0 z-40 py-3 px-4",
        "bg-[#262D3E] border-b border-[#262D3E]",
        "backdrop-filter backdrop-blur-lg shadow-sm",
        "md:(py-1)"
      )}
      ref={navbarRef}>
      <div className="flex justify-between items-center md:mx-0">
        <Link href="/">
          <h3 className="text-medium text-2xl">FIT ME</h3>
        </Link>
        <div className="flex items-center ml-20 gap-8">
          <Link href="/products">
            <h3 className="text-medium text-xl">Shop</h3>
          </Link>
          <Link href="/try-on">
            <h3 className="text-medium text-xl">Try On</h3>
          </Link>
          <Link href="/support">
            <h3 className="text-medium text-xl">Support</h3>
          </Link>
          <Link href="/about-us">
            <h3 className="text-medium text-xl">About Us</h3>
          </Link>
        </div>
      </div>

      <div className="flex items-center ml-2 space-x-4 md:order-2">
          {user && (
  
            <Link href="/account">
              <h3 className="text-medium text-xl">Become a Seller</h3>
            </Link>
            )
          }
        <Link href="/cart" className="relative flex items-center pr-2">
          <ShoppingCart width={24} height={24} />
          {cartState?.products?.length ? (
            <div className="absolute flex justify-center items-center w-4 h-4 bg-red-500 text-white rounded-full top-0 right-0 text-xs">
              {cartState?.products?.length}
            </div>
          ) : null}
        </Link>
        {user && (
          <UserDropDown
            user={user}
            onLogout={() => {
              api.logoutUser();
              handleLogout();
            }}
          />
        )}
       
      </div>

    
    </nav>
  );
}

function NavLink({ children, href }) {
	return (
		<li className="hover:text-gray-800 text-gray-700 block px-4 py-2 truncate">
			<Link href={href}>{children}</Link>
		</li>
	)
}