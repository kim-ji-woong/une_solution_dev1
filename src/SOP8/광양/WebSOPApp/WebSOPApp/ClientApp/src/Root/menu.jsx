import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import ProjectResource from './resource/id';

import Layout from './layout';
import SDMS from '../SDMS/ui/sdms';
import History from '../History/ui/history';
import TeamEditor from '../TeamEditor/ui/teamEditor';
import SopSimulator from '../SOPSimulator/ui/sopSimulator';
import SopManager from '../SOPManager/ui/sopManager';
import SensorSimulator from '../SensorSimulator/sensorSimulator';

function Menu(props) {
    const [sdmsEvent, setSdmsEvent] = useState({});
    const [historyEvent, setHistoryEvent] = useState({});
    const [teamEditorEvent, setTeamEditorEvent] = useState({});
    const [sopSimulatorEvent, setSopSimulatorEvent] = useState({});
    const [sopManagerEvent, setSopManagerEvent] = useState({});
    const [sensorSimulatorEvent, setSensorSimulatorEvent] = useState({});


    const getTargetEvent = () => {
        const path = window.location.pathname;

        if (path.length > 0) {
            const target = path.substring(1).toLowerCase();

            if (path === ProjectResource.path.sdms) 
                return [sdmsEvent, target];
            else if (path === ProjectResource.path.history) 
                return [historyEvent, target];
            else if (path === ProjectResource.path.teamEditor) 
                return [teamEditorEvent, target];
            else if (path === ProjectResource.path.sopSimulator) 
                return [sopSimulatorEvent, target];
            else if (path === ProjectResource.path.sopManager) 
                return [sopManagerEvent, target];
            else if (path === ProjectResource.path.sensorSimulator) 
                return [sensorSimulatorEvent, target];
        }

        return [null, ""];
    }

    const getRoutePath = () => {
        return (<React.Fragment>
            <Route path={ProjectResource.path.sdms} render={() => <SDMS menuEvent={sdmsEvent} setSdmsEvent={setSdmsEvent} />} />
            <Route path={ProjectResource.path.history} render={() => <History menuEvent={historyEvent} />} />
            <Route path={ProjectResource.path.teamEditor} render={() => <TeamEditor menuEvent={teamEditorEvent} />} />
            <Route path={ProjectResource.path.sopSimulator} render={() => <SopSimulator menuEvent={sopSimulatorEvent} />} />
            <Route path={ProjectResource.path.sopManager} render={() => <SopManager menuEvent={sopManagerEvent} />} />
            <Route path={ProjectResource.path.sensorSimulator} render={() => <SensorSimulator menuEvent={sensorSimulatorEvent} />} />
        </React.Fragment>);
    }

    const [targetEvent, target] = getTargetEvent();
        
    return (
        <Layout 
            menuEvent={targetEvent} 
            target={target}
        >
            {
                getRoutePath()
            }
        </Layout>
    );
}

export default withRouter(Menu);