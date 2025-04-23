"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import { Game, Game1, Game2, Game3, Game456, Position } from "../Types/gameProvider";
import { defaultGameData } from "../Constants/defaultGameData";

interface GameContextType {
    gameData: Game | undefined;
    time: number;
    gameName : string;
    sound : string
    updateDataSet: (dataSet: number) => void;
    updataName: (name: string) => void;
    updateAge: (age: number) => void;
    updateDisease: (disease: string) => void;
    updatePosition: (position: Position) => void;
    updateScore: (score: number) => void;
    updateGame1: (Game1: Game1) => void;
    updateGame2: (Game: Game2) => void;
    updateGame3: (Game: Game3) => void;
    updateGame4: (Game: Game456) => void;
    updateGame5: (Game: Game456) => void;
    updateGame6: (Game: Game456) => void;
    Name: (name : string) => void;
    Sound: (sound : string) => void;
    StartTime: () => void;
    StopTime: () => void;
    RestartTime: () => void;
    clearGame: () => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const [gameData, setGameData] = useState<Game>(defaultGameData);
    const [startTime, setStartTime] = useState<boolean>(false)
    const [time, setTime] = useState<number>(0)
    const [sound, setSound] = useState<string>('')
    const [gameName, setGameName] = useState<string>('')

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (startTime) {
            interval = setInterval(() => {
                setTime((prev) => prev + 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [startTime]);

    const StartTime = () => { setStartTime(true) }
    const StopTime = () => { setStartTime(false) }
    const RestartTime = () => { setTime(0) }

    const Sound = (sound : string) => {
        setSound(sound)
    }

    const Name = (name : string) => {
        setGameName(name)
    }


    const updataName = (name: string) => {
        if (!gameData) return;
        setGameData((value) => ({
            ...value, name: name
        }))
    }

    const updateDataSet = (dataSet: number) => {
        if (!gameData) return;
        setGameData((value) => ({
            ...value,
            dataSet: dataSet
        }));
    }
    const updateAge = (age: number) => {
        if (!gameData) return;

        setGameData((value) => ({
            ...value,
            age: age
        }));
    };

    const updateDisease = (disease: string) => {
        if (!gameData) return;

        setGameData((value) => ({
            ...value,
            disease: disease
        }))
    };

    const updatePosition = (position: Position) => {
        if (!gameData) return;
        setGameData((value) => ({
            ...value,
            position: position
        }))
    };

    const updateScore = (score: number) => {
        if (!gameData) return;
        setGameData((value) => ({
            ...value,
            score: score + gameData.score
        }))
    };


    const updateGame1 = (Game1: Game1) => {
        if (!gameData) return;
        setGameData((value) => ({
            ...value,
            gamedetail: {
                ...value.gamedetail,
                game1: Game1,
            },
        }));
    };

    const updateGame2 = (Game: Game2) => {
        if (!gameData) return;
        setGameData((value) => ({
            ...value,
            gamedetail: {
                ...value.gamedetail,
                game2: Game,
            },
        }));
    };

    const updateGame3 = (Game: Game3) => {
        if (!gameData) return;
        setGameData((value) => ({
            ...value,
            gamedetail: {
                ...value.gamedetail,
                game3: Game,
            },
        }));
    };


    const updateGame4 = (Game: Game456) => {
        if (!gameData) return;
        setGameData((value) => ({
            ...value,
            gamedetail: {
                ...value.gamedetail,
                game4: Game,
            },
        }));
    };

    const updateGame5 = (Game: Game456) => {
        if (!gameData) return;
        setGameData((value) => ({
            ...value,
            gamedetail: {
                ...value.gamedetail,
                game5: Game,
            },
        }));
    };

    const updateGame6 = (Game: Game456) => {
        if (!gameData) return;
        setGameData((value) => ({
            ...value,
            gamedetail: {
                ...value.gamedetail,
                game6: Game,
            },
        }));
    };

    const update = (score: number) => {
        if (!gameData) return;
    };


    const clearGame = () => {
        setGameData(defaultGameData);
    };

    return (
        <GameContext.Provider value={{
            gameData,
            time,
            sound,
            gameName,
            StartTime,
            StopTime,
            RestartTime,
            Name,
            Sound,
            updateDataSet,
            updataName,
            updateAge,
            updateDisease,
            updatePosition,
            updateScore,
            updateGame1,
            updateGame2,
            updateGame3,
            updateGame4,
            updateGame5,
            updateGame6,
            clearGame
        }}>
            {children}
        </GameContext.Provider>
    );
}
