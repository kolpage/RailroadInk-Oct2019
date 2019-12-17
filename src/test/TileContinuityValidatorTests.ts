import { BaseGame } from "../game/BaseGame"
import { StandardGame } from "../game/StandardGame";
import { TileType, Orientation } from "../common/Enums";
import { TileContinuityValidator } from "../game/TileVisitor";

class Assert{
    public static shouldValidateTrue(result: boolean): boolean{
        return result;
    }

    public static shouldValidateFalse(result: boolean): boolean{
        return !result;
    }

    public static allResultsShouldValidateTrue(results: boolean[]): boolean{
        const falseResults = results.filter(result => result === false);
        return falseResults.length === 0;
    }

    public static allResultsShouldValidateFalse(results: boolean[]): boolean{
        const trueResults = results.filter(result => result === true);
        return trueResults.length === 0;
    }
}

export class TileContinuityValidatorTests{

    public TileConnectedToRoadExit_ShouldReturnTrue(): boolean{
        const game = new StandardGame();
        const validator = new TileContinuityValidator(game.GetBoard());
        const tileToValidate = game.ForceSetTile(TileType.RoadStraight, 1, Orientation.up, 0, 5);

        const result = validator.Validate(tileToValidate);

        return Assert.shouldValidateTrue(result);
    }

    public TileConnectedToRailExit_ShouldValidateTrue(): boolean{
        const game = new StandardGame();
        const validator = new TileContinuityValidator(game.GetBoard());
        const tileToValidate = game.ForceSetTile(TileType.RailStraight, 1, Orientation.up, 0, 3);

        const result = validator.Validate(tileToValidate);

        return Assert.shouldValidateTrue(result);
    }

    public TileConnectedToWall_ShouldValidateFalse(): boolean{
        const game = new StandardGame();
        const validator = new TileContinuityValidator(game.GetBoard());
        const tileToValidate = game.ForceSetTile(TileType.RoadStraight, 1, Orientation.up, 0, 4);

        const result = validator.Validate(tileToValidate);

        return Assert.shouldValidateFalse(result);
    }

    public ConsecutiveTileValidationForValidTiles_ShouldAllValidateTrue(): boolean{
        const game = new StandardGame();
        const validator = new TileContinuityValidator(game.GetBoard());
        const tileToValidate1 = game.ForceSetTile(TileType.RoadStraight, 1, Orientation.up, 0, 5);
        const tileToValidate2 = game.ForceSetTile(TileType.RailStraight, 1, Orientation.up, 0, 3);

        const result1 = validator.Validate(tileToValidate1);
        const result2 = validator.Validate(tileToValidate2);

        return Assert.allResultsShouldValidateTrue([result1, result2]);
    }

    public ConsecutiveTileValidationForInvalidTiles_ShouldAllValidateFalse(): boolean{
        const game = new StandardGame();
        const validator = new TileContinuityValidator(game.GetBoard());
        const tileToValidate1 = game.ForceSetTile(TileType.RoadStraight, 1, Orientation.up, 0, 4);
        const tileToValidate2 = game.ForceSetTile(TileType.RailStraight, 1, Orientation.up, 0, 2);

        const result1 = validator.Validate(tileToValidate1);
        const result2 = validator.Validate(tileToValidate2);

        return Assert.allResultsShouldValidateFalse([result1, result2]);
    }

    public TileConnectedToPriorTile_ShouldValidateTrue(): boolean{
        const game = new StandardGame();
        const validator = new TileContinuityValidator(game.GetBoard());
        const priorTile = game.ForceSetTile(TileType.RoadStraight, 1, Orientation.up, 0, 5);
        const tileToValidate = game.ForceSetTile(TileType.RailStraight, 2, Orientation.up, 1, 5);

        const result = validator.Validate(tileToValidate);

        return Assert.shouldValidateTrue(result);
    }

    public TileConnectedToExitViaSameTurnTile_ShouldValidateTrue(): boolean{
        const game = new StandardGame();
        const validator = new TileContinuityValidator(game.GetBoard());
        const priorTile = game.ForceSetTile(TileType.RoadStraight, 1, Orientation.up, 0, 5);
        const tileToValidate = game.ForceSetTile(TileType.RailStraight, 1, Orientation.up, 1, 5);

        const result = validator.Validate(tileToValidate);

        return Assert.shouldValidateTrue(result);
    }

    public TileNotConnected_ShouldValidateFalse(): boolean{
        const game = new StandardGame();
        const validator = new TileContinuityValidator(game.GetBoard());
        const tileToValidate = game.ForceSetTile(TileType.RailStraight, 2, Orientation.up, 1, 5);

        const result = validator.Validate(tileToValidate);

        return Assert.shouldValidateFalse(result);
    }

    public TileConnectedToSameTurnTile_BothTilesNotConnected_ShouldAllValidateFalse(): boolean{
        const game = new StandardGame();
        const validator = new TileContinuityValidator(game.GetBoard());
        const tileToValidate1 = game.ForceSetTile(TileType.RoadStraight, 1, Orientation.up, 1, 5);
        const tileToValidate2 = game.ForceSetTile(TileType.RailStraight, 1, Orientation.up, 2, 5);

        const result1 = validator.Validate(tileToValidate1);
        const result2 = validator.Validate(tileToValidate2);

        return Assert.allResultsShouldValidateFalse([result1, result2]);
    }

    /** Test currently fails because we don't handle multivisits to overpass. */
    public ForceTileVisitorToTraverseNoOverpass_UnrealisticScenario_ShouldValidateTrue(): boolean{
        const game = new StandardGame();
        const validator = new TileContinuityValidator(game.GetBoard());
        const priorTile1 = game.ForceSetTile(TileType.RoadStraight, 1, Orientation.up, 0, 5);
        const priorTile2 = game.ForceSetTile(TileType.StationTurnMirror, 1, Orientation.left, 1, 5);
        const priorTile3 = game.ForceSetTile(TileType.RailStraight, 1, Orientation.right, 1, 4);
        const priorTile4 = game.ForceSetTile(TileType.RailTurn, 1, Orientation.down, 1, 3);
        const priorTile5 = game.ForceSetTile(TileType.RailStraight, 1, Orientation.up, 2, 3);
        const priorTile6 = game.ForceSetTile(TileType.StationStraight, 1, Orientation.up, 3, 3);
        const priorTile7 = game.ForceSetTile(TileType.StationTurn, 1, Orientation.left, 4, 3);
        const priorTile8 = game.ForceSetTile(TileType.RailThreeWay, 1, Orientation.up, 4, 4);
        const tileToValidate = game.ForceSetTile(TileType.SpecialRoadRailAdjacent, 1, Orientation.up, 3, 4);

        const result = validator.Validate(tileToValidate);

        return Assert.shouldValidateTrue(result);
    }
    
    public ForceTileVisitorToTraverseOverpass_UnrealisticScenario_ShouldValidateTrue(): boolean{
        const game = new StandardGame();
        const validator = new TileContinuityValidator(game.GetBoard());
        const priorTile1 = game.ForceSetTile(TileType.RoadStraight, 1, Orientation.up, 0, 5);
        const priorTile2 = game.ForceSetTile(TileType.StationTurnMirror, 1, Orientation.left, 1, 5);
        const priorTile3 = game.ForceSetTile(TileType.Overpass, 1, Orientation.up, 1, 4);
        const priorTile4 = game.ForceSetTile(TileType.RailTurn, 1, Orientation.down, 1, 3);
        const priorTile5 = game.ForceSetTile(TileType.RailStraight, 1, Orientation.up, 2, 3);
        const priorTile6 = game.ForceSetTile(TileType.StationStraight, 1, Orientation.up, 3, 3);
        const priorTile7 = game.ForceSetTile(TileType.StationTurn, 1, Orientation.left, 4, 3);
        const priorTile8 = game.ForceSetTile(TileType.RailThreeWay, 1, Orientation.up, 4, 4);
        const priorTile9 = game.ForceSetTile(TileType.SpecialRoadRailAdjacent, 1, Orientation.up, 3, 4);
        const priorTile10 = game.ForceSetTile(TileType.RoadThreeWay, 1, Orientation.right, 2, 4);
        const tileToValidate = game.ForceSetTile(TileType.RoadTurn, 1, Orientation.left, 0, 4);

        const result = validator.Validate(tileToValidate);

        return Assert.shouldValidateTrue(result);
    }
}