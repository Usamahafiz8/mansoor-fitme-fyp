import { useState } from "react";
import Tabs from "./tabs";
import UserInformation from "./UserInformation";

export default function BrandView({
  user,
  brandInfo,
  handleSaveBrandInfo,
  handleAddProduct,
  updateUser,
}) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <Tabs
        tabs={["Account/Brand Information", "Add Product"]}
        activeTab={activeTab}
        onChangeTab={handleTabChange}
      />
      {activeTab === 0 && (
        <>
          <UserInformation user={user} updateUser={updateUser} />
          <BrandInformation
            user={user}
            brandInfo={brandInfo}
            onSave={handleSaveBrandInfo}
          />
        </>
      )}
      {activeTab === 1 && <AddProductForm onAddProduct={handleAddProduct} />}
    </div>
  );
}

function BrandInformation({ brandInfo, onSave }) {
  const [brandName, setBrandName] = useState(brandInfo?.brandName || "");
  const [brandDescription, setBrandDescription] = useState(
    brandInfo?.brandDescription || ""
  );
  //const [brandLogo, setBrandLogo] = useState(brandInfo?.brandLogo || "");

  const handleSave = () => {
    onSave({ brandName, brandDescription });
  };

  return (
    <form className="space-y-4 mt-10">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Brand Name
        </label>
        <input
          type="text"
          className="mt-1 p-2 text-black block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Brand Description
        </label>
        <textarea
          className="mt-1 p-2 text-black block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={brandDescription}
          onChange={(e) => setBrandDescription(e.target.value)}></textarea>
      </div>

      <button
        type="button"
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        onClick={handleSave}>
        Save Brand Info
      </button>
    </form>
  );
}

function AddProductForm({ onAddProduct }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(0);

  const handleSubmit = () => {
    onAddProduct({ name, description, size, color, price, quantity });
  };

  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Product Name
        </label>
        <input
          type="text"
          className="mt-1 p-2 text-black block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={name}
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
          onChange={(e) => setDescription(e.target.value)}></textarea>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Size
          </label>
          <input
            type="text"
            className="mt-1 p-2 block text-black w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <input
            type="text"
            className="mt-1 p-2 block text-black w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={color}
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
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          type="number"
          className="mt-1 p-2 block w-full text-black border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      <button
        type="button"
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        onClick={handleSubmit}>
        Add Product
      </button>
    </form>
  );
}
