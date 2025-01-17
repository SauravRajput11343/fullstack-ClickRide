import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import PartnerRequest from "../models/partnerRequest.model.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";



export const partnerSignup = async (req, res) => {
    const { firstName, lastName, email, dob, mobile, roleName, gender, profilePic, profileVideo } = req.body;

    try {
        if (!firstName || !lastName || !email || !dob || !mobile || !roleName || !gender || !profilePic || !profileVideo) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await PartnerRequest.findOne({ email }) || await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            return res.status(400).json({ message: "You must be at least 18 years old" });
        }

        const role = await Role.findOne({ roleName });
        if (!role) {
            return res.status(400).json({ message: "Role not found. Please provide a valid role." });
        }

        const profilePicUpload = await cloudinary.uploader.upload(profilePic, {
            folder: "partners/profile_pics",
            resource_type: "image",
        });

        const profileVideoUpload = await cloudinary.uploader.upload(profileVideo, {
            folder: "partners/profile_videos",
            resource_type: "video",
        });

        const newRequest = new PartnerRequest({
            firstName,
            lastName,
            email,
            dob,
            mobile,
            gender,
            profilePic: profilePicUpload.secure_url,
            profileVideo: profileVideoUpload.secure_url,
            password: undefined,
            roleId: role._id,
        });

        await newRequest.save();

        res.status(201).json({
            message: "Partner request submitted successfully. Awaiting admin approval.",
            requestId: newRequest._id,
        });

    } catch (error) {
        console.error("Error in partnerSignup controller:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const partnerRequest = async (req, res) => {
    try {
        const partnerRequest = await PartnerRequest.find().select('-password');

        // Count users
        const totalPartnerRequest = partnerRequest.length;

        res.status(200).json({
            totalPartnerRequest,
            partnerRequestDetails: partnerRequest,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500), json({ error: 'Internal Server Error' });
    }
};