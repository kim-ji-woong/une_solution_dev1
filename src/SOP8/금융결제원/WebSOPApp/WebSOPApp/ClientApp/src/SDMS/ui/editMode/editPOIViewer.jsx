import React, { useState } from 'react';
import { EditPOIViewerComponent } from '../../styled/sdmsPopupsStyled';
import { PoiManager } from '../3D/poi/poiManager';
import Icon from '../../../Common/components/Icon/Icon';

function EditPOIViewer(props) {

    const setVisiblePoi = (sensorType) => {
        props.setVisiblePoi(sensorType, !props.visibleSensorTypes[sensorType]);
    };

    const toggleSensorGroup = (groupKey) => {
        const sensors = PoiManager.SENSOR_GROUP[groupKey];
        if (!sensors) return;

        // 그룹 내 하나라도 켜져 있으면 > 전체 OFF
        const isAnyOn = sensors.some(
            (key) => props.visibleSensorTypes[key]
        );

        const nextValue = !isAnyOn;

        const updated = { ...props.visibleSensorTypes };
        sensors.forEach((key) => {
            updated[key] = nextValue;
        });

        props.setVisibleSensorTypes(updated);
    };

    const isGroupOn = (groupKey) => {
        const sensors = PoiManager.SENSOR_GROUP[groupKey];
        if (!sensors) return false;

        return sensors.some(
            (key) => props.visibleSensorTypes[key]
        );
    };

    return (
        <EditPOIViewerComponent id={props.popupType} className='UI_Section editMode_poiViewer' $resize={false}>
            <div className='content'>
                <div className='buttonWrap'>
                    <button
                        className={isGroupOn("CCTV") ? "on" : null}
                        onClick={() => toggleSensorGroup("CCTV")}
                        data-tooltip="CCTV"
                    >
                        <Icon.StatusInfoCCTV size={"xxs"} />
                    </button>
                    <button
                        className={props.visibleSensorTypes[PoiManager.EmergencyBell_Sensor] ? 'on' : null}
                        onClick={() => setVisiblePoi(PoiManager.EmergencyBell_Sensor)}
                        data-tooltip="비상벨"
                    >
                        <Icon.StatusInfoEmergencyBell size={"xxs"} />
                    </button>
                    <button
                        className={props.visibleSensorTypes[PoiManager.DOOR_Sensor] ? 'on' : null}
                        onClick={() => setVisiblePoi(PoiManager.DOOR_Sensor)}
                        data-tooltip="출입문"
                    >
                        <Icon.StatusInfoDOOR size={"xxs"} />
                    </button>
                    <button
                        className={isGroupOn("INVASION") ? "on" : null}
                        onClick={() => toggleSensorGroup("INVASION")}
                        data-tooltip="침입"
                    >
                        <Icon.StatusInfoInvasion size={"xxs"} />
                    </button>
                </div>
            </div>
        </EditPOIViewerComponent>
    );
}

export default EditPOIViewer;