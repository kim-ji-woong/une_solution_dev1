import React, { useState } from 'react';
import { DoorInfoComponent } from '../../styled/sdmsPopupsStyled';
import PopupDraggable from './popupDraggable';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import Icon from '../../../Common/components/Icon/Icon';

export default function DoorInfo(props) {
    const { totalDoorStatus } = props;
    const zones = totalDoorStatus?.zones ?? [];

    /**
     * 정렬 상태
     * null  : 기본 (층 오름차순)
     * desc  : 미개방 많은 순
     * asc   : 미개방 적은 순
     */
    const [sortOrder, setSortOrder] = useState(null);

    const handleSortClick = () => {
        setSortOrder((prev) => {
            if (prev === null) return 'desc'; // 첫 클릭
            return prev === 'desc' ? 'asc' : 'desc';
        });
    };

    // 필터 + 정렬 적용된 층 리스트
    const sortedZones = [...zones]
        // 미개방 0인 층 숨김
        .filter(zone => zone.closeDoorCount > 0)
        // 정렬
        .sort((a, b) => {
            // 기본: 층 오름차순
            if (sortOrder === null) {
                return a.zoneNo - b.zoneNo;
            }

            // 미개방 많은/적은 순
            const diff = b.closeDoorCount - a.closeDoorCount;

            // 같은 미개방 수일 경우 층 오름차순
            if (diff === 0) {
                return a.zoneNo - b.zoneNo;
            }

            return sortOrder === 'desc' ? diff : -diff;
        });

    return (
        <DoorInfoComponent id={props.popupType} className='UI_Section doorInfo' $resize={true}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={340}
                popupMinHeight={328}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.doorInfo}
                    </h5>
                    <IconButton
                        variant="unfill"
                        size="xxs"
                        icon={<Icon.Closer size={"xxs"} />}
                        onClick={() => props.setVisiblePopups(SdmsResource.ID.menu.doorInfo, false)}
                    >
                        닫기
                    </IconButton>
                </div>

                <div className="content">
                    <div className="sortWrap">
                        <div>
                            <p>미개방 출입문 수</p>
                            <IconButton
                                variant="outline"
                                size="xxxs"
                                icon={<Icon.Swap size="xxxxs" />}
                                onClick={handleSortClick}
                            >
                                정렬
                            </IconButton>
                        </div>
                        <p>
                            총 {totalDoorStatus?.totalCloseDoorCount ?? 0}건
                        </p>
                    </div>

                    <ul className="listWrap">
                        {sortedZones.length === 0 && (
                            <p className="empty">
                                미개방 출입문이 없습니다.
                            </p>
                        )}

                        {sortedZones.map((zone) => (
                            <li 
                                key={zone.zoneNo} 
                                className={props.currentZoneNo === zone.zoneNo ? "listItem selected" : "listItem"}
                                onClick={() => props.moveToZone(zone.zoneNo)}
                            >
                                <div className="floor">
                                    <Icon.DomainIcon size="xxs" />
                                    <p>{zone.zoneName}</p>
                                </div>

                                <ul className="doorListWrap">
                                    <li className="doorListItem">
                                        <p>총 출입문</p>
                                        <p>{zone.totalDoorCount}</p>
                                    </li>
                                    <li className="doorListItem">
                                        <p>미개방</p>
                                        <p className="highlight">
                                            {zone.closeDoorCount}
                                        </p>
                                    </li>
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>
            </PopupDraggable>
        </DoorInfoComponent>
    );
}