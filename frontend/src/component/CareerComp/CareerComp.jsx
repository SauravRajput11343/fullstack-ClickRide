import CareerBg from '../../assets/img/CareerBg.webp'
import { Link } from 'react-router-dom'

export default function CareerComp() {
    return (
        <div className="bg-black min-h-screen flex items-center justify-center relative">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${CareerBg})`,
                    filter: "brightness(0.7) blur(1px)", // Darkened & Blurred Effect
                }}
            />

            {/* Animated Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/90 opacity-80" />

            <div className="relative z-10 text-center max-w-lg px-6">
                <h2 className="text-5xl font-bold text-white drop-shadow-md animate-fade-in">
                    Work With Us
                </h2>
                <p className="mt-6 text-lg text-gray-300 leading-relaxed animate-fade-in delay-100">
                    Join our team to help revolutionize the vehicle rental industry. We’re looking for passionate individuals to make transportation easier and more convenient for everyone.
                </p>

                <div className="mt-8 flex justify-center">
                    <Link
                        to="/PartnerSignup"
                        className="relative inline-block text-lg font-semibold px-6 py-3 rounded-full bg-white text-gray-900 transition-all duration-300 ease-in-out shadow-lg hover:bg-indigo-500 hover:text-white hover:shadow-indigo-500/50"
                    >
                        Get Started
                        {/* Glowing Effect */}
                        <span className="absolute inset-0 rounded-full bg-indigo-500 opacity-0 transition-opacity duration-300 group-hover:opacity-30"></span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
