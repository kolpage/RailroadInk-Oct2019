import { DebugDicePool } from "../game/DicePool";
import { BaseGame } from "../game/BaseGame";
import { MoveDTO } from "../common/DTO/MoveDTO";
import { TurnResponseDTO } from "../common/DTO/TurnResponseDTO";
import { TileType, Orientation, TurnInvalidReason, TilePlacementResult } from "../common/Enums";
import { StandardGame } from "../game/StandardGame";
import { BaseScoreCalculator } from "../game/BaseScoreCalculator";

class StandardGameTestHelper{
    private static setupDebugDicePoolForGame1(): DebugDicePool{
        const roll1 = [TileType.RoadStraight, TileType.RoadThreeWay, TileType.RailThreeWay, TileType.Overpass];
        const roll2 = [TileType.RoadStraight, TileType.RoadTurn, TileType.RoadTurn, TileType.Overpass];
        const roll3 = [TileType.RoadThreeWay, TileType.RailThreeWay, TileType.RailStraight, TileType.StationTurn];
        const roll4 = [TileType.RailStraight, TileType.RailStraight, TileType.RailStraight, TileType.StationStraight];
        const roll5 = [TileType.RoadTurn, TileType.RailThreeWay, TileType.RailTurn, TileType.StationStraight];
        const roll6 = [TileType.RailThreeWay, TileType.RoadThreeWay, TileType.RoadStraight, TileType.StationStraight];
        const roll7 = [TileType.RailStraight, TileType.RoadThreeWay, TileType.RailStraight, TileType.StationStraight];
        const diceRolls = [roll1, roll2, roll3, roll4, roll5, roll6, roll7];
        return new DebugDicePool(diceRolls);
    }

    private static setupDebugDicePoolForGame2(): DebugDicePool{
        const roll1 = [TileType.RoadTurn, TileType.RoadStraight, TileType.RailTurn, TileType.Overpass];
        const roll2 = [TileType.RoadStraight, TileType.RoadTurn, TileType.RailTurn, TileType.Overpass];
        const roll3 = [TileType.RoadThreeWay, TileType.RoadThreeWay, TileType.RailStraight, TileType.Overpass];
        const roll4 = [TileType.RoadStraight, TileType.RoadTurn, TileType.RoadTurn, TileType.StationStraight];
        const roll5 = [TileType.RailStraight, TileType.RailThreeWay, TileType.RailThreeWay, TileType.Overpass];
        const roll6 = [TileType.RoadTurn, TileType.RailStraight, TileType.RailStraight, TileType.StationTurn];
        const roll7 = [TileType.RailThreeWay, TileType.RoadStraight, TileType.RailThreeWay, TileType.Overpass];
        const diceRolls = [roll1, roll2, roll3, roll4, roll5, roll6, roll7];
        return new DebugDicePool(diceRolls);
    }

    public static CreateTestGame1(): BaseGame{
        return new BaseGame(7, this.setupDebugDicePoolForGame1(), new BaseScoreCalculator(), 7, 7);
    }

    public static CreateTestGame2(): BaseGame{
        return new BaseGame(7, this.setupDebugDicePoolForGame2(), new BaseScoreCalculator(), 7, 7);
    }
}

export class StandardGameTests{
    
    /**
     * Full standard game. No errors. Scores 49 pts.
     * Stations: 1 network of 9. 32 pts.
     * Longest Road: 8 long. 8pts.
     * Longest Rail: 6 long. 6pts.
     * Center Squares: 6 squares. 6pts.
     * Errors: 3 errors. -3 pts.
     * Expansion: N/A
     * Total Score: 49pts.
     */
    public ValidFullGame_ShouldScore49_NoValidationErrorsShouldOccur(){
        const game = StandardGameTestHelper.CreateTestGame1();
        const board = game.GetBoard();
        const move1 = game.MakeMove(
            [
                new MoveDTO(TileType.RoadStraight, Orientation.up, 0, 5),
                new MoveDTO(TileType.Overpass, Orientation.up, 1, 5),
                new MoveDTO(TileType.RailThreeWay, Orientation.down, 1, 6),
                new MoveDTO(TileType.RoadThreeWay, Orientation.right, 2, 5),
                new MoveDTO(TileType.SpecialRoadRailAdjacent, Orientation.left, 2, 6)
            ]
            );
            if(!move1.WasMoveSuccessful){
                return false;
            }
            const move2 = game.MakeMove(
                [
                    new MoveDTO(TileType.RoadTurn, Orientation.right, 3, 6),
                    new MoveDTO(TileType.RoadTurn, Orientation.up, 3, 5),
                    new MoveDTO(TileType.RoadStraight, Orientation.up, 0, 4),
                    new MoveDTO(TileType.Overpass, Orientation.up, 1, 4)
                ]
                );
                if(!move2.WasMoveSuccessful){
                    return false;
                }
                const move3 = game.MakeMove(
                    [
                        new MoveDTO(TileType.RailStraight, Orientation.up, 0, 3),
                        new MoveDTO(TileType.RailThreeWay, Orientation.right, 1, 3),
                        new MoveDTO(TileType.RoadThreeWay, Orientation.right, 3, 4),
                        new MoveDTO(TileType.StationTurn, Orientation.up, 2, 3)
                    ]
                    );
                    if(!move3.WasMoveSuccessful){
                        return false;
                    }
                    const move4 = game.MakeMove(
                        [
                            new MoveDTO(TileType.RailStraight, Orientation.right, 5, 6),
                            new MoveDTO(TileType.RailStraight, Orientation.right, 5, 5),
                            new MoveDTO(TileType.RailStraight, Orientation.up, 6, 3),
                            new MoveDTO(TileType.StationStraight, Orientation.down, 4, 4),
                            new MoveDTO(TileType.SpecialThreeRailOneRoad, Orientation.down, 5, 4)
                        ]
                        );
                        if(!move4.WasMoveSuccessful){
                            return false;
                        }
                        const move5 = game.MakeMove(
                            [
                                new MoveDTO(TileType.RoadTurn, Orientation.left, 6, 5),
                                new MoveDTO(TileType.RailThreeWay, Orientation.down, 5, 3),
                                new MoveDTO(TileType.RailTurn, Orientation.right, 5, 2),
                                new MoveDTO(TileType.StationStraight, Orientation.down, 4, 2)
                            ]
                            );
                            if(!move5.WasMoveSuccessful){
                                return false;
                            }
                            const move6 = game.MakeMove(
                                [
                new MoveDTO(TileType.StationStraight, Orientation.down, 0, 1),
                new MoveDTO(TileType.RailThreeWay, Orientation.left, 1, 1),
                new MoveDTO(TileType.RoadThreeWay, Orientation.down, 2, 2),
                new MoveDTO(TileType.RoadStraight, Orientation.up, 2, 4)
            ]
            );
            if(!move6.WasMoveSuccessful){
                return false;
            }
            const move7 = game.MakeMove(
                [
                    new MoveDTO(TileType.RailStraight, Orientation.right, 1, 0),
                    new MoveDTO(TileType.SpecialRoadRailAcross, Orientation.right, 2, 1),
                    new MoveDTO(TileType.StationStraight, Orientation.left, 2, 0),
                    new MoveDTO(TileType.RailStraight, Orientation.up, 3, 1),
                    new MoveDTO(TileType.RoadThreeWay, Orientation.right, 6, 4)
                ]
                );
                if(!move7.WasMoveSuccessful){
                    return false;
                }
                
                const scorer = new BaseScoreCalculator();
                scorer.ScoreBoard(board);
                const score = scorer.GetScore();
                if(score !== undefined){
                    if(score.ExitScore !== 32){
                        return false;
                    }
                    if(score.CenterSquareScore !== 6){
                        return false;
                    }
                    if(score.ErrorScore !== -3){
                        console.log("Error score calculated to be: " + score.ErrorScore);
                        return false;
                    }
                    if(score.LongestRoadScore !== 8){
                        return false;
                    }
                    if(score.LongestRailScore !== 6){
                        return false;
                    }
                }
                
                return true;
            }
            
    public ValidFullGame2_ShouldScore50__NoValidationErrorsShouldOccur(){
        const game = StandardGameTestHelper.CreateTestGame2();
        const board = game.GetBoard();
        const move1 = game.MakeMove(
        [
            new MoveDTO(TileType.RoadTurn, Orientation.up, 0, 5),
            new MoveDTO(TileType.RoadStraight, Orientation.right, 0, 4),
            new MoveDTO(TileType.Overpass, Orientation.right, 0, 3),
            new MoveDTO(TileType.RailTurn, Orientation.down, 1, 6)
        ]
        );
        if(!move1.WasMoveSuccessful){
            return false;
        }
        const move2 = game.MakeMove(
        [
            new MoveDTO(TileType.RoadStraight, Orientation.right, 0, 2),
            new MoveDTO(TileType.RailTurn, Orientation.down, 0, 0),
            new MoveDTO(TileType.RoadTurn, Orientation.right, 1, 1),
            new MoveDTO(TileType.Overpass, Orientation.right, 3, 6),
            new MoveDTO(TileType.SpecialThreeRoadOneRail, Orientation.right, 0, 1)
        ]
        );
        if(!move2.WasMoveSuccessful){
            return false;
        }
        const move3 = game.MakeMove(
        [
            new MoveDTO(TileType.RoadThreeWay, Orientation.down, 1, 2),
            new MoveDTO(TileType.Overpass, Orientation.right, 1, 3),
            new MoveDTO(TileType.RailStraight, Orientation.up, 2, 6),
            new MoveDTO(TileType.RoadThreeWay, Orientation.up, 3, 5)
        ]
        );
        if(!move3.WasMoveSuccessful){
            return false;
        }
        const move4 = game.MakeMove(
        [
            new MoveDTO(TileType.RoadStraight, Orientation.right, 1, 4),
            new MoveDTO(TileType.RoadTurn, Orientation.left, 1, 5),
            new MoveDTO(TileType.RoadTurn, Orientation.right, 3, 3),
            new MoveDTO(TileType.StationStraight, Orientation.up, 2, 3)
        ]
        );
        if(!move4.WasMoveSuccessful){
            return false;
        }
        const move5 = game.MakeMove(
        [
            new MoveDTO(TileType.RailThreeWay, Orientation.left, 1, 0),
            new MoveDTO(TileType.RailStraight, Orientation.up, 2, 0),
            new MoveDTO(TileType.RailThreeWay, Orientation.left, 5, 0),
            new MoveDTO(TileType.Overpass, Orientation.up, 6, 1),
            new MoveDTO(TileType.SpecialRoadRailAcross, Orientation.right, 3, 0)
        ]
        );
        if(!move5.WasMoveSuccessful){
            return false;
        }
        const move6 = game.MakeMove(
        [
            new MoveDTO(TileType.RailStraight, Orientation.up, 4, 0),
            new MoveDTO(TileType.RailStraight, Orientation.up, 4, 6),
            new MoveDTO(TileType.RoadTurn, Orientation.down, 5, 1),
            new MoveDTO(TileType.StationTurn, Orientation.left, 6, 2)
        ]
        );
        if(!move6.WasMoveSuccessful){
            return false;
        }
        const move7 = game.MakeMove(
        [
            new MoveDTO(TileType.RoadStraight, Orientation.up, 2, 5),
            new MoveDTO(TileType.Overpass, Orientation.right, 3, 4),
            new MoveDTO(TileType.RailThreeWay, Orientation.up, 5, 6),
            new MoveDTO(TileType.RailThreeWay, Orientation.right, 6, 0)
        ]
        );
        if(!move7.WasMoveSuccessful){
            return false;
        }
        
        const scorer = new BaseScoreCalculator();
        scorer.ScoreBoard(board);
        const score = scorer.GetScore();
        if(score !== undefined){
            if(score.ExitScore !== 28){
                return false;
            }
            if(score.CenterSquareScore !== 3){
                return false;
            }
            if(score.ErrorScore !== -6){
                console.log("Error score calculated to be: " + score.ErrorScore);
                return false;
            }
            if(score.LongestRoadScore !== 15){
                return false;
            }
            if(score.LongestRailScore !== 10){
                return false;
            }
        }
        
        return true;
    }
            
    public InvalidGame_NotPlayingAllRequiredTiles(){
        const game = StandardGameTestHelper.CreateTestGame1();
        const move1 = game.MakeMove(
            [
                new MoveDTO(TileType.Overpass, Orientation.up, 1, 5),
                new MoveDTO(TileType.RailThreeWay, Orientation.down, 1, 6),
                new MoveDTO(TileType.RoadThreeWay, Orientation.right, 2, 5),
                new MoveDTO(TileType.SpecialRoadRailAdjacent, Orientation.left, 2, 6)
            ]
        );
        
        if(move1.InvalidMoves.length === 0 
            && move1.InvalidTurnReasons.length === 1
            && move1.InvalidTurnReasons[0] === TurnInvalidReason.requiredDiceNotPlayed){
                return true;
            }
        return false;
    }

    public InvalidGame_PlayingTooManyTurns(){
        const game = StandardGameTestHelper.CreateTestGame1();
        const move1 = game.MakeMove(
            [
                new MoveDTO(TileType.RoadStraight, Orientation.up, 0, 5),
                new MoveDTO(TileType.Overpass, Orientation.up, 1, 5),
                new MoveDTO(TileType.RailThreeWay, Orientation.down, 1, 6),
                new MoveDTO(TileType.RoadThreeWay, Orientation.right, 2, 5),
                new MoveDTO(TileType.SpecialRoadRailAdjacent, Orientation.left, 2, 6)
            ]
        );
        if(!move1.WasMoveSuccessful){
            return false;
        }
        const move2 = game.MakeMove(
            [
                new MoveDTO(TileType.RoadTurn, Orientation.right, 3, 6),
                new MoveDTO(TileType.RoadTurn, Orientation.up, 3, 5),
                new MoveDTO(TileType.RoadStraight, Orientation.up, 0, 4),
                new MoveDTO(TileType.Overpass, Orientation.up, 1, 4)
            ]
        );
        if(!move2.WasMoveSuccessful){
            return false;
        }
        const move3 = game.MakeMove(
            [
                new MoveDTO(TileType.RailStraight, Orientation.up, 0, 3),
                new MoveDTO(TileType.RailThreeWay, Orientation.right, 1, 3),
                new MoveDTO(TileType.RoadThreeWay, Orientation.right, 3, 4),
                new MoveDTO(TileType.StationTurn, Orientation.up, 2, 3)
            ]
        );
        if(!move3.WasMoveSuccessful){
            return false;
        }
        const move4 = game.MakeMove(
            [
                new MoveDTO(TileType.RailStraight, Orientation.right, 5, 6),
                new MoveDTO(TileType.RailStraight, Orientation.right, 5, 5),
                new MoveDTO(TileType.RailStraight, Orientation.up, 6, 3),
                new MoveDTO(TileType.StationStraight, Orientation.down, 4, 4),
                new MoveDTO(TileType.SpecialThreeRailOneRoad, Orientation.down, 5, 4)
            ]
        );
        if(!move4.WasMoveSuccessful){
            return false;
        }
        const move5 = game.MakeMove(
            [
                new MoveDTO(TileType.RoadTurn, Orientation.left, 6, 5),
                new MoveDTO(TileType.RailThreeWay, Orientation.down, 5, 3),
                new MoveDTO(TileType.RailTurn, Orientation.right, 5, 2),
                new MoveDTO(TileType.StationStraight, Orientation.down, 4, 2)
            ]
        );
        if(!move5.WasMoveSuccessful){
            return false;
        }
        const move6 = game.MakeMove(
            [
                new MoveDTO(TileType.StationStraight, Orientation.down, 0, 1),
                new MoveDTO(TileType.RailThreeWay, Orientation.left, 1, 1),
                new MoveDTO(TileType.RoadThreeWay, Orientation.down, 2, 2),
                new MoveDTO(TileType.RoadStraight, Orientation.up, 2, 4)
            ]
        );
        if(!move6.WasMoveSuccessful){
            return false;
        }
        const move7 = game.MakeMove(
            [
                new MoveDTO(TileType.RailStraight, Orientation.right, 1, 0),
                new MoveDTO(TileType.SpecialRoadRailAcross, Orientation.right, 2, 1),
                new MoveDTO(TileType.StationStraight, Orientation.left, 2, 0),
                new MoveDTO(TileType.RailStraight, Orientation.up, 3, 1),
                new MoveDTO(TileType.RoadThreeWay, Orientation.right, 6, 4)
            ]
        );
        if(!move7.WasMoveSuccessful){
            return false;
        }
        const move8 = game.MakeMove(
            [
                new MoveDTO(TileType.RailStraight, Orientation.right, 1, 0),
                new MoveDTO(TileType.SpecialRoadRailAcross, Orientation.right, 2, 1),
                new MoveDTO(TileType.StationStraight, Orientation.left, 2, 0),
                new MoveDTO(TileType.RailStraight, Orientation.up, 3, 1),
                new MoveDTO(TileType.RoadThreeWay, Orientation.right, 6, 4)
            ]
        );
        if(move8.InvalidMoves.length === 0
            && move8.InvalidTurnReasons.length === 1
            && move8.InvalidTurnReasons[0] === TurnInvalidReason.noActiveTurns
        ){
                return true;
        }
        return false;
    }

    public InvalidGame_TilesNotConnected(){
        const game = StandardGameTestHelper.CreateTestGame1();
        const move1 = game.MakeMove(
            [
                new MoveDTO(TileType.RoadStraight, Orientation.up, 0, 5),
                new MoveDTO(TileType.Overpass, Orientation.up, 1, 5),
                new MoveDTO(TileType.RailThreeWay, Orientation.down, 1, 6),
                new MoveDTO(TileType.RoadThreeWay, Orientation.right, 2, 5),
                new MoveDTO(TileType.SpecialRoadRailAdjacent, Orientation.left, 0, 0)
            ]
        );
                
        if(move1.InvalidTurnReasons.length === 1
            && move1.InvalidTurnReasons[0] === TurnInvalidReason.tilesMustBeConnectedToExistingTiles
            && move1.InvalidMoves.length > 0
        ){
            return true;
        }
        return false;
    }

    public InvalidGame_TilesNotConnected_AfterSubsequentPlay(){
        const game = StandardGameTestHelper.CreateTestGame1();
        const move1 = game.MakeMove(
            [
                new MoveDTO(TileType.RoadStraight, Orientation.up, 0, 5),
                new MoveDTO(TileType.Overpass, Orientation.up, 1, 5),
                new MoveDTO(TileType.RailThreeWay, Orientation.down, 1, 6),
                new MoveDTO(TileType.RoadThreeWay, Orientation.right, 2, 5),
                new MoveDTO(TileType.SpecialRoadRailAdjacent, Orientation.left, 2, 6)
            ]
        );
        if(!move1.WasMoveSuccessful){
            return false;
        }
        const move2 = game.MakeMove(
            [
                new MoveDTO(TileType.RoadTurn, Orientation.right, 3, 6),
                new MoveDTO(TileType.RoadTurn, Orientation.up, 3, 5),
                new MoveDTO(TileType.RoadStraight, Orientation.up, 0, 4),
                new MoveDTO(TileType.Overpass, Orientation.up, 0, 0)
            ]
        );
        
        if(move2.InvalidTurnReasons.length === 1
            && move2.InvalidTurnReasons[0] === TurnInvalidReason.tilesMustBeConnectedToExistingTiles
            && move2.InvalidMoves.length > 0
        ){
            return true;
        }
        return false;
    }

    public InvalidGame_InvalidMove_TileNotAvailable_TileNotRolled(){
        const game = StandardGameTestHelper.CreateTestGame1();
        const invalidMove = new MoveDTO(TileType.RoadTurn, Orientation.down, 1, 6);//Tile wasn't rolled.
        const move1 = game.MakeMove(
            [
                new MoveDTO(TileType.RoadStraight, Orientation.up, 0, 5),
                new MoveDTO(TileType.Overpass, Orientation.up, 1, 5),
                invalidMove,
                new MoveDTO(TileType.RoadThreeWay, Orientation.right, 2, 5),
                new MoveDTO(TileType.SpecialRoadRailAdjacent, Orientation.left, 2, 6)
            ]
        );
        if(move1.InvalidMoves.length === 1
        ){
            const invalidMoveResponse = move1.InvalidMoves[0];
            if(invalidMoveResponse.InvalidReason === TilePlacementResult.tileNotAvailable
                && invalidMoveResponse.Move === invalidMove
                && invalidMoveResponse.MoveIndex === 2
            ){
                return true;
            }
        }
        return false;
    }

    public InvalidGame_InvalidMove_TileNotAvailable_StandardTileAlreadyPlayed(){
        const game = StandardGameTestHelper.CreateTestGame1();
        const invalidMove = new MoveDTO(TileType.RoadStraight, Orientation.down, 1, 6);//Tile already played.
        const move1 = game.MakeMove(
            [
                new MoveDTO(TileType.RoadStraight, Orientation.up, 0, 5),
                new MoveDTO(TileType.Overpass, Orientation.up, 1, 5),
                invalidMove,
                new MoveDTO(TileType.RoadThreeWay, Orientation.right, 2, 5),
                new MoveDTO(TileType.SpecialRoadRailAdjacent, Orientation.left, 2, 6)
            ]
        );
        if(move1.InvalidMoves.length === 1
        ){
            const invalidMoveResponse = move1.InvalidMoves[0];
            if(invalidMoveResponse.InvalidReason === TilePlacementResult.tileNotAvailable
                && invalidMoveResponse.Move === invalidMove
                && invalidMoveResponse.MoveIndex === 2
            ){
                return true;
            }
        }
        return false;
    }

    public InvalidGame_InvalidMove_TileNotAvailable_SpecialTileAlreadyPlayed(){
        const game = StandardGameTestHelper.CreateTestGame1();
        const invalidMove = new MoveDTO(TileType.SpecialRoadRailAdjacent, Orientation.left, 3, 6);
        const move1 = game.MakeMove(
            [
                new MoveDTO(TileType.RoadStraight, Orientation.up, 0, 5),
                new MoveDTO(TileType.Overpass, Orientation.up, 1, 5),
                new MoveDTO(TileType.RailThreeWay, Orientation.down, 1, 6),
                new MoveDTO(TileType.RoadThreeWay, Orientation.right, 2, 5),
                new MoveDTO(TileType.SpecialRoadRailAdjacent, Orientation.left, 2, 6)
            ]
        );
        if(!move1.WasMoveSuccessful){
            return false;
        }
        const move2 = game.MakeMove(
            [
                new MoveDTO(TileType.RoadTurn, Orientation.right, 3, 6),
                new MoveDTO(TileType.RoadTurn, Orientation.up, 3, 5),
                new MoveDTO(TileType.RoadStraight, Orientation.up, 0, 4),
                new MoveDTO(TileType.Overpass, Orientation.up, 0, 0),
                invalidMove
            ]
        );
        
        if(move2.InvalidMoves.length === 3//1 Tile already played, 2 continuity
        ){
            const invalidMoveResponse = move2.InvalidMoves[0];
            if(invalidMoveResponse.InvalidReason === TilePlacementResult.tileNotAvailable
                && invalidMoveResponse.Move === invalidMove
                && invalidMoveResponse.MoveIndex === 4
            ){
                return true;
            }
        }
        return false;
    }

    /**
     * There is a bug - GitHub Issue# 20 - where tiles that don't pass validation are allowed to be played. 
     * This test will help determine if the bug is in the front or back end.
     */
    public TestScenario_InvalidTilePlacement_CurveTileMisalignWithStraightRoad(): boolean{
        const dicePool = new DebugDicePool([
            [TileType.RoadStraight, TileType.RoadTurn, TileType.RailStraight, TileType.RailTurn]
        ]);
        const game = new BaseGame(7, dicePool, new BaseScoreCalculator(), 7, 7);
        const move1 = game.MakeMove([
            new MoveDTO(TileType.RoadTurn, Orientation.up, 0, 1),
            new MoveDTO(TileType.RoadStraight, Orientation.up, 1, 1),
            new MoveDTO(TileType.RailTurn, Orientation.right, 5, 6),
            new MoveDTO(TileType.RailStraight, Orientation.right, 5, 5)
        ]);

        return !move1.WasMoveSuccessful;
    }

    public StandardGame_ErrorScoring_ShouldScoreNeg1DueToOpenConnection(): boolean{
        const dicePool = new DebugDicePool([
            [TileType.RoadStraight, TileType.RoadTurn, TileType.RoadStraight, TileType.StationStraight]
        ]);
        const game = new BaseGame(7, dicePool, new BaseScoreCalculator(), 7, 7);
        const move1 = game.MakeMove([
            new MoveDTO(TileType.RoadTurn, Orientation.up, 0, 1),
            new MoveDTO(TileType.RoadStraight, Orientation.right, 0, 0),
            new MoveDTO(TileType.RoadStraight, Orientation.right, 3, 6),
            new MoveDTO(TileType.StationStraight, Orientation.left, 3, 5)
        ]);

        const scorer = new BaseScoreCalculator();
        scorer.ScoreBoard(game.GetBoard());
        if(scorer.GetScore().ErrorScore === -1){
            return true;
        }
    }

    public StandardGame_ErrorScoring_ShouldScoreNeg1DueToMismatchedConnection(): boolean{
        const dicePool = new DebugDicePool([
            [TileType.RailTurn, TileType.RailStraight, TileType.RoadStraight, TileType.RoadTurn]
        ]);
        const game = new BaseGame(7, dicePool, new BaseScoreCalculator(), 7, 7);
        const move1 = game.MakeMove([
            new MoveDTO(TileType.RoadTurn, Orientation.up, 0, 1),
            new MoveDTO(TileType.RoadStraight, Orientation.right, 0, 0),
            new MoveDTO(TileType.RailTurn, Orientation.up, 0, 3),
            new MoveDTO(TileType.RailStraight, Orientation.right, 0, 2)
        ]);

        const scorer = new BaseScoreCalculator();
        scorer.ScoreBoard(game.GetBoard());
        if(scorer.GetScore().ErrorScore === -1){
            return true;
        }
    }

    public StandardGame_ErrorScoring_ShouldScoreNeg2DueToOpenAndMismatchedConnection(): boolean{
        const dicePool = new DebugDicePool([
            [TileType.RailTurn, TileType.RailStraight, TileType.RoadThreeWay, TileType.RoadThreeWay]
        ]);
        const game = new BaseGame(7, dicePool, new BaseScoreCalculator(), 7, 7);
        const move1 = game.MakeMove([
            new MoveDTO(TileType.RoadThreeWay, Orientation.left, 0, 1),
            new MoveDTO(TileType.RoadThreeWay, Orientation.up, 0, 0),
            new MoveDTO(TileType.RailTurn, Orientation.up, 0, 3),
            new MoveDTO(TileType.RailStraight, Orientation.right, 0, 2)
        ]);

        const scorer = new BaseScoreCalculator();
        scorer.ScoreBoard(game.GetBoard());
        if(scorer.GetScore().ErrorScore === -2){
            return true;
        }
    }
}