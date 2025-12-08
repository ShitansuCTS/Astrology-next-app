'use client'

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Crown } from "lucide-react"
import useProfileStore from "@/store/profileStore"
import { useEffect } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/button/Button";

export default function Plan() {
    const { user, fetchProfile } = useProfileStore();

    useEffect(() => {
        fetchProfile();
    }, []);


    const handelUpgrade = () => {
        toast.success("Upgrade to premium..!")
    }

    return (
        <div className="bg-white dark:bg-gray-900">
            <PageBreadcrumb pageTitle="Pricing" />

            {/* Section Header */}
            <div className="py-4 px-6 text-center max-w-4xl mx-auto">
                <h2 className="text-indigo-500 dark:text-indigo-400 text-base font-semibold">Pricing</h2>
                <p className="mt-2 md:text-3xl font-bold text-gray-900 dark:text-white sm:text-6xl">
                    Choose the right plan for you
                </p>

            </div>

            {/* Pricing Cards */}
            <div className="max-w-4xl mx-auto grid gap-8 sm:grid-cols-2 px-2 pb-16">
                {/* Free Forever */}
                <div className="relative rounded-3xl bg-white dark:bg-white/5 p-8 ring-1 ring-gray-200 dark:ring-white/10 text-center flex flex-col">
                    <h3 className="text-indigo-500 dark:text-indigo-400 text-lg font-semibold">Free Forever (Basic Plan)</h3>
                    <p className="mt-4 text-5xl font-bold text-gray-900 dark:text-white">
                        $0
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">Get started with basic features forever</p>

                    <ul className="mt-6 space-y-3 text-gray-700 dark:text-gray-300 text-left flex-1">
                        <li className="flex items-center gap-x-3">
                            <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                            </svg>
                            Max 20 User Add
                        </li>
                        <li className="flex items-center gap-x-3">
                            <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                            </svg>
                            Max 5 Question with Astrox (AI)
                        </li>
                        <li className="flex items-center gap-x-3">
                            <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                            </svg>
                            Very Basic and no Analysis
                        </li>
                        <li className="flex items-center gap-x-3">
                            <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                            </svg>
                            Community Support (Only Chat)
                        </li>
                    </ul>

                    <Button  disabled className="mt-6 inline-block rounded-md bg-indigo-500 dark:bg-white/10 px-4 py-2.5 text-white dark:text-white font-semibold hover:bg-indigo-400 dark:hover:bg-white/20 " >
                        Get Started
                    </Button>
                </div>

                {/* Premium */}
                <div className="relative rounded-3xl bg-gray-100 dark:bg-gray-800 p-8 ring-1 ring-gray-200 dark:ring-white/10 text-center flex flex-col">
                    <h3 className="text-indigo-500 dark:text-indigo-400 text-lg font-semibold">Premium</h3>
                    <p className="mt-4 text-5xl font-bold text-gray-900 dark:text-white">
                        $99
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">Full access to all features for growing teams</p>

                    <ul className="mt-6 space-y-3 text-gray-700 dark:text-gray-300 text-left flex-1">
                        <li className="flex items-center gap-x-3">
                            <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                            </svg>
                            Unlimited User Addition
                        </li>
                        <li className="flex items-center gap-x-3">
                            <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                            </svg>
                            Unlimited Q&A with Astrox (AI)
                        </li>
                        <li className="flex items-center gap-x-3">
                            <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                            </svg>
                            Primium Analysis Supports
                        </li>
                        <li className="flex items-center gap-x-3">
                            <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                            </svg>
                            Community Support ( Chat + Voice + Email)
                        </li>
                    </ul>

                    <Button  onClick={handelUpgrade} className="mt-6 inline-block rounded-md bg-indigo-500 dark:bg-indigo-500 px-4 py-2.5 text-white font-semibold hover:bg-indigo-400">
                        Upgrade Now
                    </Button>
                </div>
            </div>

        </div>
    );
}
