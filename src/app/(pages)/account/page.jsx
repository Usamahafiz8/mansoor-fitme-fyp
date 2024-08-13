"use client";
import { useUser } from "@/app/context/UserContext";
import { useEffect, useState } from "react";
import api from "@/utils/fetchData";
import Container from "./container";
import AdminView from "./AdminView";
import clsx from "clsx";
import BrandView from "./brandview";
import { uploadImageToCloudinary } from "@/utils/uploadImage";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { state: user } = useUser();
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);
  const router= useRouter()
  useEffect(() => {
    console.log("user", user);
    if (user?.user?.role === "admin") {
      fetchUnverifiedUsers();
    }
    if(!user?.user){
      router.push('/')
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
      await api.updateUser(userId, { brandVerified: true });
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
      const imageUrls = await Promise.all(
        data.images.map(uploadImageToCloudinary)
      );

      // Prepare the product data to be sent to the backend
      const productData = {
        ...data,
        images: imageUrls, // Use the image URLs instead of the file objects
      };

      await api.handleAddProduct(user.user.id, productData);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  return (
    <main className="min-h-screen py-20 bg-gray-50">
      <Container heading="Your Account" type="page" className="bg-white">
        {user.user?.role === "admin" && (
          <AdminView
            user={user}
            unverifiedUsers={unverifiedUsers}
            handleVerify={handleVerify}
            handleCancelVerification={handleCancelVerification}
            updateUser={updateUserData}
            handleAddProduct={handleAddProduct}
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
