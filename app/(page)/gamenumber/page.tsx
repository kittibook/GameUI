"use client";


import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../navbar/page";
import { FaRedo } from "react-icons/fa"; // Import ไอคอนรีเซ็ตจาก react-icons
import { GameContext } from "@/app/Context/gameContext";
import { useRouter } from "next/navigation";
import { detailGame3 } from "@/app/Types/gameProvider";
import { motion } from "framer-motion";

interface cards {
  id: number;
  number: number;
  flipped: boolean;
  matched: boolean;
  error: number;
}

interface selected {
  index: number;
  time: number;
}
export default function Game_CardflipNumber() {
  const initialCards = createArray();
  const [cards, setCards] = useState<cards[]>(shuffleCards([...initialCards, ...initialCards]));
  const [selectedCards, setSelectedCards] = useState<selected[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const context = useContext(GameContext);
  const router = useRouter();
  const [detail, setDetail] = useState<detailGame3[]>([]);

  if (!context) {
    return <p>Loading context...</p>;
  }

  const { updateGame3, updateScore, StartTime, StopTime, time } = context;

  const hasStarted = useRef(false);
  const hasFlipped = useRef(false);
  // const audioRef = useRef(new Audio());
  const isPlaying = useRef(false);  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  

  function createArray() {
    const array = [];
    let id = 1;
    let num = 1;
    let data = 1;
    for (let i = 0; i < 7; i++) {
      const row = [];
      for (let j = 0; j < 3; j++) {
        row.push({
          id: id,
          number: num,
          flipped: false,
          matched: false,
          error: 3,
        });
        id++;
        num++;
        if (num > 9) {
          num = 1;
        }
      }
      data++;
      num = data;
      array.push(row);
    }
    return array[Math.floor(Math.random() * array.length)];
  }
  useEffect(() => {
    if (context?.gameData) {
      const data = context.gameData
      if (data.name == "" || data.age == 0 || data.disease == "" || data.dataSet == 0) {
         router.push('/')
      }
    }
  }, [context?.gameData]);

  useEffect(() => {
     const handleFirstInteraction = () => {
       playAudio("https://api.bxok.online/public/mp3/game1.mp3");
       window.removeEventListener("click", handleFirstInteraction);
     };
     startgame()
     window.addEventListener("click", handleFirstInteraction);
   
     return () => {
       window.removeEventListener("click", handleFirstInteraction);
     };
   }, []);
   const startgame = () => {
    if (!hasStarted.current) {
      // playAudio("https://apipic.bxoks.online/public/uploads/startgame.mp3");
      hasStarted.current = true;
      setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card) => ({ ...card, flipped: true }))
        );
      }, 4000);
      setTimeout(() => {
        if (!hasFlipped.current) {
          setCards((prevCards) =>
            prevCards.map((card) => ({ ...card, flipped: false }))
          );
          hasFlipped.current = true;
          StartTime()
        }
      }, 9000);
    }
  }


  useEffect(() => {
    if (matchedPairs === 3) {
      StopTime()
    }
  }, [matchedPairs])

  const playAudio = (audioUrl: string) => {
    if (!audioRef.current) {
      // Create the audio element only after the user interacts
      audioRef.current = new Audio(audioUrl);
      audioRef.current.muted = false;  // Make sure it's not muted
      audioRef.current.volume = 1;     // Set volume to full
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
      .then(() => console.log("Audio played successfully"))
      .catch((error) => {
        console.error("Error playing audio:", error);
        isPlaying.current = false;
      });

    audioRef.current.onended = () => {
      isPlaying.current = false;
    };
  };

  function shuffleCards(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
  }

  const handleCardClick = (index: number) => {
    if (hasFlipped.current) {
      if (disabled || cards[index].flipped || cards[index].matched) return;
      const updatedCards = cards.map((card, idx) =>
        idx === index ? { ...card, flipped: true } : card
      );
      setCards(updatedCards);
      const dataselected = {
        index: index,
        time: time
      }
      const updatedSelected = [...selectedCards, dataselected];
      setSelectedCards(updatedSelected);

      if (updatedSelected.length === 2) {
        checkMatch(updatedSelected, updatedCards);
      }
    }
  };

  const checkMatch = (selected: selected[], updatedCards: any[]) => {
    const [first, second] = selected;
    setDisabled(true);

    if (updatedCards[first.index].number === updatedCards[second.index].number) {
      setCards(
        updatedCards.map((card: any, idx: any) =>
          idx === first || idx === second
            ? { ...card, matched: true, error: 1 }
            : card
        )
      );
      updateScore(1)
      const Detail = {
        ismatch: true,
        detail: [
          { number: updatedCards[first.index].number, time: first.time },
          { number: updatedCards[second.index].number, time: second.time },
        ]
      }

      setDetail([...detail, Detail])
      updateScore(1)
      setScore(score + 1);
      setMatchedPairs(matchedPairs + 1);
      setSelectedCards([]);
      setDisabled(false);
    } else {
      setCards(
        updatedCards.map((card: any, idx: any) =>
          idx === first || idx === second ? { ...card, error: 0 } : card
        )
      );
      const Detail = {
        ismatch: false,
        detail: [
          { number: updatedCards[first.index].number, time: first.time },
          { number: updatedCards[second.index].number, time: second.time },
        ]
      }
      setDetail([...detail, Detail])
      setSelectedCards([]);
      setMatchedPairs(matchedPairs + 1);
      setDisabled(false);
    }
  };


  const submit = () => {
    const problems = cards.map((v) => v.number)
    const dataGame3 = {
      name: "เกมจับคู่เลข",
      time: time,
      score: score,
      problems: problems,
      detail: detail
    }
    updateGame3(dataGame3)
    router.push('/gameChooseanimal')
  };

  const isGameOver = cards.every((card) => card.matched || card.error === 0);

  return (
    <div className="w-full h-full bg-fixed bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200">
      <style jsx>{`
        .card {
          perspective: 1000px;
          transform-style: preserve-3d;
          transition: all 0.6s ease-in-out;
        }

        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }

        .card:hover {
          transform: scale(1.05) rotate(2deg);
        }

        .card.flipped .card-inner {
          transform: rotateY(180deg);
        }

        .card-front,
        .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }

        .card-front {
          transform: rotateY(180deg);
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #ffffff, #f0f0f0);
        }

        .card-back {
          transform: rotateY(0deg);
          background: linear-gradient(135deg, #4b6cb7, #182848);
        }

        .card-front.error {
          animation: shake 0.5s ease-in-out;
        }

        .card-front.matched {
          animation: bounce 0.8s ease-in-out;
        }

        @keyframes shake {
          0% {
            transform: rotateY(180deg) translateX(0);
          }
          25% {
            transform: rotateY(180deg) translateX(-10px);
          }
          50% {
            transform: rotateY(180deg) translateX(10px);
          }
          75% {
            transform: rotateY(180deg) translateX(-10px);
          }
          100% {
            transform: rotateY(180deg) translateX(0);
          }
        }

        @keyframes bounce {
          0% {
            transform: rotateY(180deg) scale(1);
          }
          50% {
            transform: rotateY(180deg) scale(1.1);
          }
          100% {
            transform: rotateY(180deg) scale(1);
          }
        }

        .score-text {
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .reset-button {
          position: fixed;
          top: 50%;
          right: 20px;
          transform: translateY(-50%);
          padding: 12px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          color: white;
          cursor: pointer;
        }

      `}</style>
      <Navbar />
      <div className="flex flex-col items-center w-full min-h-screen pt-10">
        <div className="font-mali md:text-4xl text-lg font-bold text-red-600 score-text">
          คะแนน: {score}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 p-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`w-[171px] h-[242px] cursor-pointer card ${card.flipped || card.matched ? "flipped" : ""
                }`}
              onClick={() => handleCardClick(index)}
            >
              <div className="card-inner">
                <div
                  className={`card-front ${card.error === 0
                    ? "bg-red-300 error"
                    : card.error === 1
                      ? "bg-green-300 matched"
                      : "bg-white"
                    } text-9xl font-bold font-mail text-blue-500`}
                >
                  {card.number}
                </div>
                <div className="card-back">
                  <img
                    src="/images/cardback.png"
                    alt="Card Back"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {matchedPairs === 3 && (
          <button className="reset-button" onClick={submit}>
            <motion.img
              className="mt-6 drop-shadow-lg"
              src="/images/next.png"
              alt="Next Button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            />
          </button>
        )}
      </div>
    </div>
  );
}
