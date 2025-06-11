"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import useGame from "@/app/Hook/GameHook/context.hook";
import { detailGame456 } from "@/app/Types/game.types";
import NavBar from "@/app/Components/UI/Game/NavBar/page";
import InfoGameDraw from "@/app/Components/UI/Game/info/gamedraw.info";
import { config } from "@/app/Config/config";
import { Bounce, toast, ToastContainer } from "react-toastify";
import GameGuard from "@/app/Components/Layout/GameGuard";

export default function DrawShapeUI() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlaying = useRef(false);
  const context = useGame()

  const { StartTime, StopTime, time, Sound, Name, updateScore, updateGame1, setting } = context;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#000000";
        ctx.lineCap = "round";
      }
    }
  }, []);

  useEffect(() => {
    Name("เกมวาดรูป 6 เหลี่ยม");
  }, []);

  const startGame = () => {
    setShowOverlay(false);
    if (setting.game1 && setting.game1.Sound) {
      playAudio(config.urlImage + setting.game1.Sound.url);
      Sound(config.urlImage + setting.game1.Sound.url);
    }

    StartTime();
  };

  const playAudio = (audioUrl: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.muted = false;
      audioRef.current.volume = 1;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      isPlaying.current = false;
    }

    audioRef.current.src = audioUrl;
    isPlaying.current = true;
    audioRef.current.play().catch((error) => {
      isPlaying.current = false;
    });

    audioRef.current.onended = () => {
      isPlaying.current = false;
    };
  };


  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const pos = getPos(e, rect);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };


  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const pos = getPos(e, rect);
    // เพิ่มตรงนี้เพื่อให้แน่ใจว่ามีการเซ็ตค่าใหม่ทุกครั้ง
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#000000";
    ctx.lineCap = "round";
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getPos = (
    e: React.MouseEvent | React.TouchEvent,
    rect: DOMRect
  ) => {
    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const submit = async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      // สร้าง temporary canvas 200x200
      const resizedCanvas = document.createElement('canvas');
      resizedCanvas.width = 200;
      resizedCanvas.height = 200;
      const resizedCtx = resizedCanvas.getContext('2d');
      if (resizedCtx) {
        // 1. เติมพื้นหลังสีขาวก่อน
        resizedCtx.fillStyle = 'white';
        resizedCtx.fillRect(0, 0, 200, 200);

        // 2. ค่อยวาดภาพจากต้นฉบับลงไป
        resizedCtx.drawImage(canvas, 0, 0, 200, 200);
      }

      // แทนที่ใช้ canvas เดิม ให้ใช้ resizedCanvas
      resizedCanvas.toBlob(async (blob: any) => {
        if (!blob) return;

        const formData = new FormData();
        formData.append("file", blob, "drawn-image.png");

        try {
          const response = await fetch(config.url + 'game/imagecheck', {
            method: "POST",
            body: formData,
          })
          const res = await response.json();
          if (response.ok) {

            if (res.success) {

              toast.success(res.predictedLabel, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
              });
              const ctx = canvas.getContext("2d");
              ctx?.clearRect(0, 0, canvas.width, canvas.height);
              const data = {
                name: "เกมวาดรูป 6 เหลี่ยม",
                time: time,
                score: res.point,
                detail: [{ url: res.url }]
              }
              // console.log(data)
              updateGame1(data)
              router.push("/gamecolor");
              updateScore(res.point);
              StopTime();
            } else {
              toast.error('อัปโหลดไม่สำเร็จ!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
              });
              router.push("/gamecolor");
              StopTime();
            }

          }

        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการอัปโหลด", error);
        }
      }, "image/png");
    }



  };

  return (
    <GameGuard>

      <div className="">
        <NavBar />
        {showOverlay ? (
          <InfoGameDraw startGame={startGame} />
        ) : (
          <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-start pt-20 font-mali">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
              <div className="flex flex-col items-center">
                <h2 className="text-md font-semibold mb-2">รูปต้นแบบ</h2>
                <div className="w-96 h-96 bg-white rounded-md shadow-md flex items-center justify-center overflow-hidden">
                  <img
                    src={config.urlImage + setting.game1.ImageDemo.url} // กำหนดรูปตชัวอย่างเป็น position เป็น ImageDemo
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
                    className="border border-gray-300 rounded touch-none relative"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
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
        )}
        <ToastContainer />
      </div>
    </GameGuard>

  );
}
