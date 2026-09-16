import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';

import { LayoutSettingComponent } from '../styled/settingsStyled';
import SettingsResource from '../resource/id';
import { ModalBackground } from '../../Root/styled/theme';
import Monitoring3D from './monitoring3D';
import SopSet from './sopSet';
import SettingEtc from './settingEtc';

import close_btn from '../../Common/images/close_btn.png';
import ProjectResource from '../../Root/resource/id';
import ConfirmDialog from '../../Common/ui/confirmDialog';

import { SettingController } from '../services/settingController';
import { SDMSController } from '../../SDMS/services/sdmsController';
import SopController from '../../SOPManager/services/sopController';
import SpreadManager from './spreadManager';
import { ExternalController } from '../../SDMS/services/externalController';
import socketStore from "../../SDMS/webSocket/socketStore";

function LayoutSetting(props) {
    const path = window.location.pathname;
    const isSopPage = path === ProjectResource.path.sopSimulator || path === ProjectResource.path.sopManager;

    const [menu, setMenu] = useState(
        isSopPage ? SettingsResource.menu.sopSet : SettingsResource.menu.monitoring3D
    );
    const [selectedSiteNo, setSelectedSiteNo] = useState(null);     // 현재 SiteNo
    const [sensorTypes, setSensorTypes] = useState(null);
    const [sensorList, setSensorList] = useState([]);
    const [disasterCategories, setDisasterCategories] = useState(null);

    const [useSensorTypes, setUseSensorTypes] = useState(null);     // 센서별 신호 수신 여부
	const [confirmMessage, setConfirmMessage] = useState({
        visible: false,
        type: null,
        messages: [""],
        buttons: ["확인"],
        onClickButton: null
    });	

	const [sdmsSettings, setSdmsSettings] = useState({});
	const [sopSettings, setSopSettings] = useState({});
	const [etcSettings, setEtcSettings] = useState({});

    const [showSpread, setShowSpread] = useState(false);    // 초기상황 전파관리 팝업

    const bNeedToSave = useRef(false);      // 저장이 필요한지 여부 상태 추가

    useEffect(() => {
        init();
        initSiteNo();
    }, []);

    useEffect(() => {
        if (selectedSiteNo) {
            loadDisasterCategory();
        }
    }, [selectedSiteNo]);

    const init = async () => {
        let userInfo = await ProjectResource.initUserInfo();
        if (userInfo === null || userInfo === undefined) 
            return;
        
        // 설정 불러오기
        const [result, message] = await SettingController.requestSetting(userInfo.site_sn);

        if (result === null || result === undefined)
            return;

        const sdmsSettings = result.find(item => item.categoryType === 'SDMS');
        if (sdmsSettings) {
            const transformedSettings = {};

            sdmsSettings.settingDatas.forEach(setting => {
                transformedSettings[setting.name] = {
                    value: setting.value,
                    description: setting.description
                };
            });

            setSdmsSettings(transformedSettings);
        }

        const sopSettings = result.find(item => item.categoryType === 'SOP');
        if (sopSettings) {
            const transformedSettings = {};

            sopSettings.settingDatas.forEach(setting => {
                transformedSettings[setting.name] = {
                    value: setting.value,
                    description: setting.description
                };
            });

            setSopSettings(transformedSettings);
        }

        const etcSettings = result.find(item => item.categoryType === 'Etc');
        if (etcSettings) {
            const transformedSettings = {};

            etcSettings.settingDatas.forEach(setting => {
                transformedSettings[setting.name] = {
                    value: setting.value,
                    description: setting.description
                };
            });

            setEtcSettings(transformedSettings);
        }

        try {
            const [sensorSubTypes, sensorTypes, sensorList] = await Promise.all([
                ExternalController.GetExternalSensorTypeSubTypes(),
                ExternalController.GetExternalSensorTypes(),
                SDMSController.getSensorList(),
            ]);

            setSensorList(sensorList);

            if (sensorSubTypes && sensorTypes) {
                const filteredSensorTypes = sensorTypes
                    .filter(({ alarm_yn }) => alarm_yn)
                    .map((sensorType) => ({
                        ...sensorType,
                        sensorSubTypes: sensorSubTypes[sensorType.sensor_type_idx] ?? null
                    }));

                setSensorTypes(filteredSensorTypes);
            }
        } catch (error) {
            console.error('센서 정보 불러오기 실패:', error);
            setSensorTypes([]);
            setSensorList([]);
        }
    }

    const initSiteNo = async () => {
        let userInfo = await ProjectResource.initUserInfo();
        if (userInfo === null || userInfo === undefined)
            return;

        let site_sn = null;
        
        if (userInfo.site_sn) {
            site_sn = userInfo.site_sn;
        } else if (ProjectResource.site_sn) {
            site_sn = ProjectResource.site_sn;
        }

        setSelectedSiteNo(site_sn);

        return site_sn;
    }

    const loadDisasterCategory = async () => {
        const [disasterCategories, message] = await SopController.disasterCategories(null, selectedSiteNo);

        if (!disasterCategories) {
            showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
        else {
            setDisasterCategories(disasterCategories);
        }
    }

	const showConfirmDialog = (type, messages, buttons, onClickButton) => {
        const confirmInfo = {};
        confirmInfo.visible = true;
		confirmInfo.type = type;
        confirmInfo.messages = messages;
		confirmInfo.buttons = buttons;
		confirmInfo.onClickButton = onClickButton;

        if (!messages) {
            confirmInfo.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmInfo.messages = messages;
        }
        else {
            confirmInfo.messages = [messages];
        }

        setConfirmMessage(confirmInfo);
    }

    const onCloseConfirmDialog = () => {
		const confirmInfo = {};
		confirmInfo.visible = false;

        setConfirmMessage(confirmInfo);
	}

    const onClickMenu = (menu) => {
        setMenu(menu);
    }

    const getDisplayView = () => {
        let ui = [];

        if (menu === SettingsResource.menu.monitoring3D) {
            ui.push(
                <Monitoring3D
                    key="LayoutSetting_Monitoring3D"
					settings={sdmsSettings}
                    onChangeNeedToSave={onChangeNeedToSave}
                    showConfirmDialog={showConfirmDialog}
                    setShowSpread={setShowSpread}

					useSensorTypes={useSensorTypes}
                />
            );
        }
        else if (menu === SettingsResource.menu.sopSet) {
            ui.push(
                <SopSet
                    key="LayoutSetting_SopSet"
					settings={sopSettings}
                    onChangeNeedToSave={onChangeNeedToSave}
                    showConfirmDialog={showConfirmDialog}
                    onCloseConfirmDialog={onCloseConfirmDialog}
                    sensorTypes={sensorTypes}
                    sensorList={sensorList}
                    disasterCategories={disasterCategories}
                />
            );
        }
        else if (menu === SettingsResource.menu.etc) {
            ui.push(
                <SettingEtc
                    key="LayoutSetting_etc"
					settings={etcSettings}
                    showConfirmDialog={showConfirmDialog}
                    onCloseConfirmDialog={onCloseConfirmDialog}
                    closePopup={closePopup}
                />
            );
        }

        return ui;
    }

	const onChangeNeedToSave = () => {
		bNeedToSave.current = true;
	}

    function transformSettings(sdmsSettings, sopSettings, etcSettings, siteNo) {
    
        const transformCategory = (settings, categoryType) => {
            return {
                categoryType,
                settingDatas: Object.keys(settings).map(key => ({
                    siteNo,
                    name: key,
                    value: settings[key].value,
                    description: settings[key].description
                }))
            };
        };
    
        return {
            categories: [
                transformCategory(sdmsSettings, "SDMS"),
                transformCategory(sopSettings, "SOP"),
                transformCategory(etcSettings, "Etc")
            ]
        };
    }

    const onClickSave = () => {
        if (!bNeedToSave.current) {
            showConfirmDialog(ProjectResource.dialogTypes.WARNING, ['변경된 항목이 없습니다.'], null, null);
            return;
        }

        bNeedToSave.current = false;

        let userInfo = ProjectResource.getUserInfo();
		if (userInfo === null || userInfo === undefined)
			return;

        const transformedData = transformSettings(sdmsSettings, sopSettings, etcSettings, userInfo.site_sn);

        if (transformedData) {
            doSave(transformedData);
        }
    }

    const doSave = async (categories) => {
        const [success, message] = await SettingController.requestSave(categories);

        if (!success) {
            showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
        else {
            // 환경설정 저장시 3D측에 AutoRotation 정보를 전달한다
            sendAutoRotation(categories);
            showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, ['변경사항이 적용되었습니다.'], ['확인'], closePopup);
        }
    }

    const sendAutoRotation = (etcData) => {
        if (!etcData?.categories?.length)
            return;
            
        const sdmsSettings = etcData.categories.find(item => item.categoryType === 'SDMS');
        if (!sdmsSettings?.settingDatas?.length)
            return;

        const cameraIdleTime = sdmsSettings.settingDatas.find(item => item.name === 'CameraIdleTime');
        if (!cameraIdleTime?.value)
            return;

        const wsMgr = socketStore.getState().wsMgr;
        if (!wsMgr?.connected)
            return;
        
        const idleParam = {
            autoRotation: {
                active: 1,
                time: cameraIdleTime.value,
            }
        };

        wsMgr.sendResponseAutoRotationSettings(idleParam);
    }


    const closePopup = () => {
        props.handlePopup('setting', false)
    }

    const getTabMenus = () => {
        const path = window.location.pathname;
        
        if (path === ProjectResource.path.sopSimulator || path === ProjectResource.path.sopManager) {
            return (
                <ul>
                    <li className={menu === SettingsResource.menu.sopSet ? 'on' : null} onClick={() => onClickMenu(SettingsResource.menu.sopSet)}>{SettingsResource.ID.menu.sopSet}</li>
                </ul>
            );
        }

        return (
            <ul>
                <li className={menu === SettingsResource.menu.monitoring3D ? 'on' : null} onClick={() => onClickMenu(SettingsResource.menu.monitoring3D)}>{SettingsResource.ID.menu.monitoring3D}</li>
                <li className={menu === SettingsResource.menu.etc ? 'on' : null} onClick={() => onClickMenu(SettingsResource.menu.etc)}>{SettingsResource.ID.menu.etc}</li>
            </ul>
        );
    }

    const ui = getDisplayView();

    return (
        <>
        <ModalBackground>
        <LayoutSettingComponent className={'UI_Section'} $isSopPage={isSopPage}>
            <button onClick={() => props.handlePopup('setting', false)} className={'closeBtn'}>
                <img src={close_btn} alt='닫기 버튼' width={16} height={16} />
            </button>
            <div className='menuWrap'>
                <h2>환경설정</h2>
                {
                    getTabMenus()
                }
                
            </div>
            {ui}
            <div className='btnWrap'>
                <button className='cancle' onClick={() => props.handlePopup('setting', false)}>취소</button>
                <button className='submit' onClick={() => onClickSave()}>적용</button>
            </div>
        </LayoutSettingComponent>
        {
            showSpread &&
            <SpreadManager
                setShowSpread={setShowSpread}
                sensorTypes={sensorTypes}
                sensorList={sensorList}
                showConfirmDialog={showConfirmDialog}
                onCloseConfirmDialog={onCloseConfirmDialog}
            />
        }
		{
            /* alert창 대신 사용 */
            confirmMessage.visible &&
            <ConfirmDialog 
                type={confirmMessage.type}
                messages={confirmMessage.messages} 
                buttons={confirmMessage.buttons} 
                onClickButton={confirmMessage.onClickButton}
                onCloseConfirmDialog={onCloseConfirmDialog}
            />
        } 
        </ModalBackground>
        </>
    );
}

export default withRouter(LayoutSetting);