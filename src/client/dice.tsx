import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './styles/square.scss';
import {Tile} from './tile'
import { TileType, Orientation } from '../common/Enums';
import { IGameTile } from './GameModels';

interface IDiceProps {
    tile: IGameTile;
    onDiceSelected: (tile:IGameTile) => void;
}

export class Dice extends React.Component<IDiceProps> {
    diceSelected() {
        this.props.onDiceSelected(this.props.tile);
    }
    
    render() {
        // TODO: Default the orientation of tile so that things that don't care don't need to pass in a value
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

