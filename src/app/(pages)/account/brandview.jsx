import { useState } from "react";
import Tabs from "./tabs";
import UserInformation from "./UserInformation";
import AddProductForm from "./productForm";

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

  console.log("user",user)
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <Tabs
        tabs={
          user.user.brandApplied && user.user.brandVerified
            ? ["Account Information", "Add Product"]
            : user.user.brandApplied && !user.user.brandVerified
            ? ["Account Information"]
            : ["Account Information", "Brand Verification"]
        }
        activeTab={activeTab}
        onChangeTab={handleTabChange}
      />
      {activeTab === 0 && (
        <>
          <UserInformation user={user} updateUser={updateUser} />
        </>
      )}
      {activeTab === 1 && user.user.brandApplied && user.user.brandVerified && (
        <AddProductForm onAddProduct={handleAddProduct} />
      )}
      {activeTab === 1 &&
        (!user.user.brandApplied && !user.user.brandVerified) && (
          <BrandInformation
            user={user}
            brandInfo={brandInfo}
            onSave={handleSaveBrandInfo}
          />
        )}
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


