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
            <div className={`transition-all duration-300 ${isDrawerOpen ? "lg:pl-[16rem]" : ""}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 p-5">
                    {partnerVehicles.length > 0 ? (
                        partnerVehicles
                            .sort((a, b) => {
                                const nameA = `${a.modelID.vehicleMake} ${a.modelID.vehicleModel}`.toLowerCase();
                                const nameB = `${b.modelID.vehicleMake} ${b.modelID.vehicleModel}`.toLowerCase();
                                return nameA.localeCompare(nameB);
                            })
                            .map((vehicle, index) => (
                                <div
                                    key={index}
                                    role="button"
                                    onClick={() => navigate(`/VehicleManage/${vehicle._id}`)}
                                    className="relative flex flex-col rounded-lg border border-slate-200 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 p-4"
                                >
                                    {/* Vehicle Image */}
                                    <div className="w-full h-40 grid place-items-center bg-gray-200 rounded-md overflow-hidden">
                                        <img
                                            alt={`Model: ${vehicle.modelID.vehicleModel}`}
                                            src={vehicle.vehiclePic || '/default.jpg'}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Vehicle Details in Two-Column Grid */}
                                    <div className="mt-3">
                                        <h6 className="text-lg font-semibold text-gray-800 text-center">
                                            {vehicle.modelID.vehicleMake}
                                        </h6>
                                        <div className="grid grid-cols-2 gap-y-2 mt-2 text-sm text-gray-600">
                                            {/* Left Column (Labels) */}
                                            <div className="font-semibold">Type:</div>
                                            <div>{vehicle.modelID.vehicleType}</div>

                                            <div className="font-semibold">Model:</div>
                                            <div>{vehicle.modelID.vehicleModel}</div>

                                            <div className="font-semibold">Reg Number:</div>
                                            <div>{vehicle.vehicleRegNumber}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <p className="col-span-5 text-center text-gray-600">No vehicles found for your account.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
