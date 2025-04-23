"use client";
import React, { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Head from "next/head";
import { GameContext } from "@/app/Context/gameContext";
import { useRouter } from "next/navigation";

export default function GameUI() {
  const context = useContext(GameContext);
  const router = useRouter();

  useEffect(() => {
    AOS.init();
  },[])

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

  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (sec % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <>
      <div
        className="relative h-screen w-full flex items-center justify-center bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: "url('/images/backgrow.png')",
        }}
      >
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Mali:wght@400;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <div className="min-h-screen flex flex-col items-center justify-center p-24">
          {/* Title */}
          <h1
          data-aos="fade-down"
            className="text-5xl font-bold text-black mt-8"
            style={{ fontFamily: "Mali, sans-serif" }}
          >
            ผลคะแนนรวมของคุณ
          </h1>

          {/* Stats Card */}
          <div data-aos="flip-left" className="bg-white rounded-xl shadow-lg p-6 mt-8 w-full max-w-md">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                <span className="text-black text-xl">👤</span>
              </div>
              <span
                className="text-2xl font-semibold"
                style={{ fontFamily: "Mali, sans-serif" }}
              >
                {context?.gameData?.name}
              </span>
            </div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-300 rounded-full mr-3 flex items-center justify-center">
                <span className="text-black text-xl">⭐</span>
              </div>
              <span
                className="text-2xl font-semibold"
                style={{ fontFamily: "Mali, sans-serif" }}
              >
                 {context?.gameData?.score} คะแนน
              </span>
            </div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-300 rounded-full mr-3 flex items-center justify-center">
                <span className="text-black text-xl">⏰</span>
              </div>
              <span
                className="text-2xl font-semibold"
                style={{ fontFamily: "Mali, sans-serif" }}
              >
                {formatTime(context?.time || 0)} นาที
              </span>
            </div>

            {/* Ranking List */}
            <ul className="text-lg" style={{ fontFamily: "Mali, sans-serif" }}>
              <li className="flex justify-between py-3 border-b border-gray-200">
                <span>{context?.gameData?.gamedetail?.game1?.name} </span>
                <span>{context?.gameData?.gamedetail?.game1?.score} คะแนน</span>
              </li>
              <li className="flex justify-between py-3 border-b border-gray-200">
                <span>{context?.gameData?.gamedetail?.game2?.name}</span>
                <span>{context?.gameData?.gamedetail?.game2?.score} คะแนน</span>
              </li>
              <li className="flex justify-between py-3 border-b border-gray-200">
                <span>{context?.gameData?.gamedetail?.game3?.name}</span>
                <span>{context?.gameData?.gamedetail?.game3?.score} คะแนน</span>
              </li>
              <li className="flex justify-between py-3 border-b border-gray-200">
                <span>{context?.gameData?.gamedetail?.game4?.name}</span>
                <span>{context?.gameData?.gamedetail?.game4?.score} คะแนน</span>
              </li>
              <li className="flex justify-between py-3 border-b border-gray-200">
                <span>{context?.gameData?.gamedetail?.game5?.name}</span>
                <span>{context?.gameData?.gamedetail?.game5?.score} คะแนน</span>
              </li>
              <li className="flex justify-between py-3">
                <span>{context?.gameData?.gamedetail?.game6?.name}</span>
                <span>{context?.gameData?.gamedetail?.game6?.score} คะแนน</span>
              </li>
            </ul>
          </div>

          <div className="flex space-x-6">
            <motion.button
              onClick={() => router.push("/")}
              whileHover={{ scale: 1.1, rotate: -3 }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer"
            >
              <motion.img
                className="mt-6 drop-shadow-lg"
                src="/images/save.png"
                alt="Next Button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              />
            </motion.button>
            <motion.button
              onClick={() => router.push("/")}
              whileHover={{ scale: 1.1, rotate: -3 }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer"
            >
              <motion.img
                className="mt-6 drop-shadow-lg"
                src="/images/restart.png"
                alt="Next Button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              />
            </motion.button>
          </div>
        </div>
      </div>
    </>
  )
}
