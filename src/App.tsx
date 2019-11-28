import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './views/Home';

export default function App(): JSX.Element {
  return (
    <Router>
      <Route exact match="/">
        <Home />
      </Route>
      <Route match="*">NotFound</Route>
    </Router>
  );
}
