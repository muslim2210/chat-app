"use client";
import { useTheme } from "next-themes";
import Image from "next/image";

const ThemeToogle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <div
        className="w-[45px] h-[23px] rounded-[50px] flex justify-between items-center cursor-pointer relative"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        style={
          theme === "dark" ? { background: "white" } : { background: "#0f172a" }
        }
      >
        <Image src="/moon.png" alt="sun" width={18} height={18} />
        <div
          className="w-[17px] h-[19px] rounded-[50%] absolute"
          style={
            theme === "dark"
              ? { left: 1, background: "#0f172a" }
              : { right: 1, background: "white" }
          }
        ></div>
        <Image src="/sun.png" alt="sun" width={18} height={18} />
      </div>
    </>
  );
};

export default ThemeToogle;
