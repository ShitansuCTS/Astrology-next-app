"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { Clock, Video, Phone, User } from "lucide-react";
import toast from "react-hot-toast";


const Appointment = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventTitle, setEventTitle] = useState("");
    const [eventStartDate, setEventStartDate] = useState("");
    const [eventEndDate, setEventEndDate] = useState("");
    const [eventLevel, setEventLevel] = useState("Primary");
    const [events, setEvents] = useState([]);

    const calendarRef = useRef(null);
    const { isOpen, openModal, closeModal } = useModal();
    

    const getColor = (type) => {
        switch (type) {
            case "consultation": return "#0284c7"; // blue
            case "follow-up": return "#059669"; // green
            case "special-reading": return "#9333ea"; // purple
            default: return "#475569"; // gray
        }
    };





    // 👉 Fetch appointments of one astrologer
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await fetch(
                    "/api/appointments",
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );

                const data = await res.json();
                console.log("The appointments are:", data.formattedAppointments);
                if (!res.ok) throw new Error(data.message);

                const calendarData = data.formattedAppointments.map((a) => ({
                    id: a._id,
                    title: a.type + " - " + a.timeSlot,
                    start: `${a.date.split("T")[0]}T${a.timeSlot}:00`,
                    allDay: false,
                    backgroundColor: getColor(a.type),
                    extendedProps: {
                        clientId: a.clientId._id,
                        clientName: a.clientId.name || a.clientName || "Unknown",
                        notes: a.notes,
                        mode: a.mode,
                        status: a.status,
                        type: a.type,
                        timeSlot: a.timeSlot,
                    },
                }));

                console.log("This is a calendar data", calendarData);

                setEvents(calendarData);
            } catch (err) {
                console.error("Error fetching appointments:", err);
            }
        };

        fetchAppointments();
    }, []);

    // 👉 FIX: receives selectInfo correctly
    const handleDateSelect = (selectInfo) => {
        resetModalFields();
        setEventStartDate(selectInfo.startStr);
        setEventEndDate(selectInfo.endStr || selectInfo.startStr);
        openModal();
    };

    // 👉 Click event → open modal with event details
    const handleEventClick = (clickInfo) => {
        const event = clickInfo.event;
        const props = event.extendedProps;

        setSelectedEvent(event);

        // prefill fields
        setEventTitle(event.title);
        setEventStartDate(event.startStr.split("T")[0]);
        setEventEndDate(event.endStr?.split("T")[0] || event.startStr.split("T")[0]);

        openModal();
    };


    // 👉 Add / Update event
    const handleAddOrUpdateEvent = async () => {
        if (!selectedEvent) return;

        const appointmentId = selectedEvent?._def?.publicId;
        const status = selectedEvent?.extendedProps?.status;

        try {
            const res = await fetch("/api/appointments", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ appointmentId, status }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            // update UI instantly
            setEvents((prev) =>
                prev.map((ev) =>
                    ev.id === appointmentId
                        ? {
                            ...ev,
                            extendedProps: {
                                ...ev.extendedProps,
                                status,
                            },
                        }
                        : ev
                )
            );

            toast.success(data.message || "Appointment updated successfully!");

            closeModal();
            resetModalFields();
        } catch (error) {
            console.log(error);
            toast.error(error.message || "Something went wrong!");
        }
    };



    const resetModalFields = () => {
        setEventTitle("");
        setEventStartDate("");
        setEventEndDate("");
        setEventLevel("Primary");
        setSelectedEvent(null);
    };




    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                selectable
                select={handleDateSelect}
                events={events}
                eventClick={handleEventClick}
                eventContent={renderEventContent}
                headerToolbar={{
                    left: "prev,next today addEventButton",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                customButtons={{
                    addEventButton: {
                        text: "Add Event +",
                        click: openModal,
                    },
                }}
            />

            {/* MODAL */}
            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                className="max-w-[700px]"
            >
                <div className="flex flex-col gap-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 p-6">

                    <h5 className="text-xl font-semibold mb-2">
                        Appointment Details
                    </h5>

                    {/* CLIENT NAME */}
                    <label className="text-sm">Client Name</label>
                    <input
                        disabled
                        value={selectedEvent?.extendedProps.clientName || ""}
                        className="p-2 rounded bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                    />

                    {/* NOTES */}
                    <label className="text-sm">Notes</label>
                    <textarea
                        rows={4}
                        value={selectedEvent?.extendedProps.notes || ""}
                        disabled
                        className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
                    />

                    {/* STATUS */}
                    <label className="text-sm">Status</label>
                    <select
                        value={selectedEvent?.extendedProps.status}
                        onChange={(e) =>
                            setSelectedEvent((prev) => ({
                                ...prev,
                                extendedProps: {
                                    ...prev.extendedProps,
                                    status: e.target.value,
                                },
                            }))
                        }
                        className="p-2 bg-gray-50 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded"
                    >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    {/* BUTTONS */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
                        >
                            Close
                        </button>

                        <button
                            onClick={handleAddOrUpdateEvent}
                            className="px-4 py-2 rounded bg-brand-500 text-white"
                        >
                            Update
                        </button>
                    </div>

                </div>
            </Modal>


        </div>
    );
};

// 👉 Render each calendar event
const renderEventContent = (info) => {
    const { type, mode, timeSlot, status, notes, clientId } = info.event.extendedProps;

    const iconByMode = {
        online: <Video size={12} />,
        "in-person": <User size={12} />,
        phone: <Phone size={12} />,
    };

    const colorByType = {
        "follow-up": "bg-blue-500",
        consultation: "bg-emerald-500",
        "special-reading": "bg-purple-500",
        default: "bg-gray-500",
    };

    const statusColor = {
        completed: "bg-green-500",
        scheduled: "bg-yellow-500",
        cancelled: "bg-red-500",
    };

    return (
        <div className="relative group"> {/* Make this relative and a group for hover */}
            <div className="
              p-2 rounded-md 
              bg-brand-500 text-white 
              dark:bg-white dark:text-black  
              shadow border border-gray-200 
              min-w-[120px] w-full flex flex-col gap-1
            ">
                {/* Row: type + time */}
                <div className="flex items-center justify-between">
                    <div className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[12px] text-white font-medium ${colorByType[type] || colorByType.default}`}>
                        {type}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-medium ml-2">
                        <span className={`h-2 w-2 rounded-full ${statusColor[status] || "bg-gray-400"}`} />
                        <span className="capitalize">{status}</span>
                    </div>
                </div>
            </div>

            {/* Hover Popover */}
            <div className="
  absolute left-1/2 -translate-x-1/2 bottom-full mb-2
  hidden group-hover:flex flex-col bg-white dark:bg-gray-800
  shadow-xl border border-gray-200 dark:border-gray-600
  p-3 rounded-lg w-60 z-[9999] text-sm text-gray-900 dark:text-gray-100
  space-y-1
  max-w-xs
">
                <div><span className="font-semibold">Client:</span> {info.event.extendedProps.clientName}</div>
                <div><span className="font-semibold">Notes:</span> {notes}</div>
                <div><span className="font-semibold">Mode:</span> {mode}</div>
                <div><span className="font-semibold">Time:</span> {timeSlot}</div>
            </div>



        </div>
    );
};




export default Appointment;
