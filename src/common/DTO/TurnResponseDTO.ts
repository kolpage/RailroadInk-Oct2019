import { InvalidMoveResponseDTO } from "./InvalidMoveResponseDTO";
import { TurnInvalidReason, TileType } from "../Enums";

/** Represents a response from the game engine to an attempt at making a move. */
export class TurnResponseDTO{
    public NumberOfTurns: number;
    public InvalidMoves: InvalidMoveResponseDTO[];
    public InvalidTurnReasons: TurnInvalidReason[];
    public NextTurnDice: TileType[];
    public TurnNumber: number;
    public WasMoveSuccessful: boolean;
    public IsGameOver: boolean;

    constructor(turnsInGame: number,
        turnNumber: number, 
        invalidMoves: InvalidMoveResponseDTO[] = [], 
        invalidTurnReasons: TurnInvalidReason[] = [], 
        nextTurnDice: TileType[] = [], 
        isGameOver: boolean = false){
        this.NumberOfTurns = turnsInGame;
        this.TurnNumber = turnNumber;
        this.InvalidMoves = invalidMoves;
        this.InvalidTurnReasons = invalidTurnReasons;
        this.NextTurnDice = nextTurnDice;
        this.WasMoveSuccessful = this.InvalidMoves.length === 0 && this.InvalidTurnReasons.length == 0;
        this.IsGameOver = isGameOver;
    }
}