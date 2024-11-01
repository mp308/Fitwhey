import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPasswordPage() {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Send the username or email to the server for password reset
        const response = await axios.put('http://localhost:8080/api/v1/request-password-reset', { usernameOrEmail: username });
        setMessage(response.data.message);
        setError(''); // Clear any previous errors
        setTimeout(() => {
          navigate('/resetpassword');
        }, 2000); // Redirect after 2 seconds
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
        setMessage(''); // Clear any previous success messages
      }
    };
  
    return (
      <>
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="username" className="mb-2 text-sm font-medium text-gray-600">
                Enter your username or email
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username or email"
                required
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
              Send Reset Link
            </button>
          </form>
  
          {/* Success or error message */}
          {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
          {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        </div>
      </>
    );
}

export default ForgotPasswordPage;
