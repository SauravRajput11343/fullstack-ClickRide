import React, { useState, useEffect } from 'react';
import AdminNav from '../../component/AdminNav/AdminNav';
import { AdminSideBar } from '../../component/AdminSideBar/AdminSideBar';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, Car, Bike } from "lucide-react";
import { useVehicleStore } from "../../store/useVehicleStore"
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

export default function AddVehicle() {
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

    // Common models for each make
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

    const { authUser, UserRole } = useAuthStore();

    const [vehicleType, setVehicleType] = useState('none');
    const [vehicleMake, setVehicleMake] = useState('');
    const [vehicleModel, setVehicleModel] = useState('');
    const [selectedImg, setSelectedImg] = useState('/avatar.png');
    const [selectedImgModel, setSelectedModelImg] = useState('/avatar.png');
    const [vehicleSeat, setVehicleSeat] = useState("");
    const [modelNotFound, setModelNotFound] = useState(false);
    const [modelChecked, setModelChecked] = useState(false);



    const { addVehicles, isAddingVehicle } = useVehicleStore();

    const vehicleModels = useVehicleStore((state) => state.vehicleModelDetails) || []; // Default to an empty array if undefined
    const fetchVehicleModels = useVehicleStore((state) => state.fetchVehicleModelData);




    const [profileData, setProfileData] = useState({
        userId: authUser?._id || '',
    });

    // Handle vehicle type change
    const [formData, setFormData] = useState({
        vehicleType: "",
        vehicleMake: "",
        vehicleModel: "",
        vehicleSeat: "",
        vehicleTransmission: "",
        vehicleFuelType: "",
        pricePerDay: "",
        pricePerHour: "",
        vehicleRegNumber: "",
        manufacturingYear: "",
        vehiclePic: "",
        modelPic: "",
        availabilityStatus: "Available",
    });




    // Handle vehicle type change
    const handleVehicleTypeChange = (e) => {
        const selectedType = e.target.value;
        setVehicleType(selectedType);
        setFormData((prevData) => ({
            ...prevData,
            vehicleType: selectedType
        }));
        setVehicleMake(''); // Reset make
        setVehicleModel(''); // Reset model
    };

    // Handle make change
    const handleMakeChange = (e) => {
        const selectedMake = e.target.value;
        setVehicleMake(selectedMake);
        setFormData((prevData) => ({
            ...prevData,
            vehicleMake: selectedMake
        }));
        setVehicleModel(''); // Reset model when make changes
    };

    // Handle model change
    const handleModelChange = (e) => {
        setVehicleModel(e.target.value);
        setFormData((prevData) => ({
            ...prevData,
            vehicleModel: e.target.value
        }));
    };

    // Handle image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // Check for file size (5MB max)
                toast.error("File size is too large. Max 5MB.");
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const uploadedImg = reader.result;
                setSelectedImg(uploadedImg); // Update the state with the new image
                setFormData((prevData) => ({
                    ...prevData,
                    vehiclePic: uploadedImg
                }));

            };
        }
    };

    const handleImageModelUpload = async (e) => {
        const file = e.target.files[0]; // Get the selected file
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // Check for file size (5MB max)
                toast.error("File size is too large. Max 5MB.");
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file); // Read the file as a Data URL
            reader.onload = () => {
                const uploadedImgmodel = reader.result; // Get the image result
                setSelectedModelImg(uploadedImgmodel); // Update state with the model image data
                setFormData((prevData) => ({
                    ...prevData,
                    modelPic: uploadedImgmodel // Optionally update form data with model image URL
                }));
            };
        }
    };


    // Handle seat change
    const handleSeatChange = (e) => {
        setVehicleSeat(e.target.value);
        setFormData((prevData) => ({
            ...prevData,
            vehicleSeat: e.target.value
        }));
    };

    useEffect(() => {
        if (authUser) {
            setProfileData({
                userId: authUser?._id || ''
            });
        }
    }, [authUser]);

    useEffect(() => {
        fetchVehicleModels(); // Fetch vehicle models when the component mounts
    }, [fetchVehicleModels]);

    useEffect(() => {
        if (vehicleType && vehicleMake && vehicleModel) {
            // Check if vehicleModels is an array and not empty
            const modelExists = Array.isArray(vehicleModels) && vehicleModels.length > 0 &&
                vehicleModels.some(
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
    }, [vehicleType, vehicleMake, vehicleModel, vehicleModels]);


    const navigate = useNavigate();
    const isDrawerOpen = true;



    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission

        // Prepare the final data to send to the API
        const updatedFormData = {
            ...formData,
            vehicleType,
            vehicleMake,
            vehicleModel,
            vehicleSeat,
            vehiclePic: selectedImg,
            modelPic: selectedImgModel,
            userID: profileData.userId,
        };


        try {
            const response = await addVehicles(updatedFormData); // Submit the updated form data

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
        <div className="overflow-x-hidden"> {/* Prevent horizontal scroll */}



            <form onSubmit={handleSubmit}>
                <div className='grid lg:grid-cols-5 md:grid-cols-2 gap-6 px-6 pt-4 pb-1'>

                    {/* First column - Car Image and Additional Info */}
                    <div className='bg-white shadow-md rounded-lg p-6 grid grid-rows-4 gap-6 lg:col-span-2 md:grid-cols-1'>
                        {/* Row 1 - Vehicle Image */}
                        <div className='relative grid row-span-2'>
                            <img
                                src={selectedImg || '/avatar.png'} // Use selectedImg if available, otherwise fallback to default avatar
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
                                    onChange={handleImageUpload}
                                />
                            </label>
                            <p className='text-sm text-black text-center mt-2'>Upload vehicle image</p>
                        </div>




                        {/* Row 2 - Additional Vehicle Information */}
                        <div className='space-y-6 row-span-2'>
                            <div className="space-y-1.5">
                                <div className="text-sm text-black flex items-center gap-2">
                                    {vehicleType === 'bike' ? <Bike className="w-4 h-4 text-black" /> : <Car className="w-4 h-4 text-black" />}
                                    Vehicle Type
                                </div>
                                <select
                                    className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full"
                                    value={vehicleType}
                                    onChange={handleVehicleTypeChange}
                                >
                                    <option value="none">None</option>
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
                            </div>

                            {/* Vehicle Make Dropdown */}
                            <div className="space-y-1.5">
                                <div className="text-sm text-black flex items-center gap-2">
                                    {vehicleType === 'bike' ? <Bike className="w-4 h-4 text-black" /> : <Car className="w-4 h-4 text-black" />}
                                    Vehicle Make
                                </div>
                                <select
                                    className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full"
                                    value={vehicleMake}
                                    onChange={handleMakeChange}
                                    disabled={vehicleType === 'none'}
                                >
                                    <option value="">Select Make</option>
                                    {(vehicleMakes[vehicleType])?.map(make => (
                                        <option key={make.value} value={make.value}>{make.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Vehicle Model Dropdown */}
                            <div className="space-y-1.5">
                                <div className="text-sm text-black flex items-center gap-2">
                                    {vehicleType === 'bike' ? <Bike className="w-4 h-4 text-black" /> : <Car className="w-4 h-4 text-black" />}
                                    Vehicle Model
                                </div>
                                <select
                                    className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full"
                                    value={vehicleModel}
                                    onChange={handleModelChange}
                                    disabled={!vehicleMake}
                                >
                                    <option value="">Select Model</option>
                                    {vehicleMake && models[vehicleMake]?.map(model => (
                                        <option key={model} value={model}>{model}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {modelChecked && (
                            modelNotFound ? (
                                <div className='relative grid row-span-2'>
                                    <img
                                        src={selectedImgModel || '/avatar.png'} // Use selectedImg if available, otherwise fallback to default avatar
                                        alt='Vehicle'
                                        className='w-full h-64 object-cover border-4 border-black shadow-lg rounded-lg transition-all duration-500 ease-in-out'
                                    />
                                    <label
                                        htmlFor='vehicle-image-model-upload'
                                        className='absolute bottom-0 right-0 bg-black hover:bg-blue-500 p-2 rounded-full cursor-pointer transition-all duration-200'
                                    >
                                        <Camera className='w-6 h-6 text-white' />
                                        <input
                                            type='file'
                                            id='vehicle-image-model-upload'
                                            className='hidden'
                                            accept='image/*'
                                            onChange={handleImageModelUpload}
                                        />
                                    </label>
                                    <p className='text-sm text-red-500 text-center mt-2'>
                                        Model not found. Please upload an image manually.
                                    </p>
                                </div>
                            ) : (
                                <p className='text-sm text-green-500 text-center'>
                                    Model exists in the database. No image upload required.
                                </p>
                            )
                        )}

                    </div>

                    {/* Second column - Vehicle Information */}
                    <div className='bg-white lg:col-span-3 md:col-span-1 rounded-xl shadow-md p-6'>

                        <div className='space-y-6'>
                            {/* Number of Seats - Radio Buttons */}
                            <div className='space-y-1.5'>
                                <div className='text-sm text-black flex items-center gap-2'>
                                    {vehicleType === 'bike' ? <Bike className='w-4 h-4 text-black' /> : <Car className='w-4 h-4 text-black' />}
                                    Number of Seats
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {vehicleType !== 'bike' && (
                                        <>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="seats"
                                                    value="2"
                                                    className="text-black"
                                                    checked={vehicleSeat === "2"}
                                                    onChange={handleSeatChange}
                                                />
                                                <span className='text-sm'>2-seater</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="seats"
                                                    value="4"
                                                    className="text-black"
                                                    checked={vehicleSeat === "4"}
                                                    onChange={handleSeatChange}
                                                />
                                                <span className='text-sm'>4-seater</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="seats"
                                                    value="5"
                                                    className="text-black"
                                                    checked={vehicleSeat === "5"}
                                                    onChange={handleSeatChange}
                                                />
                                                <span className='text-sm'>5-seater</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="seats"
                                                    value="6"
                                                    className="text-black"
                                                    checked={vehicleSeat === "6"}
                                                    onChange={handleSeatChange}
                                                />
                                                <span className='text-sm'>6-seater</span>
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="seats"
                                                    value="8"
                                                    className="text-black"
                                                    checked={vehicleSeat === "8"}
                                                    onChange={handleSeatChange}
                                                />
                                                <span className='text-sm'>8-seater</span>
                                            </label>
                                        </>
                                    )}
                                    {vehicleType === 'bike' && (
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="seats"
                                                value="2"
                                                className="text-black"
                                                checked={vehicleSeat === "2"}
                                                onChange={handleSeatChange}
                                            />
                                            <span className='text-sm'>2-seater</span>
                                        </label>
                                    )}
                                </div>
                            </div>


                            {/* Transmission Type - Radio Buttons */}
                            <div className="space-y-1.5">
                                <div className="text-sm text-black flex items-center gap-2">
                                    {vehicleType === 'bike' ? <Bike className="w-4 h-4 text-black" /> : <Car className="w-4 h-4 text-black" />}
                                    Transmission Type
                                </div>
                                <div className="flex items-center gap-6">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="transmission"
                                            value="manual"
                                            className="text-black"
                                            checked={formData.vehicleTransmission === "manual"}
                                            onChange={(e) => setFormData({ ...formData, vehicleTransmission: e.target.value })}
                                        />
                                        <span className="text-sm">Manual</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="transmission"
                                            value="automatic"
                                            className="text-black"
                                            checked={formData.vehicleTransmission === "automatic"}
                                            onChange={(e) => setFormData({ ...formData, vehicleTransmission: e.target.value })}
                                        />
                                        <span className="text-sm">Automatic</span>
                                    </label>
                                </div>
                            </div>

                            {/* Fuel Type - Radio Buttons */}
                            <div className="space-y-1.5">
                                <div className="text-sm text-black flex items-center gap-2">
                                    {vehicleType === 'bike' ? <Bike className="w-4 h-4 text-black" /> : <Car className="w-4 h-4 text-black" />}
                                    Fuel Type
                                </div>
                                <div className="flex items-center gap-6">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="fuelType"
                                            value="petrol"
                                            className="text-black"
                                            checked={formData.vehicleFuelType === "petrol"}
                                            onChange={(e) => setFormData({ ...formData, vehicleFuelType: e.target.value })}
                                        />
                                        <span className="text-sm">Petrol</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="fuelType"
                                            value="diesel"
                                            className="text-black"
                                            checked={formData.vehicleFuelType === "diesel"}
                                            onChange={(e) => setFormData({ ...formData, vehicleFuelType: e.target.value })}
                                        />
                                        <span className="text-sm">Diesel</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="fuelType"
                                            value="electric"
                                            className="text-black"
                                            checked={formData.vehicleFuelType === "electric"}
                                            onChange={(e) => setFormData({ ...formData, vehicleFuelType: e.target.value })}
                                        />
                                        <span className="text-sm">Electric</span>
                                    </label>
                                </div>
                            </div>

                            {/* Vehicle Registration Number */}
                            <div className="space-y-1.5">
                                <div className="text-sm text-black flex items-center gap-2">
                                    {vehicleType === 'bike' ? <Bike className="w-4 h-4 text-black" /> : <Car className="w-4 h-4 text-black" />}
                                    Vehicle Reg Number
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter Vehicle Reg Number"
                                    className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full placeholder-black"
                                    value={formData.vehicleRegNumber}
                                    onChange={(e) => setFormData({ ...formData, vehicleRegNumber: e.target.value })}
                                />
                            </div>

                            {/* Manufacturing Year */}
                            <div className="space-y-1.5">
                                <div className="text-sm text-black flex items-center gap-2">
                                    {vehicleType === 'bike' ? <Bike className="w-4 h-4 text-black" /> : <Car className="w-4 h-4 text-black" />}
                                    Manufacturing Year
                                </div>
                                <input
                                    type="number"
                                    placeholder="Enter Manufacturing Year"
                                    className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full placeholder-black"
                                    value={formData.manufacturingYear}
                                    onChange={(e) => setFormData({ ...formData, manufacturingYear: e.target.value })}
                                />
                            </div>


                            {/* Pricing Section - Two Columns */}
                            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-6">
                                {/* Price Per Day */}
                                <div className="space-y-1.5">
                                    <div className="text-sm text-black flex items-center gap-2">
                                        {vehicleType === 'bike' ? <Bike className="w-4 h-4 text-black" /> : <Car className="w-4 h-4 text-black" />}
                                        Price Per Day
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="Enter Price Per Day"
                                        className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full placeholder-black"
                                        value={formData.pricePerDay}
                                        onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                                    />
                                </div>

                                {/* Price Per Hour */}
                                <div className="space-y-1.5">
                                    <div className="text-sm text-black flex items-center gap-2">
                                        {vehicleType === 'bike' ? <Bike className="w-4 h-4 text-black" /> : <Car className="w-4 h-4 text-black" />}
                                        Price Per Hour
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="Enter Price Per Hour"
                                        className="px-4 py-2.5 bg-white rounded-lg border border-gray-600 text-black w-full placeholder-black"
                                        value={formData.pricePerHour}
                                        onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                                    />
                                </div>
                            </div>

                            <input
                                type="hidden"
                                name="availabilityStatus"
                                value="Available" // Default value
                            />
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
                                        Submit
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>

        </div>
    );
}
