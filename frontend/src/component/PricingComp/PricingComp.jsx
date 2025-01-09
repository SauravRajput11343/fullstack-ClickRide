import { CheckIcon } from '@heroicons/react/20/solid'

const tiers = [
    {
        name: 'Standard',
        id: 'tier-standard',
        href: '#',
        priceHourly: '$10',  // Hourly rate
        priceDaily: '$50',   // Daily rate
        additionalCosts: '$15 for additional driver',  // Example of additional costs
        description: "The perfect option for a short-term ride with essential features.",
        features: ['Sedan', 'Up to 4 passengers', 'Basic GPS', '24-hour customer support'],
        featured: false,
    },
    {
        name: 'Premium',
        id: 'tier-premium',
        href: '#',
        priceHourly: '$20',  // Hourly rate
        priceDaily: '$100',  // Daily rate
        additionalCosts: '$25 for additional driver, $10 for premium insurance',  // Example of additional costs
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
        <div className="relative isolate  px-6 py-24 sm:py-32 lg:px-8 overflow-hidden" style={{ backgroundColor: "#FFE5B4" }}>
            <div aria-hidden="true" className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl">

            </div>
            <div className="mx-auto max-w-4xl text-center">
                <h2 className="text-base font-semibold text-indigo-600">Pricing</h2>
                <p className="mt-2 text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl">
                    Choose the right rental plan for you
                </p>
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-gray-600 sm:text-xl">
                Choose an affordable plan that’s packed with the best features for your journey.
            </p>
            <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2 overflow-hidden">
                {tiers.map((tier, tierIdx) => (
                    <div
                        key={tier.id}
                        className={classNames(
                            tier.featured ? 'relative bg-gray-900 shadow-2xl' : 'bg-white/60 sm:mx-8 lg:mx-0',
                            tier.featured
                                ? ''
                                : tierIdx === 0
                                    ? 'rounded-xl sm:rounded-b-none lg:rounded-xl '
                                    : 'sm:rounded-xl  lg:rounded-xl',
                            'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10',
                        )}
                    >
                        <h3
                            id={tier.id}
                            className={classNames(tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'text-base font-semibold')}
                        >
                            {tier.name}
                        </h3>
                        <p className="mt-4 flex items-baseline gap-x-2">
                            <span
                                className={classNames(
                                    tier.featured ? 'text-white' : 'text-gray-900',
                                    'text-5xl font-semibold tracking-tight',
                                )}
                            >
                                {tier.priceHourly}
                            </span>
                            <span className={classNames(tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base')}>/hour</span>
                            <span className="mx-2 text-gray-500">or</span>
                            <span
                                className={classNames(
                                    tier.featured ? 'text-white' : 'text-gray-900',
                                    'text-5xl font-semibold tracking-tight',
                                )}
                            >
                                {tier.priceDaily}
                            </span>
                            <span className={classNames(tier.featured ? 'text-gray-400' : 'text-gray-500', 'text-base')}>/day</span>
                        </p>
                        <p className={classNames(tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-6 text-base')}>
                            {tier.description}
                        </p>
                        <p className={classNames(tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-2 text-sm')}>
                            {tier.additionalCosts}
                        </p>
                        <ul
                            role="list"
                            className={classNames(
                                tier.featured ? 'text-gray-300' : 'text-gray-600',
                                'mt-8 space-y-3 text-sm sm:mt-10',
                            )}
                        >
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex gap-x-3">
                                    <CheckIcon
                                        aria-hidden="true"
                                        className={classNames(tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'h-6 w-5 flex-none')}
                                    />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <a
                            href={tier.href}
                            aria-describedby={tier.id}
                            className={classNames(
                                tier.featured
                                    ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
                                    : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600',
                                'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10',
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