'use client'

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";



export default function KundliPage() {
    const { id } = useParams()
    const [kundli, setKundli] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchKundli = async () => {
            try {
                const res = await fetch(`/api/kundli?clientId=${id}`, {
                    credentials: "include", // send token cookies
                });
                const data = await res.json();

                if (res.ok) {
                    setKundli(data.kundli);
                } else {
                    alert(data.message || "No Kundli found");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchKundli();
    }, [id]);

    if (loading) return <p>Loading Kundli...</p>;
    if (!kundli) return <p>No Kundli available</p>;

    return (
        <div>
            <PageBreadcrumb pageTitle="User Kundli" />

            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white dark:bg-[#0f0f0f] dark:border-gray-800 px-5 py-7 xl:px-10 xl:py-12">

                <div className="mx-auto w-full max-w-2xl text-center">
                    <h3 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
                        User Kundli
                    </h3>

                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        Below is the kundli data fetched from your profile.
                    </p>

                    {/* Kundli Card */}
                    <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 text-left">

                        <h2 className="text-xl font-semibold mb-4 text-brand-500 dark:text-brand-400">
                            Kundli Details
                        </h2>

                        <p className="mb-3 text-gray-700 dark:text-gray-300">
                            <span className="font-medium">DOB:</span> {kundli.dob}
                        </p>

                        <div className="mb-6 bg-brand-500/10 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 px-4 py-2 rounded-lg border border-brand-500/20">
                            Ayanamsa: <span className="font-semibold">{kundli.ayanamsa}</span>
                        </div>

                        {/* Planet Table */}
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                            Planet Positions
                        </h3>

                        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 dark:bg-brand-500/20">
                                    <tr>
                                        <th className="py-2 px-3 text-left dark:text-gray-200">Planet</th>
                                        <th className="py-2 px-3 text-left dark:text-gray-200">Sign</th>
                                        <th className="py-2 px-3 text-left dark:text-gray-200">House</th>
                                        <th className="py-2 px-3 text-left dark:text-gray-200">Degree</th>
                                        <th className="py-2 px-3 text-left dark:text-gray-200">R</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {Object.entries(kundli.planets).map(([planet, data]) => (
                                        <tr key={planet}>
                                            <td className="py-2 px-3 text-gray-800 dark:text-gray-300">{planet}</td>
                                            <td className="py-2 px-3 text-gray-700 dark:text-gray-400">{data.current_sign}</td>
                                            <td className="py-2 px-3 text-gray-700 dark:text-gray-400">{data.house_number}</td>
                                            <td className="py-2 px-3 text-gray-700 dark:text-gray-400">{data.fullDegree.toFixed(2)}</td>
                                            <td className="py-2 px-3 text-gray-700 dark:text-gray-400">
                                                {data.isRetro ? "Yes" : "No"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
