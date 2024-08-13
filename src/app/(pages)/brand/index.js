// pages/brand/index.js
import { useState, useEffect } from "react";
import axios from "axios";

const BrandPortal = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get("/api/products");
      setProducts(res.data.data);
    };

    fetchProducts();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await axios.post("/api/products", Object.fromEntries(formData));
    setProducts([...products, formData]);
  };

  return (
    <div className="brand-portal">
      <h1>Brand Portal</h1>
      <form onSubmit={addProduct}>
        <input type="text" name="name" placeholder="Product Name" required />
        <textarea
          name="description"
          placeholder="Product Description"
          required></textarea>
        <input
          type="number"
          name="price"
          placeholder="Product Price"
          required
        />
        <input
          type="text"
          name="sizes"
          placeholder="Sizes (comma separated)"
          required
        />
        <input
          type="text"
          name="colors"
          placeholder="Colors (comma separated)"
          required
        />
        <input type="file" name="image" required />
        <button type="submit">Add Product</button>
      </form>
      <div className="products">
        {products.map((product) => (
          <div key={product._id} className="product">
            <img src={product.image} alt={product.name} />
            <h2>{product.name}</h2>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandPortal;
