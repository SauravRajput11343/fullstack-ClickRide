import React, { useEffect, useState } from 'react';
import VehicleImageSlider from './vehicleImageSlider';
import VehicleDocumentModal from './VehicleDocumentModal';
import { useVehicleStore } from '../../store/useVehicleStore';
import { useRequestStore } from '../../store/useRequestStore'
import { useParams, useLocation, useNavigate, useNavigation } from 'react-router-dom';
import { MapPin, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VerifyVehicle() {
    const { vehicleId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { fetchOneVehicleData } = useVehicleStore();
    const { verifiedVehicle, cancelledVehicle, isVerified, isCancel } = useRequestStore();
    const requestId = location.state?.requestId || null;
    const [vehicleData, setVehicleData] = React.useState({
        selectedImgs: Array(4).fill("/avatar.png"),
        vehicleType: "",
        vehicleMake: "",
        vehicleModel: "",
        vehicleSeat: "",
        vehicleTransmission: "",
        vehicleFuelType: "",
        vehicleRegNumber: "",
        manufacturingYear: "",
        pricePerDay: "",
        pricePerHour: "",
        availabilityStatus: "",
        email: "",
        roleName: "",
        vehicleAddress: "",
        latitude: "",
        longitude: "",
        country: "",
        state: "",
        city: "",
        pincode: "",
        documentUrl: "",
    });

    useEffect(() => {
        if (!vehicleId) return;

        fetchOneVehicleData(vehicleId).then((data) => {
            const details = {
                selectedImgs: [
                    data.vehicleImagesId?.VehicleFrontPic || "/avatar.png",
                    data.vehicleImagesId?.VehicleBackPic || "/avatar.png",
                    data.vehicleImagesId?.VehicleSide1Pic || "/avatar.png",
                    data.vehicleImagesId?.VehicleSide2Pic || "/avatar.png",
                ],
                vehicleType: data.modelID?.vehicleType || "",
                vehicleMake: data.modelID?.vehicleMake || "",
                vehicleModel: data.modelID?.vehicleModel || "",
                vehicleSeat: data.vehicleSeat || "",
                vehicleTransmission: data.vehicleTransmission || "",
                vehicleFuelType: data.vehicleFuelType || "",
                vehicleRegNumber: data.vehicleRegNumber || "",
                manufacturingYear: data.manufacturingYear || "",
                pricePerDay: Number(data.pricePerDay?.$numberDecimal) || "",
                pricePerHour: Number(data.pricePerHour?.$numberDecimal) || "",
                availabilityStatus: data.availabilityStatus || "",
                email: data.owner?.email || "",
                roleName: data.owner?.roleId?.roleName || "",
                vehicleAddress: data.vehicleLocationId?.vehicleAddress || "",
                latitude: data.vehicleLocationId?.latitude || "",
                longitude: data.vehicleLocationId?.longitude || "",
                country: data.vehicleLocationId?.country || "",
                state: data.vehicleLocationId?.state || "",
                city: data.vehicleLocationId?.city || "",
                pincode: data.vehicleLocationId?.pincode || "",
                documentUrl: data.vehicleDocumentUrl || "https://res.cloudinary.com/dodnwbpqj/raw/upload/v1742036486/vehicle_documents/l2ktxjwkndwk0mvbzpqb",
            };
            setVehicleData(details);
        }).catch((error) => {
            console.error("Error fetching vehicle data:", error);
        });
    }, [vehicleId, fetchOneVehicleData]);

    const handleVerify = async () => {
        if (!requestId) {
            toast.error("Request ID is missing!");
            return;
        }
        try {
            const data = {
                requestId: requestId
            }
            const response = await verifiedVehicle(data); // Assuming this is an API call

            if (response && response.status === 200) { // Ensure the response is successful
                toast.success("Vehicle verified successfully!");
                navigate("/PartnerVehicleUpdateRequest"); // Replace with your desired route
            }

        } catch (error) {
            toast.error("Failed to verify the vehicle.");
            console.error(error);
        }
    };

    const handleCancel = async () => {
        if (!requestId) {
            toast.error("Request ID is missing!");
            return;
        }
        try {
            const data = {
                requestId: requestId
            }
            const response = await cancelledVehicle(data);
            if (response && response.status === 200) { // Ensure the response is successful
                toast.success("Vehicle verified successfully!");
                navigate("/PartnerVehicleUpdateRequest"); // Replace with your desired route
            }
        } catch (error) {
            toast.error("Failed to cancel the request.");
            console.error(error);
        }
    };

    return (
        <div className="overflow-x-hidden">
            <div className="grid lg:grid-cols-5 gap-6 px-4 md:px-6 pt-4 pb-1">
                {/* Left Column - Images and Basic Info */}
                <div className="bg-white shadow-md rounded-lg p-4 md:p-6 lg:col-span-2 h-auto">
                    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
                        <VehicleImageSlider selectedImgs={vehicleData.selectedImgs} />
                    </div>

                    <div className="space-y-4 md:space-y-6 mt-6">
                        <DetailItem label="Vehicle Type" value={vehicleData.vehicleType} />
                        <DetailItem label="Vehicle Make" value={vehicleData.vehicleMake} />
                        <DetailItem label="Vehicle Model" value={vehicleData.vehicleModel} />
                        <DetailItem label="Number of Seats" value={`${vehicleData.vehicleSeat}-seater`} />


                    </div>
                </div>

                {/* Right Column - Detailed Info */}
                <div className='bg-white shadow-md rounded-lg p-4 md:p-6 lg:col-span-3 h-auto'>
                    <div className='space-y-4 md:space-y-6'>

                        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                            <DetailItem label="Transmission Type" value={vehicleData.vehicleTransmission} />
                            <DetailItem label="Fuel Type" value={vehicleData.vehicleFuelType} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                            <DetailItem label="Registration Number" value={vehicleData.vehicleRegNumber} />
                            <DetailItem label="Manufacturing Year" value={vehicleData.manufacturingYear} />
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            <DetailItem label="Price Per Day" value={`₹${vehicleData.pricePerDay}`} />
                            <DetailItem label="Price Per Hour" value={`₹${vehicleData.pricePerHour}`} />
                            <DetailItem label="Availability" value={vehicleData.availabilityStatus} />
                        </div>

                        {/* Document Button */}
                        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                            <div>
                                <Label> Vehicle Document</Label>
                                <div className='flex items-center gap-2'>
                                    <VehicleDocumentModal documentUrl={vehicleData.documentUrl} />
                                </div>

                            </div>
                            <DetailItem label="Vehicle Address" value={vehicleData.vehicleAddress} />
                        </div>


                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            <DetailItem label="City" value={vehicleData.city} icon={<MapPin />} />
                            <DetailItem label="State" value={vehicleData.state} icon={<MapPin />} />
                            <DetailItem label="Country" value={vehicleData.country} icon={<MapPin />} />
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            <DetailItem label="Pincode" value={vehicleData.pincode} />
                            <DetailItem label="Latitude" value={vehicleData.latitude} />
                            <DetailItem label="Longitude" value={vehicleData.longitude} />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                            <DetailItem label="Owner Role" value={vehicleData.roleName} />
                            <DetailItem label="Owner Email" value={vehicleData.email} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                            <button
                                onClick={handleVerify}
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto min-w-[160px]"
                            >
                                <CheckCircle className="w-5 h-5" />
                                Verify Vehicle
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto min-w-[160px]"
                            >
                                <XCircle className="w-5 h-5" />
                                Cancel Request
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper components for consistent styling
const DetailItem = ({ label, value, icon }) => (
    <div className="space-y-1.5">
        <Label>{label}</Label>
        <div className="flex items-center gap-2">
            {icon && React.cloneElement(icon, { className: "w-4 h-4" })}
            <Value>{value}</Value>
        </div>
    </div>
);

const Label = ({ children }) => (
    <div className="text-sm text-gray-600 font-medium">{children}</div>
);

const Value = ({ children }) => (
    <div className="px-3 py-2 md:px-4 md:py-2.5 bg-gray-50 rounded-lg text-gray-800 w-full border border-gray-200 truncate">
        {children}
    </div>
);