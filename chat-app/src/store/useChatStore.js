import { create } from 'zustand';
import toast from "react-hot-toast";
import axios from 'axios';
import { axiosInstance } from '../lib/axios';



export const useChatStore = create((set, get) => ({
    messages: [],
    members: [],
    selectedMember: null,
    isMembersLoading: false,
    isMessagesLoading: false,
    onlineMembers: [],


    getMembers: async (groupId) => {
        set({ isMessagesLoading: true });

        try {
            const res = await axiosInstance.get(`/member/${groupId}`);
            console.log("Group API response:", res.data);
            set({ members: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            set({ isMembersLoading: false })
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/chats/${userId}`);

            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    sendMessage: async (messageData) => {
        const { selectedMember, messages } = get();
        try {
            const res = await axiosInstance.post(`/send/${selectedMember._id}`, messageData);
            set({ messages: [...messages, res.data] })
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    //todo
    setSelectedMember: (selectedMember) => set({ selectedMember }),
}))