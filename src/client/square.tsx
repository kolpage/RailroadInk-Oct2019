import * as React from 'react';
import './styles/square.scss';
import { TileType, Orientation } from '../common/Enums';
import { Tile } from './tile';
import { IGameTile } from './GameModels';

const RefreshArrowIcon = require("./Assests/RefreshArrow.png")

interface ISquareState {
    // TODO: Push this state up into board
    selected: boolean;
}

interface ISquareProps {
    gameTile: IGameTile;
    isLocked: boolean; // TODO: think of a better name
    updateSquare: (squareColumn: number, squareRow: number) => void;
    rotateSquare: (squareColumn: number, squareRow: number) => void;

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

    drawRotateIcon()
    {
        // TODO: Only draw this icon if the tile can be roated
       if(!this.props.isLocked && (this.props.gameTile.Type != TileType.Empty))
       {
           // TODO: Use css class for styling image (some reason classes are not getting applied)
            return (
                <div 
                    onClick={this.rotateSquare.bind(this)} 
                    className='rotateButton'
                >
                    <img src={RefreshArrowIcon} alt="rotate" width="20px" height="18px" />
                </div>
            );
       }

       return <div></div>;
    }

    rotateSquare() {
        if(!this.props.isLocked) {
            this.props.rotateSquare(this.props.sqaureColumn, this.props.squareRow);
        }
    }

    render() {
        return (
            <div className='square'>
                {this.drawRotateIcon()}
                <div onClick={this.changeSelected.bind(this)}>
                    <Tile tile={this.props.gameTile.Type} tileOrientation={this.props.gameTile.TileOrientation} />
                </div>
            </div>
        );
    }
}