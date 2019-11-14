// TODO: This is just a tempory 'class' for hooking up front end and back end code
//       The functionality in here should be moved to proper ajax calls using APIs exposed from the backend

import {StandardDicePool} from '../game/DicePool';

export function RollDice() {
    const dicePool = new StandardDicePool(Math.random().toString());
    return dicePool.Roll();
}