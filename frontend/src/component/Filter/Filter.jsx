import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicleStore } from '../../store/useVehicleStore'; // Assuming you have a store setup for fetching vehicle data
import { Search } from 'lucide-react';



export default function Filter() {
    const navigate = useNavigate();
    const { vehicleModelDetails, vehicleDetails, fetchVehicleModelData, fetchVehicleData } = useVehicleStore();
    const [searchKeyword, setSearchKeyword] = useState(""); // State for search input
    const [filteredVehicles, setFilteredVehicles] = useState([]); // Initialize with an empty array
    const [searchType, setSearchType] = useState(); // State for search type (Model or Vehicle)
    const [showResults, setShowResults] = useState(true); // Toggle state for results visibility
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [selectedFuel, setSelectedFuel] = useState("");
    const [selectedTransmission, setSelectedTransmission] = useState("");
    const [selectedSeats, setSelectedSeats] = useState("");

    // Implement debounce for search keyword
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            filterVehicles();
        }, 300); // 300ms debounce time

        return () => clearTimeout(timeoutId); // Clean up the timeout on component unmount or keyword change
    }, [searchKeyword]);

    const filterVehicles = () => {
        let filtered = [];
        const keywords = searchKeyword.trim().toLowerCase().split(/\s+/); // Split search into words

        if (searchType === "model") {
            filtered = vehicleModelDetails.filter(vehicle => {
                const make = vehicle.vehicleMake.toLowerCase();
                const type = vehicle.vehicleType.toLowerCase();
                const model = vehicle.vehicleModel.toLowerCase();

                const matchesKeywords = keywords.every(keyword =>
                    make.includes(keyword) || type.includes(keyword) || model.includes(keyword)
                );

                return (
                    matchesKeywords
                );
            });
        } else {
            filtered = vehicleDetails.filter(vehicle => {
                const make = vehicle.modelID?.vehicleMake?.toLowerCase() || "";
                const model = vehicle.modelID?.vehicleModel?.toLowerCase() || "";
                const type = vehicle.modelID?.vehicleType.toLowerCase();
                const regNum = String(vehicle.vehicleRegNumber.toLowerCase())
                const matchesKeywords = keywords.every(keyword =>
                    make.includes(keyword) || model.includes(keyword) || type.includes(keyword) || regNum.includes(keyword)
                );

                return (
                    matchesKeywords &&
                    (selectedSeats === "" || String(vehicle.vehicleSeat) === selectedSeats) &&
                    (selectedFuel === "" || vehicle.vehicleFuelType?.toLowerCase() === selectedFuel.toLowerCase()) &&
                    (selectedTransmission === "" || vehicle.vehicleTransmission?.toLowerCase() === selectedTransmission.toLowerCase())
                );
            });
        }

        setFilteredVehicles(filtered);
    };


    useEffect(() => {
        fetchVehicleModelData(); // Fetch vehicle model data on component mount
        fetchVehicleData(); // Fetch all vehicle data
    }, [fetchVehicleModelData, fetchVehicleData]);

    // Automatically trigger search when the searchType changes
    useEffect(() => {
        if (searchType) {
            filterVehicles();
        }
    }, [searchType, searchKeyword, selectedFuel, selectedTransmission, selectedSeats, vehicleDetails, vehicleModelDetails]); // Trigger whenever either searchType or searchKeyword changes

    const handleViewVehicleDetails = (vehicleId) => {
        navigate(`/VehicleManage/${vehicleId}`); // Navigate to the details page
    };

    const handleViewModelDetails = (modelId) => {
        navigate(`/VehicleModel/${modelId}`); // Navigate to the details page
    };

    const handleSearchButtonClick = () => {
        filterVehicles(); // Trigger the search filter when the search button is clicked
    };
    const handleToggleResults = () => {
        setShowResults(!showResults);
    };


    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 w-full max-w-4xl mx-auto p-4">
                <input
                    type="text"
                    placeholder="Search vehicles..."
                    className="border border-gray-300 rounded px-3 py-2 w-full sm:col-span-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />

                <button
                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 sm:col-span-1 w-full"
                >
                    Advanced Search
                </button>

            </div>

            {showAdvancedSearch && (
                <div className="p-6 h-screen overflow-y-auto scrollbar-hide">
                    <div className="flex justify-center items-center gap-6 mb-6">
                        <div className="flex justify-center items-center gap-4">
                            <div>
                                <input
                                    type="radio"
                                    id="model"
                                    name="searchType"
                                    value="model"
                                    checked={searchType === "model"}
                                    onChange={() => setSearchType("model")}
                                    className="transition-all duration-300"
                                />
                                <label htmlFor="model" className="ml-2 text-sm">Model</label>
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    id="vehicle"
                                    name="searchType"
                                    value="vehicle"
                                    checked={searchType === "vehicle"}
                                    onChange={() => setSearchType("vehicle")}
                                    className="transition-all duration-300"
                                />
                                <label htmlFor="vehicle" className="ml-2 text-sm">Vehicle</label>
                            </div>
                        </div>

                        <button
                            onClick={handleToggleResults}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all duration-300"
                        >
                            {showResults ? "Hide Results" : "Show Results"}
                        </button>
                    </div>

                    {searchType === "vehicle" && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                            <select
                                className="border border-gray-300 rounded px-3 py-2 w-full transition-all duration-300"
                                value={selectedSeats}
                                onChange={(e) => setSelectedSeats(e.target.value)}
                            >
                                <option value="">Seating Capacity</option>
                                <option value="2">2</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                            </select>
                            <select
                                className="border border-gray-300 rounded px-3 py-2 w-full transition-all duration-300"
                                value={selectedFuel}
                                onChange={(e) => setSelectedFuel(e.target.value)}
                            >
                                <option value="">Fuel Type</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                            </select>
                            <select
                                className="border border-gray-300 rounded px-3 py-2 w-full transition-all duration-300"
                                value={selectedTransmission}
                                onChange={(e) => setSelectedTransmission(e.target.value)}
                            >
                                <option value="">Transmission</option>
                                <option value="Manual">Manual</option>
                                <option value="Automatic">Automatic</option>
                            </select>

                        </div>
                    )}

                    {showResults && (
                        <div className="transition-opacity duration-500 opacity-100">
                            {searchType === "model" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                                    {filteredVehicles.length > 0 ? (
                                        filteredVehicles
                                            .sort((a, b) => `${a.vehicleMake} ${a.vehicleModel}`.localeCompare(`${b.vehicleMake} ${b.vehicleModel}`))
                                            .map((vehicle, index) => (
                                                <div
                                                    key={index}
                                                    role="button"
                                                    onClick={() => handleViewModelDetails(vehicle._id)}
                                                    className="relative flex flex-col rounded-lg border border-slate-200 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 p-4"
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-full h-full mb-4 grid place-items-center bg-gray-200">
                                                            <img
                                                                alt={vehicle.vehicleModel}
                                                                src={vehicle.modelPic || '/default.jpg'}
                                                                className="w-full h-full object-cover rounded-xl transition-all duration-300"
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
                            )}
                            {searchType === "vehicle" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                                    {filteredVehicles.length > 0 ? (
                                        filteredVehicles
                                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                            .map((vehicle, index) => {
                                                const vehicleType = vehicle.modelID?.vehicleType || 'Unknown Type';
                                                const vehicleMake = vehicle.modelID?.vehicleMake || 'Unknown Make';
                                                const vehicleModel = vehicle.modelID?.vehicleModel || 'Unknown Model';

                                                return (
                                                    <div
                                                        key={index}
                                                        role="button"
                                                        onClick={() => handleViewVehicleDetails(vehicle._id)}
                                                        className="relative flex flex-col rounded-lg border border-slate-200 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 p-4"
                                                    >
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-full h-full mb-4 grid place-items-center bg-gray-200">
                                                                <img
                                                                    alt={vehicleModel}
                                                                    src={vehicle.vehiclePic || '/default.jpg'}
                                                                    className="w-full h-full object-cover rounded-xl transition-all duration-300"
                                                                />
                                                            </div>
                                                            <h6 className="text-slate-800 font-medium text-center">
                                                                {vehicleType} {vehicleMake} {vehicleModel}
                                                            </h6>
                                                            {vehicle.registrationNumber && (
                                                                <p className="text-sm text-gray-600">Reg: {vehicle.registrationNumber}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                    ) : (
                                        <p>No vehicles found.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}



        </div>
    );
}
