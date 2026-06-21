export interface ChatMessage {
    id: string;
    sender: "user" | "admin";
    text: string;
    createdAt: string;
}