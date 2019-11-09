import * as React from 'react';
import './styles/square.scss';
import { TileType } from '../game/Enums';
import { Tile } from './tile';

// TODO: Figure out how you are suppose to use React state
interface ISquareState {
    selected: boolean;
    tile: TileType;
}

interface ISquareProps {
    selectedTile: TileType;
}

export class Square extends React.Component<ISquareProps, ISquareState> {
    constructor(props: ISquareProps) {
        super(props);
        this.state = {
            selected: false,
            tile: TileType.Overpass //TODO: Support the concept of none
        }
    }
    
    changeSelected() {
        const isSelected = !this.state.selected;
        this.setState({selected: isSelected, tile: this.props.selectedTile})
    }

    drawTile(tile: TileType) {
        console.log("draw tile on square: " + tile);
        return ;
        //return <span>{tile}</span>
    }

    drawRotate()
    {
        return; // TODO: Figure out how to rotate tile
       if(this.state.selected)
       {
            return (
                <div 
                    className='rotateButton' 
                    onClick={this.rotateSquare.bind(this)} 
                ></div>
            );
       }

       return <div></div>;
    }

    rotateSquare() {
        console.log("rotate click event");
    }

    render() {
        return (
            <div 
                className='square' 
                onClick={this.changeSelected.bind(this)}
            >
                {this.drawRotate()}
                <Tile tile={this.state.tile} />
            </div>
        );
    }
}