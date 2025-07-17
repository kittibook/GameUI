"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import useGame from "@/app/Hook/GameHook/context.hook";
import { detailGame3 } from "@/app/Types/game.types";
import "@/app/Styles/Game/gamecolor.styles.css";
import NavBar from "@/app/Components/UI/Game/NavBar/page";
import InfoGamenumber from "@/app/Components/UI/Game/info/gamenumber.info";
import GameGuard from "@/app/Components/Layout/GameGuard";
import { config } from "@/app/Config/config";
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
  const [cards, setCards] = useState<cards[]>([]);
  const [selectedCards, setSelectedCards] = useState<selected[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const router = useRouter();
  const [detail, setDetail] = useState<detailGame3[]>([]);

  const context = useGame();
  const {
    updateGame3,
    updateScore,
    StartTime,
    StopTime,
    time,
    Sound,
    setting,
  } = context;

  const hasStarted = useRef(false);
  const hasFlipped = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlaying = useRef(false);

  useEffect(() => {
    let problems: number[];
    if (setting?.game3?.Card) {
      problems = JSON.parse(setting.game3.Card.problems);
    } else {
      problems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }
    // console.log(problems)
    const newCards = createArray(problems);
    const shuffled = shuffleCards([...newCards, ...newCards]);
    setCards(shuffled);
  }, [setting]);

  function createArray(input: number[]): cards[] {
    const result: cards[][] = [];
    let id = 1;

    for (let i = 0; i < input.length - 2; i++) {
      const row: cards[] = [];

      for (let j = 0; j < 3; j++) {
        row.push({
          id: id++,
          number: input[i + j],
          flipped: false,
          matched: false,
          error: 3,
        });
      }

      result.push(row);
    }

    return result[Math.floor(Math.random() * result.length)];
  }

  useEffect(() => {
    context.Name("เกมจับคู่เลข");
  }, []);

  const startgame = () => {
    if (!hasStarted.current) {
      hasStarted.current = true;

      // Step 1: รอ 10 วิ (ยังไม่เปิดการ์ด)
      setTimeout(() => {
        // Step 2: เปิดการ์ดทุกใบ
        setCards((prevCards) =>
          prevCards.map((card) => ({ ...card, flipped: true }))
        );

        // Step 3: แสดงการ์ด 5 วิ แล้วค่อยปิด
        setTimeout(() => {
          // Step 4: ปิดการ์ด
          setCards((prevCards) =>
            prevCards.map((card) => ({ ...card, flipped: false }))
          );
          hasFlipped.current = true;

          // Step 5: เริ่มจับเวลา
          StartTime();
        }, 5000); // 5 วินาที
      }, 10000); // 10 วินาทีแรก
    }
  };

  const handleStartGame = () => {
    setShowOverlay(false);
    startgame();
    if (setting.game3 && setting.game3.Sound) {
      playAudio(config.urlImage + setting.game3.Sound.url);
      Sound(config.urlImage + setting.game3.Sound.url);
    }
  };

  useEffect(() => {
    if (matchedPairs === 3) {
      StopTime();
      setTimeout(() => {
        submit();
      }, 1000);
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
    audioRef.current.play().catch((error) => {
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

  // const isGameOver = cards.every((card) => card.matched || card.error === 0);

  return (
    <GameGuard>
      <div className="w-full h-screen relative">
        <NavBar />
        {showOverlay ? (
          <InfoGamenumber btn={handleStartGame} />
        ) : (
          <div className="w-full h-full bg-fixed  bg-gradient-to-r from-indigo-100 to-purple-100">
            <div className="flex flex-col items-center w-full min-h-screen pt-10">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 p-6">
                    {cards.map((card, index) => (
                      <div
                        key={index}
                        className={`w-[171px] h-[242px] cursor-pointer card ${
                          card.flipped || card.matched ? "flipped" : ""
                        }`}
                        onClick={() => handleCardClick(index)}
                      >
                        <div className="card-inner">
                          <div
                            className={`card-front bg-white text-9xl font-bold font-mali text-blue-500`}
                          >
                            {card.number}
                          </div>
                          <div className="card-back">
                            <img
                              src={` ${
                                setting.game3.Card
                                  ? config.urlImage + setting.game3.Card.url
                                  : "/images/cardback.png"
                              }`}
                              alt="Card Back"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
            </div>
          </div>
        )}
      </div>
    </GameGuard>
  );
}
