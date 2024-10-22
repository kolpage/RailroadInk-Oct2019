import { BaseTile, EdgeBaseTile, PlayableBaseTile, RoadEdgeTile, RailEdgeTile, StationTurnTile } from "./tiles";
import { Edge, TileType, Orientation, EdgeMatchingStatus, TilePlacementResult as TilePlacementResult } from "../common/Enums";
import { TileFactory } from "./TileFactory";
import { PositionValidator } from "../common/PositionValidator";
import { ConnectionValidator } from "../common/ConnectionValidator";
import { TileContinuityValidator } from "./TileVisitor";

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
    private roads: BaseTile[];
    private rails: BaseTile[];
    private rivers: BaseTile[];
    private lakes: BaseTile[];
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
        this.roads = [];
        this.rails = [];
        this.rivers = [];
        this.lakes = [];
        this.exits = [];
        this.initialize();
        this.setBoardEdges();
    }

    /** Returns a list of all exit tiles */
    public GetExits(): EdgeBaseTile[]{
        return this.exits;
    }

    /** Returns all tiles of the specified type */
    public GetTilesOfType(edge: Edge){
        switch(edge){
            case Edge.road: return this.roads;
            case Edge.rail: return this.rails;
            case Edge.river: return this.rivers;
            case Edge.lake: return this.lakes;
        }
        return [];
    }

    /** Gets the tile by tile id */
    public GetTileById(id: string): BaseTile | undefined{
        let tile;
        const tileLocation = this.tileIndex[id];
        if(tileLocation !== undefined){
            tile = this.board[tileLocation.row][tileLocation.column];
        }
        return tile;
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
     * Determines if the given tile can be played anywhere on the board.
     * @param tile The tile to see if can be played
     */
    public IsTilePlayable(tile: TileType){
        const tileFactory = new TileFactory();
        const tileConnectionValidator = new TileContinuityValidator(this);
        const upTile = tileFactory.CreateTile(tile, Number.MAX_SAFE_INTEGER, Orientation.up);
        const rightTile = tileFactory.CreateTile(tile, Number.MAX_SAFE_INTEGER, Orientation.right);
        const downTile = tileFactory.CreateTile(tile, Number.MAX_SAFE_INTEGER, Orientation.down);
        const leftTile = tileFactory.CreateTile(tile, Number.MAX_SAFE_INTEGER, Orientation.left);
        const tileOrientations = [upTile, rightTile, downTile, leftTile];
        if(tile === TileType.StationTurn){
            tileOrientations.push(tileFactory.CreateTile(TileType.StationTurnMirror, Number.MAX_SAFE_INTEGER, Orientation.up));
            tileOrientations.push(tileFactory.CreateTile(TileType.StationTurnMirror, Number.MAX_SAFE_INTEGER, Orientation.right));
            tileOrientations.push(tileFactory.CreateTile(TileType.StationTurnMirror, Number.MAX_SAFE_INTEGER, Orientation.down));
            tileOrientations.push(tileFactory.CreateTile(TileType.StationTurnMirror, Number.MAX_SAFE_INTEGER, Orientation.left));
        }
        if(tile === TileType.LakeRoadRail){
            tileOrientations.push(tileFactory.CreateTile(TileType.LakeRoadRailMirror, Number.MAX_SAFE_INTEGER, Orientation.up));
            tileOrientations.push(tileFactory.CreateTile(TileType.LakeRoadRailMirror, Number.MAX_SAFE_INTEGER, Orientation.right));
            tileOrientations.push(tileFactory.CreateTile(TileType.LakeRoadRailMirror, Number.MAX_SAFE_INTEGER, Orientation.down));
            tileOrientations.push(tileFactory.CreateTile(TileType.LakeRoadRailMirror, Number.MAX_SAFE_INTEGER, Orientation.left));
        }
        for(let rowIndex = 0; rowIndex < this.playableBoardHeight; rowIndex++){
            for(let columnIndex = 0; columnIndex < this.playableBoardWidth; columnIndex++){
                if(this.GetTile(rowIndex, columnIndex) !== undefined){
                    continue;
                }
                for(const testTile of tileOrientations){
                    const followsEdgeRules = this.IsTilePositionValid(testTile, rowIndex, columnIndex);
                    if(followsEdgeRules){
                        this.SetTile(testTile, rowIndex, columnIndex, false);
                        const isConnected = tileConnectionValidator.Validate(testTile);
                        this.RemoveTile(rowIndex, columnIndex);
                        if(isConnected){
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    /** 
     * Returns true if a tile placed in the specified position and orientation
     * follows all game tile placement rules. False if it violates a rule. Takes playable coords
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

        const boardRowIndex = this.convertPlayableCoordToBoardCoords(rowIndex);
        const boardColumnIndex = this.convertPlayableCoordToBoardCoords(columnIndex);
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
            boardRowIndex = this.convertPlayableCoordToBoardCoords(tileOrRowIndex);
            boardColumnIndex = this.convertPlayableCoordToBoardCoords(columnIndex);
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
            boardRowIndex = this.convertPlayableCoordToBoardCoords(tileOrRowIndex);
            boardColumnIndex = this.convertPlayableCoordToBoardCoords(columnIndex);
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
            boardRowIndex = this.convertPlayableCoordToBoardCoords(tileOrRowIndex);
            boardColumnIndex = this.convertPlayableCoordToBoardCoords(columnIndex);
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
            boardRowIndex = this.convertPlayableCoordToBoardCoords(tileOrRowIndex);
            boardColumnIndex = this.convertPlayableCoordToBoardCoords(columnIndex);
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

    /** Sets a tile on the board. Returns true if tile was sucessfully set, false otherwise. Takes playable coords. */
    public SetTile(
        tile: PlayableBaseTile,
        rowIndex: number, 
        columnIndex: number, 
        allowOverwrite: boolean
    ): TilePlacementResult{
        if(!this.validatePlayableBoardCoordinates(rowIndex, columnIndex)){
            return TilePlacementResult.invalidCoordinates;
        }

        const boardRowIndex = this.convertPlayableCoordToBoardCoords(rowIndex);
        const boardColumnIndex = this.convertPlayableCoordToBoardCoords(columnIndex);
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
        this.addTileToTileLists(tile);
    }

    /** Removes the tile at the specified position. Returns the tile if there was a tile there, otherwise undefined. Uses playable coords */
    public RemoveTile(rowIndex: number, columnIndex: number): BaseTile | undefined{
        if(!this.validatePlayableBoardCoordinates(rowIndex, columnIndex)){
            return undefined;
        }
        const boardRowIndex = this.convertPlayableCoordToBoardCoords(rowIndex);
        const boardColumnIndex = this.convertPlayableCoordToBoardCoords(columnIndex);
        
        return this.removeTileAndUpdateIndex(boardRowIndex, boardColumnIndex);
    }

    private removeTileAndUpdateIndex(boardRowIndex: number, columnIndex: number): BaseTile | undefined{
        const tile = this.board[boardRowIndex][columnIndex];
        if(tile === undefined){
            return undefined;
        }
        this.board[boardRowIndex][columnIndex] = undefined;
        delete this.tileIndex[tile.GetTileId()];
        this.removeTileFromTileLists(tile);
        return tile;
    }

    private addTileToTileLists(tile: BaseTile): void{
        const hasRoadEdge = this.doesTileHaveEdgeType(tile, Edge.road);
        const hasRailEdge = this.doesTileHaveEdgeType(tile, Edge.rail);
        const hasRiverEdge = this.doesTileHaveEdgeType(tile, Edge.river);
        const hasLakeEdge = this.doesTileHaveEdgeType(tile, Edge.lake);

        if(hasRoadEdge){
            this.roads.push(tile);
        }
        if(hasRailEdge){
            this.rails.push(tile);
        }
        if(hasRiverEdge){
            this.rivers.push(tile);
        }
        if(hasLakeEdge){
            this.lakes.push(tile);
        }
    }

    private removeTileFromTileLists(tile: BaseTile): void{
        const roadIndex = this.roads.indexOf(tile);
        if(roadIndex > -1){
            this.roads.splice(roadIndex, 1);
        }

        const railIndex = this.rails.indexOf(tile);
        if(railIndex > -1){
            this.rails.splice(railIndex, 1);
        }

        const riverIndex = this.rivers.indexOf(tile);
        if(riverIndex > -1){
            this.rivers.splice(riverIndex, 1);
        }
    }

    private doesTileHaveEdgeType(tile: BaseTile, edgeType: Edge): boolean{
        const topEdge = tile.GetTopEdge();
        if(topEdge === edgeType){
            return true;
        }
        const rightEdge = tile.GetRightEdge();
        if(rightEdge === edgeType){
            return true;
        }
        const bottomEdge = tile.GetBottomEdge();
        if(bottomEdge === edgeType){
            return true;
        }
        const leftEdge = tile.GetLeftEdge();
        if(leftEdge === edgeType){
            return true;
        }
        return false;
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
            const boardIndex = this.convertPlayableCoordToBoardCoords(i);
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
            const boardIndex = this.convertPlayableCoordToBoardCoords(i);
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

    private convertPlayableCoordToBoardCoords(gameCoordinate: number): number{
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