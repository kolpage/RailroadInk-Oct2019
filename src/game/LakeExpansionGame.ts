import { LakeExpansionDicePool } from "./DicePool";
import { BaseGame } from "./BaseGame";
import { RiverExpansionScoreCalculator } from "./RiverExpansionScoreCalculator";

export class LakeExpansionGame extends BaseGame{
    private static NumberOfTurns = 6;
    private static BoardWidth = 7;
    private static BoardHeight = 7;

    constructor(seed?: string){
        super(
            LakeExpansionGame.NumberOfTurns, 
            new LakeExpansionDicePool(seed), 
            // TODO: Implment LakeExpansionScoreCalculator
            new RiverExpansionScoreCalculator(),
            LakeExpansionGame.BoardWidth, 
            LakeExpansionGame.BoardHeight
        );
    }
}