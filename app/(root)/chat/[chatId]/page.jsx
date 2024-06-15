"use client";
import ChatDetailComponent from "@/components/ChatDetailComponent";
import ChatList from "@/components/ChatList";
import Wrapper from "@/components/Wrapper";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const ChatDetailsPage = () => {
  const { chatId } = useParams();

  const { data: session } = useSession();

  const currentUser = session?.user;

  const seenMessages = async () => {
    try {
      await fetch(`/api/chats/${chatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUserId: currentUser._id,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentUser && chatId) seenMessages();
  }, [currentUser, chatId]);

  return (
    <Wrapper className="h-screen flex justify-between gap-10 px-10 py-3 max-lg:gap-8">
      <div className="w-1/3 max-lg:hidden">
        <ChatList currentChatId={chatId} />
      </div>
      <div className="w-2/3 max-lg:w-full">
        <ChatDetailComponent chatId={chatId} />
      </div>
    </Wrapper>
  );
};

export default ChatDetailsPage;
