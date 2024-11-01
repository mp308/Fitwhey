import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
const ProductContext = createContext();

// Provider component
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({
    product_id: '',  // Will be auto-generated if not provided
    name: '',
    description: '',
    price: '',  // Ensure this is a number before sending
    size: '',
    Nutritional_value: '',
    taste: '',
    CategoryID: '',
    image_url: ''
  });
  const [message, setMessage] = useState('');

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/prod/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setMessage('Failed to fetch products');
    }
  };

  // Function for creating a new product with image (POST)
  const createProductWithImage = async (file) => {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', Number(product.price));  // Ensure price is a number
    formData.append('CategoryID', product.CategoryID);
    formData.append('size', product.size);
    formData.append('Nutritional_value',product.Nutritional_value);
    formData.append('taste', product.taste);
    if (file) {
      formData.append('image', file);  // Append the image file
    } else {
      formData.append('image_url', product.image_url);  // Append the existing image URL
    }

    try {
      await axios.post('http://localhost:8080/api/prod/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Product created successfully!');
      fetchProducts();  // Refresh products after creation
      clearForm();  // Clear form after saving
    } catch (err) {
      console.error('Error creating product:', err);
      setMessage('Error creating product.');
    }
  };

  // Function for updating an existing product (PUT)
  const updateProductWithImage = async (file) => {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', Number(product.price));  // Ensure price is a number
    formData.append('CategoryID', product.CategoryID);
    formData.append('size', product.size);
    formData.append('Nutritional_value',product.Nutritional_value);
    formData.append('taste', product.taste);
    if (file) {
      formData.append('image', file);  // Append the image file
    } else {
      formData.append('image_url', product.image_url);  // Append the existing image URL
    }

    try {
      await axios.put(`http://localhost:8080/api/prod/products/${product.product_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Product updated successfully!');
      fetchProducts();  // Refresh products after update
      clearForm();  // Clear form after saving
    } catch (err) {
      console.error('Error updating product:', err);
      setMessage('Error updating product.');
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/prod/products/${id}`);
      setMessage('Product deleted successfully!');
      fetchProducts();  // Refresh products after deletion
    } catch (err) {
      console.error('Error deleting product:', err);
      setMessage('Error deleting product.');
    }
  };

  // Clear form
  const clearForm = () => {
    setProduct({
      product_id: '',  // Clear product_id so it doesn't send on create
      name: '',
      description: '',
      price: '',
      size: '',
      Nutritional_value: '',
      taste: '',
      CategoryID: '',
      image_url: ''
    });
  };

  // Set product for editing
  const editProduct = (prod) => {
    setProduct(prod);
  };

  // Fetch products when the provider is mounted
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        product,
        message,
        setProduct,
        createProductWithImage,   // Use createProductWithImage for POST
        updateProductWithImage,   // Use updateProductWithImage for PUT
        deleteProduct,
        editProduct,
        clearForm,
        fetchProducts,  // Make sure fetchProducts is available in the context
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
