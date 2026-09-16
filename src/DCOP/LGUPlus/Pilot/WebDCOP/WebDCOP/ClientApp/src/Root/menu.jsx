import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import ProjectResource from './resource/id';

import Layout from './layout';
import Dashboard from '../Dashboard/ui/dashboard';
import Main from '../Main/ui/main';

class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dashboardEvent: {},
            mainEvent: {}
        }

        this.initSiteID();
        this.wsMgr = null;
    }

    async initSiteID() {
        const user = await ProjectResource.initUserInfo();

        if (user === null || user === undefined) {
             // 로그인 정보가 없으면 로그인 페이지로 이동
            this.props.history.push('/');
        }
    }

    getTargetEvent() {
        const path = window.location.pathname;

        if (path.length > 0) {
            const target = path.substring(1).toLowerCase();

            if (path === ProjectResource.path.dashboard)
                return [this.state.dashboardEvent, target];
            else if (path === ProjectResource.path.main)
                return [this.state.mainEvent, target];
        }

        return [null, ""];
    }

    setWebSocket = (wsMgr) => {
        this.wsMgr = wsMgr;
    }

    getWebSocket = () => {
        return this.wsMgr;
    }

    getRoutePath = () => {
        return (<React.Fragment>
            <Route path={ProjectResource.path.dashboard} render={() => <Dashboard menuEvent={this.state.dashboardEvent} setWebSocket={this.setWebSocket} />} />
            <Route path={ProjectResource.path.main} render={() => <Main menuEvent={this.state.mainEvent} getWebSocket={this.getWebSocket} />} />
        </React.Fragment>);
    }

    render() {
        const [targetEvent, target] = this.getTargetEvent();

        return (
            <Layout menuEvent={targetEvent} target={target}>
                {
                    this.getRoutePath()
                }
            </Layout>
        );
    }
}

export default withRouter(Menu);