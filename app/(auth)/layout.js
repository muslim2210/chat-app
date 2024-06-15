import { Inter } from "next/font/google";
import "../globals.css";
import ToasterContext from "@/components/ToasterContext";
import Provider from "@/providers/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Auth Chat App",
  description: "Build Next js 14 chat app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-secondary`}>
        <Provider>
          <ToasterContext />
          {children}
        </Provider>
      </body>
    </html>
  );
}
