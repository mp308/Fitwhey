import React, { useContext, useEffect, useState } from 'react';
import ProductContext from '../gobal/ProductContext';
import CartContext from '../gobal/CartContext'; // Import CartContext
import { Link } from "react-router-dom";

function Product_Main() {
  const { products, fetchProducts } = useContext(ProductContext);
  const { addItemToCart } = useContext(CartContext); // Access addItemToCart from CartContext
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product) => {
    addItemToCart(product, 1);
    alert(`${product.name} has been added to the cart.`);
  };
  
  return (
    <>
      <div className='p-8'>
        {/* Header */}
        <div className='flex flex-row space-x-4 items-center pb-6'>
          <h1 className='text-6xl text-white  font-bebas'>Products</h1>
          <input
            type='text'
            placeholder='Search products...'
            value={searchTerm}
            onChange={handleSearch}
            className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {/* Products Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {filteredProducts.map((product) => (
            <div key={product.product_id} className='bg-[#ffffff] p-4 rounded-lg shadow-lg'>
              <img
                src={`http://localhost:8080${product.image_url}`}
                alt={product.name}
                className='w-[600px] h-[400px] mb-4'
              />
              <h3 className='text-xl font-bold text-white'>{product.name}</h3>
              <p className='text-[#FF7373] text-lg'>{product.price} B</p>
              <div className="flex space-x-2">
                {/* View Details Button */}
                <Link to={`/Products/${product.product_id}`} className='mt-2 bg-[#FF7373] text-white py-2 px-4 rounded'>
                  View Details
                </Link>
                {/* Add to Cart Button */}
                <button
  className='mt-2 bg-green-500 text-white py-2 px-4 rounded'
  onClick={() => handleAddToCart(product)}
>
  Add to Cart
</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Product_Main;
