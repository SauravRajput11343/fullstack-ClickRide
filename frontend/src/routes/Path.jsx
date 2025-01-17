import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Signup from '../pages/Signup/Signup';
import Login from '../pages/Login/Login';
import { useAuthStore } from '../store/useAuthStore';
import Pricing from '../pages/Pricing/Pricing';
import Career from '../pages/Career/Career';
import AboutUs from '../pages/About/AboutUs';
import PartnerSignup from '../pages/Signup/PartnerSignup';
import CustomerNav from '../component/CustomerNav/customerNav';
import Profile from '../component/Profile/Profile';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import UserDashboard from '../pages/Admin/UserDashboard/UserDashboard';
import VehicleDashboard from '../pages/Vehicle/VehicleDashboard';
import AddVehicle from '../pages/Vehicle/AddVehicle';
import ManageVehicle from '../pages/Vehicle/manageVehicle';
import VehicleModel from '../pages/Vehicle/VehicleModel';
import ManageModel from '../pages/Vehicle/ManageModel';
import DeleteModel from '../pages/Vehicle/DeleteModel';
import PartnerRequest from '../pages/Partner/PartnerRequest';
import ManagePartner from '../pages/Partner/ManagePartner';



export default function Path() {

  const { authUser, checkAuth, isCheckingAuth, UserRole } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/PartnerSignup" element={<PartnerSignup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Pricing" element={<Pricing />} />
          <Route path="/Career" element={<Career />} />
          <Route path="/About" element={<AboutUs />} />


          <Route path="/Customer" element={authUser ? <CustomerNav /> : <Navigate to="/Login" />} />
          <Route path="/Profile" element={authUser ? <Profile /> : <Navigate to="/Login" />} />




          <Route path="/Admin" element={authUser && UserRole === "Admin" ? <AdminDashboard /> : <Navigate to="/Login" />} />
          <Route path="/UserDashboard" element={authUser && UserRole === "Admin" ? <UserDashboard /> : <Navigate to="/Login" />} />
          <Route path="/VehicleDashboard" element={authUser && UserRole === "Admin" ? <VehicleDashboard /> : <Navigate to="/Login" />} />
          <Route path="/AddVehicle" element={authUser && UserRole === "Admin" ? <AddVehicle /> : <Navigate to="/Login" />} />
          <Route path="/Partner" element={authUser && UserRole === "Admin" ? <PartnerRequest /> : <Navigate to="/Login" />} />
          <Route path="/ManagePartner/:PartnerId" element={authUser && UserRole === "Admin" ? <ManagePartner /> : <Navigate to="/Login" />} />


          <Route path="/VehicleManage/:vehicleId" element={authUser ? <ManageVehicle /> : <Navigate to="/Login" />} />
          <Route path="/VehicleModel/:modelId" element={authUser ? <VehicleModel /> : <Navigate to="/Login" />} />
          <Route path="/ManageModel" element={authUser ? <ManageModel /> : <Navigate to="/Login" />} />
          <Route path="/ManageModel/:ModelId" element={authUser ? <DeleteModel /> : <Navigate to="/Login" />} />




        </Routes>
      </BrowserRouter>
    </div>
  );
}
