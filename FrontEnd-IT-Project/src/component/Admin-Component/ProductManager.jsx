import React, { useContext, useEffect, useState } from 'react';
import ProductContext from '../../gobal/ProductContext';
import axios from 'axios';

const ProductManager = () => {
  const {
    products,
    product,
    message,
    setProduct,
    createProductWithImage,
    updateProductWithImage,
    deleteProduct,
    editProduct,
    clearForm,
  } = useContext(ProductContext);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]); // State for categories list

  // Fetch categories from the API on component load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/category');
        setCategories(response.data); // Set categories to state
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (product.product_id) {
      updateProductWithImage(image);
    } else {
      createProductWithImage(image);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Product Manager</h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          placeholder="Product Name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          required
          className="block w-full p-2 mb-4 border"
        />
        <input
          type="text"
          placeholder="Description"
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          required
          className="block w-full p-2 mb-4 border"
        />
        <input
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          required
          className="block w-full p-2 mb-4 border"
        />

        {/* Dropdown for Category Selection */}
        <select
          value={product.CategoryID || ''}
          onChange={(e) => setProduct({ ...product, CategoryID: e.target.value })}
          required
          className="block w-full p-2 mb-4 border"
        >
          <option value="" disabled>Select Category</option>
          {categories.map((category) => (
            <option key={category.CategoriesID} value={category.CategoriesID}>
              {category.CategoriesName}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Nutritional_value"
          value={product.Nutritional_value}
          onChange={(e) => setProduct({ ...product, Nutritional_value: e.target.value })}
          required
          className="block w-full p-2 mb-4 border"
        />
        <input
          type="text"
          placeholder="taste"
          value={product.taste}
          onChange={(e) => setProduct({ ...product, taste: e.target.value })}
          required
          className="block w-full p-2 mb-4 border"
        />
        <input
          type="text"
          placeholder="size"
          value={product.size}
          onChange={(e) => setProduct({ ...product, size: e.target.value })}
          required
          className="block w-full p-2 mb-4 border"
        />

        <div className="mb-4">
          <label className="block text-gray-700">Product Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="block w-full p-2 mb-4 border"
          />
        </div>

        {preview && (
          <div className="mb-4">
            <p className="text-gray-700">Image Preview:</p>
            <img src={preview} alt="Preview" className="w-32 h-32 object-cover" />
          </div>
        )}

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {product.product_id ? 'Update Product' : 'Create Product'}
        </button>
        <button type="button" onClick={clearForm} className="bg-gray-500 text-white p-2 rounded ml-2">
          Clear
        </button>
      </form>

      {message && <p className="text-green-500 mb-4">{message}</p>}

      <h3 className="text-xl font-bold mb-4">Products List</h3>
      <table className="table-auto w-full mb-8">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.product_id}>
              <td className="border px-4 py-2">{prod.product_id}</td>
              <td className="border px-4 py-2">{prod.name}</td>
              <td className="border px-4 py-2">{prod.price}</td>
              <td className="border px-4 py-2">
                {prod.image_url ? (
                  <img src={`http://localhost:8080${prod.image_url}`} alt={prod.name} className="w-20 h-20 object-cover" />
                ) : (
                  <p>No image</p>
                )}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => editProduct(prod)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(prod.product_id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManager;
