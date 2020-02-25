import { RiverExpansionDicePool } from "./DicePool";
import { BaseGame } from "./BaseGame";
import { RiverExpansionScoreCalculator } from "./RiverExpansionScoreCalculator";

export class RiverExpansionGame extends BaseGame{
    private static NumberOfTurns = 6;
    private static DicePool = new RiverExpansionDicePool();
    private static BoardWidth = 7;
    private static BoardHeight = 7;
    private static ScoreCalculator = new RiverExpansionScoreCalculator();

    constructor(){
        super(
            RiverExpansionGame.NumberOfTurns, 
            RiverExpansionGame.DicePool, 
            RiverExpansionGame.ScoreCalculator,
            RiverExpansionGame.BoardWidth, 
            RiverExpansionGame.BoardHeight
        );
    }
}