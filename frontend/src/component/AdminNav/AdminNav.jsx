import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const navigation = [
    { name: 'Dashboard', to: '/dashboard' },
    { name: 'Team', to: '/team' },
    { name: 'Projects', to: '/projects' },
    { name: 'Calendar', to: '/calendar' },
    { name: 'Reports', to: '/reports' },
];
const userNavigation = [
    { name: 'Your Profile', to: '/profile' },
    { name: 'Settings', to: '/settings' },
    { name: 'Sign out' },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function AdminNav() {
    const { authUser, logout } = useAuthStore(); // Ensure that authUser is loaded
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="w-full z-50">
            <Disclosure as="nav" className="bg-gray-800 fixed top-0 left-0 right-0 z-50 w-full">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-16 items-center justify-between">
                                <div className="flex items-center">
                                    <div className="shrink-0">
                                        <Link to="/">
                                            <span className="text-white text-xl">
                                                <b>Click<span className="text-lime-500">Ride</span></b>
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-10 flex items-baseline space-x-4">
                                            {navigation.map((item) => (
                                                <NavLink
                                                    key={item.name}
                                                    to={item.to}
                                                    className={({ isActive }) =>
                                                        classNames(
                                                            isActive
                                                                ? 'bg-gray-900 text-white'
                                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                            'rounded-md px-3 py-2 text-sm font-medium'
                                                        )
                                                    }
                                                >
                                                    {item.name}
                                                </NavLink>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:flex items-center ml-4 space-x-4">
                                    {/* Profile info on large screen */}
                                    <div className="flex items-center space-x-4">
                                        <span className="text-white">{authUser?.firstName || 'Guest'}</span>
                                        <span className="text-gray-400">{authUser?.email || ''}</span>
                                    </div>
                                    {/* Profile dropdown */}
                                    <Menu as="div" className="relative ml-3">
                                        <div>
                                            <MenuButton className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                <span className="sr-only">Open user menu</span>
                                                <img
                                                    alt="Profile"
                                                    src={authUser?.profilePic || '/avatar.png'} // Ensure authUser.ProfilePic is loaded
                                                    className="h-8 w-8 rounded-full"
                                                />
                                            </MenuButton>
                                        </div>
                                        <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                                            {userNavigation.map((item) =>
                                                item.name === 'Sign out' ? (
                                                    <MenuItem key={item.name}>
                                                        <button
                                                            onClick={handleLogout}
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            {item.name}
                                                        </button>
                                                    </MenuItem>
                                                ) : (
                                                    <MenuItem key={item.name}>
                                                        <Link
                                                            to={item.to}
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    </MenuItem>
                                                )
                                            )}
                                        </MenuItems>
                                    </Menu>
                                </div>
                                <div className="-mr-2 flex md:hidden">
                                    <DisclosureButton className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </DisclosureButton>
                                </div>
                            </div>
                        </div>

                        <DisclosurePanel className="md:hidden">
                            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                                {navigation.map((item) => (
                                    <DisclosureButton
                                        key={item.name}
                                        as="a"
                                        href={item.to}
                                        className={classNames(
                                            'block rounded-md px-3 py-2 text-base font-medium',
                                            item.current
                                                ? 'bg-gray-900 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        )}
                                    >
                                        {item.name}
                                    </DisclosureButton>
                                ))}
                            </div>
                            <div className="border-t border-gray-700 pb-3 pt-4">
                                <div className="flex items-center px-5">
                                    <div className="shrink-0">
                                        <img
                                            alt="Profile"
                                            src={authUser?.profilePic || '/avatar.png'} // Use fallback image if ProfilePic is not available
                                            className="h-10 w-10 rounded-full"
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-white">{authUser?.firstName || 'Guest'}</div>
                                        <div className="text-sm font-medium text-gray-400">{authUser?.email || ''}</div>
                                    </div>
                                </div>
                                <div className="mt-3 space-y-1 px-2">
                                    {userNavigation.map((item) =>
                                        item.name === 'Sign out' ? (
                                            <DisclosureButton
                                                key={item.name}
                                                as="button"
                                                onClick={handleLogout}
                                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                            >
                                                {item.name}
                                            </DisclosureButton>
                                        ) : (
                                            <DisclosureButton
                                                key={item.name}
                                                as={Link}
                                                to={item.to}
                                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                            >
                                                {item.name}
                                            </DisclosureButton>
                                        )
                                    )}
                                </div>
                            </div>
                        </DisclosurePanel>
                    </>
                )}
            </Disclosure>

            <div className="mt-16"> {/* Adjust margin-top based on the navbar height */}

            </div>
        </div>

    );
}
