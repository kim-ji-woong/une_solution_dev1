import React, { useState } from 'react';
import { EditPOIViewerComponent } from '../../styled/sdmsPopupsStyled';
import { PoiManager } from '../3D/poi/poiManager';
import Icon from '../../../Common/components/Icon/Icon';

function EditPOIViewer(props) {

    const setVisiblePoi = (sensorType) => {
        props.setVisiblePoi(sensorType, !props.visibleSensorTypes[sensorType]);
    };

    return (
        <EditPOIViewerComponent id={props.popupType} className='UI_Section editMode_poiViewer' $resize={false}>
            <div className='content'>
                <div className='buttonWrap'>
                    <button
                        className={props.visibleSensorTypes[PoiManager.Fire_Sensor] ? 'on' : null}
                        onClick={() => setVisiblePoi(PoiManager.Fire_Sensor)}
                        data-tooltip="화재"
                    >
                        <Icon.StatusInfoFire size={"xxxs"} />
                    </button>
                    <button
                        className={props.visibleSensorTypes[PoiManager.PSM_Sensor] ? 'on' : null}
                        onClick={() => setVisiblePoi(PoiManager.PSM_Sensor)}
                        data-tooltip="누출"
                    >
                        <Icon.StatusInfoPSM size={"xxxs"} />
                    </button>
                    <button
                        className={props.visibleSensorTypes[PoiManager.PM25] ? 'on' : null}
                        onClick={() => setVisiblePoi(PoiManager.PM25)}
                        data-tooltip="미세먼지"
                    >
                        <Icon.StatusInfoPM25 size={"xxs"} />
                    </button>
                    <button
                        className={props.visibleSensorTypes[PoiManager.MovingScanerPoi] ? 'on' : null}
                        onClick={() => setVisiblePoi(PoiManager.MovingScanerPoi)}
                        data-tooltip="이동식 스캐너"
                    >
                        <Icon.StatusInfoWorker size={"xxxs"} />
                    </button>
                    <button
                        className={props.visibleSensorTypes[PoiManager.Sump] ? 'on' : null}
                        onClick={() => setVisiblePoi(PoiManager.Sump)}
                        data-tooltip="집수정"
                    >
                        <Icon.StatusInfoSump size={"xxxs"} />
                    </button>
                    <button
                        className={props.visibleSensorTypes[PoiManager.Etc_Sensor] ? 'on' : null}
                        onClick={() => setVisiblePoi(PoiManager.Etc_Sensor)}
                        data-tooltip="ETC"
                    >
                        <Icon.StatusInfoETC size={"xxs"} />
                    </button>
                    <button
                        className={props.visibleSensorTypes[PoiManager.CCTV_Sensor] ? 'on' : null}
                        onClick={() => setVisiblePoi(PoiManager.CCTV_Sensor)}
                        data-tooltip="CCTV"
                    >
                        <Icon.StatusInfoCCTV size={"xxxs"} />
                    </button>
                </div>
            </div>
        </EditPOIViewerComponent>
    );
}

export default EditPOIViewer;