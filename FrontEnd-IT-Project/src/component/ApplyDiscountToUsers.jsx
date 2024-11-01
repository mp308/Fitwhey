import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserAuth } from '../gobal/UserAuthContext';

function ApplyDiscountToUsers() {
  const { user } = useUserAuth();
  const [discounts, setDiscounts] = useState([]);
  const [notification, setNotification] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchOnProcessDiscounts();
  }, []);

  const fetchOnProcessDiscounts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/discounts');
      const onProcessDiscounts = response.data.filter(discount => discount.status === 'onProcess');
      setDiscounts(onProcessDiscounts);
    } catch (err) {
      console.error('Error fetching discounts:', err);
      setNotification({ type: 'error', text: 'ไม่สามารถดึงข้อมูลส่วนลดได้' });
    }
  };

  const handleApplyDiscount = async (discountId, discount) => {
    if (!user?.id) {
      setNotification({ type: 'error', text: 'ไม่พบข้อมูลผู้ใช้ กรุณาล็อกอินอีกครั้ง' });
      return;
    }

    try {
      await axios.post(`http://localhost:8080/api/v1/userdiscounts`, {
        UserID: user.id,
        discount_id: discountId,
      });
      
      setNotification({ type: 'success', text: `คุณได้เลือกส่วนลด ${discount.discount_code || `${discount.discount_percent}%`} สำเร็จ!` });
    } catch (err) {
      console.error('Error applying discount:', err);
      setNotification({ type: 'error', text: err.response?.data?.error || 'ไม่สามารถเพิ่มส่วนลดให้ผู้ใช้ได้' });
    }
  };

  const formatExpirationDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="p-8 max-w-full mx-auto">
      <h1 className="text-5xl  mb-4 text-left font-bebas">Discount For You</h1>

      {/* Notification section */}
      {notification.text && (
        <p className={`mb-4 ${notification.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
          {notification.text}
        </p>
      )}

      <div className="flex space-x-4 overflow-x-auto pb-4">
        {discounts.map((discount) => (
          <div
            key={discount.discount_id}
            className="p-4 min-w-[200px] rounded-lg shadow-md border border-gray-300"
          >
            <p className="text-lg font-semibold text-red-500">
              {discount.discount_percent ? `${discount.discount_percent}%` : `${discount.discount_amount} THB`} OFF
            </p>
            <p className="text-sm text-gray-700">All Categories</p>
            <p className="text-xs text-gray-500">Min. Spend {discount.minSpend || 0} THB</p>
            <p className="text-xs text-gray-500">Valid till {formatExpirationDate(discount.expiration_date)}</p>
            <button
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded text-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyDiscount(discount.discount_id, discount);
              }}
            >
              Use now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApplyDiscountToUsers;
