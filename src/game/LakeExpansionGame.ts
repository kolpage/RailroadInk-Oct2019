import { LakeExpansionDicePool } from "./DicePool";
import { BaseGame } from "./BaseGame";
import { LakeExpansionScoreCalculator } from "./LakeExpansionScoreCalculator";
import { MoveDTO } from "../common/DTO/MoveDTO";
import { PlayableBaseTile, LakeExpansionTile } from "./tiles";
import { TilePlacementResult, Edge, Orientation, TileType } from "../common/Enums";
import { ITileLocation } from "./Board";
import { BaseTurn } from "./Turn";

export class LakeExpansionGame extends BaseGame{
    private static NumberOfTurns = 6;
    private static BoardWidth = 7;
    private static BoardHeight = 7;

    constructor(seed?: string){
        super(
            LakeExpansionGame.NumberOfTurns, 
            new LakeExpansionDicePool(seed), 
            new LakeExpansionScoreCalculator(),
            LakeExpansionGame.BoardWidth, 
            LakeExpansionGame.BoardHeight
        );
    }

    protected afterMoveAction(moves: MoveDTO[], currentMoveIndex: number, tile: PlayableBaseTile, tilePlacementResult: TilePlacementResult): void{
        if(tilePlacementResult !== TilePlacementResult.valid){
            return;
        }
        const move = moves[currentMoveIndex];
        if(tile instanceof LakeExpansionTile){
            if(tile.GetTopEdge() === Edge.lake){
                const aboveTile = this.board.GetTileAbove(tile);
                if(aboveTile === undefined){
                    const potentialFloodLocation: ITileLocation = {
                        row: move.RowIndex - 1,
                        column: move.ColumnIndex
                    };
                    const shouldFlood = this.checkForFlood(potentialFloodLocation);
                    if(shouldFlood){
                        this.floodTile(potentialFloodLocation, moves, currentMoveIndex);
                    }
                }
            }

            if(tile.GetRightEdge() === Edge.lake){
                const rightTile = this.board.GetTileRight(tile);
                if(rightTile === undefined){
                    const potentialFloodLocation: ITileLocation = {
                        row: move.RowIndex,
                        column: move.ColumnIndex + 1
                    };
                    const shouldFlood = this.checkForFlood(potentialFloodLocation);
                    if(shouldFlood){
                        this.floodTile(potentialFloodLocation, moves, currentMoveIndex);
                    }
                }
            }

            if(tile.GetBottomEdge() === Edge.lake){
                const bottomTile = this.board.GetTileBelow(tile);
                if(bottomTile === undefined){
                    const potentialFloodLocation: ITileLocation = {
                        row: move.RowIndex + 1,
                        column: move.ColumnIndex
                    };
                    const shouldFlood = this.checkForFlood(potentialFloodLocation);
                    if(shouldFlood){
                        this.floodTile(potentialFloodLocation, moves, currentMoveIndex);
                    }
                }
            }

            if(tile.GetLeftEdge() === Edge.lake){
                const leftTile = this.board.GetTileLeft(tile);
                if(leftTile === undefined){
                    const potentialFloodLocation: ITileLocation = {
                        row: move.RowIndex - 1,
                        column: move.ColumnIndex
                    };
                    const shouldFlood = this.checkForFlood(potentialFloodLocation);
                    if(shouldFlood){
                        this.floodTile(potentialFloodLocation, moves, currentMoveIndex);
                    }
                }
            }
        }
    }

    private floodTile(location: ITileLocation, moves: MoveDTO[], currentMoveIndex: number): void{
        const floodMove = new MoveDTO(TileType.LakeFull, Orientation.up, location.row, location.column);
        moves.splice(currentMoveIndex, 0, floodMove);
    }

    private checkForFlood(location: ITileLocation): boolean{
        let numberOfLakeSides = 0;
        const aboveTile = this.board.GetTileAbove(location.row, location.column);
        if(aboveTile !== undefined){
            const bottomEdge = aboveTile.GetBottomEdge();
            if(bottomEdge === Edge.lake){
                numberOfLakeSides++;
            }
            else if(this.doesEdgePreventFlood(bottomEdge)){
                return false;
            }
        }
        const rightTile = this.board.GetTileRight(location.row, location.column);
        if(rightTile !== undefined){
            const leftEdge = rightTile.GetLeftEdge();
            if(leftEdge === Edge.lake){
                numberOfLakeSides++;
            }
            else if(this.doesEdgePreventFlood(leftEdge)){
                return false;
            }
        }
        const bottomTile = this.board.GetTileBelow(location.row, location.column);
        if(bottomTile !== undefined){
            const topEdge = bottomTile.GetTopEdge();
            if(topEdge === Edge.lake){
                numberOfLakeSides++;
            }
            else if(this.doesEdgePreventFlood(topEdge)){
                return false;
            }
        }
        const leftTile = this.board.GetTileLeft(location.row, location.column);
        if(leftTile !== undefined){
            const rightEdge = leftTile.GetRightEdge();
            if(rightEdge === Edge.lake){
                numberOfLakeSides++;
            }
            else if(this.doesEdgePreventFlood(rightEdge)){
                return false;
            }
        }
        if(numberOfLakeSides > 2){
            return true;
        }
        return false;        
    }

    private doesEdgePreventFlood(edge: Edge){
        return (edge === Edge.road || edge === Edge.exitRoad || edge === Edge.rail || edge === Edge.exitRail);
    }
}