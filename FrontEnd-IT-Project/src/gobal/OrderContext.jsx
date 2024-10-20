import React, { createContext, useState } from 'react';
import axios from 'axios';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState({
    order_id: null,
    userId: '',
    orderDate: '',
    totalAmount: '',
    paymentMethod: ''
  });
  const [message, setMessage] = useState(null);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/orders'); // Ensure correct endpoint
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setMessage('Failed to fetch orders');
    }
  };

  // Fetch order by ID
  const fetchOrderById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/orders/${id}`); // Ensure correct endpoint
      setOrder(response.data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      setMessage('Failed to fetch order');
    }
  };

  // Create a new order
  const createOrder = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/orders', order); // Ensure correct endpoint
      setOrders([...orders, response.data]);
      setMessage('Order created successfully');
      clearForm();
    } catch (error) {
      console.error('Failed to create order:', error);
      setMessage('Failed to create order');
    }
  };

  // Update an existing order
  const updateOrder = async () => {
    try {
      await axios.put(`http://localhost:8080/api/orders/${order.order_id}`, order); // Corrected the URL
      setOrders(orders.map((ord) => (ord.order_id === order.order_id ? order : ord)));
      setMessage('Order updated successfully');
      clearForm();
    } catch (error) {
      console.error('Failed to update order:', error);
      setMessage('Failed to update order');
    }
  };

  // Delete an order
  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:8080/api/orders/${orderId}`); // Corrected the URL
      setOrders(orders.filter((ord) => ord.order_id !== orderId));
      setMessage('Order deleted successfully');
    } catch (error) {
      console.error('Failed to delete order:', error);
      setMessage('Failed to delete order');
    }
  };

  // Edit an order (set it in the form)
  const editOrder = (order) => {
    setOrder(order);
  };

  // Clear the form
  const clearForm = () => {
    setOrder({
      order_id: null,
      userId: '',
      orderDate: '',
      totalAmount: '',
      paymentMethod: ''
    });
    setMessage(null);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        order,
        message,
        fetchOrders,
        fetchOrderById,
        createOrder,
        updateOrder,
        deleteOrder,
        editOrder,
        clearForm,
        setOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
