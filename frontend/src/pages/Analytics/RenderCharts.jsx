import { Bar, Pie, Line } from "react-chartjs-2";

const BookingChart = ({ data }) => {
  const chartData = {
    labels: data.bookingsOverTime.map((item) => item.date),
    datasets: [
      {
        label: "Bookings",
        data: data.bookingsOverTime.map((item) => item.count),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} />;
};

const RevenueChart = ({ data }) => {
  const chartData = {
    labels: data.revenueOverTime.map((item) => item.date),
    datasets: [
      {
        label: "Revenue",
        data: data.revenueOverTime.map((item) => item.amount),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  return <Line data={chartData} />;
};

const VehicleChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data.vehiclesByStatus),
    datasets: [
      {
        label: "Vehicles",
        data: Object.values(data.vehiclesByStatus),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return <Pie data={chartData} />;
};