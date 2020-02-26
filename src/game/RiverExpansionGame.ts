import { RiverExpansionDicePool } from "./DicePool";
import { BaseGame } from "./BaseGame";
import { RiverExpansionScoreCalculator } from "./RiverExpansionScoreCalculator";

export class RiverExpansionGame extends BaseGame{
    private static NumberOfTurns = 6;
    private static BoardWidth = 7;
    private static BoardHeight = 7;

    constructor(seed?: string){
        super(
            RiverExpansionGame.NumberOfTurns, 
            new RiverExpansionDicePool(seed), 
            new RiverExpansionScoreCalculator(),
            RiverExpansionGame.BoardWidth, 
            RiverExpansionGame.BoardHeight
        );
    }
}