import React from "react";
import ReactDOM from "react-dom";
import {Content} from './pages/Content';

const app = document.createElement('div');
app.id = "keep-track-circleci-root";
document.body.appendChild(app);

ReactDOM.render(<Content />, app);
