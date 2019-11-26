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
    public get_tile(): PlayableBaseTile{
        return this.tile;
    }

    /** Gets the row index of this move. */
    public get_rowIndex(): number{
        return this.rowIndex;
    }

    /** Gets the column index of this move. */
    public get_columnIndex(): number{
        return this.columnIndex;
    }
}