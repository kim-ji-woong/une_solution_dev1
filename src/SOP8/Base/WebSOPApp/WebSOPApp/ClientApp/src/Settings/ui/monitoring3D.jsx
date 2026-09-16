import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Monitoring3DComponent } from '../styled/settingsStyled';
import tooltip_icon from '../images/tooltip-icon.png';
import ToggleSwitch from '../../Common/ui/toggleSwitch';
import Theme from '../../Root/styled/theme';

function Monitoring3D(props) {
    const [cameraIdleTime, setCameraIdleTime] = useState(null);
    const [moveDisplayAlarm, setMoveDisplayAlarm] = useState(null);
    const [useAlarmSound, setUseAlarmSound] = useState(null);

    useEffect(() => {
        initData();
    }, [props.settings]);

    const initData = () => {
        if (!props.settings || Object.keys(props.settings).length === 0) return;

        setCameraIdleTime(Number(props.settings.CameraIdleTime?.value));
        setMoveDisplayAlarm(Number(props.settings.MoveDisplayAlarm?.value));
        setUseAlarmSound(props.settings.UseAlarmSound?.value?.toLowerCase() === "true");
    };

    const onChangeCameraIdleTime = (value) => {
        if (props.settings === null || props.settings === undefined)
			return;

        props.settings.CameraIdleTime.value = value.toString();
        setCameraIdleTime(value);
        props.onChangeNeedToSave();
    }

    const onChangeMoveDisplayAlarm = (value) => {
        if (props.settings === null || props.settings === undefined)
			return;

        props.settings.MoveDisplayAlarm.value = value.toString();
        setMoveDisplayAlarm(value);
        props.onChangeNeedToSave();
    }

    const setChecked = (target, sopType) => {
        if (props.settings === null || props.settings === undefined)
			return;

        if (sopType === 'useAlarmSound') {
            let value = target.checked.toString();
            props.settings.UseAlarmSound.value = value;
            setUseAlarmSound(!useAlarmSound);
            props.onChangeNeedToSave();
        } 
    }

    return (
        <Monitoring3DComponent>
            <ul className='contents'>
                <li className='item'>
                    <div>
                        <p>3D 회전 대기시간/자동회전 설정</p>
                        <select
                            value={cameraIdleTime || false}
                            onChange={(e) => onChangeCameraIdleTime(Number(e.target.value))}
                        >
                            <option value={900}>15분</option>
                            <option value={1800}>30분</option>
                            <option value={3600}>1시간</option>
                        </select>
                    </div>
                    <div id='tooltip' data-tooltip="3D 회전 대기시간 및 자동회전을 설정합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>센서 유형별 이벤트 발생 표시 설정 </p>
                        <div>
                            <input type='checkbox' id='sensor_1' />
                            <label htmlFor='sensor_1'>대기유해물질측정기</label>
                        </div>
                        <div>
                            <input type='checkbox' id='sensor_2' />
                            <label htmlFor='sensor_2'>수위계 및 CCTV</label>
                        </div>
                        <div>
                            <input type='checkbox' id='sensor_3' />
                            <label htmlFor='sensor_3'>강우량계</label>
                        </div>
                        <div>
                            <input type='checkbox' id='sensor_4' />
                            <label htmlFor='sensor_4'>악취측정기</label>
                        </div>
                        <div>
                            <input type='checkbox' id='sensor_5' />
                            <label htmlFor='sensor_5'>초거대 AI 악취측정기</label>
                        </div>
                    </div>
                    <div id='tooltip' data-tooltip="센서 유형별 이벤트 발생 표시를 설정합니다.">
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>이벤트 발생 시 화면 자동전환 설정</p>
                        <div>
                            <input type='radio' name='eventView' id='current' checked={moveDisplayAlarm === 0} onChange={() => onChangeMoveDisplayAlarm(0)} />
                            <label htmlFor='current'>현재화면 유지</label>
                        </div>
                        <div>
                            <input type='radio' name='eventView' id='move' checked={moveDisplayAlarm === 2} onChange={() => onChangeMoveDisplayAlarm(2)} />
                            <label htmlFor='move'>이벤트 발생 위치로 화면이동</label>
                        </div>
                    </div>
                    <div id='tooltip' data-tooltip="이벤트 시 자동 화면 전환 여부를 설정합니다.">
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>이벤트 발생 시 효과음 설정</p>
                        <ToggleSwitch 
                            left="OFF" 
                            right="ON" 
                            leftcolor="#000" 
                            rightcolor={Theme.fontPrimary}
                            leftbgcolor="#384355" 
                            rightbgcolor={Theme.primary} 
                            sopType="useAlarmSound"
                            setChecked={setChecked}
                            isChecked={useAlarmSound}
                            isDisabled={false}
                        />
                    </div>
                    <div id='tooltip' data-tooltip="이벤트 발생 시 효과음 사용 여부를 설정합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item margin'>
                    <div>
                        <p>초기상황 전파관리</p>
                        <button onClick={() => props.setShowSpread(true)}>수신 설정</button>
                    </div>
                    <div id='tooltip' data-tooltip="초기상황 전파관리를 설정합니다.">
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>센서정보 다운로드</p>
                        <button>파일 다운로드</button>
                    </div>
                    <div id='tooltip' data-tooltip="센서정보를 엑셀 파일로 다운로드합니다.">
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>팝업창 위치 초기화 설정</p>
                        <button>시스템 기본값으로 재설정</button>
                    </div>
                    <div id='tooltip' data-tooltip="팝업창 위치를 초기화합니다.">
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
            </ul>
        </Monitoring3DComponent>
    );
}

export default withRouter(Monitoring3D);