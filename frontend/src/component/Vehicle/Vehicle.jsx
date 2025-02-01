import React, { useState, useEffect } from 'react';
import { useVehicleStore } from '../../store/useVehicleStore';

export default function FeaturedVehicles() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const { fetchVehicleData, fetchVehicleModelData, vehicleModelDetails } = useVehicleStore();

    useEffect(() => {
        fetchVehicleData(); // Fetch vehicle data
        fetchVehicleModelData(); // Fetch vehicle model data
    }, [fetchVehicleData, fetchVehicleModelData]);

    const nextSlide = () => {
        if (vehicleModelDetails?.length) {
            setCurrentSlide((prev) => (prev + 1) % vehicleModelDetails.length);
        }
    };

    const prevSlide = () => {
        if (vehicleModelDetails?.length) {
            setCurrentSlide((prev) => (prev - 1 + vehicleModelDetails.length) % vehicleModelDetails.length);
        }
    };

    return (
        <div
            className="relative isolate overflow-hidden py-24 sm:py-24"
            style={{ backgroundColor: '#FFE5B4' }}
        >
            <section className="py-12 px-4">
                <h6 className="text-lg font-bold text-center text-blue-500 uppercase">WHAT WE OFFER</h6>
                <h1 className="text-6xl font-extrabold text-center mb-10 text-gray-800 text-shadow-xl">
                    Featured Vehicles
                </h1>
                <div className="relative w-full max-w-5xl mx-auto">
                    {vehicleModelDetails && vehicleModelDetails.length > 0 ? (
                        <>
                            <div className="overflow-hidden shadow-2xl rounded-lg">
                                <div
                                    className="flex transition-transform duration-700"
                                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                >
                                    {vehicleModelDetails.map((vehicle, idx) => (
                                        <div className="w-full flex-shrink-0" key={idx}>
                                            <div className="bg-gradient-to-r from-red-200 to-orange-300 rounded-lg overflow-hidden shadow-lg">
                                                <img
                                                    src={vehicle.modelPic}
                                                    className="w-full h-80 object-cover rounded-xl transform transition-all duration-500 hover:scale-110 hover:rotate-2"
                                                    alt={vehicle.vehicleModel}
                                                />
                                                <div className="p-6 bg-gradient-to-r from-red-200 to-orange-300">
                                                    <h5 className="text-2xl font-semibold text-gray-800 text-center mb-4">
                                                        {vehicle.vehicleType} {vehicle.vehicleMake} {vehicle.vehicleModel}
                                                    </h5>
                                                    <div className="flex justify-center gap-6 mt-4">
                                                        <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl transform transition-all duration-300 hover:bg-blue-700 hover:scale-105 shadow-md hover:shadow-lg">
                                                            Book Now
                                                        </button>
                                                        <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl transform transition-all duration-300 hover:bg-green-700 hover:scale-105 shadow-md hover:shadow-lg">
                                                            Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <button
                                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:bg-black hover:scale-110 transition-all duration-300"
                                onClick={prevSlide}
                                aria-label="Previous Slide"
                            >
                                <span className="text-3xl font-semibold">&lt;</span>
                            </button>
                            <button
                                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:bg-black hover:scale-110 transition-all duration-300"
                                onClick={nextSlide}
                                aria-label="Next Slide"
                            >
                                <span className="text-3xl font-semibold">&gt;</span>
                            </button>
                        </>
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-500 text-lg">No vehicles available at the moment.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
