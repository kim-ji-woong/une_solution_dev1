import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CCTVInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import PopupDraggable from './popupDraggable';
import Icon from '../../../Common/components/Icon/Icon';

function CCTVInfo(props) {
    const [cctvValue, setCCTVValue] = useState(null);
    const [viewportSize, setViewportSize] = useState({ w: 0, h: 0 });

    useEffect(() => {
        if (props.spatialManager) {
            const sensor = props.spatialManager.getZoneSensor2(
                props.selectedCCTVInfo?.zoneNo,
                props.selectedCCTVInfo?.sensorNo,
                SdmsResource.facilityType.CCTV
            );
            if (sensor) setCCTVValue(sensor);
        }

        props.refetchCCTV();
    }, [props.selectedCCTVInfo, props.spatialManager]);

    const updateViewportSize = useCallback(() => {
        const viewport = document.querySelector(`#${props.popupType} .cctvViewport`);
        if (viewport) {
            setViewportSize({ w: viewport.clientWidth, h: viewport.clientHeight });
        }
    }, [props.popupType]);

    useEffect(() => {
        const timer = setTimeout(updateViewportSize, 50);
        return () => clearTimeout(timer);
    }, [updateViewportSize]);

    const getNodataUI = () => (
        <div className="noData">
            <Icon.QuestionCircleIcon size="xs" fill={'grayscale.g500'} />
            <p>센서 비활성화로 영상정보가 존재하지않아요</p>
        </div>
    );

    const streamUrl = useMemo(() => {
        const suuid = cctvValue?.cctv?.sensor_sn;
        if (!suuid) return null;

        const cctv = props.cctvAllList?.find(
            x => x.sensor_sn?.toString() === suuid?.toString()
        );
        let url = cctv?.url && cctv.url.length > 0 ? cctv.url : null;
        if (!url) return null;

        // url이 /stream/player/을 포함하고있으면? w, h값 포함해주기
        const isLegacy = url.indexOf('/stream/player/') !== -1;
        if (isLegacy) {
            const joiner = url.includes('?') ? '&' : '?';
            const w = viewportSize.w > 0 ? `${viewportSize.w}px` : '100%';
            const h = viewportSize.h > 0 ? `${viewportSize.h}px` : '100%';
            return `${url}${joiner}w=${w}&h=${h}`;
        }

        // MSE 미디어 서버 방식
        const joiner = url.includes('?') ? '&' : '?';
        if (!/([?&])mode=mse(\b|&|=)/.test(url)) {
            url += `${joiner}mode=mse`;
        }
        return url;
    }, [cctvValue, props.cctvAllList, viewportSize]);

    const getCCTVInfo = () => {
        if (!cctvValue || !streamUrl) return getNodataUI();

        return (
            <div className='cctvWrap'>
                <div className='cctvViewport'>
                    <iframe
                        id="cctv1"
                        title="CCTV Stream"
                        src={streamUrl}
                        allow="autoplay; encrypted-media"
                        scrolling="no"
                    />
                </div>
            </div>
        );
    };

    const getDetailInfo = () => {
        return (
            <ul>
                <li>
                    <span>CCTV 명</span>
                    <span>{cctvValue?.cctv?.cctv_no ? cctvValue.cctv.cctv_no + '.' : ''} {cctvValue?.sensor?.sensor_name ?? '-'}</span>
                </li>
                <li>
                    <span>IP 주소</span>
                    <span>{cctvValue?.cctv?.camera_ip ?? '-'}</span>
                </li>
                <li>
                    <span>종류</span>
                    <span>{cctvValue?.cctv?.strmg_ty ?? '-'}</span>
                </li>
                <li>
                    <span>제조사 / 모델</span>
                    <span>{cctvValue?.cctv?.camera_model_name ?? '-'}</span>
                </li>
            </ul>
        );
    };

    return (
        <CCTVInfoComponent id={props.popupType} className='UI_Section cctvInfo' $resize={true}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={340}
                popupMinHeight={428}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
                popupResizeMouseUp={updateViewportSize}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.cctvInfo}
                    </h5>
                    <div>
                        <IconButton
                            variant="unfill"
                            size="xxs"
                            icon={<Icon.Closer size="xxs" />}
                            onClick={() =>
                                props.setVisiblePopups(SdmsResource.ID.menu.cctvInfo, false)
                            }
                        >
                            닫기
                        </IconButton>
                    </div>
                </div>
                <div className="content">
                    {getCCTVInfo()}
                    {getDetailInfo()}
                </div>
            </PopupDraggable>
        </CCTVInfoComponent>
    );
}

export default CCTVInfo;