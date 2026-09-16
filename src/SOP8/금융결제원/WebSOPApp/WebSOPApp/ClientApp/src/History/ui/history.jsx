import React, { useState, useEffect } from 'react';
import HistoryResource from "../resource/id";
import SensorDetectHistory from './sensorDetectHistory';
import SensorDetectAnalysis from './sensorDetectAnalysis';
import SOPHistory from './sopHistory';
import SettingsStore from '../../Settings/settingsStore';
import ProjectResource from '../../Root/resource/id';
import { HistoryMenuComponent } from '../styled/SensorDetectHistoryStyled';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import { useSensorList } from '../../Common/hooks/useSensorList';
import { SDMSController } from '../../SDMS/services/sdmsController';
import PatrolHistory from './patrolHistory';
import Icon from '../../Common/components/Icon/Icon';
import ComingPersonHistory from './comingPersonHistory';
import ParkingHistory from './parkingHistory';

function History(props) {
    const { sensorTypes } = useSensorList();

    const locationMenu = props.location?.state?.menu;
    const [content, setContent] = useState(HistoryResource.menu.이벤트_탐지_이력);

    const [buildingGroups, setBuildingGroups] = useState(null);
    const [linkSOP, setLinkSOP] = useState(null);       /*{ beginTime: null, actionStepHistoryID: -1 },*/
    const [useSensorTypes, setUseSensorTypes] = useState(null);     // 사용 중인 센서 타입  
    const [selectedSiteNo, setSelectedSiteNo] = useState(null);     // 현재 SiteNo
    const [lastClickRow, setLastClickRow] = useState(null);         // 마지막으로 선택된 Table row index

    const [showToggleMenu, setShowToggleMenu] = useState(false);    // 출입 이력 토글 버튼

    const [confirmMessage, setConfirmMessage] = useState({
        visible: false,
        type: null,
        messages: [""],
        buttons: ["확인"],
        onClickButton: null
    });	

    useEffect(() => {
        if (locationMenu) {
            setContent(locationMenu);
        }
    }, []);
    
    useEffect(() => {
        initLoadData();
        loadBuildingGroupList();

        // 사용중인 센서 타입 초기화
        initUseSensorTypes();

        props.menuEvent.onClickLogo = onClickLogo;

        const unsubscribe_SettingsStore = SettingsStore.subscribe(() => {
            const data = SettingsStore.getState();

            if (data.actionType === 'SDMS_COMMON_SETTINGS') {
                // 사용중인 센서타입 reload
                reloadUseSensorTypes(data.sdmsCommonSettings);
            } else if (data.actionType === 'SELECT_SITENO') {
                changeSelectSiteNo(data.selectSiteNo);
            }
        });

        return () => {
            unsubscribe_SettingsStore();
        };
    }, []);

	useEffect(() => {
		const handleClickOutside = (e) => {
            if (!e.target.classList.contains("clickArea")) {
                const checkedTr = document.getElementById('lineOn');

				if(checkedTr) {
					setLastClickRow(null);
				}
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
	}, []);

    useEffect(() => {
        setShowToggleMenu(
            content === HistoryResource.menu.출입자_이력 ||
            content === HistoryResource.menu.출입차량_이력
        );
    }, [content]);

    const onClickLogo = () => {
        setContent(HistoryResource.menu.이벤트_탐지_이력);
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

    const loadBuildingGroupList = async () => {
        const [buildingGroups, _, message] = await SDMSController.requestBuildingGroupList();

        if (!buildingGroups) {
            showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            return;
        }

        setBuildingGroups(buildingGroups);
    }

    const changeSelectSiteNo = (site_sn) => {
        if (site_sn && site_sn !== selectedSiteNo) {
            setSelectedSiteNo(site_sn);
		}
    }

    const initLoadData = async () => {
        const site_sn = await initSiteNo();

        loadSpatialData(site_sn);
    }

    const loadSpatialData = async (site_sn) => {
        let siteNos = null;
        if (site_sn) {
            siteNos = [site_sn];
        }

        // const [buildingGroupList, outdoorZones, errorMessage] = await SDMSController.requestBuildingGroupList(siteNos);
        
        //setState({ buildingGroupList });
    }

    const initUseSensorTypes = () => {
        const sdmsCommonSettings = SettingsStore.getState().sdmsCommonSettings;

        if (sdmsCommonSettings) {
            reloadUseSensorTypes(sdmsCommonSettings);
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

    const reloadUseSensorTypes = (sdmsCommonSettings) => {
        let data = sdmsCommonSettings;

        if (data?.UseFire !== undefined ||
            data?.UsePSM !== undefined ||
            data?.UseETC !== undefined ||
            data?.UseSVMS !== undefined ||
            data?.UseEarthquake !== undefined ||
            data?.UseStrongWind !== undefined ||
            data?.UseBlackOut !== undefined ||
            data?.UseBecon !== undefined ||
            data?.UseEnvironment !== undefined ||
            data?.UseManufacture !== undefined) {

            let sensorTypes = new Object();
            sensorTypes.UseFire = false;
            sensorTypes.UsePSM = false;
            sensorTypes.UseETC = false;
            sensorTypes.UseSVMS = false;
            sensorTypes.UseEarthquake = false;
            sensorTypes.UseStrongWind = false;
            sensorTypes.UseBlackOut = false;
            sensorTypes.UseBecon = false;
            sensorTypes.UseEnvironment = false;
            sensorTypes.UseManufacture = false;

            if (data.UseFire === "true")
                sensorTypes.UseFire = true;
            if (data.UsePSM === "true")
                sensorTypes.UsePSM = true;
            if (data.UseETC === "true")
                sensorTypes.UseETC = true;
            if (data.UseSVMS === "true")
                sensorTypes.UseSVMS = true;
            if (data.UseEarthquake === "true")
                sensorTypes.UseEarthquake = true;
            if (data.UseStrongWind === "true")
                sensorTypes.UseStrongWind = true;
            if (data.UseBlackOut === "true")
                sensorTypes.UseBlackOut = true;
            if (data.UseBecon === "true")
                sensorTypes.UseBecon = true;
            if (data.UseEnvironment === "true")
                sensorTypes.UseEnvironment = true;
            if (data.UseManufacture === "true")
                sensorTypes.UseManufacture = true;

            if (useSensorTypes === null ||
                useSensorTypes.UseFire !== data.UseFire ||
                useSensorTypes.UsePSM !== data.UsePSM ||
                useSensorTypes.UseETC !== data.UseETC ||
                useSensorTypes.UseSVMS !== data.UseSVMS ||
                useSensorTypes.UseEarthquake !== data.UseEarthquake ||
                useSensorTypes.UseStrongWind !== data.UseStrongWind ||
                useSensorTypes.UseBlackOut !== data.UseBlackOut ||
                useSensorTypes.UseBecon !== data.UseBecon ||
                useSensorTypes.UseEnvironment !== data.UseEnvironment ||
                useSensorTypes.UseManufacture !== data.UseManufacture) {

                setUseSensorTypes(sensorTypes);
            }
        }
    }

    const changeContent = (content, param) => {
        if (content === HistoryResource.menu.SOP_이력 && param && param.beginTime && param.actionStepHistoryID) {
            setContent(content);
            setLinkSOP(param);
        }
        else {
            setContent(content);
            setLinkSOP(null);
        }
    }

    const formatIsoToDateTime = (isoString) => {
        const date = new Date(isoString);

        return date.getFullYear() + "-" +
            String(date.getMonth() + 1).padStart(2, '0') + "-" +
            String(date.getDate()).padStart(2, '0') + " " +
            String(date.getHours()).padStart(2, '0') + ":" +
            String(date.getMinutes()).padStart(2, '0') + ":" +
            String(date.getSeconds()).padStart(2, '0');
    };

    return (
        <>
            <HistoryMenuComponent>
                <ul className={'hslMenu'}>
                    <li className={content === HistoryResource.menu.이벤트_탐지_이력 ? 'on' : ''} onClick={() => changeContent(HistoryResource.menu.이벤트_탐지_이력)}><a>{HistoryResource.menu.이벤트_탐지_이력}</a></li>
                    <li className={content === HistoryResource.menu.이벤트_탐지_분석 ? 'on' : ''} onClick={() => changeContent(HistoryResource.menu.이벤트_탐지_분석)}><a>{HistoryResource.menu.이벤트_탐지_분석}</a></li>
                    <li className={content === HistoryResource.menu.SOP_실행_이력 ? 'on' : ''} onClick={() => changeContent(HistoryResource.menu.SOP_실행_이력)}><a>{HistoryResource.menu.SOP_실행_이력}</a></li>
                    <li className={content === HistoryResource.menu.순찰_결과_이력 ? 'on' : ''} onClick={() => changeContent(HistoryResource.menu.순찰_결과_이력)}><a>{HistoryResource.menu.순찰_결과_이력}</a></li>
                    <li className='toggleMenu'>
                        <div className={showToggleMenu ? 'on' : 'off'} onClick={() => setShowToggleMenu(!showToggleMenu)}>
                            <a>{HistoryResource.menu.출입_이력}</a>
                            <Icon.Arrow size={'xs'} direction={showToggleMenu ? 'bottom' : 'top'} />
                        </div>
                        {showToggleMenu &&
                            <ul>
                                <li className={content === HistoryResource.menu.출입자_이력 ? 'on' : ''} onClick={() => changeContent(HistoryResource.menu.출입자_이력)}><a>{HistoryResource.menu.출입자_이력}</a></li>
                                <li className={content === HistoryResource.menu.출입차량_이력 ? 'on' : ''} onClick={() => changeContent(HistoryResource.menu.출입차량_이력)}><a>{HistoryResource.menu.출입차량_이력}</a></li>
                            </ul>
                        }
                    </li>
                </ul> 
            </HistoryMenuComponent>
        {
            content === HistoryResource.menu.이벤트_탐지_이력 &&
                <SensorDetectHistory key='history_SensorDetectHistory' changeContent={changeContent} useSensorTypes={useSensorTypes} selectedSiteNo={selectedSiteNo} lastClickRow={lastClickRow} setLastClickRow={setLastClickRow} showConfirmDialog={showConfirmDialog} onCloseConfirmDialog={onCloseConfirmDialog}formatIsoToDateTime={formatIsoToDateTime} sensorTypes={sensorTypes} buildingGroups={buildingGroups} />
        }
        {
            content === HistoryResource.menu.이벤트_탐지_분석 &&
                <SensorDetectAnalysis key='history_SensorDetectAnalysis' changeContent={changeContent} useSensorTypes={useSensorTypes} selectedSiteNo={selectedSiteNo} lastClickRow={lastClickRow} setLastClickRow={setLastClickRow} showConfirmDialog={showConfirmDialog} onCloseConfirmDialog={onCloseConfirmDialog}formatIsoToDateTime={formatIsoToDateTime} sensorTypes={sensorTypes} buildingGroups={buildingGroups} />
        }
        {
            content === HistoryResource.menu.SOP_실행_이력 &&
                <SOPHistory key='history_SOPHistory' changeContent={changeContent} linkSOP={linkSOP} selectedSiteNo={selectedSiteNo} lastClickRow={lastClickRow} setLastClickRow={setLastClickRow} showConfirmDialog={showConfirmDialog} onCloseConfirmDialog={onCloseConfirmDialog} />
        }
        {
            content === HistoryResource.menu.순찰_결과_이력 &&
                <PatrolHistory key='history_PatrolHistory' changeContent={changeContent} selectedSiteNo={selectedSiteNo} lastClickRow={lastClickRow} setLastClickRow={setLastClickRow} showConfirmDialog={showConfirmDialog} onCloseConfirmDialog={onCloseConfirmDialog} formatIsoToDateTime={formatIsoToDateTime} />
        }
        {
            content === HistoryResource.menu.출입자_이력 &&
                <ComingPersonHistory key='history_ComingPersonHistory' changeContent={changeContent} selectedSiteNo={selectedSiteNo} lastClickRow={lastClickRow} setLastClickRow={setLastClickRow} showConfirmDialog={showConfirmDialog} onCloseConfirmDialog={onCloseConfirmDialog} formatIsoToDateTime={formatIsoToDateTime} />
        }
        {
            content === HistoryResource.menu.출입차량_이력 &&
                <ParkingHistory key='history_ParkingHistory' changeContent={changeContent} selectedSiteNo={selectedSiteNo} lastClickRow={lastClickRow} setLastClickRow={setLastClickRow} showConfirmDialog={showConfirmDialog} onCloseConfirmDialog={onCloseConfirmDialog} formatIsoToDateTime={formatIsoToDateTime} />
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
        </>
    );
}

export default History;