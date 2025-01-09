import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Camera, User } from "lucide-react";

export default function Profile() {
    const { authUser, isUpdatingProfile, updateProfilepic } = useAuthStore();
    const [profileData, setProfileData] = useState({
        firstName: authUser?.firstName || '',
        lastName: authUser?.lastName || '',
        email: authUser?.email || ''
    });

    const [selectedImg, setSelectedImg] = useState(authUser?.profilePic || '/avatar.png'); // Set to profilePic if available or fallback to default

    useEffect(() => {
        // Update profile data when authUser changes
        setProfileData({
            firstName: authUser?.firstName || '',
            lastName: authUser?.lastName || '',
            email: authUser?.email || ''
        });

        // Set selectedImg only if authUser.profilePic is not null, else fallback to default avatar
        setSelectedImg(authUser?.profilePic || '/avatar.png');
    }, [authUser]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const uploadedImg = reader.result;
                setSelectedImg(uploadedImg); // Update the state with the new image

                console.log('Image uploaded:', file);

                // Upload image to backend and update profile picture
                await updateProfilepic({ profilePic: uploadedImg });
            };
        }
    };

    return (
        <div className="bg-gradient-to-t from-gray-900 via-gray-800 to-gray-700 h-screen">
            <div className='max-w-2xl mx-auto p-4 py-8'>
                <div className='bg-gray-800 rounded-xl p-6 space-y-8 shadow-xl'>
                    <div className='text-center'>
                        <h1 className='text-3xl font-semibold text-white'>Profile</h1>
                        <p className='mt-2 text-gray-300'>Your profile information</p>
                    </div>

                    <div className='flex flex-col items-center gap-6'>
                        <div className='relative'>
                            <img
                                src={selectedImg || '/avatar.png'} // Use selectedImg if available, otherwise fallback to default avatar
                                alt='Profile'
                                className='w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg'
                            />
                            <label
                                htmlFor='avatar-upload'
                                className={`absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile ? 'animate-pulse pointer-events-none' : ''}`}
                            >
                                <Camera className='w-6 h-6 text-white' />
                                <input
                                    type='file'
                                    id='avatar-upload'
                                    className='hidden'
                                    accept='image/*'
                                    onChange={handleImageUpload}
                                    disabled={isUpdatingProfile}
                                />
                            </label>
                        </div>
                        <p className='text-sm text-gray-400'>
                            {isUpdatingProfile ? 'Uploading...' : 'Click the camera icon to update your photo'}
                        </p>
                    </div>

                    <div className='space-y-6'>
                        <div className='space-y-1.5'>
                            <div className='text-sm text-gray-400 flex items-center gap-2'>
                                <User className='w-4 h-4 text-blue-400' />
                                Full Name
                            </div>
                            <p className='px-4 py-2.5 bg-gray-700 rounded-lg border border-gray-600 text-white'>
                                {`${profileData.firstName} ${profileData.lastName}`}
                            </p>
                        </div>

                        <div className='space-y-1.5'>
                            <div className='text-sm text-gray-400 flex items-center gap-2'>
                                <User className='w-4 h-4 text-blue-400' />
                                Email Address
                            </div>
                            <p className='px-4 py-2.5 bg-gray-700 rounded-lg border border-gray-600 text-white'>
                                {profileData.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
