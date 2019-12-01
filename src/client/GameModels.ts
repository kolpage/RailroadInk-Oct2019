import { TileType, Orientation } from '../common/Enums';

export interface IGameTile {
    Type: TileType;
    TileOrientation: Orientation;
    TurnPlayed?: number; // TODO: Currently using null to indicate the tile hasn't been played...maybe not needed

    RotateTile: () => void;
    IsTileEmpty: () => boolean;
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

            // TODO: Find a better way to handle mirror tiles
            if (this.Type == TileType.StationTurn) {
                this.Type = TileType.StationTurnMirror
            } else if (this.Type == TileType.StationTurnMirror) {
              this.Type = TileType.StationTurn  
            }
        }
        this.TileOrientation = newOrientation;
    }

    public IsTileEmpty() {
        return this.Type == TileType.Empty;
    }
}

export class GameDice {
    static idCounter: number = 0; //TODO: Gross static code...

    public Played: boolean;
    public Tile: IGameTile;
    public Id: number; //TODO: This probably shouldn't be a public member

    constructor(tile: IGameTile = new GameTile(TileType.Empty)) {
        this.Tile = tile;
        this.Played = false;
        this.Id = GameDice.idCounter++;
    }
}

export class GameBoard {
    public readonly numberOfColumns: number;
    public readonly numberOrRows: number;
    
    private board: IGameTile[][];

    public constructor(numberOfColumns: number, numberOfRows: number) {
        this.numberOfColumns = numberOfColumns;
        this.numberOrRows = numberOfRows;

        this.createEmptyBoard();
    }

    public getTile(col: number, row: number) {
        if (col < this.numberOfColumns || row < this.numberOrRows) {
            return this.board[col][row];
        }
    }

    public setTile(tile: GameTile, col: number, row: number) {
        if (col < this.numberOfColumns || row < this.numberOrRows) {
            this.board[col][row] = tile;
        }
    }

    public clearTile(col: number, row: number) {
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