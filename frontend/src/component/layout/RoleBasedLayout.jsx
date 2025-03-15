import React from "react";
import AdminLayout from "../layout/AdminLayout";
import PartnerLayout from "../layout/PartnerLayout";
import CustomerLayout from "./CustomerLayout";

const RoleBasedLayout = ({ UserRole, children }) => {
    if (UserRole === "Admin") {
        return <AdminLayout>{children}</AdminLayout>;
    } else if (UserRole === "Partner") {
        return <PartnerLayout>{children}</PartnerLayout>;
    } else if (UserRole === "Customer") {
        return <CustomerLayout>{children}</CustomerLayout>
    } else {
        return <>{children}</>;
    }
};

export default RoleBasedLayout;
