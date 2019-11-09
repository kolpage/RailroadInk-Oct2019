import * as React from 'react';
import {Square} from './square';
import {Inventory} from './inventory';
import './styles/board.scss';
import './styles/inventory.scss';
import { TileType } from '../common/Enums';

interface IBoardProps {
    rows: number;
    columns: number;
    dice: TileType[];
}

interface IBoardState {
    selectedDice: TileType; 
}

export class Board extends React.Component<IBoardProps, IBoardState> {
    constructor(props: IBoardProps) {
        super(props);
        this.state = {
            selectedDice: TileType.Empty, 
        }
    }
    
    updateSelectedDice(dice: TileType) {
        this.setState({selectedDice: dice});
    }

    createRow(numberOfCells: number): React.ReactElement {
        let row = [];
        for (var i = 0; i < numberOfCells; i++) {
            row.push(<Square selectedTile={this.state.selectedDice}/>);
        }
        return (
            <div className='row'>
                {row}
            </div>
        );
    }

    render() {
        let board = [];

        board.push(<Inventory dice={this.props.dice} onDiceSelected={this.updateSelectedDice.bind(this)}/>);

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