import React from 'react';
import { render } from 'react-dom';
import App from './app.jsx';

require('../../../resources/assets/scss/main.scss');

render(<App />, document.getElementById('container'));
