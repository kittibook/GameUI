"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaRedo, FaVolumeUp } from "react-icons/fa";
import Navbar from "../navbar/page"; // Import Navbar
import { GameContext } from "@/app/Context/gameContext";
import { detailGame456 } from "@/app/Types/gameProvider";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Game_AnimalMatch() {
  const animals = [
    { id: 1, name: "ไก่", image: "/images/chicken.png", sound: 'https://api.bxok.online/public/mp3/chicken.mp3' },
    { id: 2, name: "เสือ", image: "/images/tiger.png", sound: 'https://api.bxok.online/public/mp3/tiger.mp3' },
    { id: 3, name: "หมา", image: "/images/dog.png", sound: 'https://api.bxok.online/public/mp3/dog.mp3' },
    { id: 4, name: "แมว", image: "/images/cat.png", sound: 'https://api.bxok.online/public/mp3/cat.mp3' },
  ];
  const router = useRouter();

  const [currentAnimal, setCurrentAnimal] = useState<{
    id: number;
    name: string;
    image: string;
    sound: string
  } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const isPlaying = useRef(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [selectedAnimals, setSelectedAnimals] = useState<number[]>([]);
  const hasStarted = useRef(false);
  const context = useContext(GameContext);
  const [detail, setDetail] = useState<detailGame456[]>([]);

  if (!context) {
    return <p>Loading context...</p>;
  }

  const { updateGame5, updateScore, StartTime, StopTime, time } = context;
  useEffect(() => {
    if (round === 4) {
      StopTime()
    }
  }, [round])

  //ทดสอบ
  useEffect(() => {
    if (context.gameData) {
      console.log(context.gameData)
    }
  }, [context?.gameData])


  //กันไม่กรอกข้อมูล
  useEffect(() => {
    if (context?.gameData) {
      const data = context.gameData
      if (data.name == "" || data.age == 0 || data.disease == "" || data.dataSet == 0) {
        router.push('/')
      }
    }
  }, [context?.gameData]);

  const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

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

  useEffect(() => {
    if (!hasStarted.current) {
      const first = getRandomAnimal();
      if (first) {
        setCurrentAnimal(first);
        setOptions(getOptions(first));
        setSelectedAnimals([first.id]);
        StartTime()
        hasStarted.current = true;
      }
    }
  }, []);

  const handleAnswer = (selectedName: string) => {
    if (currentAnimal) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        isPlaying.current = false;
      }
      if (currentAnimal && selectedName === currentAnimal.name) {
        const details = { ismatch: true, problems: currentAnimal.sound, reply: currentAnimal.name, answer: currentAnimal.name }
        setDetail([...detail, details])
        updateScore(1)
        setScore(score + 1);
      } else {
        const details = { ismatch: false, problems: currentAnimal.sound, reply: selectedName, answer: currentAnimal.name }
        setDetail([...detail, details])

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
    }
  };

  const resetGame = () => {
    const dataGame5 = {
      name: "เกมเสียงสัตว์",
      time: time,
      score: score,
      detailproblems: detail,
    }
    updateGame5(dataGame5)
    router.push('/game6')

  };

  const playAudio = () => {
    if (currentAnimal) {
      if (!audioRef.current) {
        // Create the audio element only after the user interacts
        audioRef.current = new Audio(currentAnimal?.sound);
        audioRef.current.muted = false;  // Make sure it's not muted
        audioRef.current.volume = 1;     // Set volume to full
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        isPlaying.current = false;
      }

      audioRef.current.src = currentAnimal?.sound;
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
  const isGameOver = round === 4;

  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-br from-yellow-100 via-green-100 to-blue-100 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-start pt-10">
        <h1 className="text-4xl font-bold text-blue-700 mb-6">คะแนน: {score}</h1>

        {!isGameOver && currentAnimal && (
          <>
            {/* ปุ่มลำโพง */}
            <button className="mb-10">
              {/* <img
                src="/images/speaker.png"
                alt="Play sound"
                className="w-48 h-48 hover:scale-110 transition-transform"
              /> */}
              <FaVolumeUp onClick={playAudio} className="text-blue-500 text-lg md:text-2xl w-48 h-48" />
            </button>

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
                      src={animalObj?.image || ""}
                      alt={animalObj?.name || "Unknown animal"}
                      className="w-full h-full object-contain"
                    />
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* เกมจบแล้ว */}
        {isGameOver && (
          <div className="text-center mt-16">
            <p className="text-3xl font-bold text-green-600">
              เกมจบแล้ว! คะแนนของคุณ: {score}/4
            </p>
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
  );
}