import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-10 md:py-12 w-full min-h-[400px]">
            <div className="container mx-auto px-5">
                <div className="flex flex-col md:flex-row justify-between mb-6">

                    <div className="w-full md:w-1/4 mb-4">
                        <h2 className="text-3xl font-bold">
                            <Link to="/" className="text-white no-underline">
                                Click<span className="text-teal-400">Ride</span>
                            </Link>
                        </h2>
                        <p className="text-gray-300 text-lg">
                            Looking for a hassle-free way to rent a car? Whether you need a vehicle for a day, a week, or longer, we make car rentals simple, fast, and affordable.
                        </p>
                        <div className="flex gap-3 mt-3">
                            <a href="#" className="text-white text-2xl">
                                <i className="bi bi-twitter"></i>
                            </a>
                            <a href="#" className="text-white text-2xl">
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a href="#" className="text-white text-2xl">
                                <i className="bi bi-instagram"></i>
                            </a>
                        </div>
                    </div>

                    <div className="w-full md:w-1/4 mb-4">
                        <h4 className="text-xl font-semibold">Information</h4>
                        <ul className="list-none">
                            <li><Link to="/" className="text-gray-300 block py-1 text-lg hover:text-teal-400">Home</Link></li>
                            <li><Link to="/About" className="text-gray-300 block py-1 text-lg hover:text-teal-400">About</Link></li>
                            <li><Link to="/Pricing" className="text-gray-300 block py-1 text-lg hover:text-teal-400">Pricing</Link></li>
                            <li><Link to="/Login" className="text-gray-300 block py-1 text-lg hover:text-teal-400">Login</Link></li>
                            <li><Link to="/Signup" className="text-gray-300 block py-1 text-lg hover:text-teal-400">SignUp</Link></li>
                        </ul>
                    </div>

                    <div className="w-full md:w-1/4 mb-4">
                        <h4 className="text-xl font-semibold">Have a Question?</h4>
                        <ul className="list-none">
                            <li className="flex items-start mb-2">
                                <i className="bi bi-geo-alt text-teal-400 mr-2"></i>
                                <span className="text-gray-300 text-lg">CRS shop no.20, opposite to LDRP ITR, Sector 15, Gandhinagar, Gujarat, 382016, India</span>
                            </li>
                            <li className="flex items-center mb-2">
                                <i className="bi bi-telephone text-teal-400 mr-2"></i>
                                <a href="tel:+911110123000" className="text-gray-300 no-underline hover:text-teal-400 text-lg">+91 1110123000</a>
                            </li>
                            <li className="flex items-center">
                                <i className="bi bi-envelope text-teal-400 mr-2"></i>
                                <a href="mailto:clickride@gmail.com" className="text-gray-300 no-underline hover:text-teal-400 text-lg">clickride@gmail.com</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}