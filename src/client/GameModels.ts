import { TileType, Orientation } from '../common/Enums';

export interface IGameTile {
    Type: TileType;
    TileOrientation: Orientation;
    TurnPlayed?: number; // TODO: Currently using null to indicate the tile hasn't been played...maybe not needed

    RotateTile: () => void;
}

//<summary>Represents a turn in the game</summary>
export class GameTurn {
    tilesPlaued: IGameTile[];
    
}

export class GameTile implements IGameTile {
    public Type: TileType;
    public TileOrientation: Orientation;
    public TurnPlayed?: number;

    constructor(type: TileType = TileType.Empty, orientation: Orientation = Orientation.up, turnPlayed: number = null) {
        this.Type = type;
        this.TileOrientation = orientation;
        this.TurnPlayed = turnPlayed;
    }

    public RotateTile() {
        let newOrientation = this.TileOrientation + 1;
        if(newOrientation >= Orientation._length) {
            newOrientation = 0;
        }
        this.TileOrientation = newOrientation;
    }
}

export class GameBoard {
    private numberOfColumns: number;
    private numberOrFows: number;
    
    private board: IGameTile[][];

    public constructor(numberOfColumns: number, numberOfRows: number) {
        this.numberOfColumns = numberOfColumns;
        this.numberOrFows = numberOfRows;

        this.createEmptyBoard();
    }

    public getTile(col: number, row: number) {
        if (col < this.numberOfColumns || row < this.numberOrFows) {
            return this.board[col][row];
        }
    }

    public setTile(tile: GameTile, col: number, row: number) {
        if (col < this.numberOfColumns || row < this.numberOrFows) {
            this.board[col][row] = tile;
        }
    }

    private createEmptyBoard() {
        this.board = [];
        for(var currCol = 0; currCol < this.numberOfColumns; currCol++) {
            this.board[currCol] = [];
            for(var currRow = 0; currRow < this.numberOrFows; currRow++) {
                this.board[currCol][currRow] = new GameTile();
            }
        }
    }
}