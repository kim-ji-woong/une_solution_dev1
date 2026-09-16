import React, { useRef } from 'react';
import { AddSpreadComponent } from '../styled/settingsStyled';
import tooltip_icon from '../../Settings/images/tooltip-icon.png';
import SettingsResource from '../resource/id';

function AddSpread(props) {
    const refNotificationName = useRef(null);       // 전파관리명
    const refDetectType = useRef(null);             // 전파구분
    const refSensorType = useRef(null);             // 센서유형
    const refNotifyMessage = useRef(null);          // 전파내용
    
    const getSensorTypes = () => {
		let ui = [];

		if (props.sensorTypes) {
			for (const sensorType of props.sensorTypes) {
				ui.push(
					<option key={`sensorTpye_${sensorType.co_code}`} value={sensorType.co_code}>{sensorType.sensor_type_name}</option>
				);
            }
        }

		return ui;
    }

    const onClickCancle = () => {
        refNotificationName.current.value = null;
        refNotifyMessage.current.value = null;
    }

    const onClickAddSpread = () => {
        const notificationName = refNotificationName.current?.value ?? '';
        const detectType = refDetectType.current?.value ?? '';
        const sensorTypeCode = refSensorType.current?.value ?? '';
        const notifyMessage = refNotifyMessage.current?.value ?? '';

        props.onClickAddSpread(notificationName, detectType, sensorTypeCode, notifyMessage);
    }

    return (
        <AddSpreadComponent>
            <div className='infoWrap'>
                <p>신규등록 시 유의사항</p>
                <p>알람 발생 시 전파 구분에 따라 센서탐지의 경우 문자가 자동 발송되며, 재난신고에 대해서는 수동 발송이 필요합니다.</p>
            </div>
            <div className='formWrap'>
                <div>
                    <label htmlFor="name">
                        전파관리명 <span>*</span>
                    </label>
                    <input 
                        type="text" 
                        ref={refNotificationName}
                        name="name" 
                        placeholder="전파관리명을 입력해주세요."
                    />
                </div>
                <div>
                    <label htmlFor="category">
                        전파구분 <span>*</span>
                    </label>
                    <select 
                        ref={refDetectType}
                        id="category" 
                        name="category" 
                        defaultValue="" 
                    >
                        <option value={SettingsResource.detectType.센서탐지}>센서탐지</option>
                        <option value={SettingsResource.detectType.재난신고}>재난신고</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="type">
                        센서유형 <span>*</span>
                    </label>
                    <select
                        ref={refSensorType}
                        id="type" 
                        name="type" 
                        defaultValue="" 
                    >
                        {getSensorTypes()}
                    </select>
                </div>
                <div>
                    <label htmlFor="target">
                        전파대상자 <span>*</span>
                    </label>
                    <div>
                        <button type="button" id="target" onClick={() => props.setShowFindMemberPopup(true)}>조직정보 불러오기</button>
                        {props.getSpreadMembersText(props.selectedMembers)}
                    </div>
                </div>

                <div>
                    <label htmlFor="content">
                        전파내용 <span>*</span>
                        <div id='tooltip' data-tooltip="{ location } : 재난발생위치 / { date } : 재난발생시간 특수문자 사용가능" >
                            <img src={tooltip_icon} alt='도움말 아이콘' />
                        </div>
                    </label>
                    <textarea
                        ref={refNotifyMessage}
                        id="content"
                        name="content"
                        placeholder="전파내용을 입력해주세요."
                    />
                </div>
            </div>

            <div className='btnWrap'>
                <button className='cancle' onClick={() => onClickCancle()}>새로고침</button>
                <button className='submit' onClick={() => onClickAddSpread()}>등록</button>
            </div>
        </AddSpreadComponent>
    );
}

export default AddSpread;