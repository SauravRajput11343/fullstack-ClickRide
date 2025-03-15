import React, { useEffect, useState } from "react";
import { useBookStore } from "../../store/useBookStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import Header from "../../component/Header/Header";
import { CustomerSideNav } from "../../component/Customer/CustomerSideNav";
import { Bookmark, BookmarkCheck, Car, Users, Fuel, Clock, Calendar, Star } from "lucide-react";
import { useReviewStore } from "../../store/useReviewStore";

export default function Bookmarks() {
    const { fetchAllBookmarks, bookmarks, setbookmark, unsetbookmark } = useBookStore();
    const { vehicleRating } = useReviewStore();
    const { authUser } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ratings, setRatings] = useState({});
    const isDrawerOpen = true;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                await fetchAllBookmarks({ userId: authUser._id });
            } catch (err) {
                setError("Failed to fetch bookmarks. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, [authUser, fetchAllBookmarks]);

    useEffect(() => {
        const fetchVehicleRatings = async () => {
            const newRatings = {};
            try {
                await Promise.all(
                    bookmarks.map(async (bookmark) => {
                        const vehicleId = bookmark.vehicleId._id;
                        try {
                            const response = await vehicleRating({ vehicleId });
                            newRatings[vehicleId] = {
                                avg: parseFloat(response.avgRating) || 0,
                                total: response.totalReviews || 0
                            };
                        } catch (error) {
                            console.error("Error fetching rating for vehicle:", vehicleId, error);
                            newRatings[vehicleId] = { avg: 0, total: 0 };
                        }
                    })
                );
                setRatings(newRatings);
            } catch (err) {
                console.error("Error fetching vehicle ratings:", err);
            }
        };

        if (bookmarks.length > 0) {
            fetchVehicleRatings();
        }
    }, [bookmarks, vehicleRating]);

    const handleBookmark = async (e, vehicleID, isBookmarked) => {
        e.stopPropagation();
        try {
            const data = {
                vehicleId: vehicleID,
                userId: authUser._id,
            };

            if (isBookmarked) {
                await unsetbookmark(data);
            } else {
                await setbookmark(data);
            }
            await fetchAllBookmarks({ userId: authUser._id });
        } catch (error) {
            console.error("Error handling bookmark:", error);
            setError("Failed to update bookmark. Please try again.");
        }
    };

    const handleCardClick = (vehicleID) => {
        navigate(`/vehicleDetails/${vehicleID}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 p-5">
            <Header />
            <CustomerSideNav />
            <div className={`transition-all duration-300 ${isDrawerOpen ? "lg:pl-64" : ""} pt-20 px-4 sm:px-6 lg:px-8`}>
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg mb-8 p-6 text-white">
                        <div className="flex items-center">
                            <BookmarkCheck className="h-10 w-10 mr-4 text-white" />
                            <div>
                                <h2 className="text-3xl font-bold">Your Bookmarked Vehicles</h2>
                                <p className="text-blue-100 mt-1">Quick access to your favorite vehicles</p>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                <p className="mt-4 text-gray-600 text-center">Loading your favorites...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-md shadow-md">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-red-700 font-medium">{error}</p>
                                    <p className="text-red-500 text-sm mt-1">Please refresh the page or try again later.</p>
                                </div>
                            </div>
                        </div>
                    ) : bookmarks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-80 bg-white rounded-xl shadow-lg p-10 ">
                            <div className="bg-blue-50 p-6 rounded-full mb-6">
                                <Bookmark className="h-16 w-16 text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">No bookmarks yet</h3>
                            <p className="text-gray-500 text-lg text-center mb-8 max-w-md">You haven't bookmarked any vehicles yet. Explore our collection and save your favorites!</p>
                            <button
                                onClick={() => navigate('/ViewVehicle')}
                                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg font-medium"
                            >
                                Browse Vehicles
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-600 mb-6">You have {bookmarks.length} bookmarked {bookmarks.length === 1 ? 'vehicle' : 'vehicles'}.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {bookmarks.map((bookmark, index) => {
                                    const vehicle = bookmark.vehicleId;
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => handleCardClick(vehicle._id)}
                                            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border border-gray-100 cursor-pointer"
                                        >
                                            <div className="relative">
                                                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                                                    <img
                                                        src={vehicle.vehicleImagesId?.VehicleFrontPic}
                                                        alt={`${vehicle.modelID?.vehicleMake} ${vehicle.modelID?.vehicleModel}`}
                                                        className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "https://via.placeholder.com/400x225?text=Vehicle+Image";
                                                        }}
                                                    />
                                                </div>

                                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-blue-600 shadow-lg">
                                                    {vehicle.modelID?.vehicleType}
                                                </div>

                                                <button
                                                    className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors duration-300"
                                                    onClick={(e) => handleBookmark(e, vehicle._id, true)}
                                                >
                                                    <BookmarkCheck className="text-red-500 w-5 h-5" />
                                                </button>

                                                <div className="absolute bottom-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-lg font-semibold shadow-lg flex items-center space-x-1">
                                                    <span>${vehicle.pricePerDay?.$numberDecimal || vehicle.pricePerDay}</span>
                                                    <span className="text-xs text-blue-100">/day</span>
                                                </div>
                                            </div>

                                            <div className="p-5">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                                                        {vehicle.modelID?.vehicleMake} {vehicle.modelID?.vehicleModel}
                                                    </h2>
                                                    <div className="flex items-center bg-yellow-100 px-2 py-1 rounded text-xs font-medium text-yellow-700">
                                                        <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-500" />
                                                        {ratings[vehicle._id]?.avg.toFixed(1)}
                                                        <span className="ml-1 text-yellow-600">
                                                            ({ratings[vehicle._id]?.total} reviews)
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-600 mb-3">
                                                    <div className="flex items-center">
                                                        <Users className="h-4 w-4 mr-2 text-blue-500" />
                                                        {vehicle.vehicleSeat} Seats
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Car className="h-4 w-4 mr-2 text-blue-500" />
                                                        {vehicle.vehicleTransmission}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Fuel className="h-4 w-4 mr-2 text-blue-500" />
                                                        {vehicle.vehicleFuelType}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                                                        ${vehicle.pricePerHour?.$numberDecimal || vehicle.pricePerHour}/hr
                                                    </div>
                                                </div>

                                                <div className="border-t border-gray-100 my-3"></div>

                                                <div
                                                    className={`flex items-center text-sm ${vehicle.availabilityStatus === "Available" ? "text-green-600" : "text-red-600"
                                                        }`}
                                                >
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    <span>{vehicle.availabilityStatus} Now</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}