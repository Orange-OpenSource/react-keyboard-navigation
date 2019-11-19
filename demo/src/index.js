import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { NavigationProvider } from '../../src';
import App from "./App";

ReactDOM.render(<NavigationProvider><App /></NavigationProvider>, document.getElementById("demo"));
