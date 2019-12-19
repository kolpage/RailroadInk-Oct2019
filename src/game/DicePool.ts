import { BaseDie, RouteDie, StationDie } from "./Dice";
import { TileType } from "../common/Enums";

const seedrandom = require('seedrandom');

/** Base implementation of the dice pool. */
export class BaseDicePool{
    protected dice: BaseDie[];
    protected randomNumberGenerator: Function;

    constructor(seed: string){
        this.dice = [];
        this.randomNumberGenerator = seedrandom(seed);
    }

    /** Rolls all the dice in the dice pool. */
    public Roll(): TileType[]{
        const diceResults: TileType[] = [];
        this.dice.forEach((die) => {
            diceResults.push(die.Roll());
        });
        return diceResults;
    }
}

/** Represents the dice pool for a game with no expansions. */
export class StandardDicePool extends BaseDicePool{
    constructor(seed?: string){
        super(seed);
        this.dice.push(new RouteDie(this.randomNumberGenerator));
        this.dice.push(new RouteDie(this.randomNumberGenerator));
        this.dice.push(new RouteDie(this.randomNumberGenerator));
        this.dice.push(new StationDie(this.randomNumberGenerator));
    }
}

/**
 * Dice pool used for testing. Set roll results in 2D array of TileTypes. In the following example,
 * the three inner arrays each represent the result of 1 roll. Every time Roll() is called, the next
 * result array is returned. Will keep looping through them.
 * ex. 
 * [
 *      [TileType.RailStraight, TileType.RoadStraight, TileType.RoadTurn, TileType.StationStraight],
 *      [TileType.RailTurn, TileType.RailThreeWay, TileType.RoadStraight, TileType.Overpass],
 *      [TileType.RailThreeWay, TileType.RoadThreeWay, TileType.RoadTurn, TileType.StationTurn]
 * ]
 */
export class DebugDicePool extends BaseDicePool{

    private rollResults: TileType[][];
    private nextRollPointer: number = 0;

    constructor(rollResults: TileType[][])
    {
        super("seed");
        this.rollResults = rollResults;
    }

    public Roll(): TileType[]{
        const currentRollPointer = this.nextRollPointer;
        this.nextRollPointer += 1;
        if(this.nextRollPointer === this.rollResults.length){
            this.nextRollPointer = 0;
        }
        return this.rollResults[currentRollPointer];
    }
}