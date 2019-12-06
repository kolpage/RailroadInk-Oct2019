import * as React from 'react';
import { Square } from './Square';
import { TileType, Orientation } from '../../common/Enums';
import { ExitTile, ExitTileSide } from './Tile';
import { GameBoard } from '../Models/GameBoard';
import { Move } from '../Models/GameTurn';
import { GameTile } from '../Models/GameTile';


interface IGridProps {
    gameBoard: GameBoard;
    gameTurn: number; // TODO: Use GameTurn object

    addMoveToBoard: (move: Move) => void;
    updateMoveOnBoard: (move: Move) => void;
    clearMoveOnBoard: (move: Move) => void;
}

// TODO: Find a better name. This component represents the play area where you draw roads and rails. 
export class Grid extends React.Component<IGridProps> {
    private playSelectedTile(squareColumn: number, squareRow: number) {
        const tileToUpdate = this.props.gameBoard.GetTile(squareColumn, squareRow);
        const move = new Move(tileToUpdate, squareColumn, squareRow);
        this.props.addMoveToBoard(move);      
    }

    private rotateSquareTile(squareColumn: number, squareRow: number) {
        let tileToRotate = this.props.gameBoard.GetTile(squareColumn, squareRow);
        tileToRotate.RotateTile();
        const move = new Move(tileToRotate, squareColumn, squareRow);
        this.props.updateMoveOnBoard(move);
    }

    private clearSquareTile(squareColumn: number, squareRow: number) {
        let tileToClear = this.props.gameBoard.GetTile(squareColumn, squareRow);
        const move = new Move(tileToClear, squareColumn, squareRow);
        this.props.clearMoveOnBoard(move);
    }

    private mirrorSquareTile(squareColumn: number, squareRow: number) {
        let tileToMirror = this.props.gameBoard.GetTile(squareColumn, squareRow);
        tileToMirror.MirrorTile();
        const move = new Move(tileToMirror, squareColumn, squareRow);
        this.props.updateMoveOnBoard(move);
    }

    private buildPlayAreaGrid() {
        let board = [];

        for (var currentRow = 0; currentRow < this.props.gameBoard.numberOrRows; currentRow++) {
            board.push(this.createRow(currentRow, this.props.gameBoard.numberOfColumns));
        }

        return board;
    }

    private createRow(rowPosition: number, numberOfCells: number): React.ReactElement {
        let row = [];
        for (var currentColumn = 0; currentColumn < numberOfCells; currentColumn++) {
            const tile = this.props.gameBoard.GetTile(currentColumn, rowPosition);
            const cellKey = `${currentColumn}${rowPosition}`
            // TODO: Reduce the amount of parameters Square takes
            row.push(<Square gameTile={tile} updateSquare={this.playSelectedTile.bind(this)} rotateSquare={this.rotateSquareTile.bind(this)} clearSquare={this.clearSquareTile.bind(this)} mirrorSquare={this.mirrorSquareTile.bind(this)} currentGameTurn={this.props.gameTurn} sqaureColumn={currentColumn} squareRow={rowPosition} key={cellKey} />);
        }
        return (
            <div className='row' key={"gameBoardRow" + rowPosition}>
                {row}
            </div>
        );
    }

    render() {
        return (
            <div className='row'>
                <GridBoarder boarderOrientation={Orientation.left}/>
                <div>
                    <GridBoarder boarderOrientation={Orientation.up}/>
                    {this.buildPlayAreaGrid()}
                    <GridBoarder boarderOrientation={Orientation.down}/>
                </div>
                <GridBoarder boarderOrientation={Orientation.right}/>
            </div>
        );
    }

}

// TODO: This should probably be in its own file (though it doesn't seem to have much reuse outside of how Grid is using it)
interface IGridBoarderProps {
    boarderOrientation: Orientation
}

export class GridBoarder extends React.Component<IGridBoarderProps> {
    private drawBoarder(): React.ReactElement {
        const roadTile = new GameTile(TileType.RoadStraight);
        const railTile = new GameTile(TileType.RailStraight);
        const emptyTile = new GameTile(TileType.Empty);
        return (
            <div className='row'>
                <ExitTile tile={emptyTile} />
                <ExitTile tile={roadTile} />
                <ExitTile tile={emptyTile} />
                <ExitTile tile={railTile} />
                <ExitTile tile={emptyTile} />
                <ExitTile tile={roadTile} />
            </div>
        );
    }

    private drawSideBoarder(): React.ReactElement {
        const roadTile = new GameTile(TileType.RoadStraight, Orientation.right);
        const railTile = new GameTile(TileType.RailStraight, Orientation.right);
        const emptyTile = new GameTile(TileType.Empty, Orientation.right);
        return (
            <div className='sideExitBoarder'>
                <ExitTileSide tile={emptyTile} />
                <ExitTileSide tile={railTile} />
                <ExitTileSide tile={emptyTile} />
                <ExitTileSide tile={roadTile} />
                <ExitTileSide tile={emptyTile} />
                <ExitTileSide tile={railTile} />
                <ExitTileSide tile={emptyTile} />
            </div>
        );
    }
    
    render() {
        if (this.props.boarderOrientation === Orientation.left || this.props.boarderOrientation === Orientation.right) {
            return this.drawSideBoarder();
        } else {
            return this.drawBoarder();
        }
    }
}