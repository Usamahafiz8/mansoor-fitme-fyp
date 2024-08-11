"use client";
import { useUser } from "@/app/context/UserContext";
import { useEffect, useState } from "react";
import api from "@/utils/fetchData";
import Container from "./container";
import AdminView from "./adminview";
import clsx from "clsx";
import BrandView from "./brandview";

export default function AccountPage() {
  const { state: user } = useUser();
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);

  useEffect(() => {
    console.log("user", user);
    if (user?.user?.role === "admin") {
      fetchUnverifiedUsers();
    }
  }, [user]);

  const fetchUnverifiedUsers = async () => {
    try {
      const response = await api.fetchUsers();
      setUnverifiedUsers(response.data);
    } catch (error) {
      console.error("Error fetching unverified users:", error);
    }
  };

  const handleVerify = async (userId) => {
    try {
      await api.updateUser(userId, { verified: true });
      setUnverifiedUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };

  const updateUserData = async (userId, data) => {
    try {
      await api.updateUser(userId, data);
      setUnverifiedUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };
  const handleCancelVerification = async (userId) => {
    try {
      await api.updateUser(userId, { verified: false });
      setUnverifiedUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error canceling verification:", error);
    }
  };

  const handleSaveBrand = async (data) => {
    try {
      await api.handleSaveBrandInfo(user.user.id, data);
    } catch (error) {
      console.error("Error canceling verification:", error);
    }
  };
  const handleAddProduct = async (data) => {
    try {
      await api.handleAddProduct(user.user.id, data);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  return (
    <main className="min-h-screen py-20 bg-gray-50">
      <Container heading="Your Account" type="page">
        {user.user?.role === "admin" && (
          <AdminView
            user={user}
            unverifiedUsers={unverifiedUsers}
            handleVerify={handleVerify}
            handleCancelVerification={handleCancelVerification}
            updateUser={updateUserData}
          />
        )}
        {user.user?.role === "brand" && (
          <BrandView
            user={user}
            brandInfo={user.brandInfo}
            handleSaveBrandInfo={handleSaveBrand}
            handleAddProduct={handleAddProduct}
            updateUser={updateUserData}
          />
        )}
      </Container>
    </main>
  );
}
