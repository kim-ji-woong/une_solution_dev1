import React from 'react';

import { NavigationBarComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import nav_home from '../../images/nav_home.svg';
import nav_back from '../../images/nav_back.svg';

function NavigationBar(props) {

    const getQuickButtonClassName = (name) => {
        if (props.visiblePopups[name]) {
            return 'on';
        }

        return 'off';
    }

    return (
        <NavigationBarComponent>
            <ul>
                <li>
                    <ul className='navList'>
                        <li data-title="센서현황">
                            <button id={"dsBot_" + SdmsResource.popupLayer.statusInfo} className={getQuickButtonClassName(SdmsResource.ID.menu.statusInfo) + " " + 'statusInfoIcon'} />
                        </li>
                        <li data-title="이벤트현황">
                            <button id={"dsBot_" + SdmsResource.popupLayer.dashboard} className={getQuickButtonClassName(SdmsResource.ID.menu.event) + " " + 'eventIcon'} />
                        </li>
                    </ul>
                </li>
                <li className='navHomeBtn' data-title="초기화면">
                    <button><img src={true ? nav_home : nav_back}></img></button>
                </li>
                <li>
                    <ul className='navList'> 
                        <li data-title="미니맵">
                            <button id={"dsBot_" + SdmsResource.popupLayer.miniMap} className={getQuickButtonClassName(SdmsResource.ID.menu.miniMap) + " " + 'miniMapIcon'} />
                        </li>
                        <li data-title="확산시뮬레이션">
                            <button id={"dsBot_" + SdmsResource.popupLayer.simulation} className={getQuickButtonClassName(SdmsResource.ID.menu.simulation) + " " + 'simulationIcon'} />
                        </li>
                    </ul>
                </li>
            </ul>
        </NavigationBarComponent>
    );
}

export default NavigationBar;