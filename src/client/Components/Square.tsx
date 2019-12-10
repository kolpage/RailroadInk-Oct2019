import * as React from 'react';
import '../styles/square.scss';
import { Tile } from './Tile';
import { IGameTile } from '../Models/GameTile';

const RefreshArrowIcon = require("../Assests/RefreshArrow.png")
const RemoveIcon = require("../Assests/RemoveCrop.png")

interface ISquareProps {
    // TODO: Use Move instead of IGameTile & rc
    gameTile: IGameTile;
    currentGameTurn: number; // TODO: Pass in this infomration in a better way
    playSquare: (squareColumn: number, squareRow: number) => void;
    rotateSquare: (squareColumn: number, squareRow: number) => void;
    clearSquare: (squareColumn: number, squareRow: number) => void;
    mirrorSquare: (squareColumn: number, squareRow: number) => void;

    sqaureColumn: number;
    squareRow: number;
}

export class Square extends React.Component<ISquareProps> {
    constructor(props: ISquareProps) {
        super(props);
        this.bindFunction();
    }

    private bindFunction() {
        this.playSelectedTile = this.playSelectedTile.bind(this);
        this.rotateSquare = this.rotateSquare.bind(this);
    }

    playSelectedTile() {
        if(this.isSquarePlayable()) {
            this.props.playSquare(this.props.sqaureColumn, this.props.squareRow);
            return true;
        }
        return false;
    }

    drawMirrorButton() {
       if(this.isSquareActive() && this.props.gameTile.CanTileBeMirror())
       {
            return (
                <div 
                    onClick={this.mirrorSquare.bind(this)} 
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

    private isSquarePlayable() {
        return this.props.gameTile.IsTileEmpty() && this.canSqaureBeUpdted();
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
        if (this.isSquareActive()) { 
            this.props.rotateSquare(this.props.sqaureColumn, this.props.squareRow);
        }
    }

    mirrorSquare() {
        if (this.isSquareActive() && this.props.gameTile.CanTileBeMirror()) {
            this.props.mirrorSquare(this.props.sqaureColumn, this.props.squareRow);
        }
    }

    private handleDragOver(e) {
        e.preventDefault();
    }

    private handleDragDrop(e) {
        e.preventDefault();
        return this.playSelectedTile();
    }

    render() {
        return (
            <div className='square'>
                {this.drawMirrorButton()}
                {this.drawRemoveButton()}
                <div className='turnNumber'>{this.props.gameTile.TurnPlayed}</div>
                <div onClick={this.playSelectedTile} 
                     onContextMenu={this.rotateSquare}
                     onDragOver={this.handleDragOver.bind(this)}
                     onDrop={this.handleDragDrop.bind(this)}>
                    <Tile tile={this.props.gameTile} />
                </div>
            </div>
        );
    }
}