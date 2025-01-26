import React from "react";
import AdminNav from "../AdminNav/AdminNav";
import { AdminSideBar } from "../AdminSideBar/AdminSideBar";

export default function AdminLayout({ children }) {
    const isDrawerOpen = true;
    return (
        <div>
            <AdminNav />
            <AdminSideBar />
            <div className={`transition-all duration-300 ${isDrawerOpen ? "lg:pl-[16rem]" : ""}`}>{children}

            </div>
        </div>
    );
}
