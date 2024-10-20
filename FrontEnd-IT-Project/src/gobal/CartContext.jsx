import React, { createContext, useState, useEffect } from 'react';
import { useUserAuth } from '../gobal/UserAuthContext'; // Assuming you have an Auth context

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useUserAuth(); // Assuming `user` contains user details, including `user_id` or `username`
  const [cart, setCart] = useState([]);

  // Function to get cart data from localStorage for the current user
  useEffect(() => {
    if (user) {
      const storedCart = localStorage.getItem(`cartItems_${user.username}`);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      } else {
        setCart([]); // Clear cart if no stored cart found for the new user
      }
    } else {
      setCart([]); // Clear cart if no user is logged in
    }
  }, [user]);

  // Save the cart in localStorage when it updates for the current user
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cartItems_${user.username}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  // Add single item to the cart
  const addItemToCart = (product, quantity) => {
    const existingItem = cart.find(item => item.product_id === product.product_id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.product_id === product.product_id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  // Remove single item from the cart
  const removeItemFromCart = (product_id) => {
    setCart(cart.filter(item => item.product_id !== product_id));
  };

  // Remove multiple items from the cart at once
  const removeMultipleItemsFromCart = (product_ids) => {
    setCart(cart.filter(item => !product_ids.includes(item.product_id)));
  };

  // Update quantity of a specific item
  const updateItemQuantity = (product_id, quantity) => {
    setCart(cart.map(item =>
      item.product_id === product_id ? { ...item, quantity } : item
    ));
  };

  // Get total price of items in the cart
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Clear the cart for the current user
  const clearCart = () => {
    setCart([]); // Clear the state
    if (user) {
      localStorage.removeItem(`cartItems_${user.username}`); // Clear localStorage for the current user
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      addItemToCart,
      removeItemFromCart,
      removeMultipleItemsFromCart,  // New function for removing multiple items
      updateItemQuantity,
      getTotalPrice,
      clearCart,  // Added the clearCart function
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
