import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation to signup
import { useUserAuth } from '../gobal/UserAuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error messages
  const { logIn } = useUserAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message
    try {
      await logIn(username, password);
      navigate('/'); // Redirect to home page upon successful login
    } catch (err) {
      setError(err.message); // Set error message from catch block
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-6 rounded shadow-md">
        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
      
      <p className="mt-4 text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-500 hover:underline">Sign Up</Link>{' '}
        or{' '} 
      <Link to="/Forgotpasseword" className="text-blue-500 hover:underline">Forgot password</Link>
      </p> {/* Sign Up Link */}
    </div>
  );
};

export default LoginPage;
