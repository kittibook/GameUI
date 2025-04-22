"use client";

import { GameContext } from "@/app/Context/gameContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [dataSet, setdataSet] = useState('0')
  const context = useContext(GameContext);

  if (!context) {
    return <p>Loading context...</p>;
  }

  const { updateDataSet } = context;
  const submit = () => {
    const number = parseInt(dataSet)
    updateDataSet(number)
    router.push("/information")
  }
  return (
    <div
      className="relative h-screen w-full flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: "url('/images/backgrow.png')",
      }}
    >
      <div className="flex flex-col items-center justify-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-center items-center"
        >
          <motion.select
            value={dataSet}
            onChange={(e) => setdataSet(e.target.value)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="font-mali w-[500px] h-[100px] text-xl border-none text-white text-center bg-transparent cursor-pointer"
            style={{
              backgroundImage: "url('/images/frame.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              outline: "none",
              filter: "drop-shadow(2px 2px 6px rgba(0, 0, 0, 0.3))",
              paddingTop: "7%",
              paddingLeft: "5%",
            }}
          >
            <option value="0" disabled>
              กรุณาเลือกข้อมูลที่ต้องการ
            </option>
            <option value="1">Dataset 1</option>
            <option value="2">Dataset 2</option>
            <option value="3">Dataset 3</option>
            <option value="4">Dataset 4</option>
            <option value="5">Dataset 5</option>
          </motion.select>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.1, rotate: -3 }}
          whileTap={{ scale: 0.9 }}
          onClick={submit}
          className="cursor-pointer"
        >
          <motion.img
            className="mt-6 drop-shadow-lg"
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
