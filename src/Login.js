import axios from 'axios';
import React, { useState } from 'react';
import { setUserSession } from './Utils/Common';

function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const url = process.env.NODE_ENV === 'production' ? '' : 'http:localhost:3001';

    const handleLogin = () => {
        setError(null);
        axios.post(url + '/signin', 
        { email: email,
          password: password
        }).then((response) => {
            if (!response.data.error) {
                console.log(response);
                setUserSession(response.data.token, response.data.user);
                props.history.push('/form');
            } else {
                alert("Wrong email/password combination!");
            }  
        }).catch(error => {
            console.log(error);
            if(error.response && error.response.status === 401) setError(error.response.data.message);
            else setError("Something went wrong. Please try again later.");
        });
    }

    return (
        <div className="login">
            <h>User Login</h><br />
            <div id="inputFields">
                <div id="email">
                    <label className="required">Email Id</label><br />
                    <input type="email" required onChange={(e) => setEmail(e.target.value)} /><br/>
                </div>
                <div id="pswd">
                    <label className="required">Password</label><br />
                    <input type="password" required onChange={(e) => setPassword(e.target.value)} /><br />
                </div>
                {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
                <button id="button" onClick={handleLogin}>LOGIN</button>
            </div>
        </div>
    );
}

export default Login;
