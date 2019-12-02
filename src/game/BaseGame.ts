import { Board } from "./Board";
import { BaseDicePool } from "./DicePool";
import { TileFactory } from "./TileFactory";
import { BaseTurn } from "./Turn";
import { TileType, MoveInvalidReason } from "../common/Enums";
import { truncate } from "fs";
import { MoveDTO } from "../common/DTO/MoveDTO";
import { TurnResponseDTO } from "../common/DTO/TurnResponseDTO";
import { InvalidMoveResponseDTO } from "../common/DTO/InvalidMoveResponseDTO";

export class BaseGame {
    private boardWidth: number = 7;
    private boardHeight: number = 7;
    private numberOfTurns: number;
    private currentTurn: BaseTurn | undefined;
    private previousTurns: BaseTurn[];
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
        this.previousTurns = [];
        this.board = new Board(this.boardWidth, this.boardHeight, this.tileFactory);

        this.beginNextTurn();
    }

    /**
     * Makes the given moves on the board for a turn.
     * @param moves List of moves to be made.
     */
    public MakeMove(moves: MoveDTO[]): TurnResponseDTO{
        if(this.currentTurn !== undefined && !this.currentTurn.GetIsTurnOver()){
            for(var i = 0; i < moves.length; i++){
                const move = moves[i];
                const tile = this.tileFactory.CreateTile(move.Tile, this.currentTurn.GetTurnNumber(), move.Orientation);
                const wasMoveSuccessful = this.currentTurn.Move(move.Tile, tile, move.RowIndex, move.ColumnIndex);
                if(!wasMoveSuccessful){
                    return new TurnResponseDTO([new InvalidMoveResponseDTO(i, move, MoveInvalidReason.pieceNotAvailable, "The piece was not available.")]);
                }
            }
            this.currentTurn.SetTurnOver();
            this.beginNextTurn();
        }
        
    }

    /**
     * Returns true if all the required dice have been played and the next turn can be started. False otherwise.
     */
    public CanAdvanceToNextTurn(): boolean{
        if(this.currentTurn !== undefined){
            return this.currentTurn.CanTurnBeDone();
        }
        return true;
    }

    /**
     * Returns the number of the current turn.
     */
    public GetTurnNumber(): number{
        if(this.currentTurn !== undefined){
            return this.currentTurn.GetTurnNumber();
        }
        return 0;
    }

    /**
     * Returns true if the game is over. False otherwise.
     * Score is available to be read after game is over.
     */
    public IsGameOver(): boolean{
        if(this.currentTurn !== undefined){
            return this.currentTurn.GetTurnNumber() === this.numberOfTurns
                && this.currentTurn.GetIsTurnOver();
        }
        return false;
    }

    private beginNextTurn(): void{
        if(this.CanAdvanceToNextTurn() && !this.IsGameOver()){
            this.savePastTurn();
            const rolledDice: TileType[] = this.rollDice();
            this.makeNewTurn(rolledDice);
        }
    }

    private savePastTurn(): void{
        if(this.currentTurn !== undefined){
            this.previousTurns.push(this.currentTurn);
        }
    }

    private rollDice(): TileType[]{
        return this.dicePool.Roll();
    }

    private makeNewTurn(rolledDice: TileType[]): void{
        let nextTurnNumber = 1;
        if(this.currentTurn !== undefined){
            nextTurnNumber = this.currentTurn.GetTurnNumber() + 1;
        }
        this.currentTurn = new BaseTurn(nextTurnNumber, rolledDice, this.board);
    }

}