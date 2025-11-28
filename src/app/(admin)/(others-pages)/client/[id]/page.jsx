"use client"; // this makes the page a Client Component
import { useParams } from "next/navigation";
import ClientDetails from "@/components/clients-profile/ClientDetails";

export default function ClientPage() {
    const { id } = useParams(); // get the dynamic route param

    return <ClientDetails clientId={id} />; // pass to your client component
}
