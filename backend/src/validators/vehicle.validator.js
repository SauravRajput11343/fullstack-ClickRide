import * as Yup from 'yup';

export const vehicleSchema = Yup.object().shape({
    vehiclePic: Yup.number()
        .required("Vehicle picture is required")
        .test("vehiclePicRequired", "Vehicle picture is required", (value) => {
            // Check if the value is 0 (indicating that a picture hasn't been uploaded)
            return value !== 0; // If value is 0, the validation fails
        }),


    vehicleType: Yup.string()
        .notOneOf(['none'], 'Vehicle type is required')
        .required('Vehicle type is required'),

    vehicleMake: Yup.string()
        .notOneOf(['none'], 'Vehicle Make is required')
        .required('Vehicle Make is required'),

    vehicleModel: Yup.string()
        .notOneOf(['none'], 'Vehicle Model is required')
        .required('Vehicle Model is required'),

    vehicleTransmission: Yup.string().required("Transmission type is required"),

    vehicleSeat: Yup.string().required('Number of seats is required'),

    vehicleFuelType: Yup.string().required("Fuel type is required"),

    vehicleRegNumber: Yup.string()
        .required('Vehicle registration number is required')
        .matches(/^[A-Za-z]{2}\d{2}[A-Za-z]{1,2}\d{4}$/, 'Vehicle registration number is invalid'),

    manufacturingYear: Yup.number()
        .required('Manufacturing year is required')
        .min(1900, 'Manufacturing year must be at least 1900')
        .max(new Date().getFullYear(), `Manufacturing year must be a valid year`)
        .typeError('Manufacturing year must be a valid number'),

    pricePerHour: Yup.number()
        .required('Price per hour is required')
        .positive('Price per hour must be a positive number')
        .typeError('Price per hour must be a valid number'), // Ensure pricePerHour is treated as a number

    pricePerDay: Yup.number()
        .required('Price per day is required')
        .positive('Price per day must be a positive number')
        .typeError('Price per day must be a valid number') // Ensure pricePerDay is treated as a number
        .test('is-less-than-hour', 'Price per day cannot be less than price per hour', function (value) {
            const { pricePerHour } = this.parent; // Get the value of pricePerHour
            return value >= pricePerHour || !pricePerHour; // Return true if pricePerDay is >= pricePerHour or pricePerHour is not set
        }),
});
