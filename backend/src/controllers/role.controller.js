import Role from "../models/role.model.js";

const predefinedRoles = [
    { roleName: 'Customer', roleDescription: 'Regular user of the platform.' },
    { roleName: 'Admin', roleDescription: 'Administrator with full access.' },
    { roleName: 'Partner', roleDescription: 'Partner who lists vehicles for rental.' },
];

export const addPreDefinedRole = async (req, res) => {
    try {
        for (const role of predefinedRoles) {
            const existingRole = await Role.findOne({ roleName: role.roleName });

            if (!existingRole) {
                await Role.create(role);
                console.log(`Role "${role.roleName}" added successfully.`);
            } else {
                console.log(`Role "${role.roleName}" already exists.`);
            }
        }

        console.log('Predefined roles setup completed');
        return res.status(200).json({ message: 'Predefined roles setup completed.' });
    } catch (error) {
        console.error('Error adding predefined roles: ', error.message);
        return res.status(500).json({ message: 'Error adding predefined roles.', error: error.message });
    }
};

