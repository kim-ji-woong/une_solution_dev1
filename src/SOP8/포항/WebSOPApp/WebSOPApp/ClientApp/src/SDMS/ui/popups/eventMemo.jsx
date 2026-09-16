import React, { useRef } from 'react';

import { EventMemoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import { ModalBackground } from '../../../Root/styled/theme';

function EventMemo(props) {
    const memoRef = useRef(null);

    const handleSave = () => {
        const memoValue = memoRef.current?.value;
        props.onClickSaveMemo(memoValue);
    };

    return (
        <ModalBackground>
            <EventMemoComponent id={props.popupType} className='UI_Section eventMemo' $resize={false} $popupType={props.popupType}>
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.eventMemo}
                    </h5>
                    <button className='dslX' onClick={() => props.setShowMemoPopup(false)}>닫기</button>
                </div>
                <div className={'content'}>
                    <textarea ref={memoRef} defaultValue={props.alarmMemo} disabled={props.popupType === 'History' ? true : false}></textarea>
                    {
                        props.popupType === 'SDMS' &&
                            <div className='btnWrap'>
                                <button className='cancle' onClick={() => props.setShowMemoPopup(false)}>취소</button>
                                <button className='submit' onClick={handleSave}>저장</button>
                            </div>
                    }
                </div>
            </EventMemoComponent>
        </ModalBackground>
    );
}

export default EventMemo;