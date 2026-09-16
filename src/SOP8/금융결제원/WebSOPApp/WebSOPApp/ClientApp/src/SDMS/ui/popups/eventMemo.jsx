import React, { useEffect, useState } from 'react';

import { EventMemoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import { ModalBackground } from '../../../Root/styled/theme';
import Icon from '../../../Common/components/Icon/Icon';
import TextareaBox from '../../../Common/components/textareaBox';

function EventMemo(props) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [memo, setMemo] = useState('');

    useEffect(() => {
        setMemo(props.alarmMemo || '');
    }, [props.alarmMemo]);

    return (
        <ModalBackground>
            <EventMemoComponent id={props.popupType} className='UI_Section eventMemo' $resize={false}>
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.eventMemo}
                    </h5>
                    {
                        props.popupType === 'SDMS' &&
                            <button 
                                className='confirmBtn edit'
                                onClick={() => setIsEditMode(true)}
                                disabled={isEditMode ? true : false}
                            >
                                <i className="leftIcon"><Icon.Edit size={"xxxs"} direction={"left"} /></i>
                                수정하기
                            </button>
                    }
                </div>
                <div className={'content'}>
                    <TextareaBox
                        placeholder="수정하기 버튼을 클릭해 내용을 입력하세요"
                        value={memo}
                        onChange={setMemo}
                        maxLength={500}
                        alarmMemo={props.alarmMemo}
                        isEditMode={isEditMode}
                    />
                    <div className='btnWrap'>
                        {
                            isEditMode ?
                                <>
                                    <button 
                                        className='confirmBtn' 
                                        onClick={() => {
                                            setIsEditMode(false);
                                            setMemo(props.alarmMemo || "");
                                        }}
                                    >
                                        취소
                                    </button>
                                    <button className='confirmBtn submit' onClick={() => props.onClickSaveMemo(memo)}>저장하기</button>
                                </>
                                : <button className='confirmBtn' onClick={() => props.closeMemoPopup(false)}>닫기</button>
                        }
                    </div>
                </div>
            </EventMemoComponent>
        </ModalBackground>
    );
}

export default EventMemo;