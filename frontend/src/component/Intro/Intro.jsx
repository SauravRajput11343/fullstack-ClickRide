import React from "react";
import CarBg from '../../assets/img/carBg1.avif';
import { Link } from "react-router-dom";

export default function Intro() {
    return (
        <div
            className="relative isolate bg-cover bg-center bg-no-repeat h-screen shadow-lg"
            style={{
                backgroundImage: `url(${CarBg})`,
                backgroundPosition: 'center',
            }}
        >
            {/* Background Overlay with opacity for depth */}
            <div className="absolute inset-0 bg-black opacity-40"></div>

            {/* Main Content Area with Text */}
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center text-white h-screen relative z-10">
                <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl text-shadow-xl transition-all duration-500 ease-in-out transform hover:scale-105">
                    Fast and Easy Way To Rent A Vehicle
                </h1>
                <p className="mt-8 text-lg font-medium sm:text-xl text-shadow-lg leading-relaxed transition-all duration-300 ease-in-out opacity-90 hover:opacity-100">
                    Looking for a hassle-free way to rent a car? You’re in the right place! Whether you need a vehicle for a
                    day, a week, or longer, we make car rentals simple, fast, and affordable.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6 text-xl font-bold text-shadow-lg">
                    <Link
                        to="/Signup"
                        className="rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white hover:text-black shadow-lg hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-300 ease-in-out transform hover:scale-105"
                    >
                        Get started
                    </Link>
                </div>
            </div>
        </div>
    );
}
