'use client'
import { useState, useEffect } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import StarRatingInput from "./starRating";
import { useCart } from "@/app/context/CartContext";
import TryonPopup from "@/app/components/TryonPopup";

const ProductDetails = () => {
  const { state: cartState, dispatch: cartDispatch } = useCart();
  console.log("cartState",cartState)
  const router = useParams();
  const id  = router.id // Get productId from the URL
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 0,
    review: "",
  });
  const [selectedImageIndex,SetImage]= useState(0)
  useEffect(() => {
    if (id) {
      // Fetch product details
      getProducts()

    }
  }, [id]);

  const getProducts = ()=>{
     axios.get(`/api/products/${id}`).then((response) => {
       setProduct(response.data);
       setReviews(response.data.reviews || []);
     });
  }
 useEffect(() => {
   localStorage.setItem("cart", JSON.stringify(cartState));
 }, [product]);
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    console.log("res",reviews)
    axios
      .put(`/api/products/${id}/reviews`, {
        reviews: [
          ...reviews,
          {
            ...newReview,
            date: new Date().toLocaleDateString("en-US", options),
          },
        ],
      })
      .then((response) => {
        setReviews([...reviews, response.data]);
        setNewReview({ name: "", rating: 0, review: "" });
        getProducts()
      })
      .catch((error) => {
        console.error("There was an error submitting the review!", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prevReview) => ({ ...prevReview, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setNewReview((prevReview) => ({ ...prevReview, rating }));
  };
   const addToCart = async (product, quantity = 1) => {
     const existingProductIndex = cartState.products.findIndex(
       (item) => item._id === product._id
     );

     if (existingProductIndex !== -1) {
       // If product exists in the cart, update its quantity
       const updatedProducts = cartState.products.map((item, index) => {
         if (index === existingProductIndex) {
           return {
             ...item,
             quantity: item.quantity + quantity,
           };
         }
         return item;
       });

       cartDispatch({
         type: "ADD_PRODUCTS",
         payload: { ...cartState, products: updatedProducts },
       });
     } else {
       // If product does not exist in the cart, add it to the existing cart array
       const updatedProducts = [
         ...cartState.products,
         { ...product, quantity: 1 },
       ];

       cartDispatch({
         type: "ADD_PRODUCTS",
         payload: { ...cartState, products: updatedProducts },
       });
     }
     // Reduce the product quantity in the local state
     axios
       .put(`/api/products/${product._id}`, {
         quantity: product.quantity - 1,
       })
       .then((response) => {
         getProducts();
       })
       .catch((error) => {
         console.error("There was an error submitting the review!", error);
       });
     product.quantity -= quantity;
   };
  if (!product) return <div className="min-h-screen w-full bg-white text-black m-auto">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <img
            src={product?.images[selectedImageIndex]}
            alt={`Product image `}
            className="w-full h-auto rounded-lg shadow-md"
          />
          <div className="flex h-24  gap-4 rounded-md overflow-auto">
            {product?.images?.map((image, index) => {
              if (index !== selectedImageIndex)
                return (
                  <img
                    key={index}
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className=" h-auto rounded-lg shadow-md w-24"
                    onClick={() => SetImage(index)}
                  />
                );
            })}
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-xl font-semibold text-gray-800">
            ${product.price}
          </p>
          <div className=" flex items-center gap-10">
            <StarRatingInput
              rating={
                reviews?.reduce((sum, review) => sum + review.rating, 0) /
                  reviews?.length || 0
              }
              mode={"read"}
            />{" "}
            <p className="text-[#A855F7]">
              {product?.reviews?.length || 0} reviews
            </p>{" "}
          </div>
          <p className=" text-gray-700">{product.description}</p>

          <button
            onClick={() => {
              if (product.quantity > 0) addToCart(product);
            }}
            className={`w-1/3 ${
              product.quantity > 0
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-[#dddd] text-[#bbbb]"
            } mr-10 py-2 px-4 rounded-lg `}
            disabled={product?.quantity == 0}>
            {product.quantity > 0 ? "Add to Bag" : "Out of Stock"}
          </button>
          <TryonPopup image={product?.images[selectedImageIndex]}/>
          
          <p className=" text-gray-700">
            Brand:{" "}
            <span className="text-[#A855F7]">
              {product?.brand?.brandInfo?.brandName}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900">
          Customer Reviews
        </h2>
        <div className="space-y-4 mt-4">
          {reviews?.map((review, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200 space-y-2">
              <StarRatingInput rating={review?.rating} mode={"read"} />
              <p className="text-gray-600 font-semibold">
                {review?.name}{" "}
                <span className=" font-normal"> - {review?.date}</span>
              </p>

              <p style={{ fontStyle: "italic" }} className="text-gray-600">
                {review?.review}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900">Add a Review</h2>
        <form
          onSubmit={handleReviewSubmit}
          className="bg-white shadow-md rounded-lg p-6 mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={newReview.name}
              onChange={handleInputChange}
              required
              className="mt-1 block text-black w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <StarRatingInput
              rating={newReview.rating}
              onRatingChange={handleRatingChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Comment
            </label>
            <textarea
              name="review"
              value={newReview.review}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full text-black p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductDetails;
