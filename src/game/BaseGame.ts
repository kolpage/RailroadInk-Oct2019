import { Board } from "./Board";
import { BaseDicePool } from "./DicePool";
import { TileFactory } from "./TileFactory";
import { BaseTurn } from "./Turn";
import { TileType, TilePlacementResult, TurnInvalidReason } from "../common/Enums";
import { MoveDTO } from "../common/DTO/MoveDTO";
import { TurnResponseDTO } from "../common/DTO/TurnResponseDTO";
import { InvalidMoveResponseDTO } from "../common/DTO/InvalidMoveResponseDTO";
import { SpecialTileTracker } from "../common/SpecialTileTracker";

export class BaseGame {
    private boardWidth: number = 7;
    private boardHeight: number = 7;
    private numberOfTurns: number;
    private currentTurn: BaseTurn | undefined;
    private previousTurns: BaseTurn[];
    private specialTileTracker: SpecialTileTracker;
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
        this.specialTileTracker = new SpecialTileTracker();
        this.previousTurns = [];
        this.board = new Board(this.boardWidth, this.boardHeight, this.tileFactory);

        this.beginNextTurn();
    }

    /**
     * Makes the given moves on the board for a turn.
     * @param moves List of moves to be made.
     */
    public MakeMove(moves: MoveDTO[]): TurnResponseDTO{
        if(this.isActiveTurn()){
            for(var i = 0; i < moves.length; i++){
                const move: MoveDTO = moves[i];
                const tile = this.tileFactory.CreateTile(move.Tile, this.currentTurn.GetTurnNumber(), move.Orientation);
                const tilePlacementResult = this.currentTurn.Move(move.Tile, tile, move.RowIndex, move.ColumnIndex);
                if(tilePlacementResult !== TilePlacementResult.valid){
                    this.currentTurn.UndoTurnChanges();
                    return new TurnResponseDTO([new InvalidMoveResponseDTO(i, move, tilePlacementResult)]);
                }
            }
            if(this.currentTurn.CanTurnBeDone()){
                this.currentTurn.CommitTurn();
                this.beginNextTurn();
                return new TurnResponseDTO();
            }
            else{
                this.currentTurn.UndoTurnChanges();
                return new TurnResponseDTO([], [TurnInvalidReason.requiredDiceNotPlayed]);
            }
        }
        else{
            return new TurnResponseDTO([], [TurnInvalidReason.noActiveTurns]);
        }
    }

    /**
     * Returns true if there is an active turn moves can be played to.
     */
    private isActiveTurn(): boolean{
        return this.currentTurn !== undefined && !this.currentTurn.GetIsTurnOver();
    }

    /**
     * Returns true if the current turn is marked as over and the next turn can be started. False otherwise.
     */
    public CanAdvanceToNextTurn(): boolean{
        if(this.currentTurn !== undefined){
            return this.currentTurn.GetIsTurnOver();
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
        this.currentTurn = new BaseTurn(nextTurnNumber, rolledDice, this.specialTileTracker, this.board);
    }

}