"use client";
import { useRef, useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import useGame from "@/app/Hook/GameHook/context.hook";
import { detailGame456 } from "@/app/Types/game.types";
import NavBar from "@/app/Components/UI/Game/NavBar/page";
import InfoGameDraw from "@/app/Components/UI/Game/info/gamedraw.info";

export default function DrawShapeUI() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [contexts, setContext] = useState<CanvasRenderingContext2D | null>(
    null
  );
  const [detail, setDetail] = useState<detailGame456[]>([]);
  const [showOverlay, setShowOverlay] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlaying = useRef(false);
  const context = useGame()

  const { StartTime, StopTime, time, Sound, Name, updateScore } = context;

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

  useEffect(() => {
    if (context?.gameData) {
      const data = context.gameData;
      Name("เกมวาดรูป 6 เหลี่ยม");
      if (
        data.name == "" ||
        data.age == 0 ||
        data.disease == "" ||
        data.dataSet == 0
      ) {
        router.push("/");
      }
    }
  }, [context?.gameData]);

  const startGame = () => {
    setShowOverlay(false);
    playAudio("https://api.bxok.online/public/mp3/game1.mp3");
    Sound("https://api.bxok.online/public/mp3/game1.mp3");
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

  const getCoordinates = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ("touches" in event) {
      x = event.touches[0].clientX - rect.left;
      y = event.touches[0].clientY - rect.top;
    } else {
      x = event.nativeEvent.offsetX;
      y = event.nativeEvent.offsetY;
    }

    return { x, y };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);

    // Prevent default touch behavior to avoid scrolling
    if ("touches" in e) {
      e.preventDefault();
    }
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Prevent default touch behavior to avoid scrolling
    if ("touches" in e) {
      e.preventDefault();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000000";
        ctx.lineCap = "round";
      }
    }
  }, []);

  const submit = () => {
    router.push("/gamecolor");
        updateScore(1);
        StopTime();
  };

  return (
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
                  className="border border-gray-300 rounded touch-none"
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
    </div>
  );
}
