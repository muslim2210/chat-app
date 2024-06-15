"use client";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { GroupOutlined, PersonOutline } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const GroupInfo = () => {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [chat, setChat] = useState({});

  const { chatId } = useParams();

  const getChatDetails = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}`);
      const data = await res.json();
      setChat(data);
      setLoading(false);
      reset({
        name: data?.name,
        groupPhoto: data?.groupPhoto,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (chatId) {
      getChatDetails();
    }
  }, [chatId]);

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { error },
  } = useForm();

  const uploadPhoto = (result) => {
    setValue("groupPhoto", result?.info?.secure_url);
  };

  const router = useRouter();

  const updateGroupChat = async (data) => {
    setSaved(true);
    try {
      const res = await fetch(`/api/chats/${chatId}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setSaved(false);

      if (res.ok) {
        router.push(`/chat/${chatId}`);
        toast.success("Group info updated");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="mt-10 flex flex-col gap-7 items-center justify-center">
      <h1 className="text-heading3-bold">Edit Group Info</h1>

      <form
        className="flex flex-col gap-9"
        onSubmit={handleSubmit(updateGroupChat)}
      >
        <div className="flex items-center justify-between px-5 py-3 rounded-xl cursor-pointer shadow-md bg-secondary">
          <input
            {...register("name", {
              required: "Group chat name is required",
              validate: (value) => {
                if (value.length < 3) {
                  return "Group name must be at least 3 characters";
                }
              },
            })}
            type="text"
            placeholder="Group chat name"
            className="w-[300px] max-sm:w-full bg-transparent outline-none"
          />
          <GroupOutlined sx={{ color: "#737373" }} />
        </div>
        {error?.name && <p className="text-red-500">{error.name.message}</p>}

        <div className="flex items-center gap-x-4 justify-between">
          <Image
            src={watch("groupPhoto") || "/assets/group.png"}
            alt="profile"
            width={500}
            height={500}
            className="w-40 h-40 rounded-full object-cover"
          />
          <CldUploadButton
            options={{ maxFiles: 1 }}
            uploadPreset="iuj6jlhr"
            onUpload={uploadPhoto}
          >
            <div className="cursor-pointer border-2 border-secondary px-5 py-3 rounded-full">
              <p className="text-body-bold">Upload new photo</p>
            </div>
          </CldUploadButton>
        </div>

        <div className="flex flex-wrap gap-3 w-[300px]">
          {chat?.members?.map((member, index) => (
            <p className="selected-contact" key={index}>
              {member.username}
            </p>
          ))}
        </div>

        <Button
          type="submit"
          className="bg-gradient-to-l from-primary-1 to-green-500 px-5 py-3 mb-7 rounded-md cursor-pointer text-body-bold w-full text-white"
        >
          {saved ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};

export default GroupInfo;
