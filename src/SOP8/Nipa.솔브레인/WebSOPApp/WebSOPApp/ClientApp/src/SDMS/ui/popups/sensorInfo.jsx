import React, { useEffect } from 'react';
import { SensorInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import PopupDraggable from './popupDraggable';
import Icon from '../../../Common/components/Icon/Icon';

import FireSensorInfo from './sensors/fireSensorInfo';
import PSMSensorInfo from './sensors/psmSensorInfo';
import PMSensorInfo from './sensors/pmSensorInfo';
import MobileScannerInfo from './sensors/mobileScannerInfo';
import SumpSensorInfo from './sensors/sumpSensorInfo';
import ETCSensorInfo from './sensors/etcSensorInfo';

function SensorInfo(props) {
    useEffect(() => {
        if (!props.sensorDetailInfo.sensor) {
            props.reloadSensorDatas();
        }
    });

    const getNodataUI = () => (
        <div className="noData">
            <Icon.QuestionCircleIcon size="xs" fill={"grayscale.g500"} />
            <p>센서정보가 존재하지 않아요</p>
        </div>
    );

    const sensorName = props.sensorDetailInfo?.sensor?.sensor_name ?? '-';

    const renderContent = () => {
        // if (!props.sensorDetailInfo?.datas || props.sensorDetailInfo.datas.length === 0) {
        //     return getNodataUI();
        // }

        switch (props.sensorType) {
            case SdmsResource.facilityType.FIRE:
                return <FireSensorInfo {...props} />;
            case SdmsResource.facilityType.PSM_SENSOR:
                return <PSMSensorInfo {...props} />;
            case SdmsResource.facilityType.ETC:
                return <ETCSensorInfo {...props} />;
            case SdmsResource.facilityType.PM:
                return <PMSensorInfo {...props} />;
            case SdmsResource.facilityType.MOBILE_SCANNER:
                return <MobileScannerInfo {...props} />;
            case SdmsResource.facilityType.SUMP:
                return <SumpSensorInfo {...props} />;
            default:
                return getNodataUI();
            }
        };

    return (
        <SensorInfoComponent id={props.popupType} className="UI_Section SensorInfo" $resize={true} $sensorType={props.sensorType} >
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={340}
                popupMinHeight={256}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
            >
                <div className="dslTop">
                    <h5 className="dslTitle">{SdmsResource.ID.menu.sensorInfo}</h5>
                    <div>
                        <p>{sensorName}</p>

                        {/* 이동식스캐너 센서정보에만 표출되는 상세보기 버튼 (추후 링크 연결 예정) */}
                        {props.sensorType === SdmsResource.facilityType.MOBILE_SCANNER &&
                            <IconButton
                                variant="unfill"
                                size="xxs"
                                icon={<Icon.IconMove size={"xxs"} />}
                            >
                                상세보기
                            </IconButton>
                        }

                        <IconButton
                            variant="unfill"
                            size="xxs"
                            icon={<Icon.Closer size={"xxs"} />}
                            onClick={() => props.setVisiblePopups(SdmsResource.ID.menu.sensorInfo, false)}
                        >
                            닫기
                        </IconButton>
                    </div>
                </div>

                <div
                    className={`content ${
                        props.sensorType === SdmsResource.facilityType.FIRE ? 'fire' : 
                            props.sensorType === SdmsResource.facilityType.PSM_SENSOR ? 'psm' : 
                                props.sensorType === SdmsResource.facilityType.ETC ? 'etc' : 
                                    props.sensorType === SdmsResource.facilityType.PM ? 'pm' : 
                                        props.sensorType === SdmsResource.facilityType.MOBILE_SCANNER ? 'ms' :
                                            props.sensorType === SdmsResource.facilityType.SUMP ? 'sump' : ''
                    }`}
                >
                    {renderContent()}
                </div>
            </PopupDraggable>
        </SensorInfoComponent>
    );
}

export default SensorInfo;
