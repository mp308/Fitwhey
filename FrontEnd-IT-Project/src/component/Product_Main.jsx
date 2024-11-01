import React, { useContext, useEffect, useState } from 'react';
import ProductContext from '../gobal/ProductContext';
import CartContext from '../gobal/CartContext';
import { Link, useLocation } from "react-router-dom";
import axios from 'axios';

function Product_Main() {
  const { products, fetchProducts } = useContext(ProductContext);
  const { addItemToCart } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const location = useLocation();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set items per page here

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts]);

  useEffect(() => {
    if (location.state && location.state.selectedCategory) {
      setSelectedCategories([location.state.selectedCategory]);
    }
  }, [location.state]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/category');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    const categoryId = parseInt(event.target.value);
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.includes(categoryId)
        ? prevSelectedCategories.filter((id) => id !== categoryId)
        : [...prevSelectedCategories, categoryId]
    );
  };

  // Filter products based on search term and selected categories
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategories.length === 0 || selectedCategories.includes(product.CategoryID))
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Get products for the current page
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleAddToCart = (product) => {
    addItemToCart(product, 1);
    alert(`${product.name} has been added to the cart.`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-8">
      <div className="flex flex-row">
        {/* Categories Sidebar */}
        <div className="w-1/6 pr-4">
          <h2 className="text-lg font-bold text-gray-700 mb-4">หมวดหมู่</h2>
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            value={searchTerm}
            onChange={handleSearch}
            className="mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
          <div className="flex flex-col space-y-2">
            {categories.map((category) => (
              <label key={category.CategoriesID} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={category.CategoriesID}
                  checked={selectedCategories.includes(category.CategoriesID)}
                  onChange={handleCategoryChange}
                  className="form-checkbox"
                />
                <span>{category.CategoriesName}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div className="w-5/6">
          <h1 className="text-4xl font-bold text-black pb-6">PRODUCT</h1>

          {/* Products List */}
          <div className="space-y-4">
            {currentProducts.map((product) => (
              <div key={product.product_id} className="flex p-4 bg-white rounded-lg shadow-md">
                {/* Image Section */}
                <div className="relative w-32 h-32 mr-4">
                  <img
                    src={`http://localhost:8080${product.image_url}`}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Product Details Section */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-black">{product.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-red-600 text-2xl font-bold">{product.price} B</span>
                  </div>
                  <p className="text-gray-700 text-sm my-2">
                    รายละเอียดของสินค้าหรือข้อมูลเพิ่มเติมเกี่ยวกับสินค้า
                  </p>
                  <div className="flex space-x-2">
                    <Link to={`/Products/${product.product_id}`} className="bg-blue-500 text-white py-2 px-4 rounded">
                      View Details
                    </Link>
                    <button
                      className="bg-green-500 text-white py-2 px-4 rounded"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 space-x-4">
            <button
              className={`text-blue-500 ${currentPage === 1 && "opacity-50 cursor-not-allowed"}`}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt; PREVIOUS
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`px-3 py-1 rounded ${currentPage === page ? "bg-blue-500 text-white" : "bg-white text-blue-500 border border-blue-500"}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              className={`text-blue-500 ${currentPage === totalPages && "opacity-50 cursor-not-allowed"}`}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              NEXT &gt;
            </button>
          </div>
          <p className="text-center mt-4 text-gray-500">ทั้งหมด {filteredProducts.length} รายการ</p>
        </div>
      </div>
    </div>
  );
}

export default Product_Main;
