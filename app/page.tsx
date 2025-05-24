"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import useGame from "./Hook/GameHook/context.hook";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const context = useGame()
  const { clearGame, loadSetting } = context
  useEffect(() => {
    clearGame()
  },[])
  return (
    <div
      className="relative h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/backgrow.png')", // ปรับ path ให้ถูกต้อง
      }}
    >
      {/* ข้อความโค้ง */}
      <motion.h1
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="font-mali absolute top-1/4 text-yellow-500 text-6xl md:text-8xl drop-shadow-lg text-center tracking-wide"
        style={{
          transform: "rotate(-5deg)",
          textShadow: "2px 4px 6px rgba(0,0,0,0.3)",
        }}
      >
        ASSESSMENT&SCREENING FOR MCI GAME
      </motion.h1>

      {/* ปุ่มเริ่มเกม */}
        {loadSetting ? <>
        </> : 
      <div className="mt-30 absolute flex items-center justify-center">
        <motion.button
          whileHover={{ scale: 1.1, rotate: -3 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push("/dataset")}
          className="bg-red-600 hover:bg-red-700 text-white font-bold font-mali py-3 px-8 rounded-full text-3xl shadow-2xl tracking-widest"
          style={{
       
            borderRadius: "30px",
            boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
            transform: "skewX(-10deg)",
          }}
        >
          Start Now!
        </motion.button>
      </div>
        }

      {/* เพิ่มรูปภาพเพิ่มเติม (ตัวอย่าง) */}
    </div>
  );
}
