"use client";
import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";

const Appointment = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventTitle, setEventTitle] = useState("");
    const [eventStartDate, setEventStartDate] = useState("");
    const [eventEndDate, setEventEndDate] = useState("");
    const [eventLevel, setEventLevel] = useState("Primary");
    const [events, setEvents] = useState([]);

    const calendarRef = useRef(null);
    const { isOpen, openModal, closeModal } = useModal();

    const calendarsEvents = {
        Danger: "danger",
        Success: "success",
        Primary: "primary",
        Warning: "warning",
    };

    // 👉 Fetch appointments of one astrologer
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await fetch(
                    "/api/appointments?astrologerId=6927f9ab0be82854e08bb523",
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );

                const data = await res.json();
                if (!res.ok) throw new Error(data.message);

                const calendarData = data.appointments.map((a) => ({
                    id: a._id,
                    title: a.notes || "Appointment",
                    start: a.date,
                    allDay: true,
                    extendedProps: { calendar: "Success" },
                }));

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

        setSelectedEvent(event);
        setEventTitle(event.title);
        setEventStartDate(event.start?.toISOString().split("T")[0] || "");
        setEventEndDate(event.end?.toISOString().split("T")[0] || "");
        setEventLevel(event.extendedProps?.calendar || "Primary");

        openModal();
    };

    // 👉 Add / Update event
    const handleAddOrUpdateEvent = () => {
        if (selectedEvent) {
            // UPDATE
            setEvents((prev) =>
                prev.map((ev) =>
                    ev.id === selectedEvent.id
                        ? {
                            ...ev,
                            title: eventTitle,
                            start: eventStartDate,
                            end: eventEndDate,
                            extendedProps: { calendar: eventLevel },
                        }
                        : ev
                )
            );
        } else {
            // ADD
            const newEvent = {
                id: Date.now().toString(),
                title: eventTitle,
                start: eventStartDate,
                end: eventEndDate,
                allDay: true,
                extendedProps: { calendar: eventLevel },
            };
            setEvents((prev) => [...prev, newEvent]);
        }

        closeModal();
        resetModalFields();
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
                className="max-w-[700px] p-6 lg:p-10"
            >
                <div className="flex flex-col px-2">
                    <h5 className="mb-2 text-xl font-semibold">
                        {selectedEvent ? "Edit Event" : "Add Event"}
                    </h5>

                    {/* TITLE */}
                    <label className="mt-4 text-sm">Event Title</label>
                    <input
                        type="text"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        className="input"
                    />

                    {/* START DATE */}
                    <label className="mt-4 text-sm">Start Date</label>
                    <input
                        type="date"
                        value={eventStartDate}
                        onChange={(e) => setEventStartDate(e.target.value)}
                        className="input"
                    />

                    {/* END DATE */}
                    <label className="mt-4 text-sm">End Date</label>
                    <input
                        type="date"
                        value={eventEndDate}
                        onChange={(e) => setEventEndDate(e.target.value)}
                        className="input"
                    />

                    {/* BUTTONS */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={closeModal} className="btn">Close</button>
                        <button
                            onClick={handleAddOrUpdateEvent}
                            className="btn bg-brand-500 text-white"
                        >
                            {selectedEvent ? "Update" : "Add Event"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

// 👉 Render each calendar event
const renderEventContent = (eventInfo) => {
    const calendarName = eventInfo.event.extendedProps?.calendar || "Primary";
    return (
        <div className="flex items-center p-1">
            <b>{eventInfo.timeText}</b>&nbsp;
            <i>{eventInfo.event.title}</i>
        </div>
    );
};

export default Appointment;
