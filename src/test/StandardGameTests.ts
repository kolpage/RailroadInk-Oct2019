import { DebugDicePool } from "../game/DicePool";
import { BaseGame } from "../game/BaseGame";
import { MoveDTO } from "../common/DTO/MoveDTO";
import { TurnResponseDTO } from "../common/DTO/TurnResponseDTO";
import { TileType, Orientation } from "../common/Enums";

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
        const roll1 = [TileType.RoadStraight, TileType.RoadThreeWay, TileType.RailThreeWay, TileType.Overpass];
        const roll2 = [TileType.RoadStraight, TileType.RoadTurn, TileType.RoadTurn, TileType.Overpass];
        const roll3 = [TileType.RoadThreeWay, TileType.RailThreeWay, TileType.RailStraight, TileType.StationTurn];
        const roll4 = [TileType.RailStraight, TileType.RailStraight, TileType.RailStraight, TileType.StationStraight];
        const roll5 = [TileType.RoadTurn, TileType.RailThreeWay, TileType.RailTurn, TileType.StationStraight];
        const roll6 = [TileType.RailThreeWay, TileType.RoadThreeWay, TileType.RoadStraight, TileType.StationStraight];
        const roll7 = [TileType.RailStraight, TileType.RoadThreeWay, TileType.RailStraight, TileType.StationStraight];
        const diceRolls = [roll1, roll2, roll3, roll4, roll5, roll6, roll7];
        const debugDicePool = new DebugDicePool(diceRolls);
        const game = new BaseGame(7, debugDicePool, 7, 7);
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

        //Score here

        return true;
    }
}