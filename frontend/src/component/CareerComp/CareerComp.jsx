import CareerBg from '../../assets/img/CareerBg.webp'
import { Link } from 'react-router-dom'

export default function CareerComp() {
    return (
        <div className="bg-white">
            <div className="mx-auto py-0 sm:px-0 lg:px-0">
                <div
                    className="relative isolate overflow-hidden bg-gray-900 w-full h-screen flex items-center justify-center lg:flex lg:gap-x-20 lg:px-0 lg:pt-0"
                    style={{
                        backgroundImage: `url(${CareerBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Overlay for tint effect */}
                    <div className="absolute inset-0 bg-black opacity-50" />

                    <svg
                        viewBox="0 0 1024 1024"
                        aria-hidden="true"
                        className="absolute left-1/2 top-1/2 -z-10 size-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
                    >
                        <circle r={512} cx={512} cy={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
                        <defs>
                            <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                                <stop stopColor="#7775D6" />
                                <stop offset={1} stopColor="#E935C1" />
                            </radialGradient>
                        </defs>
                    </svg>
                    <div className="mx-auto max-w-md text-center z-10">
                        <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                            Work with Us
                        </h2>
                        <p className="mt-6 text-pretty text-lg/8 text-gray-300">
                            Join our team to help revolutionize the vehicle rental industry. We’re looking for passionate individuals to make transportation easier and more convenient for everyone.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link to="/PartnerSignup"
                                href="#"
                                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white hover:bg-black hover:text-white "
                            >
                                Get started
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}