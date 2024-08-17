import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const RAPID_API_KEY = "4361ac8516msh649f4c5ee2a5730p16477djsn7d46e673eb59" //process.env.NEXT_PUBLIC_RAPID_API_KEY;

const TryonPopup = ({ image }) => {
  const [avatarFile, setAvatarFile] = useState(null);
  const [clothingFile, setClothingFile] = useState(image);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [clothingPreview, setClothingPreview] = useState(image);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const popupRef = useRef(null);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setIsPopupOpen(false);
    }
  };

  useEffect(() => {
    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = async () => {
    if (!avatarFile || !clothingFile) {
      setError("Please select both an avatar image and a clothing image.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const avatarUrl = "https://raw.githubusercontent.com/john-eighteenth/clothes-tryon-js/main/resources/look.jpg" // avatarPreview;
      const clothingUrl = clothingPreview;

      const resultImageUrl = await virtualTryOn(avatarUrl, clothingUrl);
      setResultImage(resultImageUrl);
    } catch (error) {
      console.error(
        "Error during try-on process:",
        error.response?.data || error.message
      );
      setError("An error occurred while processing the images.");
    } finally {
      setLoading(false);
    }
  };

  const virtualTryOn = async (avatarUrl, clothingUrl) => {
    const encodedParams = new URLSearchParams();
    encodedParams.set("clothing_image_url", clothingUrl);
    encodedParams.set("avatar_image_url", avatarUrl);

    const options = {
      method: "POST",
      url: "https://texel-virtual-try-on.p.rapidapi.com/try-on-url",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": "texel-virtual-try-on.p.rapidapi.com",
      },
      data: encodedParams.toString(),
      responseType: "arraybuffer",
    };

    try {
      const response = await axios.request(options);
      const blob = new Blob([response.data], { type: "image/jpeg" });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error(
        "API request error:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  return (
    <div>
      <button
        className="w-1/3 mt-2 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
        onClick={togglePopup}
      >
        Try On
      </button>
      {isPopupOpen && (
        <div
          ref={popupRef}
          className="fixed inset-0 flex items-center justify-center z-50 w-full h-full text-black"
        >
          <div className="bg-white p-6 rounded-lg shadow-2xl w-3/5">
            <div className="flex gap-8 items-center">
              <div className="p-12">
                <img src={image} className="h-auto rounded-lg shadow-md w-48" />
                <h1 className="text-black font-semibold text-lg">Product Sample</h1>
              </div>
              {selectedImage ? (
                <div>
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="h-auto rounded-lg shadow-md w-48"
                  />
                  <button
                    className="mt-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                    onClick={() => setSelectedImage(null)}
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-4"
                />
              )}
            </div>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              onClick={handleTryOn}
              disabled={loading}
            >
              {loading ? "Processing..." : "Try On"}
            </button>
            {resultImage && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Result</h2>
                <img
                  src={resultImage}
                  alt="Try-On Result"
                  className="h-auto rounded-lg shadow-md w-48"
                />
              </div>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <button
              className="mt-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              onClick={togglePopup}
            >
              Close Popup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TryonPopup;
