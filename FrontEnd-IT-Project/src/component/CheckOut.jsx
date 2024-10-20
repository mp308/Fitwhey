import React, { useContext, useState, useEffect } from 'react';
import CartContext from '../gobal/CartContext';
import { useUserAuth } from '../gobal/UserAuthContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const { user } = useUserAuth();
  const [shippingTotal] = useState(100);
  const [paymentMethod, setPaymentMethod] = useState('QR PromptPay');

  // New states for name, address, and phone number
  const [name, setName] = useState(user?.username || '');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const merchandiseSubtotal = getTotalPrice();
  const totalPayment = merchandiseSubtotal + shippingTotal;

  // เรียก fetchHealthInfo เมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    fetchHealthInfo();
  }, []); // [] ทำให้ useEffect เรียกเพียงครั้งเดียวตอนโหลด

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!name || !address || !phoneNumber) {
      alert('Please fill in your shipping details.');
      return;
    }

    if (!user || !user.id) {
      alert('User not authenticated. Please log in.');
      return;
    }

    const orderData = {
      userId: user.id,
      orderDate: new Date().toISOString(),
      items: cart.map(item => ({
        productId: item.product_id,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
      paymentMethod: paymentMethod,
      totalAmount: totalPayment,
      fullName: name,           // Include fullName as per backend schema
      shippingAddress: address, // Include shippingAddress as per backend schema
      phoneNumber: phoneNumber, // Include phoneNumber as per backend schema
    };

    console.log("Order Data:", orderData);

    try {
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Order placed successfully!');
        console.log(data); // View the order response
        clearCart(); // Clear the cart after successful order
        navigate('/Status');
      } else {
        const errorData = await response.json();
        alert(`Failed to place order: ${errorData.message}`);
        console.error('Error:', errorData);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing the order.');
    }
  };

  const fetchHealthInfo = async () => {
    console.log('fetchHealthInfo function called'); // ตรวจสอบว่าฟังก์ชันถูกเรียกหรือไม่
    if (!user || !user.id) {
      alert('User not authenticated. Please log in.');
      return;
    }
  
    try {
      console.log('Fetching health info for user:', user.id);
  
      const response = await fetch(`http://localhost:8080/api/v1/healthinfo/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
  
      console.log('Response status:', response.status); // ดูสถานะการตอบกลับ
      
      if (response.ok) {
        const data = await response.json();
        console.log('Health info fetched successfully:', data); // แสดงข้อมูลที่ดึงมา
        setName(`${data.first_name} ${data.last_name}` || '');
        setAddress(data.address || '');
        setPhoneNumber(data.phone_number || '');
        
      } else {
        const errorData = await response.json();
        console.log('Error fetching health info:', errorData); // แสดงข้อผิดพลาด
        alert('Failed to fetch health info.');
      }
    } catch (error) {
      console.error('Error fetching health info:', error); // แสดงข้อผิดพลาดในกรณีอื่น ๆ
    }
  };

  return (
    <div className='bg-black min-h-screen text-white p-8'>
      <h1 className='text-4xl font-bold mb-8'>CheckOut</h1>

      {/* Delivery Information */}
      <div className='mb-8'>
        <h2 className='text-xl font-bold mb-2'>Delivery Information</h2>
        <div className='mb-4'>
          <label className='block text-gray-300 mb-2'>Full Name</label>
          <input
            type='text'
            className='w-full px-4 py-2 border border-gray-400 rounded-lg bg-gray-800 text-white'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-300 mb-2'>Shipping Address</label>
          <input
            type='text'
            className='w-full px-4 py-2 border border-gray-400 rounded-lg bg-gray-800 text-white'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-300 mb-2'>Phone Number</label>
          <input
            type='text'
            className='w-full px-4 py-2 border border-gray-400 rounded-lg bg-gray-800 text-white'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Cart Items */}
      <table className='w-full text-left mb-8'>
        <thead className='bg-gray-700'>
          <tr>
            <th className='p-4'>Product</th>
            <th className='p-4'>Unit Price</th>
            <th className='p-4'>Quantity</th>
            <th className='p-4'>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => (
            <tr key={item.product_id} className='border-t border-gray-600'>
              <td className='p-4'>{item.name}</td>
              <td className='p-4'>B {item.price}</td>
              <td className='p-4'>{item.quantity}</td>
              <td className='p-4'>B {item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Payment Method */}
      <div className='mb-8 '>
        <h2 className='text-xl font-bold mb-2'>Payment Method</h2>
        <div className='flex space-x-4 mb-4'>
          <button
            className={`bg-gray-700 text-white px-4 py-2 rounded ${
              paymentMethod === 'QR PromptPay' ? 'bg-green-500' : ''
            }`}
            onClick={() => setPaymentMethod('QR PromptPay')}
          >
            QR PromptPay
          </button>
          <button
            className={`bg-gray-700 text-white px-4 py-2 rounded ${
              paymentMethod === 'GooglePlay' ? 'bg-green-500' : ''
            }`}
            onClick={() => setPaymentMethod('GooglePlay')}
          >
            GooglePlay
          </button>
          <button
            className={`bg-gray-700 text-white px-4 py-2 rounded ${
              paymentMethod === 'Credit/Debit' ? 'bg-green-500' : ''
            }`}
            onClick={() => setPaymentMethod('Credit/Debit')}
          >
            Credit/Debit
          </button>
        </div>
        <p>Prompt Pay: 0945541469</p>
      </div>

      {/* Order Summary */}
      <div className='text-right'>
        <p>Merchandise Subtotal: B {merchandiseSubtotal}</p>
        <p>Shipping Total: B {shippingTotal}</p>
        <p className='text-xl font-bold'>Total Payment: B {totalPayment}</p>
        <button
          className='bg-purple-500 text-white px-6 py-2 rounded mt-4'
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>
      </div>

      <p className='mt-4 text-gray-400'>
        By clicking 'Place Order', you state acknowledgment and acceptance of Shopee's Return and Refund policy for this transaction.
      </p>
    </div>
  );
};

export default Checkout;
