import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { format, formatRelative, subDays } from "date-fns";

const ChatBox = ({ chat, currentUser, currentChatId }) => {
  const otherMembers = chat?.members?.filter(
    (member) => member._id !== currentUser._id
  );

  const lastMessage =
    chat?.messages?.length > 0 && chat?.messages[chat?.messages.length - 1];

  const router = useRouter();

  const seen = lastMessage?.seenBy?.find(
    (member) => member._id === currentUser._id
  );

  return (
    <div
      className={`flex items-start justify-between p-2 rounded-2xl cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-500 ${
        chat._id === currentChatId ? "bg-background" : ""
      }`}
      onClick={() => router.push(`/chat/${chat._id}`)}
    >
      <div className="flex gap-3 items-center">
        {chat?.isGroup ? (
          <Image
            src={chat?.groupPhoto || "/assets/group.png"}
            alt="group-photo"
            width={200}
            height={200}
            className="profilePhoto"
          />
        ) : (
          <Image
            src={otherMembers[0].profileImage || "/assets/person.jpg"}
            alt="profile-photo"
            width={200}
            height={200}
            className="profilePhoto"
          />
        )}

        <div className="flex flex-col gap-1">
          {chat?.isGroup ? (
            <p className="text-base-bold w-[150px] md:max-w-[200px] truncate">
              {chat?.name}
            </p>
          ) : (
            <p className="text-base-bold w-[150px] md:max-w-[200px] truncate">
              {otherMembers[0]?.username}
            </p>
          )}

          {!lastMessage && (
            <p className="text-small-medium text-grey-3">Started a chat</p>
          )}

          {lastMessage?.photo ? (
            lastMessage?.sender?._id === currentUser._id ? (
              <p className="text-small-medium text-grey-3">You sent a photo</p>
            ) : (
              <p
                className={`${
                  seen ? "text-small-medium text-grey-3" : "text-small-bold"
                }`}
              >
                Received a photo
              </p>
            )
          ) : (
            <p
              className={`w-[150px] md:w-[200px] truncate ${
                seen ? "text-small-medium text-grey-3" : "text-small-bold"
              }`}
            >
              {lastMessage?.text}
            </p>
          )}
        </div>
      </div>

      <div className="text-end w-[120px] mt-2">
        <p className="text-small-medium text-grey-3">
          {!lastMessage
            ? format(new Date(chat?.createdAt), "eee, h:mm a")
            : format(new Date(chat?.lastMessageAt), "eee, h:mm a")}
        </p>
      </div>
    </div>
  );
};

export default ChatBox;
