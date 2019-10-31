import * as React from 'react';
import {Square} from './square';
import './styles/board.scss'
import './styles/inventory.scss'

interface IBoardProps {
    rows: number;
    columns: number;
}

export class Board extends React.Component<IBoardProps> {
    createInventory(): React.ReactElement {
        return <div className='inventory'>
            {this.createRow()}
        </div>
    }
    
    createRow(): React.ReactElement {
        let row = [];
        for (var i = 0; i < this.props.columns; i++) {
            row.push(<Square />);
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
            board.push(this.createRow());
        }
        return (
            <div>
                {board}
            </div>
        );
    }
}