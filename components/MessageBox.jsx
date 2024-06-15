import { format } from "date-fns";
import Image from "next/image";
import React from "react";

const MessageBox = ({ message, currentUser }) => {
  return message?.sender?._id !== currentUser._id ? (
    <div className="flex gap-3 items-start mt-5">
      <Image
        src={message?.sender?.profileImage || "/assets/person.jpg"}
        alt="profile photo"
        width={200}
        height={200}
        className="w-8 h-8 object-cover object-center rounded-full"
      />
      <div className="flex flex-col gap-2">
        <p className="text-small-bold">
          {message?.sender?.username} &#160; &#183; &#160;{" "}
          {format(new Date(message?.createdAt), "eee, h:mm a")}
        </p>

        {message?.text ? (
          <p className="w-fit bg-slate-300 dark:bg-slate-600 p-3 rounded-lg text-base-medium text-justify max-w-[400px]">
            {message?.text}
          </p>
        ) : (
          <Image
            src={message?.photo}
            alt="message"
            width={200}
            height={200}
            className="message-photo"
          />
        )}
      </div>
    </div>
  ) : (
    <div className="flex gap-3 items-start justify-end mt-5">
      <div className="flex flex-col gap-2 items-end">
        <p className="text-small-bold">
          {format(new Date(message?.createdAt), "eee, h:mm a")}
        </p>

        {message?.text ? (
          <p className="w-fit p-3 bg-green-600 dark:bg-green-900 rounded-lg text-base-medium text-justify max-w-[400px]">
            {message?.text}
          </p>
        ) : (
          <Image
            src={message?.photo}
            alt="message"
            width={200}
            height={200}
            className="message-photo"
          />
        )}
      </div>
    </div>
  );
};

export default MessageBox;
