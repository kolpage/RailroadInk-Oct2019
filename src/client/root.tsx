import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Board} from './board';

const Index = () => {
    return <Board columns={7} rows={7} />;
};

ReactDOM.render(<Index />, document.getElementById('app'));