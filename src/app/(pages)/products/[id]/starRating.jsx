import React, { useState } from "react";
import { Star } from "react-feather";

const StarRatingInput = ({ rating, onRatingChange, mode }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const totalStars = 5;

  const handleClick = (index) => {
    onRatingChange(index + 1); // The rating is index + 1 because index starts at 0
  };

  const handleMouseEnter = (index) => {
    setHoveredRating(index + 1);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => (
        <Star
          key={index}
          className={`h-6 w-6 cursor-pointer ${
            (hoveredRating || rating) > index
              ? "text-purple-500"
              : "text-gray-300"
          }`}
          fill={(hoveredRating || rating) > index ? "#A855F7" : "none"}
          stroke={
            (hoveredRating || rating) > index ? "#A855F7" : "currentColor"
          }
          onClick={() =>{ if(mode!=="read") handleClick(index)}}
          onMouseEnter={() =>{ if(mode!=="read") handleMouseEnter(index)}}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  );
};

export default StarRatingInput;
