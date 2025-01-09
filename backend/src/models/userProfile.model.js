import mongoose from "mongoose";
const userProfileSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    profilePicUrl: {
        type: String,
        default: "",
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    address: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;