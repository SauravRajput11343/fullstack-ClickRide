import React, { useEffect, useState } from 'react';
import AdminNav from '../../component/AdminNav/AdminNav';
import { AdminSideBar } from '../../component/AdminSideBar/AdminSideBar';
import { Loader } from 'lucide-react';
import { useVehicleStore } from '../../store/useVehicleStore';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/useAuthStore';
export default function ManageVehicle() {
    const isDrawerOpen = true;
    const { authUser, UserRole } = useAuthStore();
    const { isUpdatingVehicle, fetchOneVehicleData, UpdateOneVehicleData, DeleteOneVehicleData, isDeletingVehicle } = useVehicleStore();
    const { vehicleId } = useParams();

    const navigate = useNavigate();

    // State to hold vehicle data
    const [vehicleData, setVehicleData] = useState({
        vehicleID: '',
        vehicleType: '',
        vehicleMake: '',
        vehicleModel: '',
        seats: '',
        transmission: '',
        fuelType: '',
        regNumber: '',
        manufacturingYear: '',
        pricePerDay: '',
        pricePerHour: '',
        vehiclePic: '',
        availabilityStatus: '',
        email: '',
        roleName: '',
    });
    const [profileData, setProfileData] = useState({
        email: authUser?.email || "",
    });

    useEffect(() => {
        if (authUser) {
            setProfileData((prev) => ({
                ...prev,

                email: authUser.email || "",
            }));
        }
    }, [authUser]);



    useEffect(() => {
        if (!vehicleId) return;

        // Fetch vehicle data and populate state
        const fetchData = async () => {
            try {
                const data = await fetchOneVehicleData(vehicleId);
                setVehicleData({
                    vehicleID: vehicleId,
                    vehicleType: data.modelID.vehicleType || '',
                    vehicleMake: data.modelID.vehicleMake || '',
                    vehicleModel: data.modelID.vehicleModel || '',
                    seats: data.vehicleSeat || '',
                    transmission: data.vehicleTransmission || '',
                    fuelType: data.vehicleFuelType || '',
                    vehiclePic: data.vehiclePic,
                    regNumber: data.vehicleRegNumber || '',
                    manufacturingYear: data.manufacturingYear || '',
                    pricePerDay: Number(data.pricePerDay.$numberDecimal) || '',
                    pricePerHour: Number(data.pricePerHour.$numberDecimal) || '',
                    availabilityStatus: data.availabilityStatus || '',
                    email: data.owner?.email || '',
                    roleName: data.owner?.roleId?.roleName || ''
                });

            } catch (error) {
                console.error('Error fetching vehicle data:', error);
            }
        };

        fetchData();
    }, [vehicleId, fetchOneVehicleData]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setVehicleData({
            ...vehicleData,
            [name]: value,
        });
    };
    const handleToggleAvailability = () => {
        const newStatus = vehicleData.availabilityStatus === "Available" ? "Unavailable" : "Available";
        setVehicleData({
            ...vehicleData,
            availabilityStatus: newStatus,
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // Check for file size (5MB max)
                toast.error("File size is too large. Max 5MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setVehicleData({
                    ...vehicleData,
                    vehiclePic: reader.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = async (e) => {
        try {
            const delteVehicleId = await DeleteOneVehicleData({
                vehicleID: vehicleData.vehicleID,

            })
            console.log('Vehicle data Deleted successfully:', delteVehicleId);
            if (delteVehicleId && delteVehicleId.success) {

                if (UserRole === "Admin") {
                    navigate('/VehicleDashboard');
                }
                if (UserRole === "Partner") {
                    navigate('/PartnerVehicleDashboard');
                }
            } else {
                toast.error(delteVehicleId?.message || "Failed to delete vehicle.");
            }


        } catch (error) {
            console.error("Error Deleting vehicle data:", error);
        }

    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const updatedVehicleData = await UpdateOneVehicleData({
                vehicleID: vehicleData.vehicleID,
                vehicleSeat: vehicleData.seats,
                vehicleTransmission: vehicleData.transmission,
                vehicleFuelType: vehicleData.fuelType,
                vehiclePic: vehicleData.vehiclePic,
                vehicleRegNumber: vehicleData.regNumber,
                manufacturingYear: vehicleData.manufacturingYear,
                pricePerDay: vehicleData.pricePerDay,
                pricePerHour: vehicleData.pricePerHour,
                availabilityStatus: vehicleData.availabilityStatus,
            });


            console.log('Vehicle data updated successfully:', updatedVehicleData);


        } catch (error) {
            console.error("Error updating vehicle data:", error);
        }
    };


    return (
        <div className="overflow-x-hidden">

            <form onSubmit={handleSubmit}>
                <div className='grid lg:grid-cols-5 md:grid-cols-2 gap-6 px-6 pt-4 pb-1'>
                    <div className='bg-white shadow-md rounded-lg p-6 grid grid-rows-4 gap-6 lg:col-span-2 md:grid-cols-1'>
                        <input type="hidden" value={vehicleId} />
                        <div className='relative grid row-span-2'>
                            <img
                                src={vehicleData.vehiclePic || '/avatar.png'}
                                alt='Vehicle'
                                className='w-full h-64 object-cover border-4 border-black shadow-lg rounded-lg transition-all duration-500 ease-in-out'
                            />
                            <label
                                htmlFor='vehicle-image-upload'
                                className='absolute bottom-0 right-0 bg-black hover:bg-blue-500 p-2 rounded-full cursor-pointer transition-all duration-200'
                            >
                                <Camera className='w-6 h-6 text-white' />
                                <input
                                    type='file'
                                    id='vehicle-image-upload'
                                    className='hidden'
                                    accept='image/*'
                                    onChange={handleImageChange}
                                    disabled={profileData.email !== vehicleData.email}
                                />
                            </label>
                            <p className='text-sm text-black text-center mt-2'>Upload vehicle image</p>
                        </div>
                        <div className='space-y-6 row-span-2'>
                            <div className="space-y-1.5">
                                <div className="text-sm text-black flex items-center gap-2">
                                    Vehicle Type
                                </div>
                                <input
                                    type="text"
                                    name="vehicleType"
                                    placeholder="Enter Vehicle Type"
                                    value={vehicleData.vehicleType}
                                    readOnly
                                    disabled
                                    className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <div className="text-sm text-black flex items-center gap-2">
                                    Vehicle Make
                                </div>
                                <input
                                    type="text"
                                    name="vehicleMake"
                                    placeholder="Enter Vehicle Make"
                                    value={vehicleData.vehicleMake}
                                    readOnly
                                    disabled
                                    className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <div className="text-sm text-black flex items-center gap-2">
                                    Vehicle Model
                                </div>
                                <input
                                    type="text"
                                    name="vehicleModel"
                                    placeholder="Enter Vehicle Model"
                                    value={vehicleData.vehicleModel}
                                    readOnly
                                    disabled
                                    className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className='bg-white lg:col-span-3 md:col-span-1 rounded-xl shadow-md p-6'>
                        <div className='space-y-6'>
                            <div className="space-y-1.5">
                                <div className="text-sm text-black flex items-center gap-2">
                                    Number of Seats
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {['2', '4', '5', '6', '8'].map(seat => (
                                        <label key={seat} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="seats"
                                                value={seat}
                                                checked={vehicleData.seats === seat}
                                                className="text-black"
                                                onChange={handleChange}
                                                disabled={profileData.email !== vehicleData.email}
                                            />
                                            <span className='text-sm'>{seat}-seater</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="text-sm text-black flex items-center gap-2">
                                    Transmission Type
                                </div>
                                <div className="flex items-center gap-6">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="transmission"
                                            value="manual"
                                            checked={vehicleData.transmission === "manual"}
                                            onChange={handleChange}
                                            disabled={profileData.email !== vehicleData.email}
                                            className="text-black"
                                        />
                                        <span className="text-sm">Manual</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="transmission"
                                            value="automatic"
                                            checked={vehicleData.transmission === "automatic"}
                                            onChange={handleChange}
                                            disabled={profileData.email !== vehicleData.email}
                                            className="text-black"
                                        />
                                        <span className="text-sm">Automatic</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="text-sm text-black flex items-center gap-2">
                                    Fuel Type
                                </div>
                                <div className="flex items-center gap-6">
                                    {['petrol', 'diesel', 'electric'].map(fuel => (
                                        <label key={fuel} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="fuelType"
                                                value={fuel}
                                                checked={vehicleData.fuelType === fuel}
                                                onChange={handleChange}
                                                disabled={profileData.email !== vehicleData.email}
                                                className="text-black"
                                            />
                                            <span className="text-sm">{fuel.charAt(0).toUpperCase() + fuel.slice(1)}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>



                            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-6">
                                <div className="space-y-1.5">
                                    <div className="text-sm text-black flex items-center gap-2">
                                        Vehicle Reg Number
                                    </div>
                                    <input
                                        type="text"
                                        name="regNumber"
                                        placeholder="Enter Vehicle Reg Number"
                                        value={vehicleData.regNumber}
                                        onChange={handleChange}
                                        disabled={profileData.email !== vehicleData.email}
                                        className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="text-sm text-black flex items-center gap-2">
                                        Manufacturing Year
                                    </div>
                                    <input
                                        type="number"
                                        name="manufacturingYear"
                                        placeholder="Enter Manufacturing Year"
                                        value={vehicleData.manufacturingYear}
                                        onChange={handleChange}
                                        disabled={profileData.email !== vehicleData.email}
                                        className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full"
                                    />
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-6">
                                <div className="space-y-1.5">
                                    <div className="text-sm text-black flex items-center gap-2">
                                        Price Per Day
                                    </div>
                                    <input
                                        type="number"
                                        name="pricePerDay"
                                        placeholder="Enter Price Per Day"
                                        value={vehicleData.pricePerDay}
                                        onChange={handleChange}
                                        disabled={profileData.email !== vehicleData.email}
                                        className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="text-sm text-black flex items-center gap-2">
                                        Price Per Hour
                                    </div>
                                    <input
                                        type="number"
                                        name="pricePerHour"
                                        placeholder="Enter Price Per Hour"
                                        value={vehicleData.pricePerHour}
                                        onChange={handleChange}
                                        disabled={profileData.email !== vehicleData.email}
                                        className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <div>
                                        <label>Availability</label>
                                        <div
                                            className={`w-14 h-7 flex items-center ${vehicleData.availabilityStatus === "Available" ? "bg-green-500" : "bg-gray-400"
                                                } 
                rounded-full p-1 cursor-pointer transition-all duration-300 
                ${profileData.email !== vehicleData.email ? "opacity-50 cursor-not-allowed" : ""}`}
                                            onClick={profileData.email === vehicleData.email ? handleToggleAvailability : undefined}
                                        >
                                            <div
                                                className={`bg-white w-5 h-5 rounded-full shadow-md transform ${vehicleData.availabilityStatus === "Available" ? "translate-x-7" : "translate-x-0"
                                                    } transition-all duration-300`}
                                            ></div>
                                        </div>
                                        <p>Status: <strong>{vehicleData.availabilityStatus}</strong></p>
                                    </div>
                                </div>
                            </div>



                            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-6">

                                <div className="space-y-1.5">
                                    <div className="text-sm text-black flex items-center gap-2">
                                        Owner Role
                                    </div>
                                    <input
                                        type="input"
                                        name="roleName"
                                        value={vehicleData.roleName}
                                        disabled
                                        className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="text-sm text-black flex items-center gap-2">
                                        Vehicle Owner
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={vehicleData.email}
                                        disabled
                                        className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full"
                                    />
                                </div>
                            </div>



                            <div className="grid grid-cols-2 gap-4">
                                {/* Update Button */}
                                <div>
                                    {profileData.email === vehicleData.email ? (
                                        isUpdatingVehicle ? (
                                            <div className="flex items-center justify-center">
                                                <Loader className="size-10 animate-spin" />
                                            </div>
                                        ) : (
                                            <button
                                                type="submit"
                                                className="w-full px-4 py-2.5 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
                                            >
                                                Update
                                            </button>
                                        )
                                    ) : (
                                        <button
                                            type="button"
                                            className="w-full px-4 py-2.5 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-300"
                                        >
                                            Request Update
                                        </button>
                                    )}
                                </div>

                                {/* Delete Button */}
                                <div>
                                    {isDeletingVehicle ? (
                                        <div className="flex items-center justify-center">
                                            <Loader className="size-10 animate-spin" />
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            className="w-full px-4 py-2.5 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>


        </div>
    );
}
