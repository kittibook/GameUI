"use client";
import { useRef, useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "../navbar/page";
import { detailGame456 } from "@/app/Types/gameProvider";
import { GameContext } from "@/app/Context/gameContext";

export default function DrawShapeUI() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [contexts, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [detail, setDetail] = useState<detailGame456[]>([]);
  const [showOverlay, setShowOverlay] = useState(true);

  const context = useContext(GameContext);

  if (!context) {
    return <p>Loading context...</p>;
  }

  const { StartTime, StopTime, time } = context;

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#000000";
        ctx.lineCap = "round";
        setContext(ctx);
      }
    }
  }, []);
  //กันไม่กรอกข้อมูล
  useEffect(() => {
    if (context?.gameData) {
      const data = context.gameData
      if (data.name == "" || data.age == 0 || data.disease == "" || data.dataSet == 0) {
        router.push('/')
      }
    }
  }, [context?.gameData]);
  const startDrawing = (e: React.MouseEvent) => {
    if (!contexts || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    contexts.beginPath();
    contexts.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !contexts || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    contexts.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    contexts.stroke();
  };

  const stopDrawing = () => {
    if (!contexts) return;
    contexts.closePath();
    setIsDrawing(false);
  };

  return (
    <div className="">
      <Navbar />
      {showOverlay && (
        <motion.div
          className="overlay flex justify-center bg-green-200 pt-10 w-full min-h-screen pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {/* Particle Effects */}
          <div className="particle">🟠</div>
          <div className="particle">🟣</div>
          <div className="particle">🟡</div>
          <div className="particle floating-card"></div>
          <div className="particle floating-card"></div>

          {/* Content inside overlay */}
          <motion.div
            className="instructions"
            initial={{ scale: 0.7, opacity: 0, rotateX: 20 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h2
              className="font-mali text-4xl md:text-5xl font-bold text-black mb-8 drop-shadow-2xl flex justify-center items-center"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              เกมจับคู่เลข!
            </motion.h2>
            <motion.p
              className="font-mali text-xl md:text-2xl text-black mb-8 leading-relaxed"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              ทดสอบความจำของคุณด้วยการจับคู่ตัวเลขให้ครบ 3 คู่! <br />
              พร้อมแล้วหรือยัง? มาสนุกกันเลย!
            </motion.p>
            <motion.ul
              className="font-mali text-lg md:text-xl text-black list-disc list-inside mb-10 space-y-3"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <li>ดูการ์ดทั้งหมด 5 วินาทีเมื่อเริ่มเกม</li>
              <li>คลิกเพื่อเปิดการ์ดและจับคู่ตัวเลข</li>
              <li>ได้คะแนนเมื่อจับคู่สำเร็จ</li>
              <li>จบเกมเมื่อจับคู่ครบ 3 คู่!</li>
            </motion.ul>
            <motion.div
              className="flex justify-center items-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: -3 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowOverlay(false)} // ซ่อน overlay
                className="cursor-pointer mt-10 flex justify-center items-center"
              >
                <motion.img
                  className="drop-shadow-lg w-32 sm:w-40 md:w-48 px-4 py-2 rounded-lg"
                  src="/images/Startgame.png"
                  alt="Next Button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                />
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
      <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-start pt-20 font-mali">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">

          <div className="flex flex-col items-center">
            <h2 className="text-md font-semibold mb-2">รูปต้นแบบ</h2>
            <div className="w-96 h-96 bg-white rounded-md shadow-md flex items-center justify-center overflow-hidden">
              <img
                src="/images/6.png"
                alt="รูปต้นแบบ"
                className="w-80 h-80 object-contain"
              />
            </div>
          </div>


          <div className="flex flex-col items-center">
            <h2 className="text-md font-semibold mb-2">วาดในกรอบ</h2>
            <div className="w-96 h-96 bg-white rounded-md shadow-md flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={384}
                height={384}
                className="border border-gray-300 rounded"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
          </div>
        </div>


        <div className="flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.1, rotate: -3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push("/gamecolor")}
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
    </div>
  );
}
