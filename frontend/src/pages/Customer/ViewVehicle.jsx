import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/Header/Header';
import CustomerSideBar from '../../component/Customer/CustomerSideBar';
import { useVehicleStore } from '../../store/useVehicleStore';
import { CustomerSideNav } from '../../component/Customer/CustomerSideNav';
import Footer from '../../component/Footer/Footer';

export default function ViewVehicle() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const isSideBarOpen = true;
    const { vehicleDetails, fetchVehicleData } = useVehicleStore();
    const navigate = useNavigate();

    const [filterData, setFilterData] = useState({
        vehicleType: '',
        vehicleMake: '',
        vehicleModel: '',
        vehicleSeat: '',
        transmission: '',
        fuelType: '',
        pricePerHour: 0,
        pricePerDay: 0
    });

    useEffect(() => {
        // Fetch vehicles when component mounts
        fetchVehicleData();
    }, [fetchVehicleData]);

    const handleFilterChange = (newFilterData) => {
        setFilterData(newFilterData);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const toggleDrawer = () => {
        setIsDrawerOpen((prev) => !prev);
        setIsOpen(!isOpen); // Toggle the state
    };

    // Ensure vehicleDetails is an array before calling filter
    const filteredVehicles = Array.isArray(vehicleDetails) ? vehicleDetails.filter((vehicle) => {
        const searchTermLower = searchTerm.toLowerCase();
        if (vehicle.availabilityStatus === "Booked") {
            return false;
        }
        const matchesSearchTerm = (
            vehicle.modelID.vehicleMake.toLowerCase().includes(searchTermLower) ||
            vehicle.modelID.vehicleType.toLowerCase().includes(searchTermLower) ||
            vehicle.modelID.vehicleModel.toLowerCase().includes(searchTermLower) ||
            vehicle.vehicleSeat.toString().includes(searchTermLower) ||
            vehicle.vehicleFuelType.toLowerCase().includes(searchTermLower) ||
            vehicle.vehicleTransmission.toLowerCase().includes(searchTermLower) ||
            vehicle.pricePerDay?.$numberDecimal.toString().includes(searchTermLower) ||
            vehicle.pricePerDay.toString().includes(searchTermLower)
        );

        const matchesFilter = (
            (filterData.vehicleType === '' || vehicle.modelID.vehicleType.toLowerCase().includes(filterData.vehicleType.toLowerCase())) &&
            (filterData.vehicleMake === '' || vehicle.modelID.vehicleMake.toLowerCase().includes(filterData.vehicleMake.toLowerCase())) &&
            (filterData.vehicleModel === '' || vehicle.modelID.vehicleModel.toLowerCase().includes(filterData.vehicleModel.toLowerCase())) &&
            (filterData.vehicleSeat === '' || vehicle.vehicleSeat.toString().includes(filterData.vehicleSeat.toString())) &&
            (filterData.transmission === '' || vehicle.vehicleTransmission.toLowerCase().includes(filterData.transmission.toLowerCase())) &&
            (filterData.fuelType === '' || vehicle.vehicleFuelType.toLowerCase().includes(filterData.fuelType.toLowerCase())) &&
            (filterData.pricePerDay === 0 || vehicle.pricePerDay === filterData.pricePerDay)
        );

        return matchesSearchTerm && matchesFilter;
    }) : [];

    const handleCardClick = (vehicleID) => {
        navigate(`/vehicleDetails/${vehicleID}`);
    };

    return (

        <div className={`bg-gray-100 min-h-screen  ${isSideBarOpen ? "lg:pl-[16rem]" : ""} `}>


            <Header />
            <CustomerSideNav />
            <CustomerSideBar isDrawerOpen={isDrawerOpen} filterData={filterData} onFilterChange={handleFilterChange} />

            <div className={`transition-all duration-300 ${isDrawerOpen ? "" : ""} mt-20 p-6 max-w-[1400px] mx-auto`}>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-6 mb-6">
                    {/* Search Input */}
                    <div className="md:col-span-3 lg:col-span-5">
                        <input
                            type="text"
                            placeholder="Search vehicles..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ease-in-out bg-white"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 md:col-span-3 lg:col-span-2">
                        <button
                            className={`px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300 w-full md:w-auto lg:w-[200px] 
                        ${isOpen ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'} shadow-md`}
                            type="button"
                            onClick={toggleDrawer}
                        >
                            {isOpen ? 'Close Filter' : 'Open Filter'}
                        </button>
                    </div>
                </div>

                {/* Vehicle Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredVehicles.length > 0 ? (
                        filteredVehicles.map((vehicle, index) => (
                            <div
                                key={index}
                                onClick={() => handleCardClick(vehicle._id)}
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
