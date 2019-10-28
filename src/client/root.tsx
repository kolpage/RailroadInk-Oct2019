import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Square} from './square';

const Index = () => {
    return <Square />;
};

ReactDOM.render(<Index />, document.getElementById('app'));