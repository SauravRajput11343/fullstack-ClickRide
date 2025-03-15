import React, { useState, useEffect, useRef, useCallback } from "react";
import { RefreshCw, LoaderCircle, Search, MapPin, Coins, Filter, ChevronDown } from "lucide-react";

// Expanded item categories and items
const itemCategories = {
    "Bags": ["BAG"],
    "Capes": ["CAPE"],
    "Resources": {
        "Stone": ["ROCK",],
        "Ore": ["ORE",],
        "Wood": ["WOOD",],
        "Fiber": ["FIBER",],
        "Hide": ["HIDE",]
    },
    "Refined Resources": {
        "Stone Blocks": ["BLOCK",],
        "Metal Bars": ["METALBAR",],
        "Planks": ["PLANKS",],
        "Cloth": ["CLOTH",],
        "Leather": ["LEATHER",]
    },
    "Melee Weapons": {
        "Sword": ["MAIN_SWORD", "2H_CLAYMORE", "MAIN_BROAD_SWORD", "MAIN_DUALSWORD", "MAIN_CLEAVER", "2H_CARVINGSWORD", "2H_GLAIVE", "2H_KINGMAKER"],
        "Axe": ["MAIN_AXE", "2H_HALBERD", "MAIN_BATTLEAXE", "2H_GREATAXE", "2H_CARRIONCALLER", "2H_REALMBAKER", "2H_INFERNALSICKLE"],
        "Spear": ["MAIN_SPEAR", "2H_PIKE", "2H_GLAIVE", "2H_SPIRITSPEAR", "2H_TRIDENT", "2H_HARPOON"],
        "Dagger": ["MAIN_DAGGER", "2H_DUALDAGGER", "2H_CLAWPAIR", "2H_BLOODLETTER", "2H_DEMONICDAGGER"],
        "Mace": ["MAIN_MACE", "2H_MACE", "2H_FLAIL", "2H_HELLMACE"],
        "Hammer": ["MAIN_HAMMER", "2H_POLEHAMMER", "2H_GIANTHAMMER", "2H_TOMBHAMMER"],
        "Quarterstaff": ["2H_QUARTERSTAFF", "2H_IRONCLADSTAFF", "2H_DOUBLEBLADEDSTAFF", "2H_BLACKMONKSTAFF"]
    },
    "Magic Weapons": {
        "Fire Staff": ["MAIN_FIRESTAFF", "2H_FIRESTAFF", "2H_INFERNALSTAFF", "2H_BLAZINGSTAFF"],
        "Frost Staff": ["MAIN_FROSTSTAFF", "2H_FROSTSTAFF", "2H_GLACIALSTAFF"],
        "Arcane Staff": ["MAIN_ARCANESTAFF", "2H_ARCANESTAFF", "2H_ENIGMATICSTAFF"],
        "Holy Staff": ["MAIN_HOLYSTAFF", "2H_HOLYSTAFF", "2H_DIVINESTAFF"],
        "Cursed Staff": ["MAIN_CURSEDSTAFF", "2H_CURSEDSTAFF", "2H_DEMONICSTAFF"]
    },
    "Ranged Weapons": {
        "Bow": ["2H_BOW", "2H_LONGBOW", "2H_WARBOW"],
        "Crossbow": ["2H_CROSSBOW", "2H_CROSSBOWLARGE", "2H_WEAPON"],
        "Musket": ["2H_MUSKET"]
    },
    "Off-Hand Items": {
        "Shields": ["OFF_SHIELD", "OFF_TOWER_SHIELD"],
        "Torches": ["OFF_TORCH"],
        "Books": ["OFF_BOOK"],
        "Lamps": ["OFF_LAMP"],
        "Orbs": ["OFF_ORB"]
    },

    "Armor": {
        "Cloth": ["HEAD_CLOTH_SET1", "ARMOR_CLOTH_SET1", "SHOES_CLOTH_SET1", "HEAD_CLOTH_SET2", "ARMOR_CLOTH_SET2", "SHOES_CLOTH_SET2"],
        "Leather": ["HEAD_LEATHER_SET1", "ARMOR_LEATHER_SET1", "SHOES_LEATHER_SET1", "HEAD_LEATHER_SET2", "ARMOR_LEATHER_SET2", "SHOES_LEATHER_SET2"],
        "Plate": ["HEAD_PLATE_SET1", "ARMOR_PLATE_SET1", "SHOES_PLATE_SET1", "HEAD_PLATE_SET2", "ARMOR_PLATE_SET2", "SHOES_PLATE_SET2"]
    },

    "Mounts": [
        "MOUNT_HORSE", "MOUNT_ARMORED_HORSE", "MOUNT_OX", "MOUNT_ARMORED_OX", "MOUNT_MOABIRD", "MOUNT_WILD_BOAR", "MOUNT_BEAR", "MOUNT_DIREWOLF"
    ],

    "Food": {
        "Fish": ["FOOD_FISH_SOUP", "FOOD_FISH_STEW"],
        "Meat": ["FOOD_MEAT_PIE", "FOOD_MEAT_ROAST"],
        "Vegetables": ["FOOD_CABBAGE_SOUP", "FOOD_POTATO_SALAD"]
    },

    "Potions": ["POTION_HEALTH", "POTION_ENERGY", "POTION_INVULNERABILITY", "POTION_SPEED", "POTION_POISON"]
};

// Tier options
const tierOptions = ["All Tiers", "T4", "T5", "T6", "T7", "T8"];

// Servers mapping
const servers = {
    Americas: "https://west.albion-online-data.com",
    Asia: "https://east.albion-online-data.com",
    Europe: "https://europe.albion-online-data.com"
};

const cities = [
    "Caerleon", "Bridgewatch", "Martlock", "Lymhurst", "Thetford", "Fort Sterling", "Black Market"
];

// Flatten and process item categories for easier search
const processItemCategories = () => {
    let result = [];

    for (const [category, content] of Object.entries(itemCategories)) {
        if (Array.isArray(content)) {
            result = [...result, ...content];
        } else {
            for (const [subCategory, items] of Object.entries(content)) {
                result = [...result, ...items];
            }
        }
    }

    return result;
};

const allItems = processItemCategories();

export default function AlbionMarketTracker() {
    const [selectedCategory, setSelectedCategory] = useState("Bags");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [selectedTier, setSelectedTier] = useState("All Tiers");
    const [selectedServer, setSelectedServer] = useState("Americas");
    const [selectedCities, setSelectedCities] = useState(cities.slice(0, 6));
    const [selectedWeapon, setSelectedWeapon] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedItem, setSelectedItem] = useState("T4_BAG");

    const [dropdowns, setDropdowns] = useState({ category: false, subcategory: false, tier: false, server: false, weapon: false });
    const dropdownRefs = { category: useRef(null), subcategory: useRef(null), tier: useRef(null), server: useRef(null), weapon: useRef(null) };

    // Prices state
    const [prices, setPrices] = useState([]);
    const [priceComparison, setPriceComparison] = useState({
        lowestSellPrice: null,
        highestSellPrice: null,
        lowestSellCity: null,
        highestSellCity: null,
        profitPotential: null
    });

    useEffect(() => {
        function handleClickOutside(event) {
            Object.entries(dropdownRefs).forEach(([key, ref]) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    setDropdowns(prev => ({ ...prev, [key]: false }));
                }
            });
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = (name) => {
        setDropdowns(prev => ({
            ...Object.fromEntries(Object.keys(prev).map(key => [key, key === name ? !prev[key] : false]))
        }));
    };

    const fetchPrices = useCallback(async () => {
        if (!selectedCategory) return;

        setLoading(true);
        setPrices([]);
        setPriceComparison({
            lowestSellPrice: null,
            highestSellPrice: null,
            lowestSellCity: null,
            highestSellCity: null,
            profitPotential: null
        });

        try {
            const serverUrl = servers[selectedServer];
            const locationsParam = selectedCities.join(",");

            // Determine item list based on category, subcategory, and selectedWeapon
            let items = [];

            if (selectedWeapon) {
                // Fetch only the selected weapon
                items = [selectedWeapon];
            } else if (selectedSubCategory && itemCategories[selectedCategory][selectedSubCategory]) {
                // Fetch all weapons in a subcategory (if weapon is not selected)
                items = itemCategories[selectedCategory][selectedSubCategory];
            } else if (Array.isArray(itemCategories[selectedCategory])) {
                // Fetch all items in the selected category (if subcategory is not selected)
                items = itemCategories[selectedCategory];
            }

            console.log("Fetching items:", items);

            // Include tier if it's not "All Tiers"
            const tierPrefix = selectedTier !== "All Tiers" ? `${selectedTier}_` : "";

            // Construct API URL for each item
            const requests = items.map(async (item) => {
                const url = `${serverUrl}/api/v2/stats/prices/${tierPrefix}${item}.json?locations=${locationsParam}&qualities=2`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            });

            // Fetch all item prices
            const data = await Promise.all(requests);
            const mergedData = data.flat();

            setPrices(mergedData);
            analyzePrices(mergedData);
        } catch (error) {
            console.error("Error fetching prices:", error);
            alert("Failed to fetch prices. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [selectedServer, selectedCities, selectedCategory, selectedSubCategory, selectedWeapon, selectedTier]);

    // Analyze prices and find comparisons
    const analyzePrices = (priceData) => {
        if (!priceData || priceData.length === 0) {
            return;
        }

        // Sort prices by sell_price_min
        const sortedPrices = priceData.sort((a, b) => a.sell_price_min - b.sell_price_min);

        const lowestSellPrice = sortedPrices[0].sell_price_min;
        const highestSellPrice = Math.max(...sortedPrices.map(p => p.sell_price_max));

        const lowestSellCity = sortedPrices[0].city;
        const highestSellCity = sortedPrices.find(p => p.sell_price_max === highestSellPrice)?.city;

        const profitPotential = highestSellPrice - lowestSellPrice;

        setPriceComparison({
            lowestSellPrice,
            highestSellPrice,
            lowestSellCity,
            highestSellCity,
            profitPotential
        });
    };

    // Filter items based on category, tier, and search
    const getFilteredItems = () => {
        let items;

        if (searchQuery) {
            items = allItems.filter(item =>
                item.toLowerCase().includes(searchQuery.toLowerCase())
            );
        } else if (typeof itemCategories[selectedCategory] === 'object' && !Array.isArray(itemCategories[selectedCategory])) {
            items = selectedSubCategory
                ? itemCategories[selectedCategory][selectedSubCategory]
                : [];
        } else {
            items = itemCategories[selectedCategory];
        }

        // Filter by tier if not "All Tiers"
        if (selectedTier !== "All Tiers" && Array.isArray(items)) {
            const tierNumber = selectedTier.charAt(selectedTier.length - 1);
            items = items.filter(item => item.charAt(1) === tierNumber);
        }

        return items;
    };

    // Toggle city selection
    const toggleCity = (city) => {
        setSelectedCities(prev =>
            prev.includes(city)
                ? prev.filter(c => c !== city)
                : [...prev, city]
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 px-4">
            <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
                    <h1 className="text-3xl font-extrabold text-center tracking-wide">
                        Albion Online Price Fetcher
                    </h1>
                    <p className="text-center text-blue-100 mt-2">
                        Compare market prices across different cities and servers
                    </p>
                </div>

                {/* Selection Filters */}
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <div className="flex flex-wrap gap-4 justify-center items-center">
                        {/* Server Dropdown */}
                        <div className="relative" ref={dropdownRefs.server}>
                            <button
                                onClick={() => toggleDropdown('server')}
                                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 flex items-center transition duration-300"
                            >
                                <MapPin className="mr-2 text-blue-500" size={20} />
                                {selectedServer}
                                <ChevronDown className="ml-2 text-gray-500" />
                            </button>
                            {dropdowns.server && (
                                <div className="absolute z-20 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 overflow-hidden">
                                    {Object.keys(servers).map((server) => (
                                        <div
                                            key={server}
                                            onClick={() => {
                                                setSelectedServer(server);
                                                toggleDropdown('server');
                                            }}
                                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700 hover:text-blue-600 transition duration-200"
                                        >
                                            {server}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Category Dropdown{/* Category Dropdown */}
                        <div className="relative" ref={dropdownRefs.category}>
                            <button
                                onClick={() => toggleDropdown('category')}
                                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 flex items-center transition duration-300"
                            >
                                <Filter className="mr-2 text-green-500" size={20} />
                                {selectedCategory}
                                <ChevronDown className="ml-2 text-gray-500" />
                            </button>
                            {dropdowns.category && (
                                <div className="absolute z-20 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-64 overflow-y-auto">
                                    {Object.keys(itemCategories).map(category => (
                                        <div
                                            key={category}
                                            onClick={() => {
                                                setSelectedCategory(category);
                                                setSelectedSubCategory("");
                                                toggleDropdown('category');
                                            }}
                                            className="px-4 py-2 hover:bg-green-50 cursor-pointer text-gray-700 hover:text-green-600 transition duration-200"
                                        >
                                            {category}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Subcategory Dropdown */}
                        {typeof itemCategories[selectedCategory] === 'object' && !Array.isArray(itemCategories[selectedCategory]) && (
                            <div className="relative" ref={dropdownRefs.subcategory}>
                                <button
                                    onClick={() => toggleDropdown('subcategory')}
                                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 flex items-center transition duration-300"
                                >
                                    {selectedSubCategory || "Select Subcategory"}
                                    <ChevronDown className="ml-2 text-gray-500" />
                                </button>
                                {dropdowns.subcategory && (
                                    <div className="absolute z-20 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-64 overflow-y-auto">
                                        {Object.keys(itemCategories[selectedCategory]).map(subCategory => (
                                            <div
                                                key={subCategory}
                                                onClick={() => {
                                                    setSelectedSubCategory(subCategory);
                                                    toggleDropdown('subcategory');
                                                }}
                                                className="px-4 py-2 hover:bg-green-50 cursor-pointer text-gray-700 hover:text-green-600 transition duration-200"
                                            >
                                                {subCategory}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Weapon Dropdown */}
                        {selectedSubCategory && (
                            <div className="relative" ref={dropdownRefs.weapon}>
                                <button
                                    onClick={() => toggleDropdown("weapon")}
                                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 flex items-center transition duration-300 w-64 justify-between"
                                >
                                    {selectedWeapon || "Select Weapon"}
                                    <ChevronDown className="text-gray-500" />
                                </button>
                                {dropdowns.weapon && (
                                    <div className="absolute z-20 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 w-64 max-h-64 overflow-y-auto">
                                        {itemCategories[selectedCategory][selectedSubCategory].map(
                                            (weapon) => (
                                                <div
                                                    key={weapon}
                                                    onClick={() => {
                                                        setSelectedWeapon(weapon);
                                                        toggleDropdown("weapon");
                                                    }}
                                                    className="px-4 py-2 hover:bg-green-50 cursor-pointer text-gray-700 hover:text-green-600 transition duration-200"
                                                >
                                                    {weapon}
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tier Dropdown */}
                        <div className="relative" ref={dropdownRefs.tier}>
                            <button
                                onClick={() => toggleDropdown('tier')}
                                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 flex items-center transition duration-300"
                            >
                                <Coins className="mr-2 text-yellow-500" size={20} />
                                {selectedTier}
                                <ChevronDown className="ml-2 text-gray-500" />
                            </button>
                            {dropdowns.tier && (
                                <div className="absolute z-20 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 overflow-hidden">
                                    {tierOptions.map(tier => (
                                        <div
                                            key={tier}
                                            onClick={() => {
                                                setSelectedTier(tier);
                                                toggleDropdown('tier');
                                            }}
                                            className="px-4 py-2 hover:bg-yellow-50 cursor-pointer text-gray-700 hover:text-yellow-600 transition duration-200"
                                        >
                                            {tier}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Selected Item Display */}
                {selectedWeapon && (
                    <div className="p-4 bg-white border-b border-gray-200 text-center">
                        <h3 className="text-lg font-semibold text-gray-700">
                            Selected Item: {selectedWeapon}
                        </h3>
                    </div>
                )}

                {/* City Selection */}
                <div className="p-6 bg-white">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Select Cities to Compare</h3>
                    <div className="flex flex-wrap gap-3">
                        {cities.map((city) => (
                            <button
                                key={city}
                                onClick={() => toggleCity(city)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition duration-300 ease-in-out transform hover:scale-105 ${selectedCities.includes(city)
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                                    }`}
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Fetch Prices Button */}
                <div className="p-6 text-center">
                    <button
                        onClick={fetchPrices}
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-800 flex items-center mx-auto disabled:opacity-50 transition duration-300 shadow-lg hover:shadow-xl"
                    >
                        {loading ? (
                            <>
                                <LoaderCircle className="mr-3 animate-spin" /> Fetching Prices...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="mr-3" /> Fetch Prices
                            </>
                        )}
                    </button>
                </div>

                {/* Price Comparison Section */}
                <div className="p-6 bg-gray-50">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Price Comparison</h2>
                    {loading ? (
                        <div className="flex justify-center items-center text-gray-600">
                            <LoaderCircle className="animate-spin mr-3" />
                            <span>Fetching prices...</span>
                        </div>
                    ) : prices.length > 0 ? (
                        <div>
                            {/* Price Comparison Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white border border-green-200 rounded-lg p-5 shadow-md hover:shadow-lg transition duration-300">
                                    <h3 className="text-lg font-semibold text-green-700 mb-3">Lowest Sell Price</h3>
                                    <p className="text-2xl font-bold text-green-600">{priceComparison.lowestSellPrice} silver</p>
                                    <p className="text-gray-600">City: {priceComparison.lowestSellCity}</p>
                                </div>
                                <div className="bg-white border border-blue-200 rounded-lg p-5 shadow-md hover:shadow-lg transition duration-300">
                                    <h3 className="text-lg font-semibold text-blue-700 mb-3">Highest Sell Price</h3>
                                    <p className="text-2xl font-bold text-blue-600">{priceComparison.highestSellPrice} silver</p>
                                    <p className="text-gray-600">City: {priceComparison.highestSellCity}</p>
                                </div>
                                <div className="bg-white border border-yellow-200 rounded-lg p-5 shadow-md hover:shadow-lg transition duration-300">
                                    <h3 className="text-lg font-semibold text-yellow-700 mb-3">Profit Potential</h3>
                                    <p className="text-2xl font-bold text-yellow-600">{priceComparison.profitPotential} silver</p>
                                </div>
                            </div>

                            {/* Detailed Price Table */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sell Price (Min)</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sell Price (Max)</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy Price (Min)</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy Price (Max)</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {prices.map((price, index) => (
                                            <tr key={`${price.city}-${index}`} className="hover:bg-gray-50 transition duration-200">
                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{price.city}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{price.sell_price_min}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{price.sell_price_max}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{price.buy_price_min}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{price.buy_price_max}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {price.sell_price_min_date ? new Date(price.sell_price_min_date).toLocaleString() : "N/A"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 bg-white p-8 rounded-lg shadow-md">
                            <p className="text-xl">No price data available.</p>
                            <p className="mt-2">Click "Fetch Prices" to get started.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}