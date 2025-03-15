import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Loader2, Calendar, CheckCircle, XCircle, Car, RefreshCcw, Printer, XSquare, Download, List, Grid, Eye } from "lucide-react";
import Header from "../../component/Header/Header";
import { CustomerSideNav } from "../../component/Customer/CustomerSideNav";
import { useVehicleStore } from "../../store/useVehicleStore";
import { useAuthStore } from "../../store/useAuthStore";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import BookingPDF from "../../component/pdf/BookingPDF";

// Card view component for bookings
const BookingCard = ({ booking, onCancel, navigate, getStatusColor }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full max-w-md mx-auto">
            {/* Vehicle Image Background with improved gradient overlay */}
            <div
                className="h-40 sm:h-48 md:h-52 bg-cover bg-center relative"
                style={{
                    backgroundImage: `url(${booking.vehicleID?.vehicleImagesId?.VehicleFrontPic || "/api/placeholder/400/320"})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}
            >
                {/* Improved gradient overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                        <h3 className="font-bold text-white flex items-center text-lg">
                            <Car className="w-5 h-5 text-blue-300 mr-2" />
                            <span
                                className="cursor-pointer text-white hover:text-blue-300 transition-colors duration-200 truncate max-w-[calc(100%-2rem)]"
                                onClick={() => navigate(`/vehicleDetails/${booking.vehicleID?._id}`)}
                            >
                                {booking.vehicleID?.vehicleRegNumber || "Unknown Vehicle"}
                            </span>
                        </h3>
                    </div>
                </div>
            </div>

            <div className="p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                    {/* Start Date Card */}
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                        <div className="flex items-center mb-1">
                            <Calendar className="w-4 h-4 text-indigo-500 mr-2" />
                            <span className="text-xs sm:text-sm font-medium text-gray-600">Start Date</span>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold block mt-1">
                            {new Date(booking.startDate).toLocaleDateString()}
                        </span>
                    </div>

                    {/* End Date Card */}
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                        <div className="flex items-center mb-1">
                            <Calendar className="w-4 h-4 text-indigo-500 mr-2" />
                            <span className="text-xs sm:text-sm font-medium text-gray-600">End Date</span>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold block mt-1">
                            {new Date(booking.endDate).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-center py-2 border-t border-b border-gray-100">
                    <span className="text-gray-600 font-medium text-sm sm:text-base">Total Amount:</span>
                    <span className="font-bold text-green-600 text-base sm:text-lg">
                        ₹{booking.totalPrice.toFixed(2)}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-sm sm:text-base">Status:</span>
                    <div className="flex items-center bg-gray-50 py-1 px-2 sm:px-3 rounded-full">
                        {booking?.status === "Cancelled" ? (
                            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-1 sm:mr-2" />
                        ) : (
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-1 sm:mr-2" />
                        )}
                        <span className={`font-medium text-xs sm:text-sm ${getStatusColor(booking?.status)}`}>
                            {booking?.status || "Unknown"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="px-3 sm:px-5 py-3 sm:py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-2 sm:justify-between">
                <div className="flex items-center px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm font-medium text-xs sm:text-sm w-full sm:w-auto justify-center">
                    <BookingPDF booking={booking} />
                </div>
                <div className="flex space-x-2 sm:space-x-3 w-full sm:w-auto">
                    <button
                        onClick={() => navigate(`/bookingDetails/${booking._id}`)}
                        className="flex items-center px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm font-medium text-xs sm:text-sm flex-1 sm:flex-initial justify-center"
                    >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        View
                    </button>
                    <button
                        onClick={() => onCancel(booking)}
                        className="flex items-center px-3 sm:px-4 py-2 bg-white border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors shadow-sm font-medium text-xs sm:text-sm flex-1 sm:flex-initial justify-center"
                    >
                        <XSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function History() {
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [viewMode, setViewMode] = useState("list"); // New state for view mode: 'list' or 'card'
    const navigate = useNavigate();
    const isDrawerOpen = true;

    const { getVehicleHistory, bookingDetails, cancelVehicle, isBookingCancel } = useVehicleStore();
    const { authUser, UserRole, } = useAuthStore();

    useEffect(() => {
        fetchBookingHistory();
    }, []);

    useEffect(() => {
        if (bookingDetails.length > 0) {
            setLoading(false);
        }
    }, [bookingDetails]);

    const fetchBookingHistory = async () => {
        try {
            if (!authUser?._id) {
                console.error("❌ [ERROR] User ID is missing.");
                return;
            }
            setLoading(true);
            await getVehicleHistory({ userID: authUser._id, role: UserRole });
        } catch (error) {
            console.error("❌ [ERROR] Failed to fetch booking history:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateAllBookingsPDF = () => {
        const doc = new jsPDF();

        // Add header
        doc.setFontSize(20);
        doc.text('Booking History', 105, 15, { align: 'center' });

        // Prepare data for table
        const tableData = bookingDetails.map(booking => [
            booking.vehicleID?.vehicleRegNumber || "Unknown",
            new Date(booking.startDate).toLocaleDateString(),
            new Date(booking.endDate).toLocaleDateString(),
            `₹${booking.totalPrice.toFixed(2)}`,
            booking.vehicleID?.availabilityStatus || "Unknown"
        ]);

        // Add table
        doc.autoTable({
            startY: 25,
            head: [['Vehicle', 'Start Date', 'End Date', 'Price', 'Status']],
            body: tableData,
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 5 },
            headStyles: { fillColor: [66, 66, 66] }
        });

        // Save the PDF
        doc.save('all-bookings.pdf');
    };

    const handleCancelBooking = (booking) => {
        setSelectedBooking(booking);
        setShowCancelDialog(true);
    };

    const confirmCancelBooking = async () => {
        try {
            console.log("Attempting to cancel booking:", selectedBooking._id);

            const formData = { bookingID: selectedBooking._id };
            const response = await cancelVehicle(formData);

            if (response.success) {
                toast.success("Booking canceled successfully.");

                // Ensure booking details are refreshed
                await fetchBookingHistory();
            } else {
                toast.error(response.message || "Failed to cancel booking.");
            }
        } catch (error) {
            toast.error(error.message || "An unexpected error occurred while canceling the booking.");
            console.error("Error canceling booking:", error);
        } finally {
            setShowCancelDialog(false); // Close the dialog only after data refresh
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'Cancelled':
                return 'text-rose-600 bg-rose-50 border-rose-200';
            case 'Pending':
                return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'Active':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    // Toggle between list and card view
    const toggleViewMode = (mode) => {
        setViewMode(mode);
    };

    const viewBookingDetail = (booking) => {
        // Navigate to a dedicated booking details page with the booking ID in the URL
        navigate(`/bookingDetails/${booking._id}`);
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };
    const filteredBookings = selectedStatus === "all"
        ? bookingDetails
        : bookingDetails.filter(booking => booking.status.toLowerCase() === selectedStatus.toLowerCase()
        );

    return (
        <div className="bg-gray-100 ">
            <Header />

            <div className={`transition-all duration-300 `}>
                <div className=" p-4">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-wrap justify-between items-center gap-4">
                                <h2 className="text-2xl font-bold flex items-center text-gray-800">
                                    <Car className="w-6 h-6 text-indigo-600 mr-2" />
                                    Booking History
                                </h2>
                                <div className="flex flex-wrap items-center gap-4">
                                    <select
                                        value={selectedStatus}
                                        onChange={handleStatusChange}
                                        className="border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="all">All</option>
                                        <option value="booked">Booked</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="active">Active</option>
                                    </select>
                                    <div className="flex bg-gray-100 rounded-md p-1">
                                        <button
                                            onClick={() => toggleViewMode("list")}
                                            className={`px-3 py-1 rounded-md ${viewMode === "list" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-200"}`}
                                        >
                                            <List className="w-4 h-4 mr-1" /> List
                                        </button>
                                        <button
                                            onClick={() => toggleViewMode("card")}
                                            className={`px-3 py-1 rounded-md ${viewMode === "card" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-200"}`}
                                        >
                                            <Grid className="w-4 h-4 mr-1" /> Cards
                                        </button>
                                    </div>
                                    <button
                                        onClick={generateAllBookingsPDF}
                                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    >
                                        <Download className="w-4 h-4 mr-2" /> Download All Bookings
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {loading ? (
                                <div className="flex justify-center items-center p-8">
                                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                                    <span className="ml-2">Loading your bookings...</span>
                                </div>
                            ) : filteredBookings.length === 0 ? (
                                <div className="text-center py-8">
                                    <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">No booking history found.</p>
                                </div>
                            ) : viewMode === "list" ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-4 py-3 text-left">Vehicle</th>
                                                <th className="px-4 py-3 text-left">Start Date</th>
                                                <th className="px-4 py-3 text-left">End Date</th>
                                                <th className="px-4 py-3 text-left">Total Price</th>
                                                <th className="px-4 py-3 text-left">Status</th>
                                                <th className="px-4 py-3 text-left">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* {bookingDetails.map((booking, index) => ( */}
                                            {filteredBookings.map((booking, index) => (
                                                <tr
                                                    key={booking._id}
                                                    className={`border-t border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                        } hover:bg-gray-100 transition-colors`}
                                                >
                                                    <td className="px-4 py-3">
                                                        <div
                                                            className="flex items-center cursor-pointer text-blue-600 hover:underline"
                                                            onClick={() => navigate(`/vehicleDetails/${booking.vehicleID?._id}`)}
                                                        >
                                                            <Car className="w-5 h-5 text-blue-500 mr-2" />
                                                            <span className="font-medium text-gray-700">
                                                                {booking.vehicleID?.vehicleRegNumber || "Unknown Vehicle"}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center">
                                                            <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                                                            <span className="text-gray-600">
                                                                {new Date(booking.startDateTime).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center">
                                                            <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                                                            <span className="text-gray-600">
                                                                {new Date(booking.endDateTime).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="font-semibold text-green-600">
                                                            ₹{booking.totalPrice.toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center">
                                                            {booking?.status === "Cancelled" ? (
                                                                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                                                            ) : booking?.status === "Active" ? (
                                                                <RefreshCcw className="w-5 h-5 text-blue-500 mr-2" /> // Blue icon for Active
                                                            ) : booking?.status === "Completed" ? (
                                                                <CheckCircle className="w-5 h-5 text-gray-500 mr-2" /> // Gray icon for Completed
                                                            ) : (
                                                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" /> // Green icon for Booked/Default
                                                            )}
                                                            <span className={getStatusColor(booking?.status)}>
                                                                {booking?.status || "Unknown"}
                                                            </span>
                                                        </div>


                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center space-x-2">
                                                            <BookingPDF booking={booking} />
                                                            <button
                                                                onClick={() => handleCancelBooking(booking)}
                                                                className="flex items-center px-3 py-1 rounded-md transition-colors 
                text-white 
                disabled:opacity-50 disabled:cursor-not-allowed 
                bg-red-500 hover:bg-red-600"
                                                                disabled={booking.status === "Completed" || booking.status === "Cancelled" || booking.status === "Active"}
                                                            >
                                                                <XSquare className="w-4 h-4 mr-1" />
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => viewBookingDetail(booking)}
                                                                className="flex items-center px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                                            >
                                                                <Eye className="w-4 h-4 mr-1" />
                                                                View
                                                            </button>
                                                        </div>
                                                    </td>



                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                // Card View
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/*  {bookingDetails.map((booking) => ( */}
                                    {filteredBookings.map((booking) => (
                                        <BookingCard
                                            key={booking._id}
                                            booking={booking}
                                            onCancel={handleCancelBooking}
                                            navigate={navigate}
                                            getStatusColor={getStatusColor}
                                        />
                                    ))}

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Cancel Booking Dialog (unchanged) */}
            {showCancelDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Cancel Booking</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to cancel this booking? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowCancelDialog(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                No, keep booking
                            </button>
                            {isBookingCancel ? (
                                <div className="flex items-center justify-center">
                                    <Loader className="size-10 animate-spin" />
                                </div>
                            ) : (
                                <button
                                    onClick={confirmCancelBooking}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                >
                                    Yes, cancel booking
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}