import React, { useEffect, useRef } from 'react';

import { NavigationBarComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';

function NavigationBar(props) {

    useEffect(() => {

        // console.log(props.visiblePopups);
    }, [props.visiblePopups])

    const setVisiblePopups = (menu) => {
        props.setVisiblePopups(menu);
    }

    const getQuickButtonClassName = (name) => {
        if (props.visiblePopups[name]) {
            return 'on';
        }

        return 'off';
    }

    return (
        <NavigationBarComponent id={'dsSoulBot'}>
            <ul>
                <li key='Navigation_statusInfo' 
                    id={"dsBot_" + SdmsResource.popupLayer.statusInfo}
                    className={getQuickButtonClassName(SdmsResource.ID.menu.statusInfo) + " " + 'statusInfoIcon'} 
                    onClick={() => setVisiblePopups(SdmsResource.ID.menu.statusInfo)}
                >
                    <div><span>현황<br />정보</span></div>
                </li>
                <li key='Navigation_dashboard' 
                    id={"dsBot_" + SdmsResource.popupLayer.dashboard}
                    className={getQuickButtonClassName(SdmsResource.ID.menu.dashboard) + " " + 'dashboardIcon'} 
                    onClick={() => setVisiblePopups(SdmsResource.ID.menu.dashboard)}
                >
                    <div><span>대시보드<br />요약창</span></div>
                </li>
                <li key='Navigation_event' 
                    id={"dsBot_" + SdmsResource.popupLayer.event}
                    className={getQuickButtonClassName(SdmsResource.ID.menu.event) + " " + 'eventIcon'} 
                    onClick={() => setVisiblePopups(SdmsResource.ID.menu.event)}
                >
                    <div><span>이벤트<br />정보</span></div>
                </li>
                <li key='Navigation_manualReport' 
                    id={"dsBot_" + SdmsResource.popupLayer.manualReport}
                    className={getQuickButtonClassName(SdmsResource.ID.menu.manualReport) + " " + 'manualReportIcon'} 
                    onClick={() => setVisiblePopups(SdmsResource.ID.menu.manualReport)}
                >
                    <div><span>수동<br />신고</span></div>
                </li>
            </ul>
        </NavigationBarComponent>
    );
}

export default NavigationBar;