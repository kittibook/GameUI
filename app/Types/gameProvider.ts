

export interface Game {
    dataSet : number
    name : string
    age : number
    disease : string
    score :  number
    position : Position
    gamedetail : gameDetail

}

export interface Position {
    latitude : string
    longitude : string
}

export interface Game1 {
    name : string
    time : number
    score : number
    detail : detailGame1[]
}

export interface detailGame1 {
    url : string
}

export interface Game2 {
    name : string
    time : number
    score : number
    problems : any[]
    detail : detailGame2[]
}

export interface detailGame2 {
    ismatch : boolean
    detail : ismatchGame2[]
}

interface ismatchGame2 {
    color : string
    time : number
}

export interface Game3 {
    name : string
    time : number
    score : number
    problems : any[]
    detail : detailGame3[]

}

export interface detailGame3 {
    ismatch : boolean
    detail : ismatchGame3[]
}

interface ismatchGame3 {
    number : string
    time : number
}

export interface Game456 {
    name : string
    time : number
    score : number
    detailproblems : detailGame456[]

}

export interface detailGame456 {
    ismatch : boolean
    problems : string
    reply : string
    answer : string
}

export interface gameDetail {
    game1 : Game1
    game2 : Game2
    game3 : Game3
    game4 : Game456
    game5 : Game456
    game6 : Game456
}