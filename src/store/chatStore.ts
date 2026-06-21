import { create } from "zustand";
import type { ChatMessage } from "../types/chat";
import { persist } from "zustand/middleware";

interface ChatState {
    messages: ChatMessage[];
    addMessage: (message: ChatMessage) => void;
}
export const useChatStore=create<ChatState>()(
    persist(
        (set) => ({
            messages: [],
            addMessage: (message) =>
                set((state) => ({
                    messages: [...state.messages, message],
                })),
        }),
        {
            name: "luxury-chat",
        },
    )

)