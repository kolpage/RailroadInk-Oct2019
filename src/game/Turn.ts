import { TileType } from "../common/Enums";
import { Move } from "./Move";
import { PlayableBaseTile } from "./tiles";
import { Board } from "./Board";

export interface IPlayableDice{
    tileType: TileType,
    required: boolean,
    played: boolean
}

/** Object representing the state of a single turn */
export class BaseTurn{
    private diceToPlay: IPlayableDice[];
    private playedTiles: Move[];
    private turnNumber: number;
    private board: Board;

    constructor(turnNumber: number, rolledDice: TileType[], board: Board){
        this.turnNumber = turnNumber;
        this.board = board;
        this.diceToPlay = [];
        this.playedTiles = [];
        for(const rolledDie of rolledDice){
            this.diceToPlay.push({
                tileType: rolledDie,
                required: true,
                played: false
            });
        }
    }

    /** Makes the requested move. True if move was successful. False otherwise */
    public Move(
        tileType: TileType, 
        playedTile: PlayableBaseTile, 
        rowIndex: number, 
        columnIndex: number
    ): boolean{

        const wasTileSet = this.board.SetTile(playedTile, rowIndex, columnIndex, false);
        if(wasTileSet){
            this.playedTiles.push(new Move(playedTile, rowIndex, columnIndex));
            const die = this.diceToPlay.find(die => die.tileType === tileType && !die.played);
            if(die){
                die.played = true;
            }
        }
        return wasTileSet;
    }

    /** Gets all the dice rolled for this turn. */
    public getRolledDice(): TileType[]{
        return this.diceToPlay.map(die => die.tileType);
    }

    /** Gets all the dice that can still be played this turn. */
    public getAvailableDiceToPlay(): TileType[]{
        return this.diceToPlay.filter(die => !die.played).map((die => die.tileType));
    }

    /** Gets all the dice that must be played this turn. */
    public getRequiredDiceToPlay(): TileType[]{
        return this.diceToPlay.filter(die => !die.played && die.required).map(die => die.tileType);
    }

    /** True if the player can end their turn. */
    public CanTurnBeDone(): boolean{
        return this.getRequiredDiceToPlay().length > 0;
    }
}