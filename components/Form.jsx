"use client";
import {
  EmailOutlined,
  LockOutlined,
  PersonOutline,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Form = ({ type }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async (data) => {
    if (type === "register") {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setLoading(false);
        toast.success("Registered successfully");
        router.push("/");
      }
      if (res.error) {
        toast.error("Something went wrong");
      }
    }
    if (type === "login") {
      setLoading(true);
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      if (res.ok) {
        setLoading(false);
        toast.success("Login successfully");
        router.push("/chat");
      }
      if (res.error) {
        toast.error("Invalid email or password");
      }
    }
  };

  return (
    <div className="auth">
      <div className="content">
        <Image
          src="/assets/logo-chat-app.png"
          alt="logo"
          width={500}
          height={500}
          priority
          className="logo"
        />

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          {type === "register" && (
            <div className="md:w-[384px] w-[300px]">
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Username
              </label>
              <div className="input">
                <input
                  defaultValue=""
                  {...register("username", {
                    required: "Username is required",
                    validate: (value) => {
                      if (value.length < 3) {
                        return "Username must be at least 3 characters";
                      }
                    },
                  })}
                  type="text"
                  id="username"
                  placeholder="Username"
                  className="input-field"
                />
                <PersonOutline sx={{ color: "#737373" }} />
              </div>
              {errors.username && (
                <p className="text-red-500">{errors.username.message}</p>
              )}
            </div>
          )}

          <div className="md:w-[384px] w-[300px]">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <div className="input">
              <input
                defaultValue=""
                {...register("email", { required: "Email is required" })}
                type="email"
                id="email"
                placeholder="Email"
                className="input-field"
              />
              <EmailOutlined sx={{ color: "#737373" }} />
            </div>
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="md:w-[384px] w-[300px]">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <div className="input">
              <input
                defaultValue=""
                {...register("password", {
                  required: "Password is required",
                  validate: (value) => {
                    if (
                      value.length < 5 ||
                      !value.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/)
                    ) {
                      return "Password must be at least 5 characters and contain at least one special character";
                    }
                  },
                })}
                type="password"
                id="password"
                placeholder="••••••••"
                className="input-field bg-transparent"
              />
              <LockOutlined sx={{ color: "#737373" }} />
            </div>
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>

          {type === "register" ? (
            <Button
              type="submit"
              className="bg-primary-1 px-5 py-3 mt-5 mb-7 rounded-md cursor-pointer text-body-bold w-full text-white hover:bg-primary-1/70"
            >
              {loading ? "Registering..." : "Join Free"}
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-primary-1 px-5 py-3 mt-5 mb-7 rounded-md cursor-pointer text-body-bold w-full text-white hover:bg-primary-1/70"
            >
              {loading ? "Logging in..." : "Let's Chat"}
            </Button>
          )}
        </form>

        {type === "register" ? (
          <Link href="/" className="link hover:text-red-1">
            <p className="text-center">Already have an account? Sign In Here</p>
          </Link>
        ) : (
          <Link href="/register" className="link hover:text-red-1">
            <p className="text-center">Don't have an account? Register Here</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Form;
