import { Move } from "./GameTurn";
import { IGameTile, GameTile } from "./GameTile";
import { TileType } from "../../common/Enums";

export class GameBoard {
    public readonly numberOfColumns: number;
    public readonly numberOrRows: number;
    
    private board: IGameTile[][];

    public constructor(numberOfColumns: number, numberOfRows: number) {
        this.numberOfColumns = numberOfColumns;
        this.numberOrRows = numberOfRows;

        this.createEmptyBoard();
    }

    public MakeMove(move: Move) {
        this.playTile(move.TilePlayed, move.ColumnPosition, move.RowPosition);
    }

    public RemoveMove(move: Move) {
        this.clearTile(move.ColumnPosition, move.RowPosition);
    }

    public GetTile(col: number, row: number) {
        if (col < this.numberOfColumns || row < this.numberOrRows) {
            return this.board[col][row];
        }
    }

    private playTile(gameTile: IGameTile, col: number, row: number) {
        if (!gameTile.IsTileEmpty()) {
            this.setTile(gameTile, col, row);
        }
    }

    private setTile(tile: GameTile, col: number, row: number) {
        if (col < this.numberOfColumns || row < this.numberOrRows) {
            this.board[col][row] = tile;
        }
    }

    private clearTile(col: number, row: number) {
        if (col < this.numberOfColumns || row < this.numberOrRows) {
            this.board[col][row] = new GameTile(TileType.Empty);
        }
    }

    private createEmptyBoard() {
        this.board = [];
        for(var currCol = 0; currCol < this.numberOfColumns; currCol++) {
            this.board[currCol] = [];
            for(var currRow = 0; currRow < this.numberOrRows; currRow++) {
                this.board[currCol][currRow] = new GameTile();
            }
        }
    }
}