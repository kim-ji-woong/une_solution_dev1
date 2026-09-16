import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { UserOptionComponent } from '../styled/settingsStyled';
import tooltip_icon from '../images/tooltip-icon.png';
import ToggleSwitch from '../../Common/ui/toggleSwitch';

function UserOption(props) {
    const [useCameraIdleTime, setUseCameraIdleTime] = useState(false);
    const [cameraIdleTime, setCameraIdleTime] = useState('');
    const [popupLocationPosition, setPopupLocationPosition] = useState(true);

    useEffect(() => {
        initData();
    }, [props.settings]);

    const initData = () => {
        if (!props.settings || Object.keys(props.settings).length === 0) return;

        const raw = props.settings.CameraIdleTime?.value;

        const sec = Number(raw);
        const minutes = String(Math.floor(sec / 60)); // 초 → 분
        setCameraIdleTime(minutes);       // UI엔 분으로 보여줌

        setUseCameraIdleTime(props.settings.UseCameraIdleTime?.value?.toLowerCase() === "true");
        setPopupLocationPosition(props.settings.PopupLocationPosition?.value?.toLowerCase() === "true");
    };

    const onChangeUseCameraIdleTime = (e) => {
        if (!props.settings) return;

        let value = e.checked.toString();
        props.settings.UseCameraIdleTime.value = value;
        setUseCameraIdleTime(!useCameraIdleTime);
        props.onChangeNeedToSave();
    };

    const onChangePopupLocationPosition = (e) => {
        if (!props.settings) return;

        const isSystem = e.target.value === "system";
        setPopupLocationPosition(isSystem);
        props.settings.PopupLocationPosition.value = isSystem.toString();
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
                            leftcolor="#878787" 
                            rightcolor="#ffffff"
                            leftbgcolor="#787C87"
                            rightbgcolor="#E5ECFF"
                            circleColor="#0C2CCA"
                            type="useCameraIdleTime"
                            setChecked={onChangeUseCameraIdleTime}
                            isChecked={!!useCameraIdleTime}
                            isDisabled={false}
                        />
                        {
                            useCameraIdleTime &&
                            <>
                                <input
                                    type="text"
                                    value={cameraIdleTime ?? ""}
                                    onChange={(e) => {
                                        const val = e.target.value.trim();
                                        if (val === "" || /^\d+$/.test(val)) {
                                            setCameraIdleTime(val); // UI는 '분' 문자열 유지
                                            if (val !== "" && props.settings && useCameraIdleTime) {
                                                const minutes = Number(val);
                                                props.settings.CameraIdleTime.value = String(minutes * 60); // 분 -> 초
                                                props.onChangeNeedToSave();
                                            }
                                        }
                                    }}
                                />
                                <span>분</span>
                                <span className='smallText'>후 3D 자동 회전</span>
                            </>
                        }
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
                                <input
                                    type="radio"
                                    name="mode"
                                    id="system"
                                    value="system"
                                    checked={popupLocationPosition === true}
                                    onChange={onChangePopupLocationPosition}
                                />
                                <label htmlFor="system">시스템 기본</label>
                            </li>
                            <li>
                                <input
                                    type="radio"
                                    name="mode"
                                    id="user"
                                    value="user"
                                    checked={popupLocationPosition === false}
                                    onChange={onChangePopupLocationPosition}
                                />
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