import React, { useEffect } from 'react';
import { SensorInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import PopupDraggable from './popupDraggable';
import Icon from '../../../Common/components/Icon/Icon';

function SensorInfo(props) {
    useEffect(() => {
        if (!props.sensorDetailInfo.sensor) {
            props.reloadSensorDatas();
        }
    }, [props.sensorDetailInfo.sensor]);

    const getNodataUI = () => (
        <div className="noData">
            <Icon.QuestionCircleIcon size="xs" fill={"grayscale.g500"} />
            <p>센서정보가 존재하지 않아요</p>
        </div>
    );

    const sensorName = props.sensorDetailInfo?.sensor?.sensor_name ?? '-';

    const hasData =
        props.sensorDetailInfo?.sensor &&
        Array.isArray(props.sensorDetailInfo?.datas) &&
        props.sensorDetailInfo.datas.length > 0;

    return (
        <SensorInfoComponent id={props.popupType} className="UI_Section SensorInfo" $resize={false} $sensorType={props.sensorType} >
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={340}
                popupMinHeight={256}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
                usePopupResize={false}
            >
                <div className="dslTop">
                    <h5 className="dslTitle">{SdmsResource.ID.menu.sensorInfo}</h5>
                    <div>
                        <p>{sensorName}</p>
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

                <div className="content fire">
                    {
                        !hasData ? (
                            getNodataUI()
                        ) : (
                            <ul>
                                {props.sensorDetailInfo.datas.map((data) => (
                                    <li key={data.propertyName}>
                                        <span>{data.propertyName}</span>
                                        <span>{data.propertyValue}</span>
                                    </li>
                                ))}
                            </ul>
                        )
                    }
                </div>
            </PopupDraggable>
        </SensorInfoComponent>
    );
}

export default SensorInfo;
