"use client";
import React, { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Head from "next/head";
import { useRouter } from "next/navigation";
import useGame from "@/app/Hook/GameHook/context.hook";
import CardStar from "@/app/Components/UI/Game/result/cardstar.component";
import Ranking from "@/app/Components/UI/Game/result/ranking.component";

export default function GameUI() {
  const context = useGame()
  const router = useRouter();

  useEffect(() => {
    AOS.init();
  }, [])

  useEffect(() => {
    if (context?.gameData) {
      const data = context.gameData;
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
          <div data-aos="flip-left" className="bg-white rounded-xl shadow-lg p-6 mt-8 w-full max-w-md">

          {/* Stats Card */}
          <CardStar />

          <Ranking />
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
