import React from "react";
import AdminNav from "../AdminNav/AdminNav";
import { PartnerSideBar } from "../PartnerSideBar/PartnerSideBar";

export default function AdminLayout({ children }) {
    const isDrawerOpen = true;
    return (
        <div>
            <AdminNav />
            <PartnerSideBar />
            <div className={`transition-all duration-300 ${isDrawerOpen ? "lg:pl-[16rem]" : ""}`}>{children}
            </div>
        </div>
    );
}
