import React, { useState } from "react";

export default function AddProductForm({ onAddProduct }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [category, setCategory] = useState("");
  const [error, setError] = useState(""); // To store error messages

  const handleSubmit = (event) => {
    event.preventDefault();

    // Basic validation checks
    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }
    if (!description.trim()) {
      setError("Product description is required.");
      return;
    }
    if (!category) {
      setError("Please select a category.");
      return;
    }
    if (!size.trim()) {
      setError("Size is required.");
      return;
    }
    if (!color.trim()) {
      setError("Color is required.");
      return;
    }
    if (!price || isNaN(price) || price <= 0) {
      setError("Please enter a valid price.");
      return;
    }
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    const files = document.querySelector('input[type="file"]').files;
    if (files.length === 0) {
      setError("Please upload at least one product image.");
      return;
    }

    // If all validations pass, clear the error and submit the form
    setError("");
    onAddProduct({
      name,
      description,
      size,
      color,
      price,
      quantity,
      category,
      images: Array.from(files),
    });
  };

  const handlePriceChange = (e) => {
    const value = parseFloat(e.target.value);
    setPrice(value >= 0 ? value : "");
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(value >= 0 ? value : "");
  };

  return (
    <form className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          className="mt-1 p-2 text-black block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={name}
          placeholder="Enter product name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          className="mt-1 p-2 block text-black w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={description}
          placeholder="Enter product description (1-50)"
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 p-2 block text-black w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="" disabled>
            Select a category
          </option>
          <option value="shirts">Shirts</option>
          <option value="trousers">Trousers</option>
          <option value="shoes">Shoes</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Size
          </label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="mt-1 p-2 block text-black w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="" disabled>
              Select size
            </option>
            <option value="Small">Small</option>
            <option value="Large">Large</option>
            <option value="Extra Large">Extra Large</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <input
            type="text"
            className="mt-1 p-2 block text-black w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={color}
            placeholder="Enter color"
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          className="mt-1 p-2 block w-full text-black border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={price}
          placeholder="Enter price"
          onChange={handlePriceChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <input
          type="number"
          className="mt-1 p-2 block w-full text-black border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={quantity}
          placeholder="Enter quantity"
          onChange={handleQuantityChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Images
        </label>
        <input
          type="file"
          id="images"
          name="images"
          multiple
          accept="image/*"
          className="mt-1 p-2 block w-full text-black border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <button
        type="button"
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        onClick={handleSubmit}
      >
        Add Product
      </button>
    </form>
  );
}
