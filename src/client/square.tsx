import * as React from 'react';
import './styles/square.scss';
import { TileType, Orientation } from '../common/Enums';
import { Tile } from './tile';

const RefreshArrowIcon = require("./Assests/RefreshArrow.png")

interface ISquareState {
    selected: boolean;
    tile: TileType;
    tileOrientation: Orientation;
}

interface ISquareProps {
    selectedTile: TileType;
}

export class Square extends React.Component<ISquareProps, ISquareState> {
    constructor(props: ISquareProps) {
        super(props);
        this.state = {
            selected: false,
            tile: TileType.Empty, 
            tileOrientation: Orientation.up
        }
    }
    
    changeSelected() {
        const isSelected = !this.state.selected;
        this.setState({selected: isSelected, tile: this.props.selectedTile, tileOrientation: this.state.tileOrientation})
    }

    drawRotate()
    {
        // TODO: This shouldn't depend on selected but on not being Empty
       if(this.state.selected)
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
        // TODO: Move enum "next" function to somewhere else
        let newOrientation = this.state.tileOrientation + 1;
        if(newOrientation >= Orientation._length) {
            newOrientation = 0;
        }
        this.setState({selected: this.state.selected, tile: this.state.tile, tileOrientation: newOrientation})
    }

    render() {
        return (
            <div className='square'>
                {this.drawRotate()}
                <div onClick={this.changeSelected.bind(this)}>
                    <Tile tile={this.state.tile} tileOrientation={this.state.tileOrientation} />
                </div>
            </div>
        );
    }
}