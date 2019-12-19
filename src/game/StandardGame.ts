import { StandardDicePool } from "./DicePool";
import { BaseGame } from "./BaseGame";

export class StandardGame extends BaseGame{

    private static NumberOfTurns = 7;
    private static DicePool = new StandardDicePool();
    private static BoardWidth = 7;
    private static BoardHeight = 7;

    constructor(){
        super(
            StandardGame.NumberOfTurns, 
            StandardGame.DicePool, 
            StandardGame.BoardWidth, 
            StandardGame.BoardHeight
        );
    }
}