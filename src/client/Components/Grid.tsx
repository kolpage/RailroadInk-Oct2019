import * as React from 'react';
import { Square } from './Square';
import { TileType, Orientation } from '../../common/Enums';
import { ExitTile, ExitTileSide } from './Tile';
import { GameBoard } from '../Models/GameBoard';
import { Move, GameTurn } from '../Models/GameTurn';
import { GameTile } from '../Models/GameTile';


interface IGridProps {
    gameBoard: GameBoard;
    gameTurn: GameTurn;

    addMoveToBoard: (move: Move) => void;
    updateMoveOnBoard: (move: Move) => void;
    clearMoveOnBoard: (move: Move) => void;
    transferMove: (srcMove: Move, destMove: Move) => void;
}

// TODO: Find a better name. This component represents the play area where you draw roads and rails. 
export class Grid extends React.Component<IGridProps> {
    constructor(props: IGridProps) {
        super(props);
        this.bindFunction();
    }

    private bindFunction() {
        this.playSelectedTile = this.playSelectedTile.bind(this);
        this.rotateSquareTile = this.rotateSquareTile.bind(this);
        this.clearSquareTile = this.clearSquareTile.bind(this);
        this.mirrorSquareTile = this.mirrorSquareTile.bind(this);
    }

    private playSelectedTile(move: Move) {
        this.props.addMoveToBoard(move); 
    }

    private rotateSquareTile(move: Move) {
        move.TilePlayed.RotateTile();
        this.props.updateMoveOnBoard(move);
    }

    private clearSquareTile(move: Move) {
        this.props.clearMoveOnBoard(move);
    }

    private mirrorSquareTile(move: Move) {
        move.TilePlayed.MirrorTile();
        this.props.updateMoveOnBoard(move);
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
            let move = this.props.gameTurn.Moves.GetMoveAtPosition(currentColumn, rowPosition);
            if(move == undefined){
                move = this.props.gameBoard.GetMove(currentColumn, rowPosition);
            }
            const cellKey = `${currentColumn}${rowPosition}`
            // TODO: Reduce the amount of parameters Square takes
            row.push(<Square move={move} playSquare={this.playSelectedTile} rotateSquare={this.rotateSquareTile} clearSquare={this.clearSquareTile} mirrorSquare={this.mirrorSquareTile} transferMove={this.props.transferMove} currentTurnNumber={this.props.gameTurn.TurnNumber} key={cellKey} />);
        }
        return (
            <div className='row' key={"gameBoardRow" + rowPosition}>
                {row}
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
        const roadTile = new GameTile(TileType.RoadStraight, this.props.boarderOrientation);
        const railTile = new GameTile(TileType.RailStraight, this.props.boarderOrientation);
        const emptyTile = new GameTile(TileType.Empty, this.props.boarderOrientation);
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
        const roadTile = new GameTile(TileType.RoadStraight, this.props.boarderOrientation);
        const railTile = new GameTile(TileType.RailStraight, this.props.boarderOrientation);
        const emptyTile = new GameTile(TileType.Empty, this.props.boarderOrientation);
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