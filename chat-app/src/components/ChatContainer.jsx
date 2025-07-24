import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

function ChatContainer() {
  const { messages, getMessages, selectedMember, isMessagesLoading } =
    useChatStore();

  const currUser = useAuthStore((state) => state.currUser);

  useEffect(() => {
    if (selectedMember?._id) {
      getMessages(selectedMember._id);
    }
  }, [selectedMember?._id, getMessages]);

  if (!currUser) {
    return <div className="text-center p-4 text-gray-400">Loading user...</div>;
  }

  if (!selectedMember) {
    return (
      <div className="text-center p-4 text-gray-400">No member selected</div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 flex flex-col overflow-auto p-4 gap-2">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === currUser._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === currUser._id
                      ? currUser.profilePic || "/image.png"
                      : selectedMember.profilePic || "/image.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1 ">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
}

export default ChatContainer;
