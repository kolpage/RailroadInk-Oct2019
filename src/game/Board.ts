import { BaseTile, EdgeBaseTile } from "./tiles";
import { Edge, TileType, Orientation } from "../common/Enums";
import { TileFactory } from "./TileFactory";
import { Tile } from "../client/tile";

/** Represents the game board the tiles are played on. Rows and columns are 0 indexed.
 *  Ex. Telling board to put something at Row 3 Column 6 is the 4th row down from the top and the last column. 
 */
export class Board{
    private board: BaseTile[][];
    private playableBoardWidth: number;
    private playableBoardHeight: number;
    private get boardWidth(): number{
        return this.playableBoardWidth + 2;
    }
    private get boardHeight(): number{
        return this.playableBoardHeight + 2;
    };
    private tileFactory = new TileFactory();

    constructor(playAreaWidth: number, playAreaHeight: number){
        this.playableBoardWidth = playAreaWidth;
        this.playableBoardHeight = playAreaHeight;
        this.initialize();
        this.setBoardEdges();
    }

    /** Sets a tile on the board. Returns true if tile was sucessfully set, false otherwise. */
    public SetTile(tileType: TileType, 
        turn: number, 
        orientation: Orientation, 
        rowIndex: number, 
        columnIndex: number, 
        allowOverwrite: boolean
    ): boolean{
        if(!this.validatePlayableBoardCoordinates(rowIndex, columnIndex)){
            return false;
        }

        const boardRowIndex = this.convertGameCoordToBoardCoords(rowIndex);
        const boardColumnIndex = this.convertGameCoordToBoardCoords(columnIndex);
        if(!allowOverwrite && this.board[boardRowIndex][boardColumnIndex] !== undefined){
            return false;
        }

        const tile = this.tileFactory.CreateTile(tileType, turn, orientation);
        if(!tile){
            return false;
        }

        this.board[boardRowIndex][boardColumnIndex] = tile;
        return true;        
    }

    /** Removes the tile at the specified position. Returns the tile if there was a tile there, otherwise undefined. */
    public RemoveTile(rowIndex: number, columnIndex: number): BaseTile | undefined{
        if(!this.validatePlayableBoardCoordinates(rowIndex, columnIndex)){
            return undefined;
        }
        const boardRowIndex = this.convertGameCoordToBoardCoords(rowIndex);
        const boardColumnIndex = this.convertGameCoordToBoardCoords(columnIndex);
        const tile = this.board[boardRowIndex][boardColumnIndex];
        this.board[boardRowIndex][boardColumnIndex] = undefined;
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
            this.board[rowIndexOfEdge][boardIndex] = tile;
        }
    }

    private createLeftRightEdge(columnIndexOfEdge: number): void{
        const edgeTileSequenceGenerator = new EdgeTileSequenceGenerator(TileType.RailEdge, this.tileFactory);
        for(let i = 0; i < this.playableBoardWidth; i++){
            const boardIndex = this.convertGameCoordToBoardCoords(i);
            const tile = edgeTileSequenceGenerator.GetNextTile();
            this.board[boardIndex][columnIndexOfEdge] = tile;
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