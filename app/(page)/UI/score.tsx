"use client";

type ScoreShowProps = {
    gameName: string;
    score: string;
  };
  
export default function ScoreShow({ gameName, score }: ScoreShowProps) {
    return (
        <div>
            <div className="bg-white rounded-xl shadow-md p-6 w-64 border border-blue-300">
                <div className="text-center text-xl font-semibold mb-4"> {gameName}.</div>
                <div className="flex items-center justify-center space-x-2">
                    <span className="text-yellow-500 text-xl">⭐</span>
                    <span className="text-lg font-bold">{score} คะแนน</span>
                </div>
            </div>

        </div>

    )
}