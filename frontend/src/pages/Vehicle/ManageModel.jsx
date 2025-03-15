import React, { useEffect, useState } from "react";
import AdminNav from "../../component/AdminNav/AdminNav";
import { AdminSideBar } from "../../component/AdminSideBar/AdminSideBar";
import { useVehicleStore } from "../../store/useVehicleStore";
import { useNavigate } from "react-router-dom";

export default function ManageModel() {
    const isDrawerOpen = true;
    const navigate = useNavigate();
    const { fetchVehicleData, fetchVehicleModelData, vehicleModelDetails } = useVehicleStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("All Types");
    const [filteredModels, setFilteredModels] = useState([]);

    useEffect(() => {
        fetchVehicleData();
        fetchVehicleModelData();
    }, [fetchVehicleData, fetchVehicleModelData]);

    useEffect(() => {
        if (vehicleModelDetails && vehicleModelDetails.length > 0) {
            let filtered = [...vehicleModelDetails];

            // Apply search filter across make, model, and type
            if (searchTerm) {
                filtered = filtered.filter(vehicle =>
                    // Search by make, model, or type - not case sensitive
                    vehicle.vehicleMake.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    vehicle.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    vehicle.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Apply type filter
            if (filterType !== "All Types") {
                filtered = filtered.filter(vehicle =>
                    vehicle.vehicleType === filterType
                );
            }

            // Sort alphabetically
            filtered = filtered.sort((a, b) => {
                const nameA = `${a.vehicleMake} ${a.vehicleModel}`.toLowerCase();
                const nameB = `${b.vehicleMake} ${b.vehicleModel}`.toLowerCase();
                return nameA.localeCompare(nameB);
            });

            setFilteredModels(filtered);
        } else {
            setFilteredModels([]);
        }
    }, [vehicleModelDetails, searchTerm, filterType]);

    const handleViewModelDetails = (ModelId) => {
        navigate(`/ManageModel/${ModelId}`);
    };

    // Extract unique vehicle types for the filter dropdown
    const vehicleTypes = vehicleModelDetails
        ? ["All Types", ...new Set(vehicleModelDetails.map(vehicle => vehicle.vehicleType))]
        : ["All Types"];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <AdminNav />
            <AdminSideBar />
            <div
                className={`transition-all duration-300 ${isDrawerOpen ? "lg:pl-[16rem]" : ""} pt-20`}
            >
                {/* Page Header */}
                <div className="px-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Vehicle Models</h1>
                    <p className="text-gray-500">Manage and view all vehicle models</p>
                </div>

                {/* Search and Filter Bar */}
                <div className="mx-6 p-4 bg-white rounded-lg shadow-md mb-6">
                    <div className="flex flex-row flex-wrap gap-4 items-center">
                        <div className="relative flex-grow max-w-sm">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by make, model or type..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <div className="flex items-center gap-2 flex-grow">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                            >
                                {vehicleTypes.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>

                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg ml-auto">
                                <span className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Model
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Search results count */}
                    <div className="mt-3 text-sm text-gray-500">
                        {filteredModels.length} {filteredModels.length === 1 ? 'model' : 'models'} found
                    </div>
                </div>

                {/* Models Grid */}
                <div className="px-6 pb-8">
                    {filteredModels.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {filteredModels.map((vehicle, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleViewModelDetails(vehicle._id)}
                                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer transform hover:-translate-y-1 transition-all duration-300 border border-gray-100"
                                >
                                    <div className="relative aspect-w-16 aspect-h-10 bg-gray-200 overflow-hidden">
                                        <img
                                            alt={vehicle.vehicleModel}
                                            src={vehicle.modelPic || '/default.jpg'}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 bg-opacity-90 rounded-full shadow-sm">
                                                {vehicle.vehicleType}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-800 text-lg">
                                            {vehicle.vehicleMake} {vehicle.vehicleModel}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-lg shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Vehicle Models Found</h3>
                            <p className="text-gray-500 max-w-md">
                                {searchTerm || filterType !== "All Types"
                                    ? "No models match your current search and filter criteria. Try adjusting your search or filters."
                                    : "There are no vehicle models available. Try adding a new model."
                                }
                            </p>
                            {(searchTerm || filterType !== "All Types") && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setFilterType("All Types");
                                    }}
                                    className="mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}
                            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                                Add New Model
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}