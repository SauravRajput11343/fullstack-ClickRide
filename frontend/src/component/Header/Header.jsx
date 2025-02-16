import { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import useLocation
import { useAuthStore } from '../../store/useAuthStore';

const navigation = [
    { name: 'Home', to: '/' },
    { name: 'Pricing', to: '/Pricing' },
    { name: 'Career', to: '/Career' },
    { name: 'About Us', to: '/About' },
    { name: 'Vehicles', to: '/ViewVehicle' }
];

const userNavigation = [
    { name: 'Your Profile', to: '/profile' },
    { name: 'ChangePassword', to: '/password' },
    { name: 'Sign out' },
];

export default function CustomerNav() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { authUser, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check the screen width and set the isMobile state
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024); // Define mobile size (less than 1024px)
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call initially to set correct state

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Function to determine if the link is active
    const isActive = (path) => location.pathname === path ? 'text-lime-500' : 'text-white';

    return (
        <header className="bg-black fixed top-0 inset-x-0 z-50 shadow-md">
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
                        <Link
                            key={item.name}
                            to={item.to}
                            className={`text-lg font-semibold hover:text-lime-500 transition ${isActive(item.to)}`}
                        >
                            {item.name}
                        </Link>
                    ))}

                    {/* Log In Button */}
                    {authUser ? (
                        <div className="flex items-center space-x-3">
                            <span className="text-lime-500 font-semibold text-lg">{authUser.firstName}</span>
                            <Menu as="div" className="relative ml-3">
                                <div>
                                    <MenuButton className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all">
                                        <span className="sr-only">Open user menu</span>
                                        <img
                                            alt="Profile"
                                            src={authUser?.profilePic || '/avatar.png'} // Ensure authUser.ProfilePic is loaded
                                            className="h-10 w-10 rounded-full"
                                        />
                                    </MenuButton>
                                </div>
                                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                                    {userNavigation.map((item) =>
                                        item.name === 'Sign out' ? (
                                            <MenuItem key={item.name}>
                                                <Link
                                                    onClick={handleLogout}
                                                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                                >
                                                    {item.name}
                                                </Link>
                                            </MenuItem>
                                        ) : (
                                            <MenuItem key={item.name}>
                                                <Link
                                                    to={item.to}
                                                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                                >
                                                    {item.name}
                                                </Link>
                                            </MenuItem>
                                        )
                                    )}
                                </MenuItems>
                            </Menu>
                        </div>
                    ) : (
                        <Link
                            to="/Login"
                            className="bg-lime-500 text-black px-5 py-2 rounded-lg font-semibold hover:bg-lime-600 transition"
                        >
                            Log In
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden relative">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-white">
                        <Bars3Icon className="w-7 h-7" />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobile && mobileMenuOpen && (
                <div className="absolute left-0 right-0 bg-black text-white p-4 shadow-lg w-full">
                    <div className="space-y-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.to}
                                className={`block text-lg font-semibold py-2 px-3 rounded-lg hover:bg-lime-900 transition ${isActive(item.to)}`}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* If user is logged in, show user navigation */}
                        {authUser ? (
                            <Menu as="div" className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <img
                                        alt="Profile"
                                        src={authUser?.profilePic || '/avatar.png'}
                                        className="h-8 w-8 rounded-full"
                                    />
                                    <span className="text-lime-500">{authUser.firstName}</span>
                                </div>

                                {userNavigation.map((item) =>
                                    item.name === 'Sign out' ? (
                                        <MenuItem key={item.name}>
                                            <Link
                                                onClick={handleLogout}
                                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                            >
                                                {item.name}
                                            </Link>
                                        </MenuItem>
                                    ) : (
                                        <MenuItem key={item.name}>
                                            <Link
                                                to={item.to}
                                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                            >
                                                {item.name}
                                            </Link>
                                        </MenuItem>
                                    )
                                )}
                            </Menu>
                        ) : (
                            <Link
                                to="/Login"
                                className="block text-center bg-lime-500 text-black py-2 px-4 rounded-lg font-semibold hover:bg-lime-600 transition"
                            >
                                Log In
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
