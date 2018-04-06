import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import MakeSubject from './pages/MakeSubject';
import DoSubject from './pages/DoSubject';

import './App.css';

const App = () => (
    <Router>
        <div>
            <Route exact path="/make" component={MakeSubject} />
            <Route path="/do" component={DoSubject} />
        </div>
    </Router>
);

export default App;