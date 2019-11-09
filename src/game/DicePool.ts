import { BaseDie, RouteDie, StationDie } from "./Dice";
import { TileType } from "../common/Enums";

const seedrandom = require('seedrandom');

/** Base implementation of the dice pool. */
export class DicePoolBase{
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
export class StandardDicePool extends DicePoolBase{
    constructor(seed?: string){
        super(seed);
        this.dice.push(new RouteDie(this.randomNumberGenerator));
        this.dice.push(new RouteDie(this.randomNumberGenerator));
        this.dice.push(new RouteDie(this.randomNumberGenerator));
        this.dice.push(new StationDie(this.randomNumberGenerator));
    }
}