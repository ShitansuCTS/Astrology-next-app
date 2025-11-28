"use client";
import React from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import useProfileStore from "@/store/profileStore"
import { useEffect } from "react";
import toast from "react-hot-toast";


export default function ClientDetails({ clientId }) {

    // console.log(clientId)



    return (
        // <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        //     <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        //         <div>
        //             <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
        //                 Personal Information
        //             </h4>

        //             <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
        //                 <div>
        //                     <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
        //                         First Name
        //                     </p>
        //                     <p className="text-sm font-medium text-gray-800 dark:text-white/90">
        //                         {client?.fname}
        //                     </p>
        //                 </div>

        //                 <div>
        //                     <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
        //                         Last Name
        //                     </p>
        //                     <p className="text-sm font-medium text-gray-800 dark:text-white/90">
        //                         {client?.lname}
        //                     </p>
        //                 </div>

        //                 <div>
        //                     <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
        //                         Email address
        //                     </p>
        //                     <p className="text-sm font-medium text-gray-800 dark:text-white/90">
        //                         {client?.email}
        //                     </p>
        //                 </div>

        //                 <div>
        //                     <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
        //                         Phone
        //                     </p>
        //                     <p className="text-sm font-medium text-gray-800 dark:text-white/90">
        //                         {client?.phone || "No phone found"}
        //                     </p>
        //                 </div>

        //                 <div>
        //                     <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
        //                         Role
        //                     </p>
        //                     <p className="text-sm font-medium text-gray-800 dark:text-white/90">
        //                         s
        //                     </p>
        //                 </div>
        //             </div>
        //         </div>


        //     </div>


        // </div>
        <>
            <h1>Hey client {clientId}</h1>
        </>
    );
}
