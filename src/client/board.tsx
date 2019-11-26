import * as React from 'react';
import {Square} from './square';
import {Inventory} from './inventory';
import './styles/board.scss';
import './styles/inventory.scss';
import { TileType } from '../common/Enums';
import {RollDice, GetSpeicalDice} from './GameServices';
import { GameBoard, GameTile, IGameTile } from './GameModels';

interface IBoardProps {
    rows: number;
    columns: number;
    gameBoard: GameBoard;
    
}

interface IBoardState {
    selectedDice: IGameTile;
    rolledDice: IGameTile[]; // TODO: This should just be gotten from the server
    playedDice: IGameTile[];
    gameBoard: GameBoard;
    gameTurn: number;
}

export class Board extends React.Component<IBoardProps, IBoardState> {
    constructor(props: IBoardProps) {
        super(props);
        this.state = {
            selectedDice: new GameTile(TileType.Empty), 
            rolledDice: RollDice(),
            playedDice: [],
            gameBoard: this.props.gameBoard,
            gameTurn: 1
        }
    }
    
    private rollDice() {
        this.setState({rolledDice: RollDice(), gameTurn: this.state.gameTurn+1});
    }

    private createRow(rowPosition: number, numberOfCells: number): React.ReactElement {
        let row = [];
        for (var currentColumn = 0; currentColumn < numberOfCells; currentColumn++) {
            const tile = this.props.gameBoard.getTile(currentColumn, rowPosition);
            const cellKey = `${currentColumn}${rowPosition}`
            const isSquareLocked = !this.canTileBeUpdated(tile, this.state.gameTurn);
            row.push(<Square gameTile={tile} updateSquare={this.playSelectedTile.bind(this)} rotateSquare={this.rotateSquareTile.bind(this)} clearSquare={this.clearSquareTile.bind(this)} isLocked={isSquareLocked} sqaureColumn={currentColumn} squareRow={rowPosition} key={cellKey} />);
        }
        return (
            <div className='row' key={"gameBoardRow" + rowPosition}>
                {row}
            </div>
        );
    }

    // #region: Child callback functions
    // TODO: I don't like this pattern of adding a callback/delegate for each action the square wants to do. Probably need state MGMT (or just find a better pattern)
    //       Maybe we can just have the square return the updated tile and all board needs to do is set the new tile on the board
    private playSelectedTile(squareColumn: number, squareRow: number) {
        if (this.state.selectedDice.Type === TileType.Empty) {return;} // TODO: Gross procedural code
        
        let updatedTile = this.state.gameBoard.getTile(squareColumn, squareRow);
        updatedTile.Type = this.state.selectedDice.Type;
        updatedTile.TurnPlayed = this.state.gameTurn;
        let updatedBoard = this.state.gameBoard;
        updatedBoard.setTile(updatedTile, squareColumn, squareRow);

        let updatePlayedDice = this.state.playedDice;
        updatePlayedDice.push(this.state.selectedDice);

        this.setState({gameBoard: updatedBoard, playedDice: updatePlayedDice, selectedDice: new GameTile(TileType.Empty)});      
    }

    private rotateSquareTile(squareColumn: number, squareRow: number) {
        let updatedTile = this.state.gameBoard.getTile(squareColumn, squareRow);
        updatedTile.RotateTile();
        let updatedBoard = this.state.gameBoard;
        updatedBoard.setTile(updatedTile, squareColumn, squareRow);
        this.setState({gameBoard: updatedBoard});
    }

    private clearSquareTile(squareColumn: number, squareRow: number) {
        const emptyTile = new GameTile();
        let updatedBoard = this.state.gameBoard;
        updatedBoard.setTile(emptyTile, squareColumn, squareRow);
        this.setState({gameBoard: updatedBoard});
    }

    private updateSelectedDice(dice: IGameTile) {
        this.setState({selectedDice: dice});
    }
    // #endregion

    // TODO: This should leave somewhere else...maybe on tile or square
    private canTileBeUpdated(tile: IGameTile, currentTurn: number) {
        return (tile.TurnPlayed == null || tile.TurnPlayed == currentTurn);
    }

    render() {
        let board = [];

        for (var currentRow = 0; currentRow < this.props.rows; currentRow++) {
            board.push(this.createRow(currentRow, this.props.columns));
        }

        // TODO: Make a section for 'special tiles'
        return (
            <div className='boardContainer'>
                <Inventory dice={GetSpeicalDice()} onDiceSelected={this.updateSelectedDice.bind(this)} />
                <button onClick={this.rollDice.bind(this)} className='rollButton'>Roll Dice</button>
                <Inventory dice={this.state.rolledDice} onDiceSelected={this.updateSelectedDice.bind(this)}/>
                {board}
            </div>
        );
    }
}