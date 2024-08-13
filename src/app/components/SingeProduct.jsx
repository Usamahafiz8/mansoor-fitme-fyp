import axios from 'axios'
import Image from 'next/image'

import StarRatingInput from '../(pages)/products/[id]/starRating'
import Link from 'next/link'
export default function SingleProduct({
  link,
  imgSrc,
  price,
  onAddToCart,
  isInCart,
  product,
}) {

  return (
    <div className="flex flex-col border border-gray-200 shadow-md shadow-purple-300 p-6 rounded-md">
      <Link href={`/products/${product._id}`} passHref>
        <div className="group cursor-pointer">
          <div className="relative w-full min-h-72 md:h-auto rounded-lg overflow-hidden">
            <Image
              width={300}
              height={500}
              layout="responsive"
              src={
                product?.images[0] ||
                "https://oldnavy.gap.com/webcontent/0052/539/840/cn52539840.jpg"
              }
              alt=""
              className="w-24 min-h-60 max-h-60 object-contain  hover:opacity-75"
            />
          </div>
          <h3 className=" text-sm text-gray-700 line-clamp-1 hover:text-gray-900">
            {product.name}
          </h3>
          {product.reviews?.length > 0 ? (
            <div className="flex items-center">
              <StarRatingInput
                rating={
                  product?.reviews?.reduce(
                    (sum, review) => sum + review.rating,
                    0
                  ) / product?.reviews?.length || 0
                }
                mode={"read"}
              />
            </div>
          ) : (
            <div className="flex items-center gap-x-1">
              <StarRatingInput
                rating={0}
                mode={"read"}
                className="text-gray-300 h-5 w-5 flex-shrink-0"
              />
              No Reviews
            </div>
          )}
          <p className="mt-1 text-lg font-medium text-gray-900">
            $ {product.price}
          </p>
        </div>
      </Link>

      <button
        disabled={product.quantity == 0}
        className="relative flex bg-gray-200 border border-transparent rounded-md py-2 px-8 items-center justify-center text-sm font-medium text-gray-900 hover:bg-gray-300"
        onClick={() => onAddToCart(product)}>
        {product.quantity > 0 ? "Add to bag" : "Out of Stock"}
      </button>
    </div>
  );
}
