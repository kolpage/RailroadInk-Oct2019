import { TileType, TilePlacementResult } from "../Enums";
import { MoveDTO } from "./MoveDTO";

export class InvalidMoveResponseDTO{
    /**
     * The index of the move as it was passed to the back end of the game.
     */
    public MoveIndex: number;
    public Move: MoveDTO;
    public InvalidReason: TilePlacementResult;

    constructor(moveIndex: number, move: MoveDTO, invalidReason: TilePlacementResult){
        this.MoveIndex = moveIndex;
        this.Move = move;
        this.InvalidReason = invalidReason;
    };
}