import React, { useState, useEffect } from 'react';
import AdminNav from '../../component/AdminNav/AdminNav';
import { PartnerSideBar } from '../../component/PartnerSideBar/PartnerSideBar';
import { useAuthStore } from '../../store/useAuthStore';
import Password from '../../component/Password/Password';
import { Loader } from 'lucide-react';

export default function PartnerDashboard() {
    const isDrawerOpen = true;

    const { authUser } = useAuthStore();

    const [profileData, setProfileData] = useState({
        mustChangePassword: authUser?.mustChangePassword,
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        if (authUser) {
            setProfileData({
                mustChangePassword: authUser?.mustChangePassword || false,
            });
            setIsLoading(false);
        }
    }, [authUser]);

    useEffect(() => {
    }, [profileData]);

    if (isLoading) {

        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div>

            <div>
                {profileData.mustChangePassword ? (
                    <Password />  // Always render Password first if mustChangePassword is true
                ) : (
                    <div >
                        <AdminNav />
                        <PartnerSideBar />
                        <div className={`transition-all duration-300 ${isDrawerOpen ? "lg:pl-[16rem]" : ""}`}>
                            <h1>Welcome to your dashboard</h1>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
