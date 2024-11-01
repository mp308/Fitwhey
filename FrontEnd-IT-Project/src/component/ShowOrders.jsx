import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../gobal/UserAuthContext';

function ShowOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('All');
  const { user, loading: userLoading } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!user || !user.id) {
          throw new Error('User is not authenticated or no user ID available.');
        }

        const response = await fetch(`http://localhost:8080/api/orders/byuser/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch orders');
        }

        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading && user) {
      fetchOrders();
    }
  }, [user, userLoading]);

  const filteredOrders = selectedOrderStatus === 'All'
    ? orders
    : orders.filter(order => order.order_status === selectedOrderStatus);

  // Function to navigate to order details
  const handleViewOrderDetails = (orderId) => {
    navigate(`/order-details/${orderId}`);
  };

  return (
    <>
      <div className="container mx-auto p-6">
        <h1 className="text-4xl mb-6 text-center text-black font-bebas">Orders Overview</h1>

        {/* Filter by Order Status */}
        <div className="flex space-x-4 mb-6 justify-center">
          {['All', 'processing', 'completed', 'cancelled', 'shipping', 'contactadmin', 'failed'].map(status => (
            <button
              key={status}
              className={`px-4 py-2 rounded-lg ${selectedOrderStatus === status ? 'bg-red-600 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
              onClick={() => setSelectedOrderStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Full Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Payment Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-50 divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">Error: {error}</td>
              </tr>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <tr key={order.order_id} className="hover:bg-gray-100 transition">
                  <td className="px-6 py-4 text-sm text-gray-900">{order.order_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.UserID}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.full_name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">฿{order.total_amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.payments.length > 0 ? order.payments[0].payment_status : 'No payment data'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.order_status}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <button
                      className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                      onClick={() => handleViewOrderDetails(order.order_id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">No orders found for this user.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ShowOrders;
