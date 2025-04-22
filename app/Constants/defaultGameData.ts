import { Game } from "../Types/gameProvider";

export const defaultGameData: Game = {
    dataSet: 0,
    name: "",
    age: 0,
    disease: "",
    score: 0,
    position: {
        latitude: "",
        longitude: ""
    },
    gamedetail: {
        game1: {
            name: "เกมวาดรูป 6 เหลี่ยม",
            time: 0,
            score: 0,
            detail: [{ url: "" }]
        },
        game2: {
            name: "เกมจับคู่สี",
            time: 0,
            score: 0,
            problems: ["", "", "", "", "", ""],
            detail: [
                {
                    ismatch: true,
                    detail: [
                        { color: "", time: 0 },
                        { color: "", time: 0 }
                    ]
                }
            ]
        },
        game3: {
            name: "เกมจับคู่เลข",
            time: 0,
            score: 0,
            problems: [1, 2, 3, 1, 2, 3],
            detail: [
                {
                    ismatch: true,
                    detail: [
                        { number: "", time: 0 },
                        { number: "", time: 0 }
                    ]
                }
            ]
        },
        game4: {
            name: "เกมรูปสัตว์",
            time: 0,
            score: 0,
            detailproblems: [
                { ismatch: true, problems: "", reply: "", answer: "" }
            ]
        },
        game5: {
            name: "เกมเสียงสัตว์",
            time: 0,
            score: 0,
            detailproblems: [
                { ismatch: true, problems: "", reply: "", answer: "" }
            ]
        },
        game6: {
            name: "เกมเสียงธรรมชาติ",
            time: 0,
            score: 0,
            detailproblems: [
                { ismatch: true, problems: "", reply: "", answer: "" }
            ]
        }
    }
};
