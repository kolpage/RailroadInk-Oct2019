import { TileType, TilePlacementResult } from "../common/Enums";
import { Move } from "./Move";
import { PlayableBaseTile } from "./tiles";
import { Board } from "./Board";
import { SpecialTileTracker } from "../common/SpecialTileTracker";

export interface IPlayableDice{
    tileType: TileType,
    required: boolean,
    played: boolean
}

/** Object representing the state of a single turn */
export class BaseTurn{
    private isTurnCommitted: boolean = false;
    private playedSpecialTile: boolean = false;
    private diceToPlay: IPlayableDice[];
    private playedTiles: Move[];
    private turnNumber: number;
    private board: Board;
    private isTurnOver: boolean = false;
    private specialTileTracker: SpecialTileTracker;

    constructor(turnNumber: number, rolledDice: TileType[], specialTileTracker: SpecialTileTracker, board: Board){
        this.turnNumber = turnNumber;
        this.board = board;
        this.specialTileTracker = specialTileTracker;
        this.diceToPlay = [];
        this.playedTiles = [];
        for(const rolledDie of rolledDice){
            this.diceToPlay.push({
                tileType: rolledDie,
                required: true,
                played: false
            });
        }
    }

    /**
     * Undoes any moves made during this turn. Cannot be done once turn is committed.
     */
    public UndoTurnChanges(): void{
        if(!this.isTurnCommitted){
            this.diceToPlay.forEach(die => die.played = false);
            this.playedTiles.forEach(move => {
                this.board.RemoveTile(move.GetRowIndex(), move.GetColumnIndex());
            })
            this.playedTiles = [];
            this.playedSpecialTile = false;
        }
    }

    /**
     * Ends the turn and locks in the moves made for this turn. They can no longer be undone. 
     * Updates the board and special tile tracker objects.
     */
    public CommitTurn(): void{
        if(!this.isTurnCommitted && this.CanTurnBeDone()){
            this.isTurnCommitted = true;
            this.playedTiles.forEach(move => {
                const tile = move.GetTile();
                const die: IPlayableDice = this.diceToPlay.find(die => die.tileType === tile.GetTileType());
                if(die === undefined){
                    this.specialTileTracker.PlayTile(tile.GetTileType());
                }
            });
            this.setTurnOver();
        }
    }

    /** Marks the turn as over. */
    private setTurnOver(): void{
        this.isTurnOver = true;
    }

    /** Returns true if the turn is complete. */
    public GetIsTurnOver(): boolean{
        return this.isTurnOver;
    }

    /** Gets the turn number. */
    public GetTurnNumber(): number{
        return this.turnNumber;
    }

    /** Makes the requested move. True if move was successful. False otherwise */
    public Move(
        tileType: TileType, 
        playedTile: PlayableBaseTile, 
        rowIndex: number, 
        columnIndex: number
    ): TilePlacementResult{
        const isDieAvailable = this.isTileAvailable(tileType);
        if(!isDieAvailable){
            return TilePlacementResult.tileNotAvailable;
        }

        const isMoveAllowed = this.board.IsTilePositionValid(playedTile, rowIndex, columnIndex);
        if(!isMoveAllowed){
            return TilePlacementResult.violatesGameRules;
        }

        this.board.SetTile(playedTile, rowIndex, columnIndex, false);
        this.playedTiles.push(new Move(playedTile, rowIndex, columnIndex));
        const die = this.diceToPlay.find(die => die.tileType === tileType && !die.played);
        if(die){
            die.played = true;
        }
        else{
            //If it can't find the die in the dice to play array, it must be a special tile.
            this.playedSpecialTile = true;
        }
        return TilePlacementResult.valid;
    }

    /**
     * Checks if the specified tile is available for play. First checks rolled dice, then checks the special tiles.
     * @param tile The tile to see if available.
     */
    private isTileAvailable(tile: TileType): boolean{
        let isDieAvailable = this.diceToPlay.some(die => die.tileType === tile && !die.played);
        if(!isDieAvailable){
            isDieAvailable = !this.playedSpecialTile && this.specialTileTracker.CanPlayTile(tile);
        }
        return isDieAvailable;
    }

    private doesTileHaveToBeConnected(tileType: TileType): boolean{
        return true;
    }

    public PlayedTilesFollowConnectionRules(): boolean{
        for(const move of this.playedTiles){
            const tile = move.GetTile();
            if(!this.doesTileHaveToBeConnected(tile.GetTileType())){
                continue;
            }
        }
        return true;
    }

    /** Gets all the dice rolled for this turn. */
    public GetRolledDice(): TileType[]{
        return this.diceToPlay.map(die => die.tileType);
    }

    /** Gets all the dice that can still be played this turn. */
    public GetAvailableDiceToPlay(): TileType[]{
        return this.diceToPlay.filter(die => !die.played).map((die => die.tileType));
    }

    /** Gets all the dice that must be played this turn. */
    public GetRequiredDiceToPlay(): TileType[]{
        return this.diceToPlay.filter(die => !die.played && die.required).map(die => die.tileType);
    }

    /** True if the player can end their turn. */
    public CanTurnBeDone(): boolean{
        return this.GetRequiredDiceToPlay().length > 0;
    }
}