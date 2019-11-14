import * as React from 'react';
import {Square} from './square';
import {Inventory} from './inventory';
import './styles/board.scss';
import './styles/inventory.scss';
import { TileType } from '../common/Enums';
import {RollDice} from './GameServices';

interface IBoardProps {
    rows: number;
    columns: number;
}

interface IBoardState {
    selectedDice: TileType;
    rolledDice: TileType[]; // TODO: This should just be gotten from the server
}

export class Board extends React.Component<IBoardProps, IBoardState> {
    constructor(props: IBoardProps) {
        super(props);
        this.state = {
            selectedDice: TileType.Empty, 
            rolledDice: RollDice()
        }
    }
    
    updateSelectedDice(dice: TileType) {
        this.setState({selectedDice: dice, rolledDice: this.state.rolledDice});
    }

    rollDice() {
        this.setState({selectedDice: this.state.selectedDice, rolledDice: RollDice()});
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
        // TODO: Make a section for 'special dice' 
        const specialDice = [TileType.SpecialAllRail, TileType.SpecialThreeRailOneRoad, TileType.SpecialRoadRailAcross, TileType.SpecialThreeRoadOneRail, TileType.SpecialAllRoad, TileType.SpecialRoadRailAdjacent];
        board.push(<Inventory dice={specialDice} onDiceSelected={this.updateSelectedDice.bind(this)}/>);
        board.push(<button onClick={this.rollDice.bind(this)} className='rollButton'>Roll Dice</button>);
        board.push(<Inventory dice={this.state.rolledDice} onDiceSelected={this.updateSelectedDice.bind(this)}/>);

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