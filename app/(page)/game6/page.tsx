"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaRedo, FaVolumeUp } from "react-icons/fa";
import Navbar from "../navbar/page";
import { motion } from "framer-motion";
import { GameContext } from "@/app/Context/gameContext";
import { useRouter } from "next/navigation";
import { detailGame456 } from "@/app/Types/gameProvider";
import ScoreShow from "../UI/score";
import { Bounce, toast, ToastContainer } from "react-toastify";

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
  ];

  const [currentAnimal, setCurrentAnimal] = useState<{
    id: number;
    name: string;
    sound: string;
  } | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const router = useRouter();
  const [detail, setDetail] = useState<detailGame456[]>([]);

  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const hasStarted = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlaying = useRef(false);

  const context = useContext(GameContext);

  if (!context) {
    return <p>Loading context...</p>;
  }

  const { StartTime, StopTime, time, Sound, updateScore, updateGame6 } = context;

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
    if (context?.gameData) {
      const data = context.gameData;
      context.Name("เกมเสียงธรรมชาติ")
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
  const handleStartGame = () => {
    setShowOverlay(false);
    startgame();
    playAudios("https://api.bxok.online/public/mp3/game6.mp3");
    Sound("https://api.bxok.online/public/mp3/game6.mp3")
  };


  const startgame = () => {
    if (!hasStarted.current) {
      const animal = getRandomAnimal();
      if (animal) {
        setCurrentAnimal(animal);
        setOptions(getOptions(animal));
        hasStarted.current = true;
        StartTime()
      }
    }
  }

  const playAudios = (audioUrl: string) => {
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
        .catch((error) => {
          isPlaying.current = false;
        });

      audioRef.current.onended = () => {
        isPlaying.current = false;
      };
    }
  };

  const handleAnswer = (selectedOption: string) => {
    if (currentAnimal) {

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        isPlaying.current = false;
      }
      if (selectedOption === currentAnimal.name) {
        const details = {
          ismatch: true,
          problems: currentAnimal.sound,
          reply: selectedOption,
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
          problems: currentAnimal.sound,
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
      setIsGameOver(true);
      StopTime()
    }
  };



  const resetGame = () => {
    const dataGame6 = {
      name: "เกมเสียงธรรมชาติ",
      time: time,
      score: score,
      detailproblems: detail,
    };
    updateGame6(dataGame6);
    router.push('/GameResult')
  };

  return (
    <div className="w-full h-full min-h-screen  bg-gradient-to-r from-indigo-100 to-purple-100">
      <Navbar />
      {showOverlay ? (
        <motion.div
          className="overlay flex justify-center bg-gradient-to-r from-indigo-100 to-purple-100 w-full min-h-screen pt-20 "
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
              {/* <li>กดปุ่มลำโพงเพื่อฟังเสียง</li>
              <li>เลือกคำที่ตรงกับเสียงจากตัวเลือก</li>
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
          {/* <div className="font-mali text-lg md:text-4xl font-bold text-red-600 animate-pulse">
            คะแนน: {score}
          </div> */}
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
              {/* <p className="text-lg md:text-2xl font-bold text-green-600">
                เกมจบแล้ว! คะแนนของคุณ: {score}/1
              </p> */}
              <ScoreShow gameName={context?.gameName} score={score.toString()} />

              <button
                className="mt-8 text-white p-4 rounded-full hover:scale-110 transition-all text-xl"
                onClick={resetGame}
              >
                <motion.img
                  className="mt-6 "
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
      )}
      <ToastContainer />
    </div>
  );
}
