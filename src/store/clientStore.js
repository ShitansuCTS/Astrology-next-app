import { create } from "zustand";
import axios from "axios";

const useClientStore = create((set) => ({
    clients: [],          // all clients for the logged-in astrologer
    loading: false,
    error: null,

    // Fetch clients from backend
    fetchClients: async () => {
        set({ loading: true, error: null });

        try {
            const response = await axios.get("/api/clients"); // your GET route
            set({ clients: response.data.clients || [], loading: false });
        } catch (err) {
            console.error("Fetch clients error:", err);
            set({ error: err.response?.data?.message || err.message, loading: false });
        }
    }
}));

export default useClientStore;


