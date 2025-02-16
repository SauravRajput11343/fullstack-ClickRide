import React, { useState, useEffect } from 'react';
import AdminNav from '../../component/AdminNav/AdminNav';
import { AdminSideBar } from '../../component/AdminSideBar/AdminSideBar';
import { useVehicleStore } from '../../store/useVehicleStore';
import { useNavigate } from 'react-router-dom';
import Filter from '../../component/Filter/Filter';

export default function VehicleDashboard() {

    const isDrawerOpen = true;
    const navigate = useNavigate();
    const { vehicleDetails, fetchVehicleData, fetchVehicleModelData, vehicleModelDetails } = useVehicleStore();

    useEffect(() => {
        fetchVehicleData(); // Fetch vehicle data
        fetchVehicleModelData(); // Fetch vehicle model data
    }, [fetchVehicleData, fetchVehicleModelData]);

    const handleViewVehicleDetails = (vehicleId) => {
        navigate(`/VehicleManage/${vehicleId}`); // Navigate to the details page
    };

    const handleViewModelDetails = (modelId) => {
        navigate(`/VehicleModel/${modelId}`); // Navigate to the details page
    };



    return (
        <div>
            <AdminNav />
            <AdminSideBar />

            <div className={`transition-all duration-300 ${isDrawerOpen ? "lg:pl-[16rem]" : ""} mt-16`}>
                {/* Main Grid Layout */}
                <div className='col-span-1 sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 h-[auto] overflow-y-auto scrollbar-hide shadow-xl'>
                    <Filter />
                </div>

                <div className=" grid grid-cols-1 lg:grid-cols-5 gap-4 p-5">




                    {/* Vehicle Category Section */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 h-[595px] overflow-y-auto scrollbar-hide shadow-xl">
                        <div className="sticky top-0 z-10 bg-white p-3">
                            <h3 className="text-xl font-semibold">Vehicle Models</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {vehicleModelDetails && vehicleModelDetails.length > 0 ? (
                                vehicleModelDetails
                                    .sort((a, b) => {
                                        const nameA = `${a.vehicleMake} ${a.vehicleModel}`.toLowerCase();
                                        const nameB = `${b.vehicleMake} ${b.vehicleModel}`.toLowerCase();
                                        return nameA.localeCompare(nameB);
                                    })
                                    .map((vehicle, index) => (
                                        <div
                                            key={index}
                                            role="button"
                                            onClick={() => handleViewModelDetails(vehicle._id)}
                                            className="relative flex flex-col rounded-lg border border-slate-200 bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
                                        >
                                            <div className="flex flex-col items-center p-2">
                                                <div className="w-full h-full mb-4 grid place-items-center bg-gray-200">
                                                    <img
                                                        alt={vehicle.vehicleModel}
                                                        src={vehicle.modelPic || '/default.jpg'}
                                                        className="w-full h-full object-cover rounded-xl"
                                                    />
                                                </div>
                                                <h6 className="text-slate-800 font-medium text-center">
                                                    {vehicle.vehicleType} {vehicle.vehicleMake} {vehicle.vehicleModel}
                                                </h6>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <p>No vehicle models found.</p>
                            )}
                        </div>
                    </div>

                    {/* Vehicle Details Section */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-2 bg-white h-[595px] rounded-xl shadow-2xl overflow-y-scroll scrollbar-hide">
                        <div className="sticky top-0 z-10 bg-white p-3">
                            <h3 className="text-xl font-semibold">Recently Added Vehicles</h3>
                        </div>
                        <div className="bg-white lg:col-span-4 md:col-span-4 rounded-xl shadow-2xl overflow-y-scroll scrollbar-hide">
                            {vehicleDetails && vehicleDetails.length > 0 ? (
                                vehicleDetails
                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt (most recent first)
                                    .slice(0, 10)
                                    .map((vehicle, index) => (
                                        <div
                                            key={index}
                                            role="button"
                                            onClick={() => handleViewVehicleDetails(vehicle._id)}
                                            className="relative flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm"
                                        >
                                            <nav className="flex flex-col gap-1 p-1.5">
                                                <div className="text-slate-800 flex items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100">
                                                    <div className="mr-4 grid place-items-center">
                                                        <img
                                                            alt={vehicle.vehicleRegNumber}
                                                            src={vehicle?.vehicleImagesId.VehicleFrontPic || '/avatar.png'}
                                                            className="relative inline-block h-12 w-12 rounded-full object-cover object-center"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h6 className="text-slate-800 font-medium">
                                                            {vehicle.modelID.vehicleMake} {vehicle.modelID.vehicleModel}
                                                        </h6>
                                                        <p className="text-slate-500 text-sm">
                                                            {vehicle.vehicleRegNumber || 'No Registration Number'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </nav>
                                        </div>
                                    ))
                            ) : (
                                <p>No vehicles found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
