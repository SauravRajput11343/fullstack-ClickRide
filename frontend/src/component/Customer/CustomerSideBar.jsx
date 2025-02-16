import React, { useState } from "react";
import {
    Card,
    List,
    ListItem,
    Typography,
} from "@material-tailwind/react";
import {
    ChevronRightIcon,
    PresentationChartBarIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export default function CustomerSideBar({ isDrawerOpen, filterData, onFilterChange }) {
    const vehicleMakes = {
        sedan: [
            { value: 'toyota', label: 'Toyota' },
            { value: 'ford', label: 'Ford' },
            { value: 'chevrolet', label: 'Chevrolet' },
            { value: 'honda', label: 'Honda' },
            { value: 'bmw', label: 'BMW' },
        ],
        suv: [
            { value: 'toyota', label: 'Toyota' },
            { value: 'ford', label: 'Ford' },
            { value: 'chevrolet', label: 'Chevrolet' },
            { value: 'honda', label: 'Honda' },
            { value: 'bmw', label: 'BMW' },
        ],
        truck: [
            { value: 'ford', label: 'Ford' },
            { value: 'chevrolet', label: 'Chevrolet' },
            { value: 'ram', label: 'RAM' },
        ],
        coupe: [
            { value: 'bmw', label: 'BMW' },
            { value: 'audi', label: 'Audi' },
            { value: 'mercedes', label: 'Mercedes-Benz' },
        ],
        convertible: [
            { value: 'bmw', label: 'BMW' },
            { value: 'audi', label: 'Audi' },
            { value: 'mercedes', label: 'Mercedes-Benz' },
        ],
        hatchback: [
            { value: 'honda', label: 'Honda' },
            { value: 'toyota', label: 'Toyota' },
            { value: 'ford', label: 'Ford' },
        ],
        minivan: [
            { value: 'toyota', label: 'Toyota' },
            { value: 'honda', label: 'Honda' },
            { value: 'kia', label: 'Kia' },
        ],
        electric: [
            { value: 'tesla', label: 'Tesla' },
            { value: 'chevrolet', label: 'Chevrolet' },
        ],
        bike: [
            { value: 'yamaha', label: 'Yamaha' },
            { value: 'suzuki', label: 'Suzuki' },
            { value: 'harley', label: 'Harley-Davidson' },
            { value: 'ducati', label: 'Ducati' },
        ]
    };

    const models = {
        toyota: ['Corolla', 'Camry', 'RAV4', 'Highlander'],
        ford: ['Focus', 'Mustang', 'F-150', 'Explorer'],
        chevrolet: ['Malibu', 'Camaro', 'Silverado', 'Tahoe'],
        honda: ['Civic', 'Accord', 'CR-V', 'Pilot'],
        bmw: ['3 Series', 'X5', 'M4', 'X3'],
        audi: ['A3', 'A4', 'Q5', 'Q7'],
        mercedes: ['C-Class', 'E-Class', 'GLC', 'S-Class'],
        ram: ['1500', '2500', '3500'],
        kia: ['Carnival', 'Sedona'],
        tesla: ['Model S', 'Model 3', 'Model X', 'Model Y'],
        yamaha: ['YZF-R1', 'MT-09', 'FZ-07', 'Tenere 700'],
        suzuki: ['GSX-R1000', 'Hayabusa', 'V-Strom', 'SV650'],
        harley: ['Sportster', 'Softail', 'Touring', 'Road King'],
        ducati: ['Panigale V4', 'Monster', 'Scrambler', 'Multistrada'],
    };

    const [selectedVehicleType, setSelectedVehicleType] = useState("");
    const [selectedVehicleMake, setSelectedVehicleMake] = useState("");
    const [selectedVehicleModel, setSelectedVehicleModel] = useState("");
    const [selectedTransmission, setSelectedTransmission] = useState("");
    const [selectedFueltype, setSelectedFuelType] = useState("");
    const [selectedVehicleSeat, setSelectedVehicleSeat] = useState("");
    const [pricePerHour, setPricePerHour] = useState(0);
    const [pricePerDay, setPricePerDay] = useState(0);

    // When a vehicle type is selected, reset vehicle make and model
    const handleVehicleTypeChange = (e) => {
        const type = e.target.value;
        setSelectedVehicleType(type);
        setSelectedVehicleMake(""); // Reset make when type changes
        setSelectedVehicleModel(""); // Reset model when type changes
        onFilterChange({
            ...filterData,
            vehicleType: type,
            vehicleMake: "", // Reset make
            vehicleModel: "" // Reset model
        });
    };

    const handleVehicleMakeChange = (e) => {
        const make = e.target.value;
        setSelectedVehicleMake(make);
        setSelectedVehicleModel(""); // Reset model when make changes
        onFilterChange({
            ...filterData,
            vehicleMake: make,
            vehicleModel: "" // Reset model
        });
    };
    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        onFilterChange({
            ...filterData,
            [name]: value
        });
    };

    const clearFilters = () => {
        setSelectedVehicleType("");
        setSelectedVehicleMake("");
        setSelectedVehicleModel("");
        setSelectedTransmission("");
        setSelectedFuelType("");
        setSelectedVehicleSeat("");
        setPricePerHour(0);
        setPricePerDay(0);

        // Call onFilterChange with initial empty values
        onFilterChange({
            vehicleType: "",
            vehicleMake: "",
            vehicleModel: "",
            transmission: "",
            fuelType: "",
            vehicleSeat: "",
            pricePerHour: 0,
            pricePerDay: 0,
        });
    };
    return (
        <div className="flex">
            {/* Sidebar */}
            <Card
                className={`fixed top-14 right-0 h-full max-h-screen w-[16rem] sm:w-[16rem] p-4 shadow-xl transition-transform duration-300 ease-in-out
        ${isDrawerOpen ? "translate-x-0" : "translate-x-full"} lg:${isDrawerOpen ? "translate-x-0" : "translate-x-full"} z-40 bg-white overflow-y-auto`}
            >
                <List>

                    <ListItem className="p-0">
                        <div className="">
                            <Typography className="mr-auto font-bold text-xl">Filters</Typography>
                        </div>
                    </ListItem>

                    {/* Vehicle Type Section */}
                    <ListItem className="p-0">
                        <div className="">
                            <Typography className="mr-auto font-semibold">Vehicle Type</Typography>
                        </div>
                    </ListItem>
                    <ListItem className="p-0">
                        <select
                            name="vehicleType"
                            value={filterData.vehicleType}
                            onChange={handleVehicleTypeChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="">Select Vehicle Type</option>
                            {Object.keys(vehicleMakes).map((type) => (
                                <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                            ))}
                        </select>
                    </ListItem>

                    {/* Vehicle Make Section */}
                    <ListItem className="p-0">
                        <div className="">
                            <Typography className="mr-auto font-semibold">Vehicle Make</Typography>
                        </div>
                    </ListItem>
                    <ListItem className="p-0">
                        <select
                            name="vehicleMake"
                            value={filterData.vehicleMake}
                            onChange={handleVehicleMakeChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            disabled={!selectedVehicleType} // Disable if no type selected
                        >
                            <option value="">Select Vehicle Make</option>
                            {selectedVehicleType &&
                                vehicleMakes[selectedVehicleType]?.map((make) => (
                                    <option key={make.value} value={make.value}>
                                        {make.label}
                                    </option>
                                ))}
                        </select>
                    </ListItem>

                    {/* Vehicle Model Section */}
                    <ListItem className="p-0">
                        <div className="">
                            <Typography className="mr-auto font-semibold">Vehicle Model</Typography>
                        </div>
                    </ListItem>
                    <ListItem className="p-0">
                        <select
                            name="vehicleModel"
                            value={filterData.vehicleModel}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            disabled={!selectedVehicleMake} // Disable if no make selected
                        >
                            <option value="">Select Vehicle Model</option>
                            {selectedVehicleMake &&
                                models[selectedVehicleMake]?.map((model) => (
                                    <option key={model} value={model}>
                                        {model}
                                    </option>
                                ))}
                        </select>
                    </ListItem>

                    {/* Vehicle Seat Section */}
                    <ListItem className="p-0">
                        <div className="">
                            <Typography className="mr-auto font-semibold">Vehicle Seat</Typography>
                        </div>
                    </ListItem>

                    {/* First Row: 2, 4, 5 Seats */}
                    <ListItem className="p-0 flex flex-wrap ">
                        {["2", "4", "5", "6", "7", "8"].map((seat) => (
                            <label key={seat} className="flex items-center mr-2">
                                <input
                                    type="radio"
                                    name="vehicleSeat"
                                    value={seat}
                                    checked={filterData.vehicleSeat === seat}
                                    onChange={handleFilterChange}
                                />
                                {seat} Seats
                            </label>
                        ))}
                    </ListItem>

                    {/* Transmission Section */}
                    <ListItem className="p-0 ">
                        <div >
                            <Typography className="mr-auto font-semibold">Transmission</Typography>
                        </div>
                    </ListItem>
                    <ListItem className="p-0 flex space-x-2 ">
                        {["Automatic", "Manual"].map((trans) => (
                            <label key={trans} className="flex items-center">
                                <input
                                    type="radio"
                                    name="transmission"
                                    value={trans}
                                    checked={filterData.transmission === trans}
                                    onChange={handleFilterChange}
                                />
                                {trans}
                            </label>
                        ))}
                    </ListItem>

                    {/* Fuel Type Section */}
                    <ListItem className="p-0 ">
                        <div >
                            <Typography className="mr-auto font-semibold">Fuel Type</Typography>
                        </div>
                    </ListItem>
                    <ListItem className="p-0 flex space-x-2 ">
                        {["Petrol", "Diesel", "Electric"].map((fuel) => (
                            <label key={fuel} className="flex items-center">
                                <input
                                    type="radio"
                                    name="fuelType"
                                    value={fuel}
                                    checked={filterData.fuelType === fuel}
                                    onChange={handleFilterChange}
                                />
                                {fuel}
                            </label>
                        ))}
                    </ListItem>

                    {/* Clear Filters Button */}
                    <ListItem className="p-0 mt-4">
                        <button
                            onClick={clearFilters}
                            className="w-full py-2 px-4 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600"
                        >
                            Clear Filters
                        </button>
                    </ListItem>
                </List>
            </Card>
        </div>

    );
}
