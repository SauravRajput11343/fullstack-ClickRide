import React, { useEffect } from "react";
import { useVehicleStore } from "../../store/useVehicleStore";
import { useAuthStore } from "../../store/useAuthStore";
import Table from "../../component/ui/Table";
import toast from "react-hot-toast";

export default function VehicleAnalytics() {
    const { authUser, checkAuth, isCheckingAuth, UserRole } = useAuthStore();
    const { 
        getBookingAnalytics, 
        exportAnalyticsReport, 
        totalBookings, 
        utilizationStats, 
        ownVehicleStats,
        statusStats // Add statusStats from the store
    } = useVehicleStore();

    // Fetch analytics data when component mounts or auth changes
    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (authUser && UserRole) {
            getBookingAnalytics({ userId: authUser._id, role: UserRole });
        }
    }, [authUser, UserRole]);

    // Transform data for table display
    const transformUtilizationData = (data) => {
        return data?.map(item => ({
            Model: item.model,
            'Utilization (%)': item.utilization,
            'Total Bookings': item.totalBookings,
            Revenue: `$${item.totalRevenue?.toFixed(2) || 0}`
        })) || [];
    };

    const transformStatusData = (stats) => {
        return stats?.map(stat => ({
            Status: stat.status,
            Count: stat.count,
            Revenue: `$${stat.totalRevenue?.toFixed(2) || 0}`
        })) || [];
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">📊 Booking Analytics</h1>

            {isCheckingAuth ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-lg">
                            Total Bookings: <strong>{totalBookings || 0}</strong>
                        </p>
                        <button
                            onClick={exportAnalyticsReport}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            📥 Export Report
                        </button>
                    </div>

                    {/* Status Statistics */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">📈 Booking Status Distribution</h2>
                        <Table 
                            data={transformStatusData(statusStats)} 
                            columns={["Status", "Count", "Revenue"]} 
                        />
                    </div>

                    {/* Vehicle Utilization */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">🚗 Vehicle Utilization</h2>
                        <Table 
                            data={transformUtilizationData(utilizationStats)} 
                            columns={["Model", "Utilization (%)", "Total Bookings", "Revenue"]} 
                        />
                    </div>

                    {/* Admin's Own Vehicle Stats */}
                    {UserRole === "admin" && ownVehicleStats?.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">🔹 Your Vehicles</h2>
                            <Table 
                                data={transformUtilizationData(ownVehicleStats)} 
                                columns={["Model", "Utilization (%)", "Total Bookings", "Revenue"]} 
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}