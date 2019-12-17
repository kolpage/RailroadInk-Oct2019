import { EdgeMatchingStatus, Edge } from "../common/Enums";
import { PositionValidator } from "../common/PositionValidator";

class Assert{
    public static shouldHaveValidMatchStatus(testResult: EdgeMatchingStatus): boolean{
        return testResult === EdgeMatchingStatus.valid;
    }

    public static shouldHaveInvalidMatchStatus(testResult: EdgeMatchingStatus): boolean{
        return testResult === EdgeMatchingStatus.invalid;
    }

    public static shouldHaveOpenMatchStatus(testResult: EdgeMatchingStatus): boolean{
        return testResult === EdgeMatchingStatus.open;
    }

    public static shouldHaveMismatchMatchStatus(testResult: EdgeMatchingStatus): boolean{
        return testResult === EdgeMatchingStatus.mismatch;
    }

    public static canHaveAnyMatchStatus(_testResult: EdgeMatchingStatus): boolean{
        return true;
    }
}

export class PositionValidatorTests{

    public Any_Any_NotPossible(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.any, Edge.any);

        return Assert.canHaveAnyMatchStatus(result);
    };

    public Any_Empty_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.any, Edge.empty);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Any_ExitRail_NotPossible(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.any, Edge.exitRail);

        return Assert.canHaveAnyMatchStatus(result);
    };

    public Any_ExitRoad_NotPossible(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.any, Edge.exitRoad);

        return Assert.canHaveAnyMatchStatus(result);
    };

    public Any_Lake_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.any, Edge.lake);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Any_Lava_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.any, Edge.lava);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Any_Meteor_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.any, Edge.meteor);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Any_Rail_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.any, Edge.rail);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Any_River_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.any, Edge.river);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Any_Road_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.any, Edge.road);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Any_Undefined_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.any, undefined);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Empty_Any_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.empty, Edge.any);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Empty_Empty_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.empty, Edge.empty);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Empty_ExitRail_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.empty, Edge.exitRail);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Empty_ExitRoad_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.empty, Edge.exitRoad);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Empty_Lake_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.empty, Edge.lake);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Empty_Lava_Mismatch(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.empty, Edge.lava);

        return Assert.shouldHaveMismatchMatchStatus(result);
    };

    public Empty_Meteor_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.empty, Edge.meteor);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Empty_Rail_Mismatch(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.empty, Edge.rail);

        return Assert.shouldHaveMismatchMatchStatus(result);
    };

    public Empty_River_Mismatch(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.empty, Edge.river);

        return Assert.shouldHaveMismatchMatchStatus(result);
    };

    public Empty_Road_Mismatch(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.empty, Edge.road);

        return Assert.shouldHaveMismatchMatchStatus(result);
    };

    public Empty_Undefined_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.empty, undefined);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public ExitRail_Any_NotPossible(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.exitRail, Edge.any);

        return Assert.canHaveAnyMatchStatus(result);
    };

    public ExitRail_Empty_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.exitRail, Edge.empty);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public ExitRail_ExitRail_NotPossible(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.exitRail, Edge.exitRail);

        return Assert.canHaveAnyMatchStatus(result);
    };

    public ExitRail_ExitRoad_NotPossible(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.exitRail, Edge.exitRail);

        return Assert.canHaveAnyMatchStatus(result);
    };

    public ExitRail_Lake_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.exitRail, Edge.lake);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public ExitRail_Lava_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.exitRail, Edge.lava);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public ExitRail_Meteor_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.exitRail, Edge.meteor);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public ExitRail_Rail_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.exitRail, Edge.rail);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public ExitRail_River_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.exitRail, Edge.river);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public ExitRail_Road_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.exitRail, Edge.road);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public ExitRail_Undefined_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.exitRail, undefined);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public ExitRoad_Any_NotPossible(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.exitRoad, Edge.any);

        return Assert.canHaveAnyMatchStatus(result);
    };

    public ExitRoad_Empty_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.exitRoad, Edge.empty);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public ExitRoad_ExitRail_NotPossible(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.exitRoad, Edge.exitRail);

        return Assert.canHaveAnyMatchStatus(result);
    };

    public ExitRoad_ExitRoad_NotPossible(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.exitRoad, Edge.exitRoad);

        return Assert.canHaveAnyMatchStatus(result);
    };

    public ExitRoad_Lake_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.exitRoad, Edge.lake);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public ExitRoad_Lava_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.exitRoad, Edge.lava);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public ExitRoad_Meteor_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.exitRoad, Edge.meteor);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public ExitRoad_Rail_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.exitRoad, Edge.rail);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public ExitRoad_River_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.exitRoad, Edge.river);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public ExitRoad_Road_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.exitRoad, Edge.road);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public ExitRoad_Undefined_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.exitRoad, undefined);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Lake_Any_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.lake, Edge.any);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Lake_Empty_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.lake, Edge.empty);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Lake_ExitRail_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.lake, Edge.exitRail);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public Lake_ExitRoad_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.lake, Edge.exitRoad);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public Lake_Lake_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.lake, Edge.lake);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Lake_Lava_NotPossible(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.lake, Edge.lava);

        return Assert.canHaveAnyMatchStatus(result);
    };

    public Lake_Meteor_NotPossible(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.lake, Edge.meteor);

        return Assert.canHaveAnyMatchStatus(result);
    };

    public Lake_Rail_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.lake, Edge.rail);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public Lake_River_NotPossible(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.lake, Edge.river);

        return Assert.canHaveAnyMatchStatus(result);
    };

    public Lake_Road_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.lake, Edge.road);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public Lake_Undefined_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.lake, undefined);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Lava_Any_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.lava, Edge.any);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Lava_Empty_Mismatch(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.lava, Edge.empty);

        return Assert.shouldHaveMismatchMatchStatus(result);
    };

    public Lava_ExitRail_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.lava, Edge.exitRail);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public Lava_ExitRoad_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.lava, Edge.exitRoad);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public Lava_Lake_NotPossible(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.lava, Edge.lake);

        return Assert.canHaveAnyMatchStatus(result);
    };

    public Lava_Lava_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.lava, Edge.lava);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Lava_Meteor_NotPossible(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.lava, Edge.meteor);

        return Assert.canHaveAnyMatchStatus(result);
    };

    public Lava_Rail_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.lava, Edge.rail);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public Lava_River_NotPossible(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.lava, Edge.river);

        return Assert.canHaveAnyMatchStatus(result);
    };

    public Lava_Road_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.lava, Edge.road);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public Lava_Undefined_Open(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.lava, undefined);

        return Assert.shouldHaveOpenMatchStatus(result);
    };

    public Meteor_Any_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.meteor, Edge.any);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Meteor_Empty_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.meteor, Edge.empty);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Meteor_ExitRail_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.meteor, Edge.exitRail);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Meteor_ExitRoad_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.meteor, Edge.exitRoad);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Meteor_Lake_NotPossible(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.meteor, Edge.lake);

        return Assert.canHaveAnyMatchStatus(result);
    };

    public Meteor_Lava_NotPossible(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.meteor, Edge.lava);

        return Assert.canHaveAnyMatchStatus(result);
    };

    public Meteor_Meteor_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.meteor, Edge.meteor);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Meteor_Rail_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.meteor, Edge.rail);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Meteor_River_NotPossible(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.meteor, Edge.river);

        return Assert.canHaveAnyMatchStatus(result);
    };

    public Meteor_Road_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.meteor, Edge.road);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Meteor_Undefined_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.meteor, undefined);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Rail_Any_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.rail, Edge.any);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Rail_Empty_Mismatch(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.rail, Edge.empty);

        return Assert.shouldHaveMismatchMatchStatus(result);
    };

    public Rail_ExitRail_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.rail, Edge.exitRail);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Rail_ExitRoad_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.rail, Edge.exitRoad);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public Rail_Lake_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.rail, Edge.lake);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public Rail_Lava_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.rail, Edge.lava);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public Rail_Meteor_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.rail, Edge.meteor);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Rail_Rail_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.rail, Edge.rail);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Rail_River_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.rail, Edge.river);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public Rail_Road_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.rail, Edge.road);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public Rail_Undefined_Open(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.rail, undefined);

        return Assert.shouldHaveOpenMatchStatus(result);
    };

    public River_Any_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.river, Edge.any);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public River_Empty_Mismatch(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.river, Edge.empty);

        return Assert.shouldHaveMismatchMatchStatus(result);
    };

    public River_ExitRail_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.river, Edge.exitRail);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public River_ExitRoad_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.river, Edge.exitRoad);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public River_Lake_NotPossible(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.river, Edge.lake);

        return Assert.canHaveAnyMatchStatus(result);
    };

    public River_Lava_NotPossible(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.river, Edge.lava);

        return Assert.canHaveAnyMatchStatus(result);
    };

    public River_Meteor_NotPossible(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.river, Edge.meteor);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public River_Rail_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.river, Edge.rail);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public River_River_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.river, Edge.river);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public River_Road_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.river, Edge.road);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public River_Undefined_Open(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.river, undefined);

        return Assert.shouldHaveOpenMatchStatus(result);
    };

    public Road_Any_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.road, Edge.any);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Road_Empty_Mismatch(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.road, Edge.empty);

        return Assert.shouldHaveMismatchMatchStatus(result);
    };

    public Road_ExitRail_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.road, Edge.exitRail);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public Road_ExitRoad_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.road, Edge.exitRoad);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Road_Lake_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.road, Edge.lake);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public Road_Lava_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.road, Edge.lava);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public Road_Meteor_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.road, Edge.meteor);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Road_Rail_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.road, Edge.rail);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public Road_River_Invalid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.road, Edge.river);

        return Assert.shouldHaveInvalidMatchStatus(result);
    };

    public Road_Road_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.road, Edge.road);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Road_Undefined_Open(): boolean{
        const result = PositionValidator.ValidateEdges(Edge.road, undefined);

        return Assert.shouldHaveOpenMatchStatus(result);
    };

    public Undefined_Any_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(undefined, Edge.any);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Undefined_Empty_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(undefined, Edge.empty);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Undefined_ExitRail_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(undefined, Edge.exitRail);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Undefined_ExitRoad_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(undefined, Edge.exitRoad);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Undefined_Lake_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(undefined, Edge.lake);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Undefined_Lava_Open(): boolean{
        const result = PositionValidator.ValidateEdges(undefined, Edge.lava);

        return Assert.shouldHaveOpenMatchStatus(result);
    };

    public Undefined_Meteor_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(undefined, Edge.meteor);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    public Undefined_Rail_Open(): boolean{
        const result = PositionValidator.ValidateEdges(undefined, Edge.rail);

        return Assert.shouldHaveOpenMatchStatus(result);
    };

    public Undefined_River_Open(): boolean{
        const result = PositionValidator.ValidateEdges(undefined, Edge.river);

        return Assert.shouldHaveOpenMatchStatus(result);
    };

    public Undefined_Road_Open(): boolean{
        const result = PositionValidator.ValidateEdges(undefined, Edge.road);

        return Assert.shouldHaveOpenMatchStatus(result);
    };

    public Undefined_Undefined_Valid(): boolean{
        const result = PositionValidator.ValidateEdges(undefined, undefined);

        return Assert.shouldHaveValidMatchStatus(result);
    };

    //#endregion Validator Tests
}