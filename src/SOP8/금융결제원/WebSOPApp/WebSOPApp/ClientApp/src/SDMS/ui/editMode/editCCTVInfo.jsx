import React, { useState } from 'react';
import { EditCCTVInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import Icon from '../../../Common/components/Icon/Icon';
import PopupDraggable from '../popups/popupDraggable';

function EditCCTVInfo(props) {
    const [expandedIdx, setExpandedIdx] = useState(null); // 확대 중인 슬롯 인덱스 (null=4분할)

    const handleTileDblClick = (idx) => {
        setExpandedIdx((prev) => (prev === idx ? null : idx));
    };

    const buildStreamUrl = (url, isExpanded) => {
        if (!url) return '';

        // /stream/player/ 방식: w, h 쿼리 추가 (숫자 값)
        if (url.includes('/stream/player/')) {
            const w = isExpanded ? '306' : '148';
            const h = isExpanded ? '197' : '82';

            const hasQuery = url.includes('?');
            const joiner = hasQuery ? '&' : '?';

            // 이미 w, h가 들어있으면 중복 추가 방지
            const hasWidth = /([?&])w=\d+/i.test(url);
            const hasHeight = /([?&])h=\d+/i.test(url);

            let result = url;
            if (!hasWidth) {
                result += `${hasQuery ? '&' : '?'}w=${w}`;
            }
            if (!hasHeight) {
                const hasQuery2 = result.includes('?');
                result += `${hasQuery2 ? '&' : '?'}h=${h}`;
            }

            return result;
        }

        // 그 외 MSE 미디어 서버 방식: mode=mse 추가
        const hasQuery = url.includes('?');
        const joiner = hasQuery ? '&' : '?';

        if (!/([?&])mode=mse(\b|&|=)/.test(url)) {
            url += `${joiner}mode=mse`;
        }

        return url;
    };

    const getCCTVInfo = () => {
        const list = props.editCCTVList?.cctvList ?? [];
        // 4분할 고정: 리스트가 4개보다 적으면 null로 채움
        const slots = Array.from({ length: 4 }, (_, i) => list[i] ?? null);
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

                    // 빈 슬롯: 아이콘만 표시
                    if (isEmpty) {
                        return (
                            <div
                                className={tileClass}
                                key={idx}
                                title="CCTV"
                                aria-pressed={expandedIdx === idx}
                            >
                                <div className="tileHeader">
                                    <span className="title" />
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
                            props.zoneNo,
                            item?.sensor_sn,
                            SdmsResource.facilityType.CCTV
                        );
                    }

                    const type = cctvValue?.sensor?.subTypeName;

                    const dblClickHandler = () => handleTileDblClick(idx);

                    return (
                        <div
                            className={tileClass}
                            key={item.cctv_no ?? idx}
                            onDoubleClick={dblClickHandler}
                            title={item.cameraName ?? 'CCTV'}
                            role="button"
                            aria-pressed={isExpanded}
                        >
                            <div className="tileHeader">
                                <div className="titleWrap">
                                    <span className="title">{item.cctv_no ? item.cctv_no + '.' : ''} {item.cameraName ?? ''}</span>
                                </div>
                                <div id='tooltip' data-tooltip={type}>
                                    <Icon.InfoCircleIcon size='xxs' fill="grayscale.g500" />
                                </div>
                            </div>
                            <div className="tileBody">
                                <iframe
                                    id={`cctv-${idx + 1}`}
                                    title={`CCTV Stream ${idx + 1}`}
                                    src={buildStreamUrl(item.url, isExpanded)}
                                    allow="autoplay; encrypted-media"
                                    scrolling="no"
                                    allowFullScreen={false}
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <EditCCTVInfoComponent id={props.popupType} className="UI_Section editCCTVInfo" $resize={false}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={340}
                popupMinHeight={296}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
                usePopupResize={false}
            >
                <div className="dslTop">
                    <h5 className="dslTitle">{SdmsResource.ID.menu.cctvInfo}</h5>
                    <div>
                        <IconButton
                            variant="unfill"
                            size="xxs"
                            icon={<Icon.Closer size="xxs" />}
                            onClick={() => props.setShowEditCCTVInfo(false)}
                        >
                            닫기
                        </IconButton>
                    </div>
                </div>
                <div className="content">{getCCTVInfo()}</div>
            </PopupDraggable>
        </EditCCTVInfoComponent>
    );
}

export default EditCCTVInfo;