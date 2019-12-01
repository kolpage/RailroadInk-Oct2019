import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Board } from './Components/Board';
import { GetBoard } from './GameServices';

const Index = () => {
    return <Board key="board" gameBoard={GetBoard()} />;
};

ReactDOM.render(<Index />, document.getElementById('app'));