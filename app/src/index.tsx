import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Navbar from "./navbar"

function App() {
  return (
    <Router>
      <div>
        <Navbar/>

        <Switch>
          <Route path="/about">
            About
          </Route>
          <Route path="/users">
            Users
          </Route>
          <Route path="/">
            Home
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

ReactDOM.render(<App/>, document.getElementById('app'));
