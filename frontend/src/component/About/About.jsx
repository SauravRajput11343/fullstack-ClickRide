import { Link } from 'react-router-dom';
import AboutBg from '../../assets/img/AboutBG.webp';

const links = [
    { name: 'Work With Us', to: '/Career' },
];

export default function About() {
    return (
        <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
            <img
                alt="Background"
                src={AboutBg}
                className="absolute inset-0 -z-10 w-full h-full object-cover object-center"
            />
            <div
                aria-hidden="true"
                className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
            >
                <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20" />
            </div>
            <div
                aria-hidden="true"
                className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
            >
                <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20" />
            </div>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl hover:text-pink-400 transition duration-500 ease-in-out">
                        About Us
                    </h2>
                    <h6 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        Welcome to ClickRide
                    </h6>
                    <p className="mt-8 text-lg font-medium text-gray-300 sm:text-xl/8">
                        ClickRide is a leading provider of convenient, affordable, and reliable transportation solutions.
                        We offer a diverse fleet of vehicles, ensuring a seamless and comfortable ride for all occasions.
                        Our platform connects passengers with professional drivers, delivering a hassle-free experience every time.
                    </p>
                </div>
                <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold text-white hover:text-lime-400 sm:grid-cols-2 md:flex lg:gap-x-10">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                to={link.to}
                                className="transition duration-300 transform hover:scale-105 hover:text-yellow-300"
                            >
                                {link.name} <span aria-hidden="true">&rarr;</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
