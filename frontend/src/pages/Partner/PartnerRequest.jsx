import React, { useEffect } from 'react';
import AdminNav from '../../component/AdminNav/AdminNav';
import { AdminSideBar } from '../../component/AdminSideBar/AdminSideBar';
import { useAuthStore } from '../../store/useAuthStore';
import { usePartnerStore } from '../../store/usePartnerStore';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Users } from "lucide-react";
export default function PartnerRequest() {
    const navigate = useNavigate();
    const {
        totalPartners,
        partnerDetails,
        fetchUserData,
    } = useAuthStore();

    const {
        fetchPartnerData,
        totalPartnerRequest,
        partnerRequestDetails,
    } = usePartnerStore();

    const isDrawerOpen = true;

    useEffect(() => {
        fetchUserData();
        fetchPartnerData();
    }, [fetchUserData, fetchPartnerData]);

    const handlePartnerRequest = (partnerId) => {
        navigate(`/ManagePartner/${partnerId}`);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <AdminNav />
            <AdminSideBar />
            <div
                className={`transition-all duration-300 ${isDrawerOpen ? "lg:pl-[16rem]" : ""} mt-16`}
            >
                <div className="max-w-7xl mx-auto py-8 px-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Partner Management</h1>

                    {/* Stats Cards */}
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5 mb-8">
                        {/* Partner Request Count */}
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg lg:col-span-2 md:col-span-1 sm:col-span-1 overflow-hidden">
                            <div className="flex items-center p-6">
                                <div className="rounded-full bg-white/20 p-3 mr-4">
                                    <UserPlus className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Partner Requests</p>
                                    <h1 className="text-white text-3xl font-bold">{totalPartnerRequest || 0}</h1>
                                </div>
                            </div>
                        </div>

                        {/* Current Partner Count */}
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg lg:col-span-1 md:col-span-1 sm:col-span-1 overflow-hidden">
                            <div className="flex items-center p-6">
                                <div className="rounded-full bg-white/20 p-3 mr-4">
                                    <Users className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <p className="text-indigo-100 text-sm font-medium">Current Partners</p>
                                    <h1 className="text-white text-3xl font-bold">{totalPartners || 0}</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid lg:grid-cols-12 md:grid-cols-12 gap-6">
                        {/* Partner Request List */}
                        <div className="bg-white lg:col-span-8 md:col-span-6 rounded-xl shadow-lg overflow-hidden">
                            <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
                                <div className="flex items-center justify-between p-5">
                                    <h3 className="text-xl font-bold text-gray-800">Partner Requests</h3>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded">
                                        {totalPartnerRequest || 0} pending
                                    </span>
                                </div>
                            </div>

                            <div className="h-[600px] overflow-y-auto p-4">
                                {partnerRequestDetails && partnerRequestDetails.length > 0 ? (
                                    <div className="grid gap-4">
                                        {partnerRequestDetails.map((partner) => (
                                            <div
                                                key={partner._id}
                                                className="group relative flex flex-col rounded-lg border border-gray-200 bg-white hover:border-blue-200 hover:shadow-md transition-all duration-300"
                                            >
                                                <button
                                                    onClick={() => handlePartnerRequest(partner._id)}
                                                    className="text-gray-800 flex items-center p-4 w-full text-left"
                                                >
                                                    <div className="mr-4">
                                                        <img
                                                            alt={partner.firstName}
                                                            src={partner.profilePic || "/avatar.png"}
                                                            className="h-16 w-16 rounded-full object-cover object-center border-2 border-gray-200 group-hover:border-blue-300 transition-all"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h6 className="text-gray-800 text-lg font-semibold">{partner.firstName} {partner.lastName}</h6>
                                                        <p className="text-gray-500">{partner.email || "No Email"}</p>
                                                        <div className="flex items-center mt-2">
                                                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                                                                Pending Approval
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-blue-600 text-sm font-medium">View Details →</span>
                                                    </div>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-10">
                                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <p className="text-gray-500 font-medium">No partner requests found.</p>
                                        <p className="text-gray-400 text-sm mt-1">New requests will appear here.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Current Partners List */}
                        <div className="bg-white lg:col-span-4 md:col-span-6 rounded-xl shadow-lg overflow-hidden">
                            <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
                                <div className="flex items-center justify-between p-5">
                                    <h3 className="text-xl font-bold text-gray-800">Current Partners</h3>
                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded">
                                        {totalPartners || 0} active
                                    </span>
                                </div>
                            </div>

                            <div className="h-[600px] overflow-y-auto p-4">
                                {partnerDetails && partnerDetails.length > 0 ? (
                                    <div className="grid gap-4">
                                        {partnerDetails.map((partner, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="mr-4">
                                                    <img
                                                        alt={partner.firstName}
                                                        src={partner.profilePic || "/avatar.png"}
                                                        className="h-14 w-14 rounded-full object-cover object-center border-2 border-green-200"
                                                    />
                                                </div>
                                                <div>
                                                    <h6 className="text-gray-800 font-semibold">{partner.firstName} {partner.lastName}</h6>
                                                    <p className="text-gray-500 text-sm">{partner.email || "No Email"}</p>

                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-10">
                                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        <p className="text-gray-500 font-medium">No active partners yet.</p>
                                        <p className="text-gray-400 text-sm mt-1">Approved partners will appear here.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}