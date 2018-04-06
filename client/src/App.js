import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import MakeSubject from './pages/makeSubject';
import DoSubject from './pages/doSubject';

const App = () => (
    <Router>
        <div>
            <ul>
                <li>
                    <Link to="/make">出题</Link>
                </li>
                <li>
                    <Link to="/do">答题</Link>
                </li>
            </ul>

            <hr/>

            <Route exact path="/make" component={MakeSubject} />
            <Route path="/do" component={DoSubject} />
        </div>
    </Router>
);

export default App;