import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Camera, User } from 'lucide-react';

export default function Profile() {
    const { authUser, isUpdatingProfile, updateProfilepic } = useAuthStore();
    const [profileData, setProfileData] = useState({
        firstName: authUser?.firstName || '',
        lastName: authUser?.lastName || '',
        email: authUser?.email || ''
    });

    const [selectedImg, setSelectedImg] = useState(authUser?.profilePic || '/avatar.png');

    useEffect(() => {
        setProfileData({
            firstName: authUser?.firstName || '',
            lastName: authUser?.lastName || '',
            email: authUser?.email || ''
        });
        setSelectedImg(authUser?.profilePic || '/avatar.png');
    }, [authUser]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const uploadedImg = reader.result;
                setSelectedImg(uploadedImg);
                console.log('Image uploaded:', file);
                await updateProfilepic({ profilePic: uploadedImg });
            };
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-slate-700/50">
                    <div className="text-center mb-10">
                        <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">Your Profile</h1>
                        <p className="text-lg text-slate-300">Manage your personal information and profile picture</p>
                    </div>

                    <div className="flex flex-col items-center gap-6 mb-12">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                            <div className="relative">
                                <img
                                    src={selectedImg || '/avatar.png'}
                                    alt="Profile"
                                    className="w-40 h-40 rounded-full object-cover ring-4 ring-slate-700/50 shadow-2xl transition duration-300 transform group-hover:scale-105"
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className={`absolute -bottom-2 -right-2 bg-purple-600 hover:bg-purple-500 p-3 rounded-full cursor-pointer shadow-xl transition-all duration-300 hover:scale-110 ${isUpdatingProfile ? 'animate-pulse pointer-events-none' : ''
                                        }`}
                                >
                                    <Camera className="w-6 h-6 text-white" />
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={isUpdatingProfile}
                                    />
                                </label>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 font-medium">
                            {isUpdatingProfile ? 'Uploading...' : 'Click the camera icon to update your photo'}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="group bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50 transition duration-300 hover:bg-slate-800/70">
                            <div className="flex items-center gap-3 mb-2">
                                <User className="w-5 h-5 text-purple-400" />
                                <span className="text-sm font-medium text-slate-400">Full Name</span>
                            </div>
                            <p className="text-xl text-white font-semibold pl-8">
                                {`${profileData.firstName} ${profileData.lastName}`}
                            </p>
                        </div>

                        <div className="group bg-slate-800/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/50 transition duration-300 hover:bg-slate-800/70">
                            <div className="flex items-center gap-3 mb-2">
                                <User className="w-5 h-5 text-purple-400" />
                                <span className="text-sm font-medium text-slate-400">Email Address</span>
                            </div>
                            <p className="text-xl text-white font-semibold pl-8">
                                {profileData.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}