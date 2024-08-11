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
        "bg-gray-200/90 border-b border-gray-300",
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
        </div>
      </div>

      <div className="flex items-center ml-2 space-x-4 md:order-2">
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
              handleLogout()
            }}
          />
        )}
        <button className="md:hidden flex items-center focus:outline-none">
          {showMenu ? (
            <X width={24} height={24} onClick={() => setShowMenu(false)} />
          ) : (
            <Menu width={24} height={24} onClick={() => setShowMenu(true)} />
          )}
        </button>
      </div>

      <div
        className={clsx(
          "hidden w-full",
          showMenu && "!flex flex-col mt-8",
          "md:(flex flex-row mt-0 ml-auto order-1 w-auto)"
        )}>
        <ul
          className={clsx(
            "flex flex-col items-center order-2",
            "mt-8 mb-2 text-xl space-y-1 divide-y-2 divide-gray-200",
            "md:(flex-row text-base m-0 space-y-0 divide-y-0 divide-x)"
          )}
          onClick={() => setShowMenu(false)}>
          <NavLink href="/products?category=men">Men</NavLink>
          <NavLink href="/products?category=women">Women</NavLink>
          <NavLink href="/products">All Products</NavLink>
        </ul>
        <div className="flex items-center order-1 md:order-2">
          <Input
            className="md:max-w-min bg-opacity-40"
            icon={<Search />}
            placeholder="Search..."
          />
        </div>
        {!user && (
          <ul
            className={clsx(
              "flex flex-col order-3",
              showMenu && "mt-4",
              "md:(flex-row text-base mt-0 space-x-2)"
            )}>
            <li>
              <Link href="/login">
                <Button secondary className="w-full md:w-auto">
                  <LogIn width={20} height={20} className="mr-2" />
                  Login
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/register">
                <Button className="w-full md:w-auto">
                  <User width={20} height={20} className="mr-2" />
                  Register
                </Button>
              </Link>
            </li>
          </ul>
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