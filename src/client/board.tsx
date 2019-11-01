import * as React from 'react';
import {Square} from './square';
import {Dice} from './dice';
import './styles/board.scss'
import './styles/inventory.scss'

interface IBoardProps {
    rows: number;
    columns: number;
    dice:string[];
}

const createSquare = () => { return <Square />};
const createDice = (color:string, callback: any) => {return <Dice color={color} onDiceSelected={callback}/>};

export class Board extends React.Component<IBoardProps> {
    createInventory(): React.ReactElement {
        return <div className='inventory'>
            {this.createRow(4, createSquare) /* TODO: Pass in number of dice in inventory from board */} 
        </div>
    }
    
    createRow(numberOfCells: number, cellElement: ()=>React.ReactElement): React.ReactElement {
        let row = [];
        for (var i = 0; i < numberOfCells; i++) {
            row.push(cellElement());
        }
        return (
            <div className='row'>
                {row}
            </div>
        );
    }

    
    
    render () {
        let board = [];
        board.push(this.createInventory());
        for (var i = 0; i < this.props.rows; i++) {
            board.push(this.createRow(this.props.columns, createSquare));
        }
        return (
            <div className='boardContainer'>
                {board}
            </div>
        );
    }
}