import React, { useEffect, useState } from 'react';

import { ModalBackground } from '../../Root/styled/theme';
import { SpreadComponent } from '../styled/settingsStyled';

import close_btn from '../../Common/images/close_btn.png';
import tooltip_icon from '../../Settings/images/tooltip-icon.png';
import binIcon from '../../Settings/images/binIcon.svg';
import { SettingController } from '../services/settingController';
import SettingsResource from '../resource/id';
import SpreadList from './spreadList';
import AddSpread from './addSpread';
import { TeamEditController } from '../../TeamEditor/services/teamEditController';
import AccountFindMember from '../../Account/ui/accountFindMember';
import ProjectResource from '../../Root/resource/id';
import UpdateSpread from './updateSpread';

function SpreadManager(props) {
    const [menu, setMenu] = useState(SettingsResource.spreadMenu.spreadList);
    const [spreadList, setSpreadList] = useState([]);

    const [displayZones, setDisplayZones] = useState([]);

    const [searchText, setSearchText] = useState('');

    const [pageItemCount, setPageItemCount] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [listCount, setListCount] = useState(0);

    const [showFindMemberPopup, setShowFindMemberPopup] = useState(false);
    const [showUpdateSpreadPopup, setShowUpdateSpreadPopup] = useState(false);

    const [jobLevels, setJobLevels] = useState([]);
    const [regularDatas, setRegularDatas] = useState([]);
    const [regularMembers, setRegularMember] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [selectedSpread, setSelectedSpread] = useState(null);

    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (!props.sensorTypes || props.sensorTypes.length === 0) return;

        searchSpreadList();
    }, [menu, searchText, pageIndex, props.sensorTypes]); 

    useEffect(() => {
        // 알람을 받는 센서유형의 센서만 추리기 (위치 selectBox에 들어갈 데이터)
        const displayZones = [];
        displayZones.push(<option key={'zone_all'} value={-1}>전체</option>);
    
        if (!props.sensorList) return;

        for (const sensor of props.sensorList) {
            const isAlarmSensor = sensor.sensorType.alarm_yn;
            const hasZones = sensor.zones.length > 0;
    
            if (isAlarmSensor && hasZones) {
                for (const zone of sensor.zones) {
                    displayZones.push(<option key={`zone_${zone.sensorLink.zone_sn}`} value={zone.sensorLink.zone_sn}>{zone.sensorLink.sensor_name}</option>);
                }
            }
        }
    
        setDisplayZones(displayZones);
    }, [props.sensorList]);

    const init = async () => {
        const [jobLevels] = await TeamEditController.getJobLevels(); // 직위
        let [regularDatas] = await TeamEditController.displayRegular();

        if (jobLevels && jobLevels.length > 0) {
            setJobLevels(jobLevels);
        }

        if (regularDatas && regularDatas.length > 0) {
            setRegularDatas(regularDatas);
        }
    }

    const setRegularMembers = async (searchText) => {
        const userInfo = ProjectResource.getUserInfo();

        if (searchText === null || searchText === undefined) {
            setRegularMember([]);
        }
        else {
            let [members] = await TeamEditController.displayRegularMember(userInfo.siteID, searchText);
    
            if (members && members.length > 0) {
                setRegularMember(members);
            }
        }
    }

    const getJobLevelName = (jobLevelNo) => {
        const levels = jobLevels;

        if (levels && levels.length > 0) {
            const jobLevel = levels.find((x) => x.team_optn_no === jobLevelNo);
            return jobLevel ? jobLevel.team_optn_name : '-';
        }
    }

    const getTeamName = (teamDatas, member) => {
        if (!teamDatas) return;

        for (const team of teamDatas) {
            if (team.No === member.rgl_sn) {
                return team.TeamName;
            }
    
            if (team.Children && team.Children.length > 0) {
                const name = getTeamName(team.Children, member);
                if (name) {
                    return name;
                }
            }
        }
        
        return null;
    };

    const searchSpreadList = async () => {
        const searchTextTypes = getSearchTextTypes();
        const sensorTypeDatas = getSensorTypeDatas();

        const sensorType = -1;
        const sensorSubType = null;
        const messageType = -1;
        const detectType = -1;
        const isActive = null;
        const buildingGroupNo = null;
        const buildingNo = null;
        const zoneNo = null;

        const [result, totalCount, message] = await SettingController.requestGetSpreadMessage(sensorType, sensorSubType, messageType, detectType, isActive, buildingGroupNo, buildingNo, zoneNo, searchText, pageIndex, pageItemCount, searchTextTypes, sensorTypeDatas);

        if (result === null) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            return;
        }
        else {
            const newTotalCount = Math.ceil(totalCount / pageItemCount);

            setSpreadList(result);
            setTotalCount(newTotalCount);
            setListCount(totalCount);

            if (!selectedSpread) return;
            const newSelectedSpread = result.find(item => item.notificationNo === selectedSpread.notificationNo);
            setSelectedSpread(newSelectedSpread);
        }
    }

    const getSearchTextTypes = () => {
        const useDetectType = true;       // 전파구분 검색 사용여부
        const useNotificationName = true; // 전파관리명 검색 사용여부
        const useSensorType = true;       // 센서유형 검색 사용여부
        const useReceiver = false;        // 전파대상자 검색 사용여부
        const useActivate = false;        // 활성화여부 검색 사용여부
        const detectTypes = {300400: "센서탐지", 300401: "재난신고"};
        const activateText = "YES";
        const inactivateText = "NO";

        const searchTextTypes = SettingController.makeSearchTextTypes(useDetectType, useNotificationName, useSensorType, useReceiver, useActivate, detectTypes, activateText, inactivateText);

        return searchTextTypes;
    }

    const getSensorTypeDatas = () => {
		let sensorTypeDatas = [];

        if (!props.sensorTypes) return;

		for (const sensorType of props.sensorTypes) {
			if (sensorType.sensorSubTypes) {
				for (const sensorSubType of sensorType.sensorSubTypes) {
					sensorTypeDatas.push(
						{
							"sensorTypeCode": sensorType.co_code,
							"sensorSubTypeNo": sensorSubType,
							"sensorTypeName": sensorType.sensor_type_name
						}
					);
				}
			}
		}

		return sensorTypeDatas;
	}

    const onClickMenu = (menu) => {
        setMenu(menu);

        if (menu === SettingsResource.spreadMenu.spreadList && pageIndex !== 1) {
            setPageIndex(1);
        }
    }

    const onCheckedRow = (checked, index) => {
		const newDataSource = [...regularMembers];

		if (index === -1) {
			for (let data of newDataSource) {
				data.checked = checked;
			}			
		}
		else {		
			newDataSource[index].checked = checked;
		}

		setRegularMember(newDataSource);
	}

    const updateSelectedMembers = () => {
        const checkedMembers = regularMembers.filter((member) => member.checked);
        setSelectedMembers(checkedMembers);
    }

    const onClickAddSpread = (notificationName, detectType, sensorType, notifyMessage) => {
        if (!notificationName || !detectType || !sensorType || !notifyMessage) {
            props.showConfirmDialog(ProjectResource.dialogTypes.WARNING, ['필수 항목이 입력되지 않았습니다.'], null, null);
            return;
        }

        if (selectedMembers.length === 0) {
            props.showConfirmDialog(ProjectResource.dialogTypes.WARNING, ['전파대상자가 선택되지 않았습니다.'], null, null);
            return;
        }

        updateSpread(notificationName, detectType, sensorType, notifyMessage, selectedMembers);
    }

    const updateSpread = async (notificationName, detectType, sensorTypeCode, notifyMessage, members, isActive = true, notificationNo = -1) => {
        const messageType = 400400;
        const regularNos = [];

		let sensorSubTypes = null;

        const regularMemberNos = members.filter(member => member.rgl_memb_sn).map(member => member.rgl_memb_sn);

        const [result, errorCode, message] = await SettingController.requestSetSpreadMessage(notificationName, notifyMessage, Number(sensorTypeCode), sensorSubTypes, messageType, Number(detectType), isActive, notificationNo, null, null, null, regularNos, regularMemberNos);

        if (result === null) {
            if (errorCode === ProjectResource.errorCode.duplicateData) {
                props.showConfirmDialog(ProjectResource.dialogTypes.WARNING, ["이미 등록된 전파입니다."], null, null);
                return;
            }
            else {
                props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
                return;
            }
        }
        else {
            const successMsg = notificationNo > 0 ? "저장되었습니다." : "신규등록 되었습니다.";
            props.showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, [successMsg], null, null);

            if (notificationNo > 0) {
                // 기존 전파관리 데이터가 수정된 경우
                setRegularMember([]);
                searchSpreadList();
                setIsEditMode(false);
            }
            else {
                setMenu(SettingsResource.spreadMenu.spreadList);
            }

            setSelectedMembers([]);
            onCheckedRow(false, -1)
            return;
        }
    }

    const setPage = (page) => {
		setPageIndex(page);
    }

    const getSpreadMembersText = (members) => {
        if (!members || members.length === 0) {
            return '';
        }

        const name = members[0].memb_name;
        const count = members.length - 1;

        if (count > 0) {
            return <span>{`${name} 외 ${count}명`}</span>
        }
        else {
            return <span>{name}</span>
        }
    }

    const handleUpdateSpreadPopup = (e, spread) => {
        e.preventDefault();
        e.currentTarget.classList.add('selected');
        setSelectedSpread(spread);
        handlePopup(true);
    }

    const handlePopup = (isShow) => {
        if(!isShow) {
            let element = document.getElementsByClassName('selected');
            element = Array.prototype.slice.call(element);

            // 팝업 닫히면 선택된 li tag의 클래스도 삭제
            element.length > 0 &&
                element.map((item) => item.classList.remove('selected'));

            setSelectedSpread(null);
        }
        setShowUpdateSpreadPopup(isShow);
    }

    const getDisplayView = () => {
        let ui = [];

        if (menu === SettingsResource.spreadMenu.spreadList) {
            ui.push(
                <SpreadList
                    key="spreadList"
                    spreadList={spreadList}
                    setSearchText={setSearchText}
                    setPageIndex={setPageIndex}
                    listCount={listCount}
                    totalCount={totalCount}
                    pageItemCount={pageItemCount}
                    pageIndex={pageIndex}
                    setPage={setPage}
                    getSpreadMembersText={getSpreadMembersText}
                    handleUpdateSpreadPopup={handleUpdateSpreadPopup}
                />
            );
        }
        else if (menu === SettingsResource.spreadMenu.addSpread) {
            ui.push(
                <AddSpread
                    key="addSpread"
                    sensorTypes={props.sensorTypes}
                    setShowFindMemberPopup={setShowFindMemberPopup}
                    selectedMembers={selectedMembers}
                    onClickAddSpread={onClickAddSpread}
                    getSpreadMembersText={getSpreadMembersText}
                />
            );
        }

        return ui;
    }

    return (
        <ModalBackground className='UI_Section'>
            <SpreadComponent>
                <button onClick={() => props.setShowSpread(false)} className={'closeBtn'}>
                    <img src={close_btn} alt='닫기 버튼' width={16} height={16} />
                </button>
                <div className='menuWrap'>
                    <h2>전파 관리</h2>
                    <ul>
                        <li className={menu === SettingsResource.spreadMenu.spreadList ? 'on' : null} onClick={() => onClickMenu(SettingsResource.spreadMenu.spreadList)}>목록</li>
                        <li className={menu === SettingsResource.spreadMenu.addSpread ? 'on' : null} onClick={() => onClickMenu(SettingsResource.spreadMenu.addSpread)}>신규등록</li>
                    </ul>
                </div>
                {getDisplayView()}
            </SpreadComponent>
            {
                showFindMemberPopup &&
                <AccountFindMember
                    type={"spread"}
                    handlePopup={setShowFindMemberPopup}
                    regularMembers={regularMembers}
                    setRegularMembers={setRegularMembers}
                    getJobLevelName={getJobLevelName}
                    getTeamName={getTeamName}
                    regularDatas={regularDatas}
                    onCheckedRow={onCheckedRow}
                    updateSelectedMembers={updateSelectedMembers}
                />
            }
            {
                showUpdateSpreadPopup &&
                <UpdateSpread
                    handlePopup={handlePopup}
                    selectedSpread={selectedSpread}
                    showConfirmDialog={props.showConfirmDialog}
                    onCloseConfirmDialog={props.onCloseConfirmDialog}
                    searchSpreadList={searchSpreadList}
                    sensorTypes={props.sensorTypes}
                    setRegularMembers={setRegularMembers}
                    regularMembers={regularMembers}
                    getTeamName={getTeamName}
                    regularDatas={regularDatas}
                    updateSpread={updateSpread}
                    isEditMode={isEditMode}
                    setIsEditMode={setIsEditMode}
                />
            }
        </ModalBackground>
    );
}

export default SpreadManager;