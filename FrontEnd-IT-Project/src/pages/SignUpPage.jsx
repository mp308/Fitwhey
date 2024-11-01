import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [healthInfo, setHealthInfo] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    email: '',
    address: '',
    phone_number: '',
    age: '',
    weight: '',
    height: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/v1/users', {
        username,
        password,
        role,
        healthInfo
      });

      if (response.status === 200) {
        setMessage('User created successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setMessage('Error creating user.');
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred.');
    }
  };

  const handleHealthInfoChange = (e) => {
    const { name, value } = e.target;
    setHealthInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>

          {/* Health Info Fields */}
          <div className="mb-4">
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              name="first_name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={healthInfo.first_name}
              onChange={handleHealthInfoChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              name="last_name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={healthInfo.last_name}
              onChange={handleHealthInfoChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Gender</label>
            <input
              type="text"
              name="gender"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={healthInfo.gender}
              onChange={handleHealthInfoChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={healthInfo.email}
              onChange={handleHealthInfoChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={healthInfo.address}
              onChange={handleHealthInfoChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={healthInfo.phone_number}
              onChange={handleHealthInfoChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={healthInfo.age}
              onChange={handleHealthInfoChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Weight</label>
            <input
              type="number"
              name="weight"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={healthInfo.weight}
              onChange={handleHealthInfoChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Height</label>
            <input
              type="number"
              name="height"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={healthInfo.height}
              onChange={handleHealthInfoChange}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
          >
            Register
          </button>
        </form>

        {/* Message */}
        {message && <p className="mt-4 text-center text-green-500">{message}</p>}
      </div>
    </div>
  );
};

export default SignUp;
