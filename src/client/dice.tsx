import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './styles/square.scss';
import {Tile} from './tile'
import { TileType } from '../game/Enums';

interface IDiceProps {
    tile: TileType;
    onDiceSelected: (tile:TileType) => void;
}

export class Dice extends React.Component<IDiceProps> {
    diceSelected() {
        this.props.onDiceSelected(this.props.tile);
    }
    
    render() {
        return (
            <div 
                className='dice' 
                onClick={this.diceSelected.bind(this)}
            >
                <Tile tile={this.props.tile} />
            </div>
        );
    }
}

