import React, { useContext, useState } from 'react';
import CartContext from '../gobal/CartContext';
import { useNavigate } from 'react-router-dom';

const ShoppingCart = () => {
  const { cart, updateItemQuantity, removeMultipleItemsFromCart, getTotalPrice } = useContext(CartContext);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  // Handle selecting individual items
  const handleSelectItem = (product_id) => {
    if (selectedItems.includes(product_id)) {
      setSelectedItems(selectedItems.filter(id => id !== product_id));
    } else {
      setSelectedItems([...selectedItems, product_id]);
    }
  };

  // Handle selecting or unselecting all items
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);  // Unselect all
      setSelectAll(false);
    } else {
      const allIds = cart.map(item => item.product_id);  // Select all product IDs
      setSelectedItems(allIds);
      setSelectAll(true);
    }
  };

  // Handle deleting selected items
  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) {
      alert("Please select items to delete.");
      return;
    }

    // Remove selected items from the cart
    removeMultipleItemsFromCart(selectedItems);

    // Clear selection after deleting
    setSelectedItems([]);
    setSelectAll(false);
  };

  // Handle updating item quantity
  const handleUpdateQuantity = (product_id, amount) => {
    const item = cart.find(item => item.product_id === product_id);
    if (item) {
      const newQuantity = item.quantity + amount;
      if (newQuantity <= 0) {
        removeMultipleItemsFromCart([product_id]);
        setSelectedItems(selectedItems.filter(id => id !== product_id));
      } else {
        updateItemQuantity(product_id, newQuantity);
      }
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className='bg-[#f1eeee] min-h-screen text-black p-8'>
      <h1 className='text-4xl font-bold mb-8'>Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table className='w-full text-left'>
            <thead className='bg-red-600 text-white'>
              <tr>
                <th className='p-4'>
                  <input 
                    type="checkbox" 
                    className='mr-2 ' 
                    checked={selectAll} 
                    onChange={handleSelectAll}  // Select all or unselect all
                  /> 
                  Product
                </th>
                <th className='p-4 text-white'>Unit Price</th>
                <th className='p-4 text-white'>Quantity</th>
                <th className='p-4 text-white'>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.product_id} className='border-t border-gray-600'>
                  <td className='p-4 '>
                    <input 
                      type="checkbox" 
                      className='mr-2' 
                      checked={selectedItems.includes(item.product_id)}  // Check if the item is selected
                      onChange={() => handleSelectItem(item.product_id)}  // Handle individual selection
                    />
                    {item.name}
                  </td>
                  <td className='p-4'>B {item.price}</td>
                  <td className='p-4'>
                    <button 
                      onClick={() => handleUpdateQuantity(item.product_id, -1)} 
                      className='px-2 py-1 bg-red-600 text-white rounded mr-2'
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    {item.quantity}
                    <button 
                      onClick={() => handleUpdateQuantity(item.product_id, 1)} 
                      className='px-2 py-1 bg-red-600 text-white rounded ml-2'
                    >
                      +
                    </button>
                  </td>
                  <td className='p-4'>B {item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className='flex justify-between items-center mt-8'>
            <div>
              <button 
                onClick={handleDeleteSelected}  // Handle deleting selected items
                className={`bg-red-500 text-white px-4 py-2 rounded ${selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={selectedItems.length === 0}  // Disable the button if no items are selected
              >
                Delete Selected
              </button>
            </div>
            <div className='text-lg'>
              Total ({cart.length} items): <span className='font-bold'>B {getTotalPrice()}</span>
              <button 
                className='ml-4 bg-blue-500 text-white px-4 py-2 rounded'
                onClick={handleCheckout}  // Handle checkout
              >
                Check Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;
