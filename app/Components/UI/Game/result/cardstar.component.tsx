"use client";
import useGame from "@/app/Hook/GameHook/context.hook"



export default function CardStar() {
    const context = useGame()
    const formatTime = (sec: number) => {
        const minutes = Math.floor(sec / 60)
            .toString()
            .padStart(2, "0");
        const seconds = (sec % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    return (
        <>
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
        </>

    )
}