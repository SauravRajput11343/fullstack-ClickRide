import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    mobile: {
        type: Number,
        required: true,
        minlength: 10,
    },
    dob: {
        type: Date,
        required: true,
    },
    profilePic: {
        type: String,
        default: "",
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
    },
    mustChangePassword: {
        type: Boolean,
        default: false
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    }

}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;
