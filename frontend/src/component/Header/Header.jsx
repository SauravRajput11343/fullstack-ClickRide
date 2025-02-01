import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const navigation = [
    { name: 'Home', to: '/' },
    { name: 'Pricing', to: '/Pricing' },
    { name: 'Career', to: '/Career' },
    { name: 'About Us', to: '/About' },
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-black sticky top-0 inset-x-0 z-50 shadow-md">
            <nav className="flex items-center justify-between p-4 lg:px-10">
                {/* Logo */}
                <div className="flex lg:flex-1">
                    <Link to="/" className="text-white text-2xl font-bold">
                        Click<span className="text-lime-500">Ride</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex lg:items-center lg:gap-x-8">
                    {navigation.map((item) => (
                        <Link key={item.name} to={item.to} className="text-white text-lg font-semibold hover:text-lime-500 transition">
                            {item.name}
                        </Link>
                    ))}

                    {/* Log In Button */}
                    <Link to="/Login" className="bg-lime-500 text-black px-5 py-2 rounded-lg font-semibold hover:bg-lime-600 transition">
                        Log In
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden">
                    <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-white">
                        <Bars3Icon className="w-7 h-7" />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-4/5 max-w-sm bg-black text-white p-6 shadow-lg">
                    {/* Close Button */}
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-bold">
                            Click<span className="text-lime-500">Ride</span>
                        </span>
                        <button onClick={() => setMobileMenuOpen(false)} className="text-white">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Mobile Navigation Links */}
                    <div className="mt-6 space-y-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.to}
                                className="block text-lg font-semibold py-2 px-3 rounded-lg hover:bg-lime-900 transition"
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* Log In Button (Mobile) */}
                        <Link
                            to="/Login"
                            className="block text-center bg-lime-500 text-black py-2 px-4 rounded-lg font-semibold hover:bg-lime-600 transition"
                        >
                            Log In
                        </Link>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    );
}
