import React, { useEffect, useState } from 'react';

import { ModalBackground } from '../../Root/styled/theme';
import { SpreadComponent } from '../styled/settingsStyled';

import { SettingController } from '../services/settingController';
import SettingsResource from '../resource/id';
import SpreadList from './spreadList';
import AddSpread from './addSpread';
import { TeamEditController } from '../../TeamEditor/services/teamEditController';
import AccountFindMember from '../../Account/ui/accountFindMember';
import ProjectResource from '../../Root/resource/id';
import UpdateSpread from './updateSpread';
import IconButton from '../../Common/components/iconButton';
import Icon from '../../Common/components/Icon/Icon';

const spreadSortType = {
    detectType: 0,
    notificationName: 1,
    sensorTypeName: 2,
    isActive: 3,
    notificationNo: 4,
};

function SpreadManager(props) {
    const [menu, setMenu] = useState(SettingsResource.spreadMenu.spreadList);
    const [spreadList, setSpreadList] = useState([]);

    const [displayZones, setDisplayZones] = useState([]);

    const [searchText, setSearchText] = useState('');

    const [pageItemCount, setPageItemCount] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [listCount, setListCount] = useState(0);
    const [sortType, setSortType] = useState(spreadSortType.notificationNo);
    const [sortMethod, setSortMethod] = useState(false);

    const [showFindMemberPopup, setShowFindMemberPopup] = useState(false);
    const [showUpdateSpreadPopup, setShowUpdateSpreadPopup] = useState(false);

    const [jobPositions, setJobPositions] = useState([]);
    const [regularDatas, setRegularDatas] = useState([]);
    const [regularMembers, setRegularMember] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [selectedSpread, setSelectedSpread] = useState(null);

    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (props.sensorTypes.length === 0) return;

        searchSpreadList();
    }, [menu, searchText, pageIndex, props.sensorTypes, sortType, sortMethod]); 

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

    useEffect(() => {
        if (selectedSpread && isEditMode) {
            setSelectedMembers(selectedSpread.regularMembers || []);
        }
    }, [selectedSpread, isEditMode]);

    const init = async () => {
        const [jobPositions] = await TeamEditController.getJobPositions(); // 직위
        let [regularDatas] = await TeamEditController.displayRegular();

        if (jobPositions && jobPositions.length > 0) {
            setJobPositions(jobPositions);
        }

        if (regularDatas && regularDatas.length > 0) {
            setRegularDatas(regularDatas);
        }
    }

    const setRegularMemberList = (members) => {
        setRegularMember(members);
    };

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

    const getJobPositionName = (jobPositionNo) => {
        const positions = jobPositions;

        if (positions && positions.length > 0) {
            const jobPosition = positions.find((x) => x.team_optn_no === jobPositionNo);
            return jobPosition ? jobPosition.team_optn_name : '-';
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

        const [result, totalCount, message] = await SettingController.requestGetSpreadMessage(sensorType, sensorSubType, messageType, detectType, isActive, buildingGroupNo, buildingNo, zoneNo, searchText, pageIndex, pageItemCount, searchTextTypes, sensorTypeDatas, sortType, sortMethod);

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

        // 탭 변경 시 선택된 전파대상자 초기화
        setSelectedMembers([]);
        onCheckedRow(false, -1);

        if (menu === SettingsResource.spreadMenu.spreadList && pageIndex !== 1) {
            setPageIndex(1);
        }
    }

    const onClickSortSpreadList = (nextSortType) => {
        if (sortType === nextSortType) {
            setSortMethod(!sortMethod);
        }
        else {
            setSortType(nextSortType);
            setSortMethod(true);
        }

        if (pageIndex !== 1) {
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
            const successMsg = notificationNo > 0 ? "저장되었습니다." : "등록되었습니다.";

            props.handleToast(successMsg);

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
                    searchText={searchText}
                    setSearchText={setSearchText}
                    setPageIndex={setPageIndex}
                    listCount={listCount}
                    totalCount={totalCount}
                    pageItemCount={pageItemCount}
                    pageIndex={pageIndex}
                    setPage={setPage}
                    sortType={sortType}
                    sortMethod={sortMethod}
                    sortTypes={spreadSortType}
                    onClickSortSpreadList={onClickSortSpreadList}
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
                    onClickMenu={onClickMenu}
                />
            );
        }

        return ui;
    }

    return (
        <ModalBackground className='UI_Section'>
            <SpreadComponent>
                <div>
                    <div className='titleWrap'>
                        <h2>초기 상황 전파 설정</h2>
                        <IconButton
                            variant="unfill"
                            size="md"
                            icon={<Icon.Closer />}
                            onClick={() => props.setShowSpread(false)}
                        >
                            닫기
                        </IconButton>
                    </div>
                    <div className='menuWrap'>
                        <ul>
                            <li className={menu === SettingsResource.spreadMenu.spreadList ? 'on' : null} onClick={() => onClickMenu(SettingsResource.spreadMenu.spreadList)}>목록</li>
                            <li className={menu === SettingsResource.spreadMenu.addSpread ? 'on' : null} onClick={() => onClickMenu(SettingsResource.spreadMenu.addSpread)}>신규등록</li>
                        </ul>
                    </div>
                    {getDisplayView()}
                </div>
            </SpreadComponent>
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
                    handleToast={props.handleToast}
                    setShowFindMemberPopup={setShowFindMemberPopup}
                    selectedMembers={selectedMembers}
                />
            }
            {
                showFindMemberPopup &&
                <AccountFindMember
                    type={"spread"}
                    handlePopup={setShowFindMemberPopup}
                    regularMembers={regularMembers}
                    setRegularMemberList={setRegularMemberList}
                    setRegularMembers={setRegularMembers}
                    getJobPositionName={getJobPositionName}
                    getTeamName={getTeamName}
                    regularDatas={regularDatas}
                    onCheckedRow={onCheckedRow}
                    updateSelectedMembers={updateSelectedMembers}
                    selectedMembers={selectedMembers}
                />
            }
        </ModalBackground>
    );
}

export default SpreadManager;