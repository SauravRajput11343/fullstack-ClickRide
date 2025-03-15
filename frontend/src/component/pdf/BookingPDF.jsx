import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function BookingPDF({ booking }) {
    const generateSinglePDF = () => {
        const doc = new jsPDF();

        // 🎨 Define color scheme
        const colors = {
            primary: [66, 88, 255], // Blue
            secondary: [100, 100, 100], // Gray
            accent: [255, 69, 0], // Red-Orange
            background: [240, 240, 240], // Light Gray
        };

        // 📏 Define common measurements
        const margin = 20;
        const pageWidth = doc.internal.pageSize.width;
        const contentWidth = pageWidth - 2 * margin;

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
        doc.roundedRect(margin, 30, 170, 18, 3, 3, "FD");

        doc.setFontSize(12);
        doc.setTextColor(...colors.secondary);
        doc.text(`Booking Reference: ${booking._id}`, 25, 38);
        doc.text(`Date: ${new Date(booking.createdAt).toLocaleDateString()}`, 25, 44);

        // 🛑 Enhanced Section Title Style
        const sectionTitle = (title, yPosition) => {
            doc.setFillColor(...colors.background);
            doc.roundedRect(margin, yPosition - 7, contentWidth, 12, 2, 2, "F");

            doc.setDrawColor(...colors.primary);
            doc.setLineWidth(1);
            doc.line(margin, yPosition - 7, margin, yPosition + 5);

            doc.setFontSize(14);
            doc.setTextColor(...colors.primary);
            doc.setFont("helvetica", "bold");
            doc.text(title, 25, yPosition);
        };

        // 📌 Customer Details
        sectionTitle("Customer Details", 60);
        doc.autoTable({
            startY: 65,
            body: [
                ["Name", `${booking.userID.firstName} ${booking.userID.lastName}`],
                ["Email", booking.userID.email],
                ["Mobile", booking.userID.mobile],
            ],
            theme: "grid",
            styles: { fontSize: 12, cellPadding: 6, lineColor: [200, 200, 200], lineWidth: 0.1 },
            columnStyles: { 0: { fontStyle: "bold", cellWidth: 50, fillColor: [250, 250, 255] } },
            alternateRowStyles: { fillColor: [252, 252, 255] },
        });

        // 🚗 Vehicle Details
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
            styles: { fontSize: 12, cellPadding: 6, lineColor: [200, 200, 200], lineWidth: 0.1 },
            columnStyles: { 0: { fontStyle: "bold", cellWidth: 50, fillColor: [250, 250, 255] } },
            alternateRowStyles: { fillColor: [252, 252, 255] },
        });

        // 📅 Booking Details
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
            styles: { fontSize: 12, cellPadding: 6, lineColor: [200, 200, 200], lineWidth: 0.1 },
            columnStyles: { 0: { fontStyle: "bold", cellWidth: 50, fillColor: [250, 250, 255] } },
            alternateRowStyles: { fillColor: [252, 252, 255] },
        });

        // 💰 Payment Details
        sectionTitle("Payment Details", doc.lastAutoTable.finalY + 15);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 20,
            body: [
                ["Price/Day", `₹${booking.vehicleID.pricePerDay.$numberDecimal}`],
                ["Price/Hour", `₹${booking.vehicleID.pricePerHour.$numberDecimal}`],
                ["Total Amount", `₹${booking.totalPrice.toFixed(2)}`],
            ],
            theme: "grid",
            styles: { fontSize: 12, cellPadding: 6, lineColor: [200, 200, 200], lineWidth: 0.1 },
            columnStyles: { 0: { fontStyle: "bold", cellWidth: 50, fillColor: [250, 250, 255] } },
            alternateRowStyles: { fillColor: [252, 252, 255] },
        });

        // ✅ Total Paid Section
        const totalY = doc.lastAutoTable.finalY + 15;
        doc.setFillColor(245, 245, 250);
        doc.roundedRect(60, totalY - 5, 90, 12, 2, 2, "F");
        doc.setFontSize(16);
        doc.setTextColor(...colors.accent);
        doc.setFont("helvetica", "bold");
        doc.text(`Total Paid: ₹${booking.totalPrice.toFixed(2)}`, 105, totalY + 3, { align: "center" });

        // 📜 Footer
        doc.setDrawColor(...colors.primary);
        doc.setLineWidth(0.5);
        doc.line(margin, 270, pageWidth - margin, 270);

        doc.setFillColor(245, 245, 250);
        doc.roundedRect(margin, 275, contentWidth, 15, 2, 2, "F");

        doc.setFontSize(11);
        doc.setTextColor(...colors.secondary);
        doc.setFont("helvetica", "normal");
        doc.text("Thank you for choosing our service!", 105, 283, { align: "center" });

        // 💾 Save PDF
        const formattedDate = new Date().toISOString().split("T")[0];
        doc.save(`booking-receipt-${booking._id}-${formattedDate}.pdf`);
    };

    return <button
        onClick={generateSinglePDF}
        className="flex items-center px-3 py-1 rounded-md transition-colors 
               text-white bg-blue-500 hover:bg-blue-600 
               disabled:opacity-50 disabled:cursor-not-allowed"
    >
        Receipt
    </button>
}
