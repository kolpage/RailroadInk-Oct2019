import * as React from 'react';
import {Square} from './square';
import './styles/board.scss'

interface IBoardProps {
    rows: number;
    columns: number;
}

export class Board extends React.Component<IBoardProps> {
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