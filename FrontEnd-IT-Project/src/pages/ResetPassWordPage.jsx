import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ResetPassWordPage() {
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:8080/api/v1/reset-password', {
        resetToken,
        newPassword,
      });
      setMessage(response.data.message);
      setError(''); // Clear any previous errors
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setMessage(''); // Clear any previous messages
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="resetToken" className="mb-2 text-sm font-medium text-gray-600">Reset Token</label>
          <input
            type="text"
            id="resetToken"
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
            placeholder="Enter your reset token"
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="newPassword" className="mb-2 text-sm font-medium text-gray-600">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            required
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300">
          Reset Password
        </button>
      </form>

      {/* Success or error message */}
      {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
      {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
    </div>
  );
}

export default ResetPassWordPage;
