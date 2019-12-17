import { Board } from "./Board";
import { BaseDicePool } from "./DicePool";
import { TileFactory } from "./TileFactory";
import { BaseTurn } from "./Turn";
import { TileType, TilePlacementResult, TurnInvalidReason, Orientation } from "../common/Enums";
import { MoveDTO } from "../common/DTO/MoveDTO";
import { TurnResponseDTO } from "../common/DTO/TurnResponseDTO";
import { InvalidMoveResponseDTO } from "../common/DTO/InvalidMoveResponseDTO";
import { SpecialTileTracker } from "../common/SpecialTileTracker";
import { BaseScoreCalculator } from "./BaseScoreCalculator";
import { BaseTile } from "./tiles";

export class BaseGame {
    private boardWidth: number = 7;
    private boardHeight: number = 7;
    private numberOfTurns: number;
    private currentTurn: BaseTurn | undefined;
    private previousTurns: BaseTurn[];
    private specialTileTracker: SpecialTileTracker;
    private board: Board;
    private scoreCalc: BaseScoreCalculator;
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

    /** TODO: This isn't safe to expose the board. But I'm using it for unit tests to hook up the various testbench validators to the game's board. Remove before release */
    public GetBoard(): Board{
        return this.board;
    }

    /**
     * Makes the given moves on the board for a turn.
     * @param moves List of moves to be made.
     */
    public MakeMove(moves: MoveDTO[]): TurnResponseDTO{
        const moveIssues = new Array<InvalidMoveResponseDTO>();
        const turnIssues = new Array<TurnInvalidReason>();

        this.attemptToMakeMoves(moves, moveIssues, turnIssues);

        if(moveIssues.length > 0 || turnIssues.length > 0){
            this.currentTurn.UndoTurnChanges();
            return new TurnResponseDTO(moveIssues, turnIssues);
        }
        this.currentTurn.CommitTurn();
        this.beginNextTurn();
        return new TurnResponseDTO(moveIssues, turnIssues, this.currentTurn.GetRolledDice());       
    }

    /**
     * Forces a tile to a specific location. Overwrites existing tiles. Maintains board index.
     * @param tileType The tile type to be set
     * @param turn The turn number of the tile
     * @param orientation The orientation of the tile
     * @param rowIndex The row index to set the tile at
     * @param columnIndex The column index to set the tile at
     */
    public ForceSetTile(tileType: TileType, turn: number, orientation: Orientation, rowIndex: number, columnIndex: number): BaseTile{
        const tile = this.tileFactory.CreateTile(tileType, turn, orientation);
        this.board.SetTile(tile, rowIndex, columnIndex, true);
        return tile;
    }


    private attemptToMakeMoves(moves: MoveDTO[], moveIssues: InvalidMoveResponseDTO[], turnIssues: TurnInvalidReason[]): void{
        if(this.isActiveTurn()){
            //Try placing all tiles. Verify placement allowed based on neighboring tiles.
            for(var i = 0; i < moves.length; i++){
                const move: MoveDTO = moves[i];
                const tile = this.tileFactory.CreateTile(move.Tile, this.currentTurn.GetTurnNumber(), move.Orientation);
                const tilePlacementResult = this.currentTurn.Move(move.Tile, tile, move.RowIndex, move.ColumnIndex);
                if(tilePlacementResult !== TilePlacementResult.valid){
                    moveIssues.push(new InvalidMoveResponseDTO(i, move, tilePlacementResult));
                }
            }

            //Verify all tiles placed are connected to existing board elements
            if(!this.currentTurn.PlayedTilesFollowConnectionRules()){
                turnIssues.push(TurnInvalidReason.tilesMustBeConnectedToExistingTiles)
            }

            //Verify all required tiles have been played.
            if(!this.currentTurn.CanTurnBeDone()){
                turnIssues.push(TurnInvalidReason.requiredDiceNotPlayed);
            }
        }
        else{
            turnIssues.push(TurnInvalidReason.noActiveTurns);
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