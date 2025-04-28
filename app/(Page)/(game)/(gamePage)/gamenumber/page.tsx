"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import useGame from "@/app/Hook/GameHook/context.hook";
import { detailGame3 } from "@/app/Types/game.types";
import '@/app/Styles/Game/gamecolor.styles.css'
import NavBar from "@/app/Components/UI/Game/NavBar/page";
import InfoGamenumber from "@/app/Components/UI/Game/info/gamenumber.info";
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
  const context = useGame()
  const router = useRouter();
  const [detail, setDetail] = useState<detailGame3[]>([]);


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
      submit()
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
    router.push("/gamechooseanimal");
  };

  const isGameOver = cards.every((card) => card.matched || card.error === 0);

  return (
    <div className="w-full h-screen relative">
    
      <NavBar />
      {showOverlay ? (
        <InfoGamenumber btn={handleStartGame} />
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
          </div>
        </div>
      )}
    </div>
  );
}
