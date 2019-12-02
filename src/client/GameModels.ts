import { TileType, Orientation } from '../common/Enums';

export interface IGameTile {
    Type: TileType;
    TileOrientation: Orientation;
    TurnPlayed?: number; // TODO: Currently using null to indicate the tile hasn't been played...maybe not needed

    RotateTile: () => void;
    IsTileEmpty: () => boolean;
}

//<summary>Represents a turn in the game</summary>
export interface IGameTurn {
    Moves: Move[];
    TurnNumber: number;
    RolledDice: GameDice[];
    SelectedDice: GameDice;
    Board: GameBoard;
}

export class Move {
    TilePlayed: IGameTile;
    RowPosition: number;
    ColumnPosition: number;

    constructor(tilePlayed: IGameTile, tileColumnPosition: number, tileRowPosition: number) {
        this.TilePlayed = tilePlayed;
        this.ColumnPosition = tileColumnPosition;
        this.RowPosition = tileRowPosition;
    }
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

    public GetTileType() {
        return this.Tile.Type;
    }

    public IsEmpty() {
        return this.Tile.IsTileEmpty();
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

    public AddMove(move: Move) {
        this.PlayTile(move.TilePlayed, move.ColumnPosition, move.RowPosition);
    }

    public RemoveMove(move: Move) {
        this.clearTile(move.ColumnPosition, move.RowPosition);
    }

    public PlayTile(gameTile: IGameTile, col: number, row: number) {
        if (!gameTile.IsTileEmpty()) {
            this.setTile(gameTile, col, row);
        }
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