import React, { useEffect, useState } from 'react';
import CustomerGallery from '../../component/Customer/CustomerGallery';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerNav from '../../component/Header/Header';
import { useVehicleStore } from '../../store/useVehicleStore';
import { Car, Fuel, Settings, Users, DollarSign, Info, Bookmark, Star, Building, Globe, MapPin } from 'lucide-react';
import MapSelector from '../../component/Map/MapSelector';
import Footer from '../../component/Footer/Footer';

export default function VehicleDetails() {
    const [vehicle, setVehicle] = useState(null);
    const { vehicleID } = useParams();
    const { fetchOneVehicleData } = useVehicleStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState("");
    const [newRating, setNewRating] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const vehicleData = await fetchOneVehicleData(vehicleID);
                setVehicle(vehicleData);
            } catch (error) {
                console.error("Error fetching vehicle:", error);
            }
        };

        fetchVehicle();
    }, [vehicleID, fetchOneVehicleData]);

    if (!vehicle) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    const handleSubmitReview = () => {
        if (newReview.trim() !== "") {
            const newReviewData = {
                id: reviews.length + 1,
                reviewText: newReview,
                rating: newRating,
                date: new Date().toLocaleDateString(),
            };
            setReviews([newReviewData, ...reviews]);
            setNewReview("");
            setNewRating(0);
        }
    };

    const handleBooking = () => {
        navigate(`/booking/${vehicleID}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <CustomerNav />

            <div className=" mx-auto px-4 py-8 sm:px-6 lg:px-8 mt-16">
                {/* Hero Section */}
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            {vehicle.modelID.vehicleMake} {vehicle.modelID.vehicleModel}
                        </h1>
                        <p className="text-lg text-gray-600">
                            {vehicle.modelID.vehicleType} • {vehicle.vehicleTransmission} • {vehicle.vehicleFuelType}
                        </p>
                    </div>
                    <button
                        onClick={handleBookmark}
                        className={`p-2 rounded-full ${isBookmarked ? 'bg-blue-100' : 'bg-gray-100'} transition-colors duration-200`}
                    >
                        <Bookmark className={`w-6 h-6 ${isBookmarked ? 'text-blue-600 fill-current' : 'text-gray-600'}`} />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Gallery */}
                    <div className="bg-white  overflow-hidden transition-transform duration-300 ">
                        <CustomerGallery vehicleId={vehicleID} isThumb={true} />
                    </div>

                    {/* Right Column: Vehicle Information */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm text-center transition-transform duration-200 hover:-translate-y-1">
                                <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                                <p className="text-sm text-gray-600">Seats</p>
                                <p className="text-lg font-semibold">{vehicle.vehicleSeat}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm text-center transition-transform duration-200 hover:-translate-y-1">
                                <Fuel className="w-6 h-6 mx-auto mb-2 text-green-600" />
                                <p className="text-sm text-gray-600">Fuel</p>
                                <p className="text-lg font-semibold">{vehicle.vehicleFuelType}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm text-center transition-transform duration-200 hover:-translate-y-1">
                                <Settings className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                                <p className="text-sm text-gray-600">Transmission</p>
                                <p className="text-lg font-semibold">{vehicle.vehicleTransmission}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm text-center transition-transform duration-200 hover:-translate-y-1">
                                <DollarSign className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                                <p className="text-sm text-gray-600">Daily Rate</p>
                                <p className="text-lg font-semibold">₹{vehicle.pricePerDay?.$numberDecimal}</p>
                            </div>
                        </div>

                        {/* Pricing Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6 transition-transform duration-200 hover:shadow-xl">
                            <h2 className="text-2xl font-semibold mb-4">Pricing</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-gray-600">Hourly Rate</p>
                                        <p className="text-sm text-gray-500">Best for short trips</p>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-600">₹{vehicle.pricePerHour?.$numberDecimal}</p>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-gray-600">Daily Rate</p>
                                            <p className="text-sm text-gray-500">Best value for 24h+</p>
                                        </div>
                                        <p className="text-2xl font-bold text-blue-600">₹{vehicle.pricePerDay?.$numberDecimal}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6 transition-transform duration-200 hover:shadow-xl">
                            <h2 className="text-2xl font-semibold mb-4">Location</h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <MapPin className="text-red-600 flex-shrink-0" />
                                    <p className="text-gray-600">{vehicle.vehicleLocationId.vehicleAddress}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building className="text-blue-600 flex-shrink-0" />
                                    <p className="text-gray-600">{vehicle.vehicleLocationId.city}, {vehicle.vehicleLocationId.state}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="text-green-600 flex-shrink-0" />
                                    <p className="text-gray-600">{vehicle.vehicleLocationId.country}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleBooking}
                                className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1">
                                Book Now
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex-1 bg-gray-100 text-gray-800 px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-1">
                                View Terms
                            </button>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 transition-transform duration-200 hover:shadow-xl">
                    <h2 className="text-2xl font-semibold mb-4">Vehicle Location</h2>
                    <div className="h-[400px] rounded-xl overflow-hidden">
                        <MapSelector
                            disableMapMove={true}
                            initialCoordinates={{
                                lat: vehicle.vehicleLocationId.latitude,
                                lng: vehicle.vehicleLocationId.longitude
                            }}
                        />
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                        <span className="font-semibold">Coordinates: </span>
                        <span>Latitude: {vehicle.vehicleLocationId.latitude}, </span>
                        <span>Longitude: {vehicle.vehicleLocationId.longitude}</span>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 transition-transform duration-200 hover:shadow-xl">
                    <h2 className="text-2xl font-semibold mb-6">Reviews & Feedback</h2>

                    {/* Review Input */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-gray-600">Your Rating:</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        onClick={() => setNewRating(star)}
                                        className={`cursor-pointer w-6 h-6 transition-colors duration-200 ${newRating >= star ? 'text-yellow-400' : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <textarea
                            className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            rows="4"
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            placeholder="Share your experience with this vehicle..."
                        />
                        <button
                            onClick={handleSubmitReview}
                            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
                        >
                            Submit Review
                        </button>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6">
                        {reviews.length > 0 ? (
                            reviews.map((feedback, index) => (
                                <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
                                    <div className="flex gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`w-5 h-5 ${feedback.rating >= star ? 'text-yellow-400' : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-600">{feedback.reviewText}</p>
                                    <p className="text-sm text-gray-400 mt-2">{feedback.date}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Terms Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-xl">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Terms and Conditions</h2>
                        <div className="space-y-4 text-gray-600">
                            <p>1. Renters must be over 18 years of age to book the vehicle.</p>
                            <p>2. A valid driver's license is required at the time of booking.</p>
                            <p>3. Insurance coverage is mandatory for all rentals.</p>
                            <p>4. The vehicle must be returned in the same condition it was rented out, with a full tank of gas.</p>
                            <p>5. Late returns will incur additional charges.</p>
                        </div>
                        <button
                            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300"
                            onClick={() => setIsModalOpen(false)}
                        >
                            I Understand
                        </button>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}