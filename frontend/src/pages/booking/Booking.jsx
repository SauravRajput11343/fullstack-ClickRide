import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { BookingSchema } from "../../../../backend/src/validators/booking.vaildator"
import CustomerNav from "../../component/Header/Header";
import Footer from "../../component/Footer/Footer";
import { useVehicleStore } from "../../store/useVehicleStore";
import { useAuthStore } from "../../store/useAuthStore";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

export default function Booking() {
    const { vehicleID } = useParams();
    const { fetchOneVehicleData, bookVehicle, isBooking } = useVehicleStore();
    const { authUser } = useAuthStore();
    const [vehicle, setVehicle] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    const [vehicleCharge, setVehicleCharge] = useState(0);
    const [fullDays, setFullDays] = useState(0);
    const [remainingHours, setRemainingHours] = useState(0);

    const [accessories, setAccessories] = useState({ ac: false, radio: false, childSeat: false });
    const accessoryPrices = { ac: 200, radio: 100, childSeat: 300 };
    const [accessoryTotal, setAccessoryTotal] = useState(0);
    const navigate = useNavigate();

    const securityDeposit = 500;


    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(BookingSchema),
        defaultValues: {
            firstName: authUser?.firstName || "",
            lastName: authUser?.lastName || "",
            email: authUser?.email || "",
            phone: authUser?.mobile || "",
        }
    });

    useEffect(() => {
        const fetchVehicle = async () => {
            if (!vehicleID) return;
            try {
                const vehicleData = await fetchOneVehicleData(vehicleID);
                setVehicle(vehicleData);
            } catch (error) {
                console.error("Error fetching vehicle:", error);
            }
        };
        fetchVehicle();
    }, [vehicleID, fetchOneVehicleData]);



    useEffect(() => {
        const startDate = watch("startDate");
        const startTime = watch("startTime");
        const endDate = watch("endDate");
        const endTime = watch("endTime");

        if (startDate && startTime && endDate && endTime) {
            const start = new Date(`${startDate}T${startTime}`);
            const end = new Date(`${endDate}T${endTime}`);
            const diffHours = (end - start) / (1000 * 60 * 60);

            if (diffHours > 0 && vehicle) {
                const days = Math.floor(diffHours / 24);
                const hours = diffHours % 24;

                const dailyRate = parseFloat(vehicle.pricePerDay?.$numberDecimal);
                const hourlyRate = parseFloat(vehicle.pricePerHour?.$numberDecimal);

                const vehicleCost = days * dailyRate + hours * hourlyRate;
                const newAccessoryTotal = Object.keys(accessories).reduce(
                    (sum, key) => (accessories[key] ? sum + accessoryPrices[key] : sum),
                    0
                );

                setFullDays(days);
                setRemainingHours(hours);
                setVehicleCharge(vehicleCost);
                setTotalPrice(vehicleCost + newAccessoryTotal + securityDeposit);
                setAccessoryTotal(newAccessoryTotal);
            }
        }
    }, [watch("startDate"), watch("startTime"), watch("endDate"), watch("endTime"), vehicle, accessories]);

    const handleAccessoryChange = (e) => {
        setAccessories({ ...accessories, [e.target.name]: e.target.checked });
    };

    if (!vehicle) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    const onSubmit = async (data) => {
        const bookingDetails = {
            vehicleID,
            userID: authUser?._id,
            startDate: data.startDate,
            startTime: data.startTime,
            endDate: data.endDate,
            endTime: data.endTime,
            totalPrice,
            accessories,
        };

        console.log("Booking Details:", bookingDetails);

        try {
            const book = await bookVehicle(bookingDetails);
            console.log("Book Response:", book); // Debugging step

            if (book?.success) { // Ensure `book` is defined
                toast.success("Vehicle Successfully Booked!");
                navigate("/ViewVehicle");
            } else {
                toast.error(`Booking Failed: ${book?.message || "Unknown Error"}`);
            }
        } catch (error) {
            console.error("Catch Block Error:", error); // Log error details
            toast.error("An error occurred while processing the booking.");
        }
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <CustomerNav />
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 mt-10">
                <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
                    Book Your Vehicle
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Vehicle Details Card */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="relative h-64">
                            <img
                                src={vehicle.vehicleImagesId.VehicleFrontPic}
                                alt="Vehicle"
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                            <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                {vehicle.modelID.vehicleType}
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <h2 className="text-2xl font-bold text-gray-900">Vehicle Details</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Brand & Model</p>
                                        <p className="font-medium">{vehicle.modelID.vehicleMake} {vehicle.modelID.vehicleModel}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Fuel Type</p>
                                        <p className="font-medium">{vehicle.vehicleFuelType}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Registration Number</p>
                                        <p className="font-medium">{vehicle.vehicleRegNumber}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Seating</p>
                                        <p className="font-medium">{vehicle.vehicleSeat} Seats</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Transmission</p>
                                        <p className="font-medium">{vehicle.vehicleTransmission}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-500">Hourly Rate</span>
                                    <span className="text-lg font-bold text-blue-600">₹{vehicle.pricePerHour?.$numberDecimal}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Daily Rate</span>
                                    <span className="text-lg font-bold text-blue-600">₹{vehicle.pricePerDay?.$numberDecimal}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter Your Details</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        {...register("firstName")}
                                        placeholder="First Name"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        {...register("lastName")}
                                        placeholder="Last Name"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                                    )}
                                </div>
                            </div>

                            <input
                                type="email"
                                {...register("email")}
                                placeholder="Email Address"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}

                            <input
                                type="tel"
                                {...register("phone")}
                                placeholder="Phone Number"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        {...register("startDate")}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                    />
                                    {errors.startDate && (
                                        <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                    <input
                                        type="time"
                                        {...register("startTime")}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                    />
                                    {errors.startTime && (
                                        <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        {...register("endDate")}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                    />
                                    {errors.endDate && (
                                        <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                    <input
                                        type="time"
                                        {...register("endTime")}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                    />
                                    {errors.endTime && (
                                        <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">Additional Accessories</label>
                                <div className="space-y-2">
                                    {Object.entries(accessoryPrices).map(([key, price]) => (
                                        <label key={key} className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name={key}
                                                onChange={handleAccessoryChange}
                                                className="w-4 h-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)} - ₹{price}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {isBooking ? (
                                <div className="flex items-center justify-center">
                                    <Loader className="size-10 animate-spin" />
                                </div>
                            ) : (
                                <button type="submit"
                                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 mt-6">
                                    Confirm Booking
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-fit">
                        <h2 className=" text-center text-2xl font-bold text-gray-900 ">Booking Summary</h2>

                        <h3 className="text-center text-xl font-bold text-gray-900 mb-6">{vehicle.vehicleRegNumber}</h3>

                        <div className="space-y-4">
                            <div className="pb-4 border-b border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Vehicle Charges</h3>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Total Vehicle Cost</span>
                                    <span className="font-medium">₹{vehicleCharge}</span>
                                </div>

                                {fullDays > 0 && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Day Price</span>
                                        <span className="font-medium text-gray-500">₹{fullDays * (vehicle?.pricePerDay?.$numberDecimal || 0)}</span>
                                    </div>
                                )}

                                {remainingHours > 0 && (
                                    <div className="flex justify-between items-center text-sm mb-2">
                                        <span className="text-gray-500">Hour Charges</span>
                                        <span className="font-medium text-gray-500">₹{remainingHours * (vehicle?.pricePerHour?.$numberDecimal || 0)}</span>
                                    </div>
                                )}
                            </div>


                            {Object.values(accessories).some(value => value) && (
                                <div className="pb-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Added Accessories</h3>
                                    {Object.entries(accessories).map(([key, value]) =>
                                        value && (
                                            <div key={key} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                                <span className="font-medium text-gray-900">₹{accessoryPrices[key]}</span>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                            <div className="pb-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Additional Charges</h3>
                                <div className="flex justify-between items-center text-sm font-semibold">
                                    <span className="text-gray-600">Security Deposit</span>
                                    <span className="font-medium text-gray-900">₹{securityDeposit}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                                <span className="text-2xl font-bold text-blue-600">₹{totalPrice.toFixed(2)}</span>
                            </div>

                            <p className="text-sm text-gray-500 mt-4">
                                * Final amount includes all applicable taxes and fees. <br />
                                * A refundable security deposit of ₹{securityDeposit} is included in the total.<br />
                                * Cancellations made within 24 hours of the booking start time may be subject to a cancellation fee.<br />
                                * Additional charges may apply for late returns, fuel policy violations, or vehicle damage.
                            </p>

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}