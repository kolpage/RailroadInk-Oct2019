import * as React from 'react';
import {Square} from './square';
import {Inventory} from './inventory';
import './styles/board.scss';
import './styles/inventory.scss';

interface IBoardProps {
    rows: number;
    columns: number;
    dice:string[];
}

export class Board extends React.Component<IBoardProps> {
  
    createRow(numberOfCells: number): React.ReactElement {
        let row = [];
        for (var i = 0; i < numberOfCells; i++) {
            row.push(<Square />);
        }
        return (
            <div className='row'>
                {row}
            </div>
        );
    }

    render() {
        let board = [];

        board.push(<Inventory dice={this.props.dice}/>);

        for (var i = 0; i < this.props.rows; i++) {
            board.push(this.createRow(this.props.columns));
        }

        return (
            <div className='boardContainer'>
                {board}
            </div>
        );
    }
}