"use client";

import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import useProfileStore from "@/store/profileStore"
import { Bot, Sparkles } from "lucide-react";


export default function AstrologerAI({ astrologerName = "Astrologer" }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);
    const { user, fetchProfile } = useProfileStore();

    useEffect(() => {
        if (!user) fetchProfile();
    }, []);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        setMessages((prev) => [...prev, { type: "user", text: input }]);
        setLoading(true);
        setInput("");

        try {
            const res = await fetch("/api/assistant/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });
            const data = await res.json();

            if (res.ok) {
                setMessages((prev) => [...prev, { type: "ai", text: data.answer }]);
            } else {
                toast.error(data.message || "Something went wrong!");
            }
        } catch (err) {
            toast.error("Network error! Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-min bg-gray-50 dark:bg-gray-900">

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-6 pb-32 flex flex-col justify-center">
                <div className="flex flex-col space-y-4 max-w-3xl mx-auto w-full">

                    {messages.length === 0 ? (


                        <div className="flex items-center justify-center h-full px-4">
                            <div className="w-full max-w-md p-0 md:p-8 text-center">

                                {/* Icon */}
                                <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                                    <Sparkles className="w-10 h-10 text-brand-500 dark:text-purple-300" />
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Hey {user?.fname}!
                                </h2>

                                {/* Subtitle */}
                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                    I’m <span className="font-semibold text-purple-700 dark:text-purple-300">Astrox AI</span>,
                                    here to help you access your clients, appointments and insights.
                                </p>

                            </div>
                        </div>





                    ) : (
                        messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-xs md:max-w-lg p-4 rounded-2xl shadow-lg wrap-break-words ${msg.type === "user"
                                        ? "bg-brand-600 text-white rounded-br-none"
                                        : "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-bl-none"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))
                    )}

                    {loading && (
                        <div className="flex justify-start">
                            <div className="max-w-xs md:max-w-lg p-4 rounded-2xl shadow-lg bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 animate-pulse">
                                Thinking...
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>
            </div>

            {/* Input area fixed at bottom */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent">
                <div className="flex items-center gap-3 w-full max-w-3xl mx-auto md:ml-[35%]">
                    <textarea
                        className="flex-1 pl-4 p-3 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                        rows={1}
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-brand-500 hover:bg-brand-700 text-white px-6 py-3 rounded-full shadow-lg disabled:opacity-50"
                        disabled={loading}
                    >
                        Send
                    </button>
                </div>
            </div>

        </div>
    );
}
