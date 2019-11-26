import * as React from 'react';
import {Dice} from './dice';
import './styles/inventory.scss';
import { IGameTile } from './GameModels';

interface IInventoryProps {
    dice: IGameTile[];
    onDiceSelected: (tile:IGameTile) => void; 
}

export class Inventory extends React.Component<IInventoryProps> {
    createRow(): React.ReactElement {
        let row = [];
        for (var i = 0; i < this.props.dice.length; i++) {
            // TODO: Don't use array index as key
            row.push(<Dice tile={this.props.dice[i]} onDiceSelected={this.props.onDiceSelected} key={i}/>);
        }

        return (
            <div className='row'>
                {row}
            </div>
        );
    }
    
    render() {
       return (
       <div className='inventory'>
            {this.createRow()} 
        </div>
        )
    }
}