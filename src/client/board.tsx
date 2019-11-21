import * as React from 'react';
import {Square} from './square';
import {Inventory} from './inventory';
import './styles/board.scss';
import './styles/inventory.scss';
import { TileType } from '../common/Enums';
import {RollDice} from './GameServices';
import { GameBoard, GameTile, IGameTile } from './GameModels';

interface IBoardProps {
    rows: number;
    columns: number;
    gameBoard: GameBoard;
    
}

interface IBoardState {
    selectedDice: TileType;
    rolledDice: TileType[]; // TODO: This should just be gotten from the server
    gameBoard: GameBoard;
    gameTurn: number;
}

export class Board extends React.Component<IBoardProps, IBoardState> {
    constructor(props: IBoardProps) {
        super(props);
        this.state = {
            selectedDice: TileType.Empty, 
            rolledDice: RollDice(),
            gameBoard: this.props.gameBoard,
            gameTurn: 1
        }
    }
    
    private rollDice() {
        this.setState({selectedDice: this.state.selectedDice, rolledDice: RollDice(), gameBoard: this.state.gameBoard, gameTurn: this.state.gameTurn+1});
    }

    private createRow(rowPosition: number, numberOfCells: number): React.ReactElement {
        let row = [];
        for (var currentColumn = 0; currentColumn < numberOfCells; currentColumn++) {
            const tile = this.props.gameBoard.getTile(currentColumn, rowPosition);
            const cellKey = `${currentColumn}${rowPosition}`
            const isSquareLocked = !this.canTileBeUpdated(tile, this.state.gameTurn);
            row.push(<Square gameTile={tile} updateSquare={this.updateSquareTileType.bind(this)} rotateSquare={this.rotateSquareTile.bind(this)} clearSquare={this.clearSquareTile.bind(this)} isLocked={isSquareLocked} sqaureColumn={currentColumn} squareRow={rowPosition} key={cellKey} />);
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
    private updateSquareTileType(squareColumn: number, squareRow: number) {
        const updatedTile = this.state.gameBoard.getTile(squareColumn, squareRow);
        updatedTile.Type = this.state.selectedDice;
        updatedTile.TurnPlayed = this.state.gameTurn;
        this.state.gameBoard.setTile(updatedTile, squareColumn, squareRow);
        this.setState({selectedDice: this.state.selectedDice, rolledDice: this.state.rolledDice, gameBoard: this.state.gameBoard, gameTurn: this.state.gameTurn});      
    }

    private rotateSquareTile(squareColumn: number, squareRow: number) {
        let updatedTile = this.state.gameBoard.getTile(squareColumn, squareRow);
        updatedTile.RotateTile();
        this.state.gameBoard.setTile(updatedTile, squareColumn, squareRow);
        this.setState({selectedDice: this.state.selectedDice, rolledDice: this.state.rolledDice, gameBoard: this.state.gameBoard, gameTurn: this.state.gameTurn});
    }

    private clearSquareTile(squareColumn: number, squareRow: number) {
        const emptyTile = new GameTile();
        this.state.gameBoard.setTile(emptyTile, squareColumn, squareRow);
        this.setState({selectedDice: this.state.selectedDice, rolledDice: this.state.rolledDice, gameBoard: this.state.gameBoard, gameTurn: this.state.gameTurn});
    
    }

    private updateSelectedDice(dice: TileType) {
        this.setState({selectedDice: dice, rolledDice: this.state.rolledDice, gameBoard: this.state.gameBoard, gameTurn: this.state.gameTurn});
    }
    // #endregion

    // TODO: This should leave somewhere else...maybe on tile or square
    private canTileBeUpdated(tile: IGameTile, currentTurn: number) {
        return (tile.TurnPlayed == null || tile.TurnPlayed == currentTurn);
    }

    render() {
        let board = [];
        const specialDice = [TileType.SpecialAllRail, TileType.SpecialThreeRailOneRoad, TileType.SpecialRoadRailAcross, TileType.SpecialThreeRoadOneRail, TileType.SpecialAllRoad, TileType.SpecialRoadRailAdjacent];
    
        for (var currentRow = 0; currentRow < this.props.rows; currentRow++) {
            board.push(this.createRow(currentRow, this.props.columns));
        }

        // TODO: Make a section for 'special tiles'
        return (
            <div className='boardContainer'>
                <Inventory dice={specialDice} onDiceSelected={this.updateSelectedDice.bind(this)} />
                <button onClick={this.rollDice.bind(this)} className='rollButton'>Roll Dice</button>
                <Inventory dice={this.state.rolledDice} onDiceSelected={this.updateSelectedDice.bind(this)}/>
                {board}
            </div>
        );
    }
}