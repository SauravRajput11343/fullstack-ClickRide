import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import AdminNav from '../../component/AdminNav/AdminNav';
import { AdminSideBar } from '../../component/AdminSideBar/AdminSideBar';
import { useAnalyticStore } from "../../store/useAnalyticStore";
// Utility function to convert month number to month name
const getMonthName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1); // Subtract 1 because months are 0-indexed in JavaScript
  return date.toLocaleString('default', { month: 'long' });
};

export default function AdminAnalyticsPage() {
  

  const isDrawerOpen = true;
  const { isLoading, analyticsData, adminAnalysis } = useAnalyticStore();


  useEffect(() => {
    adminAnalysis(); // Fetch analytics data when the component mounts
  }, []);

  console.log(analyticsData)
  const exportCSV = () => {
    if (!analyticsData) return;

    // Prepare data for CSV
    const csvData = [
      // Summary Data
      { section: "Summary", metric: "Total Revenue", value: analyticsData.totalRevenue },
      { section: "Summary", metric: "Total Bookings", value: analyticsData.bookingStatus.reduce((sum, item) => sum + item.count, 0) },
      { section: "Summary", metric: "Average Duration", value: analyticsData.avgBookingDuration[0].avgDuration },
      { section: "Summary", metric: "Total Users", value: analyticsData.userTrends.reduce((sum, item) => sum + item.count, 0) },

      // Monthly Revenue Data
      ...analyticsData.revenueByMonth.map((item) => ({
        section: "Monthly Revenue",
        month: getMonthName(item._id),
        revenue: item.revenue,
      })),

      // Booking Growth Data
      ...analyticsData.bookingGrowth.map((item) => ({
        section: "Booking Growth",
        month: getMonthName(item._id.month),
        totalBookings: item.totalBookings,
      })),

      // Booking Status Data
      ...analyticsData.bookingStatus.map((item) => ({
        section: "Booking Status",
        status: item._id,
        count: item.count,
      })),

      // User Trends Data
      ...analyticsData.userTrends.map((item) => ({
        section: "User Trends",
        month: getMonthName(item._id),
        count: item.count,
      })),

      // Most Booked Vehicles Data
      ...analyticsData.mostBookedVehicles.map((item) => ({
        section: "Most Booked Vehicles",
        vehicleName: item.vehicleName,
        count: item.count,
      })),

      // Partner Revenue Data
      ...analyticsData.partnerRevenueShare.map((item) => ({
        section: "Partner Revenue",
        partnerName: item.partnerName,
        revenuePercentage: item.revenuePercentage,
      })),

      // Bookings by Location Data
      ...analyticsData.bookingsByLocation.map((item) => ({
        section: "Bookings by Location",
        city: item._id.city,
        count: item.count,
      })),
    ];

    // Convert JSON to CSV
    const headers = Object.keys(csvData[0]).join(",");
    const rows = csvData.map((row) => Object.values(row).join(","));
    const csv = [headers, ...rows].join("\n");

    // Create a Blob and download the CSV file
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "analytics_report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xl font-medium text-gray-700">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center text-red-600 p-8 rounded-lg shadow bg-white">
          <p className="text-xl">Failed to load analytics data. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Brand colors
  const BRAND_PRIMARY = "#1E40AF"; // Deep blue
  const BRAND_SECONDARY = "#14B8A6"; // Teal
  const BRAND_ACCENT = "#F59E0B"; // Amber
  const CHART_COLORS = [BRAND_PRIMARY, BRAND_SECONDARY, BRAND_ACCENT, "#F97316", "#8B5CF6", "#EC4899"];

  // Format currency
  const formatCurrency = (value) => `₹${value.toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <AdminSideBar />
      <div className={`transition-all duration-300 ${isDrawerOpen ? "lg:pl-[16rem]" : ""} pt-20 pb-10`}>
        {/* Export CSV Button */}


        {/* Dashboard Content */}
        <div className="bg-gray-50 min-h-screen">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-6 px-4 sm:px-8 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Analytics Dashboard</h1>
                <p className="text-blue-100 mt-1 text-sm sm:text-base">Business insights for ClickRide</p>
              </div>
              <div>
                <button
                  onClick={exportCSV}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Export CSV
                </button>

              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-blue-600">
                <p className="text-sm text-gray-500 uppercase tracking-wider">Total Revenue</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">{formatCurrency(analyticsData.totalRevenue)}</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-teal-500">
                <p className="text-sm text-gray-500 uppercase tracking-wider">Total Bookings</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">
                  {analyticsData.bookingStatus.reduce((sum, item) => sum + item.count, 0)}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-amber-500">
                <p className="text-sm text-gray-500 uppercase tracking-wider">Average Duration</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">
                  {analyticsData.avgBookingDuration[0].avgDuration} Hours
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-purple-500">
                <p className="text-sm text-gray-500 uppercase tracking-wider">Total Users</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">
                  {analyticsData.userTrends.reduce((sum, item) => sum + item.count, 0)}
                </p>
              </div>
            </div>

            {/* Revenue & Booking Growth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Monthly Revenue</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.revenueByMonth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="_id" tickFormatter={(month) => getMonthName(month)} />
                    <YAxis tickFormatter={(value) => `₹${(value / 1000)}K`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="revenue" fill={BRAND_PRIMARY} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Booking Growth Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.bookingGrowth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="_id.month" tickFormatter={(month) => getMonthName(month)} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="totalBookings" stroke={BRAND_SECONDARY} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Booking Status & User Trends */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Booking Status Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.bookingStatus}
                      dataKey="count"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {analyticsData.bookingStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, name]} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">New User Registrations</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.userTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="_id" tickFormatter={(month) => getMonthName(month)} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={BRAND_ACCENT} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Most Booked Vehicles & Partner Revenue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Top Performing Vehicles</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={analyticsData.mostBookedVehicles.sort((a, b) => b.count - a.count).slice(0, 5)}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="vehicleName" width={150} />
                    <Tooltip />
                    <Bar dataKey="count" fill={CHART_COLORS[3]} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Partner Revenue Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.partnerRevenueShare}
                      dataKey="revenuePercentage"
                      nameKey="partnerName"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {analyticsData.partnerRevenueShare.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bookings by Location */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Popular Rental Locations</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.bookingsByLocation} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="_id.city" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Number of Bookings" fill={BRAND_SECONDARY} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-800 text-center py-4 text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} ClickRide Analytics Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}