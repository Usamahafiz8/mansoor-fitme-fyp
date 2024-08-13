"use client";
import React from 'react';

const AboutUs = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">About Us</h1>
        <p className="text-gray-700 text-lg mb-4">
          Welcome to <strong>Fitme</strong>, your number one source for all things related to fitness. We are dedicated to providing you with the best products and services, with a focus on quality, customer service, and reliability.
        </p>
        <p className="text-gray-700 text-lg mb-4">
          Fitme is a project created by <strong>Muhammad Mansoor-ul-Haq</strong> as part of an academic requirement. This project is registered under the number <strong>585 Fbas/BSIT4/F20</strong> and is made for the <strong>International Islamic University, Islamabad, Pakistan</strong>.
        </p>
        <p className="text-gray-700 text-lg mb-4">
          Our mission is to help you achieve your fitness goals by offering a wide range of products tailored to your needs. Whether you're just starting out on your fitness journey or are a seasoned athlete, we have something for everyone.
        </p>
        <p className="text-gray-700 text-lg mb-4">
          We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
        </p>
        <p className="text-gray-700 text-lg mb-4">
          Thank you for visiting our site, and we look forward to serving you!
        </p>
        <p className="text-gray-700 text-lg mb-4">
          Sincerely,<br />
          <strong>Muhammad Mansoor-ul-Haq</strong><br />
          CEO, Fitme
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
