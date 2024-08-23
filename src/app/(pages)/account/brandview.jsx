import { useState } from "react";

function BrandInformation({ brandInfo, onSave }) {
  const [brandName, setBrandName] = useState(brandInfo?.brandName || "");
  const [brandDescription, setBrandDescription] = useState(
    brandInfo?.brandDescription || ""
  );
  const [errors, setErrors] = useState({ brandName: "", brandDescription: "" });

  const validateForm = () => {
    const newErrors = { brandName: "", brandDescription: "" };
    let isValid = true;

    // Validate brand name
    if (!brandName.trim()) {
      newErrors.brandName = "Brand name is required.";
      isValid = false;
    } else if (/[^a-zA-Z\s-]/.test(brandName)) {
      newErrors.brandName =
        "Brand name can only contain letters, spaces, and hyphens.";
      isValid = false;
    }

    // Validate brand description
    if (!brandDescription.trim()) {
      newErrors.brandDescription = "Brand description is required.";
      isValid = false;
    } else if (/\d/.test(brandDescription)) {
      newErrors.brandDescription =
        "Brand description should not contain numbers.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({ brandName, brandDescription });
    }
  };

  return (
    <form className="space-y-4 mt-10">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Brand Name
        </label>
        <input
          type="text"
          className={`mt-1 p-2 text-black block w-full border ${
            errors.brandName ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          value={brandName}
          placeholder="Enter a valid brand name"
          onChange={(e) => setBrandName(e.target.value)}
        />
        {errors.brandName && (
          <p className="text-red-500 text-sm">{errors.brandName}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Brand Description
        </label>
        <textarea
          className={`mt-1 p-2 text-black block w-full border ${
            errors.brandDescription ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          value={brandDescription}
          placeholder="Add your brand description"
          onChange={(e) => setBrandDescription(e.target.value)}
        ></textarea>
        {errors.brandDescription && (
          <p className="text-red-500 text-sm">{errors.brandDescription}</p>
        )}
      </div>

      <button
        type="button"
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        onClick={handleSave}
      >
        Save Brand Info
      </button>
    </form>
  );
}

export default BrandInformation;
