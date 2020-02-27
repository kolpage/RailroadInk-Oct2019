import { LakeExpansionDicePool } from "./DicePool";
import { BaseGame } from "./BaseGame";
import { LakeExpansionScoreCalculator } from "./LakeExpansionScoreCalculator";

export class LakeExpansionGame extends BaseGame{
    private static NumberOfTurns = 6;
    private static BoardWidth = 7;
    private static BoardHeight = 7;

    constructor(seed?: string){
        super(
            LakeExpansionGame.NumberOfTurns, 
            new LakeExpansionDicePool(seed), 
            new LakeExpansionScoreCalculator(),
            LakeExpansionGame.BoardWidth, 
            LakeExpansionGame.BoardHeight
        );
    }
}