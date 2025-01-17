import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { firstName, lastName, email, password, dob, mobile, roleName } = req.body;

    try {

        if (!firstName || !lastName || !email || !password || !dob || !mobile || !roleName) {
            return res.status(400).json({ message: "All fields are required" });
        }


        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }


        const existingUser = await User.findOne({ email });
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


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new User({
            firstName,
            lastName,
            email,
            dob,
            mobile,
            password: hashedPassword,
            roleId: role._id,
        });


        await newUser.save();


        generateToken(newUser._id, res);


        res.status(201).json({
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            dob: newUser.dob,
            mobile: newUser.mobile,
            roleId: newUser.roleId,
            roleName: role.roleName,
        });
    } catch (error) {
        console.error("Error in signup controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email }).populate('roleId');;
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }


        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }


        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            roleName: user.roleId ? user.roleId.roleName : null,
            profilePic: user.profilePic || null,
        });
    } catch (error) {
        console.error("Error in login controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    try {
        // Clear the JWT cookie by setting its value to an empty string and expiration to 0
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }

        // Upload profile picture to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        // Update user's profile picture in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error in updateProfile function:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkAuth = async (req, res) => {
    try {

        const user = req.user;
        const role = await Role.findById(user.roleId);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        const userWithRole = {
            ...user.toObject(),
            roleName: role.roleName,
        };

        res.status(200).json(userWithRole);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const totalUser = async (req, res) => {
    try {
        const customerRole = await Role.findOne({ roleName: 'Customer' });
        const partnerRole = await Role.findOne({ roleName: 'Partner' });

        if (!customerRole || !partnerRole) {
            return res.status(404).json({ error: 'Role not Found' });
        }

        const customers = await User.find({ roleId: customerRole._id }).select('-password');
        const partners = await User.find({ roleId: partnerRole._id }).select('-password');

        // Count users
        const totalCustomers = customers.length;
        const totalPartners = partners.length;

        res.status(200).json({
            totalCustomers,
            totalPartners,
            customerDetails: customers,
            partnerDetails: partners,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500), json({ error: 'Internal Server Error' });
    }
};