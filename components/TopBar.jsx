"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Wrapper from "./Wrapper";
import { Logout } from "@mui/icons-material";
import ThemeToogle from "./ThemeToogle";

const TopBar = () => {
  const pathname = usePathname();

  const handleLogout = async () => {
    signOut({ callbackUrl: "/" });
  };

  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="py-2 md:py-4 bg-secondary w-full">
      <Wrapper className="flex justify-between">
        <Link href="/chat">
          <Image
            src="/assets/logo-chat-app.png"
            alt="logo"
            width={100}
            height={80}
          />
        </Link>

        <div className="flex items-center gap-5 lg:gap-10 max-sm:hidden">
          <Link
            href="/chat"
            className={`${
              pathname === "/chat" ? "text-red-1" : ""
            } text-heading4-bold`}
          >
            Chats
          </Link>
          <Link
            href="/contacts"
            className={`${
              pathname === "/contacts" ? "text-red-1" : ""
            } text-heading4-bold`}
          >
            Contacts
          </Link>

          <Logout
            sx={{ color: "#737373", cursor: "pointer" }}
            onClick={handleLogout}
          />

          <ThemeToogle />

          <Link href="/profile">
            <Image
              src={user?.profileImage || "/assets/person.jpg"}
              alt="profile"
              width={100}
              height={100}
              className="profilePhoto border-2 hover:border-primary-1 rounded-full"
            />
          </Link>
        </div>
      </Wrapper>
    </nav>
  );
};

export default TopBar;
