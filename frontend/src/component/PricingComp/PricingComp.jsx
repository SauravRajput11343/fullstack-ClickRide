import { CheckIcon } from '@heroicons/react/20/solid'

const tiers = [
    {
        name: 'Standard',
        id: 'tier-standard',
        href: '#',
        priceHourly: '$10',
        priceDaily: '$50',
        additionalCosts: '$15 for additional driver',
        description: "The perfect option for a short-term ride with essential features.",
        features: ['Sedan', 'Up to 4 passengers', 'Basic GPS', '24-hour customer support'],
        featured: false,
    },
    {
        name: 'Premium',
        id: 'tier-premium',
        href: '#',
        priceHourly: '$20',
        priceDaily: '$100',
        additionalCosts: '$25 for additional driver, $10 for premium insurance',
        description: 'Luxury and enhanced features for your long-distance and comfortable journey.',
        features: [
            'Luxury sedan or SUV',
            'Up to 6 passengers',
            'Advanced GPS with live traffic updates',
            'Dedicated support representative',
            'Premium insurance included',
            'Child seat available on request',
        ],
        featured: true,
    },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function PricingComp() {
    return (
        <div className="relative isolate px-6 py-24 sm:py-32 lg:px-8 bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
            <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1),_transparent)]"></div>

            <div className="mx-auto max-w-4xl text-center">
                <h2 className="text-base font-semibold text-teal-400">Pricing</h2>
                <p className="mt-2 text-5xl font-extrabold tracking-tight sm:text-6xl">
                    Choose the best plan for you
                </p>
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-gray-400 sm:text-xl">
                Select an affordable package loaded with great features for your trip.
            </p>

            <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-8 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
                {tiers.map((tier) => (
                    <div
                        key={tier.id}
                        className={classNames(
                            tier.featured ? 'bg-gradient-to-br from-indigo-700 to-purple-600 shadow-lg ring-2 ring-indigo-500' : 'bg-white/10 backdrop-blur-lg',
                            'rounded-3xl p-8 sm:p-10 transform hover:scale-105 transition duration-300 ease-in-out'
                        )}
                    >
                        <h3 id={tier.id} className="text-lg font-semibold text-teal-300 uppercase tracking-wider">
                            {tier.name}
                        </h3>
                        <p className="mt-4 flex items-baseline gap-x-2 text-5xl font-bold">
                            {tier.priceHourly}
                            <span className="text-lg text-gray-400">/hour</span>
                            <span className="mx-2 text-gray-500">or</span>
                            {tier.priceDaily}
                            <span className="text-lg text-gray-400">/day</span>
                        </p>
                        <p className="mt-4 text-gray-300">{tier.description}</p>
                        <p className="mt-2 text-sm text-gray-400">{tier.additionalCosts}</p>

                        <ul className="mt-6 space-y-3 text-sm sm:mt-8">
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-x-3">
                                    <CheckIcon className="h-6 w-6 text-teal-300" />
                                    <span className="text-gray-300">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <a
                            href={tier.href}
                            className={classNames(
                                tier.featured
                                    ? 'bg-teal-500 text-white hover:bg-teal-400 shadow-lg'
                                    : 'bg-transparent text-teal-400 ring-1 ring-teal-400 hover:bg-teal-500 hover:text-white',
                                'mt-8 block rounded-lg px-5 py-3 text-center text-lg font-semibold transition-all duration-300 ease-in-out sm:mt-10'
                            )}
                        >
                            Book now
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}
