import { TileType, Orientation } from "../Enums";

/**
 * Represents 1 tile placement on the board.
 */
export class MoveDTO{
    public Tile: TileType;
    public Orientation: Orientation;
    public RowIndex: number;
    public ColumnIndex: number;

    constructor(tile: TileType, orientation: Orientation, rowIndex: number, columnIndex: number){
        this.Tile = tile;
        this.Orientation = orientation;
        this.RowIndex = rowIndex;
        this.ColumnIndex = columnIndex;
    }
}