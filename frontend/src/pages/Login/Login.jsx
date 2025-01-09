import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import authBg from '../../assets/img/LoginBg.webp';
import UserIcon from '../../assets/img/account.png'; // Import user icon

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid === true) {
      try {
        // Get the full user data (including roleName)
        const user = await login(formData); // login now returns the full user data

        if (user) {
          console.log(user); // Log the user data to inspect

          // Check if roleName exists and redirect based on it
          if (user.roleName) {
            switch (user.roleName) {
              case 'Admin':
                navigate('/Admin');  // Redirect to Admin dashboard
                break;
              case 'Customer':
                navigate('/Customer');  // Redirect to Customer dashboard
                break;
              default:
                navigate('/DefaultDashboard');  // Default redirect
                break;
            }
          } else {
            toast.error("Role not assigned, unable to redirect.");
          }
        }
      } catch (error) {
        toast.error("Login failed. Please try again.");
      }
    }
  };
  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
      >
        {/* User Icon */}
        <div className="mb-3 text-center">

          <h2 className="text-4xl font-semibold text-white mt-1 mb-3">
            <Link to="/"><span>Click</span>
              <span className="text-teal-500">Ride</span></Link>

          </h2>
          <img src={UserIcon} alt="User Icon" className="w-28 h-28 mx-auto rounded-full" />
        </div>

        <div className="mb-2">
          <label htmlFor="email" className="block text-white text-base font-medium">Email address</label>
          <input
            type="email"
            id="email"
            className="w-full mt-1 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="mb-2">
          <label htmlFor="password" className="block text-white text-base font-medium">Password</label>
          <input
            type="password"
            id="password"
            className="w-full mt-1 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="rememberMe"
            className="h-4 w-4 text-teal-500 rounded border-gray-300 focus:ring-teal-500"
          />
          <label htmlFor="rememberMe" className="ml-2 text-white">Remember me</label>
        </div>

        <button type="submit" className="w-full py-3 bg-teal-500 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500">
          Submit
        </button>

        <div className="text-center mt-4">
          <p className="text-white">
            Not a member? <Link to="/Signup" className="text-teal-500">Register</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
