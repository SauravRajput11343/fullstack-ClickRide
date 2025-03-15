import React, { useEffect } from 'react';
import AdminNav from '../../../component/AdminNav/AdminNav';
import { AdminSideBar } from '../../../component/AdminSideBar/AdminSideBar';
import { useAuthStore } from '../../../store/useAuthStore';
import { useVehicleStore } from '../../../store/useVehicleStore';
import { Typography } from '@material-tailwind/react';

export default function UserDashboard() {
    const {
        totalCustomers,
        totalPartners,
        customerDetails,
        partnerDetails,
        fetchUserData,
    } = useAuthStore();

    const {
        totalVehicles,
        vehicleDetails,
        fetchVehicleData,
    } = useVehicleStore();

    const isDrawerOpen = true;

    useEffect(() => {
        fetchUserData();
        fetchVehicleData();
    }, [fetchUserData, fetchVehicleData]);

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNav />
            <AdminSideBar />
            <div className={`transition-all duration-300 ${isDrawerOpen ? "lg:pl-[16rem]" : ""} pt-20 pb-10`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg overflow-hidden">
                            <div className="px-4 py-5 sm:p-6">
                                <dl>
                                    <dt className="text-sm font-medium text-blue-50 truncate">Total Customers</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-white">{totalCustomers || 0}</dd>
                                </dl>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg overflow-hidden">
                            <div className="px-4 py-5 sm:p-6">
                                <dl>
                                    <dt className="text-sm font-medium text-purple-50 truncate">Total Partners</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-white">{totalPartners || 0}</dd>
                                </dl>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg overflow-hidden">
                            <div className="px-4 py-5 sm:p-6">
                                <dl>
                                    <dt className="text-sm font-medium text-emerald-50 truncate">Total Vehicles</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-white">{totalVehicles || 0}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>

                    {/* User and Vehicle Lists */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Customer List */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                            <div className="px-4 py-5 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                    </svg>
                                    Customers
                                </h3>
                            </div>
                            <div className="h-96 overflow-y-scroll scrollbar-hide">
                                {customerDetails && customerDetails.length > 0 ? (
                                    customerDetails.map((customer, index) => (
                                        <div key={index} className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={customer.profilePic || "/avatar.png"}
                                                        alt={customer.firstName}
                                                        className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {customer.firstName} {customer.lastName}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {customer.email || "No Email"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-6 text-center text-gray-500">
                                        <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No customers</h3>
                                        <p className="mt-1 text-sm text-gray-500">No customer accounts found in the system.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Partner List */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                            <div className="px-4 py-5 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                    </svg>
                                    Partners
                                </h3>
                            </div>
                            <div className="h-96 overflow-y-scroll scrollbar-hide">
                                {partnerDetails && partnerDetails.length > 0 ? (
                                    partnerDetails.map((partner, index) => (
                                        <div key={index} className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={partner.profilePic || "/avatar.png"}
                                                        alt={partner.firstName}
                                                        className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {partner.firstName} {partner.lastName}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {partner.email || "No Email"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-6 text-center text-gray-500">
                                        <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No partners</h3>
                                        <p className="mt-1 text-sm text-gray-500">No partner accounts found in the system.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Vehicle List */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                            <div className="px-4 py-5 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3a1 1 0 001-1v-3.05a2.5 2.5 0 010-4.9V4a1 1 0 00-1-1H3z" />
                                    </svg>
                                    Recent Vehicles
                                </h3>
                            </div>
                            <div className="h-96 overflow-y-scroll scrollbar-hide">
                                {vehicleDetails && vehicleDetails.length > 0 ? (
                                    vehicleDetails
                                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                        .slice(0, 10)
                                        .map((vehicle, index) => (
                                            <div key={index} className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={vehicle.vehicleImagesId.VehicleFrontPic || "/avatar.png"}
                                                            alt="Vehicle"
                                                            className="h-10 w-10 rounded-md object-cover ring-1 ring-gray-200"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {vehicle.modelID.vehicleMake} {vehicle.modelID.vehicleModel}
                                                        </p>
                                                        <p className="text-sm text-gray-500 truncate">
                                                            {vehicle.vehicleRegNumber}
                                                        </p>
                                                    </div>

                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="px-4 py-6 text-center text-gray-500">
                                        <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles</h3>
                                        <p className="mt-1 text-sm text-gray-500">No vehicles found in the system.</p>
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