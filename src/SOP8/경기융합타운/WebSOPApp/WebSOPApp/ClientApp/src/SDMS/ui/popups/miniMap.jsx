import React, { useState } from 'react';

import PopupDraggable from './popupDraggable';
import { MiniMapComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';

import miniMapImg from '../../images/miniMap_img.png';
import position from '../../images/position_icon.svg';
import alarm from '../../images/alarm_icon.svg';

function MiniMap(props) {
    const [opacity, setOpacity] = useState(1); 

    const changePopupOpacity = (value) => {
        setOpacity(value);
    }

    let showPosition = true;
    let showAlarm = true;

    return (
        <MiniMapComponent id={props.popupType} className='UI_Section miniMap' $opacity={opacity} $resize={false} $showPosition={showPosition} $showAlarm={showAlarm}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={300}
                popupMinHeight={254}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
                usePopupResize={false}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.miniMap}
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
                    <button className='dslX'>닫기</button>
                </div>

                <div className={'content'}>
                    <div>
                        <img src={miniMapImg} alt='미니맵 이미지' />
                        <img src={position} 
                            alt='포지션 아이콘' 
                            className='position' 
                            style={{ top: '70px', left: '110px' }}
                        />
                        <img src={alarm} 
                            alt='알람 아이콘' 
                            className='alarm'
                            style={{ top: '100px', left: '120px' }}
                        />
                    </div>
                </div>
            </PopupDraggable>
        </MiniMapComponent>
    );
}

export default MiniMap;