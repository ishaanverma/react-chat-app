import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { AuthContext } from './context/auth';
import { ChatInfoContext } from './context/chatInfo';
import AuthRoute from './components/AuthRoute';
import Home from './pages/Home';
import Login from './pages/Login';

import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('authenticated') || '');
  const [chatInfo, setChatInfo] = useState({
    username: localStorage.getItem('username') || '',
    chatId: '',
    chatName: '',
  });

  const setAuthenticated = (data) => {
    localStorage.setItem("authenticated", data);
    setIsAuthenticated(data);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      <ChatInfoContext.Provider value={{ chatInfo, setChatInfo }}>
        <Router>
          <Switch>
            <Route path='/login'>
              <Login />
            </Route>
            <AuthRoute exact path='/' component={Home} />
          </Switch>
        </Router>
      </ChatInfoContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
