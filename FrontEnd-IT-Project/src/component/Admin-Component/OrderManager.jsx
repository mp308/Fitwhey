import React, { useEffect, useState } from 'react';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Fetch orders when the component mounts
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle Delete
  const handleDelete = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setOrders(orders.filter((order) => order.order_id !== orderId));
      } else {
        throw new Error('Failed to delete the order');
      }
    } catch (err) {
      console.error(err.message);
      alert(`Error: ${err.message}`);
    }
  };

  // Handle Edit
  const handleEditClick = (order) => {
    setEditingOrderId(order.order_id);
    const formData = {
      order_id: order.order_id,
      UserID: order.UserID,
      order_date: new Date(order.order_date).toISOString().split('T')[0],
      total_amount: order.total_amount,
      payment_status: order.payments?.[0]?.payment_status || '',
      full_name: order.full_name,
      shipping_address: order.shipping_address,
      phone_number: order.phone_number,
      order_status: order.order_status || 'processing',
      orderdetails: order.orderdetails?.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })) || []
    };
    setEditFormData(formData);
  };

  // Handle Edit Form Change
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Handle Item Change
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...editFormData.orderdetails];
    updatedItems[index] = { ...updatedItems[index], [name]: value };
    setEditFormData({
      ...editFormData,
      orderdetails: updatedItems,
    });
  };

  // Handle Submit Edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.total_amount || !editFormData.payment_status) {
      alert('Please provide valid values for Total Amount and Payment Status.');
      return;
    }
    
    const updatedData = {
      userId: editFormData.UserID,
      orderDate: new Date(editFormData.order_date).toISOString(),
      fullName: editFormData.full_name,
      shippingAddress: editFormData.shipping_address,
      phoneNumber: editFormData.phone_number,
      orderStatus: editFormData.order_status,
      items: editFormData.orderdetails?.map(item => ({
        productId: item.product_id,
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.unit_price)
      })) || [],
      payment_status: editFormData.payment_status,
      totalAmount: parseFloat(editFormData.total_amount)
    };

    try {
      const response = await fetch(`http://localhost:8080/api/orders/${editingOrderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        await fetchOrders();
        setEditingOrderId(null);
      } else {
        const errorResult = await response.json();
        console.error('Error Response:', errorResult);
        throw new Error('Failed to update the order');
      }
    } catch (err) {
      console.error('Catch Error:', err.message);
      alert(`Error: ${err.message}`);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingOrderId(null);
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <table className="table-auto w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Order ID</th>
            <th className="px-4 py-2">Customer ID</th>
            <th className="px-4 py-2">Order Date</th>
            <th className="px-4 py-2">Total Amount</th>
            <th className="px-4 py-2">Payment Status</th>
            <th className="px-4 py-2">Order Status</th>
            <th className="px-4 py-2">Full Name</th>
            <th className="px-4 py-2">Shipping Address</th>
            <th className="px-4 py-2">Phone Number</th>
            <th className="px-4 py-2">Order Items</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id} className="border-t">
              <td className="px-4 py-2">{order.order_id}</td>
              <td className="px-4 py-2">{order.UserID || "N/A"}</td>
              <td className="px-4 py-2">
                {order.order_date ? new Date(order.order_date).toLocaleDateString() : 'Invalid Date'}
              </td>
              <td className="px-4 py-2">{order.total_amount || 0}</td>
              <td className="px-4 py-2">
                {order.payments?.length > 0
                  ? order.payments[0].payment_status
                  : 'No payment data'}
              </td>
              <td className="px-4 py-2">{order.order_status || 'N/A'}</td>
              <td className="px-4 py-2">{order.full_name || 'N/A'}</td>
              <td className="px-4 py-2">{order.shipping_address || 'N/A'}</td>
              <td className="px-4 py-2">{order.phone_number || 'N/A'}</td>
              <td className="px-4 py-2">
                {order.orderdetails?.length > 0 ? (
                  <ul>
                    {order.orderdetails.map((item, index) => (
                      <li key={`${item.product_id}-${index}`}>
                        Product: {item.product_id}, Quantity: {item.quantity}, Unit Price: {item.unit_price}
                      </li>
                    ))}
                  </ul>
                ) : (
                  'No items found'
                )}
              </td>
              <td className="px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => handleEditClick(order)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleDelete(order.order_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingOrderId && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">Edit Order</h2>
          <form onSubmit={handleEditSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Order Status</label>
              <select
                name="order_status"
                value={editFormData.order_status}
                onChange={handleEditFormChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="processing">processing</option>
                <option value="completed">completed</option>
                <option value="cancelled">cancelled</option>
                <option value="shipping">shipping</option>
                <option value="contactadmin">contactadmin</option>
                <option value="failed">failed</option>
              </select>
            </div>
            {/* Other form fields like Total Amount, Payment Status, etc. */}
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
            <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded ml-2" onClick={handleCancelEdit}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default OrderManager;
