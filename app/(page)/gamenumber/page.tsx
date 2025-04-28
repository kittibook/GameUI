"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../navbar/page";
import { FaRedo } from "react-icons/fa";
import { GameContext } from "@/app/Context/gameContext";
import { useRouter } from "next/navigation";
import { detailGame3 } from "@/app/Types/gameProvider";
import { motion } from "framer-motion";
import ScoreShow from "../UI/score";

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
  const [cards, setCards] = useState<cards[]>(
    shuffleCards([...initialCards, ...initialCards])
  );
  const [selectedCards, setSelectedCards] = useState<selected[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const context = useContext(GameContext);
  const router = useRouter();
  const [detail, setDetail] = useState<detailGame3[]>([]);

  if (!context) {
    return <p>Loading context...</p>;
  }

  const { updateGame3, updateScore, StartTime, StopTime, time, Sound } = context;

  const hasStarted = useRef(false);
  const hasFlipped = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlaying = useRef(false);

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
      const data = context.gameData;
      context.Name("เกมจับคู่เลข")
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

  const startgame = () => {
    if (!hasStarted.current) {
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
          StartTime();
        }
      }, 9000);
    }
  };

  const handleStartGame = () => {
    setShowOverlay(false);
    startgame();
    playAudio("https://api.bxok.online/public/mp3/game3.mp3");
    Sound("https://api.bxok.online/public/mp3/game3.mp3")
  };

  useEffect(() => {
    if (matchedPairs === 3) {
      StopTime();
    }
  }, [matchedPairs]);

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

  // function shuffleCards(array: any[]) {
  //   return array.sort(() => Math.random() - 0.5);
  // }

  function shuffleCards(array: any[]) {
    const result = [...array]; // clone array เพื่อไม่เปลี่ยนของเดิม
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
  
    // ตรวจว่าหลัง shuffle ยังเหมือนเดิมไหม
    if (array.every((val, index) => val === result[index])) {
      // ถ้าเหมือนเดิม ลองสับใหม่
      return shuffleCards(array);
    }
  
    return result;
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
        time: time,
      };
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

    if (
      updatedCards[first.index].number === updatedCards[second.index].number
    ) {
      setCards(
        updatedCards.map((card: any, idx: any) =>
          idx === first.index || idx === second.index
            ? { ...card, matched: true, error: 1 }
            : card
        )
      );
      updateScore(1);
      const Detail = {
        ismatch: true,
        detail: [
          { number: updatedCards[first.index].number, time: first.time },
          { number: updatedCards[second.index].number, time: second.time },
        ],
      };
      setDetail([...detail, Detail]);
      setScore(score + 1);
      setMatchedPairs(matchedPairs + 1);
      setSelectedCards([]);
      setDisabled(false);
    } else {
      setCards(
        updatedCards.map((card: any, idx: any) =>
          idx === first.index || idx === second.index
            ? { ...card, error: 0 }
            : card
        )
      );
      const Detail = {
        ismatch: false,
        detail: [
          { number: updatedCards[first.index].number, time: first.time },
          { number: updatedCards[second.index].number, time: second.time },
        ],
      };
      setDetail([...detail, Detail]);
      setSelectedCards([]);
      setMatchedPairs(matchedPairs + 1);
      setDisabled(false);
    }
  };

  const submit = () => {
    const problems = cards.map((v) => v.number);
    const dataGame3 = {
      name: "เกมจับคู่เลข",
      time: time,
      score: score,
      problems: problems,
      detail: detail,
    };
    updateGame3(dataGame3);
    router.push("/gameChooseanimal");
  };

  const isGameOver = cards.every((card) => card.matched || card.error === 0);

  return (
    <div className="w-full h-screen relative">
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
          left: 50%;
          animation-delay: 4s;
        }

        .particle:nth-child(4) {
          top: 50%;
          left: 90%;
          animation-delay: 6s;
        }
        .particle:nth-child(5) {
          top: 50%;
          left: 20%;
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
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25), inset 0 0 10px rgba(255, 255, 255, 0.3);
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
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3), 0 0 20px rgba(168, 85, 247, 0.5);
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
 hunting rifle effect
          transition: left 0.5s ease;
        }

        .start-button:hover {
          transform: scale(1.1) rotate(3deg);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4), 0 0 30px rgba(168, 85, 247, 0.7);
        }

        .start-button:hover::before {
          left: 100%;
        }

        .start-button:active {
          transform: scale(0.95);
        }

        .floating-card {
          position: absolute;
          width: 60px;
          height: 80px;
          background: url('/images/cardback.png') no-repeat center/cover;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          animation: floatCard 12s infinite ease-in-out;
          pointer-events: none;
        }

        .floating-card:nth-child(1) {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-card:nth-child(2) {
          top: 70%;
          left: 80%;
          animation-delay: 3s;
        }

        @keyframes floatCard {
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
          className="overlay flex justify-center bg-gradient-to-r from-indigo-100 to-purple-100 w-full min-h-screen pt-20 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {/* Particle Effects */}
          <div className="particle">🟠</div>
          <div className="particle">🟣</div>
          <div className="particle ">🟡</div>
          <div className="particle floating-card"></div>
          <div className="particle floating-card"></div>

          <motion.div
            className="instructions "
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
              เกมจับคู่เลข!
            </motion.h2>
            <motion.p
              className="font-mali text-xl md:text-2xl text-black mb-8 leading-relaxed"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              ทดสอบความจำของคุณด้วยการจับคู่ตัวเลขให้ครบ 3 คู่! <br />
              พร้อมแล้วหรือยัง? มาสนุกกันเลย!
            </motion.p>
            <motion.ul
              className="font-mali text-lg md:text-xl text-black list-disc list-inside mb-10 space-y-3"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* <li>ดูการ์ดทั้งหมด 5 วินาทีเมื่อเริ่มเกม</li>
              <li>คลิกเพื่อเปิดการ์ดและจับคู่ตัวเลข</li>
              <li>ได้คะแนนเมื่อจับคู่สำเร็จ</li>
              <li>จบเกมเมื่อจับคู่ครบ 3 คู่!</li> */}
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
        <div className="w-full h-full bg-fixed  bg-gradient-to-r from-indigo-100 to-purple-100">
          <div className="flex flex-col items-center w-full min-h-screen pt-10">
            {matchedPairs !== 3 && (
              <>
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
                            } text-9xl font-bold font-mali text-blue-500`}
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

              </>
            )}

            {matchedPairs === 3 && (
              <div className="text-center mt-16">
                <ScoreShow gameName={context?.gameName} score={score.toString()} />
                <button className="mt-8 text-white p-4 rounded-full hover:scale-110 transition-all text-xl" onClick={submit}>
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
    </div>
  );
}
