import React, { useContext, useState, useEffect } from 'react';
import CartContext from '../gobal/CartContext';
import { useUserAuth } from '../gobal/UserAuthContext';
import { useNavigate } from 'react-router-dom';

import EMS from '../assets/images/ems.jpg'
import KERRY from '../assets/images/kerry.jpg'

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const { user } = useUserAuth();
  const [paymentMethod, setPaymentMethod] = useState('QR PromptPay');

  // New states for name, address, and phone number
  const [name, setName] = useState(user?.username || '');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // State for user discounts
  const [userDiscounts, setUserDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null); // Selected discount
  const [discountAmount, setDiscountAmount] = useState(0); // Discount amount

  // New states for shipping method
  const [shippingMethod, setShippingMethod] = useState('ems');
  const [shippingTotal, setShippingTotal] = useState(100);

  const [totalPayment, setTotalPayment] = useState(0); // Total payment

  const merchandiseSubtotal = getTotalPrice();

  useEffect(() => {
    fetchHealthInfo();
    fetchUserDiscounts(); // Fetch user discounts
  }, [user]);

  // Update total payment when any of these values change
  useEffect(() => {
    const updatedTotal = merchandiseSubtotal - discountAmount + shippingTotal;
    setTotalPayment(Math.max(updatedTotal, 0)); // Ensure the total is not negative
}, [merchandiseSubtotal, discountAmount, shippingTotal, selectedDiscount]); // เพิ่ม selectedDiscount ใน dependencies

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
      fullName: name,
      shippingAddress: address,
      phoneNumber: phoneNumber,
      discount_id: selectedDiscount ? selectedDiscount.discount.discount_id : null,  // บันทึก discount_id
      discount_amount: discountAmount,  // บันทึก discount_amount
      final_amount: totalPayment,  // บันทึก final_amount
      original_amount: merchandiseSubtotal,  // บันทึก original_amount
      shipping_method: shippingMethod,  // บันทึกวิธีการส่งสินค้า
      shipping_price: shippingTotal,  // บันทึกค่าส่งสินค้า
    };

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

        if (selectedDiscount) {
          const response = await fetch(`http://localhost:8080/api/v1/userdiscounts/${selectedDiscount.user_discount_id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify({
              UserID: user.id,
              discount_id: selectedDiscount.discount_id,
              status: 'used',
            }),
          });

          console.log('Response:', response); // ตรวจสอบ response จากเซิร์ฟเวอร์

          if (!response.ok) {
            const errorData = await response.json();
            console.log('Error data:', errorData); // ตรวจสอบรายละเอียดของข้อผิดพลาด
            alert(`Failed to update discount: ${errorData.message}`);
          }
        }



        clearCart(); // Clear the cart after successful order
        navigate('/Status');
      } else {
        const errorData = await response.json();
        alert(`Failed to place order: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing the order.');
    }
  };

  const fetchHealthInfo = async () => {
    if (!user || !user.id) {
      alert('User not authenticated. Please log in.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/healthinfo/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setName(`${data.first_name} ${data.last_name}` || '');
        setAddress(data.address || '');
        setPhoneNumber(data.phone_number || '');
      } else {
        const errorData = await response.json();
        alert('Failed to fetch health info.');
      }
    } catch (error) {
      console.error('Error fetching health info:', error);
    }
  };

  const fetchUserDiscounts = async () => {
    if (!user || !user.id) {
      alert('User not authenticated. Please log in.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/userdiscounts/user/active/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserDiscounts(data); // Store discounts in state
      } else {
        const errorData = await response.json();
        alert('Failed to fetch user discounts.');
      }
    } catch (error) {
      console.error('Error fetching user discounts:', error);
    }
  };

  // ฟังก์ชันสำหรับการเลือกส่วนลด
// ฟังก์ชันสำหรับการเลือกส่วนลด
const applyDiscount = () => {
  if (!selectedDiscount) {
    alert('Please select a discount.');
    setDiscountAmount(0);
    return;
  }

  let discount = 0;

  // ตรวจสอบว่ามี discount_amount หรือ discount_percent
  if (selectedDiscount.discount.discount_amount) {
    discount = parseFloat(selectedDiscount.discount.discount_amount);
  } else if (selectedDiscount.discount.discount_percent) {
    discount = (parseFloat(selectedDiscount.discount.discount_percent) / 100) * merchandiseSubtotal;
  }

  // ตรวจสอบว่ายอดรวมหลังหักส่วนลดไม่ต่ำกว่า 0
  const newTotal = merchandiseSubtotal - discount + shippingTotal;
  if (newTotal < 0) {
    alert('Discount cannot be applied as it makes the total amount negative.');
    setDiscountAmount(0); // ไม่ใช้ส่วนลด
  } else {
    setDiscountAmount(discount); // ใช้ส่วนลด
  }
};

  

  // ฟังก์ชันสำหรับการเลือกวิธีส่งสินค้า
  const handleShippingMethodChange = (method) => {
    setShippingMethod(method);
    setShippingTotal(method === 'ems' ? 100 : 60); // EMS = 100 THB, Standard = 60 THB
  };

  return (
    <div className='bg-white min-h-screen text-black p-8'>
<div className='flex justify-between mb-8'>
  {/* Cart Items */}
  <div className="w-4/5 pr-4">
    <h2 className="text-5xl font-bebas mb-8">My Shopping Cart</h2>
    {cart.map(item => (
      <div key={item.product_id} className="flex items-start border-b border-gray-300 py-4">
        {/* Image Section */}
        <div className="w-24 h-24 mr-4">
          <img
            src={`http://localhost:8080${item.image_url}`} // Full URL for the image
            alt={item.name}
            className="w-full h-full object-cover rounded"
          />
        </div>
        {/* Details Section */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-500">รส: {item.description}</p> {/* Assuming item has a 'flavor' property */}
          <p className="text-sm text-gray-500">ขนาด: {item.size}</p> {/* Assuming item has a 'size' property */}
        </div>
        {/* Pricing and Quantity Section */}
        <div className="flex flex-col items-end">
          <span className="text-lg font-semibold">฿ {item.price.toFixed(2)}</span>
          <span className="text-gray-600">Quantity: {item.quantity}</span>
          <span className="text-lg font-semibold mt-2">฿ {(item.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
    ))}
  </div>

  
<div className="w-1/5 pl-4">
  <h2 className='text-xl font-bold mb-2'>Available Discounts</h2>
  <div className='relative'>
    <select
      className='w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800'
      value={selectedDiscount ? selectedDiscount.user_discount_id.toString() : ''}
      onChange={(e) => {
        const selectedId = e.target.value;
        const discount = userDiscounts.find(d => d.user_discount_id.toString() === selectedId);

        if (discount) {
          setSelectedDiscount(discount);

          // Apply discount by amount or percentage
          if (discount.discount.discount_amount) {
            setDiscountAmount(parseFloat(discount.discount.discount_amount)); // Ensure discount amount is a number
          } else if (discount.discount.discount_percent) {
            const discountValue = (parseFloat(discount.discount.discount_percent) / 100) * merchandiseSubtotal;
            setDiscountAmount(discountValue);
          }
        } else {
          // Clear discount if no option is selected
          setSelectedDiscount(null);
          setDiscountAmount(0);
        }
      }}
    >
      <option value=''>Select a Discount</option>
      {userDiscounts.map((discount) => (
        <option key={discount.user_discount_id} value={discount.user_discount_id.toString()}>
          {discount.discount.discount_code} - 
          {discount.discount.discount_amount ? `฿${discount.discount.discount_amount}` : `${discount.discount.discount_percent}%`}
        </option>
      ))}
    </select>
  </div>
</div>

</div>



      {/* Shipping Method */}
      <div className='mb-8'>
        <h2 className='text-xl font-bold mb-2'>Delivery</h2>
        <div className='flex items-center'>
          {/* Shipping Options */}
          <div className="flex items-center space-x-4 flex-grow">
            <button
              className={`flex items-center border-2 rounded-lg p-2 ${shippingMethod === 'ems' ? 'border-gray-700' : 'border-gray-300'}`}
              onClick={() => handleShippingMethodChange('ems')}
            >
              <img src={EMS} alt="EMS World" className="w-20 h-12 mr-2" /> {/* Adjusted for longer width */}
            </button>
            <button
              className={`flex items-center border-2 rounded-lg p-2 ${shippingMethod === 'kerry' ? 'border-gray-700' : 'border-gray-300'}`}
              onClick={() => handleShippingMethodChange('kerry')}
            >
              <img src={KERRY} alt="Kerry Express" className="w-20 h-12 mr-2" /> {/* Adjusted for longer width */}
            </button>
          </div>

          {/* Shipping Total */}
          <p className="text-gray-700 font-semibold ml-auto">฿ {shippingTotal}</p> {/* Align to far right */}
        </div>
      </div>




      {/* Payment Method */}
      <div className='mb-8 '>
        <h2 className='text-xl font-bold mb-2'>Payment Method</h2>
        <div className='flex space-x-4 mb-4'>
          <button
            className={`bg-gray-700 text-white px-4 py-2 rounded ${paymentMethod === 'QR PromptPay' ? 'bg-green-500' : ''}`}
            onClick={() => setPaymentMethod('QR PromptPay')}
          >
            QR PromptPay
          </button>
          <button
            className={`bg-gray-700 text-white px-4 py-2 rounded ${paymentMethod === 'GooglePlay' ? 'bg-green-500' : ''}`}
            onClick={() => setPaymentMethod('GooglePlay')}
          >
            GooglePlay
          </button>
          <button
            className={`bg-gray-700 text-white px-4 py-2 rounded ${paymentMethod === 'Credit/Debit' ? 'bg-green-500' : ''}`}
            onClick={() => setPaymentMethod('Credit/Debit')}
          >
            Credit/Debit
          </button>
        </div>
        <p>Prompt Pay: 0945541469</p>
      </div>

     {/* Payment Summary */}
<div className='text-right'>
  <h2 className='text-left text-xl font-bold mb-4'>Payment Summary</h2>

  {/* Merchandise Subtotal */}
  <div className="flex justify-between mb-2">
    <span className="text-gray-700">จำนวนสินค้า <span className="text-gray-500"></span></span>
    <span className="font-semibold">฿ {merchandiseSubtotal.toFixed(2)}</span>
  </div>

{/* Discount Amount */}
<div className="flex justify-between mb-2">
  <span className="text-gray-700">ส่วนลด</span>
  <span className="font-semibold text-red-500">
    -฿ {typeof discountAmount === 'number' ? discountAmount.toFixed(2) : '0.00'}
  </span>
</div>


  {/* Shipping Cost */}
  <div className="flex justify-between mb-2">
    <span className="text-gray-700">ค่าส่ง</span>
    <span className="font-semibold">฿ {shippingTotal.toFixed(2)}</span>
  </div>

  {/* Total Amount */}
  <div className="flex justify-between mt-4">
    <span className="text-gray-800 font-bold">ยอดรวมทั้งสิ้น</span>
    <span className="text-lg font-bold">฿ {totalPayment.toFixed(2)}</span>
  </div>
</div>



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

      <div className='text-right'>
        <button
          className='bg-purple-500 text-white px-6 py-2 rounded mt-4'
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>
        <p className='mt-4 text-gray-400'>
          By clicking 'Place Order', you state acknowledgment and acceptance of Shopee's Return and Refund policy for this transaction.
        </p>
      </div>


    </div>


  );
};

export default Checkout;
