import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getMessagesApi, sendMessageApi } from "../services/chat.service";

const Chat = () => {
  const [text, setText] = useState("");

  const queryClient = useQueryClient();

  // مؤقتًا
  const adminId = "6a2d0d0bab37495df752bce2";

  // user الحالي
  const authData = JSON.parse(localStorage.getItem("luxury-auth") || "{}");

  const currentUserId = authData?.state?.user?.id;

  console.log("currentUserId", currentUserId);

  const {
    data: messages = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["chat"],
    queryFn: () => getMessagesApi(adminId),
  });

  const sendMutation = useMutation({
    mutationFn: sendMessageApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chat"],
      });
    },
  });

  const handleSend = () => {
    if (!text.trim()) return;

    sendMutation.mutate({
      receiverId: adminId,
      text,
    });

    setText("");
  };

  if (isLoading) {
    return <div className="py-20 text-center">Loading messages...</div>;
  }

  if (isError) {
    return <div className="py-20 text-center">Failed to load messages</div>;
  }

  return (
    <section className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-4xl font-bold">Support Chat</h1>

      <div className="overflow-hidden rounded-3xl bg-white shadow">
        <div className="border-b p-5">
          <h2 className="font-semibold">Chat With Admin</h2>

          <p className="text-sm text-gray-500">
            Ask about your orders or products
          </p>
        </div>

        <div className="h-[500px] overflow-y-auto p-5">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500">No messages yet</div>
          ) : (
            <div className="space-y-3">
              {messages.map((message: any) => {
                const isMine =
                  String(message.sender?._id || message.sender) ===
                  String(currentUserId);

                return (
                  <div
                    key={message._id}
                    className={`flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        isMine ? "bg-black text-white" : "bg-gray-100"
                      }`}
                    >
                      <p>{message.text}</p>

                      <p className="mt-1 text-xs opacity-70">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <div className="flex gap-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-full border px-5 py-3 outline-none"
            />

            <button
              onClick={handleSend}
              disabled={sendMutation.isPending}
              className="rounded-full bg-black px-6 py-3 text-white disabled:opacity-50"
            >
              {sendMutation.isPending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chat;
