import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Provider from "@/providers/Provider";
import TopBar from "@/components/TopBar";
import ToasterContext from "@/components/ToasterContext";
import BottomBar from "@/components/BottomBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chat App Next 14",
  description: "Build Next js 14 chat app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ToasterContext />
            <TopBar />
            {children}
            <BottomBar />
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
