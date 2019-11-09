import { TileType } from "../common/Enums";

/** The base implementation of a die. */
export class BaseDie{
    private sides: TileType[];
    private randomNumberGenerator: Function;

    constructor(sides: TileType[], randomNumberGenerator: Function){
        this.sides = sides;
        this.randomNumberGenerator = randomNumberGenerator;
    }

    /** Rolls the die and returns the result */
    public Roll(): TileType{
       return this.sides[Math.floor(this.randomNumberGenerator() * 6)];
    }
}

/** Represents the route die. */
export class RouteDie extends BaseDie{
    constructor(randomNumberGenerator: Function){
        const sides = [
            TileType.RailTurn, 
            TileType.RailStraight, 
            TileType.RailThreeWay, 
            TileType.RoadTurn, 
            TileType.RoadStraight, 
            TileType.RoadThreeWay
        ];
        super(sides, randomNumberGenerator);
    }
}

/** Represents the station/overpass die. */
export class StationDie extends BaseDie{
    constructor(randomNumberGenerator: Function){
        const sides = [
            TileType.StationStraight, 
            TileType.StationTurn, 
            TileType.Overpass, 
            TileType.StationStraight, 
            TileType.StationTurn, 
            TileType.Overpass
        ];
        super(sides, randomNumberGenerator);
    }
}