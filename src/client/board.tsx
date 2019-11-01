import * as React from 'react';
import {Square} from './square';
import {Inventory} from './inventory';
import './styles/board.scss';
import './styles/inventory.scss';

interface IBoardProps {
    rows: number;
    columns: number;
    dice: string[];
}

interface IBoardState {
    selectedDice: string; // TODO: right now dice are just a color string. This needs to be a real object
}

export class Board extends React.Component<IBoardProps, IBoardState> {
    constructor(props: IBoardProps) {
        super(props);
        this.state = {
            selectedDice: 'black', // TODO: Just default to first die for now. In the game, there should be a concept of no dice selected.
        }
    }
    
    updateSelectedDice(dice:string) {
        this.setState({selectedDice: dice});
    }

    createRow(numberOfCells: number): React.ReactElement {
        let row = [];
        for (var i = 0; i < numberOfCells; i++) {
            row.push(<Square selectionColor={this.state.selectedDice}/>);
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