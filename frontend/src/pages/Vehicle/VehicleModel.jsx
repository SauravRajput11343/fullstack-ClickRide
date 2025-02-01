import React, { useEffect, useState } from "react";
import AdminNav from "../../component/AdminNav/AdminNav";
import { AdminSideBar } from "../../component/AdminSideBar/AdminSideBar";
import { useVehicleStore } from "../../store/useVehicleStore";
import { useNavigate, useParams } from "react-router-dom";

export default function VehicleModel() {
    const navigate = useNavigate();
    const { modelId } = useParams(); // Get the modelId from the URL
    const { vehicleDetails = [], fetchVehicleData } = useVehicleStore(); // Ensure vehicleDetails is always an array

    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [modelDetails, setModelDetails] = useState(null);
    const [loading, setLoading] = useState(true); // Added loading state

    const isDrawerOpen = true;

    useEffect(() => {
        fetchVehicleData()
            .then(() => {
                setLoading(false); // Data fetched, stop loading
            })
            .catch((error) => {
                console.error("Error fetching vehicle data:", error);
                setLoading(false); // Stop loading even if there's an error
            });
    }, [fetchVehicleData]);

    useEffect(() => {

        if (Array.isArray(vehicleDetails) && modelId) {
            // Filter vehicles based on modelId
            const vehiclesForModel = vehicleDetails.filter(
                (vehicle) => vehicle.modelID._id === modelId
            );


            setFilteredVehicles(vehiclesForModel);

            // Get the model details for the heading
            if (vehiclesForModel.length > 0) {
                setModelDetails(vehiclesForModel[0].modelID);

            } else {
                console.warn("No vehicles found for the given modelId.");
                setModelDetails(null); // Clear model details if no vehicles are found
            }
        } else if (!Array.isArray(vehicleDetails)) {
            console.warn("vehicleDetails is not an array.");
            setModelDetails(null); // Clear model details if vehicleDetails is not an array
        }
    }, [vehicleDetails, modelId]);

    const handleViewVehicleDetails = (vehicleId) => {
        navigate(`/VehicleManage/${vehicleId}`); // Navigate to the details page
    };

    if (loading) {
        return <p>Loading vehicles...</p>; // Show loading message while fetching data
    }

    return (
        <div>
            <AdminNav />
            <AdminSideBar />
            <div
                className={`transition-all duration-300 ${isDrawerOpen ? "lg:pl-[16rem]" : ""} mt-16`}
            >
                <div className="p-5">
                    {/* Heading Section */}
                    {modelDetails ? (
                        <div className="mb-6 text-center">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {modelDetails.vehicleModel}
                            </h2>
                            <p className="text-gray-600">
                                {modelDetails.vehicleMake} - {modelDetails.vehicleType}
                            </p>
                        </div>
                    ) : (
                        <p>Loading model details...</p>
                    )}

                    {/* Vehicle Cards Section */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {filteredVehicles.length > 0 ? (
                            filteredVehicles.map((vehicle) => (
                                <div
                                    key={vehicle._id}
                                    role="button"
                                    onClick={() => handleViewVehicleDetails(vehicle._id)}
                                    className="relative flex flex-col rounded-lg border border-slate-200 bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
                                >
                                    {/* Card content */}
                                    <div className="flex flex-col items-center p-2">
                                        <div className="w-full h-full mb-4 grid place-items-center bg-gray-200">
                                            <img
                                                alt={vehicle.modelID.vehicleModel}
                                                src={vehicle.vehiclePic || "/default.jpg"}
                                                className="w-full h-full object-cover rounded-xl"
                                            />
                                        </div>
                                        <h6 className="text-gray-500 font-medium text-center">
                                            <p>Reg. No. {vehicle.vehicleRegNumber} </p>
                                        </h6>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No vehicles found for this model.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
