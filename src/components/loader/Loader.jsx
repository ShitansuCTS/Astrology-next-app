'use client';

import { LoaderIcon } from "lucide-react";

export default function Loader() {
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <LoaderIcon className="h-8 w-8 animate-spin text-white" />
        </div>

    );
}