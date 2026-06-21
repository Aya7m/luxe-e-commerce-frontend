import { api } from "../lib/axios";


// GET messages
export const getMessagesApi = async (userId: string) => {
  const res = await api.get(`/chat/${userId}`);
  return res.data;
};

// SEND message
export const sendMessageApi = async (data: {
  receiverId: string;
  text: string;
}) => {
  const res = await api.post("/chat", data);
  return res.data;
};