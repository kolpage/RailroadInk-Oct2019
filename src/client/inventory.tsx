import * as React from 'react';
import {Dice} from './dice';
import './styles/inventory.scss';

interface IInventoryProps {
    dice:string[];
}

export class Inventory extends React.Component<IInventoryProps> {
    createRow(): React.ReactElement {
        let row = [];
        for (var i = 0; i < this.props.dice.length; i++) {
            row.push(<Dice color={this.props.dice[i]} />);
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