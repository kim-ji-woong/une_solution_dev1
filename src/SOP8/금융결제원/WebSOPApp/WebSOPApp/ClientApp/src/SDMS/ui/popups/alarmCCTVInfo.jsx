import React, { useEffect, useMemo, useState } from 'react';
import { AlarmCCTVInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import PopupDraggable from './popupDraggable';
import Icon from '../../../Common/components/Icon/Icon';

function AlarmCCTVInfo(props) {
    const [expandedIdx, setExpandedIdx] = useState(null); // 확대 중인 슬롯 인덱스 (null=4분할)

    useEffect(() => {
        props.refetchCCTV();
    }, [props.alarmCCTVList]);

    useEffect(() => {
        if (props.selectedAlarm.sensorZoneHistoryNo !== props.alarmCCTVList.alarm.sensorZoneHistoryNo) {
            closedPopup();
        }
    }, [props.selectedAlarm]);

    const getNodataUI = () => (
        <div className="noData">
            <Icon.QuestionCircleIcon size='xs' fill={"grayscale.g500"} />
            <p>영상정보가 존재하지 않아요</p>
        </div>
    );

    const getDisableUI = () => (
        <div className="disableData">
            <Icon.QuestionCircleIcon size='xs' fill={"grayscale.g500"} />
            <p>센서 비활성화로</p>
            <p>영상정보가 존재하지않아요</p>
        </div>  
    );

    const handleTileDblClick = (idx) => {
        setExpandedIdx(prev => (prev === idx ? null : idx));
    };

    const urlMap = useMemo(() => {
        const map = new Map();
        (props.cctvAllList ?? []).forEach((c) => {
            if (c?.sensor_sn) map.set(String(c.sensor_sn), c?.url ?? null);
        });
        return map;
    }, [props.cctvAllList]);

    const buildStreamUrl = (suuid, isExpanded) => {
        if (!suuid) return null;

        const raw = urlMap.get(String(suuid));
        if (!raw) return null;

        let url = raw;

        // url이 /stream/player/을 포함하고있으면? w, h값 포함해주기
        if (url.includes('/stream/player/')) {
            const w = isExpanded ? '306px' : '148px';
            const h = isExpanded ? '197px' : '82px';
            const joiner = url.includes('?') ? '&' : '?';
            return `${url}${joiner}w=${w}&h=${h}`;
        }

        // MSE 미디어 서버 방식
        const joiner = url.includes('?') ? '&' : '?';
        if (!/([?&])mode=mse(\b|&|=)/.test(url)) {
            url += `${joiner}mode=mse`;
        }
        
        return url;
    };

    const getAlarmCCTVInfo = () => {
        const list = props.alarmCCTVList?.cctvs ?? [];
        const slots = Array.from({ length: 4 }, (_, i) => list[i] ?? null);

        if (list.length === 0) return getNodataUI();

        const gridClass = `cctvGrid${expandedIdx !== null ? ' expanded' : ''}`;

        return (
            <div className={gridClass}>
                {slots.map((item, idx) => {
                    const isExpanded = expandedIdx === idx;
                    const isHidden = expandedIdx !== null && !isExpanded;
                    const isEmpty = !item;

                    let tileClass = 'cctvTile';
                    if (isExpanded) tileClass += ' expanded';
                    if (isHidden) tileClass += ' hidden';
                    if (isEmpty) tileClass += ' empty';

                    if (isEmpty) {
                        return (
                            <div
                                className={tileClass}
                                key={idx}
                                title="CCTV"
                                aria-pressed={expandedIdx === idx}
                            >
                                <div className="tileHeader">
                                    <span className="title"></span>
                                </div>
                                <div className="tileBody">
                                    <Icon.CCTVIcon size="lg" fill="grayscale.g800" />
                                </div>
                            </div>
                        );
                    }

                    let cctvValue = null;
                    if (props.spatialManager) {
                        cctvValue = props.spatialManager.getZoneSensor2(
                            item?.zoneNo,
                            item?.cctvNo,
                            SdmsResource.facilityType.CCTV
                        );
                    }

                    const suuid = cctvValue?.cctv?.sensor_sn;
                    const cctvNo = cctvValue?.cctv?.cctv_no;
                    const enabled = cctvValue?.sensor?.enab === true;
                    const type = cctvValue?.sensor?.subTypeName;
                    const dblClickHandler =
                        props.spatialManager && item ? () => handleTileDblClick(idx) : undefined;

                    if (!props.spatialManager) {
                        return (
                            <div
                                className={tileClass}
                                key={idx}
                                title={item?.cameraName ?? 'CCTV'}
                                aria-pressed={isExpanded}
                            >
                                <div className="tileHeader">
                                    <div className="titleWrap">
                                        <span className="title">{cctvNo ? cctvNo + '.' : ''} {item?.cameraName ?? ''}</span>
                                    </div>
                                    <div id='tooltip' data-tooltip={type}>
                                        <Icon.InfoCircleIcon size='xxs' fill="grayscale.g500" />
                                    </div>
                                </div>
                                <div className="tileBody">
                                    <Icon.CCTVIcon size="lg" fill="grayscale.g800" />
                                </div>
                            </div>
                        );
                    }

                    if (cctvValue?.sensor?.enab === false) {
                        return (
                            <div
                                className={tileClass}
                                key={idx}
                                onDoubleClick={dblClickHandler}
                                title={item?.cameraName ?? 'CCTV'}
                                role="button"
                                aria-pressed={isExpanded}
                            >
                                <div className="tileHeader">
                                    <div className="titleWrap">
                                        <span className="title">{cctvNo ? cctvNo + '.' : ''} {item?.cameraName ?? ''}</span>
                                    </div>
                                    <div id='tooltip' data-tooltip={type}>
                                        <Icon.InfoCircleIcon size='xxs' fill="grayscale.g500" />
                                    </div>
                                </div>
                                <div className="tileBody">{getDisableUI()}</div>
                            </div>
                        );
                    }

                    if (enabled && suuid) {
                        const url = buildStreamUrl(suuid, isExpanded);
                        if (!url) {
                            return (
                                <div
                                    className={tileClass}
                                    key={idx}
                                    onDoubleClick={dblClickHandler}
                                    title={item?.cameraName ?? 'CCTV'}
                                    role="button"
                                    aria-pressed={isExpanded}
                                >
                                    <div className="tileHeader">
                                        <div className="titleWrap">
                                            <span className="title">{cctvNo ? cctvNo + '.' : ''} {item?.cameraName ?? ''}</span>
                                        </div>
                                        <div id='tooltip' data-tooltip={type}>
                                            <Icon.InfoCircleIcon size='xxs' fill="grayscale.g500" />
                                        </div>
                                    </div>
                                    <div className="tileBody">{getDisableUI()}</div>
                                </div>
                            );
                        }

                        return (
                            <div
                                className={tileClass}
                                key={idx}
                                onDoubleClick={dblClickHandler}
                                title={item?.cameraName ?? 'CCTV'}
                                role="button"
                                aria-pressed={isExpanded}
                            >
                                <div className="tileHeader">
                                    <div className="titleWrap">
                                        <span className="title">{cctvNo ? cctvNo + '.' : ''} {item?.cameraName ?? ''}</span>
                                    </div>
                                    <div id='tooltip' data-tooltip={type}>
                                        <Icon.InfoCircleIcon size='xxs' fill="grayscale.g500" />
                                    </div>
                                </div>
                                <div className="tileBody">
                                    <iframe
                                        id={`cctv-${idx + 1}`}
                                        title={`CCTV Stream ${idx + 1}`}
                                        src={url}
                                        allow="autoplay; encrypted-media"
                                        scrolling="no"
                                        allowFullScreen={false}
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div
                            className={tileClass}
                            key={idx}
                            onDoubleClick={dblClickHandler}
                            title={item?.cameraName ?? 'CCTV'}
                            role="button"
                            aria-pressed={isExpanded}
                        >
                            <div className="tileHeader">
                                <span className="title">{item?.cameraName ?? ''}</span>
                            </div>
                            <div className="tileBody">{getDisableUI()}</div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const getSensorType = () => {
        if (!props.alarmCCTVList.alarm) return null;
        return props.alarmCCTVList.alarm.facilityTypeName;
    }

    const getAlarmPosition = () => {
        if (!props.alarmCCTVList.alarm) return null;
        return `${props.alarmCCTVList.alarm.zoneName} > ${props.alarmCCTVList.alarm.sensorName}`
    }

    const closedPopup = () => {
        props.setAlarmCCTVList({ alarm: null, cctvs: [] });
        props.setVisiblePopups(SdmsResource.ID.menu.alarmCCTVInfo, false);
    }

    return (
        <AlarmCCTVInfoComponent id={props.popupType} className="UI_Section alarmCCTVInfo" $resize={false}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={340}
                popupMinHeight={320}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
                usePopupResize={false}
            >
                <div className="dslTop">
                    <h5 className="dslTitle">{SdmsResource.ID.menu.alarmCCTVInfo}</h5>
                    <div>
                        <p>{getSensorType()}</p>
                        <IconButton
                            variant="unfill"
                            size="xxs"
                            icon={<Icon.Closer size="xxs" />}
                            onClick={() => closedPopup()}
                        >
                            닫기
                        </IconButton>
                    </div>
                </div>
                <div className="content">
                    <div className='infoWrap'>
                        <span>발생위치</span>
                        <span>{getAlarmPosition()}</span>
                    </div>
                    {getAlarmCCTVInfo()}
                </div>
            </PopupDraggable>
        </AlarmCCTVInfoComponent>
    );
}

export default AlarmCCTVInfo;
