"use client";

import { GameContext } from "@/app/Context/gameContext";
import { useContext, useEffect } from "react";

export default function DebugGame() {
  const context = useContext(GameContext);

  useEffect(() => {
    if (context?.gameData) {
      console.log("Current game data:", context.gameData);
    }
  }, [context?.gameData]);

  if (!context) return <p>Loading context...</p>;

  const fetchData = async () => {
    if (!context.gameData) return;
    try {
      const response = await fetch('http://localhost:3000/game/upload', { // ต้องเป็น URL ที่มี http://
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ game: context.gameData })
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }
  

  return (
    <div className="p-4 text-sm space-y-4">
      <div className="space-x-2 space-y-2">
      <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => context.updateDataSet(999)}
        >
          Set DataSet = 999
        </button>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => context.updataName('test')}
        >
          Set Name = test
        </button>

        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => context.updateAge(21)}
        >
          Set Age = 21
        </button>
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => context.updateDisease('โรค .....')}
        >
          Set Disease = 21
        </button>

        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => context.updatePosition({
            latitude: "123",
            longitude: "321"
        })}
        >
          Set Position = latitude: "123", longitude: "321"
        </button>

        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => context.updateGame1({
            name: "เกมวาดรูป 6 เหลี่ยม",
            time: 20,
            score: 2,
            detail: [{ url: "https://localhost:3000/game1" }]

          })}
        >
          Set Game1 = name: "เกมวาดรูป 6 เหลี่ยม",
            time: 0,
            score: 0,
            detail: url : "https://localhost:3000/game1"
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded"
          onClick={fetchData}
        >
          sent data
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded"
          onClick={() => context.clearGame()}
        >
          Reset Game
        </button>
      </div>
      <pre className="whitespace-pre-wrap bg-gray-100 p-3 rounded">
        {JSON.stringify(context.gameData, null, 2)}
      </pre>
    </div>
  )
}
