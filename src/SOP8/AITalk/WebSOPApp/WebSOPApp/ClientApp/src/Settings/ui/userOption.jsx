import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { UserOptionComponent } from '../styled/settingsStyled';
import tooltip_icon from '../images/tooltip-icon.png';
import ToggleSwitch from '../../Common/ui/toggleSwitch';

function UserOption(props) {
    const [useAutoRotate, setUseAutoRotate] = useState(false);
    const [cameraIdleTime, setCameraIdleTime] = useState('');

    useEffect(() => {
        initData();
    }, [props.settings]);

    const initData = () => {
        if (!props.settings || Object.keys(props.settings).length === 0) return;

        const raw = props.settings.CameraIdleTime?.value;

        // null/undefined/''/0이면 OFF
        if (raw === null || raw === undefined || raw === '' || Number(raw) === 0) {
            setUseAutoRotate(false);
            setCameraIdleTime('');
        } else {
            const sec = Number(raw);
            const minutes = String(Math.floor(sec / 60)); // ✅ 초 → 분
            setUseAutoRotate(true);
            setCameraIdleTime(minutes);       // UI엔 분으로 보여줌
        }
    };

    const onChangeUseAutoRotate = (arg) => {
        if (!props.settings) return;

        // ToggleSwitch가 (checked, sopType) 또는 이벤트를 줄 수 있으니 모두 대응
        const checked =
            typeof arg === 'boolean' ? arg :
            typeof arg?.checked === 'boolean' ? arg.checked :
            !!arg?.target?.checked;

        setUseAutoRotate(checked);

        if (checked) {
            // 켜질 때: 현재 입력된 '분' 값을 초로 저장 (비어있으면 기본 15분)
            const minutes = /^\d+$/.test(cameraIdleTime) ? Number(cameraIdleTime) : 15;
            props.settings.CameraIdleTime.value = String(minutes * 60);
            if (cameraIdleTime === '') setCameraIdleTime(String(minutes));
        } else {
            // 꺼질 때: DB에는 null, UI 입력은 비우고 disable
            props.settings.CameraIdleTime.value = null;
            setCameraIdleTime('');
        }

        props.onChangeNeedToSave();
    };

    return (
        <UserOptionComponent>
            <ul className='menuTypeWrap'>
                <li className='on'>
                    일반 관리
                </li>
            </ul> 
            <ul className='contents'>
                <li className='item'>
                    <div>
                        <p>3D 자동 회전 대기시간 설정 여부</p>
                        <ToggleSwitch
                            left="OFF"
                            right="ON"
                            leftcolor="#878787"
                            rightcolor="#ffffff"
                            leftbgcolor="#D9D9D9"
                            rightbgcolor="#3C69FC"
                            circleColor="#F9F9FB"
                            sopType="useAutoRotate"
                            setChecked={onChangeUseAutoRotate}
                            isChecked={!!useAutoRotate}
                            isDisabled={false}
                        />
                        <input
                            type="text"
                            value={cameraIdleTime ?? ""}
                            onChange={(e) => {
                                const val = e.target.value.trim();
                                if (val === "" || /^\d+$/.test(val)) {
                                    setCameraIdleTime(val); // UI는 '분' 문자열 유지
                                    if (val !== "" && props.settings && useAutoRotate) {
                                        const minutes = Number(val);
                                        props.settings.CameraIdleTime.value = String(minutes * 60); // 분 -> 초
                                        props.onChangeNeedToSave();
                                    }
                                }
                            }}
                            disabled={!useAutoRotate}             // OFF면 입력 막기
                        />
                        <span>분</span>
                        <span className='smallText'>후 3D 자동 회전</span>
                    </div>
                    <div className='tooltip' data-tooltip="3D 자동 회전을 대기 시간에 따라 설정 할 수 있습니다.">
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item margin'>
                    <div>
                        <p>정보창 위치/사이즈 설정</p>
                        <ul>
                            <li>
                                <input type="radio" name="mode" id="system" defaultChecked />
                                <label htmlFor="system">시스템 기본</label>
                            </li>
                            <li>
                                <input type="radio" name="mode" id="user" />
                                <label htmlFor="user">사용자 설정</label>
                            </li>
                        </ul>
                    </div>
                    <div className='tooltip' data-tooltip="메뉴 클릭 시 표출되는 정보창 위치 및 사이즈를 설정할 수 있습니다.">
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
            </ul>
        </UserOptionComponent>
    );
}

export default withRouter(UserOption);