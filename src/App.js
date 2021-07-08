import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, NavLink } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import Form from './Form';
import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';
import { getToken, removeUserSession, setUserSession } from './Utils/Common';
import './App.css';

function App() {

  const [authLoading, setAuthLoading] = useState(true);
  const url = process.env.NODE_ENV === 'production' ? '' : 'http:localhost:3001';

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const token = getToken();
    if(!token) {
      return;
    }
    axios.get(url + `/verifyToken?token=${token}`, {
      headers: {
        "authorization": sessionStorage.getItem("token")
      }
    }).then((response) => {
      if (response.data.loggedIn === true) {
        console.log(response);
        setUserSession(response.data.token, response.data.user);
        setAuthLoading(false);
      } else {
        removeUserSession();
        setAuthLoading(false);
      }
    }).catch(error => {
      removeUserSession();
      setAuthLoading(false);
    });
  }, []);

  if(authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>
  }

  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <div className="links">
            <NavLink exact activeClassName="active" to="/">Login</NavLink>
            <NavLink activeClassName="active" to="/form">Form</NavLink>
          </div>
          <div>
            <Switch>
              <PublicRoute exact path="/" component={Login} />
              <PrivateRoute exact path="/form" component={Form} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
