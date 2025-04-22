"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaRedo, FaVolumeUp } from "react-icons/fa";
import Navbar from "../navbar/page";
import { motion } from "framer-motion";
import { GameContext } from "@/app/Context/gameContext";
import { useRouter } from "next/navigation";

export default function Game_AnimalMatch() {
  const [showOverlay, setShowOverlay] = useState(true); // Add this state variable
  const animals = [
    { id: 1, name: "ฝน", sound: "https://api.bxok.online/public/mp3/rain.mp3" },
    { id: 2, name: "ลม", sound: "https://api.bxok.online/public/mp3/soft.mp3" },
    {
      id: 3,
      name: "น้ำตก",
      sound: "https://api.bxok.online/public/mp3/waterfall.mp3",
    },
    {
      id: 4,
      name: "ควย",
      sound: "https://api.bxok.online/public/mp3/waterfall.mp3",
    }, // Change ID to be unique
  ];

  const [currentAnimal, setCurrentAnimal] = useState<{
    id: number;
    name: string;
    sound: string;
  } | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const router = useRouter();

  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const hasStarted = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlaying = useRef(false);

  const context = useContext(GameContext);

  if (!context) {
    return <p>Loading context...</p>;
  }

  const { StartTime, StopTime, time } = context;

  const shuffleArray = (array: any[]) =>
    [...array].sort(() => Math.random() - 0.5);

  const getRandomAnimal = () => {
    const shuffled = shuffleArray([...animals]);
    return shuffled[0];
  };

  const getOptions = (correctAnimal: { id: number; name: string }) => {
    const wrongOptions = animals
      .filter((animal) => animal.id !== correctAnimal.id)
      .map((animal) => animal.name);
    const selected = shuffleArray(wrongOptions).slice(0, 2);
    return shuffleArray([correctAnimal.name, ...selected]);
  };

  useEffect(() => {
    if (!hasStarted.current) {
      const animal = getRandomAnimal();
      if (animal) {
        setCurrentAnimal(animal);
        setOptions(getOptions(animal));
        hasStarted.current = true;
      }
    }

    // Hide overlay after 3 seconds
    setTimeout(() => setShowOverlay(false), 3000);
  }, []);

  useEffect(() => {
    if (context?.gameData) {
      const data = context.gameData;
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

  const playAudio = () => {
    if (currentAnimal) {
      if (!audioRef.current) {
        audioRef.current = new Audio(currentAnimal.sound);
        audioRef.current.muted = false;
        audioRef.current.volume = 1;
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        isPlaying.current = false;
      }

      audioRef.current.src = currentAnimal.sound;
      isPlaying.current = true;
      audioRef.current
        .play()
        .then(() => console.log("Audio played successfully"))
        .catch((error) => {
          console.error("Error playing audio:", error);
          isPlaying.current = false;
        });

      audioRef.current.onended = () => {
        isPlaying.current = false;
      };
    }
  };

  const handleAnswer = (selectedOption: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      isPlaying.current = false;
    }
    if (currentAnimal && selectedOption === currentAnimal.name) {
      setScore(score + 1);
    }
    setIsGameOver(true);
  };

  const resetGame = () => {
    const animal = getRandomAnimal();
    if (animal) {
      setCurrentAnimal(animal);
      setOptions(getOptions(animal));
      setScore(0);
      setIsGameOver(false);
      hasStarted.current = true;
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200 bg-fixed">
      <Navbar />
      {showOverlay ? (
        <motion.div
          className="overlay flex justify-center bg-green-200 pt-10 w-full min-h-screen pt-20 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="particle">🟠</div>
          <div className="particle">🟣</div>
          <div className="particle">🟡</div>
          <div className="particle floating-card"></div>
          <div className="particle floating-card"></div>

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
              เกมจับคู่เสียงธรรมชาติ!
            </motion.h2>
            <motion.p
              className="font-mali text-xl md:text-2xl text-black mb-8 leading-relaxed"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              ทดสอบความจำของคุณด้วยการจับคู่เสียงธรรมชาติ! <br />
              พร้อมแล้วหรือยัง? มาสนุกกันเลย!
            </motion.p>
            <motion.ul
              className="font-mali text-lg md:text-xl text-black list-disc list-inside mb-10 space-y-3"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <li>กดปุ่มลำโพงเพื่อฟังเสียง</li>
              <li>เลือกคำที่ตรงกับเสียงจากตัวเลือก</li>
              <li>ได้คะแนนเมื่อเลือกถูก</li>
              <li>จบเกมเมื่อเล่นครบ 4 รอบ!</li>
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
      ) : (
        <div className="flex flex-col items-center min-h-screen pt-5 px-4">
          <div className="font-mali text-lg md:text-4xl font-bold text-red-600 animate-pulse">
            คะแนน: {score}
          </div>
          {currentAnimal && !isGameOver && (
            <>
              <div className="mb-5 transition-transform duration-300 ease-in-out hover:scale-105">
                <FaVolumeUp
                  onClick={playAudio}
                  className="text-blue-500 text-lg md:text-2xl w-48 h-48"
                />
              </div>
              <div className="flex flex-wrap justify-center items-center gap-6 mt-10 max-w-4xl">
                {options.map((option, index) => (
                  <button
                    key={index}
                    className="px-14 py-8 mx-6 bg-[url('/images/background.png')] font-mali bg-no-repeat bg-center bg-cover text-2xl font-bold text-gray-700 transition-transform duration-300 ease-in-out hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed min-w-[200px] min-h-[115px] flex items-center justify-center"
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
            <div className="text-center">
              <p className="text-lg md:text-2xl font-bold text-green-600">
                เกมจบแล้ว! คะแนนของคุณ: {score}/1
              </p>
              <button
                className="fixed top-1/2 right-5 transform -translate-y-1/2 bg-gradient-to-br from-red-400 to-orange-400 p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl text-white"
                onClick={resetGame}
              >
                <FaRedo size={32} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
