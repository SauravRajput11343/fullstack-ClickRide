import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../../component/AdminNav/AdminNav';
import { PartnerSideBar } from '../../component/PartnerSideBar/PartnerSideBar';

import { useVehicleStore } from '../../store/useVehicleStore';
import { useAuthStore } from '../../store/useAuthStore';

export default function PartnerVehicleDashboard() {
    const isDrawerOpen = true;
    const navigate = useNavigate();
    const { authUser } = useAuthStore();

    const { vehicleDetails, fetchVehicleData } = useVehicleStore();
    const [profileData, setProfileData] = useState({
        userId: authUser?._id || '',
    });

    useEffect(() => {
        if (authUser) {
            setProfileData({
                userId: authUser?._id || ''
            });
        }
    }, [authUser]);

    useEffect(() => {
        fetchVehicleData()
    }, [fetchVehicleData]);

    const partnerVehicles = (Array.isArray(vehicleDetails) ? vehicleDetails : []).filter(
        vehicle => vehicle.owner === profileData.userId
    );

    return (
        <div>
            <AdminNav />
            <PartnerSideBar />
            <div className={`transition-all duration-300 ${isDrawerOpen ? "lg:pl-[16rem]" : ""} mt-16`}>


                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-5">
                    {partnerVehicles.length > 0 ? (
                        partnerVehicles.map((vehicle, index) => (
                            <div
                                key={index}
                                onClick={() => navigate(`/VehicleManage/${vehicle._id}`)}
                                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2 border border-gray-200"
                            >
                                {/* Vehicle Image */}
                                <div className="relative">
                                    <img
                                        src={vehicle.vehicleImagesId.VehicleFrontPic}
                                        alt={`${vehicle.modelID.vehicleMake} ${vehicle.modelID.vehicleModel}`}
                                        className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105 rounded-t-2xl"
                                    />
                                    <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold text-blue-600 shadow-md">
                                        {vehicle.modelID.vehicleType}
                                    </div>
                                    <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-sm font-semibold text-green-600 shadow-md">
                                        {vehicle.vehicleRegNumber}
                                    </div>
                                </div>

                                {/* Vehicle Details */}
                                <div className="p-5">
                                    <h2 className="text-xl font-bold text-gray-800 mb-3">
                                        {vehicle.modelID.vehicleMake} {vehicle.modelID.vehicleModel}
                                    </h2>

                                    <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <span className="mr-2">👥</span>
                                            {vehicle.vehicleSeat} Seats
                                        </div>
                                        <div className="flex items-center">
                                            <span className="mr-2">⚙️</span>
                                            {vehicle.vehicleTransmission}
                                        </div>
                                        <div className="flex items-center">
                                            <span className="mr-2">⛽</span>
                                            {vehicle.vehicleFuelType}
                                        </div>
                                        <div className="flex items-center">
                                            <span className="mr-2">🕒</span>
                                            ${vehicle.pricePerHour?.$numberDecimal || vehicle.pricePerHour}/hr
                                        </div>
                                    </div>

                                    {/* Pricing Section */}
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500">Price per day</span>
                                            <span className="text-2xl font-bold text-blue-600">
                                                ${vehicle.pricePerDay?.$numberDecimal || vehicle.pricePerDay}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500 text-lg">No vehicles found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
