// TODO: This is just a tempory 'class' for hooking up front end and back end code
//       The functionality in here should be moved to proper ajax calls using APIs exposed from the backend

import {StandardDicePool} from '../game/DicePool';
import { TileType } from '../common/Enums';
import { GameTile } from './GameModels';

export function RollDice() {
    const dicePool = new StandardDicePool(Math.random().toString());
    const rawDiceValues = dicePool.Roll();
    return rawDiceValues.map(createDiceFromTileType)
}

// TODO: Not sure if this will actully be given from the server
export function GetSpeicalDice() {
    const specialDiceTypes = [TileType.SpecialAllRail, TileType.SpecialThreeRailOneRoad, TileType.SpecialRoadRailAcross, TileType.SpecialThreeRoadOneRail, TileType.SpecialAllRoad, TileType.SpecialRoadRailAdjacent];
    return specialDiceTypes.map(createDiceFromTileType);
}  

function createDiceFromTileType(tileType: TileType) {
    return new GameTile(tileType);
}  
