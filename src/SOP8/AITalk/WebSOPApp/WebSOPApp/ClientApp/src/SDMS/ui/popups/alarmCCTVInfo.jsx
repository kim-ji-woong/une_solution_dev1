import React, { useEffect, useState } from 'react';
import { AlarmCCTVInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import PopupDraggable from './popupDraggable';
import Icon from '../../../Common/components/Icon/Icon';
import ProjectResource from '../../../Root/resource/id';

function AlarmCCTVInfo(props) {
    const [streamServerURL, setStreamServerURL] = useState('http://127.0.0.1:8083'); // 기본값
    const [expandedIdx, setExpandedIdx] = useState(null); // 확대 중인 슬롯 인덱스 (null=4분할)

    useEffect(() => {
        const userInfo = ProjectResource.getUserInfo();
        if (userInfo?.options?.streamServerUrl) {
            setStreamServerURL(userInfo.options.streamServerUrl);
        }
    }, []);

    const getNodataUI = () => (
        <div className="noData">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
                <path d="M8.49951 0.666992C9.65223 0.666992 10.7357 0.885787 11.7495 1.32324C12.7634 1.76074 13.646 2.35449 14.396 3.10449C15.1458 3.85442 15.7398 4.73626 16.1772 5.75C16.6147 6.76386 16.8335 7.84727 16.8335 9C16.8335 10.1527 16.6147 11.2361 16.1772 12.25C15.7398 13.2637 15.1458 14.1456 14.396 14.8955C13.646 15.6455 12.7634 16.2393 11.7495 16.6768C10.7357 17.1142 9.65223 17.333 8.49951 17.333C7.34686 17.333 6.2633 17.1142 5.24951 16.6768C4.23579 16.2393 3.35391 15.6454 2.604 14.8955C1.85408 14.1455 1.26022 13.2638 0.822754 12.25C0.385254 11.2361 0.166504 10.1528 0.166504 9C0.166504 7.84722 0.385254 6.76389 0.822754 5.75C1.26022 4.73618 1.85408 3.85446 2.604 3.10449C3.35391 2.35459 4.23579 1.76073 5.24951 1.32324C6.2633 0.885783 7.34686 0.667034 8.49951 0.666992ZM8.49951 2.33301C6.6387 2.33308 5.06253 2.97913 3.771 4.27051C2.47933 5.56217 1.8335 7.13889 1.8335 9C1.8335 10.8611 2.47933 12.4378 3.771 13.7295C5.06253 15.0209 6.6387 15.6669 8.49951 15.667C10.3605 15.667 11.9374 15.0211 13.229 13.7295C14.5207 12.4378 15.1665 10.8611 15.1665 9C15.1665 7.13889 14.5207 5.56217 13.229 4.27051C11.9374 2.97895 10.3605 2.33301 8.49951 2.33301ZM8.4585 11.917C8.75002 11.9171 8.99644 12.0174 9.19775 12.2188C9.39907 12.4201 9.49944 12.6665 9.49951 12.958C9.49951 13.2497 9.39914 13.4969 9.19775 13.6982C8.99647 13.8994 8.74994 13.9999 8.4585 14C8.16683 14 7.91965 13.8996 7.71826 13.6982C7.51687 13.4969 7.4165 13.2497 7.4165 12.958C7.41658 12.6666 7.51706 12.42 7.71826 12.2188C7.91965 12.0174 8.16683 11.917 8.4585 11.917ZM8.5835 4C9.34709 4.00006 10.017 4.22562 10.5933 4.67676C11.1697 5.12815 11.4585 5.70866 11.4585 6.41699C11.4584 6.86125 11.3438 7.26401 11.1147 7.625C10.8856 7.98611 10.6109 8.31944 10.2915 8.625C10.0693 8.83333 9.86095 9.05208 9.6665 9.28125C9.47206 9.51042 9.34706 9.77083 9.2915 10.0625C9.24985 10.2708 9.15599 10.4441 9.01025 10.583C8.86442 10.7219 8.68734 10.792 8.479 10.792C8.28456 10.792 8.11409 10.7257 7.96826 10.5938C7.82263 10.4619 7.74959 10.2987 7.74951 10.1045C7.74951 9.68785 7.87172 9.31281 8.11475 8.97949C8.3578 8.64616 8.63905 8.34028 8.9585 8.0625C9.19453 7.85421 9.40581 7.63156 9.59326 7.39551C9.78074 7.15941 9.87451 6.88855 9.87451 6.58301C9.87443 6.2499 9.74648 5.97212 9.48975 5.75C9.23288 5.52785 8.93058 5.41706 8.5835 5.41699C8.33364 5.41699 8.09379 5.47202 7.86475 5.58301C7.63558 5.69412 7.44428 5.85417 7.2915 6.0625C7.15267 6.25687 6.97922 6.37528 6.771 6.41699C6.56266 6.45866 6.36095 6.42361 6.1665 6.3125C6.01381 6.21533 5.92002 6.07309 5.88525 5.88574C5.85055 5.69833 5.88189 5.52109 5.979 5.35449C6.229 4.89616 6.59359 4.55523 7.07275 4.33301C7.55188 4.11082 8.05576 4 8.5835 4Z" fill="#686D78"/>
            </svg>
            <p>영상정보가 존재하지 않아요</p>
        </div>
    );

    const getDisableUI = () => (
        <div className="disableData">
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
                <path d="M8.49951 0.666992C9.65223 0.666992 10.7357 0.885787 11.7495 1.32324C12.7634 1.76074 13.646 2.35449 14.396 3.10449C15.1458 3.85442 15.7398 4.73626 16.1772 5.75C16.6147 6.76386 16.8335 7.84727 16.8335 9C16.8335 10.1527 16.6147 11.2361 16.1772 12.25C15.7398 13.2637 15.1458 14.1456 14.396 14.8955C13.646 15.6455 12.7634 16.2393 11.7495 16.6768C10.7357 17.1142 9.65223 17.333 8.49951 17.333C7.34686 17.333 6.2633 17.1142 5.24951 16.6768C4.23579 16.2393 3.35391 15.6454 2.604 14.8955C1.85408 14.1455 1.26022 13.2638 0.822754 12.25C0.385254 11.2361 0.166504 10.1528 0.166504 9C0.166504 7.84722 0.385254 6.76389 0.822754 5.75C1.26022 4.73618 1.85408 3.85446 2.604 3.10449C3.35391 2.35459 4.23579 1.76073 5.24951 1.32324C6.2633 0.885783 7.34686 0.667034 8.49951 0.666992ZM8.49951 2.33301C6.6387 2.33308 5.06253 2.97913 3.771 4.27051C2.47933 5.56217 1.8335 7.13889 1.8335 9C1.8335 10.8611 2.47933 12.4378 3.771 13.7295C5.06253 15.0209 6.6387 15.6669 8.49951 15.667C10.3605 15.667 11.9374 15.0211 13.229 13.7295C14.5207 12.4378 15.1665 10.8611 15.1665 9C15.1665 7.13889 14.5207 5.56217 13.229 4.27051C11.9374 2.97895 10.3605 2.33301 8.49951 2.33301ZM8.4585 11.917C8.75002 11.9171 8.99644 12.0174 9.19775 12.2188C9.39907 12.4201 9.49944 12.6665 9.49951 12.958C9.49951 13.2497 9.39914 13.4969 9.19775 13.6982C8.99647 13.8994 8.74994 13.9999 8.4585 14C8.16683 14 7.91965 13.8996 7.71826 13.6982C7.51687 13.4969 7.4165 13.2497 7.4165 12.958C7.41658 12.6666 7.51706 12.42 7.71826 12.2188C7.91965 12.0174 8.16683 11.917 8.4585 11.917ZM8.5835 4C9.34709 4.00006 10.017 4.22562 10.5933 4.67676C11.1697 5.12815 11.4585 5.70866 11.4585 6.41699C11.4584 6.86125 11.3438 7.26401 11.1147 7.625C10.8856 7.98611 10.6109 8.31944 10.2915 8.625C10.0693 8.83333 9.86095 9.05208 9.6665 9.28125C9.47206 9.51042 9.34706 9.77083 9.2915 10.0625C9.24985 10.2708 9.15599 10.4441 9.01025 10.583C8.86442 10.7219 8.68734 10.792 8.479 10.792C8.28456 10.792 8.11409 10.7257 7.96826 10.5938C7.82263 10.4619 7.74959 10.2987 7.74951 10.1045C7.74951 9.68785 7.87172 9.31281 8.11475 8.97949C8.3578 8.64616 8.63905 8.34028 8.9585 8.0625C9.19453 7.85421 9.40581 7.63156 9.59326 7.39551C9.78074 7.15941 9.87451 6.88855 9.87451 6.58301C9.87443 6.2499 9.74648 5.97212 9.48975 5.75C9.23288 5.52785 8.93058 5.41706 8.5835 5.41699C8.33364 5.41699 8.09379 5.47202 7.86475 5.58301C7.63558 5.69412 7.44428 5.85417 7.2915 6.0625C7.15267 6.25687 6.97922 6.37528 6.771 6.41699C6.56266 6.45866 6.36095 6.42361 6.1665 6.3125C6.01381 6.21533 5.92002 6.07309 5.88525 5.88574C5.85055 5.69833 5.88189 5.52109 5.979 5.35449C6.229 4.89616 6.59359 4.55523 7.07275 4.33301C7.55188 4.11082 8.05576 4 8.5835 4Z" fill="#686D78"/>
            </svg>
            <p>센서 비활성화로</p>
            <p>영상정보가 존재하지않아요</p>
        </div>  
    );

    const handleTileDblClick = (idx) => {
        setExpandedIdx(prev => (prev === idx ? null : idx));
    };

    const getAlarmCCTVInfo = () => {
        const list = props.alarmCCTVList?.cctvs ?? [];
        const slots = Array.from({ length: 4 }, (_, i) => list[i] ?? null);

        if (!streamServerURL || list.length === 0) return getNodataUI();

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

                    const handleDblClick = item ? () => handleTileDblClick(idx) : undefined;

                    // 1) 빈 슬롯: 항상 아이콘
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

                    // 2) 아이템이 있는 슬롯 처리
                    if (props.spatialManager) {
                        const cctvValue = props.spatialManager.getZoneSensor2(
                            item?.zoneNo,
                            item?.cctvNo,
                            SdmsResource.facilityType.CCTV
                        );

                        const suuid = cctvValue?.cctv?.unq_key;
                        const enabled = cctvValue?.sensor?.enab === true;

                        // enab가 false면 무조건 Disable UI
                        if (cctvValue?.sensor?.enab === false) {
                            return (
                                <div
                                    className={tileClass}
                                    key={idx}
                                    onDoubleClick={handleDblClick}
                                    title={item?.cameraName ?? 'CCTV'}
                                    role="button"
                                    aria-pressed={expandedIdx === idx}
                                >
                                    <div className="tileHeader">
                                        <span className="title">{item?.cameraName ?? ''}</span>
                                    </div>
                                    <div className="tileBody">
                                        {getDisableUI()}
                                    </div>
                                </div>
                            );
                        }

                        // 정상 활성 + suuid 있으면 스트림
                        if (enabled && suuid) {
                            const url = `${streamServerURL}/stream.html?src=${encodeURIComponent(suuid)}&mode=mse`; // MSE 미디어 서버 방식

                            return (
                                <div
                                    className={tileClass}
                                    key={idx}
                                    onDoubleClick={handleDblClick}
                                    title={item?.cameraName ?? 'CCTV'}
                                    role="button"
                                    aria-pressed={expandedIdx === idx}
                                >
                                    <div className="tileHeader">
                                        <span className="title">{item?.cameraName ?? ''}</span>
                                    </div>
                                    <div className="tileBody">
                                        <iframe
                                            id={`cctv-${idx + 1}`}
                                            title={`CCTV Stream ${idx + 1}`}
                                            src={url}
                                            allow="autoplay; encrypted-media"
                                            scrolling="no"
                                        />
                                    </div>
                                </div>
                            );
                        }

                        // 그 외(정보 불충분 등)는 Disable UI
                        return (
                            <div
                                className={tileClass}
                                key={idx}
                                onDoubleClick={handleDblClick}
                                title={item?.cameraName ?? 'CCTV'}
                                role="button"
                                aria-pressed={expandedIdx === idx}
                            >
                                <div className="tileHeader">
                                    <span className="title">{item?.cameraName ?? ''}</span>
                                </div>
                                <div className="tileBody">
                                    {getDisableUI()}
                                </div>
                            </div>
                        );
                    }

                    // spatialManager가 없는 경우: 아이콘 표출
                    return (
                        <div
                            className={tileClass}
                            key={idx}
                            title={item?.cameraName ?? 'CCTV'}
                            aria-pressed={expandedIdx === idx}
                        >
                            <div className="tileHeader">
                                <span className="title">{item?.cameraName ?? ''}</span>
                            </div>
                            <div className="tileBody">
                                <Icon.CCTVIcon size="lg" fill="grayscale.g800" />
                            </div>
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
