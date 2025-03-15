import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { useAuthStore } from '../../store/useAuthStore';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AnalyticsDashboard = () => {
  // Get authentication details from your auth store
  const { authUser, checkAuth, isCheckingAuth, UserRole } = useAuthStore();
  const role = UserRole;

  // Local state for toggling between "global" and "personal" view (admin only)
  const [selectedView, setSelectedView] = useState('global');
  const [analytics, setAnalytics] = useState(null);

  // Run checkAuth once on mount to load auth info
  useEffect(() => {
    checkAuth();
  }, []);

  // Function to fetch analytics data from the backend
  const fetchAnalytics = async () => {
    if (!authUser?._id || !role) return;
    try {
      const response = await axios.post('http://localhost:5001/api/analytics', {
        userId: authUser._id,
        role: role,
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  // Trigger analytics fetch when authUser and role are ready (only once)
  useEffect(() => {
    if (authUser && role && !analytics) {
      fetchAnalytics();
    }
  }, [authUser, role, analytics]);

  if (isCheckingAuth || !authUser || !analytics) {
    return <div className="p-6 text-center text-lg">Loading analytics...</div>;
  }

  // Use optional chaining with fallback default arrays to avoid undefined errors
  const bookingStatusStats = analytics.bookingStatusStats || [];
  const allVehicles = analytics.utilizationStats?.allVehicles || [];
  const adminVehicles = analytics.utilizationStats?.adminVehicles || [];
  const partnerVehicles = analytics.utilizationStats?.partnerVehicles || [];

  // ------------------------------
  // Global Summary Metrics
  // ------------------------------
  const globalTotalBookings = bookingStatusStats.reduce((acc, item) => acc + item.count, 0);
  const globalTotalRevenue = bookingStatusStats.reduce((acc, item) => acc + item.totalRevenue, 0);
  const globalAverageUtilization =
    allVehicles.length > 0
      ? (allVehicles.reduce((acc, vehicle) => acc + Number(vehicle.utilization), 0) / allVehicles.length).toFixed(2)
      : '0';

  // ------------------------------
  // Global Booking Charts
  // ------------------------------
  const globalBookingStatusLabels = bookingStatusStats.map((item) => item.status);
  const globalBookingStatusCounts = bookingStatusStats.map((item) => item.count);
  const globalBookingStatusData = {
    labels: globalBookingStatusLabels,
    datasets: [
      {
        label: 'Booking Count',
        data: globalBookingStatusCounts,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const globalBookingRevenueData = {
    labels: globalBookingStatusLabels,
    datasets: [
      {
        label: 'Revenue by Status',
        data: bookingStatusStats.map((item) => item.totalRevenue),
        backgroundColor: ['#4BC0C0', '#FF6384', '#FFCE56', '#36A2EB'],
      },
    ],
  };

  // Global Vehicle Utilization
  const globalVehiclesLabels = allVehicles.map((v) => v.model);
  const globalVehiclesUtilization = allVehicles.map((v) => v.utilization);
  const globalVehiclesData = {
    labels: globalVehiclesLabels,
    datasets: [
      {
        label: 'Utilization % (All Vehicles)',
        data: globalVehiclesUtilization,
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  };

  // ------------------------------
  // Personal (Admin Only) Summary Metrics
  // ------------------------------
  // Assumes that the backend returns ownBookingStats for admin.
  const personalTotalBookings = analytics.ownBookingStats
    ? analytics.ownBookingStats.reduce((acc, item) => acc + item.count, 0)
    : 0;
  const personalTotalRevenue = analytics.ownBookingStats
    ? analytics.ownBookingStats.reduce((acc, item) => acc + item.totalRevenue, 0)
    : 0;
  const personalAverageUtilization =
    adminVehicles.length > 0
      ? (adminVehicles.reduce((acc, vehicle) => acc + Number(vehicle.utilization), 0) / adminVehicles.length).toFixed(2)
      : '0';

  // Personal Booking Charts (if ownBookingStats exists)
  const personalBookingStatusData = analytics.ownBookingStats
    ? {
        labels: analytics.ownBookingStats.map((item) => item.status),
        datasets: [
          {
            label: 'Booking Count (Personal)',
            data: analytics.ownBookingStats.map((item) => item.count),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          },
        ],
      }
    : null;

  const personalBookingRevenueData = analytics.ownBookingStats
    ? {
        labels: analytics.ownBookingStats.map((item) => item.status),
        datasets: [
          {
            label: 'Revenue by Status (Personal)',
            data: analytics.ownBookingStats.map((item) => item.totalRevenue),
            backgroundColor: ['#4BC0C0', '#FF6384', '#FFCE56', '#36A2EB'],
          },
        ],
      }
    : null;

  // Personal Vehicle Utilization (admin vehicles only)
  const personalVehiclesLabels = adminVehicles.map((v) => v.model);
  const personalVehiclesUtilization = adminVehicles.map((v) => v.utilization);
  const personalVehiclesData = {
    labels: personalVehiclesLabels,
    datasets: [
      {
        label: 'Utilization % (Admin Vehicles)',
        data: personalVehiclesUtilization,
        backgroundColor: 'rgba(153,102,255,0.6)',
      },
    ],
  };

  // ------------------------------
  // Render Section Based on Role and Selected View
  // ------------------------------
  const renderGlobalView = () => (
    <>
      {/* Global Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow rounded p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Total Bookings</h3>
          <p className="text-2xl">{globalTotalBookings}</p>
        </div>
        <div className="bg-white shadow rounded p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Total Revenue</h3>
          <p className="text-2xl">${globalTotalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white shadow rounded p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Avg. Utilization</h3>
          <p className="text-2xl">{globalAverageUtilization}%</p>
        </div>
      </div>

      {/* Global Booking Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white shadow rounded p-4">
          <h3 className="text-2xl font-semibold mb-4 text-center">Booking Status</h3>
          <div className="h-80">
            <Pie data={globalBookingStatusData} />
          </div>
        </div>
        <div className="bg-white shadow rounded p-4" style={{ height: '400px' }}>
          <h3 className="text-2xl font-semibold mb-4 text-center">Revenue by Booking Status</h3>
          <Bar data={globalBookingRevenueData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Global Vehicle Utilization */}
      <div className="bg-white shadow rounded p-4 mb-10" style={{ height: '400px' }}>
        <h3 className="text-2xl font-semibold mb-4 text-center">Vehicle Utilization (All Vehicles)</h3>
        <Bar data={globalVehiclesData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </>
  );

  const renderPersonalView = () => (
    <>
      {/* Personal Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow rounded p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Your Bookings</h3>
          <p className="text-2xl">{personalTotalBookings}</p>
        </div>
        <div className="bg-white shadow rounded p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Your Revenue</h3>
          <p className="text-2xl">${personalTotalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white shadow rounded p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">Your Avg. Utilization</h3>
          <p className="text-2xl">{personalAverageUtilization}%</p>
        </div>
      </div>

      {personalBookingStatusData && personalBookingRevenueData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-2xl font-semibold mb-4 text-center">Your Booking Status</h3>
            <div className="h-80">
              <Pie data={personalBookingStatusData} />
            </div>
          </div>
          <div className="bg-white shadow rounded p-4" style={{ height: '400px' }}>
            <h3 className="text-2xl font-semibold mb-4 text-center">Your Revenue by Booking Status</h3>
            <Bar data={personalBookingRevenueData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded p-4 mb-10" style={{ height: '400px' }}>
        <h3 className="text-2xl font-semibold mb-4 text-center">Your Vehicle Utilization</h3>
        <Bar data={personalVehiclesData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </>
  );

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Booking Analytics Dashboard</h2>

      {role === 'admin' && (
        <div className="flex justify-center mb-8">
          <div className="inline-flex shadow rounded overflow-hidden">
            <button
              onClick={() => setSelectedView('global')}
              className={
                selectedView === 'global'
                  ? "px-4 py-2 bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                  : "px-4 py-2 bg-gray-200 hover:bg-blue-500 transition-colors"
              }
            >
              Global
            </button>
            <button
              onClick={() => setSelectedView('personal')}
              className={
                selectedView === 'personal'
                  ? "px-4 py-2 bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                  : "px-4 py-2 bg-gray-200 hover:bg-blue-500 transition-colors"
              }
            >
              Personal
            </button>
          </div>
        </div>
      )}

      <div className="space-y-10">
        {role === 'admin'
          ? selectedView === 'global'
            ? renderGlobalView()
            : renderPersonalView()
          : renderGlobalView()}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
