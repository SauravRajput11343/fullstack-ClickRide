import * as Yup from 'yup';
export const BookingSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    phone: Yup.string()
        .matches(/^[6-9]\d{9}$/, "Invalid phone number")
        .required("Phone number is required"),
    startDate: Yup
        .date()
        .transform((value, originalValue) => (originalValue === "" ? null : value))
        .nullable()
        .required("Start date is required"),
    startTime: Yup.string().required("Start time is required"),
    endDate: Yup
        .date()
        .transform((value, originalValue) => (originalValue === "" ? null : value))
        .nullable()
        .required("End date is required")
        .min(Yup.ref("startDate"), "End date cannot be before start date"),
    endTime: Yup.string().required("End time is required"),
});

