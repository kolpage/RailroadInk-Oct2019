import { Board } from "./Board";
import { BaseDicePool } from "./DicePool";
import { TileFactory } from "./TileFactory";

export class BaseGame {
    private boardWidth: number = 7;
    private boardHeight: number = 7;
    private numberOfTurns: number;
    private currentTurn: number;
    private board: Board;
    //private scoreCalc: BaseScoreCalculator;
    private dicePool: BaseDicePool;
    private tileFactory: TileFactory;

    constructor(numberOfTurns: number, dicePool: BaseDicePool, boardWidth?: number, boardHeight?: number){
        this.boardWidth = boardWidth || this.boardWidth;
        this.boardHeight = boardHeight || this.boardHeight;
        this.numberOfTurns = numberOfTurns;
        this.dicePool = dicePool;
        this.tileFactory = new TileFactory();
        this.currentTurn = 1;
        this.board = new Board(this.boardWidth, this.boardHeight, this.tileFactory);
    }

    
}