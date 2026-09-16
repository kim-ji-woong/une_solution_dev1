import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';

import { LayoutSettingComponent } from '../styled/settingsStyled';
import SettingsResource from '../resource/id';
import { ModalBackground } from '../../Root/styled/theme';
import Monitoring3D from './monitoring3D';
import SopSet from './sopSet';
import UserOption from './userOption';
import SettingEtc from './settingEtc';
import SettingsStore from '../settingsStore';

import ProjectResource from '../../Root/resource/id';
import ConfirmDialog from '../../Common/ui/confirmDialog';

import { SettingController } from '../services/settingController';
import { SDMSController } from '../../SDMS/services/sdmsController';
import { TeamEditController } from '../../TeamEditor/services/teamEditController';
import SopController from '../../SOPManager/services/sopController';
import SpreadManager from './spreadManager';
import Icon from '../../Common/components/Icon/Icon';

import { AccountController } from '../../Account/services/accountController';
import { useToast } from '../../Common/components/Toast/ToastProvider';
import Button from '../../Common/components/button';

function LayoutSetting(props) {
    const { onShowToast } = useToast();

    const [menu, setMenu] = useState(SettingsResource.menu.monitoring3D);
    const [selectedSiteNo, setSelectedSiteNo] = useState(null);     // 현재 SiteNo

    const [sensorList, setSensorList] = useState([]);
    const [disasterCategories, setDisasterCategories] = useState(null);     // 재난 종류
    const [buildingGroupList, setBuildingGroupList] = useState(null);
    const [teamTreeDatas, setTeamTreeDatas] = useState(null);
    const [teams, setTeams] = useState(null);
    const [members, setMembers] = useState(null);
    const [jobPositions, setJobPositions] = useState([]);

    const [settings, setSettings] = useState(null);
    const [spreadMessages, setSpreadMessages] = useState(null);
    const [linkedSOPs, setLinkedSOPs] = useState(null);     // 재난 종류 및 빌딩, 층에 따른 SOP 연결 정보
    const [sensorTypes, setSensorTypes] = useState([null]);   // 사용하는 센서 종류
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

    const [needToSave, setNeedToSave] = useState(false);

    useEffect(() => {
        init();
        initSiteNo();
    }, []);

    const init = async () => {
		let userInfo = await ProjectResource.initUserInfo();
		if (userInfo === null || userInfo === undefined)
			return;

        const [jobPositions] = await TeamEditController.getJobPositions(); // 직위

        if (jobPositions && jobPositions.length > 0) {
            setJobPositions(jobPositions);
        }

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

    const handleToast = (message) => {
        onShowToast(message);
    };

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
					buildingGroupList={buildingGroupList} 
					spreadMessages={spreadMessages}
					teamTreeDatas={teamTreeDatas} 
					teams={teams} 
					members={members} 
					useSensorTypes={useSensorTypes}
                    setShowSpread={setShowSpread}
                    selectedSiteNo={selectedSiteNo}
                    handleToast={handleToast}
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
                    selectedSiteNo={selectedSiteNo}
                    handleToast={handleToast}
                />
            );
        }
        else if (menu === SettingsResource.menu.userOption) {
            ui.push(
                <UserOption
                    key="LayoutSetting_UserOption"
                    settings={sdmsSettings}
                    onChangeNeedToSave={onChangeNeedToSave}
                    showConfirmDialog={showConfirmDialog}
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
        setNeedToSave(true);
    };

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
            handleToast('적용되었습니다');
            closePopup();
        }
    } 

    const closePopup = () => {
        props.handlePopup('setting', false)
    }

    return (
        <>
        <ModalBackground>
        <LayoutSettingComponent>
            <div className='container'>
                <div className='menuWrap'>
                    <h2>환경설정</h2>
                    <ul>
                        <li className={menu === SettingsResource.menu.monitoring3D ? 'on' : null} onClick={() => onClickMenu(SettingsResource.menu.monitoring3D)}>
                            <Icon.SettingSdmsIcon size={"xxxs"} />
                            {SettingsResource.ID.menu.monitoring3D}
                        </li>
                        <li className={menu === SettingsResource.menu.sopSet ? 'on' : null} onClick={() => onClickMenu(SettingsResource.menu.sopSet)}>
                            <Icon.SettingSopIcon size={"xxxs"} />
                            {SettingsResource.ID.menu.sopSet}
                        </li>
                        <li className={menu === SettingsResource.menu.userOption ? 'on' : null} onClick={() => onClickMenu(SettingsResource.menu.userOption)}>
                            <Icon.SettingUserOptionIcon size={"xxxs"} />
                            {SettingsResource.ID.menu.userOption}
                        </li>
                        <li className={menu === SettingsResource.menu.etc ? 'etc on' : 'etc'} onClick={() => onClickMenu(SettingsResource.menu.etc)}>
                            <Icon.SettingETCIcon size={"xxxs"} />
                            {SettingsResource.ID.menu.etc}
                        </li>
                    </ul>
                </div>
                {getDisplayView()}
                <div className='btnWrap'>
                    <Button
                        className="cancle"
                        variant="outline"
                        size="xs"
                        onClick={() => props.handlePopup('setting', false)}
                    >
                        취소
                    </Button>
                    <Button
                        variant="fill"
                        size="xs"
                        disabled={!needToSave}
                        onClick={() => onClickSave()}
                    >
                        적용하기
                    </Button>
                </div>
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
                jobPositions={jobPositions}
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