import React, { useEffect } from "react";
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
import AdminNav from "../../component/AdminNav/AdminNav";
import { useAnalyticStore } from "../../store/useAnalyticStore";
import { PartnerSideBar } from "../../component/PartnerSideBar/PartnerSideBar";

const ChartContainer = ({ title, children, className = "" }) => (
  <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
    <h2 className="text-lg font-semibold mb-3 text-gray-800">{title}</h2>
    <div className="w-full h-[300px] min-w-[280px]">
      {children}
    </div>
  </div>
);

const SummaryCard = ({ label, value, borderColor }) => (
  <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${borderColor}`}>
    <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider truncate">{label}</p>
    <p className="text-lg sm:text-xl font-bold text-gray-800 mt-1 truncate">
      {value}
    </p>
  </div>
);

export default function PartnerAnalyticsPage() {
    const isDrawerOpen = true;
    const { isLoading, analyticsData, partneranalysis } = useAnalyticStore();

    useEffect(() => {
        partneranalysis();
    }, []);

    const formatCurrency = (value) => `₹${value?.toLocaleString("en-IN")}`;

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

    const CHART_COLORS = ['#1E40AF', '#14B8A6', '#F59E0B', '#F97316', '#8B5CF6', '#EC4899'];

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
            <AdminNav />
            <PartnerSideBar />
            <div className={`transition-all duration-300 ${isDrawerOpen ? "lg:pl-[16rem]" : ""} pt-16`}>
                <div className="bg-gray-50 min-h-screen">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-4 px-4 sm:py-6 sm:px-8 shadow-lg">
                        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl sm:text-2xl font-bold truncate">Partner Analytics Dashboard</h1>
                                <p className="text-blue-100 mt-1 text-sm">Performance insights for your vehicles</p>
                            </div>
                        </div>
                    </div>

                    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                            <SummaryCard
                                label="Total Revenue"
                                value={formatCurrency(analyticsData?.summary?.totalRevenue || 0)}
                                borderColor="border-blue-600"
                            />
                            <SummaryCard
                                label="Total Bookings"
                                value={analyticsData?.summary?.totalBookings || 0}
                                borderColor="border-teal-500"
                            />
                            <SummaryCard
                                label="Cancellation Rate"
                                value={`${analyticsData?.summary?.cancellationRate?.toFixed(1) || 0}%`}
                                borderColor="border-amber-500"
                            />
                            <SummaryCard
                                label="Average Rating"
                                value={`${analyticsData?.summary?.averageRating?.toFixed(1) || 0}/5`}
                                borderColor="border-purple-500"
                            />
                        </div>

                        {/* Charts Grid */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ChartContainer title="Most Booked Vehicles">
                                    <ResponsiveContainer>
                                        <BarChart
                                            data={analyticsData?.vehicles?.mostBookedVehicles}
                                            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis 
                                                dataKey="vehicleRegNumber" 
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis width={80} />
                                            <Tooltip />
                                            <Bar 
                                                dataKey="count" 
                                                fill="#1E40AF" 
                                                radius={[4, 4, 0, 0]} 
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>

                                <ChartContainer title="Top Earning Vehicles">
                                    <ResponsiveContainer>
                                        <BarChart
                                            data={analyticsData?.vehicles?.topEarningVehicles}
                                            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis 
                                                dataKey="vehicleRegNumber" 
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis width={80} />
                                            <Tooltip formatter={formatCurrency} />
                                            <Bar 
                                                dataKey="totalRevenue" 
                                                fill="#14B8A6" 
                                                radius={[4, 4, 0, 0]} 
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ChartContainer title="Booking Trends">
                                    <ResponsiveContainer>
                                        <LineChart
                                            data={analyticsData?.trends?.bookingTrends}
                                            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis 
                                                dataKey="_id" 
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis width={40} />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="count"
                                                stroke="#F59E0B"
                                                strokeWidth={2}
                                                dot={{ r: 2 }}
                                                activeDot={{ r: 4 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </ChartContainer>

                                <ChartContainer title="Revenue Trends">
                                    <ResponsiveContainer>
                                        <LineChart
                                            data={analyticsData?.trends?.revenueByMonth}
                                            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis 
                                                dataKey="_id" 
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis width={40} />
                                            <Tooltip formatter={formatCurrency} />
                                            <Line
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#F97316"
                                                strokeWidth={2}
                                                dot={{ r: 2 }}
                                                activeDot={{ r: 4 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </div>

                            <ChartContainer title="Booking Status Distribution">
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={analyticsData?.demographics?.bookingStatus}
                                            dataKey="count"
                                            nameKey="_id"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={120}
                                            label
                                        >
                                            {analyticsData?.demographics?.bookingStatus?.map((_, index) => (
                                                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend 
                                            wrapperStyle={{ fontSize: '12px' }}
                                            layout="vertical"
                                            verticalAlign="middle"
                                            align="right"
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                    </div>

                    <div className="bg-gray-800 text-center py-3 text-gray-400 text-sm mt-6">
                        <p>© {new Date().getFullYear()} ClickRide Analytics Dashboard</p>
                    </div>
                </div>
            </div>
        </div>
    );
}