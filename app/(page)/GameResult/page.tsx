"use client";
import React from "react";
import { motion } from "framer-motion";

import Head from "next/head";

export default function GameUI() {
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
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          {/* Title */}
          <h1
            className="text-5xl font-bold text-black mb-8"
            style={{ fontFamily: "Mali, sans-serif" }}
          >
            ผลคะแนนรวมของคุณ
          </h1>

          {/* Stats Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 w-full max-w-md">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                <span className="text-black text-xl">👤</span>
              </div>
              <span
                className="text-2xl font-semibold"
                style={{ fontFamily: "Mali, sans-serif" }}
              >
                ผู้เล่น
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
                10 คะแนน
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
                2.23 นาที
              </span>
            </div>

            {/* Ranking List */}
            <ul className="text-lg" style={{ fontFamily: "Mali, sans-serif" }}>
              <li className="flex justify-between py-3 border-b border-gray-200">
                <span>1.เกม1</span>
                <span>2 คะแนน</span>
              </li>
              <li className="flex justify-between py-3 border-b border-gray-200">
                <span>2.เกม2</span>
                <span>2 คะแนน</span>
              </li>
              <li className="flex justify-between py-3 border-b border-gray-200">
                <span>3.เกม3</span>
                <span>2 คะแนน</span>
              </li>
              <li className="flex justify-between py-3 border-b border-gray-200">
                <span>4.เกม4</span>
                <span>2 คะแนน</span>
              </li>
              <li className="flex justify-between py-3 border-b border-gray-200">
                <span>5.เกม5</span>
                <span>2 คะแนน</span>
              </li>
              <li className="flex justify-between py-3">
                <span>6.เกม6</span>
                <span>2 คะแนน</span>
              </li>
            </ul>
          </div>

          <div className="flex space-x-6">
            <motion.button
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
  );
}
