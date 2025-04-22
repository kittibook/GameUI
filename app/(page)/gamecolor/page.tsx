"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../navbar/page";
import { FaRedo } from "react-icons/fa"; // Import ไอคอนรีเซ็ตจาก react-icons
import { GameContext } from "@/app/Context/gameContext";
import { detailGame2 } from "@/app/Types/gameProvider";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface selected {
  index: number;
  time: number;
}
export default function Game_CardflipColor() {
  const color = [
    { id: 1, color: "#e51c23", flipped: false, matched: false, error: 3 },
    { id: 2, color: "#259b24", flipped: false, matched: false, error: 3 },
    { id: 3, color: "#ffeb3b", flipped: false, matched: false, error: 3 },
  ];
  const router = useRouter();

  const [card, setCard] = useState(shuffleCards([...color, ...color]));
  const [selectedCards, setSelectedCards] = useState<selected[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [detail, setDetail] = useState<detailGame2[]>([]);
  const context = useContext(GameContext);

  if (!context) {
    return <p>Loading context...</p>;
  }

  const { updateGame2, updateScore, StartTime, StopTime, time } = context;

  const hasStarted = useRef(false);
  const hasFlipped = useRef(false);
  // const audioRef = useRef(new Audio());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlaying = useRef(false);

  function shuffleCards(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
  }

  useEffect(() => {
    if (context?.gameData) {
      const data = context.gameData
      // console.log(data)
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
      hasStarted.current = true;
      setTimeout(() => {
        setCard((prevCards) =>
          prevCards.map((card) => ({ ...card, flipped: true }))
        );
      }, 4000);
      setTimeout(() => {
        if (!hasFlipped.current) {
          setCard((prevCards) =>
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
  const handleCardClick = (index: number) => {
    if (hasFlipped.current) {
      if (disabled || card[index].flipped || card[index].matched) return;
      const updatedCards = card.map((card, idx) =>
        idx === index ? { ...card, flipped: true } : card
      );
      setCard(updatedCards);
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

    if (updatedCards[first.index].id === updatedCards[second.index].id) {
      setCard(
        updatedCards.map((card, idx) =>
          idx === first.index || idx === second.index
            ? { ...card, matched: true, error: 1 }
            : card
        )
      );
      const Detail = {
        ismatch: true,
        detail: [
          { color: updatedCards[first.index].color, time: first.time },
          { color: updatedCards[second.index].color, time: second.time },
        ]
      }
      setDetail([...detail, Detail])
      setScore(score + 1);
      updateScore(1)
      setMatchedPairs(matchedPairs + 1);
      setSelectedCards([]);
      setDisabled(false);
    } else {
      setCard(
        updatedCards.map((card, idx) =>
          idx === first.index || idx === second.index ? { ...card, error: 0 } : card
        )
      );
      const Detail = {
        ismatch: false,
        detail: [
          { color: updatedCards[first.index].color, time: first.time },
          { color: updatedCards[second.index].color, time: second.time },
        ]
      }
      setDetail([...detail, Detail])
      setSelectedCards([]);
      setMatchedPairs(matchedPairs + 1);
      setDisabled(false);
    }

  };

  const submit = async () => {
    const problems = card.map((v) => v.color)

    const dataGame2 = {
      name: "เกมจับคู่สี",
      time: time,
      score: score,
      problems: problems,
      detail: detail
    }
    updateGame2(dataGame2)
    router.push('/gamenumber')
  };

  const isGameOver = card.every((card) => card.matched || card.error === 0);

  return (
    <div className="w-full h-full bg-fixed bg-gradient-to-br from-purple-200 via-blue-200 to-amber-300">
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
          border-radius: 50%;
          color: white;
          border: none;
          cursor: pointer;
        }

      `}</style>
      <Navbar />
      <div className="flex flex-col items-center w-full min-h-screen pt-10">
        <div className="font-mali md:text-4xl text-lg font-bold text-red-600 score-text">
          คะแนน: {score}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 p-6">
          {card.map((card, index) => (
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
                      : ""
                    }`}
                  style={{ backgroundColor: card.flipped ? card.color : "" }}
                ></div>
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
        {isGameOver && (
          <button className="reset-button" onClick={submit}>
            <div>

              <motion.img
                className="mt-6 drop-shadow-lg"
                src="/images/next.png"
                alt="Next Button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              />
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
