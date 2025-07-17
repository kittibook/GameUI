"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import useGame from "@/app/Hook/GameHook/context.hook";
import { detailGame2 } from "@/app/Types/game.types";
import NavBar from "@/app/Components/UI/Game/NavBar/page";
import "@/app/Styles/Game/gamecolor.styles.css";
import InfoGameColor from "@/app/Components/UI/Game/info/gamecolor.info";
import GameGuard from "@/app/Components/Layout/GameGuard";
import { config } from "@/app/Config/config";
interface selected {
  index: number;
  time: number;
}

export default function Game_CardflipColor() {
  const context = useGame();
  const {
    updateGame2,
    updateScore,
    StartTime,
    StopTime,
    time,
    Sound,
    setting,
  } = context;
  function createColor() {
    if (!setting.game2 || !setting.game2.Card) {
      // console.log('default Color')
      const color = [
        { id: 1, color: "#e51c23", flipped: false, matched: false, error: 3 },
        { id: 2, color: "#259b24", flipped: false, matched: false, error: 3 },
        { id: 3, color: "#ffeb3b", flipped: false, matched: false, error: 3 },
      ];
      return color;
    }
    try {
      const parsed = JSON.parse(setting.game2.Card.problems);
      // if (!Array.isArray(parsed)) throw new Error("Invalid problems format");
      // console.log('Color By game 2');
      return parsed.map((color: string, index: number) => ({
        id: index + 1,
        color,
        flipped: false,
        matched: false,
        error: 3,
      }));
    } catch (error) {
      console.warn("Invalid problems JSON, using default colors", error);
      return [
        { id: 1, color: "#e51c23", flipped: false, matched: false, error: 3 },
        { id: 2, color: "#259b24", flipped: false, matched: false, error: 3 },
        { id: 3, color: "#ffeb3b", flipped: false, matched: false, error: 3 },
      ];
    }
  }
  useEffect(() => {
    // console.log(setting)
    if (setting.game2?.Card) {
      const newColor = createColor();
      const shuffled = shuffleCards([...newColor, ...newColor]);
      // setColor(newColor);
      setCard(shuffled);
    }
  }, [setting]);

  const router = useRouter();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlaying = useRef(false);

  const [card, setCard] = useState<any[]>([]);
  const [selectedCards, setSelectedCards] = useState<selected[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [detail, setDetail] = useState<detailGame2[]>([]);
  const [showOverlay, setShowOverlay] = useState(true);
  // const [isGameComplete, setIsGameComplete] = useState(false);

  const hasStarted = useRef(false);
  const hasFlipped = useRef(false);

  function shuffleCards(array: any[]) {
    const result = [...array];
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

  useEffect(() => {
    context.Name("เกมจับคู่สี");
  }, []);

  const startgame = () => {
    if (!hasStarted.current) {
      hasStarted.current = true;

      // STEP 1: รอ 10 วินาทีแรก
      setTimeout(() => {
        // STEP 2: เปิดการ์ดทั้งหมด (ดูเฉยๆ)
        setCard((prevCards) =>
          prevCards.map((card) => ({ ...card, flipped: true }))
        );

        // STEP 3: รอ 5 วินาที → ปิดการ์ด
        setTimeout(() => {
          setCard((prevCards) =>
            prevCards.map((card) => ({ ...card, flipped: false }))
          );

          // STEP 4: เริ่มจับเวลา
          hasFlipped.current = true;
          StartTime();
        }, 5000); // ← 5 วินาที
      }, 10000); // ← รอ 10 วินาทีแรกก่อนเริ่มเปิดการ์ด
    }
  };

  const btnStartGame = () => {
    setShowOverlay(false);
    startgame();
    if (setting.game2 && setting.game2.Sound) {
      playAudio(config.urlImage + setting.game2.Sound.url);
      Sound(config.urlImage + setting.game2.Sound.url);
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

  const handleCardClick = (index: number) => {
    if (hasFlipped.current && !showOverlay) {
      if (disabled || card[index].flipped || card[index].matched) return;
      const updatedCards = card.map((card, idx) =>
        idx === index ? { ...card, flipped: true } : card
      );
      setCard(updatedCards);
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
        ],
      };
      setDetail([...detail, Detail]);
      setScore(score + 1);
      updateScore(1);
      setMatchedPairs(matchedPairs + 1);
      setSelectedCards([]);
      setDisabled(false);
    } else {
      setCard(
        updatedCards.map((card, idx) =>
          idx === first.index || idx === second.index
            ? { ...card, error: 0 }
            : card
        )
      );
      const Detail = {
        ismatch: false,
        detail: [
          { color: updatedCards[first.index].color, time: first.time },
          { color: updatedCards[second.index].color, time: second.time },
        ],
      };
      setDetail([...detail, Detail]);
      setSelectedCards([]);
      setMatchedPairs(matchedPairs + 1);
      setDisabled(false);
    }
  };

  const submit = async () => {
    const problems = card.map((v) => v.color);
    const dataGame2 = {
      name: "เกมจับคู่สี",
      time: time,
      score: score,
      problems: problems,
      detail: detail,
    };
    updateGame2(dataGame2);

    router.push("/gamenumber");
  };

  const isGameOver = card.every((card) => card.matched || card.error === 0);

  return (
    <GameGuard>
      <div className="w-full h-screen relative">
        <NavBar />
        {!isGameOver && showOverlay ? (
          <InfoGameColor btn={btnStartGame} />
        ) : (
          <div className="w-full h-full bg-fixed  bg-gradient-to-r from-indigo-100 to-purple-100">
            <div className="flex flex-col items-center w-full min-h-screen pt-10">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12 p-6">
                  {card.map((card, index) => (
                    <div
                      key={index}
                      className={`w-[171px] h-[242px] cursor-pointer card ${
                        card.flipped || card.matched ? "flipped" : ""
                      }`}
                      onClick={() => handleCardClick(index)}
                    >
                      <div className="card-inner">
                        <div
                          className={`card-front ${
                            card.error === 0
                              ? "bg-red-300 error"
                              : card.error === 1
                              ? "bg-green-300 matched"
                              : ""
                          }`}
                          style={{
                            backgroundColor: card.flipped ? card.color : "",
                          }}
                        ></div>
                        <div className="card-back">
                          <img
                            src={` ${
                              setting.game2.Card
                                ? config.urlImage + setting.game2.Card.url
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
