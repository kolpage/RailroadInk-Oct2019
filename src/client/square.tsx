import * as React from 'react';
import './styles/square.scss';
import { Tile } from './tile';
import { IGameTile } from './GameModels';

const RefreshArrowIcon = require("./Assests/RefreshArrow.png")
const RemoveIcon = require("./Assests/RemoveCrop.png")

interface ISquareProps {
    gameTile: IGameTile;
    currentGameTurn: number; // TODO: Pass in this infomration in a better way
    updateSquare: (squareColumn: number, squareRow: number) => void;
    rotateSquare: (squareColumn: number, squareRow: number) => void;
    clearSquare: (squareColumn: number, squareRow: number) => void;

    // TODO: This is not good. A gameboard square should not know its location but doing it for now so that the square 
    //       can tell the board what square needs to be updated. 
    sqaureColumn: number;
    squareRow: number;
}

export class Square extends React.Component<ISquareProps> {

    changeSelected() {
        if(this.canSqaureBeUpdted()) {
            this.props.updateSquare(this.props.sqaureColumn, this.props.squareRow);
        }
    }

    drawRotateButton() {
        // TODO: Only draw this icon if the tile can be roated
       if(this.isSquareActive())
       {
            return (
                <div 
                    onClick={this.rotateSquare.bind(this)} 
                    className='upperLeftButton'
                >
                    <figure>
                        <img src={RefreshArrowIcon} className='rotateButton' alt="rotate" />
                    </figure>
                </div>
            );
       }

       return <div></div>;
    }

    private canSqaureBeUpdted() {
        return (this.props.gameTile.TurnPlayed == null || this.props.gameTile.TurnPlayed == this.props.currentGameTurn);
    }

    private isSquareActive() {
        return this.canSqaureBeUpdted() && !this.isSquareEmpty();
    }

    private isSquareEmpty() {
        return this.props.gameTile.IsTileEmpty();
    }

    drawRemoveButton() {
        if(this.isSquareActive()) {
            return (
                <div 
                    onClick={this.removeTile.bind(this)} 
                    className='lowerRightButton'
                >
                    <figure>
                        <img src={RemoveIcon} className='removeButton' alt="remove" />
                    </figure>
                </div>
            );
        }
        return <div></div>;
    }

    removeTile() {
        this.props.clearSquare(this.props.sqaureColumn, this.props.squareRow);
    }

    rotateSquare() {
        if (!this.isSquareEmpty()) { 
            this.props.rotateSquare(this.props.sqaureColumn, this.props.squareRow);
        }
    }

    render() {
        return (
            <div className='square'>
                {this.drawRotateButton()}
                {this.drawRemoveButton()}
                <div className='turnNumber'>{this.props.gameTile.TurnPlayed}</div>
                <div onClick={this.changeSelected.bind(this)} onContextMenu={this.rotateSquare.bind(this)}>
                    <Tile tile={this.props.gameTile} />
                </div>
            </div>
        );
    }
}