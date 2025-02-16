import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-12 w-full z-50 ">
            <div className="container mx-auto px-6 lg:px-10">
                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">

                    {/* Logo & About Section */}
                    <div>
                        <h2 className="text-4xl font-extrabold">
                            <Link to="/" className="text-white">
                                Click<span className="text-teal-400">Ride</span>
                            </Link>
                        </h2>
                        <p className="text-gray-400 mt-3 text-lg leading-relaxed">
                            Your hassle-free solution for renting a car. Whether for a day or a month, we make it simple, fast, and affordable.
                        </p>
                        {/* Social Icons */}
                        <div className="flex justify-center md:justify-start gap-4 mt-4">
                            <a href="#" className="text-white text-2xl hover:text-teal-400 transition">
                                <i className="bi bi-twitter"></i>
                            </a>
                            <a href="#" className="text-white text-2xl hover:text-teal-400 transition">
                                <i className="bi bi-facebook"></i>
                            </a>
                            <a href="#" className="text-white text-2xl hover:text-teal-400 transition">
                                <i className="bi bi-instagram"></i>
                            </a>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h4 className="text-2xl font-semibold mb-4 text-teal-400">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-300 text-lg hover:text-teal-400 transition">Home</Link></li>
                            <li><Link to="/About" className="text-gray-300 text-lg hover:text-teal-400 transition">About</Link></li>
                            <li><Link to="/Pricing" className="text-gray-300 text-lg hover:text-teal-400 transition">Pricing</Link></li>
                            <li><Link to="/Login" className="text-gray-300 text-lg hover:text-teal-400 transition">Login</Link></li>
                            <li><Link to="/Signup" className="text-gray-300 text-lg hover:text-teal-400 transition">Sign Up</Link></li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h4 className="text-2xl font-semibold mb-4 text-teal-400">Get in Touch</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start justify-center md:justify-start">
                                <i className="bi bi-geo-alt text-teal-400 mr-3 text-xl"></i>
                                <span className="text-gray-300 text-lg">
                                    CRS shop no.20, Opp. LDRP ITR, Sector 15, Gandhinagar, Gujarat, 382016, India
                                </span>
                            </li>
                            <li className="flex items-center justify-center md:justify-start">
                                <i className="bi bi-telephone text-teal-400 mr-3 text-xl"></i>
                                <a href="tel:+911110123000" className="text-gray-300 hover:text-teal-400 transition text-lg">+91 1110123000</a>
                            </li>
                            <li className="flex items-center justify-center md:justify-start">
                                <i className="bi bi-envelope text-teal-400 mr-3 text-xl"></i>
                                <a href="mailto:clickride@gmail.com" className="text-gray-300 hover:text-teal-400 transition text-lg">clickride@gmail.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-gray-800 mt-10 pt-6 text-center">
                    <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} ClickRide. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
