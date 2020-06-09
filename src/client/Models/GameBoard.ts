import { Move } from "./GameTurn";
import { IGameTile, GameTile } from "./GameTile";
import { TileType, Orientation } from "../../common/Enums";
import { CanTileFlood, IsLakeTile } from "../Utility Functions/LakeValidation";

export class GameBoard {
    public readonly numberOfColumns: number;
    public readonly numberOfRows: number;
    
    private board: IGameTile[][];

    public constructor(numberOfColumns: number, numberOfRows: number) {
        this.numberOfColumns = numberOfColumns;
        this.numberOfRows = numberOfRows;

        this.createEmptyBoard();
    }

    public GetMove(col: number, row: number){
        return new Move(this.GetTile(col, row), col, row);
    }

    public MakeMove(move: Move) {
        this.playTile(move.TilePlayed, move.ColumnPosition, move.RowPosition);
        this.checkFloodStateForTile(new BoardTile(move.ColumnPosition, move.RowPosition, move.TilePlayed, this.numberOfColumns, this.numberOfRows));
    }

    public RemoveMove(move: Move) {
        this.clearTile(move.ColumnPosition, move.RowPosition);
        this.checkFloodStateForTile(new BoardTile(move.ColumnPosition, move.RowPosition, move.TilePlayed, this.numberOfColumns, this.numberOfRows));
    }

    public GetTile(col: number, row: number) {
        if (col > -1 && col < this.numberOfColumns && row > -1 && row < this.numberOfRows) {
            return this.board[col][row];
        }
        return null;
    }

    private GetTileNonNull(col: number, row: number){
        var tile = this.GetTile(col, row);
        if(tile == null){
            tile = new GameTile();
        }

        return tile;
    }

    private checkFloodStateForTile(tile: BoardTile){
        // WARNING: PROCEDUAL CODE - ORDER MATTERS!
        this.removeAdjacentFlood(tile); //This function handles checking for unflooding on the board
        //this.checkForUnFlooding(tile);
        this.checkForFlooding(tile);
    }

    private removeAdjacentFlood(tile: BoardTile){
        const col = tile.col;
        const row = tile.row;

        const topTile = this.GetBoardTile(col, row-1);
        this.emptyFloodTile(topTile);
        this.checkForUnFlooding(topTile);
        const rightTile = this.GetBoardTile(col+1, row);
        this.emptyFloodTile(rightTile);
        this.checkForUnFlooding(rightTile);
        const bottomTile = this.GetBoardTile(col, row+1);
        this.emptyFloodTile(bottomTile);
        this.checkForUnFlooding(bottomTile);
        const leftTile = this.GetBoardTile(col-1, row);
        this.emptyFloodTile(leftTile);
        this.checkForUnFlooding(leftTile);
    }

    private GetBoardTile(col: number, row: number){
        return new BoardTile(col, row, this.GetTileNonNull(col, row), this.numberOfColumns, this.numberOfRows);
    }
    
    private checkForFlooding(tile: BoardTile){
        if(IsLakeTile(tile.gameTile.Type)){
            const col = tile.col;
            const row = tile.row;

            // WARNING: PROCEDUAL CODE - ORDER MATTERS!
            const topTile = this.GetBoardTile(col, row-1);
            if(topTile.CouldFlood()){this.floodBoardForTile(topTile)}
            const rightTile = this.GetBoardTile(col+1, row);
            if(rightTile.CouldFlood()){this.floodBoardForTile(rightTile)}
            const bottomTile = this.GetBoardTile(col, row+1);
            if(bottomTile.CouldFlood()){this.floodBoardForTile(bottomTile)}
            const leftTile = this.GetBoardTile(col-1, row);
            if(leftTile.CouldFlood()){this.floodBoardForTile(leftTile)}
        }
    }

    private floodBoardForTile(tile: BoardTile){
        const col = tile.col;
        const row = tile.row;
        const topTile = this.GetBoardTile(col, row-1);
        const rightTile = this.GetBoardTile(col+1, row);
        const bottomTile = this.GetBoardTile(col, row+1);
        const leftTile = this.GetBoardTile(col-1, row);
        if(CanTileFlood(tile.gameTile, topTile.gameTile, rightTile.gameTile, bottomTile.gameTile, leftTile.gameTile)){
            const floodedTile = new GameTile(TileType.LakeFull, Orientation.up);
            this.setTile(floodedTile, col, row);
            this.checkForFlooding(this.GetBoardTile(col, row));
        }
    }

    private checkForUnFlooding(tile: BoardTile){
        const col = tile.col;
        const row = tile.row;
        
        // WARNING: PROCEDUAL CODE - ORDER MATTERS!
        const topTile = this.GetBoardTile(col, row-1);
        if(topTile.CouldUnflood()){this.unfloodBoardForTile(topTile)}
        const rightTile = this.GetBoardTile(col+1, row);
        if(rightTile.CouldUnflood()){this.unfloodBoardForTile(rightTile)}
        const bottomTile = this.GetBoardTile(col, row+1);
        if(bottomTile.CouldUnflood()){this.unfloodBoardForTile(bottomTile)}
        const leftTile = this.GetBoardTile(col-1, row);
        if(leftTile.CouldUnflood()){this.unfloodBoardForTile(leftTile)}
    }

    private unfloodBoardForTile(tile: BoardTile){
        const col = tile.col;
        const row = tile.row;
        const topTile = this.GetBoardTile(col, row-1);
        const rightTile = this.GetBoardTile(col+1, row);
        const bottomTile = this.GetBoardTile(col, row+1);
        const leftTile = this.GetBoardTile(col-1, row);

        if((tile.gameTile.Type === TileType.LakeFull) && !CanTileFlood(tile.gameTile, topTile.gameTile, rightTile.gameTile, bottomTile.gameTile, leftTile.gameTile)){
            const emptyTile = new GameTile(TileType.Empty);
            this.setTile(emptyTile, col, row);
            this.checkForUnFlooding(this.GetBoardTile(col, row));
        }
    }

    private emptyFloodTile(tile: BoardTile){
        if(tile.gameTile.Type === TileType.LakeFull) {
            const emptyTile = new GameTile(TileType.Empty);
            this.setTile(emptyTile, tile.col, tile.row);
        }
    }

    private playTile(gameTile: IGameTile, col: number, row: number) {
        if (!gameTile.IsTileEmpty()) {
            this.setTile(gameTile, col, row);
        }
    }

    private setTile(tile: IGameTile, col: number, row: number) {
        if (col < this.numberOfColumns || row < this.numberOfRows) {
            this.board[col][row] = tile;
        }
    }

    private clearTile(col: number, row: number) {
        if (col < this.numberOfColumns || row < this.numberOfRows) {
            this.board[col][row] = new GameTile(TileType.Empty);
        }
    }

    private createEmptyBoard() {
        this.board = [];
        for(var currCol = 0; currCol < this.numberOfColumns; currCol++) {
            this.board[currCol] = [];
            for(var currRow = 0; currRow < this.numberOfRows; currRow++) {
                this.board[currCol][currRow] = new GameTile();
            }
        }
    }
}

class BoardTile{
    public readonly row: number;
    public readonly col: number;
    public readonly gameTile: IGameTile;
    private numberOfColumns: number;
    private numberOfRows: number

    public constructor(col: number, row: number, gameTile: IGameTile, numberOfColumns: number, numberOfRows: number){
        this.col = col;
        this.row = row;
        this.gameTile = gameTile;
        this.numberOfColumns = numberOfColumns;
        this.numberOfRows = numberOfRows;

    }

    public CouldFlood(){
        return this.isValidPosition() && this.gameTile.Type == TileType.Empty;
    }

    public CouldUnflood(){
        return this.isValidPosition() && this.gameTile.Type == TileType.LakeFull;
    }

    private isValidPosition(){
        return this.row > -1 && this.row < this.numberOfRows && this.col > -1  && this.col < this.numberOfColumns;
    }
}

