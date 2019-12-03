import { PlayableBaseTile } from "./tiles";

/** Represents a move played in the game. */
export class Move{
    private tile: PlayableBaseTile;
    private rowIndex: number;
    private columnIndex: number;

    constructor(tile: PlayableBaseTile, rowIndex: number, columnIndex: number){
        this.tile = tile;
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
    }

    /** Gets the tile played this move. */
    public GetTile(): PlayableBaseTile{
        return this.tile;
    }

    /** Gets the row index of this move. */
    public GetRowIndex(): number{
        return this.rowIndex;
    }

    /** Gets the column index of this move. */
    public GetColumnIndex(): number{
        return this.columnIndex;
    }
}