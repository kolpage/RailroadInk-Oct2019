import { StandardDicePool } from "./DicePool";
import { BaseGame } from "./BaseGame";
import { BaseScoreCalculator } from "./BaseScoreCalculator";

export class StandardGame extends BaseGame{

    private static NumberOfTurns = 7;
    private static DicePool = new StandardDicePool();
    private static BoardWidth = 7;
    private static BoardHeight = 7;
    private static ScoreCalculator = new BaseScoreCalculator();

    constructor(){
        super(
            StandardGame.NumberOfTurns, 
            StandardGame.DicePool, 
            StandardGame.ScoreCalculator,
            StandardGame.BoardWidth, 
            StandardGame.BoardHeight
        );
    }
}