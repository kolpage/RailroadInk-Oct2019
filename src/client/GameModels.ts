import { TileType, Orientation } from '../common/Enums';

export interface IGameTile {
    Type: TileType;
    TileOrientation: Orientation;
    TurnPlayed?: number; // TODO: Currently using null to indicate the tile hasn't been played...maybe not needed

    RotateTile: () => void;
    IsTileEmpty: () => boolean;
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

//<summary>Represents a turn in the game</summary>
export class GameTurn {
    TurnNumber: number;
    RolledDice: GameDice[];
    SelectedDice: GameDice;
    Board: GameBoard;
}

export class TurnMoves {
    private moves: Move[] = [];

    public AddMove(move: Move) {
        this.moves.push(move);
    }

    public RemoveMove(moveToRemove: Move) {
        this.moves.forEach( (move, index) => {
            if (move.IsMoveAtSamePosition(moveToRemove)) {
                this.moves.splice(index, 1);
            }
        });
    }

    public UpdateMove(updatedMove: Move) {
        this.RemoveMove(updatedMove);
        this.AddMove(updatedMove);
    }

    //TODO: Remove debug code
    public PrintMoves() {
        this.moves.forEach((move) =>{
            console.log(move.TilePlayed.Type.toString());
        });
    }
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

    public IsMoveAtSamePosition(move: Move) {
        return (this.RowPosition === move.RowPosition) && (this.ColumnPosition === move.ColumnPosition);
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