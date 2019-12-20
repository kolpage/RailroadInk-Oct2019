// TODO: This is just a tempory 'class' for hooking up front end and back end code
//       The functionality in here should be moved to proper ajax calls using APIs exposed from the backend

// import update from 'react-addons-update';
import update from 'immutability-helper';

import { TileType } from '../common/Enums';
import { Move, TurnMoves } from './Models/GameTurn';
import { MoveDTO } from '../common/DTO/MoveDTO';
import { GameTile } from './Models/GameTile';
import { GameBoard } from './Models/GameBoard';
import { GameDice } from './Models/GameDice';
import { ipcRenderer } from 'electron';
import { GetDiceRollEvent, AdvanceTurnEvent } from'../common/Constants';

export function GetBoard() {
    // TODO: Actally get board from sever
    return new GameBoard(7,7);
}

export function GetDiceRoll(callback: (gameDice: GameDice[]) => void) {
    ipcRenderer.invoke(GetDiceRollEvent).then((result) => {
        const dice = result.map(createDiceFromTileType);
        callback(dice);
    });
}

export function AdvanceTurn(moves: TurnMoves) {
    const movesToSend: MoveDTO[] = PrepareMovesForDTO(moves);
    ipcRenderer.invoke(AdvanceTurnEvent, movesToSend).then((result) => {
        console.log("Advance turn result:");
        console.log(result);
    });
}

// TODO: Not sure if this will actully be given from the server
export function GetSpeicalDice() {
    const specialDiceTypes = [TileType.SpecialAllRail, TileType.SpecialThreeRailOneRoad, TileType.SpecialRoadRailAcross, TileType.SpecialThreeRoadOneRail, TileType.SpecialAllRoad, TileType.SpecialRoadRailAdjacent];
    return specialDiceTypes.map(createDiceFromTileType);
}  

function createDiceFromTileType(tileType: TileType) {
    const gameTile = new GameTile(tileType);
    return new GameDice(gameTile);
}  

export function TranslateMoveToDTO(move: Move) {
    return new MoveDTO(move.TilePlayed.Type, move.TilePlayed.TileOrientation, move.RowPosition, move.ColumnPosition);
}

function PrepareMovesForDTO(moves: TurnMoves) {
    return moves.GetMoves().map( move => TranslateMoveToDTO(move));
}
