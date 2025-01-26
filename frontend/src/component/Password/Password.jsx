import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Lock, Mail, User, Loader, Image } from "lucide-react";
import toast from 'react-hot-toast';

export default function Password() {
    const { authUser, updatePassword, isUpdatingPassword } = useAuthStore();
    const [profileData, setProfileData] = useState({
        firstName: authUser?.firstName || '',
        lastName: authUser?.lastName || '',
        email: authUser?.email || '',
        profilePic: authUser?.profilePic || null
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        setProfileData({
            firstName: authUser?.firstName || '',
            lastName: authUser?.lastName || '',
            email: authUser?.email || '',
            profilePic: authUser?.profilePic || null
        });
    }, [authUser]);

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('New passwords do not match.');
            return;
        }

        try {
            await updatePassword(passwords);
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.message || 'Failed to update password.');
        }
    };

    return (
        <div className="bg-gradient-to-t from-gray-900 via-gray-800 to-gray-700 h-screen">
            <div className='max-w-2xl mx-auto p-4 py-8'>
                <div className='bg-gray-800 rounded-xl p-6 space-y-8 shadow-xl'>

                    {/* Profile Picture Section */}
                    <div className='flex flex-col items-center'>
                        {profileData.profilePic ? (
                            <img
                                src={profileData.profilePic}
                                alt="Profile"
                                className="w-24 h-24 rounded-full border-4 border-blue-400 object-cover"
                            />
                        ) : (
                            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-700 border-4 border-blue-400">
                                <Image className="w-10 h-10 text-gray-400" />
                            </div>
                        )}
                    </div>

                    <div className='text-center'>
                        <h1 className='text-3xl font-semibold text-white'>Change Password</h1>
                        <p className='mt-2 text-gray-300'>Update your password securely</p>
                    </div>

                    <form className='space-y-6' onSubmit={handleSubmit}>

                        {/* Full Name (Read-only) */}
                        <div className='space-y-1.5'>
                            <label className='text-sm text-gray-400 flex items-center gap-2'>
                                <User className='w-4 h-4 text-blue-400' /> Full Name
                            </label>
                            <input
                                type='text'
                                value={`${profileData.firstName} ${profileData.lastName}`}
                                className='w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white'
                                readOnly
                            />
                        </div>

                        {/* Email (Read-only) */}
                        <div className='space-y-1.5'>
                            <label className='text-sm text-gray-400 flex items-center gap-2'>
                                <Mail className='w-4 h-4 text-blue-400' /> Email
                            </label>
                            <input
                                type='email'
                                value={profileData.email}
                                className='w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white'
                                readOnly
                            />
                        </div>

                        {/* Current Password */}
                        <div className='space-y-1.5'>
                            <label className='text-sm text-gray-400 flex items-center gap-2'>
                                <Lock className='w-4 h-4 text-blue-400' /> Current Password
                            </label>
                            <input
                                type='password'
                                name='currentPassword'
                                value={passwords.currentPassword}
                                onChange={handleChange}
                                className='w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white'
                                required
                            />
                        </div>

                        {/* New Password & Confirm Password (Side-by-Side) */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* New Password */}
                            <div className='space-y-1.5'>
                                <label className='text-sm text-gray-400 flex items-center gap-2'>
                                    <Lock className='w-4 h-4 text-blue-400' /> New Password
                                </label>
                                <input
                                    type='password'
                                    name='newPassword'
                                    value={passwords.newPassword}
                                    onChange={handleChange}
                                    className='w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white'
                                    required
                                />
                            </div>

                            {/* Confirm New Password */}
                            <div className='space-y-1.5'>
                                <label className='text-sm text-gray-400 flex items-center gap-2'>
                                    <Lock className='w-4 h-4 text-blue-400' /> Confirm Password
                                </label>
                                <input
                                    type='password'
                                    name='confirmPassword'
                                    value={passwords.confirmPassword}
                                    onChange={handleChange}
                                    className='w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 text-white'
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type='submit'
                            className='w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition-all duration-200 flex justify-center items-center'
                            disabled={isUpdatingPassword}
                        >
                            {isUpdatingPassword ? (
                                <Loader className="w-5 h-5 animate-spin mr-2" />
                            ) : null}
                            {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
