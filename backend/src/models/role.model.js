import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
    },
    roleDescription: {
        type: String,
    }

}, {
    timestamps: true
});

const Role = mongoose.model("Role", roleSchema);

export default Role;