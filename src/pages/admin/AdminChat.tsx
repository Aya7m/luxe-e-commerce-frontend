import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { getMessagesApi, sendMessageApi } from "../../services/chat.service";
import { getUsersApi } from "../../services/user.services";

const AdminChat = () => {
  const queryClient = useQueryClient();

  const [text, setText] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const authData = JSON.parse(localStorage.getItem("luxury-auth") || "{}");

  const adminId = authData?.state?.user?.id;

  console.log("adminId", adminId);

  // 👤 USERS LIST
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getUsersApi,
  });

  // 💬 MESSAGES
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["admin-chat", selectedUser?._id],
    queryFn: () => getMessagesApi(selectedUser._id),
    enabled: !!selectedUser,
  });

  // 📤 SEND MESSAGE
  const sendMutation = useMutation({
    mutationFn: sendMessageApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-chat", selectedUser?._id],
      });
      setText("");
    },
    onError: () => {
      toast.error("Failed to send message");
    },
  });

  const handleSend = () => {
    if (!text.trim() || !selectedUser) return;

    sendMutation.mutate({
      receiverId: selectedUser._id,
      text,
    });
  };

  return (
    <div className="flex h-[650px] rounded-3xl bg-white shadow overflow-hidden">
      {/* ================= LEFT USERS ================= */}
      <div className="w-1/3 border-r overflow-y-auto">
        <h2 className="p-4 text-lg font-bold border-b">Users</h2>

        {users.map((user: any) => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`cursor-pointer p-4 hover:bg-gray-100 ${
              selectedUser?._id === user._id ? "bg-gray-200" : ""
            }`}
          >
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        ))}
      </div>

      {/* ================= RIGHT CHAT ================= */}
      <div className="flex flex-col flex-1">
        {/* HEADER */}
        <div className="border-b p-4 font-semibold">
          {selectedUser ? `Chat with ${selectedUser.name}` : "Select a user"}
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!selectedUser ? (
            <p className="text-gray-400">Choose a user to start chatting</p>
          ) : isLoading ? (
            <p>Loading...</p>
          ) : (
            messages.map((msg: any) => {
              const isMine =
                String(msg.sender?._id || msg.sender) === String(adminId);

              return (
                <div
                  key={msg._id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                      isMine ? "bg-black text-white" : "bg-gray-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* INPUT */}
        <div className="border-t p-3 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!selectedUser}
            placeholder="Type message..."
            className="flex-1 rounded-full border px-4 py-2"
          />

          <button
            onClick={handleSend}
            disabled={sendMutation.isPending || !selectedUser}
            className="rounded-full bg-black px-5 text-white disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
