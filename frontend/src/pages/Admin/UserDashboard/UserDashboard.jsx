import React, { useEffect } from 'react';
import AdminNav from '../../../component/AdminNav/AdminNav';
import { AdminSideBar } from '../../../component/AdminSideBar/AdminSideBar';
import { useAuthStore } from '../../../store/useAuthStore';
import { useVehicleStore } from '../../../store/useVehicleStore';
import { Typography } from '@material-tailwind/react';

export default function UserDashboard() {
    const {
        totalCustomers,
        totalPartners,
        customerDetails,
        partnerDetails,
        fetchUserData,
    } = useAuthStore();

    const {
        totalVehicles, // Get the total number of vehicles
        vehicleDetails, // Get the vehicle details
        fetchVehicleData,
    } = useVehicleStore();

    const isDrawerOpen = true;

    useEffect(() => {
        // Fetch user data when component mounts
        fetchUserData();

        // Fetch vehicle data when component mounts
        fetchVehicleData();
    }, [fetchUserData, fetchVehicleData]);

    return (
        <div>
            <AdminNav />
            <AdminSideBar />
            <div
                className={`transition-all duration-300 ${isDrawerOpen ? "lg:pl-[16rem]" : ""}`}
            >
                <Typography variant="h2" className='ps-4 mt-6 text-center md:text-left'>
                    User and Vehicle Details
                </Typography>
                <div className="grid lg:grid-rows-[auto auto auto] gap-5 px-5 pt-5 md:px-10 lg:px-14">
                    {/* Row 1: Total Users, Total Partners, and Total Vehicles */}
                    <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-5">
                        <div className="bg-white h-[50px] flex items-center justify-center rounded-xl shadow-2xl">
                            <h1 className="text-blue-gray text-center">
                                Total Customers: <span className="font-bold">{totalCustomers || 0}</span>
                            </h1>
                        </div>
                        <div className="bg-white h-[50px] flex items-center justify-center rounded-xl shadow-2xl">
                            <h1 className="text-blue-gray text-center">
                                Total Partners: <span className="font-bold">{totalPartners || 0}</span>
                            </h1>
                        </div>
                        <div className="bg-white h-[50px] flex items-center justify-center rounded-xl shadow-2xl">
                            <h1 className="text-blue-gray text-center">
                                Total Vehicle: <span className="font-bold">{totalVehicles || 0}</span>
                            </h1>
                        </div>
                    </div>

                    {/* Row 2: Display Customer and Partner Details */}
                    <div className="grid lg:grid-cols-12 md:grid-cols-12 gap-5 scrollbar-hide">
                        {/* Customer List */}
                        <div className="bg-white h-[480px] lg:col-span-4 md:col-span-4 rounded-xl shadow-2xl overflow-y-scroll scrollbar-hide">
                            <div className="sticky top-0 z-10 bg-white p-3 ">
                                <h3 className="text-xl font-semibold">Customers</h3>
                            </div>
                            {customerDetails && customerDetails.length > 0 ? (
                                customerDetails.map((customer, index) => (
                                    <div key={index} className="relative flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm ">
                                        <nav className="flex flex-col gap-1 p-1.5">
                                            <div
                                                role="button"
                                                className="text-slate-800 flex items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                                            >
                                                <div className="mr-4 grid place-items-center">
                                                    <img
                                                        alt={customer.firstName}
                                                        src={customer.profilePic || "/avatar.png"} // Placeholder image if no profile picture
                                                        className="relative inline-block h-12 w-12 !rounded-full object-cover object-center"
                                                    />
                                                </div>
                                                <div>
                                                    <h6 className="text-slate-800 font-medium">{customer.firstName} {customer.lastName}</h6>
                                                    <p className="text-slate-500 text-sm">{customer.email || "No Email"}</p>
                                                </div>
                                            </div>
                                        </nav>
                                    </div>
                                ))
                            ) : (
                                <p>No customers found.</p>
                            )}
                        </div>

                        {/* Partner List */}
                        <div className="bg-white h-[480px] lg:col-span-4 md:col-span-4 rounded-xl shadow-2xl overflow-y-scroll scrollbar-hide">
                            <div className="sticky top-0 z-10 bg-white p-3 ">
                                <h3 className="text-xl font-semibold">Partners</h3>
                            </div>
                            {partnerDetails && partnerDetails.length > 0 ? (
                                partnerDetails.map((partner, index) => (
                                    <div key={index} className="relative flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm ">
                                        <nav className="flex flex-col gap-1 p-1.5">
                                            <div
                                                role="button"
                                                className="text-slate-800 flex items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                                            >
                                                <div className="mr-4 grid place-items-center">
                                                    <img
                                                        alt={partner.firstName}
                                                        src={partner.profilePic || "/avatar.png"} // Placeholder image if no profile picture
                                                        className="relative inline-block h-12 w-12 !rounded-full object-cover object-center"
                                                    />
                                                </div>
                                                <div>
                                                    <h6 className="text-slate-800 font-medium">{partner.firstName} {partner.lastName}</h6>
                                                    <p className="text-slate-500 text-sm">{partner.email || "No Email"}</p>
                                                </div>
                                            </div>
                                        </nav>
                                    </div>
                                ))
                            ) : (
                                <p>No Partner found.</p>
                            )}
                        </div>

                        <div className="bg-white h-[480px] lg:col-span-4 md:col-span-4 rounded-xl shadow-2xl overflow-y-scroll scrollbar-hide">
                            <div className="sticky top-0 z-10 bg-white p-3 ">
                                <h3 className="text-xl font-semibold">10 Recently Added Vehicles</h3>
                            </div>
                            {vehicleDetails && vehicleDetails.length > 0 ? (
                                // Sort vehicles by createdAt in descending order and slice the first 5
                                vehicleDetails
                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt (most recent first)
                                    .slice(0, 10)
                                    .map((vehicle, index) => (
                                        <div key={index} className="relative flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm ">
                                            <nav className="flex flex-col gap-1 p-1.5">
                                                <div
                                                    role="button"
                                                    className="text-slate-800 flex items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                                                >
                                                    <div className="mr-4 grid place-items-center">
                                                        <img
                                                            alt={vehicle.vehicleMake}
                                                            src={vehicle.vehiclePic || "/avatar.png"} // Placeholder image if no vehicle picture
                                                            className="relative inline-block h-12 w-12 !rounded-full object-cover object-center"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h6 className="text-slate-800 font-medium">{vehicle.modelID.vehicleMake} {vehicle.modelID.vehicleModel}</h6>
                                                        <p className="text-slate-500 text-sm">{vehicle.vehicleRegNumber}</p>
                                                    </div>
                                                </div>
                                            </nav>
                                        </div>
                                    ))
                            ) : (
                                <p>No vehicles found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
