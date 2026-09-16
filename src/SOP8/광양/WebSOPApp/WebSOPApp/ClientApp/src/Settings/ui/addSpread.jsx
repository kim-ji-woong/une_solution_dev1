import React, { useState } from 'react';
import { AddSpreadComponent } from '../styled/settingsStyled';
import tooltip_icon from '../../Settings/images/tooltip_icon.svg';
import SettingsResource from '../resource/id';
import InputBox from '../../Common/components/inputBox';
import DropBox from '../../Common/components/dropBox';
import BoxButton from '../../Common/components/boxButton';
import TextareaBox from '../../Common/components/textareaBox';

function AddSpread(props) {
    const [openDropId, setOpenDropId] = useState(null);

    const [notificationNameValue, setNotificationName] = useState('');       // 전파관리명
    const [detectTypeValue, setDetectTypeValue] = useState('');              // 전파구분
    const [sensorTypeValue, setSensorTypeValue] = useState('');              // 센서유형
    const [notifyMessageValue, setNotifyMessageValue] = useState('');        // 전파내용

    const getSensorTypes = () => {
		let ui = [];

		if (props.sensorTypes) {
			for (const sensorType of props.sensorTypes) {
                ui.push({ value: sensorType.co_code, label: sensorType.sensor_type_name });
            }
        }

		return ui;
    }

    const onClickAddSpread = () => {
        props.onClickAddSpread(notificationNameValue, detectTypeValue, sensorTypeValue, notifyMessageValue);
    }

    const isValid =
        notificationNameValue.trim() !== '' &&
        detectTypeValue !== '' &&
        sensorTypeValue !== '' &&
        notifyMessageValue.trim() !== '' &&
        props.selectedMembers &&
        props.selectedMembers.length > 0;

    return (
        <AddSpreadComponent>
            <div className='infoWrap'>
                <p>※ 신규등록 시 유의사항</p>
                <p>· 알람 발생 시 전파 구분에 따라 센서탐지의 경우 문자가 자동 발송되며, 재난신고에 대해서는 수동 발송이 필요합니다.</p>
            </div>
            <div className='formWrap'>
                <div>
                    <label htmlFor="name">
                        전파관리명<span>*</span>
                    </label>
                    <InputBox
                        size='sm'
                        value={notificationNameValue}
                        onChange={setNotificationName}
                        placeholder={"전파관리명"}
                        onClear={() => setNotificationName("")}
                    />
                </div>
                <div>
                    <label htmlFor="category">
                        전파구분<span>*</span>
                    </label>
                    <DropBox
                        id="detectTypeValue"
                        placeholder="전파구분명"
                        value={detectTypeValue}
                        onChange={setDetectTypeValue}
                        options={[
                            { value: SettingsResource.detectType.센서탐지, label: '센서탐지' },
                            { value: SettingsResource.detectType.재난신고, label: '재난신고' }
                        ]}
                        openId={openDropId}
                        setOpenId={setOpenDropId}
                    />
                </div>
                <div>
                    <label htmlFor="type">
                        센서유형 <span>*</span>
                    </label>
                    <DropBox
                        id="sensorTypeValue"
                        placeholder="센서유형명"
                        value={sensorTypeValue}
                        onChange={setSensorTypeValue}
                        options={getSensorTypes()}
                        openId={openDropId}
                        setOpenId={setOpenDropId}
                    />
                </div>
                <div>
                    <label htmlFor="target">
                        전파대상자 <span>*</span>
                    </label>
                    <div className="targetWrap">
                        <BoxButton
                            variant="ghost"
                            size="xxs"
                            onClick={() => props.setShowFindMemberPopup(true)}
                        >
                            불러오기
                        </BoxButton>
                        {props.getSpreadMembersText(props.selectedMembers) ?
                            props.getSpreadMembersText(props.selectedMembers) :
                            <p>초기상황 전파 대상 사용자를 선택하시기 바랍니다.</p>
                        }
                    </div>
                </div>

                <div>
                    <label htmlFor="content">
                        전파내용 <span>*</span>
                        <div id='tooltip' data-tooltip="{location} : 재난발생위치 / {date} : 재난발생 시간 - 특수문자 사용 가능" >
                            <img src={tooltip_icon} alt='도움말 아이콘' width={14} height={14} />
                        </div>
                    </label>
                    <TextareaBox
                        value={notifyMessageValue}
                        onChange={setNotifyMessageValue}
                        height="120px"
                        fullWidth
                        showCharCount={false}
                    />
                </div>
            </div>

            <div className='btnWrap'>
                <BoxButton
                    variant="fill"
                    size="sm"
                    onClick={() => onClickAddSpread()}
                    disabled={!isValid}
                >
                    등록
                </BoxButton>
            </div>
        </AddSpreadComponent>
    );
}

export default AddSpread;