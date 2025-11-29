"use client";
import React from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import useProfileStore from "@/store/profileStore"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Image from "next/image";
import { format } from "timeago.js"
import { Edit2, Trash2, Plus } from "lucide-react";
import Badge from "../ui/badge/Badge";
import DatePicker from '@/components/form/date-picker';
// import Appointment from "./Apponments";





export default function ClientDetails({ clientId }) {
    const [client, setClient] = React.useState({});
    const [notes, setNotes] = useState([])
    const [getAstorlogerId, setGetAstorlogerId] = useState("")
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
    const [currentNote, setCurrentNote] = useState({ text: "", _id: null });
    const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
    const [appointments, setAppointments] = useState([]);

    const [appointmentData, setAppointmentData] = useState({
        clientId: "",
        astrologerId: "",
        date: "",
        timeSlot: "",
        type: "",
        notes: "",
    });

    const openModal = (mode = "add", note = { text: "", _id: null }) => {
        setModalMode(mode);
        setCurrentNote(note);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        const gettingInfo = async () => {
            try {
                const response = await axios.get("/api/client-details", {
                    params: { clientId }, // query param
                });

                // Axios already parses JSON, so use response.data
                // console.log("The JSON data is:", response.data);
                setClient(response.data.client);
                setGetAstorlogerId(response.data.client.astrologerId)
            } catch (error) {
                console.error("Error fetching client details:", error);
            }
        };

        gettingInfo();
    }, [clientId]); // always include clientId as dependency


    useEffect(() => {
        if (!clientId || !getAstorlogerId) return;

        const fetchNotes = async () => {
            try {
                setLoading(true);

                const res = await axios.get("/api/notes", {
                    params: { clientId, astrologerId: getAstorlogerId },
                    withCredentials: true, // <-- important (sends cookies)
                });

                setNotes(res.data.notes);
                // console.log(res.data.notes)
            } catch (err) {
                setError(
                    err.response?.data?.message || "Failed to fetch notes"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, [clientId, getAstorlogerId]);


    const handleSaveNote = async () => {
        if (!currentNote.text.trim()) return toast.error("Note cannot be empty");

        try {
            let res;
            if (modalMode === "add") {
                res = await axios.post(
                    "/api/notes",
                    {
                        clientId,
                        astrologerId: getAstorlogerId,
                        text: currentNote.text
                    },
                    { withCredentials: true } // send cookies for auth
                );
                setNotes([res.data.note, ...notes]); // add new note to state
                toast.success("Note added successfully");
            } else {
                // Edit existing note
                res = await axios.put(
                    `/api/notes/${currentNote._id}`,
                    { text: currentNote.text },
                    { withCredentials: true }
                );
                setNotes(notes.map(n => n._id === currentNote._id ? res.data.note : n));
                toast.success("Note updated successfully");
            }
            closeModal();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save note");
        }
    };


    // Handle delete note
    const handleDeleteNote = async (id) => {
        if (!confirm("Are you sure you want to delete this note?")) return;
        try {
            await axios.delete(`/api/notes/${id}`, { withCredentials: true });
            setNotes(notes.filter(n => n._id !== id));
            toast.success("Note deleted successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete note");
        }
    };

    // Update a field
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointmentData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetFields = () => {
        setAppointmentData({
            clientId: "",
            astrologerId: "",
            date: "",
            timeSlot: "",
            type: "",
            notes: "",
        });
    };




    // Functions to open/close the modal
    const openAppointmentModal = () => setIsAppointmentOpen(true);
    const closeAppointmentModal = () => setIsAppointmentOpen(false);


    const handleSubmit = async () => {
        const dataToSend = {
            clientId,          // pass from props or state
            astrologerId: getAstorlogerId, // pass from state
            date: appointmentData.date,
            timeSlot: appointmentData.timeSlot,
            type: appointmentData.type,
            notes: appointmentData.notes,
        };

        if (!dataToSend.clientId || !dataToSend.astrologerId || !dataToSend.date || !dataToSend.timeSlot || !dataToSend.notes) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Failed to create appointment");

            toast.success("Appointment created successfully!");
            closeAppointmentModal();
            resetFields();
            setAppointments([result.appointment, ...appointments]);

        } catch (err) {
            toast.error(err.message);
        }
    };


    useEffect(() => {
        // wait until BOTH are available
        if (!clientId || !getAstorlogerId) return;

        const fetchAppointments = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `/api/appointments?clientId=${clientId}&astrologerId=${getAstorlogerId}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    }
                );

                if (!res.ok) throw new Error("Failed to fetch appointments");

                const data = await res.json();
                setAppointments(data.appointments);
                console.log("Appointments:", data.appointments);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [clientId, getAstorlogerId]);







    return (
        <>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                        <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                            <Image
                                width={80}
                                height={80}
                                src="/images/user/owner.jpg"
                                alt="user"
                            />
                        </div>
                        <div className="order-3 xl:order-2">
                            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                {client.name}
                            </h4>
                            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Joined {client?.createdAt ? format(client.createdAt) : ""}
                                </p>
                                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {client?.address}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
                            <a
                                target="_blank"
                                rel="noreferrer" href='https://www.facebook.com/PimjoHQ' className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                                <svg
                                    className="fill-current"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M11.6666 11.2503H13.7499L14.5833 7.91699H11.6666V6.25033C11.6666 5.39251 11.6666 4.58366 13.3333 4.58366H14.5833V1.78374C14.3118 1.7477 13.2858 1.66699 12.2023 1.66699C9.94025 1.66699 8.33325 3.04771 8.33325 5.58342V7.91699H5.83325V11.2503H8.33325V18.3337H11.6666V11.2503Z"
                                        fill=""
                                    />
                                </svg>
                            </a>

                            <a href='https://x.com/PimjoHQ' target="_blank"
                                rel="noreferrer" className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                                <svg
                                    className="fill-current"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M15.1708 1.875H17.9274L11.9049 8.75833L18.9899 18.125H13.4424L9.09742 12.4442L4.12578 18.125H1.36745L7.80912 10.7625L1.01245 1.875H6.70078L10.6283 7.0675L15.1708 1.875ZM14.2033 16.475H15.7308L5.87078 3.43833H4.23162L14.2033 16.475Z"
                                        fill=""
                                    />
                                </svg>
                            </a>

                            <a href="https://www.linkedin.com/company/pimjo" target="_blank"
                                rel="noreferrer" className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                                <svg
                                    className="fill-current"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5.78381 4.16645C5.78351 4.84504 5.37181 5.45569 4.74286 5.71045C4.11391 5.96521 3.39331 5.81321 2.92083 5.32613C2.44836 4.83904 2.31837 4.11413 2.59216 3.49323C2.86596 2.87233 3.48886 2.47942 4.16715 2.49978C5.06804 2.52682 5.78422 3.26515 5.78381 4.16645ZM5.83381 7.06645H2.50048V17.4998H5.83381V7.06645ZM11.1005 7.06645H7.78381V17.4998H11.0672V12.0248C11.0672 8.97475 15.0422 8.69142 15.0422 12.0248V17.4998H18.3338V10.8914C18.3338 5.74978 12.4505 5.94145 11.0672 8.46642L11.1005 7.06645Z"
                                        fill=""
                                    />
                                </svg>
                            </a>

                            <a href='https://instagram.com/PimjoHQ' target="_blank"
                                rel="noreferrer" className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
                                <svg
                                    className="fill-current"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M10.8567 1.66699C11.7946 1.66854 12.2698 1.67351 12.6805 1.68573L12.8422 1.69102C13.0291 1.69766 13.2134 1.70599 13.4357 1.71641C14.3224 1.75738 14.9273 1.89766 15.4586 2.10391C16.0078 2.31572 16.4717 2.60183 16.9349 3.06503C17.3974 3.52822 17.6836 3.99349 17.8961 4.54141C18.1016 5.07197 18.2419 5.67753 18.2836 6.56433C18.2935 6.78655 18.3015 6.97088 18.3081 7.15775L18.3133 7.31949C18.3255 7.73011 18.3311 8.20543 18.3328 9.1433L18.3335 9.76463C18.3336 9.84055 18.3336 9.91888 18.3336 9.99972L18.3335 10.2348L18.333 10.8562C18.3314 11.794 18.3265 12.2694 18.3142 12.68L18.3089 12.8417C18.3023 13.0286 18.294 13.213 18.2836 13.4351C18.2426 14.322 18.1016 14.9268 17.8961 15.458C17.6842 16.0074 17.3974 16.4713 16.9349 16.9345C16.4717 17.397 16.0057 17.6831 15.4586 17.8955C14.9273 18.1011 14.3224 18.2414 13.4357 18.2831C13.2134 18.293 13.0291 18.3011 12.8422 18.3076L12.6805 18.3128C12.2698 18.3251 11.7946 18.3306 10.8567 18.3324L10.2353 18.333C10.1594 18.333 10.0811 18.333 10.0002 18.333H9.76516L9.14375 18.3325C8.20591 18.331 7.7306 18.326 7.31997 18.3137L7.15824 18.3085C6.97136 18.3018 6.78703 18.2935 6.56481 18.2831C5.67801 18.2421 5.07384 18.1011 4.5419 17.8955C3.99328 17.6838 3.5287 17.397 3.06551 16.9345C2.60231 16.4713 2.3169 16.0053 2.1044 15.458C1.89815 14.9268 1.75856 14.322 1.7169 13.4351C1.707 13.213 1.69892 13.0286 1.69238 12.8417L1.68714 12.68C1.67495 12.2694 1.66939 11.794 1.66759 10.8562L1.66748 9.1433C1.66903 8.20543 1.67399 7.73011 1.68621 7.31949L1.69151 7.15775C1.69815 6.97088 1.70648 6.78655 1.7169 6.56433C1.75786 5.67683 1.89815 5.07266 2.1044 4.54141C2.3162 3.9928 2.60231 3.52822 3.06551 3.06503C3.5287 2.60183 3.99398 2.31641 4.5419 2.10391C5.07315 1.89766 5.67731 1.75808 6.56481 1.71641C6.78703 1.70652 6.97136 1.69844 7.15824 1.6919L7.31997 1.68666C7.7306 1.67446 8.20591 1.6689 9.14375 1.6671L10.8567 1.66699ZM10.0002 5.83308C7.69781 5.83308 5.83356 7.69935 5.83356 9.99972C5.83356 12.3021 7.69984 14.1664 10.0002 14.1664C12.3027 14.1664 14.1669 12.3001 14.1669 9.99972C14.1669 7.69732 12.3006 5.83308 10.0002 5.83308ZM10.0002 7.49974C11.381 7.49974 12.5002 8.61863 12.5002 9.99972C12.5002 11.3805 11.3813 12.4997 10.0002 12.4997C8.6195 12.4997 7.50023 11.3809 7.50023 9.99972C7.50023 8.61897 8.61908 7.49974 10.0002 7.49974ZM14.3752 4.58308C13.8008 4.58308 13.3336 5.04967 13.3336 5.62403C13.3336 6.19841 13.8002 6.66572 14.3752 6.66572C14.9496 6.66572 15.4169 6.19913 15.4169 5.62403C15.4169 5.04967 14.9488 4.58236 14.3752 4.58308Z"
                                        fill=""
                                    />
                                </svg>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mt-2">

                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-10">

                    {/* LEFT: Personal Info */}
                    <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
                            Personal Information
                        </h4>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                            <div>
                                <p className="mb-2 text-xs text-gray-500">First Name</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {client.name}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs text-gray-500">Last Name</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {client.name}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs text-gray-500">Email address</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {client?.email}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs text-gray-500">Phone</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {client?.phone || "No phone found"}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs text-gray-500">Date Of Birth</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {new Date(client.dob).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs text-gray-500">Time Of Birth</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {client?.tob}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* MIDDLE Vertical Divider */}
                    <div className="hidden lg:block w-px bg-gray-300 dark:bg-gray-700"></div>

                    {/* RIGHT: Appointments */}
                    <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                            Last Appointments
                        </h4>

                        {/* SCROLL AREA */}
                        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">

                            {appointments.length === 0 && (
                                <p className="text-gray-500 text-sm">No appointments found.</p>
                            )}

                            {/* APPOINTMENT LIST */}
                            <div className="space-y-3">
                                {[...appointments]
                                    .slice(-5) // last 5 appointments
                                    .reverse() // optional: latest first
                                    .map((item) => (
                                        <div
                                            key={item._id}
                                            className="flex justify-between items-center"
                                        >
                                            {/* LEFT — Status + Notes */}
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                                    {item.status || "Done"}
                                                </span>

                                                <p className="text-sm text-gray-800 dark:text-gray-300 max-w-xs truncate">
                                                    {item.notes}
                                                </p>
                                            </div>

                                            {/* RIGHT — DATE */}
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(item.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))
                                }

                            </div>
                        </div>

                        {/* BUTTON OUTSIDE SCROLL AREA */}
                        <button
                            onClick={openAppointmentModal}
                            className="mt-5 w-full rounded-lg bg-brand-500 px-4 py-2.5 text-white hover:bg-brand-600"
                        >
                            Create Appointment
                        </button>
                    </div>


                </div>
            </div>




            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 mt-2">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        All Notes
                    </h4>
                    {/* <Button size="sm" onClick={() => openModal("add")}>
                       <Plus size={16} /> Add Note
                    </Button> */}
                    <Button
                        onClick={() => openModal("add")}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                    >
                        <Plus size={16} /> Add Note
                    </Button>

                </div>

                {loading && <p>Loading notes...</p>}

                {!loading && notes.length === 0 && <p>No notes found for this client.</p>}

                <div className="space-y-3">
                    {notes.map(note => (
                        <div key={note._id} className="flex justify-between items-start border p-4 rounded shadow bg-white dark:bg-gray-800">
                            <div>

                                <Badge size="sm" color="success">
                                    Visit: {new Date(note.visitDate).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </Badge>
                                <p className="text-gray-800 dark:text-white/90">{note.text}</p>
                            </div>
                            <div className="flex gap-2">
                                {/* Edit Button */}
                                <button
                                    onClick={() => openModal("edit", note)}
                                    className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    title="Edit Note"
                                >
                                    <Edit2 size={16} />
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDeleteNote(note._id)}
                                    className="flex items-center justify-center w-8 h-8 rounded-full border border-red-400 bg-red-100 text-red-600 hover:bg-red-200 dark:border-red-600 dark:bg-red-800 dark:text-red-200 dark:hover:bg-red-700"
                                    title="Delete Note"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Modal for Add/Edit */}
                <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-[500px] m-4">
                    <div className="w-full rounded-3xl bg-white p-6 dark:bg-gray-900">
                        <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">
                            {modalMode === "add" ? "Add Note" : "Edit Note"}
                        </h4>
                        <textarea
                            className="w-full h-32 p-3 border rounded-lg dark:bg-gray-800 dark:text-white/90"
                            value={currentNote.text}
                            onChange={(e) => setCurrentNote({ ...currentNote, text: e.target.value })}
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleSaveNote}>
                                Save
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>





            {/* Appointment modal */}
            <Modal
                isOpen={isAppointmentOpen}
                onClose={closeAppointmentModal}
                className="max-w-[700px] p-6 lg:p-10"
            >
                <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
                    <div>
                        <h5 className="mb-2 font-semibold text-gray-800 dark:text-white/90 text-xl lg:text-2xl">
                            Create Appointment
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Schedule a new appointment for your client with all the necessary details
                        </p>
                    </div>

                    <div className="mt-6 flex flex-col gap-4">
                        {/* Date */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Appointment Date
                            </label>
                            <DatePicker
                                id="date-picker"
                                placeholder="Select a date"
                                value={appointmentData.date}
                                onChange={(dates, currentDateString) => {
                                    // Update your state
                                    handleChange({
                                        target: { name: "date", value: currentDateString },
                                    });
                                }}
                                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                            />
                        </div>

                        {/* Time */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Time Slot
                            </label>
                            <input
                                type="time"
                                value={appointmentData.timeSlot}
                                onChange={handleChange}
                                name="timeSlot"
                                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                            />
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Notes (optional)
                            </label>
                            <textarea
                                placeholder="Add any notes for the appointment"
                                value={appointmentData.notes}
                                onChange={handleChange}
                                name="notes"
                                className="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
                        <button
                            onClick={closeAppointmentModal}
                            type="button"
                            className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            type="button"
                            className="btn btn-success flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
                        >
                            Save Appointment
                        </button>
                    </div>
                </div>
            </Modal>


            {/* <Appointment /> */}

        </>

    );
}
