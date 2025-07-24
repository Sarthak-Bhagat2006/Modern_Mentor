// store/useAuthStore.js
import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => ({
    currUser: null,
    fetchCurrUser: async () => {
        try {
            const res = await axios.get("http://localhost:8080/users/me", {
                withCredentials: true,
            });
            set({ currUser: res.data.currUser });
        } catch (err) {
            console.error("Failed to fetch user:", err);
        }
    },
}));