import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function OrderDetails() {
    const { orderId } = useParams(); // Receive orderId from URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false); // Toggle edit mode
    const [editPayment, setEditPayment] = useState({
        paymentDate: '',
        amount: '',
        paymentMethod: '',
        paymentStatus: '',
        remark: '',
        paymentImage: null // Add state for payment image
    });

    // Fetch order details function
    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch order details');
            }

            setOrder(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    // Update local state with selected payment details for editing
    const handleEditClick = (payment) => {
        setEditPayment({
            paymentDate: payment.payment_date,
            amount: payment.amount,
            paymentMethod: payment.payment_method,
            paymentStatus: payment.payment_status,
            remark: payment.remark,
            paymentImage: null // Reset payment image when starting to edit
        });
        setEditMode(true);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditPayment((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file input change for image upload
    const handleFileChange = (e) => {
        setEditPayment((prev) => ({ ...prev, paymentImage: e.target.files[0] }));
    };

    // Handle payment update form submission with image upload
    const handleUpdatePayment = async (paymentId) => {
        const formData = new FormData();
        formData.append('PaymentDate', editPayment.paymentDate);
        formData.append('Amount', editPayment.amount);
        formData.append('PaymentMethod', editPayment.paymentMethod);
        formData.append('payment_status', editPayment.paymentStatus);
        formData.append('remark', editPayment.remark);

        // Append image file if selected
        if (editPayment.paymentImage) {
            formData.append('paymentImage', editPayment.paymentImage);
        }

        try {
            const response = await fetch(`http://localhost:8080/api/payments/${paymentId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: formData
            });

            if (response.ok) {
                alert('Payment updated successfully!');
                setEditMode(false);
                // Fetch the updated order details to reflect changes
                await fetchOrderDetails(); // Call fetchOrderDetails to reload the updated payment data
            } else {
                const errorData = await response.json();
                alert(`Failed to update payment: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error updating payment:', error);
            alert('An error occurred while updating the payment.');
        }
    };

    // URL for generating QR Code from PromptPay.io
    const generateQrCodeUrl = (phoneNumber, amount) => {
        return `https://promptpay.io/${phoneNumber}/${amount}.png`;
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl mb-6 text-center text-black font-bebas">Order Details</h1>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">Error: {error}</p>
            ) : order ? (
                <div className="bg-white p-6 shadow-lg rounded-lg">
                    <p><strong>Order ID:</strong> {order.order_id}</p>
                    <p><strong>Customer ID:</strong> {order.UserID}</p>
                    <p><strong>Full Name:</strong> {order.full_name || 'N/A'}</p>
                    <p><strong>Total Amount:</strong> ฿{order.total_amount}</p>
                    <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
                    <p><strong>Shipping Address:</strong> {order.shipping_address || 'N/A'}</p>
                    <p><strong>Order status:</strong> {order.order_status}</p>

                    {/* Order Items */}
                    <h2 className="text-2xl font-bold mt-4">Order Items</h2>
                    <ul className="list-disc list-inside">
                        {order.orderdetails && order.orderdetails.length > 0 ? (
                            order.orderdetails.map(item => (
                                <li key={item.product_id} className="my-2">
                                    <p><strong>Product ID:</strong> {item.product_id}</p>
                                    <p><strong>Quantity:</strong> {item.quantity}</p>
                                    <p><strong>Unit Price:</strong> ฿{item.unit_price}</p>
                                    <p><strong>Total:</strong> ฿{(item.unit_price * item.quantity).toFixed(2)}</p>
                                </li>
                            ))
                        ) : (
                            <p>No items in this order.</p>
                        )}
                    </ul>

                    {/* Payment Details */}
                    <h2 className="text-2xl font-bold mt-4">Payment Details</h2>
                    {order.payments && order.payments.length > 0 ? (
                        order.payments.map(payment => (
                            <div key={payment.payment_id} className="my-2">
                                <p><strong>Payment ID:</strong> {payment.payment_id}</p>
                                <p><strong>Amount:</strong> ฿{payment.amount}</p>
                                <p><strong>Status:</strong> {payment.payment_status}</p>
                                <p><strong>Date:</strong> {new Date(payment.payment_date).toLocaleDateString()}</p>
                                <p><strong>Payment Method:</strong> {payment.payment_method || 'N/A'}</p>
                                {payment.payment_Image && (
                                    <img
                                        src={`http://localhost:8080${payment.payment_Image}`}
                                        alt="Payment Proof"
                                        className="w-32 h-32 mt-2"
                                    />
                                )}
                                <button
                                    className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
                                    onClick={() => handleEditClick(payment)}
                                >
                                    Edit Payment
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No payment details available.</p>
                    )}

                    {/* Edit Payment Form */}
                    {editMode && (
                        <div className="mt-4">
                            <h2 className="text-2xl font-bold">Edit Payment</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleUpdatePayment(order.payments[0].payment_id);
                                }}
                                className="space-y-4"
                            >
                                <label>
                                    Payment Date:
                                    <input
                                        type="date"
                                        name="paymentDate"
                                        value={editPayment.paymentDate}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border"
                                    />
                                </label>
                                <label>
                                    Amount:
                                    <input
                                        type="number"
                                        name="amount"
                                        value={editPayment.amount}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border"
                                    />
                                </label>
                                <label>
                                    Payment Method:
                                    <input
                                        type="text"
                                        name="paymentMethod"
                                        value={editPayment.paymentMethod}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border"
                                    />
                                </label>
                                <label>
                                    Payment Status:
                                    <input
                                        type="text"
                                        name="paymentStatus"
                                        value={editPayment.paymentStatus}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border"
                                    />
                                </label>
                                <label>
                                    Remark:
                                    <textarea
                                        name="remark"
                                        value={editPayment.remark}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border"
                                    ></textarea>
                                </label>
                                <label>
                                    Payment Image:
                                    <input
                                        type="file"
                                        name="paymentImage"
                                        onChange={handleFileChange}
                                        className="w-full p-2 border"
                                    />
                                </label>
                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    )}

                    {/* QR Code for Payment */}
                    <div className="ml-8 flex flex-col items-end mt-4">
                        <h2 className="text-2xl font-bold mb-4">PromptPay QR Code</h2>
                        {order?.total_amount && (
                            <img
                                src={generateQrCodeUrl("0945541469", order.total_amount)}
                                alt="PromptPay QR Code"
                                width="200"
                                height="200"
                                className="self-end"
                            />
                        )}
                        <p className="text-right">Amount to Pay: ฿{order?.total_amount || 'N/A'}</p>
                    </div>
                </div>
            ) : (
                <p>No order details available.</p>
            )}
        </div>
    );
}

export default OrderDetails;
