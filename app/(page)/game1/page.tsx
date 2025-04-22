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
