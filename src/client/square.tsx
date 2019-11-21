import * as React from 'react';
import './styles/square.scss';
import { TileType, Orientation } from '../common/Enums';
import { Tile } from './tile';
import { IGameTile } from './GameModels';

const RefreshArrowIcon = require("./Assests/RefreshArrow.png")
const RemoveIcon = require("./Assests/Remove.png")


interface ISquareState {
    // TODO: Push this state up into board
    selected: boolean;
}

interface ISquareProps {
    gameTile: IGameTile;
    isLocked: boolean; // TODO: think of a better name
    updateSquare: (squareColumn: number, squareRow: number) => void;
    rotateSquare: (squareColumn: number, squareRow: number) => void;
    clearSquare: (squareColumn: number, squareRow: number) => void;

    // TODO: This is not good. A gameboard square should not know its location but doing it for now so that the square 
    //       can tell the board what square needs to be updated. Using something like Redux might clean this up. 
    sqaureColumn: number;
    squareRow: number;
}

export class Square extends React.Component<ISquareProps, ISquareState> {
    constructor(props: ISquareProps) {
        super(props);
        this.state = {
            selected: false,
        }
    }
    
    changeSelected() {
        if(!this.props.isLocked) {
            const isSelected = !this.state.selected;
            this.setState({selected: isSelected})
            this.props.updateSquare(this.props.sqaureColumn, this.props.squareRow);
        }
    }

    drawRotateButton() {
        // TODO: Only draw this icon if the tile can be roated
       if(this.isTileActive())
       {
            return (
                <div 
                    onClick={this.rotateSquare.bind(this)} 
                    className='rotateButton'
                >
                    <figure>
                        <img src={RefreshArrowIcon} alt="rotate" />
                    </figure>
                </div>
            );
       }

       return <div></div>;
    }

    private isTileActive() {
        return !this.props.isLocked && (this.props.gameTile.Type != TileType.Empty);
    }

    drawRemoveButton() {
        if(this.isTileActive()) {
            return (
                <div 
                    onClick={this.removeTile.bind(this)} 
                    className='removeButton'
                >
                    <figure>
                        <img src={RemoveIcon} alt="remove" />
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
        this.props.rotateSquare(this.props.sqaureColumn, this.props.squareRow);
    }

    render() {
        return (
            <div className='square'>
                {this.drawRotateButton()}
                {this.drawRemoveButton()}
                <div className='turnNumber'>{this.props.gameTile.TurnPlayed}</div>
                <div onClick={this.changeSelected.bind(this)}>
                    <Tile tile={this.props.gameTile.Type} tileOrientation={this.props.gameTile.TileOrientation} />
                </div>
            </div>
        );
    }
}