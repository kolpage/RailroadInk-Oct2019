// import update from 'react-addons-update';
import update from 'immutability-helper';

import * as React from 'react';
import { Inventory } from './Inventory';
import '../styles/board.scss';
import '../styles/inventory.scss';
import '../styles/tile.scss';
import { RollDice, GetSpeicalDice } from '../GameServices';
import { GameDice } from '../Models/GameDice';
import { TileType } from '../../common/Enums';
import { Grid } from './Grid';
import { GameBoard } from '../Models/GameBoard';
import { TurnMoves } from '../Models/GameTurn';
import { Move } from '../Models/GameTurn';

interface IBoardProps {
    gameBoard: GameBoard;
}

interface IBoardState {
    selectedDice: GameDice;
    rolledDice: GameDice[]; // TODO: This should just be gotten from the server
    playedTiles: TurnMoves;
    gameBoard: GameBoard;
    gameTurn: number;
}

export class Board extends React.Component<IBoardProps, IBoardState> {
    // TODO: Elevate this state (it should come from the server anyways)
    private specialDice = GetSpeicalDice();
    
    constructor(props: IBoardProps) {
        super(props);
        this.state = {
            selectedDice: new GameDice(), 
            rolledDice: RollDice(),
            playedTiles: new TurnMoves(),
            gameBoard: this.props.gameBoard,
            gameTurn: 1
        }
    }
    
    private rollDice() {
        this.setState({rolledDice: RollDice(), gameTurn: this.state.gameTurn+1});
    }

    private playSelectedDice(move: Move) {
        if (!this.state.selectedDice.IsEmpty()) {
            // TODO: Don't have board update the move. Not sure how to handle this since I don't want to pass the currently selected 
            //       dice to the grid since it doesn't really need to know that. 
            move.TilePlayed.Type = this.state.selectedDice.GetTileType();
            move.TilePlayed.TurnPlayed = this.state.gameTurn;
            let updatedBoard = this.state.gameBoard;
            updatedBoard.MakeMove(move);

            let updatedPlayedTiles = this.state.playedTiles
            updatedPlayedTiles.AddMove(move);
            this.state.selectedDice.Played = true;

            this.setState({gameBoard: updatedBoard, playedTiles: updatedPlayedTiles, selectedDice: new GameDice()});   
        }  
    }

    private updateMoveOnBoard(move: Move) {
        let updatedBoard = this.state.gameBoard;
        updatedBoard.MakeMove(move);

        let updatedPlayedTiles = this.state.playedTiles;
        updatedPlayedTiles.UpdateMove(move);

        this.setState({gameBoard: updatedBoard, playedTiles: updatedPlayedTiles});
    }

    private removeMoveFromBoard(move: Move) {
        let updatedBoard = this.state.gameBoard;
        updatedBoard.RemoveMove(move);

        let updatedPlayedTiles = this.state.playedTiles;
        updatedPlayedTiles.RemoveMove(move);

        this.setState({gameBoard: updatedBoard, playedTiles: updatedPlayedTiles});

        this.resetDice(move.TilePlayed.Type); // TODO: Get rid of reference to type enum
    }

    // TODO: Don't depend on the TileType enum (probably should just better track what dice are played)
    private resetDice(tileType: TileType) {
        let found = false;
        tileType = this.getNonMirrorType(tileType);

        this.state.rolledDice.every(dice => {
            if (dice.Tile.Type == tileType && dice.Played) {
                dice.Played = false;
                found = true;
                return false;
            }
            return true;
        });
        if (!found) {
            this.specialDice.every(dice => {
                if (dice.Tile.Type == tileType && dice.Played) {
                    dice.Played = false;
                    found = true;
                    return false;
                }
                return true;
            });
        }
    }

    // TODO: Encapsulate this check so that board is not making it 
    private getNonMirrorType(tile: TileType) {
        if (tile == TileType.StationTurnMirror) {
            return TileType.StationTurn;
        }

        return tile;
    }

    private updateSelectedDice(dice: GameDice) {
        this.setState({selectedDice: dice});
    }

    render() {
        return (
            <div className='boardContainer'>
                <Inventory dice={this.specialDice} onDiceSelected={this.updateSelectedDice.bind(this)} />
                <Inventory dice={this.state.rolledDice} onDiceSelected={this.updateSelectedDice.bind(this)}/>
                <button onClick={this.rollDice.bind(this)} className='rollButton'>Roll Dice</button>
                <Grid gameBoard={this.state.gameBoard} gameTurn={this.state.gameTurn} addMoveToBoard={this.playSelectedDice.bind(this)} updateMoveOnBoard={this.updateMoveOnBoard.bind(this)} clearMoveOnBoard={this.removeMoveFromBoard.bind(this)}/>
            </div>
        );
    }
}