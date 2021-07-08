import React from 'react';
import { Redirect, Route } from 'react-router';
import { getToken } from './Common';

function PublicRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => !getToken() ? <Component {...props} /> : <Redirect to={{ pathname: '/form' }} />}
        />
    )
}

export default PublicRoute;