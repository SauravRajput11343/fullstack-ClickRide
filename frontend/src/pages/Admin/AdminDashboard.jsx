import React, { useEffect } from 'react';
import AdminNav from '../../component/AdminNav/AdminNav';
import { AdminSideBar } from '../../component/AdminSideBar/AdminSideBar';
import { useAuthStore } from '../../store/useAuthStore';



export default function AdminDashboard() {
    const {
        totalCustomers,
        totalPartners,
        totalVehicles, // Assuming you're fetching totalVehicles as well
        customerDetails,
        partnerDetails,
        fetchUserData,
    } = useAuthStore();

    const isDrawerOpen = true;

    useEffect(() => {
        // Fetch data when component mounts
        fetchUserData();
    }, [fetchUserData]);

    return (
        <div>
            <AdminNav />
            <AdminSideBar />
            <div
                className={`transition-all duration-300 ${isDrawerOpen ? "lg:pl-[16rem]" : ""} mt-16`}
            >

            </div>
        </div>
    );
}
