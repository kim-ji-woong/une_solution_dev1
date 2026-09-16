import React from 'react';
import { DashboardComponent } from '../styled/dashboardStyled';

import BoardView from './boardView';
import BoardWeekly from './boardWeekly';
import BoardRealTime from './boardRealTime';
import BoardAgencyEvent from './boardAgencyEvent';

const Dashboard = () => {
    
    return (
        <DashboardComponent>
            <BoardView />
            <BoardAgencyEvent />
            <BoardWeekly />
            <BoardRealTime />
        </DashboardComponent>
    );
};

export default Dashboard;