import React from 'react';
import { Redirect, Route } from 'react-router';
import { getToken } from './Common';

function PrivateRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => getToken() ? <Component {...props} /> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />}
        />
    )
}

export default PrivateRoute;