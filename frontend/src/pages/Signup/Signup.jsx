import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import authBg from '../../assets/img/LoginBg.webp';

export default function Signup() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const { signup } = useAuthStore();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await signup(data);
            if (response.success) {
                navigate('/login');
            }
        } catch (error) {
            toast.error("An error occurred during signup.");
        }
    };

    return (
        <div
            className="flex justify-center items-center min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${authBg})` }}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white bg-opacity-10 backdrop-blur-lg p-4 px-5 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                <div className="mb-6 text-center">
                    <h2 className="text-4xl font-semibold text-white">
                        <Link to="/">
                            <span className='text-white'>Click</span>
                            <span className="text-teal-500">Ride</span>
                        </Link>
                    </h2>
                </div>

                {/* First and Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <div>
                        <label htmlFor="firstName" className="block text-white text-base font-medium">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            className={`w-full mt-1 p-1 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                            {...register('firstName', { required: 'First Name is required' })}
                        />
                        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-white text-base font-medium">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            className={`w-full mt-1 p-1 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                            {...register('lastName', { required: 'Last Name is required' })}
                        />
                        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                    </div>
                </div>

                {/* Email */}
                <div className="mb-2">
                    <label htmlFor="email" className="block text-white text-base font-medium">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        className={`w-full mt-1 p-1 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: 'Invalid email format',
                            },
                        })}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                {/* Date of Birth and Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <div>
                        <label htmlFor="dob" className="block text-white text-base font-medium">Date of Birth</label>
                        <input
                            type="date"
                            id="dob"
                            className={`w-full mt-1 p-1 border ${errors.dob ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                            {...register('dob', {
                                required: 'Date of Birth is required',
                                validate: (value) => {
                                    // Ensure the person is at least 18 years old
                                    const age = new Date().getFullYear() - new Date(value).getFullYear();
                                    if (age < 18) {
                                        return 'You must be at least 18 years old';
                                    }
                                    return true;
                                }
                            })}
                        />
                        {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="mobile" className="block text-white text-base font-medium">Mobile Number</label>
                        <input
                            type="tel"
                            id="mobile"
                            className={`w-full mt-1 p-1 border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                            {...register('mobile', {
                                required: 'Mobile Number is required',
                                pattern: {
                                    value: /^[0-9]{10}$/,  // Example for a 10-digit phone number
                                    message: 'Invalid mobile number format',
                                },
                            })}
                        />
                        {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile.message}</p>}
                    </div>
                </div>

                {/* Password and Confirm Password */}
                <div className="mb-2">
                    <label htmlFor="password" className="block text-white text-base font-medium">Password</label>
                    <input
                        type="password"
                        id="password"
                        className={`w-full mt-1 p-1 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                        {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 6, message: 'Password must be at least 6 characters' },
                        })}
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                <div className="mb-3">
                    <label htmlFor="Cpassword" className="block text-white text-base font-medium">Confirm Password</label>
                    <input
                        type="password"
                        id="Cpassword"
                        className={`w-full mt-1 p-1 border ${errors.Cpassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                        {...register('Cpassword', {
                            required: 'Confirm Password is required',
                            validate: (value) => value === watch('password') || 'Passwords do not match',
                        })}
                    />
                    {errors.Cpassword && <p className="text-red-500 text-sm">{errors.Cpassword.message}</p>}
                </div>

                {/* Hidden Role Field */}
                <input
                    type="hidden"
                    {...register('roleName')}
                    value="Customer"
                />

                {/* Submit Button */}
                <button type="submit" className="mt-3 w-full py-3 bg-teal-500 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500">
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
