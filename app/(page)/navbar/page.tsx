"use client";
import { GameContext } from "@/app/Context/gameContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  FaUser,
  FaStar,
  FaVolumeUp,
  FaFlagCheckered,
} from "react-icons/fa";

const CustomUI = () => {
  const [soundPlayed, setSoundPlayed] = useState(false);
  const [stage, setStage] = useState(3); // สามารถเปลี่ยนได้ตามด่าน
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlaying = useRef(false);

  const context = useContext(GameContext);

  if (!context) {
    return <p>Loading context...</p>;
  }
  const { sound } = context
  // reset ปุ่มเสียงเมื่อเปลี่ยนด่าน
  useEffect(() => {
    setSoundPlayed(false);
  }, [stage]);

  // แสดงเวลาแบบ mm:ss
  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (sec % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // เล่นเสียง (สามารถแทนที่ด้วย Audio ได้จริง)
  const handlePlaySound = () => {
    if (!soundPlayed) {
      playAudio(sound)
    }
  };

  const playAudio = (sounds: string) => {
    if (sounds !== "") {
      if (!audioRef.current) {
        audioRef.current = new Audio(sounds);
        audioRef.current.muted = false;  // Make sure it's not muted
        audioRef.current.volume = 1;     // Set volume to full
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        isPlaying.current = false;
      }

      audioRef.current.src = sounds;
      isPlaying.current = true;
      audioRef.current
        .play()
        .then(() => setSoundPlayed(true))
        .catch((error) => {
          isPlaying.current = false;
        });

      audioRef.current.onended = () => {
        isPlaying.current = false;
      };

    } 
  };


  return (
    <div className="w-full font-mali">
      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 w-full h-24 sm:h-24 md:h-28 flex items-center justify-center shadow-md border-b-4 border-white rounded-b-lg">
        <div className="flex flex-row items-center justify-center flex-wrap gap-4 px-3 sm:px-6 md:px-8 py-2 sm:py-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-inner w-full max-w-4xl mx-auto">

          {/* ชื่อผู้ใช้ */}
          <div className="flex items-center space-x-2">
            <FaUser className="text-indigo-600 text-lg md:text-2xl hover:scale-110 transition-transform duration-200" />
            <span className="text-gray-800 text-sm md:text-lg font-semibold">
              {context?.gameData?.name}
            </span>
          </div>

          {/* คะแนน */}
          <div className="flex items-center space-x-2">
            <FaStar className="text-yellow-400 text-lg md:text-2xl hover:scale-110 transition-transform duration-200" />
            <span className="text-gray-800 text-sm md:text-lg font-semibold">
              {context?.gameData?.score}
            </span>
          </div>

          {/* เวลา */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-800 text-sm md:text-lg font-semibold">
              เวลา: {formatTime(context?.time || 0)}
            </span>
          </div>

          {/* ปุ่มเสียง */}
          <button
            onClick={handlePlaySound}
            disabled={soundPlayed}
            className={`p-1 rounded-full hover:scale-110 transition-transform duration-200 ${soundPlayed ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            title="เล่นเสียง"
          >
            <FaVolumeUp className="text-blue-500 text-lg md:text-2xl" />
          </button>

          {/* ด่าน */}
          <div className="flex items-center space-x-2">
            <FaFlagCheckered className="text-green-500 text-lg md:text-2xl hover:scale-110 transition-transform duration-200" />
            <span className="text-gray-800 text-sm md:text-lg font-semibold">
              {context?.gameName}

            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomUI;
