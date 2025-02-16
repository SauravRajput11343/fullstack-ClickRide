import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Calendar, CheckCircle, XCircle, Car, Printer, XSquare, Download } from "lucide-react";
import Header from "../../component/Header/Header";
import { CustomerSideNav } from "../../component/Customer/CustomerSideNav";
import { useVehicleStore } from "../../store/useVehicleStore";
import { useAuthStore } from "../../store/useAuthStore";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const BookingPDF = ({ booking }) => {
    const generateSinglePDF = () => {
        const doc = new jsPDF();

        // 🎨 Define color scheme
        const colors = {
            primary: [66, 88, 255],    // Blue
            secondary: [100, 100, 100], // Gray
            accent: [255, 69, 0],      // Red-Orange
            background: [240, 240, 240] // Light Gray
        };

        // 📏 Define common measurements
        const margin = 20;
        const pageWidth = doc.internal.pageSize.width;
        const contentWidth = pageWidth - (2 * margin);

        // 🎯 Add decorative header border
        doc.setDrawColor(...colors.primary);
        doc.setLineWidth(0.5);
        doc.line(margin, 25, pageWidth - margin, 25);

        // 🏢 Enhanced Header - Car Rental Service
        doc.setFont("helvetica", "bold");
        doc.setFontSize(28);
        doc.setTextColor(...colors.primary);
        doc.text("ClickRide Service", 105, 20, { align: "center" });

        // 🎫 Booking Reference with styled box
        doc.setDrawColor(...colors.secondary);
        doc.setFillColor(245, 245, 250);
        doc.roundedRect(margin, 30, 170, 18, 3, 3, 'FD');

        doc.setFontSize(12);
        doc.setTextColor(...colors.secondary);
        doc.text(`Booking Reference: ${booking._id}`, 25, 38);
        doc.text(`Date: ${new Date(booking.createdAt).toLocaleDateString()}`, 25, 44);

        // 🛑 Enhanced Section Title Style
        const sectionTitle = (title, yPosition) => {
            // Gradient-like background effect
            doc.setFillColor(...colors.background);
            doc.roundedRect(margin, yPosition - 7, contentWidth, 12, 2, 2, 'F');

            // Add a subtle left border
            doc.setDrawColor(...colors.primary);
            doc.setLineWidth(1);
            doc.line(margin, yPosition - 7, margin, yPosition + 5);

            doc.setFontSize(14);
            doc.setTextColor(...colors.primary);
            doc.setFont("helvetica", "bold");
            doc.text(title, 25, yPosition);
        };

        // 📌 Enhanced Customer Details
        sectionTitle("Customer Details", 60);
        doc.autoTable({
            startY: 65,
            body: [
                ["Name", `${booking.userID.firstName} ${booking.userID.lastName}`],
                ["Email", booking.userID.email],
                ["Mobile", booking.userID.mobile],
            ],
            theme: "grid",
            styles: {
                fontSize: 12,
                cellPadding: 6,
                lineColor: [200, 200, 200],
                lineWidth: 0.1,
            },
            columnStyles: {
                0: { fontStyle: "bold", cellWidth: 50, fillColor: [250, 250, 255] },
                1: { fillColor: [255, 255, 255] }
            },
            alternateRowStyles: {
                fillColor: [252, 252, 255]
            },
        });

        // 🚗 Enhanced Vehicle Details
        sectionTitle("Vehicle Details", doc.lastAutoTable.finalY + 15);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 20,
            body: [
                ["Vehicle", `${booking.vehicleID.modelID.vehicleMake} ${booking.vehicleID.modelID.vehicleModel}`],
                ["Reg. Number", booking.vehicleID.vehicleRegNumber],
                ["Type", booking.vehicleID.modelID.vehicleType.toUpperCase()],
                ["Transmission", booking.vehicleID.vehicleTransmission],
                ["Fuel Type", booking.vehicleID.vehicleFuelType],
                ["Seats", booking.vehicleID.vehicleSeat],
            ],
            theme: "grid",
            styles: {
                fontSize: 12,
                cellPadding: 6,
                lineColor: [200, 200, 200],
                lineWidth: 0.1,
            },
            columnStyles: {
                0: { fontStyle: "bold", cellWidth: 50, fillColor: [250, 250, 255] },
                1: { fillColor: [255, 255, 255] }
            },
            alternateRowStyles: {
                fillColor: [252, 252, 255]
            },
        });

        // 📅 Enhanced Booking Details
        sectionTitle("Booking Details", doc.lastAutoTable.finalY + 15);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 20,
            body: [
                ["Start Date", new Date(booking.startDate).toLocaleDateString()],
                ["Start Time", booking.startTime],
                ["End Date", new Date(booking.endDate).toLocaleDateString()],
                ["End Time", booking.endTime],
                ["Accessories", booking.accessories.length ? booking.accessories.join(", ") : "None"],
            ],
            theme: "grid",
            styles: {
                fontSize: 12,
                cellPadding: 6,
                lineColor: [200, 200, 200],
                lineWidth: 0.1,
            },
            columnStyles: {
                0: { fontStyle: "bold", cellWidth: 50, fillColor: [250, 250, 255] },
                1: { fillColor: [255, 255, 255] }
            },
            alternateRowStyles: {
                fillColor: [252, 252, 255]
            },
        });

        // 💰 Enhanced Payment Details with highlighted total
        sectionTitle("Payment Details", doc.lastAutoTable.finalY + 15);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 20,
            body: [
                ["Price/Day", `₹${booking.vehicleID.pricePerDay.$numberDecimal}`],
                ["Price/Hour", `₹${booking.vehicleID.pricePerHour.$numberDecimal}`],
                ["Total Amount", `₹${booking.totalPrice.toFixed(2)}`],
            ],
            theme: "grid",
            styles: {
                fontSize: 12,
                cellPadding: 6,
                lineColor: [200, 200, 200],
                lineWidth: 0.1,
            },
            columnStyles: {
                0: { fontStyle: "bold", cellWidth: 50, fillColor: [250, 250, 255] },
                1: { fillColor: [255, 255, 255] }
            },
            alternateRowStyles: {
                fillColor: [252, 252, 255]
            },
        });

        // ✅ Enhanced Final Total Section with box
        const totalY = doc.lastAutoTable.finalY + 15;
        doc.setFillColor(245, 245, 250);
        doc.roundedRect(60, totalY - 5, 90, 12, 2, 2, 'F');
        doc.setFontSize(16);
        doc.setTextColor(...colors.accent);
        doc.setFont("helvetica", "bold");
        doc.text(`Total Paid: ₹${booking.totalPrice.toFixed(2)}`, 105, totalY + 3, { align: "center" });

        // 📜 Enhanced Footer
        // Add decorative line above footer
        doc.setDrawColor(...colors.primary);
        doc.setLineWidth(0.5);
        doc.line(margin, 270, pageWidth - margin, 270);

        // Footer text with subtle background
        doc.setFillColor(245, 245, 250);
        doc.roundedRect(margin, 275, contentWidth, 15, 2, 2, 'F');

        doc.setFontSize(11);
        doc.setTextColor(...colors.secondary);
        doc.setFont("helvetica", "normal");
        doc.text("Thank you for choosing our service!", 105, 283, { align: "center" });

        // 💾 Save PDF with formatted name
        const formattedDate = new Date().toISOString().split('T')[0];
        doc.save(`booking-receipt-${booking._id}-${formattedDate}.pdf`);
    };


    return (
        <button
            onClick={generateSinglePDF}
            className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mr-2"
        >
            <Printer className="w-4 h-4 mr-1" />
            Print
        </button>
    );
};

export default function History() {
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const navigate = useNavigate();
    const isDrawerOpen = true;

    const { getVehicleHistory, bookingDetails } = useVehicleStore();
    const { authUser } = useAuthStore();

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
            await getVehicleHistory({ userID: authUser._id });
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
        console.log("Booking cancelled:", selectedBooking._id);
        setShowCancelDialog(false);
        await fetchBookingHistory();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Available":
                return "text-green-500";
            case "Booked":
                return "text-blue-500";
            default:
                return "text-red-500";
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <CustomerSideNav />
            <div className={`transition-all duration-300 ${isDrawerOpen ? "lg:pl-[16rem]" : ""} `}>
                <div className="mt-20 p-4">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold flex items-center text-gray-800">
                                    <Car className="w-6 h-6 text-indigo-600 mr-2" />
                                    Booking History
                                </h2>
                                <button
                                    onClick={generateAllBookingsPDF}
                                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download All Bookings
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {loading ? (
                                <div className="flex justify-center items-center p-8">
                                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                                    <span className="text-gray-600 ml-2">Loading your bookings...</span>
                                </div>
                            ) : bookingDetails.length === 0 ? (
                                <div className="text-center py-8">
                                    <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">No booking history found.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Vehicle</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Start Date</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">End Date</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Total Price</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookingDetails.map((booking, index) => (
                                                <tr
                                                    key={booking._id}
                                                    className={`border-t border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                        } hover:bg-gray-100 transition-colors`}
                                                >
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center">
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
                                                                {new Date(booking.startDate).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center">
                                                            <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                                                            <span className="text-gray-600">
                                                                {new Date(booking.endDate).toLocaleDateString()}
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
                                                            {booking.vehicleID?.availabilityStatus === "Available" ? (
                                                                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                                            ) : (
                                                                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                                                            )}
                                                            <span className={getStatusColor(booking.vehicleID?.availabilityStatus)}>
                                                                {booking.vehicleID?.availabilityStatus || "Unknown"}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center space-x-2">
                                                            <BookingPDF booking={booking} />
                                                            <button
                                                                onClick={() => handleCancelBooking(booking)}
                                                                className="flex items-center px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                                            >
                                                                <XSquare className="w-4 h-4 mr-1" />
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

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
                            <button
                                onClick={confirmCancelBooking}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                                Yes, cancel booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}