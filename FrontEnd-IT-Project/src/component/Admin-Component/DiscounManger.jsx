import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DiscountManager() {
  const [discounts, setDiscounts] = useState([]);
  const [form, setForm] = useState({
    discount_code: '',
    discount_amount: '',
    discount_percent: '',
    expiration_date: '',
    status: 'active',
  });
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchDiscounts();
  }, []);

  // ดึงข้อมูล Discount ทั้งหมด
  const fetchDiscounts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/discounts');
      setDiscounts(response.data);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  };

  // สร้างหรืออัปเดต Discount
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDiscount) {
        // อัปเดต Discount
        await axios.put(`http://localhost:8080/api/v1/discounts/${editingDiscount.discount_id}`, form);
        setMessage('Discount updated successfully');
      } else {
        // สร้าง Discount ใหม่
        await axios.post('http://localhost:8080/api/v1/discounts', form);
        setMessage('Discount created successfully');
      }
      setForm({ discount_code: '', discount_amount: '', discount_percent: '', expiration_date: '', status: 'active' });
      setEditingDiscount(null);
      fetchDiscounts();
    } catch (error) {
      console.error('Error saving discount:', error);
    }
  };

  // ลบ Discount
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/discounts/${id}`);
      setMessage('Discount deleted successfully');
      fetchDiscounts();
    } catch (error) {
      console.error('Error deleting discount:', error);
    }
  };

  // เริ่มการแก้ไข Discount
  const handleEdit = (discount) => {
    setForm(discount);
    setEditingDiscount(discount);
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Discount Manager</h2>

      {/* ฟอร์มการเพิ่มหรืออัปเดต Discount */}
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Discount Code"
          value={form.discount_code}
          onChange={(e) => setForm({ ...form, discount_code: e.target.value })}
          required
          className="block w-full p-2 mb-2 border"
        />
        <input
          type="number"
          placeholder="Discount Amount"
          value={form.discount_amount}
          onChange={(e) => setForm({ ...form, discount_amount: e.target.value })}
          className="block w-full p-2 mb-2 border"
        />
        <input
          type="number"
          placeholder="Discount Percent"
          value={form.discount_percent}
          onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
          className="block w-full p-2 mb-2 border"
        />
        <input
          type="date"
          placeholder="Expiration Date"
          value={form.expiration_date}
          onChange={(e) => setForm({ ...form, expiration_date: e.target.value })}
          className="block w-full p-2 mb-2 border"
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="block w-full p-2 mb-2 border"
        >
          
          <option value="onPrepare">onPrepare</option>
          <option value="onProduct">onProduct</option>
          <option value="onProcess">onProcess</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingDiscount ? 'Update Discount' : 'Create Discount'}
        </button>
        {editingDiscount && (
          <button
            type="button"
            onClick={() => {
              setForm({ discount_code: '', discount_amount: '', discount_percent: '', expiration_date: '', status: 'active' });
              setEditingDiscount(null);
            }}
            className="bg-gray-500 text-white p-2 rounded ml-2"
          >
            Cancel
          </button>
        )}
      </form>

      {/* แสดงข้อความสถานะ */}
      {message && <p className="text-green-500 mb-4">{message}</p>}

      {/* ตารางข้อมูล Discount */}
      <h3 className="text-xl font-bold mb-4">Discounts List</h3>
      <table className="table-auto w-full mb-8">
        <thead>
          <tr>
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Percent</th>
            <th className="px-4 py-2">Expiration</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((discount) => (
            <tr key={discount.discount_id}>
              <td className="border px-4 py-2">{discount.discount_code}</td>
              <td className="border px-4 py-2">{discount.discount_amount || '-'}</td>
              <td className="border px-4 py-2">{discount.discount_percent || '-'}</td>
              <td className="border px-4 py-2">{discount.expiration_date ? new Date(discount.expiration_date).toLocaleDateString() : '-'}</td>
              <td className="border px-4 py-2">{discount.status}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(discount)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(discount.discount_id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DiscountManager;
