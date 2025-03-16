import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';
import authBg from '../../assets/img/LoginBg.webp';
import UserIcon from '../../assets/img/account.png';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // State to track loading

  const onSubmit = async (data) => {
    setLoading(true); // Start loading
    try {
      const user = await login(data);
      if (user) {
        switch (user.roleName) {
          case 'Admin':
            navigate('/AdminAnalyticsPage');
            break;
          case 'Customer':
            navigate('/ViewVehicle');
            break;
          case 'Partner':
            navigate('/PartnerAnalyticsPage');
            break;
          default:
            navigate('/DefaultDashboard');
            break;
        }
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false); // Stop loading after response
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
      >
        <div className="mb-3 text-center">
          <h2 className="text-4xl font-semibold text-white mt-1 mb-3">
            <Link to="/"><span>Click</span><span className="text-teal-500">Ride</span></Link>
          </h2>
          <img src={UserIcon} alt="User Icon" className="w-28 h-28 mx-auto rounded-full" />
        </div>

        <div className="mb-2">
          <label htmlFor="email" className="block text-white text-base font-medium">Email address</label>
          <input
            type="email"
            id="email"
            {...register("email", { required: "Email is required", pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format" } })}
            className="w-full mt-1 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.email && <p className="text-red-500 text-sm font-bold drop-shadow-md">{errors.email.message}</p>}
        </div>

        <div className="mb-7">
          <label htmlFor="password" className="block text-white text-base font-medium">Password</label>
          <input
            type="password"
            id="password"
            {...register("password", { required: "Password is required" })}
            className="w-full mt-1 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.password && <p className="text-red-500 text-sm font-bold drop-shadow-md">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-teal-500 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 flex justify-center items-center"
          disabled={loading}
        >
          {loading ? <Loader className="animate-spin w-6 h-6" /> : "Submit"}
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
