"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { FaRedo, FaVolumeUp } from "react-icons/fa";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { detailGame456 } from "@/app/Types/game.types";
import useGame from "@/app/Hook/GameHook/context.hook";
import "@/app/Styles/Game/gamesound.styles.css";
import NavBar from "@/app/Components/UI/Game/NavBar/page";
import InfoGamesound from "@/app/Components/UI/Game/info/gamesound.info";
import GameGuard from "@/app/Components/Layout/GameGuard";
import { config } from "@/app/Config/config";

export default function Game_AnimalMatch() {
  // const animals = [
  //   {
  //     id: 1,
  //     name: "ไก่",
  //     image: "/images/chicken.png",
  //     sound: "https://api.bxok.online/public/mp3/chicken.mp3",
  //   },
  //   {
  //     id: 2,
  //     name: "เสือ",
  //     image: "/images/tiger.png",
  //     sound: "https://api.bxok.online/public/mp3/tiger.mp3",
  //   },
  //   {
  //     id: 3,
  //     name: "หมา",
  //     image: "/images/dog.png",
  //     sound: "https://api.bxok.online/public/mp3/dog.mp3",
  //   },
  //   {
  //     id: 4,
  //     name: "แมว",
  //     image: "/images/cat.png",
  //     sound: "https://api.bxok.online/public/mp3/cat.mp3",
  //   },
  // ];
  const router = useRouter();

  const [currentAnimal, setCurrentAnimal] = useState<{
    id: number;
    name: string;
    image: string;
    sound: string;
  } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const isPlaying = useRef(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [selectedAnimals, setSelectedAnimals] = useState<number[]>([]);
  const [showOverlay, setShowOverlay] = useState(true);
  const hasStarted = useRef(false);
  const [detail, setDetail] = useState<detailGame456[]>([]);
  const [animals, setAnimals] = useState<
    {
      id: number;
      name: string;
      image: string;
      sound: string;
    }[]
  >([]);

  const context = useGame();

  const {
    updateGame5,
    updateScore,
    StartTime,
    StopTime,
    time,
    Sound,
    setting,
  } = context;
  const createProblems = () => {
    if (!setting || !setting.game5 || !setting.game5.Point) {
      // console.log('Data default')
      return [
        {
          id: 1,
          name: "ไก่",
          image: "/images/chicken.png",
          sound: "https://api.bxok.online/public/mp3/chicken.mp3",
        },
        {
          id: 2,
          name: "เสือ",
          image: "/images/tiger.png",
          sound: "https://api.bxok.online/public/mp3/tiger.mp3",
        },
        {
          id: 3,
          name: "หมา",
          image: "/images/dog.png",
          sound: "https://api.bxok.online/public/mp3/dog.mp3",
        },
        {
          id: 4,
          name: "แมว",
          image: "/images/cat.png",
          sound: "https://api.bxok.online/public/mp3/cat.mp3",
        },
      ];
    }
    // console.log('Data in sql')
    const animal = setting.game5.Point.map((point: any, index: number) => {
      return {
        id: index + 1,
        name: point.answer,
        image: config.urlImage + point.url,
        sound: config.urlImage + point.problems,
      };
    });
    setAnimals(animal);
  };
  useEffect(() => {
    createProblems();
  }, [setting]);

  useEffect(() => {
    context.Name("เกมเสียงสัตว์");
  }, []);

  const shuffleArray = (array: any[]) =>
    [...array].sort(() => Math.random() - 0.5);

  const getRandomAnimal = () => {
    const available = animals.filter((a) => !selectedAnimals.includes(a.id));
    if (available.length === 0) return null;
    return shuffleArray(available)[0];
  };

  const getOptions = (correctAnimal: { id: number; name: string }) => {
    const wrongOptions = animals
      .filter((a) => a.id !== correctAnimal.id)
      .map((a) => a.name);
    const selected = shuffleArray(wrongOptions).slice(0, 2);
    return shuffleArray([correctAnimal.name, ...selected]);
  };

  const startGame = () => {
    if (!hasStarted.current) {
      const first = getRandomAnimal();
      if (first) {
        setCurrentAnimal(first);
        setOptions(getOptions(first));
        setSelectedAnimals([first.id]);
        hasStarted.current = true;
        StartTime();
      }
    }
  };

  const handleStartGame = () => {
    setShowOverlay(false);
    startGame();
    if (setting.game5 && setting.game5.Sound) {
      playAudio(config.urlImage + setting.game5.Sound.url);
      Sound(config.urlImage + setting.game5.Sound.url);
    }
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

  useEffect(() => {
    if (round === 4) {
      StopTime();
      resetGame();
    }
  }, [round]);

  const handleAnswer = (selectedName: string) => {
    if (showOverlay || !currentAnimal) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      isPlaying.current = false;
    }

    if (selectedName === currentAnimal.name) {
      const details = {
        ismatch: true,
        problems: currentAnimal.sound,
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
        problems: currentAnimal.sound,
        reply: selectedName,
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
      const next = getRandomAnimal();
      if (next) {
        setCurrentAnimal(next);
        setOptions(getOptions(next));
        setSelectedAnimals([...selectedAnimals, next.id]);
        setRound(round + 1);
      }
    } else {
      setRound(round + 1);
    }
  };

  const resetGame = () => {
    const dataGame5 = {
      name: "เกมเสียงสัตว์",
      time: time,
      score: score,
      detailproblems: detail,
    };
    updateGame5(dataGame5);
    router.push("/game6");
  };

  const isGameOver = round === 4;

  return (
    <GameGuard>
      <div className="w-full h-screen relative">
        <NavBar />
        {showOverlay ? (
          <InfoGamesound btn={handleStartGame} />
        ) : (
          <div className="w-full h-full min-h-screen  bg-gradient-to-r from-indigo-100 to-purple-100 flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-start pt-10">
              {!isGameOver && currentAnimal && (
                <>
                  {/* ปุ่มลำโพง */}
                  <button className="mb-10">
                    <FaVolumeUp
                      onClick={() => playAudio(currentAnimal.sound)}
                      className="text-blue-500 text-lg md:text-2xl w-48 h-48"
                    />
                  </button>
                  <div className="bg-blue-50 px-4 py-2 rounded-xl shadow text-center w-fit mx-auto">
                    <p className="text-gray-700 font-mali text-lg md:text-2xl font-bold">
                      กดปุ่มลำโพงเพื่อฟังเสียง
                    </p>
                  </div>
                  {/* ตัวเลือกเป็นรูปสัตว์ */}
                  <div className="flex gap-10 justify-center items-center w-full max-w-5xl mt-16">
                    {options.map((option, index) => {
                      const animalObj = animals.find((a) => a.name === option);
                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswer(option)}
                          className="w-80 h-80 p-0 m-0 overflow-hidden hover:scale-105 transition-transform disabled:cursor-not-allowed"
                          disabled={isGameOver}
                        >
                          <img
                            src={animalObj?.image}
                            alt={animalObj?.name || "Unknown animal"}
                            className="w-full h-full object-contain"
                          />
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              <ToastContainer />
            </div>
          </div>
        )}
      </div>
    </GameGuard>
  );
}
