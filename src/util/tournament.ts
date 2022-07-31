import {Glicko2, newProcedure} from "glicko2.ts";

const DEFAULT_SETTINGS = {
    tau: 0.5,
    rating: 1500,
    rd: 200,
    vol: 0.06,
    volatilityAlgorithm: newProcedure
}

export const createRanking = (): Glicko2 => new Glicko2(DEFAULT_SETTINGS);