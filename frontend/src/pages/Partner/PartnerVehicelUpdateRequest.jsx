import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useVehicleStore } from "../../store/useVehicleStore";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

export default function PartnerVehicleUpdateRequest() {
    const navigate = useNavigate();
    const { authUser, UserRole, checkAuth } = useAuthStore();
    const {
        fetchVehicleUpdateRequestData,
        totalUpdateResponce,
        fetchVehicleData,
        DeleteRequest,
        isDeleteingRequest,
    } = useVehicleStore();

    const [profileData, setProfileData] = useState({
        userId: authUser?._id || "",
    });

    const [selectedMessage, setSelectedMessage] = useState("");
    const [selectedVehiclePic, setSelectedVehiclePic] = useState("");
    const [selectedRegNum, setSelectedRegNum] = useState("");
    const [selectedRequestedBy, setSelectedRequestedBy] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedRequestID, setSelectedRequestId] = useState("");


    const [isModalOpen, setIsModalOpen] = useState(false);




    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (authUser) {
            setProfileData({
                userId: authUser?._id || "",
            });
        }
    }, [authUser]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchVehicleUpdateRequestData();
                await fetchVehicleData();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [UserRole, fetchVehicleUpdateRequestData, fetchVehicleData]);

    // **Filter requests dynamically based on role**
    const myRequest = (Array.isArray(totalUpdateResponce) ? totalUpdateResponce : []).filter((request) => {
        if (UserRole === "Admin") {
            return request.status === "pending" || request.status === "review" || request.status === "approve";
        } else if (UserRole === "Partner") {
            return (
                (request.status === "pending" || request.status === "review" || request.status === "approve") &&
                request.vehicleId.owner === profileData.userId
            );
        }
        return false;
    });

    // **Categorize Requests**
    const pendingRequests = myRequest.filter(request => request.status === "pending");
    const reviewRequests = myRequest.filter(request => request.status === "review");
    const solvedRequests = myRequest.filter(request => request.status === "approve")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // **Open Modal Function**
    const openModal = (message, vehiclePic, regNum, requestedBy, role, status, requestId) => {
        setSelectedMessage(message);
        setSelectedVehiclePic(vehiclePic);
        setSelectedRegNum(regNum);
        setSelectedRequestedBy(requestedBy);
        setSelectedRole(role);
        setSelectedStatus(status);
        setSelectedRequestId(requestId);
        setSelectedUser(UserRole);
        setIsModalOpen(true);
    };

    // **Close Modal Function**
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMessage("");
        setSelectedVehiclePic("");
        setSelectedRegNum("");
        setSelectedRequestedBy("");
        setSelectedRole("");
        setSelectedStatus("");
        setSelectedUser("");
    };

    const handleDelete = async () => {
        try {
            if (!selectedRequestID) {
                toast.error("Invalid request ID.");
                return;
            }

            const data = {
                requestID: selectedRequestID
            }
            const deleteResponse = await DeleteRequest(data);
            if (deleteResponse?.success) {
                await fetchVehicleUpdateRequestData();
                await fetchVehicleData();
            }
            closeModal();
            navigate("/PartnerVehicleUpdateRequest");
        } catch (error) {
            console.error("Error deleting request:", error);
            toast.error("Error deleting request.");
            closeModal();
            navigate("/PartnerVehicleUpdateRequest");

        }
    };
    // **Request Card Component**
    const RequestCard = ({ request }) => (
        <div
            role="button"
            onClick={() => {
                // Check if the user role is 'Partner' and the conditions for 'Partner' are met
                if (UserRole === "Partner" && request.requestType === "Update" && request.status !== "review" && request.status !== "approve") {
                    navigate(`/VehicleManage/${request.vehicleId._id}`, {
                        state: { requestId: request._id },
                    });
                }
                else if (UserRole === "Admin" && request.status !== "approve") {
                    navigate(`/VehicleManage/${request.vehicleId._id}`, {
                        state: {
                            requestId: request._id,
                            requestStatus: request.status,
                        },
                    });
                }

            }}
            className="flex items-center space-x-4 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4"
        >
            {/* Vehicle Image */}
            <div className="w-16 h-16 grid place-items-center bg-gray-200 rounded-md overflow-hidden">
                <img
                    alt={`Model: ${request.vehicleId.vehicleRegNumber}`}
                    src={request.vehicleId.vehicleImagesId.VehicleFrontPic || "/default.jpg"}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Requested At (with PM time) */}
            <div className="text-sm text-gray-600 flex-1">
                <div className="font-semibold">Requested At:</div>
                <div>
                    {new Date(request.createdAt).toLocaleDateString()}{" "}
                    {new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </div>
            </div>

            {/* View Message Button */}
            <div>
                <button
                    className="text-blue-600 underline hover:text-black"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevents parent from handling the click
                        openModal(
                            request.requestMessage,
                            request.vehicleId.vehicleImagesId.VehicleFrontPic,
                            request.vehicleId.vehicleRegNumber,
                            request.requestedBy.email,
                            request.requestedBy.roleId.roleName,
                            request.status,
                            request._id,

                        );
                    }}
                >
                    View Request
                </button>
            </div>
        </div>
    );

    return (
        <div className="overflow-x-hidden">
            <div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-1 gap-3 p-5">
                {/* **Count Overview Cards** */}
                <div className="bg-white h-[60px] flex items-center justify-center rounded-xl shadow-md lg:col-span-2 md:col-span-2 sm:col-span-1 px-4 text-center">
                    <h1 className="text-blue-gray text-lg font-semibold">
                        Pending Requests: <span className="font-bold">{pendingRequests.length || 0}</span>
                    </h1>
                </div>
                <div className="bg-white h-[60px] flex items-center justify-center rounded-xl shadow-md lg:col-span-2 md:col-span-1 sm:col-span-1 px-4 text-center">
                    <h1 className="text-blue-gray text-lg font-semibold">
                        Pending Approval: <span className="font-bold">{reviewRequests.length || 0}</span>
                    </h1>
                </div>
                <div className="bg-white h-[60px] flex items-center justify-center rounded-xl shadow-md lg:col-span-2 md:col-span-1 sm:col-span-1 px-4 text-center">
                    <h1 className="text-blue-gray text-lg font-semibold">
                        Solved Requests: <span className="font-bold">{solvedRequests.length || 0}</span>
                    </h1>
                </div>
                {/* **Requests Columns** */}
                {[
                    { title: "Pending Requests", data: pendingRequests },
                    { title: "Pending Approval", data: reviewRequests },
                    { title: "Solved Requests", data: solvedRequests },
                ].map((section, index) => (
                    <div
                        key={index}
                        className="bg-white lg:col-span-2 md:col-span-1 sm:col-span-1 rounded-xl shadow-2xl overflow-y-auto scrollbar-hide"
                        style={{ maxHeight: '600px' }} // Max height 600px
                    >
                        <div className="sticky top-0 z-10 bg-white p-3">
                            <h3 className="text-xl font-semibold">{section.title}</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4 p-5">
                            {section.data.length > 0 ? (
                                section.data.map((request) => <RequestCard key={request._id} request={request} />)
                            ) : (
                                <p className="col-span-5 text-center text-gray-600">No {section.title}.</p>
                            )}
                        </div>
                    </div>
                ))}

            </div>

            {/* **Modal Component** */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300" onClick={closeModal}>
                    <div className="bg-white rounded-lg  p-4 max-w-md w-full transition-all duration-300 scale-95 opacity-100" onClick={(e) => e.stopPropagation()}>

                        {/* Request Details Section with Card Layout */}
                        <div className="relative flex flex-col rounded-lg border  bg-white  transition-all duration-300 p-4">

                            {/* Vehicle Image */}
                            <div className="w-auto h-auto grid place-items-center bg-gray-200 rounded-md overflow-hidden">
                                <img
                                    alt={`Vehicle: ${selectedRegNum}`}
                                    src={selectedVehiclePic || "/default.jpg"}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Vehicle Details */}
                            <div className="mt-3">
                                <div className="grid grid-cols-2 gap-y-2 mt-2 text-sm text-gray-600">
                                    <div className="font-semibold">Reg Number:</div>
                                    <div>{selectedRegNum || "Not Available"}</div>

                                    <div className="font-semibold">Requested By:</div>
                                    <div>{selectedRequestedBy || "Not Available"}</div>

                                    <div className="font-semibold">Role:</div>
                                    <div>{selectedRole || "Not Available"}</div>

                                    <div className="font-semibold">Request Message:</div>
                                    <div><b>{selectedMessage || "no Message"}</b></div>


                                </div>
                            </div>
                            {/* Action Buttons */}
                            <div className="grid grid-cols-auto gap-y-2 mt-2">
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>

                            {/* Show Delete Request button only if user is admin and status is 'pending' or 'review' */}
                            {UserRole === "Admin" && (selectedStatus === "pending" || selectedStatus === "review") && (
                                <div className="grid grid-cols-auto gap-y-2 mt-2">
                                    {isDeleteingRequest ? (
                                        <div className="flex items-center justify-center">
                                            <Loader className="size-10 animate-spin" />
                                        </div>
                                    ) : (
                                        <button
                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition"
                                            onClick={handleDelete}
                                        >
                                            Delete Request
                                        </button>
                                    )}
                                </div>
                            )}

                        </div>


                    </div>
                </div>
            )}

        </div>
    );
}
