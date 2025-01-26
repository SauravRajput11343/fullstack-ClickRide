import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useVehicleStore } from '../../store/useVehicleStore';

export default function FilterVehicles() {
    const location = useLocation();
    const filters = location.state?.filters || {};  // Default to an empty object if location.state is null

    const { vehicleDetails, fetchVehicleData, fetchVehicleModelData, vehicleModelDetails } = useVehicleStore();

    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [filteredModels, setFilteredModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log('Fetching vehicle data...');
                await fetchVehicleData();
                console.log('Fetching vehicle model data...');
                await fetchVehicleModelData();
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [fetchVehicleData, fetchVehicleModelData]);

    const filteredVehiclesData = useMemo(() => {
        let filtered = vehicleDetails;

        // Filter by transmission
        if (filters.transmission) {
            filtered = filtered.filter(vehicle => vehicle.vehicleTransmission === filters.transmission);
        }

        // Filter by seating capacity
        if (filters.seatingCapacity) {
            filtered = filtered.filter(vehicle => vehicle.vehicleSeat === Number(filters.seatingCapacity));
        }

        // Filter by fuel type
        if (filters.fuelType) {
            filtered = filtered.filter(vehicle => vehicle.vehicleFuelType === filters.fuelType);
        }

        // Filter by vehicle owner
        if (filters.owner) {
            filtered = filtered.filter(vehicle => vehicle.owner === filters.owner);
        }

        // Filter by price range (per day)
        if (filters.priceRangeDayMin && filters.priceRangeDayMax) {
            filtered = filtered.filter(vehicle => vehicle.pricePerDay >= filters.priceRangeDayMin && vehicle.pricePerDay <= filters.priceRangeDayMax);
        }

        // Filter by price range (per hour)
        if (filters.priceRangeHourMin && filters.priceRangeHourMax) {
            filtered = filtered.filter(vehicle => vehicle.pricePerHour >= filters.priceRangeHourMin && vehicle.pricePerHour <= filters.priceRangeHourMax);
        }

        return filtered;
    }, [filters, vehicleDetails]);

    const filteredModelsData = useMemo(() => {
        let filtered = vehicleModelDetails;

        // Apply similar filters for vehicle models
        if (filters.transmission) {
            filtered = filtered.filter(model => model.transmission === filters.transmission);
        }
        if (filters.seatingCapacity) {
            filtered = filtered.filter(model => model.seatingCapacity === Number(filters.seatingCapacity));
        }
        if (filters.fuelType) {
            filtered = filtered.filter(model => model.fuelType === filters.fuelType);
        }
        if (filters.priceRangeDayMin && filters.priceRangeDayMax) {
            filtered = filtered.filter(model => model.pricePerDay >= filters.priceRangeDayMin && model.pricePerDay <= filters.priceRangeDayMax);
        }

        return filtered;
    }, [filters, vehicleModelDetails]);

    useEffect(() => {
        if (!loading && !error) {
            console.log('Applying filters...');
            setFilteredVehicles(filteredVehiclesData);
            setFilteredModels(filteredModelsData);
        }
    }, [filteredVehiclesData, filteredModelsData, loading, error]);

    // Render loading or error states
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const renderPrice = (price) => {
        if (price && price.$numberDecimal) {
            return parseFloat(price.$numberDecimal).toFixed(2);  // Ensure it's displayed as a float with two decimal places
        }
        return price;
    };

    return (
        <div>
            {/* Render filtered vehicles */}
            <div>
                {filteredVehicles && filteredVehicles.length > 0 ? (
                    filteredVehicles.map((vehicle, index) => (
                        <div key={index}>
                            <h3>{vehicle.modelId.vehicleMake} {vehicle.modelId.vehicleModel}</h3>
                            {/* Render other vehicle details */}
                            <img src={vehicle.modelId.vehiclePic} alt={`${vehicle.modelId.vehicleMake} ${vehicle.modelId.vehicleModel}`} />
                            <p>Transmission: {vehicle.vehicleTransmission}</p>
                            <p>Seating Capacity: {vehicle.vehicleSeat}</p>
                            <p>Fuel Type: {vehicle.vehicleFuelType}</p>
                            <p>Price per Day: ${renderPrice(vehicle.pricePerDay)}</p>
                        </div>
                    ))
                ) : (
                    <p>No vehicles found based on the filters.</p>
                )}
            </div>

            {/* Render filtered models */}
            <div>
                {filteredModels && filteredModels.length > 0 ? (
                    filteredModels.map((model, index) => (
                        <div key={index}>
                            <h3>{model.vehicleMake} {model.vehicleModel}</h3>
                            <img src={model.modelPic} alt={`${model.vehicleMake} ${model.vehicleModel}`} />
                            <p>Transmission: {model.transmission}</p>
                            <p>Seating Capacity: {model.seatingCapacity}</p>
                            <p>Fuel Type: {model.fuelType}</p>
                            <p>Price per Day: ${renderPrice(model.pricePerDay)}</p>
                        </div>
                    ))
                ) : (
                    <p>No vehicle models found based on the filters.</p>
                )}
            </div>
        </div>
    );
}
