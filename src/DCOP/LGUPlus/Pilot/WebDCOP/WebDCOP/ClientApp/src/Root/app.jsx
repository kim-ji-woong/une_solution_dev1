import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import LoginPage from '../Account/ui/loginPage';
import Menu from './menu';

import RootResource from './resource/id';

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path={RootResource.path.root} component={LoginPage} />
                <Route path={RootResource.path.dashboard} render={() => <Menu />} />
                <Route path={RootResource.path.main} render={() => <Menu />} />
            </Switch>
        </Router>

    );
}

export default App;