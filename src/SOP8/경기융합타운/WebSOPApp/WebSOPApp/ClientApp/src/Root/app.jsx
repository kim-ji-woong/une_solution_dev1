import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Menu from './menu';
import LoginPage from '../Account/ui/loginPage';
import AccountFindPwd from '../Account/ui/accountFindPwd';

import ProjectResource from './resource/id';

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path={ProjectResource.path.root} component={LoginPage} />
                <Route path={ProjectResource.path.findPassword} component={AccountFindPwd} />
                <Route path={ProjectResource.path.sdms} component={Menu} />
                <Route path={ProjectResource.path.history} component={Menu} />
                <Route path={ProjectResource.path.teamEditor} component={Menu} />
                <Route path={ProjectResource.path.sopSimulator} component={Menu} />
                <Route path={ProjectResource.path.sopManager} component={Menu} />
                <Route path={ProjectResource.path.dashboard} component={Menu} />
            </Switch>
        </Router>

    );
}

export default App;
