import mongoose from "mongoose";

const partnerRequestSchema = new mongoose.Schema({
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
        minlength: 6,
        default: null,
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
    profileVideo: {
        type: String,
        default: "",
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true,
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true,
    },

}, {
    timestamps: true
});

const PartnerRequest = mongoose.model("PartnerRequest", partnerRequestSchema);

export default PartnerRequest;
