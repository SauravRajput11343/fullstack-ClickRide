import React, { useState } from 'react';
import ToyotaCorolla from '../../assets/img/ToyotaCorolla.webp';
import HondaCivic from '../../assets/img/HondaCivic.webp';
import FordF from '../../assets/img/FordF150.jpg';
import Chevrolet from '../../assets/img/ChevroletSilverado.jpg';
import Tesla from '../../assets/img/TeslaModel3.jpg';
import Honda from '../../assets/img/HondaCRV.webp';

const vehicleData = [
    { img: ToyotaCorolla, name: 'Toyota Corolla' },
    { img: HondaCivic, name: 'Honda Civic' },
    { img: FordF, name: 'Ford F-150' },
    { img: Chevrolet, name: 'Chevrolet Silverado' },
    { img: Tesla, name: 'Tesla Model 3' },
    { img: Honda, name: 'Honda CR-V' },
];

export default function FeaturedVehicles() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % vehicleData.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + vehicleData.length) % vehicleData.length);
    };

    return (
        <div className="relative isolate overflow-hidden  py-24 sm:py-24" style={{ backgroundColor: "#FFE5B4" }}>
            <section className="py-12 px-4">
                <h6 className="text-lg font-bold text-center text-blue-500">WHAT WE OFFER</h6>
                <h1 className="text-6xl font-bold text-center mb-10 text-black">Featured Vehicles</h1>
                <div className="relative w-full max-w-5xl mx-auto">
                    <div className="overflow-hidden shadow-2xl">
                        <div
                            className="flex transition-transform duration-700"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {vehicleData.map((vehicle, idx) => (
                                <div className="w-full flex-shrink-0" key={idx}>
                                    <div className="shadow-lg rounded-lg bg-gradient-to-r from-red-200 to-orange-300">
                                        <img
                                            src={vehicle.img}
                                            className="w-full h-80 object-cover rounded-xl" // Increased height here
                                            alt={vehicle.name}
                                        />
                                        <div className="p-4">
                                            <h5 className="text-2xl font-semibold text-gray-800 text-center" >{vehicle.name}</h5>
                                            <div className="flex justify-center p-2 mt-4">
                                                <button className="px-4 py-2 bg-blue-500 text-white rounded me-10 hover:bg-black">
                                                    Book Now
                                                </button>
                                                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-black">
                                                    Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center"
                        onClick={prevSlide}
                        aria-label="Previous Slide"
                    >
                        &lt;
                    </button>
                    <button
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center"
                        onClick={nextSlide}
                        aria-label="Next Slide"
                    >
                        &gt;
                    </button>
                </div>
            </section>
        </div>
    );
}