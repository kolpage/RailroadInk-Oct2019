import * as React from 'react';
import { Square } from './Square';
import { Inventory } from './Inventory';
import '../styles/board.scss';
import '../styles/inventory.scss';
import '../styles/tile.scss';
import { RollDice, GetSpeicalDice } from '../GameServices';
import { GameBoard, GameDice, GameTile, Move } from '../GameModels';
import { TileType, Orientation } from '../../common/Enums';
import { Grid } from './Grid';

interface IBoardProps {
    gameBoard: GameBoard;
}

interface IBoardState {
    selectedDice: GameDice;
    rolledDice: GameDice[]; // TODO: This should just be gotten from the server
    playedDice: GameDice[];
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
            playedDice: [],
            gameBoard: this.props.gameBoard,
            gameTurn: 1
        }
    }
    
    private rollDice() {
        this.setState({rolledDice: RollDice(), gameTurn: this.state.gameTurn+1});
    }

    // #region: Child callback functions
    private playSelectedDice(move: Move) {
        if (!this.state.selectedDice.IsEmpty()) {
            // TODO: Don't have board update the move. Not sure how to handle this since I don't want to pass the currently selected 
            //       dice to the grid since it doesn't really need to know that. 
            move.TilePlayed.Type = this.state.selectedDice.GetTileType();
            move.TilePlayed.TurnPlayed = this.state.gameTurn;
            let updatedBoard = this.state.gameBoard;
            updatedBoard.AddMove(move);

            let updatePlayedDice = this.state.playedDice;
            updatePlayedDice.push(this.state.selectedDice);
            this.state.selectedDice.Played = true;

            this.setState({gameBoard: updatedBoard, playedDice: updatePlayedDice, selectedDice: new GameDice()});   
        }  
    }

    private updateMoveOnBoard(move: Move) {
        // TODO: Update Moves property
        let updatedBoard = this.state.gameBoard;
        updatedBoard.AddMove(move);
        this.setState({gameBoard: updatedBoard});
    }

    private removeMoveFromBoard(move: Move) {
        // TODO: Update Moves property
        let updatedBoard = this.state.gameBoard;
        updatedBoard.RemoveMove(move);
        this.setState({gameBoard: updatedBoard});

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
    // #endregion

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