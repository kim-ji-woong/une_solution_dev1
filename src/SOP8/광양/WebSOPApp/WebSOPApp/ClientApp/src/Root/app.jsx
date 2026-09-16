import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Menu from './menu';
import LoginPage from '../Account/ui/loginPage';
import ProjectResource from './resource/id';
import Toast from '../Common/components/Toast/toast';
import { ToastProvider } from '../Common/components/Toast/ToastProvider';

function App() {
    return (
        <ToastProvider>
            <Router>
                <Switch>
                    <Route exact path={ProjectResource.path.root} component={LoginPage} />
                    <Route path={ProjectResource.path.sdms} component={Menu} />
                    <Route path={ProjectResource.path.history} component={Menu} />
                    <Route path={ProjectResource.path.teamEditor} component={Menu} />
                    <Route path={ProjectResource.path.sopSimulator} component={Menu} />
                    <Route path={ProjectResource.path.sopManager} component={Menu} />
                    <Route path={ProjectResource.path.sensorSimulator} component={Menu} />
                </Switch>
            </Router>
            <Toast />
        </ToastProvider>
    );
}

export default App;
