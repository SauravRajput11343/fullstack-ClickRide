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
        <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="max-w-2xl mx-auto h-full flex items-center">
                <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-slate-700/50 w-full">
                    <div className="flex items-center space-x-6 mb-6">
                        {/* Profile Picture Section */}
                        <div className="relative group flex-shrink-0">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                            <div className="relative">
                                {profileData.profilePic ? (
                                    <img
                                        src={profileData.profilePic}
                                        alt="Profile"
                                        className="w-20 h-20 rounded-full object-cover ring-2 ring-slate-700/50 shadow-2xl transition duration-300 transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-slate-700/50 ring-2 ring-slate-700/50 shadow-2xl transition duration-300 transform group-hover:scale-105">
                                        <Image className="w-8 h-8 text-slate-400" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-white tracking-tight">Change Password</h1>
                            <p className="text-slate-300">Update your account security</p>
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Full Name (Read-only) */}
                        <div className="group bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm border border-slate-700/50 transition duration-300 hover:bg-slate-800/70">
                            <label className="text-sm font-medium text-slate-400 flex items-center gap-2 mb-1">
                                <User className="w-4 h-4 text-purple-400" /> Full Name
                            </label>
                            <input
                                type="text"
                                value={`${profileData.firstName} ${profileData.lastName}`}
                                className="w-full px-3 py-2 bg-slate-900/50 rounded-lg border border-slate-600/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                readOnly
                            />
                        </div>

                        {/* Email (Read-only) */}
                        <div className="group bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm border border-slate-700/50 transition duration-300 hover:bg-slate-800/70">
                            <label className="text-sm font-medium text-slate-400 flex items-center gap-2 mb-1">
                                <Mail className="w-4 h-4 text-purple-400" /> Email
                            </label>
                            <input
                                type="email"
                                value={profileData.email}
                                className="w-full px-3 py-2 bg-slate-900/50 rounded-lg border border-slate-600/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                readOnly
                            />
                        </div>

                        {/* Current Password */}
                        <div className="group bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm border border-slate-700/50 transition duration-300 hover:bg-slate-800/70">
                            <label className="text-sm font-medium text-slate-400 flex items-center gap-2 mb-1">
                                <Lock className="w-4 h-4 text-purple-400" /> Current Password
                            </label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwords.currentPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-slate-900/50 rounded-lg border border-slate-600/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                required
                            />
                        </div>

                        {/* New Password & Confirm Password (Side-by-Side) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* New Password */}
                            <div className="group bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm border border-slate-700/50 transition duration-300 hover:bg-slate-800/70">
                                <label className="text-sm font-medium text-slate-400 flex items-center gap-2 mb-1">
                                    <Lock className="w-4 h-4 text-purple-400" /> New Password
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwords.newPassword}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-slate-900/50 rounded-lg border border-slate-600/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    required
                                />
                            </div>

                            {/* Confirm New Password */}
                            <div className="group bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm border border-slate-700/50 transition duration-300 hover:bg-slate-800/70">
                                <label className="text-sm font-medium text-slate-400 flex items-center gap-2 mb-1">
                                    <Lock className="w-4 h-4 text-purple-400" /> Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwords.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-slate-900/50 rounded-lg border border-slate-600/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex justify-center items-center font-semibold shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                            disabled={isUpdatingPassword}
                        >
                            {isUpdatingPassword ? (
                                <Loader className="w-5 h-5 animate-spin mr-2" />
                            ) : null}
                            {isUpdatingPassword ? 'Updating Password...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}