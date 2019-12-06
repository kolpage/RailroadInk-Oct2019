import { GameDice } from "./GameDice";
import { IGameTile } from "./GameTile";
import { GameBoard } from "./GameBoard";

// import update from 'react-addons-update';
import update from 'immutability-helper';

//<summary>Represents a turn in the game</summary>
export class GameTurn {
    TurnNumber: number;
    RolledDice: GameDice[];
    SelectedDice: GameDice;
    Board: GameBoard;
}

export class TurnMoves {
    private moves: Move[] = [];

    public GetMoves() {
        return this.moves;
    }

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