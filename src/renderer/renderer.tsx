/**
 * React renderer.
 */
// Import the styles here to process them with webpack
import '_public/style.css';

import {} from '_types/global-types';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app';

ReactDOM.render(<App />, document.getElementById('app'));
