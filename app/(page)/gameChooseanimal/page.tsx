"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { FaRedo } from "react-icons/fa";
import Navbar from "../navbar/page";
import { useRouter } from "next/navigation";
import { GameContext } from "@/app/Context/gameContext";
import { detailGame456 } from "@/app/Types/gameProvider";
import { motion } from "framer-motion";
import ScoreShow from "../UI/score";
import { Bounce, toast, ToastContainer } from "react-toastify";

interface currentAnimal {
  id: number;
  name: string;
  image: string;
}

export default function Game_AnimalMatch() {
  const router = useRouter();

  const animals = [
    { id: 1, name: "ไก่", image: "/images/chicken.png" },
    { id: 2, name: "เสือ", image: "/images/tiger.png" },
    { id: 3, name: "ปลา", image: "/images/fish.jpg" },
    { id: 4, name: "หมา", image: "/images/dog.png" },
    { id: 5, name: "แมว", image: "/images/cat.png" },
  ];

  const [currentAnimal, setCurrentAnimal] = useState<currentAnimal | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [selectedAnimals, setSelectedAnimals] = useState<number[]>([]);
  const [showOverlay, setShowOverlay] = useState(true);
  const [detail, setDetail] = useState<detailGame456[]>([]);
  const hasStarted = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlaying = useRef(false);

  const context = useContext(GameContext);

  if (!context) {
    return <p>Loading context...</p>;
  }

  const { updateGame4, updateScore, StartTime, StopTime, time, Sound } = context;

  // กันไม่กรอกข้อมูล
  useEffect(() => {
    if (context?.gameData) {
      const data = context.gameData;
      context.Name("เกมรูปสัตว์")
      if (
        data.name === "" ||
        data.age === 0 ||
        data.disease === "" ||
        data.dataSet === 0
      ) {
        router.push("/");
      }
    }
  }, [context?.gameData]);

  // Shuffle array utility
  const shuffleArray = (array: any[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const getRandomAnimal = () => {
    const availableAnimals = animals.filter(
      (animal) => !selectedAnimals.includes(animal.id)
    );
    if (availableAnimals.length === 0) return null;
    const shuffled = shuffleArray([...availableAnimals]);
    return shuffled[0];
  };

  const getOptions = (correctAnimal: { id: number; name: any }) => {
    const wrongOptions = animals
      .filter((animal) => animal.id !== correctAnimal.id)
      .map((animal) => animal.name);
    const shuffledWrong = shuffleArray(wrongOptions).slice(0, 2);
    const options = [correctAnimal.name, ...shuffledWrong];
    return shuffleArray(options);
  };

  const startGame = () => {
    if (!hasStarted.current) {
      const firstAnimal = getRandomAnimal();
      if (firstAnimal) {
        setCurrentAnimal(firstAnimal);
        setOptions(getOptions(firstAnimal));
        setSelectedAnimals([firstAnimal.id]);
        hasStarted.current = true;
        StartTime();
      }
    }
  };

  const handleStartGame = () => {
    setShowOverlay(false);
    startGame();
    playAudio("https://api.bxok.online/public/mp3/game4.mp3");
    Sound("https://api.bxok.online/public/mp3/game4.mp3")
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
    audioRef.current
      .play()
      .catch((error) => {
        isPlaying.current = false;
      });

    audioRef.current.onended = () => {
      isPlaying.current = false;
    };
  };

  useEffect(() => {
    if (round === 4) {
      StopTime();
    }
  }, [round]);

  const handleAnswer = (selectedOption: string) => {
    if (showOverlay || !currentAnimal) return;

    if (selectedOption === currentAnimal.name) {
      const details = {
        ismatch: true,
        problems: currentAnimal.image,
        reply: currentAnimal.name,
        answer: currentAnimal.name,
      };
      setDetail([...detail, details]);
      updateScore(1);
      setScore(score + 1);
      toast.success(`คำตอบถูกต้อง ✅`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } else {
      const details = {
        ismatch: false,
        problems: currentAnimal.image,
        reply: selectedOption,
        answer: currentAnimal.name,
      };
      setDetail([...detail, details]);
      toast.error(`❌ คำตอบที่ถูกคือ ${currentAnimal.name}`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }

    if (round < 3) {
      const nextAnimal = getRandomAnimal();
      if (nextAnimal) {
        setCurrentAnimal(nextAnimal);
        setOptions(getOptions(nextAnimal));
        setSelectedAnimals([...selectedAnimals, nextAnimal.id]);
        setRound(round + 1);
      }
    } else {
      setRound(round + 1);
    }
  };

  const resetGame = () => {
    const dataGame4 = {
      name: "เกมรูปสัตว์",
      time: time,
      score: score,
      detailproblems: detail,
    };
    updateGame4(dataGame4);
    router.push("/gamesound");
  };

  const isGameOver = round === 4;

  return (
    <div className="w-full h-screen relative">
      <style jsx>{`
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            #a855f7,
            #3b82f6,
            #22d3ee,
            #f472b6
          );
          background-size: 600%;
          animation: gradientFlow 20s ease infinite;
          z-index: 10;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          overflow: hidden;
        }

        @keyframes gradientFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .particle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: float 10s infinite ease-in-out;
          pointer-events: none;
        }

        .particle:nth-child(1) {
          top: 10%;
          left: 20%;
          animation-delay: 0s;
        }

        .particle:nth-child(2) {
          top: 30%;
          left: 70%;
          animation-delay: 2s;
        }

        .particle:nth-child(3) {
          top: 60%;
          left: 40%;
          animation-delay: 4s;
        }

        .particle:nth-child(4) {
          top: 80%;
          left: 90%;
          animation-delay: 6s;
        }

        @keyframes float {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-100px) scale(1.5);
            opacity: 0.8;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.5;
          }
        }

        .instructions {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          padding: 40px;
          border-radius: 30px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25),
            inset 0 0 10px rgba(255, 255, 255, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.4);
          max-width: 800px;
          width: 90%;
          text-align: center;
          position: relative;
          overflow: hidden;
          transform: perspective(1000px) rotateX(5deg);
          transition: transform 0.3s ease;
        }

        .instructions:hover {
          transform: perspective(1000px) rotateX(0deg);
        }

        .instructions::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.4) 0%,
            transparent 70%
          );
          animation: glowRotate 15s linear infinite;
          z-index: -1;
        }

        @keyframes glowRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .start-button {
          background: linear-gradient(135deg, #f472b6, #a855f7);
          color: white;
          padding: 20px 40px;
          border-radius: 15px;
          font-size: 1.8rem;
          font-weight: bold;
          cursor: pointer;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(168, 85, 247, 0.5);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .start-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s ease;
        }

        .start-button:hover {
          transform: scale(1.1) rotate(3deg);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4),
            0 0 30px rgba(168, 85, 247, 0.7);
        }

        .start-button:hover::before {
          left: 100%;
        }

        .start-button:active {
          transform: scale(0.95);
        }

        .floating-animal {
          position: absolute;
          width: 60px;
          height: 60px;
          background: url("/images/animal-icon.png") no-repeat center/cover;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          animation: floatAnimal 12s infinite ease-in-out;
          pointer-events: none;
        }

        .floating-animal:nth-child(1) {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-animal:nth-child(2) {
          top: 70%;
          left: 80%;
          animation-delay: 3s;
        }

        @keyframes floatAnimal {
          0% {
            transform: translateY(0) rotate(5deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-150px) rotate(-5deg);
            opacity: 0.9;
          }
          100% {
            transform: translateY(0) rotate(5deg);
            opacity: 0.6;
          }
        }
      `}</style>

      <Navbar />
      {showOverlay ? (
        <motion.div
          className="overlay flex justify-center w-full min-h-screen pt-20 bg-gradient-to-r from-indigo-100 to-purple-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {/* Particle Effects */}
          <div className="particle">🟠</div>
          <div className="particle">🟣</div>
          <div className="particle">🟡</div>
          <div className="particle floating-animal"></div>
          <div className="particle floating-animal"></div>

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
              เกมจับคู่สัตว์!
            </motion.h2>
            <motion.p
              className="font-mali text-xl md:text-2xl text-black mb-8 leading-relaxed"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              ทดสอบความจำของคุณด้วยการจับคู่ชื่อสัตว์กับรูปภาพ! <br />
              พร้อมแล้วหรือยัง? มาสนุกกันเลย!
            </motion.p>
            <motion.ul
              className="font-mali text-lg md:text-xl text-black list-disc list-inside mb-10 space-y-3"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* <li>ดูรูปสัตว์ที่แสดง</li>
              <li>เลือกชื่อสัตว์ที่ถูกต้องจากตัวเลือก</li>
              <li>ได้คะแนนเมื่อเลือกถูก</li>
              <li>จบเกมเมื่อเล่นครบ 4 รอบ!</li> */}
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
                onClick={handleStartGame}
                className="cursor-pointer mt-10 flex justify-center items-center"
              >
                <motion.img
                  className="drop-shadow-lg w-32 sm:w-40 md:w-48 px-4 py-2 rounded-lg"
                  src="/images/Startgame.png"
                  alt="Start Button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                />
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : (
        <div className="w-full h-full min-h-screen  bg-gradient-to-r from-indigo-100 to-purple-100 bg-fixed">
          <div className="flex flex-col items-center min-h-screen pt-5 px-4">

            {currentAnimal && !isGameOver && (
              <>
                <div className="mb-5 transition-transform duration-300 ease-in-out hover:scale-105">
                  <img
                    src={currentAnimal.image}
                    alt={currentAnimal.name}
                    className="max-w-full h-auto object-contain"
                  />
                </div>
                <div className="flex flex-wrap justify-center items-center gap-6 mt-10 max-w-4xl">
                  {options.map((option, index) => (
                    <button
                      key={index}
                      className="px-14 py-8 mx-6 bg-[url('/images/background.png')] font-mali bg-no-repeat bg-center bg-cover text-2xl font-bold text-gray-700 transition-transform duration-300 ease-in-out hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[200px] min-h-[115px] flex items-center justify-center"
                      onClick={() => handleAnswer(option)}
                      disabled={isGameOver}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            )}
            {isGameOver && (
              <div className="text-center mt-16">
                <ScoreShow gameName={context?.gameName} score={score.toString()} />
                <button
                  className="mt-8 text-white p-4 rounded-full hover:scale-110 transition-all text-xl"
                  onClick={resetGame}
                >
                  <motion.img
                    className="mt-6 drop-shadow-lg"
                    src="/images/next.png"
                    alt="Next Button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}