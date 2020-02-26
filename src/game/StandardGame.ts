import { StandardDicePool } from "./DicePool";
import { BaseGame } from "./BaseGame";
import { BaseScoreCalculator } from "./BaseScoreCalculator";

export class StandardGame extends BaseGame{

    private static NumberOfTurns = 7;
    private static BoardWidth = 7;
    private static BoardHeight = 7;

    constructor(seed?: string){
        super(
            StandardGame.NumberOfTurns, 
            new StandardDicePool(seed), 
            new BaseScoreCalculator(),
            StandardGame.BoardWidth, 
            StandardGame.BoardHeight
        );
    }
}