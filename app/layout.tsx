import type { Metadata } from "next";
import { Rye, Mali } from "next/font/google"; // ใช้ฟอนต์ Rye
import "./globals.css";
import { GameProvider } from "@/app/Context/gameContext";

// โหลดฟอนต์ Rye
const rye = Rye({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-rye",
});

const mali = Mali({
  subsets: ["latin"],
  weight: ["400", "700"], // เพิ่มน้ำหนักที่ต้องการ
  variable: "--font-mali",
});

export const metadata: Metadata = {
  icons : "https://api.bxok.online/public/uploads/B2lzWfIx0P-F8JHHWy-ih.png",

  title: "ASSESSMENT&SCREENING FOR MCI GAME",
  description: "ASSESSMENT&SCREENING FOR MCI GAME",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rye.variable} ${mali.variable} font-rye`}>
        <div className="">
          <GameProvider>{children}</GameProvider>
        </div>
      </body>
    </html>
  );
}
