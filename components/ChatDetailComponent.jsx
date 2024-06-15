"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import Link from "next/link";
import Image from "next/image";
import { AddPhotoAlternate } from "@mui/icons-material";
import { CldUploadButton } from "next-cloudinary";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import toast from "react-hot-toast";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/lib/pusher";

const ChatDetailComponent = ({ chatId }) => {
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState({});
  const [otherMembers, setOtherMembers] = useState([]);

  const { data: session } = useSession();
  const currentUser = session?.user;

  const [text, setText] = useState("");

  const getChatDetails = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setChat(data);
      setOtherMembers(
        data?.members?.filter((member) => member._id !== currentUser._id)
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentUser && chatId) getChatDetails();
  }, [currentUser, chatId]);

  const sendText = async () => {
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          currentUserId: currentUser._id,
          text,
        }),
      });

      if (res.ok) {
        setText("");
        toast.success("message sent");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const sendPhoto = async (result) => {
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId,
          currentUserId: currentUser._id,
          photo: result?.info?.secure_url,
        }),
      });
      if (res.ok) {
        toast.success("Photo sent");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    pusherClient.subscribe(chatId);

    const handleMessage = async (newMessage) => {
      setChat((prevChat) => {
        return {
          ...prevChat,
          messages: [...prevChat.messages, newMessage],
        };
      });
    };

    pusherClient.bind("new-message", handleMessage);

    return () => {
      pusherClient.unsubscribe(chatId);
      pusherClient.unbind("new-message", handleMessage);
    };
  }, [chatId]);

  // scroll to bottom
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  return loading ? (
    <Loader />
  ) : (
    <div className="h-[79vh] mt-10 relative rounded-3xl flex flex-col">
      <div className="flex items-center bg-muted gap-4 px-8 py-3 rounded-2xl text-body-bold">
        {chat?.isGroup ? (
          <>
            <Link href={`/chat/${chatId}/group-info`}>
              <Image
                src={chat?.groupPhoto || "/assets/group.png"}
                alt="group-photo"
                width={200}
                height={200}
                className="profilePhoto"
              />
            </Link>

            <div className="text">
              <p>
                {chat?.name} &#160; &#183; &#160; {chat?.members?.length}{" "}
                members
              </p>
            </div>
          </>
        ) : (
          <>
            <Image
              src={otherMembers[0]?.profileImage || "/assets/person.jpg"}
              alt="profile photo"
              width={200}
              height={200}
              className="profilePhoto"
            />
            <div className="text">
              <p>{otherMembers[0]?.username}</p>
            </div>
          </>
        )}
      </div>

      <ScrollArea className="h-[420px] flex flex-col px-5 py-5 pb-10">
        {chat?.messages?.map((message, index) => (
          <MessageBox key={index} message={message} currentUser={currentUser} />
        ))}

        <div ref={bottomRef} />
      </ScrollArea>

      <div className="w-full flex items-center justify-between px-7 py-3 rounded-3xl cursor-pointer bg-muted absolute bottom-0">
        <div className="flex items-center gap-4">
          <CldUploadButton
            options={{ maxFiles: 1 }}
            uploadPreset="iuj6jlhr"
            onUpload={sendPhoto}
          >
            <AddPhotoAlternate
              sx={{
                fontSize: "35px",
                color: "#737373",
                cursor: "pointer",
                "&:hover": { color: "red" },
              }}
            />
          </CldUploadButton>

          <input
            type="text"
            placeholder="Write a message..."
            className="w-[650px] bg-transparent outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>

        <button onClick={sendText}>
          <Image
            src="/assets/send.jpg"
            alt="send"
            width={100}
            height={100}
            className="send-icon"
          />
        </button>
      </div>
    </div>
  );
};

export default ChatDetailComponent;
