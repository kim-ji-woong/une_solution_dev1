import React, { useRef, useState, useEffect } from 'react';
import { AddSpreadComponent } from '../styled/settingsStyled';
import tooltip_icon from '../../Settings/images/tooltip-icon.png';
import { useSensorList } from '../../Common/hooks/useSensorList';
import Button from '../../Common/components/button';
import SdmsResource from '../../SDMS/resource/id';

function AddSpread(props) {
    const { sensorTypes } = useSensorList();

    const refNotificationName = useRef(null);   // 전파관리명
    const refSensorType = useRef(null);         // 센서유형
    const refNotifyMessage = useRef(null);      // 전파내용

    const [isValid, setIsValid] = useState(false);

    // 입력값 확인 함수
    const validateForm = () => {
        const notificationName = refNotificationName.current?.value?.trim() ?? '';
        const sensorTypeCode = refSensorType.current?.value ?? '';
        const notifyMessage = refNotifyMessage.current?.value?.trim() ?? '';
        const hasMembers = props.selectedMembers && props.selectedMembers.length > 0;

        // 모든 값이 입력되었을 때 true
        setIsValid(notificationName !== '' && sensorTypeCode !== '' && notifyMessage !== '' && hasMembers);
    };

    useEffect(() => {
        validateForm(); // selectedMembers가 바뀔 때도 유효성 검사 실행
    }, [props.selectedMembers]);

    const getSensorTypes = () => {
        if (!sensorTypes) return;
        
        let ui = [];
        ui.push(
            <option key="sensorType_default" value="" disabled={true}>선택하세요</option>
        );

        for (const sensorType of sensorTypes) {
            if (sensorType.sensorTypeCode === SdmsResource.facilityType.CCTV) continue;

            ui.push(
                <option 
                    key={`sensorType_${sensorType.sensorTypeCode}`} 
                    value={sensorType.sensorTypeCode}
                >
                    {sensorType.sensorTypeName}
                </option>
            );
        }
        return ui;
    };

    const onClickAddSpread = () => {
        const notificationName = refNotificationName.current?.value ?? '';
        const sensorTypeCode = refSensorType.current?.value ?? '';
        const notifyMessage = refNotifyMessage.current?.value ?? '';

        props.onClickAddSpread(notificationName, sensorTypeCode, notifyMessage);
    };

    return (
        <AddSpreadComponent>
            <div className='infoWrap'>
                <p>신규등록 시 유의사항</p>
                <p>필수 값을 전부 작성해야 등록하기 버튼이 활성화됩니다.</p>
            </div>
            <div className='formWrap'>
                <div>
                    <label htmlFor="name">
                        전파관리 명 <span>*</span>
                    </label>
                    <input 
                        type="text" 
                        ref={refNotificationName}
                        name="name" 
                        placeholder="작성하세요"
                        onChange={validateForm}
                    />
                </div>
                <div>
                    <label htmlFor="type">
                        이벤트 유형 <span>*</span>
                    </label>
                    <select
                        ref={refSensorType}
                        id="type" 
                        name="type" 
                        defaultValue="" 
                        onChange={validateForm}
                    >
                        {getSensorTypes()}
                    </select>
                </div>
                <div>
                    <label htmlFor="content">
                        전파내용 <span>*</span>
                        <div id='tooltip' data-tooltip="{location} : 재난발생위치 / {date} : 재난발생 시간 - 특수문자 사용 가능" >
                            <img src={tooltip_icon} alt='도움말 아이콘' />
                        </div>
                    </label>
                    <textarea
                        ref={refNotifyMessage}
                        id="content"
                        name="content"
                        placeholder="내용을 작성하세요"
                        onChange={validateForm}
                    />
                </div>
                <div>
                    <label htmlFor="target">
                        지정된 사용자 <span>*</span>
                        <span className='memberCount'>{props.getSpreadMembersText(props.selectedMembers)}</span>
                    </label>
                    <div>
                        <button 
                            type="button" 
                            id="target" 
                            onClick={() => props.setShowFindMemberPopup(true)}
                        >
                            선택하기
                        </button>
                    </div>
                </div>
            </div>

            <div className='btnWrap'>
                <Button 
                    className="submitBtn" 
                    variant="fill" 
                    size="xs" 
                    disabled={!isValid} 
                    onClick={onClickAddSpread}
                >
                    등록하기
                </Button>
            </div>
        </AddSpreadComponent>
    );
}

export default AddSpread;