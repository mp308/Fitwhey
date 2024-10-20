import React, { useEffect, useState } from 'react';
import { useUserAuth } from '../gobal/UserAuthContext';

function ShowOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All');

    const { user, loading: userLoading } = useUserAuth();

    const handleDeleteOrder = async (orderId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this order?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                alert("Order deleted successfully");
                setOrders(orders.filter(order => order.order_id !== orderId));
            } else {
                throw new Error('Failed to delete order');
            }
        } catch (err) {
            alert(`Error deleting order: ${err.message}`);
        }
    };

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

    const filteredOrders = selectedPaymentStatus === 'All'
        ? orders
        : orders.filter(order =>
            order.payments.length > 0 &&
            order.payments[0].payment_status === selectedPaymentStatus
        );

    return (
        <>
        
                <div className="container mx-auto p-6">
                    <h1 className="text-4xl  mb-6 text-center text-black font-bebas">Orders Overview</h1>

                    <div className="flex space-x-4 mb-6 justify-center">
                        {['All', 'pending', 'failed', 'cancelled', 'ship', 'completed'].map(status => (
                            <button
                                key={status}
                                className={`px-4 py-2 rounded-lg ${selectedPaymentStatus === status ? 'bg-red-600 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
                                onClick={() => setSelectedPaymentStatus(status)}
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
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Shipping Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Payment Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order Items</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-50 divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="10" className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="10" className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                        Error: {error}
                                    </td>
                                </tr>
                            ) : filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.order_id} className="hover:bg-gray-100 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.order_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.UserID}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.full_name || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.shipping_address || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.phone_number || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(order.order_date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">฿{order.total_amount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {order.payments.length > 0 ? order.payments[0].payment_status : 'No payment data'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <ul className="list-disc pl-4">
                                                {order.orderdetails.map((item) => (
                                                    <li key={item.product_id}>
                                                        Product: {item.product_id}, Qty: {item.quantity}, Price: {item.unit_price}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                                                onClick={() => handleDeleteOrder(order.order_id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                                        No orders found for this user.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
     
        </>
    );
}

export default ShowOrders;
