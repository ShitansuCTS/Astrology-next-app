
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import Appointment from "../../../../components/clients-profile/Apponments";

export const metadata = {
    title: "Next.js Calender | TailAdmin - Next.js Dashboard Template",
    description:
        "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
    // other metadata
};
export default function page() {
    return (
        <div>
            <PageBreadcrumb pageTitle="My shared calender" />
            <Appointment />
        </div>
    );
}
