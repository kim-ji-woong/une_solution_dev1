import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { UserOptionComponent } from '../styled/settingsStyled';
import tooltip_icon from '../images/tooltip_icon.svg';
import ToggleSwitch from '../../Common/ui/toggleSwitch';
import DropBox from '../../Common/components/dropBox';
import BoxButton from '../../Common/components/boxButton';
import ProjectResource from "../../Root/resource/id";
import SettingsResource from "../resource/id";
import { AccountController } from '../../Account/services/accountController';
import settingsStore from '../settingsStore';

function UserOption(props) {
    const [openDropId, setOpenDropId] = useState(null);

    useEffect(() => {
        initData();
    }, [props.settings]);

    const initData = () => {
        
        if (!props.userOptions)
            return;
        
        const sdmsOptions = (props.userOptions || []).filter(
            (option) => option.category === "sdms"
        );
        
        // 기본값
        let tempUseAlarmSound = false;
        let tempUseIdleTime = false;
        let tempIdleTime = 5;
        let tempUseWeatherEffect = true;
        let tempUseLightEffect = true;
        
        sdmsOptions.forEach((option) => {
            if (option.subCategory === "alarmSound") {
                tempUseAlarmSound = option.values[0] === "true";
            } else if (option.subCategory === "idleTime") {
                [tempIdleTime, tempUseIdleTime] = option.values[0]?.split(":");
            } else if (option.subCategory === "weatherEffect") {
                tempUseWeatherEffect = option.values[0] === "true";
            } else if (option.subCategory === "lightEffect") {
                tempUseLightEffect = option.values[0] === "true";
            }
        });

        const sdmsValueMap = {
            alarmSound: [String(tempUseAlarmSound)],
            idleTime: [`${tempIdleTime}:${tempUseIdleTime}`],
            lightEffect: [String(tempUseLightEffect)],
            weatherEffect: [String(tempUseWeatherEffect)],
        };

        const nextUserOptions = props.userOptions.map((option) => {
            if (option.category === "sdms" && sdmsValueMap[option.subCategory]) {
                return {
                    ...option,
                    values: sdmsValueMap[option.subCategory],
                };
            }
            return option;
        });
        
        props.setUser(nextUserOptions);
    };

    const onChangeUseCameraIdleTime = (e) => {
        const checked = String(!!e.checked);
        const idle = props.userOptions.find(
            (o) => o.category === "sdms" && o.subCategory === "idleTime"
        );
        const [time = "15"] = (idle?.values?.[0] || "15:0").split(":");
        const nextValue = `${time}:${checked === "true" ? "1" : "0"}`;
        const nextUserOptions = updateSdmsOption(props.userOptions, "idleTime", [nextValue]);
        props.setUser(nextUserOptions);
        props.onChangeNeedToSave();
    };

    const onChangeCameraIdleTime = (value) => {
        const idle = props.userOptions.find(
            (o) => o.category === "sdms" && o.subCategory === "idleTime"
        );
        const [, use = "0"] = (idle?.values?.[0] || "15:0").split(":");
        const nextValue = `${value}:${use}`;
        const nextUserOptions = updateSdmsOption(props.userOptions, "idleTime", [nextValue]);
        props.setUser(nextUserOptions);
        props.onChangeNeedToSave();
    };

    const onChangeUseAlarmSound = (target) => {
        const currentValue = String(!!target.checked);

        const nextUserOptions = updateSdmsOption(props.userOptions, "alarmSound", [currentValue]);
        props.setUser(nextUserOptions);
        props.onChangeNeedToSave();
    };
    
    const onChangeUseWeatherEffect = (e) => {
        let tempUseWeatherEffect = props.userOptions.find((o) => o.category === "sdms" && o.subCategory === "weatherEffect") ??
            { category: "sdms", subCategory: "weatherEffect", values: ["true"] };
        let currentValue = e.checked.toString();
        const nextUserOptions = updateSdmsOption(props.userOptions, "weatherEffect", [currentValue]);
        props.setUser(nextUserOptions);
        props.onChangeNeedToSave();
    }
    
    const onChangeUseLightEffect = (e) => {
        let tempUseLightEffect = props.userOptions.find((o) => o.category === "sdms" && o.subCategory === "lightEffect") ??
            { category:"sdms", subCategory:"lightEffect", values: ["true"] };
        let currentValue = e.checked.toString();
        const nextUserOptions = updateSdmsOption(props.userOptions, "lightEffect", [currentValue]);
        props.setUser(nextUserOptions);
        props.onChangeNeedToSave();
    }

    const updateSdmsOption = (userOptions, subCategory, values) => {
        let replaced = false;

        const next = (userOptions || []).map((o) => {
            if (o.category === "sdms" && o.subCategory === subCategory) {
                replaced = true;
                return { ...o, values };
            }
            return o;
        });

        if (!replaced) {
            next.push({ category: "sdms", subCategory, values });
        }

        return next;
    };
    
    const convertStringToBoolean = (value) => {
        if (value === "1" || value === "0")
            return value === "1";
        
        return value === "true";
    }
    
    const convertStringToNumber = (value) => {
        return parseInt(value, 10);
    }

    const parseIdleTime = (value = "5:false") => {
        const [minutesRaw = "5", enabledRaw = "false"] = String(value).split(":");

        return {
            minutes: Number.isNaN(convertStringToNumber(minutesRaw)) ? 5 : convertStringToNumber(minutesRaw),
            enabled: convertStringToBoolean(enabledRaw),
        };
    };

    const idleTimeRawValue = (Array.isArray(props.userOptions)
        ? props.userOptions.find((o) => o.category === "sdms" && o.subCategory === "idleTime")?.values?.[0]
        : undefined) ?? "5:false";
    const idleTime = parseIdleTime(idleTimeRawValue);

    const resetPopupState = async () => {
        const userInfo = ProjectResource.getUserInfo();

        if (!userInfo) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, "사용자 정보를 찾을 수 없습니다.", null, null);
            return;
        }

        const options = [{ 
            category: 'popup', 
            subCategory: null, 
            values: [] 
        }];

        const [result, message] = await AccountController.requestSaveOptions(
            userInfo.user_sn,
            options
        );

        if (!result) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
        else {
            settingsStore.dispatch({ type: 'RESET_POPUP', popupState: {} });
            props.handleToast("설정이 완료되었습니다.");
        }
    }
    
    const resetUserOptions = () => {
        const userInfo = ProjectResource.getUserInfo();
        
        if (!userInfo) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, "사용자 정보를 찾을 수 없습니다.", null, null);
            return;
        }

        const alarmSound = setNewUserOption("sdms", "alarmSound", [SettingsResource.getDefaultOptions("alarmSound", "userOptions")]);
        const idleTime = setNewUserOption("sdms", "idleTime", [SettingsResource.getDefaultOptions("idleTime", "userOptions")]);
        const lightEffect = setNewUserOption("sdms", "lightEffect", [SettingsResource.getDefaultOptions("lightEffect", "userOptions")]);
        const weatherEffect = setNewUserOption("sdms", "weatherEffect", [SettingsResource.getDefaultOptions("weatherEffect", "userOptions")]);
        
        let tempUserOptions = Array.isArray(props.userOptions) ? [...props.userOptions] : [];
        const resetOptions = [alarmSound, idleTime, lightEffect, weatherEffect];

        resetOptions.forEach((targetOption) => {
            const optionIndex = tempUserOptions.findIndex(
                (option) => option.category === "sdms" && option.subCategory === targetOption.subCategory
            );

            if (optionIndex >= 0) {
                tempUserOptions[optionIndex] = {
                    ...tempUserOptions[optionIndex],
                    values: targetOption.values,
                };
                return;
            }

            tempUserOptions.push(targetOption);
        });

        props.setUser(tempUserOptions);
        props.resetSettings(userInfo, tempUserOptions);
    }
    
    // category: string
    // subCategory: string
    // values: string[]
    const setNewUserOption = (category, subCategory, values) => {
        return {"category": category, "subCategory": subCategory, "values": values};
    }
    
    return (
        <UserOptionComponent>
            <ul className='contents'>
                <li className='item'>
                    <div>
                        <p>3D 자동 회전 대기시간 설정 여부</p>
                        <ToggleSwitch 
                            left="OFF" 
                            right="ON" 
                            leftcolor="#686D78" 
                            rightcolor="#FFFFFF"
                            leftbgcolor="#444A57" 
                            rightbgcolor="#0095FF" 
                            sopType="useCameraIdleTime"
                            setChecked={onChangeUseCameraIdleTime}
                            isChecked={idleTime.enabled}
                            isDisabled={false}
                        />
                        <div>
                            <DropBox
                                className="dropBox"
                                id="waitTime"
                                value={idleTime.minutes}
                                onChange={onChangeCameraIdleTime}
                                options={[
                                    { value: 5, label: '5분' },
                                    { value: 15, label: '15분' },
                                    { value: 30, label: '30분' },
                                    { value: 60, label: '60분' },
                                ]}
                                disabled={!idleTime.enabled}
                                openId={openDropId}
                                setOpenId={setOpenDropId}
                            />
                            <span className='innerTxt'>후 3D 자동 회전</span>
                        </div>
                    </div>
                    <div id='tooltip' data-tooltip="3D 자동 회전을 대기 시간에 따라 설정 할 수 있습니다.">
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>3D 날씨 효과 설정</p>
                        <ToggleSwitch 
                            left="OFF" 
                            right="ON" 
                            leftcolor="#686D78" 
                            rightcolor="#FFFFFF"
                            leftbgcolor="#444A57" 
                            rightbgcolor="#0095FF"
                            setChecked={onChangeUseWeatherEffect}
                            isChecked={convertStringToBoolean(props.userOptions?.find((o) => o.category === "sdms" && o.subCategory === "weatherEffect")?.values[0]) ?? false}
                            isDisabled={false}
                        />
                    </div>
                    <div id='tooltip' data-tooltip="3D 환경에서 날씨 효과 연동 여부를 설정합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>3D 시간에 따른 조명 효과 설정</p>
                        <ToggleSwitch 
                            left="OFF" 
                            right="ON" 
                            leftcolor="#686D78" 
                            rightcolor="#FFFFFF"
                            leftbgcolor="#444A57" 
                            rightbgcolor="#0095FF"
                            setChecked={onChangeUseLightEffect}
                            isChecked={convertStringToBoolean(props.userOptions?.find((o) => o.category === "sdms" && o.subCategory === "lightEffect")?.values[0]) ?? false}
                            isDisabled={false}
                        />
                    </div>
                    <div id='tooltip' data-tooltip="3D 환경에서 시간 변화에 따른 조명 효과를 설정합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>이벤트 발생 시 효과음 설정</p>
                        <ToggleSwitch 
                            left="OFF" 
                            right="ON" 
                            leftcolor="#686D78" 
                            rightcolor="#FFFFFF"
                            leftbgcolor="#444A57" 
                            rightbgcolor="#0095FF" 
                            sopType="useAlarmSound"
                            setChecked={onChangeUseAlarmSound}
                            isChecked={convertStringToBoolean(props.userOptions?.find((o) => o.category === "sdms" && o.subCategory === "alarmSound")?.values[0]) ?? false}
                            isDisabled={false}
                        />
                    </div>
                    <div id='tooltip' data-tooltip="이벤트 발생 시 효과음 사용 여부를 설정합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>정보 창 위치/사이즈 설정</p>
                        <BoxButton
                            variant="ghost"
                            size="xxs"
                            onClick={(e) => { resetPopupState(); e.currentTarget.blur(); }}
                        >
                            시스템 기본값으로 재설정
                        </BoxButton>
                    </div>
                    <div id='tooltip' data-tooltip="메뉴 클릭 시 표출되는 정보 창 위치 및 사이즈를 시스템 기본값으로 재설정 할 수 있습니다.">
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item'>
                    <div>
                        <p>환경설정 초기화 설정</p>
                        <BoxButton
                            variant="ghost"
                            size="xxs"
                            onClick={(e) => { resetUserOptions(); e.currentTarget.blur(); }}
                        >
                            시스템 기본값으로 재설정
                        </BoxButton>
                    </div>
                    <div id='tooltip' data-tooltip="메뉴 클릭 시 환경설정을 시스템 기본값으로 재설정 할 수 있습니다.">
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
            </ul>

            <ul className='contents'>
                <li className='item'>
                    <div>
                        <p>시스템 버전 정보</p>
                        <span>{props.settings?.SystemVersion?.value}</span>
                    </div>
                </li>
            </ul>
        </UserOptionComponent>
    );
}

export default withRouter(UserOption);
