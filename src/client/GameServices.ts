// import update from 'react-addons-update';
import update from 'immutability-helper';

import { TileType } from '../common/Enums';
import { Move, TurnMoves, GameTurn } from './Models/GameTurn';
import { MoveDTO } from '../common/DTO/MoveDTO';
import { GameTile } from './Models/GameTile';
import { GameBoard } from './Models/GameBoard';
import { GameDice } from './Models/GameDice';
import { ipcRenderer } from 'electron';
import { GetDiceRollEvent, AdvanceTurnEvent, StartGameEvent } from'../common/Constants';
import { TurnResponseDTO } from '../common/DTO/TurnResponseDTO';
import { InvalidMoveResponseDTO } from '../common/DTO/InvalidMoveResponseDTO';

function createDiceFromTileType(tileType: TileType){
    const gameTile = new GameTile(tileType);
    return new GameDice(gameTile);
}  

function createTurnFromResponseDTO(turnResponseDTO: TurnResponseDTO){
    var gameTurn = new GameTurn();
    gameTurn.TotalTurns = turnResponseDTO.NumberOfTurns;
    gameTurn.IsGameOver = turnResponseDTO.IsGameOver;
    gameTurn.Score = turnResponseDTO.FinalScore;
    gameTurn.TurnNumber = turnResponseDTO.TurnNumber;
    gameTurn.RolledDice = turnResponseDTO.NextTurnDice.map(createDiceFromTileType);
    gameTurn.RolledDice.forEach( dice => {
        dice.SetGameTurn(turnResponseDTO.TurnNumber);
    });
    return gameTurn;
}

function PrepareMovesForDTO(moves: TurnMoves){
    return moves.GetMoves().map( move => TranslateMoveToDTO(move));
}

function createMoveFromInvalidMoveDTO(invalidMoveDTO: InvalidMoveResponseDTO, turnNumber: number){
    const gameTile = new GameTile(invalidMoveDTO.Move.Tile, invalidMoveDTO.Move.Orientation, turnNumber);
    return new Move(gameTile, invalidMoveDTO.Move.ColumnIndex, invalidMoveDTO.Move.RowIndex, invalidMoveDTO.InvalidReason);
}

function createMovesFromTurnResponseDTO(turnResponseDTO: TurnResponseDTO){
    return turnResponseDTO.InvalidMoves.map(invalidMove => createMoveFromInvalidMoveDTO(invalidMove, turnResponseDTO.TurnNumber));
}

// TODO: Not sure if this will actully be given from the server
export function GetSpeicalDice(){
    const specialDiceTypes = [TileType.SpecialAllRail, TileType.SpecialThreeRailOneRoad, TileType.SpecialRoadRailAcross, TileType.SpecialThreeRoadOneRail, TileType.SpecialAllRoad, TileType.SpecialRoadRailAdjacent];
    return specialDiceTypes.map(createDiceFromTileType);
}

export function GetBoard(){
    // TODO: Actally get board from sever
    return new GameBoard(7,7);
}

export function TranslateMoveToDTO(move: Move){
    return new MoveDTO(move.TilePlayed.Type, move.TilePlayed.TileOrientation, move.RowPosition, move.ColumnPosition);
}

export function StartGame(gameSeed: string, callback: (gameTurn: GameTurn) => void){
    ipcRenderer.invoke(StartGameEvent, gameSeed).then((result) => {
        callback(createTurnFromResponseDTO(result));
    });
}

export function GetDiceRoll(callback: (gameDice: GameDice[]) => void){
    ipcRenderer.invoke(GetDiceRollEvent).then((result) => {
        const dice = result.map(createDiceFromTileType);
        callback(dice);
    });
}

export function AdvanceTurn(moves: TurnMoves, successCallback: (gameTurn: GameTurn) => void, errorCallback: (badMoves: Move[]) => void){
    const movesToSend: MoveDTO[] = PrepareMovesForDTO(moves);
    ipcRenderer.invoke(AdvanceTurnEvent, movesToSend).then((result: TurnResponseDTO) => {
        if(result.WasMoveSuccessful){
            successCallback(createTurnFromResponseDTO(result))
        }else{
            errorCallback(createMovesFromTurnResponseDTO(result));
        } 
    });
}


