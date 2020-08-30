import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { AuthContext } from './context/auth';
import AuthRoute from './components/AuthRoute';
import Home from './pages/Home';
import Login from './pages/Login';

import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('authenticated') || '');

  const setAuthenticated = (data) => {
    localStorage.setItem("authenticated", data);
    setIsAuthenticated(data);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      <Router>
        <Switch>
          <Route path='/login'>
            <Login />
          </Route>
          <AuthRoute exact path='/' component={Home} />
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
