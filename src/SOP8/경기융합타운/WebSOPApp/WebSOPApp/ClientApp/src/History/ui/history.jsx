import React, { useState, useEffect } from 'react';
import HistoryResource from "../resource/id";
import SensorDetectHistory from './sensorDetectHistory';
import SensorDetectAnalysis from './sensorDetectAnalysis';
import SOPHistory from './sopHistory';
import ReportHistory from './ReportHistory';
import StatisticsHistory from './StatisticsHistory';

import { SDMSController } from '../../SDMS/services/sdmsController';
import SettingsStore from '../../Settings/settingsStore';
import ProjectResource from '../../Root/resource/id';
import { SensorDetectHistoryComponent, SensorDetectAnalysisComponent, SOPHistoryComponent, ReportHistoryComponent, StatisticsHistoryComponent } from '../styled/SensorDetectHistoryStyled';


function History(props) {

    const [content, setContent] = useState(HistoryResource.menu.센서_탐지_이력);
    const [buildingGroupList, setBuildingGroupList] = useState(null);
    const [linkSOP, setLinkSOP] = useState(null);       /*{ beginTime: null, actionStepHistoryID: -1 },*/
    const [useSensorTypes, setUseSensorTypes] = useState(null);     // 사용 중인 센서 타입  
    const [selectedSiteNo, setSelectedSiteNo] = useState(null);     // 현재 SiteNo
    const [lastClickRow, setLastClickRow] = useState(null);         // 마지막으로 선택된 Table row index

    useEffect(() => {
        setContent(HistoryResource.menu.센서_탐지_이력);
        initLoadData();

        // 사용중인 센서 타입 초기화
        initUseSensorTypes();

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
	}, [])

    const initSiteNo = async () => {
		let userInfo = await ProjectResource.initUserInfo();
		if (userInfo === null || userInfo === undefined)
			return;

        let siteNo = null;
		
		if (userInfo.siteNo) {
            siteNo = userInfo.siteNo;
        } else if (ProjectResource.SiteNo) {
            siteNo = ProjectResource.SiteNO;
        }

        setSelectedSiteNo(siteNo);

        return siteNo;
	}

    const changeSelectSiteNo = (siteNo) => {
        if (siteNo && siteNo !== selectedSiteNo) {
            setSelectedSiteNo(siteNo);
		}
    }

    const initLoadData = async () => {
        const siteNo = await initSiteNo();

        loadSpatialData(siteNo);
    }

    const loadSpatialData = async (siteNo) => {
        let siteNos = null;
        if (siteNo) {
            siteNos = [siteNo];
        }

        const [buildingGroupList, outdoorZones, errorMessage] = await SDMSController.requestBuildingGroupList(siteNos);
        
        //setState({ buildingGroupList });
    }

    const initUseSensorTypes = () => {
        const sdmsCommonSettings = SettingsStore.getState().sdmsCommonSettings;

        if (sdmsCommonSettings) {
            reloadUseSensorTypes(sdmsCommonSettings);
        }
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

    const getLeftMenu = () => {
        const menuText = HistoryResource.menu;
        const curContent = content;

        return (
            <div id={'hsLft'}>
                <ul className={'hslMenu'}>
                    <li className={curContent === menuText.센서_탐지_이력 ? 'on' : ''} onClick={() => changeContent(menuText.센서_탐지_이력)}><a>센서 탐지 이력</a></li>
                    <li className={curContent === menuText.센서_탐지_분석 ? 'on' : ''} onClick={() => changeContent(menuText.센서_탐지_분석)}><a onClick={() => changeContent(menuText.센서_탐지_분석)}>센서 탐지 분석</a></li>
                    <li className={curContent === menuText.보고서 ? 'on' : ''} onClick={() => changeContent(menuText.보고서)}><a>보고서</a></li>
                    <li className={curContent === menuText.통계 ? 'on' : ''} onClick={() => changeContent(menuText.통계)}><a>통계</a></li>
                    <li className={curContent === menuText.SOP_이력 ? 'on' : ''} onClick={() => changeContent(menuText.SOP_이력)}><a>SOP 이력</a></li>
                </ul> 
            </div>
            );
    }

    const leftMenu = getLeftMenu();

    if (content === HistoryResource.menu.센서_탐지_이력) {
        return (
            <SensorDetectHistoryComponent>
                {leftMenu}
                <SensorDetectHistory key='history_SensorDetectHistory' changeContent={changeContent} buildingGroupList={buildingGroupList} useSensorTypes={useSensorTypes} selectedSiteNo={selectedSiteNo} lastClickRow={lastClickRow} setLastClickRow={setLastClickRow} />
            </SensorDetectHistoryComponent>
        );
    } else if (content === HistoryResource.menu.센서_탐지_분석) {
        return (
            <SensorDetectAnalysisComponent>
                {leftMenu}
                <SensorDetectAnalysis key='history_SensorDetectAnalysis' changeContent={changeContent} buildingGroupList={buildingGroupList} useSensorTypes={useSensorTypes} selectedSiteNo={selectedSiteNo} lastClickRow={lastClickRow} setLastClickRow={setLastClickRow} />
            </SensorDetectAnalysisComponent>
        );
    } else if (content === HistoryResource.menu.SOP_이력) {
        return (
            <SOPHistoryComponent>
                {leftMenu}
                <SOPHistory key='history_SOPHistory' changeContent={changeContent} linkSOP={linkSOP} selectedSiteNo={selectedSiteNo} lastClickRow={lastClickRow} setLastClickRow={setLastClickRow} />
            </SOPHistoryComponent>
        );
    } else if (content === HistoryResource.menu.보고서) {
        return (
            <ReportHistoryComponent>
                {leftMenu}
                <ReportHistory key='history_ReportHistory' changeContent={changeContent} />
            </ReportHistoryComponent>
        );
    } else if (content === HistoryResource.menu.통계) {
        return (
            <StatisticsHistoryComponent>
                {leftMenu}
                <StatisticsHistory key='history_StatisticsHistory' changeContent={changeContent} selectedSiteNo={selectedSiteNo} />
            </StatisticsHistoryComponent>
        );
    } 
}

export default History;