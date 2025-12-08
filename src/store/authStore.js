"use client"
import { create } from "zustand";

export const useAuthStore = create((set) => ({
    user: null,
    plan: "free",
    token: null,
    loading: false,

    login: async (email, password) => {

        set({ loading: true });

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            set({
                user: data.user,
                plan: data.user.plan,
                token: data.token,
                loading: false
            });

            return { success: true }

        } catch (err) {
            return { success: false, message: err.message }
        }
    },

    logout: () => set({ user: null, plan: "free", token: null }),
}));
