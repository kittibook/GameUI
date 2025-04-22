"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaRedo } from "react-icons/fa"; // Import reset icon
import Navbar from "../navbar/page"; // Import Navbar
import { useRouter } from "next/navigation";
import { GameContext } from "@/app/Context/gameContext";
import { detailGame456 } from "@/app/Types/gameProvider";
import { motion } from "framer-motion";

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
  const [round, setRound] = useState(0); // Track rounds (1-4)
  const [selectedAnimals, setSelectedAnimals] = useState<number[]>([]); // Track used animals
  const hasStarted = useRef(false);
  const [detail, setDetail] = useState<detailGame456[]>([]);

  const context = useContext(GameContext);

  if (!context) {
    return <p>Loading context...</p>;
  }

  const { updateGame4, updateScore, StartTime, StopTime, time } = context;

  useEffect(() => {
    if (round === 4) {
      StopTime()
    }
  }, [round])

  //กันไม่กรอกข้อมูล
  useEffect(() => {
    if (context?.gameData) {
      const data = context.gameData
      if (data.name == "" || data.age == 0 || data.disease == "" || data.dataSet == 0) {
        router.push('/')
      }
    }
  }, [context?.gameData]);


//ทดสอบ
// useEffect(() => {
//   if (context.gameData) {
//     console.log(context.gameData)
//   }
// }, [context?.gameData])

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

  useEffect(() => {
    if (!hasStarted.current) {
      const firstAnimal = getRandomAnimal();
      if (firstAnimal) {
        setCurrentAnimal(firstAnimal);
        setOptions(getOptions(firstAnimal));
        setSelectedAnimals([firstAnimal.id]);
        hasStarted.current = true;
        StartTime()
      }
    }
  }, []);

  const handleAnswer = (selectedOption: string) => {
    if (currentAnimal) {
      if (selectedOption === currentAnimal.name) {
        // console.log(selectedOption)
        const details = { ismatch: true, problems: currentAnimal.image, reply: currentAnimal.name, answer: currentAnimal.name }
        setDetail([...detail, details])
        updateScore(1)
        setScore(score + 1);
      } else {
        const details = { ismatch: false, problems: currentAnimal.image, reply: selectedOption, answer: currentAnimal.name }
        setDetail([...detail, details])

      }
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
    }
    updateGame4(dataGame4)
    router.push('/gamesound')
  };

  const isGameOver = round === 4;

  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200 bg-fixed">
      <Navbar />
      <div className="flex flex-col items-center min-h-screen pt-5 px-4">
        <div className="font-mali text-lg md:text-4xl font-bold text-red-600 animate-pulse">
          คะแนน: {score}
        </div>
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
          <div className="text-center">
            <button
              className="fixed top-1/2 right-5 transform -translate-y-1/2 p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl text-white"
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
  );
}