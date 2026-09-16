import React, { useEffect, useState } from 'react';

import { EventMemoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import { ModalBackground } from '../../../Root/styled/theme';
import Icon from '../../../Common/components/Icon/Icon';
import TextareaBox from '../../../Common/components/textareaBox';

function EventMemo(props) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [memo, setMemo] = useState('');
    const [selectedOption, setSelectedOption] = useState(''); // 라디오 선택 상태

    useEffect(() => {
        const hasMemo = props.alarmMemo && props.alarmMemo.trim() !== '';

        setMemo(props.alarmMemo || '');

        if (hasMemo) {
            setIsEditMode(false);         // memo 있으면 보기모드
            setSelectedOption(props.alarmMemo);
        } else {
            setIsEditMode(true);          // memo 없으면 바로 수정모드
            setSelectedOption('direct');  // 직접입력 기본 선택
        }
    }, [props.alarmMemo, props.popupType]);

    const options = [
        "소방비화재보",
        "디바이스 오감지, 오작동",
        "디바이스 고장",
        "디바이스 점검",
        "소방 작동기능점검",
        "direct" // 직접입력
    ];

    const handleSave = () => {
        const finalMemo = selectedOption === 'direct' ? memo : selectedOption;
        props.onClickSaveMemo(finalMemo, props.memoMode);
        setIsEditMode(false);
    };

    return (
        <ModalBackground>
            <EventMemoComponent id={props.popupType} className='UI_Section eventMemo' $resize={false} $isEditMode={isEditMode} $selectedOption={selectedOption}>
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.eventMemo}
                    </h5>
                    <button 
                        className='confirmBtn edit'
                        onClick={() => {
                            const matchedOption = options.includes(memo) ? memo : 'direct';
                            setSelectedOption(matchedOption);
                            setIsEditMode(true);
                        }}
                        disabled={isEditMode ? true : false}
                    >
                        <i className="leftIcon"><Icon.Edit size={"xxxs"} direction={"left"} /></i>
                        수정하기
                    </button>
                </div>
                <div className='content'>
                    {isEditMode ? (
                        <>
                            <div className="radioGroup">
                                {options.map(opt => (
                                    <label key={opt}>
                                        <input
                                            type="radio"
                                            value={opt}
                                            checked={selectedOption === opt}
                                            onChange={() => setSelectedOption(opt)}
                                        />
                                        {opt === 'direct' ? '직접입력' : opt}
                                    </label>
                                ))}
                            </div>

                            {selectedOption === 'direct' && (
                                <TextareaBox
                                    placeholder="내용을 입력하세요"
                                    value={memo}
                                    onChange={setMemo}
                                    maxLength={500}
                                    alarmMemo={props.alarmMemo}
                                    isEditMode={isEditMode}
                                />
                            )}
                        </>
                    ) : (
                        <p className="memo">
                            {memo}
                        </p>
                    )}

                    <div className='btnWrap'>
                        {isEditMode ? (
                            <>
                                <button
                                    className='confirmBtn'
                                    onClick={() => {
                                        const hasMemo = memo && memo.trim() !== '';
                                        setIsEditMode(false);
                                        if (!hasMemo) {
                                            props.closeMemoPopup();
                                        }
                                    }}
                                >
                                    취소
                                </button>

                                <button
                                    className='confirmBtn submit'
                                    onClick={handleSave}
                                >
                                    저장하기
                                </button>
                            </>
                        ) : (
                            <button
                                className='confirmBtn'
                                onClick={props.closeMemoPopup}
                            >
                                닫기
                            </button>
                        )}
                    </div>
                </div>
            </EventMemoComponent>
        </ModalBackground>
    );
}

export default EventMemo;