"use client";

import { createContext, useState, ReactNode, useEffect } from "react";
import { Game, Game1, Game2, Game3, Game456, Position } from "../../Types/game.types";
import { defaultGameData } from "../../Constants/Game/game.constants";
import { fetchSettings } from "@/app/Service/getSettin.service";

interface GameContextType {
    gameData: Game | undefined;
    time: number;
    gameName: string;
    sound: string;
    setting: any;
    loadSetting: boolean;
    updateDataSet: (dataSet: number) => void;
    updateTime: (time: string) => void;
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
    Name: (name: string) => void;
    Sound: (sound: string) => void;
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
    const [loadSetting, setLoadSetting] = useState<boolean>(true)
    const [setting, setSetting] = useState<any>({})

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const data = await fetchSettings()
        if (data.success) {
            const settingsArray = data.Setting; // สมมุติ data คือ object ที่มี key "Setting"
            const SettingData: any = {}

            settingsArray.forEach((item: any) => {
                // console.log(item)
                const name = item.name
                const settingDetail = item.SettingGameDetail

                if (!SettingData[name]) {
                    SettingData[name] = {}
                }

                // SettingData.game1 = {}

                settingDetail.forEach((detail: any) => {
                    // SettingGameDetail = {SettingGameDetail}
                    // console.log(detail)
                    const position = detail.position
                    if (!SettingData[name][position]) {
                        SettingData[name][position] = []
                    }

                    SettingData[name][position].push(detail)
                });
            });

            for (const name in SettingData) {
                // console.log(name)
                for (const position in SettingData[name]) {
                    // console.log(position)
                    if (Array.isArray(SettingData[name][position]) && SettingData[name][position].length === 1) {
                        SettingData[name][position] = SettingData[name][position][0];
                    }
                }
            }

            setSetting(SettingData)
            setLoadSetting(false)
            // console.log(SettingData)
            // const mappedSettings = Object.fromEntries(
            //     // settingsArray = [ { name : { .... } } , ]
            //     settingsArray.map((item: any) => {
            //         const detailObject = Object.fromEntries(
            //             item.SettingGameDetail.map((detail: any) => [detail.position, detail])
            //         );
            //         console.log(detailObject)

            //         return [item.name, {
            //             ...item,
            //             SettingGameDetail: detailObject,
            //         }];
            //     })
            // );
            // // mappedSettings = { { name : { .. } } }
            // setSetting(mappedSettings)
            // console.log(mappedSettings)
        }
    }

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
    const StopTime = () => {
        setStartTime(false)
        if (!gameData) return;
        setGameData((value) => ({
            ...value, time: time.toString()
        }))
    }
    const RestartTime = () => { setTime(0) }

    const Sound = (sound: string) => {
        setSound(sound)
    }

    const Name = (name: string) => {
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

    const updateTime = (time: string) => {
        if (!gameData) return;
        setGameData((value) => ({
            ...value, time: time
        }))
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
            updateTime,
            Name,
            Sound,
            setting,
            loadSetting,
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
