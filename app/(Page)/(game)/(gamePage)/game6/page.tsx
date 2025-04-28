"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaRedo, FaVolumeUp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { detailGame456 } from "@/app/Types/game.types";
import useGame from "@/app/Hook/GameHook/context.hook";
import NavBar from "@/app/Components/UI/Game/NavBar/page";
import InfoGame6 from "@/app/Components/UI/Game/info/game6.info";

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

  const context = useGame()

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
      resetGame()
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
    router.push('/gameresult')
  };

  return (
    <div className="w-full h-full min-h-screen  bg-gradient-to-r from-indigo-100 to-purple-100">
      <NavBar />
      {showOverlay ? (
        <InfoGame6 btn={handleStartGame} />
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
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
