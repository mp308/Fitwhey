import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserManager() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [discounts, setDiscounts] = useState([]); // Store available discounts
  const [selectedDiscount, setSelectedDiscount] = useState(null); // Track selected discount

  useEffect(() => {
    fetchUsers();
    fetchDiscounts(); // Fetch available discounts when component loads
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
    }
  };

  const fetchDiscounts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/discounts');
      setDiscounts(response.data);
    } catch (err) {
      console.error('Error fetching discounts:', err);
      setError('ไม่สามารถดึงข้อมูลส่วนลดได้');
    }
  };

  const handleAddDiscountToUser = async (userId) => {
    if (!selectedDiscount) {
      alert('กรุณาเลือกส่วนลด');
      return;
    }

    try {
      await axios.post(`http://localhost:8080/api/v1/userdiscounts`, {
        UserID: userId,
        discount_id: selectedDiscount,
      });
      alert('เพิ่มส่วนลดให้ผู้ใช้เรียบร้อยแล้ว');
      fetchUsers(); // Refresh user list to show updated discounts
    } catch (err) {
      console.error('Error adding discount to user:', err);
      setError('ไม่สามารถเพิ่มส่วนลดให้ผู้ใช้ได้');
    }
  };

  const handleDeleteDiscountFromUser = async (userDiscountId) => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/userdiscounts/${userDiscountId}`);
      alert('ลบส่วนลดจากผู้ใช้เรียบร้อยแล้ว');
      fetchUsers(); // Refresh user list to show updated discounts
    } catch (err) {
      console.error('Error deleting discount from user:', err);
      setError('ไม่สามารถลบส่วนลดได้');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User Manager</h1>

      {error && <p className="text-red-500">{error}</p>}

      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Discounts</th>
            <th className="py-2 px-4 border-b">Add Discount</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.UserID}>
              <td className="py-2 px-4 border-b text-center">{user.UserID}</td>
              <td className="py-2 px-4 border-b text-center">{user.UserName}</td>
              <td className="py-2 px-4 border-b text-center">{user.Role}</td>
              <td className="py-2 px-4 border-b text-center">{user.Status}</td>
              <td className="py-2 px-4 border-b">
                {user.userdiscount && user.userdiscount.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {user.userdiscount.map((discount) => (
                      <li key={discount.user_discount_id} className="flex justify-between items-center">
                        <span>
                          {discount.discount.discount_code} - {discount.status} 
                          (Expires: {new Date(discount.discount.expiration_date).toLocaleDateString()})
                        </span>
                        <button
                          onClick={() => handleDeleteDiscountFromUser(discount.user_discount_id)}
                          className="text-red-500 hover:underline ml-2"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No Discounts</p>
                )}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <select
                  onChange={(e) => setSelectedDiscount(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 mb-2"
                >
                  <option value="">เลือกส่วนลด</option>
                  {discounts.map((discount) => (
                    <option key={discount.discount_id} value={discount.discount_id}>
                      {discount.discount_code}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleAddDiscountToUser(user.UserID)}
                  className="bg-green-500 text-white py-1 px-3 rounded mt-2"
                >
                  Add Discount
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManager;
