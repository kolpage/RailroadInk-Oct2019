import { InvalidMoveResponseDTO } from "./InvalidMoveResponseDTO";
import { TurnInvalidReason, TileType } from "../Enums";

/** Represents a response from the game engine to an attempt at making a move. */
export class TurnResponseDTO{
    public InvalidMoves: InvalidMoveResponseDTO[];
    public InvalidTurnReasons: TurnInvalidReason[];
    public get WasMoveSuccessful(): boolean{
        return this.InvalidMoves.length == 0 
            && this.InvalidTurnReasons.length == 0;
    }

    constructor(invalidMoves: InvalidMoveResponseDTO[] = [], invalidTurnReasons: TurnInvalidReason[] = [], nextTurnDice: TileType[] = []){
        this.InvalidMoves = invalidMoves;
        this.InvalidTurnReasons = invalidTurnReasons;
    }
}