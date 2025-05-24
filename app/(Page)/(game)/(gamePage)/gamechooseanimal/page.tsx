"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { detailGame456 } from "@/app/Types/game.types";
import useGame from "@/app/Hook/GameHook/context.hook";
import NavBar from "@/app/Components/UI/Game/NavBar/page";
import '@/app/Styles/Game/gamechooseanimal.styles.css'
import InfoGamechooseanimal from "@/app/Components/UI/Game/info/gamechooseanimal.info";
import GameGuard from "@/app/Components/Layout/GameGuard";
import { config } from "@/app/Config/config";
interface currentAnimal {
  id: number;
  name: string;
  image: string;
}

export default function Game_AnimalMatch() {
  const router = useRouter();

  // const animals = [
  //   { id: 1, name: "ไก่", image: "/images/chicken.png" },
  //   { id: 2, name: "เสือ", image: "/images/tiger.png" },
  //   { id: 3, name: "ปลา", image: "/images/fish.jpg" },
  //   { id: 4, name: "หมา", image: "/images/dog.png" },
  //   { id: 5, name: "แมว", image: "/images/cat.png" },
  // ];

  const [currentAnimal, setCurrentAnimal] = useState<currentAnimal | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [animals, setAnimals] = useState<currentAnimal[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [selectedAnimals, setSelectedAnimals] = useState<number[]>([]);
  const [showOverlay, setShowOverlay] = useState(true);
  const [detail, setDetail] = useState<detailGame456[]>([]);
  const hasStarted = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlaying = useRef(false);

  const context = useGame()
  const { updateGame4, updateScore, StartTime, StopTime, time, Sound, setting } = context;

  const createProblems = () => {
    if (!setting || !setting.game4 || !setting.game4.Point) {
      return [
        { id: 1, name: "ไก่", image: "/images/chicken.png" },
        { id: 2, name: "เสือ", image: "/images/tiger.png" },
        { id: 3, name: "ปลา", image: "/images/fish.jpg" },
        { id: 4, name: "แมว", image: "/images/cat.png" },
      ]
    }
    const animal = setting.game4.Point.map((point: any, index: number) => {
      return { id: index + 1, name: point.answer, image: point.url }
    })
    // console.log(animal)
    setAnimals(animal)
    // return [
    //     { id: 1, name: setting.game4.Point1.problems, image: "/images/chicken.png" },
    //     { id: 2, name: "เสือ", image: "/images/tiger.png" },
    //     { id: 3, name: "ปลา", image: "/images/fish.jpg" },
    //     { id: 4, name: "แมว", image: "/images/cat.png" },
    //   ]
  }
  useEffect(() => {
    createProblems()
  }, [setting]);
  useEffect(() => {
    context.Name("เกมรูปสัตว์")
  }, []);

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
    if (setting.game4 && setting.game4.Sound) {
      playAudio(config.urlImage + setting.game4.Sound.url);
      Sound(config.urlImage + setting.game4.Sound.url);
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
      resetGame();
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
    <GameGuard>

      <div className="w-full h-screen relative">

        <NavBar />
        {showOverlay ? (
          <InfoGamechooseanimal btn={handleStartGame} />
        ) : (
          <div className="w-full h-full min-h-screen  bg-gradient-to-r from-indigo-100 to-purple-100 bg-fixed">
            <div className="flex flex-col items-center min-h-screen pt-5 px-4">

              {currentAnimal && !isGameOver && (
                <>
                  <div className="mb-5 transition-transform duration-300 ease-in-out hover:scale-105">
                    <img
                      src={config.urlImage + currentAnimal.image}
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

            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </GameGuard>

  );
}