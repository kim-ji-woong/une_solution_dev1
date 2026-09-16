import React, { useEffect, useRef, useState } from 'react';

import PopupDraggable from './popupDraggable';
import { EventComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import { SdmsScrollbar } from './SdmsScrollbar';

function Event(props) {
    const [tableScroll, setTableScroll] = useState(false);

    const refAlarmList = useRef();
    const refTitle = useRef();
    const refHeader = useRef();
    const refTable = useRef();
    const refScrollbar = useRef();

    useEffect(() => {
        setScrollbar();
    })

    const setScrollbar = () => {
        const rectAlarmList = refAlarmList.current.getBoundingClientRect();
        const rectTitle = refTitle.current.getBoundingClientRect();
        const rectHeader = refHeader.current.getBoundingClientRect();

        const width = rectHeader.width;
        const height = rectAlarmList.height - rectTitle.height - rectHeader.height - 5;

        let scrollVisible = false;

        if (refTable.current) {
            const rectTable = refTable.current.getBoundingClientRect();

            if (rectTable.height > height) {
                scrollVisible = true;
            }
        }

        SdmsScrollbar.setContentStyle(refScrollbar.current, width, height, scrollVisible);
        setTableScroll(scrollVisible);
    }

    const onChangeFacilityType = (e) => {
        const target = e.target;
        let facilityTypeID = parseInt(target.value);

        if (isNaN(facilityTypeID))
            return;
        else if (facilityTypeID === -1)
            facilityTypeID = null;

        setState({ selectedType: facilityTypeID });
    }
    
    return (
        <EventComponent id={props.popupType} className='UI_Section event' $tableScroll={tableScroll}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={380}
                popupMinHeight={680}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.event}
                    </h5>
                    <button className='dslX'>닫기</button>
                </div>
                <div className={'dslContEvent'}>
                    <div ref={refAlarmList} className={'alarmList'}>
                        <div className='alarmListTop'>
                            <h5 ref={refTitle} className={'dseTitle'}>발생 현황</h5>
                            <select className={'eventSel'}>
                                <option>전체기관</option>
                            </select>
                            <select className={'eventSel'} onChange={() => onChangeFacilityType()}>
                                <option key={"facilityType_" + SdmsResource.facilityType.FIRE} value={SdmsResource.facilityType.FIRE}>{SdmsResource.getFacilityTypeString(SdmsResource.facilityType.FIRE)}</option>
                                {/* {getFacilityTypeUI()} */}
                            </select>
                        </div>
                        <div ref={refHeader} className={'dseTop'}>
                            <table>
                                <colgroup>
                                    <col className={'width_25Pro'}/>
                                    <col className={'width_20Pro'}/>
                                    <col className={'width_12Pro'}/>
                                    <col className={'width_15Pro'}/>
                                    <col className={'width_13Pro'}/>
                                    <col className={'width_15Pro'}/>
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>발생 일시</th>
                                        <th>유형</th>
                                        <th>단계</th>
                                        <th>위치</th>
                                        <th>알람</th>
                                        <th>SOP</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div className={'dseTb scrollbar'}>
                            <table ref={refTable}>
                                <caption>이벤트 발생일시, 유형, 단계, 위치, 알람, SOP로 구성된 표</caption>
                                <colgroup>
                                    <col className={'width_25Pro'}/>
                                    <col className={'width_20Pro'}/>
                                    <col className={'width_12Pro'}/>
                                    <col className={'width_15Pro'}/>
                                    <col className={'width_13Pro'}/>
                                    <col className={'width_15Pro'}/>
                                </colgroup>
                                <tbody>
                                    {
                                        Array.from(Array(10), x =>
                                        <tr>
                                            <td>2024.01.09<br />12:54:00</td> 
                                            <td>지진</td>
                                            <td>경계</td>
                                            <td>경기융합타운</td>
                                            <td>
                                                <span className={'redTxt'}>발생</span>
                                            </td>
                                            <td>대기</td>
                                        </tr>
                                        )
                                    }
                                    {/* {setGridUI()} */}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={'alarmDetail'}>
                        <div className={'gap10'}></div>
                        <h5 className={'dseTitle'}>세부정보</h5>
                        <div className={'dseInfo'}>
                            <em className={'evtFIRE'}>이벤트 아이콘</em>
                            <div>
                                <p>2024-01-09 12:43:00</p>
                                <p>
                                    <span>[경기융합타운]</span>
                                    {
                                        (props.selectedAlarm?.reportPerson.length === 0 && props.selectedAlarm?.memo.length === 0)
                                            ? <></>
                                            : <>
                                                <span>{(props.selectedAlarm?.reportPerson.length === 0) ? ' - ' : props.selectedAlarm?.reportPerson}</span>
                                                <span>{(props.selectedAlarm?.memo.length === 0) ? ' - ' : props.selectedAlarm?.memo}</span>
                                            </>
                                    }
                                </p>
                                <p>지진계측기에서 진도 5.0 지진이 탐지되었습니다.</p>
                            </div>
                        </div>
                        {/* {getAlarmInfo()} */}

                        <ul className={'eventIconBox'}>
                            <li><span className={'eventShortCut' + " " + 'hideKey'}>Sh+Q</span><span className={'eIcon1'}></span><a>S O P</a></li>
                            <li><span className={'eventShortCut' + " " + 'hideKey'}>Sh+W</span><span 
                                className={'eIcon2'}></span><a>화면전환</a></li>

                            {
                                (props.alarmSound)
                                    ? <li><span
                                        className={'eventShortCut' + " " + 'hideKey'}>Sh+E</span><span className={'eIcon3'}></span><a>소리끄기</a></li>
                                    : <li><span className={'eventShortCut' + " " + 'hideKey'}>Sh+E</span><span className={'eIcon4'}></span><a>소리켜기</a></li>
                            }
                            {
                                (true)
                                    ? <li><span className={'eventShortCut' + " " + 'hideKey'}></span><span className={'eIcon5'}></span><a>메모</a></li>
                                    : <React.Fragment></React.Fragment>
                            }
                            <li><span className={'eventShortCut' + " " + 'hideKey'}>Sh+R</span><span className={'eIcon6'}></span><a>종료</a></li>
                    </ul>
                        {/* {getBtnUI()} */}
                    </div>
                </div>
            </PopupDraggable>
        </EventComponent>
    );
}

export default Event;