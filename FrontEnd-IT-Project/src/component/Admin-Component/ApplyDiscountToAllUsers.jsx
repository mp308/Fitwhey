import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ApplyDiscountToAllUsers() {
  const [discounts, setDiscounts] = useState([]); // เก็บส่วนลดทั้งหมด
  const [selectedDiscount, setSelectedDiscount] = useState(null); // เก็บส่วนลดที่เลือก
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // ดึงข้อมูลส่วนลดทั้งหมดเมื่อ component โหลด
  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/discounts'); // เปลี่ยน URL ตาม API ของคุณ
      setDiscounts(response.data);
    } catch (err) {
      console.error('Error fetching discounts:', err);
      setError('ไม่สามารถดึงข้อมูลส่วนลดได้');
    }
  };

  const handleApplyDiscountToAllUsers = async () => {
    if (!selectedDiscount) {
      alert('กรุณาเลือกส่วนลด');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/v1//apply-discount-to-all', {
        discount_id: selectedDiscount,
      });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      console.error('Error applying discount to all users:', err);
      setError('ไม่สามารถแจกส่วนลดให้กับผู้ใช้ทุกคนได้');
      setMessage('');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">แจกส่วนลดให้กับผู้ใช้ทุกคน</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-500 mb-4">{message}</p>}

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">เลือกส่วนลด:</label>
        <select
          onChange={(e) => setSelectedDiscount(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 mb-4 w-full"
        >
          <option value="">เลือกส่วนลด</option>
          {discounts.map((discount) => (
            <option key={discount.discount_id} value={discount.discount_id}>
              {discount.discount_code} - {discount.discount_percent ? `${discount.discount_percent}%` : `${discount.discount_amount} THB`}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleApplyDiscountToAllUsers}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        แจกส่วนลดให้กับผู้ใช้ทุกคน
      </button>
    </div>
  );
}

export default ApplyDiscountToAllUsers;
