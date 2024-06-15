"use client";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { PersonOutline } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Profile = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      reset({
        username: user?.username,
        profileImage: user?.profileImage,
      });
    }
    setLoading(false);
  }, [user]);

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { error },
  } = useForm();

  const uploadPhoto = (result) => {
    setValue("profileImage", result?.info?.secure_url);
  };

  const updateUser = async (data) => {
    try {
      setSaved(true);
      await fetch(`/api/users/${user._id}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setSaved(false);
      toast.success("Profile updated successfully");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="mt-16 flex flex-col gap-11 items-center justify-center">
      <h1 className="text-heading3-bold">Edit Your Profile</h1>

      <form className="flex flex-col gap-9" onSubmit={handleSubmit(updateUser)}>
        <div className="flex items-center justify-between px-5 py-3 rounded-xl cursor-pointer shadow-md bg-secondary">
          <input
            {...register("username", {
              required: "Username is required",
              validate: (value) => {
                if (value.length < 3) {
                  return "Username must be at least 3 characters";
                }
              },
            })}
            type="text"
            placeholder="Username"
            className="w-[300px] max-sm:w-full bg-transparent outline-none"
          />
          <PersonOutline sx={{ color: "#737373" }} />
        </div>
        {error?.username && (
          <p className="text-red-500">{error.username.message}</p>
        )}

        <div className="flex items-center gap-x-4 justify-between">
          <Image
            src={watch("profileImage") || user?.image || "/assets/person.jpg"}
            alt="profile"
            width={500}
            height={500}
            className="w-40 h-40 rounded-full border-2 border-secondary object-cover"
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

        <Button
          type="submit"
          className="bg-gradient-to-l from-primary-1 to-green-500 px-5 py-3 mt-5 mb-7 rounded-md cursor-pointer text-body-bold w-full text-white"
        >
          {saved ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};

export default Profile;
