import React, { useEffect, useState } from 'react';
import AdminNav from '../../component/AdminNav/AdminNav';
import { AdminSideBar } from '../../component/AdminSideBar/AdminSideBar';
import { useParams } from 'react-router-dom';
import { usePartnerStore } from '../../store/usePartnerStore';

export default function ManagePartner() {
    const isDrawerOpen = true;
    const { PartnerId } = useParams();
    const { fetchPartnerData, partnerRequestDetails } = usePartnerStore();
    const [partner, setPartner] = useState(null);

    useEffect(() => {
        async function fetchData() {
            await fetchPartnerData(); // Fetch all partner requests
        }
        fetchData();
    }, [fetchPartnerData]);

    useEffect(() => {
        if (partnerRequestDetails?.length > 0) {
            const selectedPartner = partnerRequestDetails.find(p => p._id === PartnerId);
            setPartner(selectedPartner || null);
        }
    }, [PartnerId, partnerRequestDetails]);

    const handleValidate = async () => {

    };

    const handleReject = async () => {

    };

    if (!partner) {
        return <p className="text-center text-gray-500">Loading partner details...</p>;
    }

    return (
        <div>
            <AdminNav />
            <AdminSideBar />

            {/* Main Content */}
            <div
                className={`transition-all duration-300 ${isDrawerOpen ? "lg:pl-[16rem]" : ""}`}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-5">

                    {/* First Column - Profile Image & Video */}
                    <div className="space-y-5">
                        {/* Profile Image */}
                        <div className="relative bg-white p-4 rounded-xl shadow-md">
                            <label className="text-2xl font-semibold text-gray-700">Profile Image</label>
                            <img
                                src={partner.profilePic || '/avatar.png'}
                                alt="Profile"
                                className="w-full h-[260px] rounded-lg object-cover border-4 border-black shadow-lg"
                            />
                        </div>

                        {/* Profile Video */}
                        <div className="relative bg-white p-4 rounded-xl shadow-md">
                            <label className="text-2xl font-semibold text-gray-700">Profile Video</label>
                            {partner.profileVideo ? (
                                <video className="w-full h-[260px] object-cover border-4 border-black shadow-lg" controls>
                                    <source src={partner.profileVideo} type="video/mp4" />
                                </video>
                            ) : (
                                <div className="w-full h-40 border-4 border-blue-500 flex justify-center items-center bg-gray-300">
                                    <p className="text-gray-500">No Video Available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Second Column - Partner Details */}
                    <div className="bg-white p-5 rounded-xl shadow-md space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-700">Partner Details</h2>

                        <div>
                            <label className="block text-gray-600 font-medium">Name</label>
                            <input
                                type="text"
                                value={`${partner.firstName} ${partner.lastName}`}
                                readOnly
                                className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 font-medium">Email</label>
                            <input
                                type="email"
                                value={partner.email}
                                readOnly
                                className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 font-medium">Phone</label>
                            <input
                                type="text"
                                value={partner.mobile || 'Not Provided'}
                                readOnly
                                className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                            />
                        </div>
                        <div className="flex gap-4">

                            <div className="w-1/2">
                                <label className="block text-gray-600 font-medium">Date of Birth</label>
                                <input
                                    type="text"
                                    value={partner.dob ? new Date(partner.dob).toISOString().split('T')[0] : 'Not Provided'}
                                    readOnly
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                                />
                            </div>

                            <div className="w-1/2">
                                <label className="block text-gray-600 font-medium">Age</label>
                                <input
                                    type="text"
                                    value={partner.dob ? new Date().getFullYear() - new Date(partner.dob).getFullYear() : 'N/A'}
                                    readOnly
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-600 font-medium">Gender</label>
                            <input
                                type="text"
                                value={partner.gender || 'Not Provided'}
                                readOnly
                                className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                            />
                        </div>

                        <div className="">
                            <label className="block text-gray-600 font-medium">Requested At</label>
                            <div className="flex gap-4">
                                {/* Date Field */}
                                <div className="w-1/2">
                                    <label className="block text-gray-600 font-medium">Date</label>
                                    <input
                                        type="text"
                                        value={partner.createdAt ? new Date(partner.createdAt).toISOString().split('T')[0] : 'Not Provided'}
                                        readOnly
                                        className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                                    />
                                </div>

                                {/* Time Field */}
                                <div className="w-1/2">
                                    <label className="block text-gray-600 font-medium">Time</label>
                                    <input
                                        type="text"
                                        value={partner.createdAt ? new Date(partner.createdAt).toLocaleTimeString() : 'Not Provided'}
                                        readOnly
                                        className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                                    />
                                </div>
                            </div>
                        </div>


                        {/* Validate & Reject Buttons */}
                        <div className="flex justify-between mt-4 gap-2">
                            <button
                                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                                onClick={handleValidate}
                            >
                                Validate
                            </button>
                            <button
                                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                                onClick={handleReject}
                            >
                                Reject
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
