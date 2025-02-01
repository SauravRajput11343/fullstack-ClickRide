import React, { useState, useEffect } from 'react';
import { AdminSideBar } from '../../component/AdminSideBar/AdminSideBar';
import AdminNav from '../../component/AdminNav/AdminNav';
import { useForm, Controller } from 'react-hook-form';
import { Camera, Bike, Car } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useVehicleStore } from '../../store/useVehicleStore';
import { useAuthStore } from '../../store/useAuthStore';
import { yupResolver } from '@hookform/resolvers/yup';
import { vehicleSchema } from '../../../../backend/src/validators/vehicle.validator';
import { Loader } from 'lucide-react';
import Gallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

import VehicleImageSlider from './vehicleImageSlider';
export default function ReactAddVehicle() {
    const vehicleMakes = {
        sedan: [
            { value: 'toyota', label: 'Toyota' },
            { value: 'ford', label: 'Ford' },
            { value: 'chevrolet', label: 'Chevrolet' },
            { value: 'honda', label: 'Honda' },
            { value: 'bmw', label: 'BMW' },
        ],
        suv: [
            { value: 'toyota', label: 'Toyota' },
            { value: 'ford', label: 'Ford' },
            { value: 'chevrolet', label: 'Chevrolet' },
            { value: 'honda', label: 'Honda' },
            { value: 'bmw', label: 'BMW' },
        ],
        truck: [
            { value: 'ford', label: 'Ford' },
            { value: 'chevrolet', label: 'Chevrolet' },
            { value: 'ram', label: 'RAM' },
        ],
        coupe: [
            { value: 'bmw', label: 'BMW' },
            { value: 'audi', label: 'Audi' },
            { value: 'mercedes', label: 'Mercedes-Benz' },
        ],
        convertible: [
            { value: 'bmw', label: 'BMW' },
            { value: 'audi', label: 'Audi' },
            { value: 'mercedes', label: 'Mercedes-Benz' },
        ],
        hatchback: [
            { value: 'honda', label: 'Honda' },
            { value: 'toyota', label: 'Toyota' },
            { value: 'ford', label: 'Ford' },
        ],
        minivan: [
            { value: 'toyota', label: 'Toyota' },
            { value: 'honda', label: 'Honda' },
            { value: 'kia', label: 'Kia' },
        ],
        electric: [
            { value: 'tesla', label: 'Tesla' },
            { value: 'chevrolet', label: 'Chevrolet' },
        ],
        bike: [
            { value: 'yamaha', label: 'Yamaha' },
            { value: 'suzuki', label: 'Suzuki' },
            { value: 'harley', label: 'Harley-Davidson' },
            { value: 'ducati', label: 'Ducati' },
        ]
    };

    const models = {
        toyota: ['Corolla', 'Camry', 'RAV4', 'Highlander'],
        ford: ['Focus', 'Mustang', 'F-150', 'Explorer'],
        chevrolet: ['Malibu', 'Camaro', 'Silverado', 'Tahoe'],
        honda: ['Civic', 'Accord', 'CR-V', 'Pilot'],
        bmw: ['3 Series', 'X5', 'M4', 'X3'],
        audi: ['A3', 'A4', 'Q5', 'Q7'],
        mercedes: ['C-Class', 'E-Class', 'GLC', 'S-Class'],
        ram: ['1500', '2500', '3500'],
        kia: ['Carnival', 'Sedona'],
        tesla: ['Model S', 'Model 3', 'Model X', 'Model Y'],
        yamaha: ['YZF-R1', 'MT-09', 'FZ-07', 'Tenere 700'],
        suzuki: ['GSX-R1000', 'Hayabusa', 'V-Strom', 'SV650'],
        harley: ['Sportster', 'Softail', 'Touring', 'Road King'],
        ducati: ['Panigale V4', 'Monster', 'Scrambler', 'Multistrada'],
    };
    const { isAddingVehicle, addVehicles, fetchVehicleModelData, vehicleModelDetails } = useVehicleStore();
    const { authUser, UserRole } = useAuthStore();
    const isDrawerOpen = true;

    const navigate = useNavigate(); // Initialize the useNavigate hook
    const [selectedImgs, setSelectedImgs] = useState([null, null, null, null]);
    const [selectedImg, setSelectedImg] = useState([null]);
    const [selectedImgModel, setSelectedImgModel] = useState(null);
    const [modelNotFound, setModelNotFound] = useState(false);
    const [modelChecked, setModelChecked] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileData, setProfileData] = useState({
        userId: authUser?._id || '',
    });

    const { control, setValue, getValues, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(vehicleSchema),
        defaultValues: {
            vehicleType: '',
            vehicleMake: '',
            vehicleModel: '',
            vehicleRegNumber: '',
            manufacturingYear: '',
            vehicleTransmission: '',
            vehicleFuelType: '',
            vehicleSeat: '',
            vehiclePics: selectedImgs,
            modelPic: '',
            pricePerDay: 0,
            pricePerHour: 0,
            owner: '',
            vehiclePic: 0,
        }
    });

    const vehicleType = watch("vehicleType");
    const vehicleMake = watch("vehicleMake");
    const vehicleModel = watch("vehicleModel");
    useEffect(() => {
        fetchVehicleModelData();
    }, [fetchVehicleModelData]);
    useEffect(() => {
        if (vehicleType && vehicleMake && vehicleModel) {
            const modelExists = Array.isArray(vehicleModelDetails) && vehicleModelDetails.length > 0 &&
                vehicleModelDetails.some(
                    (model) =>
                        model.vehicleType === vehicleType &&
                        model.vehicleMake === vehicleMake &&
                        model.vehicleModel === vehicleModel
                );

            setModelChecked(true); // Mark that the model has been checked

            if (modelExists) {
                setModelNotFound(false);
                toast.success("Model exists in the database.");
            } else {
                setModelNotFound(true);
                toast.error("Model not found in the database.");
            }
        }
    }, [vehicleType, vehicleMake, vehicleModel, vehicleModelDetails]);
    useEffect(() => {
        if (authUser) {
            setProfileData({
                userId: authUser?._id || ''
            });
        }
    }, [authUser]);
    const handleImageChange = (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImgs((prevImages) => {
                    const newImages = [...prevImages];
                    newImages[index] = reader.result; // Update only the selected index
                    return newImages;
                });
            };
            reader.readAsDataURL(file);
        }
    };
    const handleImageModelUpload = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error("File size must be less than 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setSelectedImgModel(reader.result); // Set the Base64 string
        };
    };

    useEffect(() => {
        // Check if all images are selected
        if (selectedImgs.length === 4 && selectedImgs.every(img => img !== null && img !== "")) {
            // When all 4 images are selected, set vehiclePic value to 1
            setValue("vehiclePic", 1);
        } else {
            // If not all images are selected, reset vehiclePic value to null or whatever default state
            setValue("vehiclePic", 0);
        }
    }, [selectedImgs, setValue]);

    const onSubmit = async (data) => {
        // Add the Base64 image data to the form
        console.log("Form data:", data);
        data.vehiclePics = selectedImgs;
        data.modelPic = selectedImgModel;
        data.owner = profileData.userId;
        try {
            const response = await addVehicles(data);
            if (response && response.success) {

                toast.success("Vehicle successfully added!");

                if (UserRole === "Admin") {
                    navigate('/VehicleDashboard');
                }
                if (UserRole === "Partner") {
                    navigate('/PartnerVehicleDashboard');
                }
            } else {
                // Show error if something goes wrong
                toast.error(response?.message || "Failed to add vehicle.");
            }
        } catch (error) {
            toast.error("An error occurred during submission.");
        }
    };
    return (
        <div>
            <AdminNav />
            <AdminSideBar />
            <div className={`transition-all duration-300 ${isDrawerOpen ? "lg:pl-[16rem]" : ""} mt-16 `}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-6 px-6 pt-4 pb-1 ">
                        <div className='bg-white shadow-md rounded-lg p-6 grid gap-6 lg:col-span-2 md:grid-cols-1 min-h-[680px] h-full'>
                            {/* Vehicle Picture Upload */}
                            <div className="relative grid">
                                <Controller
                                    name="vehiclePic"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <div className="relative w-full max-w-full overflow-hidden">
                                                {/* Image Gallery */}
                                                <div className="w-full h-auto overflow-hidden">
                                                    {
                                                        selectedImgs.every(img => img !== null) && selectedImgs.length === 4 ? (
                                                            // Render the Gallery if all 4 images are selected
                                                            <VehicleImageSlider selectedImgs={selectedImgs} />
                                                        ) : (
                                                            // Render something else, such as a default image or a message
                                                            <img
                                                                src="/avatar.png"
                                                                alt="Default Vehicle"
                                                                className="w-full h-64 object-cover border-4 border-black shadow-lg rounded-lg"
                                                            />
                                                        )
                                                    }

                                                </div>

                                                {/* Upload button */}
                                                <label
                                                    htmlFor="vehicle-Pic-Modal-Open"
                                                    className="absolute bottom-0 right-0 bg-black hover:bg-blue-500 p-2 rounded-full cursor-pointer transition-all duration-200"
                                                >
                                                    <Camera className="w-7 h-7 text-white" />
                                                    <input
                                                        type="button"
                                                        id="vehicle-Pic-Modal-Open"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onClick={() => setIsModalOpen(true)}
                                                    />
                                                </label>
                                                <p className="text-sm text-black text-center mt-2">Upload vehicle image</p>
                                            </div>
                                            {fieldState?.error && (
                                                <p className="text-red-500 text-xs">{fieldState?.error?.message}</p>
                                            )}
                                        </>
                                    )}
                                />
                            </div>



                            <div>
                                {/* Modal */}
                                {isModalOpen && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                        <div className="relative bg-white p-6 rounded-lg w-11/12 sm:w-96 md:w-3/4 lg:w-1/2 xl:w-1/3 max-h-[90vh] overflow-auto scrollbar-hide mx-4 sm:mx-8">
                                            <h2 className="text-xl font-semibold mb-4 text-center">Upload Vehicle Pics</h2>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {['Front View', 'Back View', 'Side View 1', 'Side View 2'].map((view, index) => (
                                                    <div className="relative" key={index}>
                                                        <Controller
                                                            name={`vehiclePics[${index}]`}
                                                            control={control}
                                                            render={({ field, fieldState }) => (
                                                                <>
                                                                    <div className="relative">
                                                                        <img
                                                                            type="file"
                                                                            src={selectedImgs[index] || '/avatar.png'}
                                                                            alt={view}
                                                                            className="w-full h-auto object-cover border-4 border-black shadow-lg rounded-lg transition-all duration-500 ease-in-out max-w-full"
                                                                        />
                                                                        <label
                                                                            htmlFor={`vehicle-Pic-Modal-Open-${index}`}
                                                                            className="absolute bottom-0 right-0 bg-black hover:bg-blue-500 p-2 rounded-full cursor-pointer transition-all duration-200"
                                                                        >
                                                                            <Camera className="w-7 h-7 text-white" />
                                                                            <input
                                                                                type="file"
                                                                                id={`vehicle-Pic-Modal-Open-${index}`}
                                                                                className="hidden"
                                                                                accept="image/*"
                                                                                onChange={(e) => handleImageChange(e, index)}
                                                                            />
                                                                        </label>
                                                                        <p className="text-sm text-black text-center mt-2">{`Upload ${view}`}</p>
                                                                    </div>
                                                                    {fieldState?.error && (
                                                                        <p className="text-red-500 text-xs">{fieldState?.error?.message}</p>
                                                                    )}
                                                                </>
                                                            )}
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                                {/* Cancel Request Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => setIsModalOpen(false)}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 col-span-2"
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>


                            {/* Vehicle model details */}
                            <div className='space-y-6 row-span-2'>
                                {/* Vehicle Type Selection */}
                                <div className="space-y-1.5">
                                    <div className="text-sm text-black flex items-center gap-2">
                                        {vehicleType === 'bike' ? <Bike className="w-4 h-4 text-black" /> : <Car className="w-4 h-4 text-black" />}
                                        Vehicle Type
                                    </div>
                                    <Controller
                                        name="vehicleType"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <select
                                                    {...field}
                                                    className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full"
                                                    onChange={(e) => {
                                                        // Reset vehicleMake and vehicleModel to 'none' when vehicleType changes
                                                        field.onChange(e);
                                                        setValue('vehicleMake', '');
                                                        setValue('vehicleModel', '');
                                                    }}
                                                >
                                                    <option value="">None</option>
                                                    <option value="sedan">Sedan</option>
                                                    <option value="suv">SUV</option>
                                                    <option value="truck">Truck</option>
                                                    <option value="coupe">Coupe</option>
                                                    <option value="convertible">Convertible</option>
                                                    <option value="hatchback">Hatchback</option>
                                                    <option value="minivan">Minivan</option>
                                                    <option value="electric">Electric</option>
                                                    <option value="bike">Bike</option>
                                                </select>
                                                {fieldState?.error && (
                                                    <p className="text-red-500 text-xs">{fieldState?.error?.message}</p>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>
                                {/* Vehicle Make Dropdown */}
                                <div className='space-y-1.5'>
                                    <Controller
                                        name="vehicleMake"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <div className="space-y-1.5">
                                                <div className="text-sm text-black flex items-center gap-2">
                                                    {vehicleType === 'bike' ? <Bike className="w-4 h-4 text-black" /> : <Car className="w-4 h-4 text-black" />}
                                                    Vehicle Make
                                                </div>
                                                <select
                                                    {...field}
                                                    className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full"
                                                    disabled={vehicleType === 'none'}  // Disable if no vehicleType is selected
                                                    onChange={(e) => {
                                                        // Reset vehicleModel to 'none' when vehicleMake changes
                                                        field.onChange(e);
                                                        setValue('vehicleModel', ''); // Reset vehicleModel to 'none'
                                                    }}
                                                >
                                                    <option value="none">None</option>
                                                    {(vehicleMakes[vehicleType] || []).map(make => (
                                                        <option key={make.value} value={make.value}>{make.label}</option>
                                                    ))}
                                                </select>
                                                {fieldState?.error && (
                                                    <p className="text-red-500 text-xs">{fieldState?.error?.message}</p>
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>
                                {/* Vehicle Model Dropdown */}
                                <div className='space-y-1.5'>
                                    <Controller
                                        name="vehicleModel"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <div className="space-y-1.5">
                                                <div className="text-sm text-black flex items-center gap-2">
                                                    {vehicleType === 'bike' ? <Bike className="w-4 h-4 text-black" /> : <Car className="w-4 h-4 text-black" />}
                                                    Vehicle Model
                                                </div>
                                                <select
                                                    {...field}
                                                    className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full"
                                                    disabled={vehicleMake === 'none' || vehicleType === 'none'} // Disable if no vehicleMake or vehicleType is selected
                                                >
                                                    <option value="none">None</option>
                                                    {(models[vehicleMake] || []).map(model => (
                                                        <option key={model} value={model}>{model}</option>
                                                    ))}
                                                </select>
                                                {fieldState?.error && (
                                                    <p className="text-red-500 text-xs">{fieldState?.error?.message}</p>
                                                )}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                            {vehicleType && vehicleMake && vehicleModel && modelChecked && (
                                modelNotFound ? (
                                    <div className="space-y-1.5">
                                        <Controller
                                            name="modelPic"
                                            control={control}
                                            rules={{ required: 'ModelPic is required' }}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <div className="relative">
                                                        <img
                                                            src={selectedImgModel || '/avatar.png'}
                                                            alt="model"
                                                            className="w-full h-64 object-cover border-4 border-black shadow-lg rounded-lg transition-all duration-500 ease-in-out"
                                                        />
                                                        <label
                                                            htmlFor="model-image-model-upload"
                                                            className="absolute bottom-0 right-0 bg-black hover:bg-blue-500 p-2 rounded-full cursor-pointer transition-all duration-200"
                                                        >
                                                            <Camera className="w-6 h-6 text-white" />
                                                            <input
                                                                type="file"
                                                                id="model-image-model-upload"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={(e) => { handleImageModelUpload(e) }}
                                                            />
                                                        </label>
                                                        <p className="text-sm text-black text-center mt-2">
                                                            Please upload an image manually.
                                                        </p>
                                                    </div>
                                                    {fieldState?.error && (
                                                        <p className="text-red-500 text-xs text-center">{fieldState?.error?.message}</p>
                                                    )}
                                                </>
                                            )}
                                        />
                                    </div>
                                ) : (
                                    <p className="text-sm text-green-500 text-center">
                                        Model exists in the database. No image upload required.
                                    </p>
                                )
                            )}
                        </div>
                        <div className='bg-white lg:col-span-3 md:col-span-1 rounded-xl shadow-md p-6'>
                            <div className='space-y-6'>
                                {/* Number of Seats - Radio Buttons */}
                                <div className='space-y-1.5'>
                                    <div className='text-sm text-black flex items-center gap-2'>
                                        {vehicleType === 'bike' ? <Bike className='w-4 h-4 text-black' /> : <Car className='w-4 h-4 text-black' />}
                                        Number of Seats
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        <Controller
                                            name="vehicleSeat"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    {vehicleType !== 'bike' && (
                                                        <>
                                                            <label className="flex items-center gap-2">
                                                                <input
                                                                    {...field}
                                                                    type="radio"
                                                                    value="2"
                                                                    className="text-black"
                                                                    checked={field.value === "2"}
                                                                />
                                                                <span className='text-sm'>2-seater</span>
                                                            </label>
                                                            <label className="flex items-center gap-2">
                                                                <input
                                                                    {...field}
                                                                    type="radio"
                                                                    value="4"
                                                                    className="text-black"
                                                                    checked={field.value === "4"}
                                                                />
                                                                <span className='text-sm'>4-seater</span>
                                                            </label>
                                                            <label className="flex items-center gap-2">
                                                                <input
                                                                    {...field}
                                                                    type="radio"
                                                                    value="5"
                                                                    className="text-black"
                                                                    checked={field.value === "5"}
                                                                />
                                                                <span className='text-sm'>5-seater</span>
                                                            </label>
                                                            <label className="flex items-center gap-2">
                                                                <input
                                                                    {...field}
                                                                    type="radio"
                                                                    value="6"
                                                                    className="text-black"
                                                                    checked={field.value === "6"}
                                                                />
                                                                <span className='text-sm'>6-seater</span>
                                                            </label>
                                                            <label className="flex items-center gap-2">
                                                                <input
                                                                    {...field}
                                                                    type="radio"
                                                                    value="6"
                                                                    className="text-black"
                                                                    checked={field.value === "6"}
                                                                />
                                                                <span className='text-sm'>7-seater</span>
                                                            </label>
                                                            <label className="flex items-center gap-2">
                                                                <input
                                                                    {...field}
                                                                    type="radio"
                                                                    value="8"
                                                                    className="text-black"
                                                                    checked={field.value === "8"}
                                                                />
                                                                <span className='text-sm'>8-seater</span>
                                                            </label>
                                                        </>
                                                    )}
                                                    {vehicleType === 'bike' && (
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                {...field}
                                                                type="radio"
                                                                value="2"
                                                                className="text-black"
                                                                checked={field.value === "2"}
                                                            />
                                                            <span className='text-sm'>2-seater</span>
                                                        </label>
                                                    )}

                                                    {/* Show error message if validation fails */}
                                                    {fieldState?.error && (
                                                        <p className="text-red-500 text-xs">{fieldState?.error?.message}</p>
                                                    )}
                                                </>
                                            )}
                                        />
                                    </div>
                                </div>
                                {/* Vehicle Transmission */}
                                <div className="space-y-1.5">
                                    <div className="text-sm text-black flex items-center gap-2">
                                        {vehicleType === 'bike' ? <Bike className="w-4 h-4 text-black" /> : <Car className="w-4 h-4 text-black" />}
                                        Transmission Type
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        <Controller
                                            name="vehicleTransmission"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            {...field}
                                                            type="radio"
                                                            value="manual"
                                                            className="text-black"
                                                            checked={field.value === "manual"}
                                                        />
                                                        <span className="text-sm">Manual</span>
                                                    </label>
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            {...field}
                                                            type="radio"
                                                            value="automatic"
                                                            className="text-black"
                                                            checked={field.value === "automatic"}
                                                        />
                                                        <span className="text-sm">Automatic</span>
                                                    </label>
                                                    {/* Show error message if validation fails */}
                                                    {fieldState?.error && (
                                                        <p className="text-red-500 text-xs">{fieldState?.error?.message}</p>
                                                    )}
                                                </>
                                            )}
                                        />
                                    </div>
                                </div>
                                {/* Fuel Type */}
                                <div className="space-y-1.5">
                                    <div className="text-sm text-black flex items-center gap-2">
                                        {vehicleType === 'bike' ? <Bike className="w-4 h-4 text-black" /> : <Car className="w-4 h-4 text-black" />}
                                        Fuel Type
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        <Controller
                                            name="vehicleFuelType"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            {...field}
                                                            type="radio"
                                                            value="petrol"
                                                            className="text-black"
                                                            checked={field.value === 'petrol'}
                                                        />
                                                        <span className="text-sm">Petrol</span>
                                                    </label>

                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            {...field}
                                                            type="radio"
                                                            value="diesel"
                                                            className="text-black"
                                                            checked={field.value === 'diesel'}
                                                        />
                                                        <span className="text-sm">Diesel</span>
                                                    </label>

                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            {...field}
                                                            type="radio"
                                                            value="electric"
                                                            className="text-black"
                                                            checked={field.value === 'electric'}
                                                        />
                                                        <span className="text-sm">Electric</span>
                                                    </label>


                                                    {/* Show error message if validation fails */}
                                                    {fieldState?.error && (
                                                        <p className="text-red-500 text-xs">{fieldState?.error?.message}</p>
                                                    )}
                                                </>
                                            )}
                                        />
                                    </div>
                                </div>
                                {/* Vehicle Registration Number */}
                                <div className="space-y-1.5">
                                    <div className="text-sm text-black flex items-center gap-2">
                                        {vehicleType === 'bike' ? <Bike className="w-4 h-4 text-black" /> : <Car className="w-4 h-4 text-black" />}
                                        Vehicle Reg Number
                                    </div>
                                    <Controller
                                        name="vehicleRegNumber"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Enter Vehicle Reg Number"
                                                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                    className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full placeholder-black"
                                                />
                                                {fieldState?.error && (
                                                    <p className="text-red-500 text-xs">{fieldState.error.message}</p>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>
                                {/* Manufacturing Year */}
                                <div className="space-y-1.5">
                                    <div className="text-sm text-black flex items-center gap-2">
                                        {vehicleType === 'bike' ? <Bike className="w-4 h-4 text-black" /> : <Car className="w-4 h-4 text-black" />}
                                        Manufacturing Year
                                    </div>
                                    <Controller
                                        name="manufacturingYear"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <>
                                                <input
                                                    {...field}
                                                    type="text" // Set type to text to ensure only the year is entered
                                                    placeholder="Enter Manufacturing Year"
                                                    className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full placeholder-black"
                                                />
                                                {fieldState?.error && (
                                                    <p className="text-red-500 text-xs">{fieldState.error.message}</p>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>
                                <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-6">
                                    {/* Price Per Day */}
                                    <div className="space-y-1.5">
                                        <div className="text-sm text-black flex items-center gap-2">
                                            {vehicleType === 'bike' ? <Bike className="w-4 h-4 text-black" /> : <Car className="w-4 h-4 text-black" />}
                                            Price Per Day
                                        </div>
                                        <Controller
                                            name="pricePerDay"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <input
                                                        {...field}
                                                        type="number"
                                                        placeholder="Enter Price Per Day"
                                                        className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full placeholder-black"
                                                    />
                                                    {fieldState?.error && (
                                                        <p className="text-red-500 text-xs">{fieldState.error.message}</p>
                                                    )}
                                                </>
                                            )}
                                        />
                                    </div>
                                    {/* Price Per Hour */}
                                    <div className="space-y-1.5">
                                        <div className="text-sm text-black flex items-center gap-2">
                                            {vehicleType === 'bike' ? <Bike className="w-4 h-4 text-black" /> : <Car className="w-4 h-4 text-black" />}
                                            Price Per Hour
                                        </div>
                                        <Controller
                                            name="pricePerHour"
                                            control={control}
                                            rules={{
                                                validate: value => {
                                                    const pricePerDay = getValues("pricePerDay");
                                                    if (value > pricePerDay) {
                                                        return "Price per hour cannot be greater than price per day.";
                                                    }
                                                    return true;
                                                }
                                            }}
                                            render={({ field, fieldState }) => (
                                                <>
                                                    <input
                                                        {...field}
                                                        type="number"
                                                        placeholder="Enter Price Per Hour"
                                                        className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full placeholder-black"
                                                    />
                                                    {fieldState?.error && (
                                                        <p className="text-red-500 text-xs">{fieldState.error.message}</p>
                                                    )}
                                                </>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Controller
                                        name="availabilityStatus"
                                        control={control}
                                        defaultValue="Available" // Default value
                                        render={({ field }) => <input type="hidden" {...field} />}
                                    />
                                </div>
                                <div>
                                    {isAddingVehicle ? (
                                        <div className="flex items-center justify-center">
                                            <Loader className="size-10 animate-spin" />
                                        </div>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="w-full px-4 py-2.5 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
                                        >
                                            Add Vehicel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form >
            </div >
        </div >
    );
}