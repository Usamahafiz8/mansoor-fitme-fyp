import { useCart } from '../context/CartContext';
import SingleProduct from './SingeProduct'

export default function ProductsGrid({ products, onAddToCart }) {
	 const { state: cart, dispatch: cartDispatch } = useCart();

  return (
    <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mb-6 ">
      {products.map((product) => (
        <SingleProduct
          key={product._id}
          imgSrc={product.images[0]}
          price={product.price}
          product={product}
          link={`/products/${product._id}`}
          onAddToCart={() => onAddToCart(product)}
          isInCart={cart?.products.some((p) => p.id === product._id)}
        />
      ))}
    </div>
  );
}
