'use client'
import React, { useEffect } from 'react'
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { FileSearch } from 'lucide-react'


const KundliCreation = ({ client }) => {
    const router = useRouter()

    useEffect(() => {
        console.log("The client is :", client);
    }, [client]);


    const fetchKundli = async () => {
        try {
            const res = await fetch("/api/kundli", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",   // IMPORTANT
                body: JSON.stringify({
                    clientId: client
                })
            });

            const data = await res.json();
            // console.log(data);
            toast.success("Kundli created successfully");
            router.push(`/client/${client}/kundli`);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <button className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm text-white hover:bg-brand-600 transition" onClick={fetchKundli}>
                <FileSearch className="w-4 h-4" />
            View Kundli</button>
    )
}

export default KundliCreation
