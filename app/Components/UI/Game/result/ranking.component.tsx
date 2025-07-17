"use client";
import useGame from "@/app/Hook/GameHook/context.hook"


export default function Ranking() {
    const context  = useGame()
    return(
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
    )
}