import React from "react";
import {createRoot} from 'react-dom/client';
import {Content} from './pages';

const container = document.createElement('div');
container.id = "keep-track-circleci-root";
document.body.appendChild(container);

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Content />
  </React.StrictMode>,
);
