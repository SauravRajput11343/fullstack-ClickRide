import React from 'react'
import Header from "../Header/Header";
import { CustomerSideNav } from '../Customer/CustomerSideNav';
export default function CustomerLayout({ children }) {
    const isDrawerOpen = true;
    return (
        <div>
            <Header />
            <CustomerSideNav />
            <div className={`transition-all duration-300 ${isDrawerOpen ? "lg:pl-[16rem]" : ""} mt-16`}>{children}

            </div>
        </div>
    )
}
