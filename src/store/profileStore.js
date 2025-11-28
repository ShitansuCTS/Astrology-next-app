import { create } from "zustand";

const useProfileStore = create((set, get) => ({
    user: null,
    loading: false,
    error: null,


    fetchProfile: async () => {
        // ✅ Return immediately if user is already loaded
        if (get().user) return get().user;

        set({ loading: true, error: null });

        try {
            const res = await fetch("/api/auth/profile", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // send cookies (JWT token)
            });

            const data = await res.json();

            if (!res.ok) {
                set({ error: data.message, loading: false });
                return null;
            }

            // ✅ Save fetched user in store
            set({ user: data.user, loading: false });
            return data.user;
        } catch (err) {
            console.error("Profile fetch error:", err);
            set({ error: err.message, loading: false });
            return null;
        }
    },
    updateProfile: async (updatedData) => {
        set({ loading: true });

        try {
            const res = await fetch("/api/auth/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            const data = await res.json();

            // update store and avoid refetching
            set({ user: data.user, loading: false });
            return { success: true, message: "Profile updated successfully" };
        } catch (err) {
            set({ loading: false, error: err.message });
            return { success: false };
        }
    },


    clearProfile: () => set({ user: null, error: null }),
}));

export default useProfileStore;
