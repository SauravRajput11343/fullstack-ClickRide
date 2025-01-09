import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import authBg from '../../assets/img/LoginBg.webp';

export default function PartnerSignup() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        dob: "",
        mobile: "",
        password: "",
        Cpassword: "",
        roleName: "Partner",
    });

    const { signup } = useAuthStore();
    const navigate = useNavigate();

    const validateForm = () => {
        if (!formData.firstName.trim()) {
            toast.error("First Name is Required");
            return false;
        }
        if (!formData.lastName.trim()) {
            toast.error("Last Name is Required");
            return false;
        }
        if (!formData.email.trim()) {
            toast.error("Email is required");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            toast.error("Invalid email format");
            return false;
        }
        if (!formData.password) {
            toast.error("Password is Required");
            return false;
        }
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return false;
        }
        if (formData.password !== formData.Cpassword) {
            toast.error("Password and Confirm Password must be the same");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateForm();

        if (isValid === true) {
            try {
                const response = await signup(formData);
                if (response.success) {
                    navigate('/login');
                }
            } catch (error) {
                toast.error("An error occurred during signup.");
            }
        }
    };


    return (
        <div
            className="flex justify-center items-center min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${authBg})` }}
        >
            <form onSubmit={handleSubmit} className="bg-white bg-opacity-10 backdrop-blur-lg p-4 px-5 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                <div className="mb-6 text-center">
                    <h2 className="text-4xl font-semibold text-white">
                        <Link to="/">
                            <span className='text-white'>Click</span>
                            <span className="text-teal-500">Ride</span>
                        </Link>

                    </h2>
                    <h2 className="text-2xl font-semibold text-white mt-3">

                        <span className='text-white'>Partner</span>

                    </h2>
                </div>

                {/* First and Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <div>
                        <label htmlFor="firstName" className="block text-white text-base font-medium">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            className="w-full mt-1 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-white text-base font-medium">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            className="w-full mt-1 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="mb-2">
                    <label htmlFor="email" className="block text-white text-base font-medium">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        className="w-full mt-1 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                {/* Date of Birth and Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <div>
                        <label htmlFor="dob" className="block text-white text-base font-medium">Date of Birth</label>
                        <input
                            type="date"
                            id="dob"
                            className="w-full mt-1 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            value={formData.dob}
                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="mobile" className="block text-white text-base font-medium">Mobile Number</label>
                        <input
                            type="tel"
                            id="mobile"
                            className="w-full mt-1 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        />
                    </div>
                </div>

                {/* Password and Confirm Password */}
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

                <div className="mb-3">
                    <label htmlFor="Cpassword" className="block text-white text-base font-medium">Confirm Password</label>
                    <input
                        type="password"
                        id="Cpassword"
                        className="w-full mt-1 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={formData.Cpassword}
                        onChange={(e) => setFormData({ ...formData, Cpassword: e.target.value })}
                    />
                </div>

                {/* Submit Button */}
                <button type="submit" className="w-full py-3 bg-teal-500 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500">
                    Sign Up
                </button>

                {/* Login Link */}
                <div className="text-center mt-4">
                    <p className="text-white font-bold">
                        Already Registered? <Link to="/Login" className="text-teal-500 font-bold">Login</Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
