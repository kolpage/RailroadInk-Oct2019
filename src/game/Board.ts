import { BaseTile, EdgeBaseTile, PlayableBaseTile, RoadEdgeTile, RailEdgeTile } from "./tiles";
import { Edge, TileType, Orientation, EdgeMatchingStatus, TilePlacementResult as TilePlacementResult } from "../common/Enums";
import { TileFactory } from "./TileFactory";
import { PositionValidator } from "../common/PositionValidator";

export interface ITileLocation{
    row: number,
    column: number
}

/** Represents the game board the tiles are played on. Rows and columns are 0 indexed.
 *  Ex. Telling board to put something at Row 3 Column 6 is the 4th row down from the top and the last column. 
 */
export class Board{
    private board: BaseTile[][];
    private tileIndex: { [tileId: string]: ITileLocation};
    private exits: EdgeBaseTile[];
    private playableBoardWidth: number;
    private playableBoardHeight: number;
    private get boardWidth(): number{
        return this.playableBoardWidth + 2;
    }
    private get boardHeight(): number{
        return this.playableBoardHeight + 2;
    };
    private tileFactory: TileFactory;

    constructor(playAreaWidth: number, playAreaHeight: number, tileFactory: TileFactory){
        this.playableBoardWidth = playAreaWidth;
        this.playableBoardHeight = playAreaHeight;
        this.tileFactory = tileFactory;
        this.tileIndex = {};
        this.exits = [];
        this.initialize();
        this.setBoardEdges();
    }

    public GetExits(): EdgeBaseTile[]{
        return this.exits;
    }

    /**
     * Returns the playable board width.
     */
    public GetPlayableBoardWidth(): number{
        return this.playableBoardWidth;
    }

    /**
     * Returns the playable board height.
     */
    public GetPlayableBoardHeight(): number{
        return this.playableBoardHeight;
    }

    /** 
     * Returns true if a tile placed in the specified position and orientation
     * follows all game tile placement rules. False if it violates a rule.
     */
    public IsTilePositionValid(tile: PlayableBaseTile, rowIndex: number, columnIndex: number): boolean{
        //Bad coordinates or there's already a tile played there
        if(!this.validatePlayableBoardCoordinates(rowIndex, columnIndex) 
           || !!this.GetTile(rowIndex, columnIndex)){
            return false;
        }
        
        let nearbyTile: BaseTile;
        //Check up
        nearbyTile = this.GetTileAbove(rowIndex, columnIndex);
        if(nearbyTile){
            if(PositionValidator.ValidateEdges(tile.GetTopEdge(), nearbyTile.GetBottomEdge()) === EdgeMatchingStatus.invalid){
                return false;
            }
        }
        
        //Check down
        nearbyTile = this.GetTileBelow(rowIndex, columnIndex);
        if(nearbyTile){
            if(PositionValidator.ValidateEdges(tile.GetBottomEdge(), nearbyTile.GetTopEdge()) === EdgeMatchingStatus.invalid){
                return false;
            }
        }

        //Check left
        nearbyTile = this.GetTileLeft(rowIndex, columnIndex);
        if(nearbyTile){
            if(PositionValidator.ValidateEdges(tile.GetLeftEdge(), nearbyTile.GetRightEdge()) === EdgeMatchingStatus.invalid){
                return false;
            }
        }

        //Check right
        nearbyTile = this.GetTileRight(rowIndex, columnIndex);
        if(nearbyTile){
            if(PositionValidator.ValidateEdges(tile.GetRightEdge(), nearbyTile.GetLeftEdge()) === EdgeMatchingStatus.invalid){
                return false;
            }
        }

        return true;
    }

    /** Gets a playable tile from the board. Expects to be given coordinates in playable coordinates */
    public GetTile(rowIndex: number, columnIndex: number): PlayableBaseTile | undefined{
        if(!this.validatePlayableBoardCoordinates(rowIndex, columnIndex)){
            return undefined;
        }

        const boardRowIndex = this.convertGameCoordToBoardCoords(rowIndex);
        const boardColumnIndex = this.convertGameCoordToBoardCoords(columnIndex);
        return this.board[boardRowIndex][boardColumnIndex] as PlayableBaseTile;
    }

    /** 
     * Gets the tile above the specified tile. Can be done by tile or playable coordinates.
     */
    public GetTileAbove(tile: BaseTile): BaseTile | undefined;
    public GetTileAbove(rowIndex: number, columnIndex: number): BaseTile | undefined;
    public GetTileAbove(tileOrRowIndex: BaseTile | number, columnIndex?): BaseTile | undefined{
        let boardRowIndex: number;
        let boardColumnIndex: number;
        if(tileOrRowIndex instanceof BaseTile){
            const tileCoords = this.GetTileCoordinates(tileOrRowIndex);
            if(tileCoords === undefined){
                return undefined;
            }
            boardRowIndex = tileCoords.row;
            boardColumnIndex = tileCoords.column;
        }
        else{
            boardRowIndex = this.convertGameCoordToBoardCoords(tileOrRowIndex);
            boardColumnIndex = this.convertGameCoordToBoardCoords(columnIndex);
        }
        
        boardRowIndex--;
        if(!this.validateBoardCoordinates(boardRowIndex, boardColumnIndex)){
            return undefined;
        }
        return this.board[boardRowIndex][boardColumnIndex];
    }

    /** 
     * Gets the tile below the specified tile. Can be done by tile or playable coordinates.
     */
    public GetTileBelow(tile: BaseTile): BaseTile | undefined;
    public GetTileBelow(rowIndex: number, columnIndex: number): BaseTile | undefined;
    public GetTileBelow(tileOrRowIndex: BaseTile | number, columnIndex?): BaseTile | undefined{
        let boardRowIndex: number;
        let boardColumnIndex: number;
        if(tileOrRowIndex instanceof BaseTile){
            const tileCoords = this.GetTileCoordinates(tileOrRowIndex);
            if(tileCoords === undefined){
                return undefined;
            }
            boardRowIndex = tileCoords.row;
            boardColumnIndex = tileCoords.column;
        }
        else{
            boardRowIndex = this.convertGameCoordToBoardCoords(tileOrRowIndex);
            boardColumnIndex = this.convertGameCoordToBoardCoords(columnIndex);
        }
        
        boardRowIndex++;
        if(!this.validateBoardCoordinates(boardRowIndex, boardColumnIndex)){
            return undefined;
        }
        return this.board[boardRowIndex][boardColumnIndex];
    }

    /** 
     * Gets the tile left of the specified tile. Can be done by tile or playable coordinates.
     */
    public GetTileLeft(tile: BaseTile): BaseTile | undefined;
    public GetTileLeft(rowIndex: number, columnIndex: number): BaseTile | undefined;
    public GetTileLeft(tileOrRowIndex: BaseTile | number, columnIndex?): BaseTile | undefined{
        let boardRowIndex: number;
        let boardColumnIndex: number;
        if(tileOrRowIndex instanceof BaseTile){
            const tileCoords = this.GetTileCoordinates(tileOrRowIndex);
            if(tileCoords === undefined){
                return undefined;
            }
            boardRowIndex = tileCoords.row;
            boardColumnIndex = tileCoords.column;
        }
        else{
            boardRowIndex = this.convertGameCoordToBoardCoords(tileOrRowIndex);
            boardColumnIndex = this.convertGameCoordToBoardCoords(columnIndex);
        }
        
        boardColumnIndex--;
        if(!this.validateBoardCoordinates(boardRowIndex, boardColumnIndex)){
            return undefined;
        }
        return this.board[boardRowIndex][boardColumnIndex];
    }

    /** 
     * Gets the tile right of the specified tile. Can be done by tile or playable coordinates.
     */
    public GetTileRight(tile: BaseTile): BaseTile | undefined;
    public GetTileRight(rowIndex: number, columnIndex: number): BaseTile | undefined;
    public GetTileRight(tileOrRowIndex: BaseTile | number, columnIndex?): BaseTile | undefined{
        let boardRowIndex: number;
        let boardColumnIndex: number;
        if(tileOrRowIndex instanceof BaseTile){
            const tileCoords = this.GetTileCoordinates(tileOrRowIndex);
            if(tileCoords === undefined){
                return undefined;
            }
            boardRowIndex = tileCoords.row;
            boardColumnIndex = tileCoords.column;
        }
        else{
            boardRowIndex = this.convertGameCoordToBoardCoords(tileOrRowIndex);
            boardColumnIndex = this.convertGameCoordToBoardCoords(columnIndex);
        }
        
        boardColumnIndex++;
        if(!this.validateBoardCoordinates(boardRowIndex, boardColumnIndex)){
            return undefined;
        }
        return this.board[boardRowIndex][boardColumnIndex];
    }

    /** Gets the board (not playable) coordinates of the tile. */
    public GetTileCoordinates(tile: BaseTile): ITileLocation | undefined{
        return this.tileIndex[tile.GetTileId()];
    }

    /** Sets a tile on the board. Returns true if tile was sucessfully set, false otherwise. */
    public SetTile(
        tile: PlayableBaseTile,
        rowIndex: number, 
        columnIndex: number, 
        allowOverwrite: boolean
    ): TilePlacementResult{
        if(!this.validatePlayableBoardCoordinates(rowIndex, columnIndex)){
            return TilePlacementResult.invalidCoordinates;
        }

        const boardRowIndex = this.convertGameCoordToBoardCoords(rowIndex);
        const boardColumnIndex = this.convertGameCoordToBoardCoords(columnIndex);
        if(this.board[boardRowIndex][boardColumnIndex] !== undefined){
            if(!allowOverwrite){
                return TilePlacementResult.alreadyTileAtLocation;
            }
            this.removeTileAndUpdateIndex(boardRowIndex, boardColumnIndex);
        }

        this.setTileAndUpdateIndex(boardRowIndex, boardColumnIndex, tile);
        return TilePlacementResult.valid;        
    }

    private setTileAndUpdateIndex(boardRowIndex: number, boardColumnIndex: number, tile: BaseTile){
        this.board[boardRowIndex][boardColumnIndex] = tile;
        this.tileIndex[tile.GetTileId()] = {
            row: boardRowIndex,
            column: boardColumnIndex
        };
    }

    /** Removes the tile at the specified position. Returns the tile if there was a tile there, otherwise undefined. */
    public RemoveTile(rowIndex: number, columnIndex: number): BaseTile | undefined{
        if(!this.validatePlayableBoardCoordinates(rowIndex, columnIndex)){
            return undefined;
        }
        const boardRowIndex = this.convertGameCoordToBoardCoords(rowIndex);
        const boardColumnIndex = this.convertGameCoordToBoardCoords(columnIndex);
        
        return this.removeTileAndUpdateIndex(boardRowIndex, boardColumnIndex);
    }

    private removeTileAndUpdateIndex(boardRowIndex: number, columnIndex: number): BaseTile | undefined{
        const tile = this.board[boardRowIndex][columnIndex];
        if(tile === undefined){
            return undefined;
        }
        this.board[boardRowIndex][columnIndex] = undefined;
        delete this.tileIndex[tile.GetTileId()]; 
        return tile;
    }

    /** Prints the board as a string. */
    public ToString(){
        let output = "";
        let headerRow = "XXXX ";
        for(let i = 0; i < this.board[0].length; i++){
            headerRow += "COL" + i + " ";
        }
        output += headerRow + "\n";
        for(let i = 0; i < this.board.length; i++){
            let rowOutput = "ROW" + i + " ";
            for(let j = 0; j < this.board[i].length; j++){
                const tile = this.board[i][j];
                if(!tile){
                    rowOutput += "UNDF ";
                }
                else{
                    rowOutput += tile.GetAbbrName() + " ";
                }
            }
            output += rowOutput + "\n";
        }
        return output;
    }

    private validateBoardCoordinates(rowIndex: number, columnIndex: number): boolean{
        return (rowIndex >= 0 
            && rowIndex < this.boardWidth
            && columnIndex >= 0 
            && columnIndex < this.boardHeight)
    }

    private validatePlayableBoardCoordinates(rowIndex: number, columnIndex: number): boolean{
        return (rowIndex >= 0 
            && rowIndex < this.playableBoardHeight
            && columnIndex >= 0 
            && columnIndex < this.playableBoardWidth)
    }

    /** Creates internal representation of the board. */
    private initialize(): void{
        this.board = Array(this.boardHeight);
        for(let i = 0; i < this.boardHeight; i++){
            this.board[i] = Array(this.boardWidth);
        }
    }

    private setBoardEdges(): void{
        this.createTopBottomEdge(0);
        this.createTopBottomEdge(this.boardWidth - 1);
        this.createLeftRightEdge(0);
        this.createLeftRightEdge(this.boardHeight - 1);
    }

    private createTopBottomEdge(rowIndexOfEdge: number): void{
        const edgeTileSequenceGenerator = new EdgeTileSequenceGenerator(TileType.RoadEdge, this.tileFactory);
        for(let i = 0; i < this.playableBoardWidth; i++){
            const boardIndex = this.convertGameCoordToBoardCoords(i);
            const tile = edgeTileSequenceGenerator.GetNextTile();
            if(this.isExitTile(tile)){
                this.exits.push(tile);
            }
            this.board[rowIndexOfEdge][boardIndex] = tile;
            this.tileIndex[tile.GetTileId()] = {
                row: rowIndexOfEdge,
                column: boardIndex
            };
        }
    }

    private isExitTile(tile: EdgeBaseTile): boolean{
        return tile instanceof RoadEdgeTile 
        || tile instanceof RailEdgeTile;
    }

    private createLeftRightEdge(columnIndexOfEdge: number): void{
        const edgeTileSequenceGenerator = new EdgeTileSequenceGenerator(TileType.RailEdge, this.tileFactory);
        for(let i = 0; i < this.playableBoardWidth; i++){
            const boardIndex = this.convertGameCoordToBoardCoords(i);
            const tile = edgeTileSequenceGenerator.GetNextTile();
            if(this.isExitTile(tile)){
                this.exits.push(tile);
            }
            this.board[boardIndex][columnIndexOfEdge] = tile;
            this.tileIndex[tile.GetTileId()] = {
                row: boardIndex,
                column: columnIndexOfEdge
            };
        }
    }

    private convertGameCoordToBoardCoords(gameCoordinate: number): number{
        return gameCoordinate + 1;
    }

    
}

/** Generates the edge tiles of the board for any sized board. Works best with odd numbers.
 *  An exit will be generated on the 1,3,5,7,... indicies (0 indexed), and will be the opposite of the previous exit type.
 *  Walls will be generated between.
 */
class EdgeTileSequenceGenerator{
    private tileFactory: TileFactory;
    private nextExitType: TileType;
    private shouldGenerateExit = false;
    constructor(firstExitType: TileType, tileFactory: TileFactory){
        this.tileFactory = tileFactory;
        this.nextExitType = firstExitType;
    }

    /** Gets the next exit tile in the edge sequence. */
    public GetNextTile(): EdgeBaseTile{
        if(this.shouldGenerateExit){
            this.shouldGenerateExit = false;
            const currentExitType = this.nextExitType;
            this.nextExitType = this.toggleExitType(currentExitType);
            return this.tileFactory.CreateEdgeTile(currentExitType);
        }
        else{
            this.shouldGenerateExit = true;
            return this.tileFactory.CreateEdgeTile(TileType.WallEdge);
        }
    }  

    /** Returns the other exit type based on what it was given */
    private toggleExitType(currentExitType: TileType): TileType{
        if(currentExitType === TileType.RoadEdge){
            return TileType.RailEdge;
        }
        else{
            return TileType.RoadEdge;
        }
    }
}