
import React, { useState } from "react"
import { LogIn, LogOut } from "react-feather"
import DropDown, { Select, Option } from "./DropDown"
import Link from "next/link"
import useClickOutside from "../hooks/useClickOutside"
import { useUser } from "../context/UserContext"

function UserDropDown({ user, onLogout }) {
  const dropDownRef = useClickOutside(() => setShowDropDown(false))
  const [showDropDown, setShowDropDown] = useState(false)
  return (
    <div className="relative flex items-center" ref={dropDownRef}>
      <button
        onClick={() => setShowDropDown((prev) => !prev)}
        className="h-8 w-8 rounded-full overflow-hidden focus:(ring-4 ring-gray-300 outline-none)">
        <img
          className="object-cover"
          src={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQdztTDcpZ2pFqwWDYwSXbvZq5nzJYg5cn8w&s"
          }
          alt="user avatar"
        />
      </button>
      {showDropDown && (
        <DropDown className="mt-10 right-0">
          <Select onClick={() => setShowDropDown(false)}>
            <Link href="/cart">
              <Option>Cart</Option>
            </Link>
            <Link href="/account">
              <Option>Account</Option>
            </Link>
            {user?.user?.fullname ?  <Link href="/" onClick={onLogout}>
              <Option className="flex items-center">
                <LogOut width={20} height={20} className="mr-2" />
                Logout
              </Option>
            </Link>
            :
            <Link href="/login">
              <Option className="flex items-center">
                <LogIn width={20} height={20} className="mr-2" />
                login
              </Option>
            </Link>
            }
          </Select>
        </DropDown>
      )}
    </div>
  );
}

export default UserDropDown