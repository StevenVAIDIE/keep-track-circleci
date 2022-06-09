import React from "react";
import {createRoot} from "react-dom/client";
import {Popup} from './pages';

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
