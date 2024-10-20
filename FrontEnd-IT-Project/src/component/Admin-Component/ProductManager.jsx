import React, { useContext, useState } from 'react';
import ProductContext from '../../gobal/ProductContext';

const ProductManager = () => {
  const {
    products,
    product,
    message,
    setProduct,
    createProductWithImage,   // Create product with image
    updateProductWithImage,   // Update product with image
    deleteProduct,
    editProduct,
    clearForm,
  } = useContext(ProductContext);

  const [image, setImage] = useState(null);  // State to hold the image file
  const [preview, setPreview] = useState(null);  // State to hold the preview URL

  // When user selects a new image, generate a preview URL
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Generate preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (product.product_id) {
      updateProductWithImage(image);  // Update existing product
    } else {
      createProductWithImage(image);  // Create new product
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Product Manager</h2>

      {/* Form for creating or updating a product */}
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
        <input
          type="text"
          placeholder="Category"
          value={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
          required
          className="block w-full p-2 mb-4 border"
        />

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-gray-700">Product Image</label>
          <input
            type="file"
            onChange={handleImageChange}  // Save image file to state and generate preview
            className="block w-full p-2 mb-4 border"
          />
        </div>

        {/* Image Preview */}
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

      {/* Message */}
      {message && <p className="text-green-500 mb-4">{message}</p>}

      {/* Product list */}
      <h3 className="text-xl font-bold mb-4">Products List</h3>
      <table className="table-auto w-full mb-8">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Image</th>  {/* New Image Column */}
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
