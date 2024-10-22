import { GameDice } from "./GameDice";
import { IGameTile, GameTile } from "./GameTile";

import update from 'immutability-helper';
import { TilePlacementResult } from "../../common/Enums";
import { ScoreDTO } from "../../common/DTO/ScoreDTO";

//<summary>Represents a turn in the game</summary>
export class GameTurn {
    TurnNumber: number;
    RolledDice: GameDice[] = [];
    SelectedDice: GameDice;
    Moves: TurnMoves = new TurnMoves();
    TotalTurns: number;
    IsGameOver: boolean;
    Score: ScoreDTO;
}

export class TurnMoves {
    private moves: Move[] = [];

    public GetMoves() {
        return this.moves;
    }

    public GetMoveAtPosition(column: number, row: number){
        // TODO: Don't return undefinded if there is no move
        return this.moves.find(move => move.ColumnPosition === column && move.RowPosition === row);
    }

    public ContainsMoveAtPosition(column: number, row: number){
        return this.GetMoveAtPosition(column, row) !== undefined;
    }

    public AddMove(move: Move) {
        this.moves.push(move);
    }

    public AddMoves(moves: Move[]){
        moves.forEach(this.AddMove.bind(this));
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

    public ClearInvalidMoves(){
        this.moves.forEach(move => move.ClearMoveStatus());
    }
}

export class Move {
    TilePlayed: IGameTile;
    RowPosition: number;
    ColumnPosition: number;
    // TODO: Move this into tile
    Status: TilePlacementResult;

    constructor(tilePlayed: IGameTile, tileColumnPosition: number, tileRowPosition: number, status: TilePlacementResult = TilePlacementResult.valid) {
        this.TilePlayed = tilePlayed;
        this.ColumnPosition = tileColumnPosition;
        this.RowPosition = tileRowPosition;
        this.Status = status;
    }

    public ClearMoveStatus(){
        this.SetMoveStatus(TilePlacementResult.valid);
    }

    public SetMoveStatus(status: TilePlacementResult){
        this.Status = status;
    }

    public IsMoveAtSamePosition(move: Move) {
        return (this.RowPosition === move.RowPosition) && (this.ColumnPosition === move.ColumnPosition);
    }

    public PlayDice(gameDice: GameDice) {
        this.TilePlayed.TransferTile(gameDice.Tile);
    }

    public IsValid(){
        return this.Status === TilePlacementResult.valid;
    }
}

export function CreateMoveFromJSON(moveJSON: any): Move{
    // TODO: This is an unsafe conversion. More null checking should be done
    const tilePlayedJSON = moveJSON.TilePlayed;
    const moveTile = new GameTile(tilePlayedJSON.Type, tilePlayedJSON.TileOrientation, tilePlayedJSON.TurnPlayed);
    return new Move(moveTile, moveJSON.ColumnPosition, moveJSON.RowPosition);
}