import React, { useEffect } from 'react';
import AdminNav from '../../component/AdminNav/AdminNav';
import { AdminSideBar } from '../../component/AdminSideBar/AdminSideBar';
import { useAuthStore } from '../../store/useAuthStore';
import { usePartnerStore } from '../../store/usePartnerStore';

import { useNavigate } from 'react-router-dom';


export default function PartnerRequest() {

    const navigate = useNavigate();
    const {
        totalPartners,
        partnerDetails,
        fetchUserData,
    } = useAuthStore();

    const {
        fetchPartnerData,
        totalPartnerRequest,
        partnerRequestDetails,
    } = usePartnerStore();

    const isDrawerOpen = true;

    useEffect(() => {
        fetchUserData();
        fetchPartnerData();

    }, [fetchUserData, fetchPartnerData]);


    const handlePartnerRequest = (partnerId) => {

        navigate(`/ManagePartner/${partnerId}`);
    };

    return (
        <div>
            <AdminNav />
            <AdminSideBar />
            <div
                className={`transition-all duration-300 ${isDrawerOpen ? "lg:pl-[16rem]" : ""}`}
            >

                <div className="grid lg:grid-rows-[auto auto auto] gap-5 px-5 pt-5 md:px-10 lg:px-14">
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5">
                        {/* Partner Request Count */}
                        <div className="bg-white h-[60px] flex items-center justify-center rounded-xl shadow-md lg:col-span-2 md:col-span-1 sm:col-span-1 px-4 text-center">
                            <h1 className="text-blue-gray text-lg font-semibold">
                                Partner Requests: <span className="font-bold">{totalPartnerRequest || 0}</span>
                            </h1>
                        </div>

                        {/* Current Partner Count */}
                        <div className="bg-white h-[60px] flex items-center justify-center rounded-xl shadow-md lg:col-span-1 md:col-span-1 sm:col-span-1 px-4 text-center">
                            <h1 className="text-blue-gray text-lg font-semibold">
                                Current Partners: <span className="font-bold">{totalPartners || 0}</span>
                            </h1>
                        </div>
                    </div>


                    {/* Row 2: Display Customer and Partner Details */}
                    <div className="grid lg:grid-cols-12 md:grid-cols-12 gap-5 scrollbar-hide">
                        {/* Customer List */}
                        <div className="bg-white h-[600px] lg:col-span-8 md:col-span-4 rounded-xl shadow-2xl overflow-y-scroll scrollbar-hide">
                            <div className="sticky top-0 z-10 bg-white p-3 ">
                                <h3 className="text-xl font-semibold">Partner Request</h3>
                            </div>
                            {partnerRequestDetails && partnerRequestDetails.length > 0 ? (
                                partnerRequestDetails.map((partner) => (
                                    <div
                                        key={partner._id}
                                        className="relative flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm p-3"
                                    >
                                        <button
                                            onClick={() => handlePartnerRequest(partner._id)}
                                            className="text-slate-800 flex items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 w-full text-left"
                                        >
                                            <div className="mr-4 grid place-items-center">
                                                <img
                                                    alt={partner.firstName}
                                                    src={partner.profilePic || "/avatar.png"}
                                                    className="relative inline-block h-12 w-12 rounded-full object-cover object-center"
                                                />
                                            </div>
                                            <div>
                                                <h6 className="text-slate-800 font-medium">{partner.firstName} {partner.lastName}</h6>
                                                <p className="text-slate-500 text-sm">{partner.email || "No Email"}</p>
                                            </div>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="p-3 text-center">No Partner Request found.</p>
                            )}
                        </div>

                        {/* Partner List */}
                        <div className="bg-white h-[600px] lg:col-span-4 md:col-span-4 rounded-xl shadow-2xl overflow-y-scroll scrollbar-hide">
                            <div className="sticky top-0 z-10 bg-white p-3 ">
                                <h3 className="text-xl font-semibold">Current Partners</h3>
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

                    </div>
                </div>
            </div>
        </div>
    );
}
