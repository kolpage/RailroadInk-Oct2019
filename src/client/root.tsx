import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Board} from './board';

const Index = () => {
    // TODO: Get the real state from the server
    const fakeState = { 
        numBoardColumns: 7,
        numBoardRows: 7,
        dice: ['Black','Green','Yellow','Red']
    }
    return <Board key="board" columns={fakeState.numBoardColumns} rows={fakeState.numBoardRows} dice={fakeState.dice}/>;
};

ReactDOM.render(<Index />, document.getElementById('app'));