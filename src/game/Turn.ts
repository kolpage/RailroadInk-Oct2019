import { TileType, TilePlacementResult } from "../common/Enums";
import { Move } from "./Move";
import { PlayableBaseTile, BaseTile, RiverExpansionTile, LakeExpansionTile, LakeFull } from "./tiles";
import { Board } from "./Board";
import { SpecialTileTracker } from "../common/SpecialTileTracker";
import { TileContinuityValidator } from "./TileVisitor";
import { Tile } from "../client/Components/Tile";

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
    private tileContinuityValidator: TileContinuityValidator;

    constructor(turnNumber: number, rolledDice: TileType[], specialTileTracker: SpecialTileTracker, board: Board){
        this.turnNumber = turnNumber;
        this.board = board;
        this.specialTileTracker = specialTileTracker;
        this.tileContinuityValidator = new TileContinuityValidator(this.board);
        this.diceToPlay = [];
        this.playedTiles = [];
        for(const rolledDie of rolledDice){
            const requiredToBePlayed = this.doesDieHaveToBePlayed(rolledDie);
            this.diceToPlay.push({
                tileType: rolledDie,
                required: requiredToBePlayed,
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
        if(!this.isTurnCommitted){
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
        this.markTileAsPlayed(tileType);
        return TilePlacementResult.valid;
    }

    /**
     * TODO: Mark added this function so that the hot fix he did is isolated. Feel free to get rid of this or change it. 
     * Give a tile type, marks the corresponding die in the dice pool as played . 
     * @param tile The type of the tile to make as played
     */
    private markTileAsPlayed(tile: TileType){
        // TODO: Hot fix. Clean this up however you see fit.
        if(tile === TileType.StationTurnMirror){
            tile = TileType.StationTurn;
        }
        if(tile === TileType.LakeRoadRailMirror){
            tile = TileType.LakeRoadRail;
        }
        if(tile === TileType.LakeFull){
            return;
        }
        
        const die = this.diceToPlay.find(die => die.tileType === tile && !die.played);
        if(die){
            die.played = true;
        }
        else{
            //If it can't find the die in the dice to play array, it must be a special tile.
            this.playedSpecialTile = true;
        }
    }

    /**
     * Checks if the specified tile is available for play. First checks rolled dice, then checks the special tiles.
     * @param tile The tile to see if available.
     */
    private isTileAvailable(tile: TileType): boolean{
        if(tile === TileType.LakeFull){
            return true;
        }
        tile = this.convertMirroredTile(tile);

        let isDieAvailable = this.diceToPlay.some(die => die.tileType === tile && !die.played);
        if(!isDieAvailable){
            isDieAvailable = !this.playedSpecialTile && this.specialTileTracker.CanPlayTile(tile);
        }
        return isDieAvailable;
    }

    /**
     * Any tile can be mirrored. If we are given a mirrored version of the original tile, set it back to the original for tracking purposes.
     * @param tile The tile to check if it is mirrored.
     */
    private convertMirroredTile(tile: TileType): TileType{
        switch(tile){
            case TileType.StationTurnMirror:
                return TileType.StationTurn;
            case TileType.LakeRoadRailMirror:
                return TileType.LakeRoadRail;
            default:
                return tile;
        }
    }

    protected doesTileHaveToBeConnected(tile: BaseTile): boolean{
        if(tile instanceof RiverExpansionTile || tile instanceof LakeExpansionTile){
            return false;
        }
        return true;
    }

    /** Returns the tiles that are disconnected but need to be connected. 
     *  This will not return tiles that are disconnected and don't need to be connected.
     */
    public GetDisconnectedTiles(): number[]{
        const invalidMoveIndices: number[] = [];
        for(let moveIndex = 0; moveIndex < this.playedTiles.length; moveIndex++){
            const move = this.playedTiles[moveIndex];
            const tile = move.GetTile();
            if(this.doesTileHaveToBeConnected(tile)){
                const isContinuous = this.tileContinuityValidator.Validate(tile);
                if(!isContinuous){
                    invalidMoveIndices.push(moveIndex);
                }
            }
        }
        return invalidMoveIndices;
    }

    private doesDieHaveToBePlayed(tile: TileType): boolean{
        switch(tile){
            case TileType.RiverStraight:
            case TileType.RiverTurn:
            case TileType.RiverRailBridge:
            case TileType.RiverRoadBridge:
            case TileType.LakeFull:
            case TileType.LakeThreeSides:
            case TileType.LakeTwoSides:
            case TileType.LakeOneSide:
            case TileType.LakeRoad:
            case TileType.LakeRail:
            case TileType.LakeRoadRail:
                return false;
            default:
                return true;
        }
    }

    /** Gets all the dice rolled for this turn. */
    public GetRolledDice(): TileType[]{
        return this.diceToPlay.map(die => die.tileType);
    }

    /** Gets all the dice that can still be played this turn. */
    public GetAvailableDiceToPlay(): TileType[]{
        return this.diceToPlay.filter(die => !die.played).map((die => die.tileType));
    }

    /** Gets all the dice that still must be played this turn. */
    public GetRequiredDiceToPlay(): TileType[]{
        return this.diceToPlay.filter(die => !die.played && die.required).map(die => die.tileType);
    }

    /** True if the player can end their turn. */
    public CanTurnBeDone(): boolean{
        return this.GetRequiredDiceToPlay().length === 0;
    }
}