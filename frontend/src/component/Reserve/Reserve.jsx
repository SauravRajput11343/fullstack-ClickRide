import Route from "../../assets/img/route-icon.jpg";
import Deal from "../../assets/img/deal-icon.jpg";
import Rent from "../../assets/img/reserve-car-icon.png";

const features = [
    {
        name: 'Choose Your Pickup Location.',
        icon: Route,
        description: 'Select the most convenient location for your car pickup, making your journey smoother and hassle-free.',
    },
    {
        name: 'Select the Best Deal',
        icon: Deal,
        description: 'Browse through a range of competitive deals and pick the one that suits your budget and preferences.',
    },
    {
        name: 'Reserve Your Rental Cars.',
        icon: Rent,
        description: 'Easily reserve your car online, ensuring availability and a smooth experience on your trip.',
    },
];

export default function Example() {
    return (
        <div style={{ backgroundColor: "#FFE5B4" }}>
            <div className="mx-auto w-full md:w-4/5 lg:w-3/5 shadow-2xl rounded-xl relative z-40 -top-14 pb-20 bg-gradient-to-r from-red-200 to-orange-300">
                <p className="px-20 py-4 text-pretty text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 text-center">
                    Better Way to Rent Your Perfect Cars
                </p>

                <dl className="mt-10 space-y-8 text-gray-600">
                    {features.map((feature, index) => (
                        <div
                            key={feature.name}
                            className={`relative flex items-center space-x-6 p-2 ${index > 0 ? 'mt-6' : ''} hover:scale-105 transition-transform duration-300`} // Add hover effect to scale up
                        >
                            <img
                                src={feature.icon}
                                alt={feature.name}
                                className="w-12 h-12 sm:w-20 sm:h-20 lg:w-20 lg:h-20 rounded-full border-none shadow-lg transform transition-all duration-300 hover:scale-110"
                            />
                            <div>
                                <dt className="font-semibold text-lg sm:text-xl lg:text-2xl text-gray-900">{feature.name}</dt>
                                <dd className="text-sm sm:text-base lg:text-lg text-gray-900 mt-2">{feature.description}</dd>
                            </div>
                        </div>
                    ))}
                </dl>

                {/* Centered button */}
                <div className="flex justify-center mt-10">
                    <button
                        className="py-3 w-60 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-base font-medium rounded-md hover:bg-black hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 shadow-lg"
                    >
                        Reserve Your Vehicle
                    </button>
                </div>
            </div>
        </div>
    );
}
