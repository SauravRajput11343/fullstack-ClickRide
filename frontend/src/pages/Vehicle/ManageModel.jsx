import React, { useEffect, useState } from "react";
import AdminNav from "../../component/AdminNav/AdminNav";
import { AdminSideBar } from "../../component/AdminSideBar/AdminSideBar";
import { useVehicleStore } from "../../store/useVehicleStore";
import { useNavigate, useParams } from "react-router-dom";

export default function ManageModel() {
    const isDrawerOpen = true;
    const navigate = useNavigate();
    const { vehicleDetails, fetchVehicleData, fetchVehicleModelData, vehicleModelDetails } = useVehicleStore();

    useEffect(() => {
        fetchVehicleData(); // Fetch vehicle data
        fetchVehicleModelData(); // Fetch vehicle model data
    }, [fetchVehicleData, fetchVehicleModelData]);


    const handleViewModelDetails = (ModelId) => {

        navigate(`/ManageModel/${ModelId}`); // Navigate to the details page
    };
    return (
        <div>
            <AdminNav />
            <AdminSideBar />
            <div
                className={`transition-all duration-300 ${isDrawerOpen ? "lg:pl-[16rem]" : ""}`}
            >
                {/* Main Grid Layout */}
                <div className="mt-6 grid  sm:grid-cols-2 lg:grid-cols-5  gap-4 p-5">

                    {/* Vehicle Category Section */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:h-[600px] overflow-y-auto scrollbar-hide shadow-xl">
                        {/* Heading Row */}

                        {/* Cards Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            {vehicleModelDetails && vehicleModelDetails.length > 0 ? (
                                vehicleModelDetails
                                    .sort((a, b) => {
                                        // Sorting vehicles by their name (vehicle make + model) in ascending order
                                        const nameA = `${a.vehicleMake} ${a.vehicleModel}`.toLowerCase();
                                        const nameB = `${b.vehicleMake} ${b.vehicleModel}`.toLowerCase();
                                        return nameA.localeCompare(nameB); // Ascending order
                                    })
                                    .map((vehicle, index) => (
                                        <div
                                            key={index}
                                            role="button"
                                            onClick={() => handleViewModelDetails(vehicle._id)}
                                            className="relative flex flex-col rounded-lg border border-slate-200 bg-white shadow-xl hover:shadow-2xl transition-all duration-300    " // Fixed height
                                        >
                                            {/* Card content */}
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
                </div>
            </div>
        </div>
    );
}
