import React, { useState } from 'react';

import PopupDraggable from './popupDraggable';
import { PublicDataComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import IconButton from '../../../Common/components/iconButton';
import Icon from '../../../Common/components/Icon/Icon';
import DropBox from '../../../Common/components/dropBox';

function PublicData(props) {
    const [openDropId, setOpenDropId] = useState(null);
    const [opacity, setOpacity] = useState(1); 
    const [position, setPosition] = useState(-1);

    const changePopupOpacity = (value) => {
        setOpacity(value);
    }

    return (
        <PublicDataComponent id={props.popupType} className='UI_Section publicData' $opacity={opacity} $resize={true}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={340}
                popupMinHeight={324}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        <Icon.IconData2 size='xs' />
                        {SdmsResource.ID.menu.publicData}
                    </h5>
                    <input
                        type="range"
                        className="rangeInput"
                        min={0.1}
                        max={1}
                        color="gray"
                        step={0.1}
                        defaultValue={opacity}
                        onChange={(e) => {changePopupOpacity(e.target.valueAsNumber)}}
                    />
                    <IconButton
                        variant="unfill"
                        size="xxs"
                        icon={<Icon.Closer />}
                        onClick={() => props.setVisiblePopups(SdmsResource.ID.menu.publicData, false)}
                    >
                        닫기
                    </IconButton>
                </div>

                <div className={'content'}>
                    <div className="positionWrap">
                        <DropBox
                            id="position"
                            placeholder="위치명"
                            value={position}
                            onChange={setPosition}
                            options={[
                                { value: -1, label: "위치명" },
                            ]}
                            openId={openDropId}
                            setOpenId={setOpenDropId}
                            fullWidth
                        />
                    </div>

                    <div className="dataTable">
                        <div className="tableHeader">
                            <p>항목</p>
                            <p>수치</p>
                        </div>
                        {/* <ul className="tableBody">
                            <li className="disable">
                                <p>항목명</p>
                                <p>00</p>
                            </li>
                            <li>
                                <p>항목명</p>
                                <p>00</p>
                            </li>
                            <li>
                                <p>항목명</p>
                                <p>00</p>
                            </li>
                            <li>
                                <p>항목명</p>
                                <p>00</p>
                            </li>
                            <li>
                                <p>항목명</p>
                                <p>00</p>
                            </li>
                        </ul> */}

                        <div className="noData">
                            <p>데이터 값이 없습니다.</p>
                        </div>
                    </div>

                    <div className="measureDate">
                        <p>측정일시</p>
                        <p>0000-00-00  00:00:00 AM</p>
                    </div>
                </div>
            </PopupDraggable>
        </PublicDataComponent>
    );
}

export default PublicData;