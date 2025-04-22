"use client";

import { GameContext } from "@/app/Context/gameContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

export default function Home() {
  const router = useRouter();
  const context = useContext(GameContext);

  if (!context) {
    return <p>Loading context...</p>;
  }

  const { updataName, updateAge, updateDisease, RestartTime } = context;

  const [text1, setText1] = useState(""); //ขื่อ 
  const [text2, setText2] = useState(""); //อายุ
  const [text3, setText3] = useState(""); // โรค

  const handleNext = () => {
    if (!text1 || !text2 || !text3) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const age = parseInt(text2);
    if (isNaN(age) || age <= 0) {
      alert("กรุณากรอกอายุให้ถูกต้อง");
      return;
    }
    updataName(text1)
    updateAge(age)
    updateDisease(text3)
    RestartTime()
    router.push("/game1");
  };

  return (
    <div
      className="relative h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/backgrow.png')",
      }}
    >
      <div className="absolute flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 lg:px-20 top-[200px] w-full">
        <div className="flex flex-col lg:flex-row justify-center items-center gap-4 w-full max-w-6xl">
          {/* input 1 */}
          <div className="relative w-full max-w-sm sm:max-w-md">
            <img src="/images/name.png" className="w-full" />
            <input
              type="text"
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="ชื่อ นามสกุล"
              className="font-mali absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-base sm:text-lg bg-transparent border-none outline-none text-center w-4/5 pt-10"
            />
          </div>

          {/* input 2 */}
          <div className="relative w-full max-w-sm sm:max-w-md">
            <img src="/images/old.png" className="w-full" />
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="อายุ"
              className="font-mali absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-base sm:text-lg bg-transparent border-none outline-none text-center w-4/5 pt-10"
            />
          </div>
        </div>

        {/* input 3 */}
        <div className="mt-6 w-full max-w-sm sm:max-w-md">
          <div className="relative w-full">
            <img src="/images/congenital_disease.png" className="w-full" />
            <input
              type="text"
              value={text3}
              onChange={(e) => setText3(e.target.value)}
              placeholder="โรคประจำตัว"
              className="font-mali absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-base sm:text-lg bg-transparent border-none outline-none text-center w-4/5 pt-10"
            />
          </div>
        </div>

        {/* ปุ่มถัดไป */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: -3 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          className="cursor-pointer mt-10"
        >
          <motion.img
            className="drop-shadow-lg w-32 sm:w-40 md:w-48"
            src="/images/next.png"
            alt="Next Button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          />
        </motion.button>
      </div>
    </div>
  );
}
