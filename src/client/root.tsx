import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Board} from './board';

const Index = () => {
    return <Board key="board" columns={7} rows={7} />;
};

ReactDOM.render(<Index />, document.getElementById('app'));