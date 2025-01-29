import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { CarFront } from "lucide-react";
import { usePartnerStore } from "../../store/usePartnerStore";
import { useVehicleStore } from '../../store/useVehicleStore';
import {
    IconButton,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
    Accordion,
    AccordionHeader,
    AccordionBody,
    Card,
} from "@material-tailwind/react";
import {
    PresentationChartBarIcon,
    ShoppingBagIcon,
    InboxIcon,
} from "@heroicons/react/24/solid";
import {
    ChevronRightIcon,
    ChevronDownIcon,
    Bars3Icon,
    XMarkIcon,
} from "@heroicons/react/24/outline";



export function AdminSideBar() {
    const [open, setOpen] = React.useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(window.innerWidth > 768); // Open by default on large screens

    React.useEffect(() => {
        // Update the drawer open state based on screen width when the window is resized
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setIsDrawerOpen(false); // Close on mobile
            } else {
                setIsDrawerOpen(true); // Open on larger screens
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen); // Toggle drawer state


    const {
        fetchPartnerData,
        totalPartnerRequest,
    } = usePartnerStore();

    useEffect(() => {
        fetchPartnerData();

    }, [fetchPartnerData]);


    const {
        fetchVehicleUpdateRequestData,
        totalUpdateRequest,
        totalUpdateResponce
    } = useVehicleStore();

    useEffect(() => {
        fetchVehicleUpdateRequestData();

    }, [fetchVehicleUpdateRequestData]);


    const myRequest = (Array.isArray(totalUpdateResponce) ? totalUpdateResponce : [])
        .filter(request => request.status === "pending" || request.status === "review");

    const numberOfPendingRequest = myRequest.length;

    return (
        <div className={`flex`}>
            {/* Toggle Button for Mobile */}
            <IconButton
                variant="text"
                size="lg"
                onClick={toggleDrawer}
                className="fixed z-50 top-15  left-0 lg:hidden"
            >
                {isDrawerOpen ? (
                    <XMarkIcon className="h-6 w-6 stroke-2" />
                ) : (
                    <Bars3Icon className="h-6 w-6 stroke-2" />
                )}
            </IconButton>

            {/* Sidebar */}
            <Card
                className={`fixed top-13 left-0 h-full w-[20rem] sm:max-w-[16rem] p-4 shadow-xl shadow-blue-gray-900/5 transition-all duration-300 ease-in-out ${isDrawerOpen ? "transform-none" : "-translate-x-full"} lg:transform-none lg:w-[20rem] z-40`}
            >
                <List>
                    <Accordion
                        open={open === 1}
                        icon={
                            <ChevronDownIcon
                                strokeWidth={2.5}
                                className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
                            />
                        }
                    >
                        <ListItem className="p-0" selected={open === 1}>
                            <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
                                <ListItemPrefix>
                                    <PresentationChartBarIcon className="h-5 w-5" />
                                </ListItemPrefix>
                                <Typography color="blue-gray" className="mr-auto font-normal">
                                    Admin
                                </Typography>
                            </AccordionHeader>
                        </ListItem>
                        <AccordionBody className="py-1">
                            <List className="p-0">
                                <ListItem>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    Dashboard
                                </ListItem>
                                <ListItem>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    <Link to="/UserDashboard">User Details</Link>
                                </ListItem>
                                <ListItem>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    Inbox
                                </ListItem>
                            </List>
                        </AccordionBody>

                    </Accordion>

                    <Accordion
                        open={open === 2}
                        icon={
                            <ChevronDownIcon
                                strokeWidth={2.5}
                                className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`}
                            />
                        }
                    >
                        <ListItem className="p-0" selected={open === 2}>
                            <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3">
                                <ListItemPrefix>
                                    <CarFront className="h-5 w-5" />
                                </ListItemPrefix>
                                <Typography color="blue-gray" className="mr-auto font-normal">
                                    Vehicle
                                </Typography>
                            </AccordionHeader>
                        </ListItem>
                        <AccordionBody className="py-1">
                            <List className="p-0">
                                <ListItem>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    <Link to="/VehicleDashboard">Dashboad</Link>
                                </ListItem>
                                <ListItem>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    <Link to="/AddVehicle">Add Vehicle</Link>
                                </ListItem>
                                <ListItem>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    <Link to="/ManageModel">Manage Models</Link>
                                </ListItem>
                            </List>
                        </AccordionBody>
                    </Accordion>

                    <hr className="my-2 border-blue-gray-50" />
                    <Accordion
                        open={open === 3}
                        icon={
                            <ChevronDownIcon
                                strokeWidth={2.5}
                                className={`mx-auto h-4 w-4 transition-transform ${open === 3 ? "rotate-180" : ""}`}
                            />
                        }
                    >
                        <ListItem className="p-0" selected={open === 3}>
                            <AccordionHeader onClick={() => handleOpen(3)} className="border-b-0 p-3">
                                <ListItemPrefix>
                                    <CarFront className="h-5 w-5" />
                                </ListItemPrefix>
                                <Typography color="blue-gray" className="mr-auto font-normal">
                                    Pending
                                </Typography>
                                {totalPartnerRequest + numberOfPendingRequest > 0 && (
                                    <Chip
                                        value={`${totalPartnerRequest + numberOfPendingRequest}`}
                                        size="sm"
                                        variant="ghost"
                                        color="blue-gray"
                                        className="rounded-full text-red-600"
                                    />
                                )}
                            </AccordionHeader>
                        </ListItem>
                        <AccordionBody className="py-1">
                            <List className="p-0">
                                <ListItem>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    <Link to="/PartnerRequest">Partner</Link>
                                    <ListItemSuffix>
                                        {totalPartnerRequest > 0 && (
                                            <Chip value={`${totalPartnerRequest}`} size="sm" variant="ghost" color="blue-gray" className="rounded-full text-red-600" />
                                        )}
                                    </ListItemSuffix>
                                </ListItem>
                                <ListItem>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    <Link to="/PartnerVehicleUpdateRequest">Request</Link>
                                    <ListItemSuffix>
                                        {numberOfPendingRequest > 0 && (
                                            <Chip value={`${numberOfPendingRequest}`} size="sm" variant="ghost" color="blue-gray" className="rounded-full text-red-600" />
                                        )}
                                    </ListItemSuffix>
                                </ListItem>
                            </List>
                        </AccordionBody>
                    </Accordion>

                    <ListItem>
                        <ListItemPrefix>
                            <InboxIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        link
                    </ListItem>

                </List>
            </Card>


        </div>
    );
}
