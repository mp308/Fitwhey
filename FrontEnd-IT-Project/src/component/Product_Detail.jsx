import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To access the product ID from the URL
import axios from 'axios';

function ProductDetail() {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null); // To store error message

  // Fetch product details by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/prod/products/${id}`);
        if (response.data) {
          setProduct(response.data); // Set the fetched product data
        } else {
          setError("Product not found"); // Set error if no product data
        }
      } catch (error) {
        setError("Product not found"); // Set error message if request fails
      }
    };

    fetchProduct();
  }, [id]);

  // If there's an error (e.g., product not found), display the error message
  if (error) {
    return <div className="text-red-500 text-2xl p-8">Not Found</div>;
  }

  // If product is still being fetched, show loading
  if (!product) {
    return <div>Loading...</div>;
  }

  // If product exists, display the product details
  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
      <img src={`http://localhost:8080${product.image_url}`} alt={product.name} className="w-64 h-64 object-cover" />
      <p className="text-lg mt-4">Price: {product.price} B</p>
      <p className="text-lg mt-4">Description: {product.description}</p>
      <p className="text-lg mt-4">Category: {product.category}</p>
    </div>
  );
}

export default ProductDetail;
