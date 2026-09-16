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
import { useToast } from '../../Common/components/Toast/ToastProvider';

function SpreadManager(props) {
    const { onShowToast } = useToast();

    const [menu, setMenu] = useState(SettingsResource.spreadMenu.spreadList);
    const [spreadList, setSpreadList] = useState([]);
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
    const [selectedMembers, setSelectedMembers] = useState([]);         // 신규등록(Add)용
    const [editMembersDraft, setEditMembersDraft] = useState([]);       // 편집(Update)용
    const [selectedSpread, setSelectedSpread] = useState(null);

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (!props.sensorTypes || props.sensorTypes.length === 0) return;

        searchSpreadList();
    }, [menu, searchText, pageIndex, props.sensorTypes]);

    const init = async () => {
        const [jobLevels] = await TeamEditController.getJobLevels(); // 직위
        let [regularDatas] = await TeamEditController.displayRegular();

        if (jobLevels && jobLevels.length > 0) {
            setJobLevels(jobLevels);
        }

        if (regularDatas && regularDatas.length > 0) {
            setRegularDatas(regularDatas);
        }
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
    };

    const getJobPositionName = (jobPositionNo) => {
        const jobPositions = props.jobPositions;

        if (jobPositions && jobPositions.length > 0) {
            const jobPosition = jobPositions.find((x) => x.team_optn_no === jobPositionNo);
            return jobPosition ? jobPosition.team_optn_name : '-';
        }
    };

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

    const handleToast = (message) => {
        onShowToast(message);
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

        const [result, totalCount, message] = await SettingController.requestGetSpreadMessage(
            sensorType, sensorSubType, messageType, detectType, isActive,
            buildingGroupNo, buildingNo, zoneNo, searchText, pageIndex, pageItemCount,
            searchTextTypes, sensorTypeDatas
        );

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
    };

    const getSearchTextTypes = () => {
        const useDetectType = false;      // 전파구분 검색 사용여부
        const useNotificationName = true; // 전파관리명 검색 사용여부
        const useSensorType = true;       // 센서유형 검색 사용여부
        const useReceiver = false;        // 전파대상자 검색 사용여부
        const useActivate = false;        // 활성화여부 검색 사용여부
        const detectTypes = {300400: "센서탐지", 300401: "재난신고"};
        const activateText = "YES";
        const inactivateText = "NO";

        const searchTextTypes = SettingController.makeSearchTextTypes(
            useDetectType, useNotificationName, useSensorType, useReceiver, useActivate,
            detectTypes, activateText, inactivateText
        );

        return searchTextTypes;
    };

    const getSensorTypeDatas = () => {
        let sensorTypeDatas = [];

        if (!props.sensorTypes) return;

        for (const sensorType of props.sensorTypes) {
            if (sensorType?.sensorSubTypes) {
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
    };

    const onClickMenu = (menu) => {
        setMenu(menu);

        if (menu === SettingsResource.spreadMenu.spreadList) {
            if (pageIndex !== 1) {
                setPageIndex(1);
            }
            else if (selectedMembers.length > 0) {
                setSelectedMembers([]);
            }
        }
    };

    // 신규등록(Add)에서만 사용
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
    };

    const updateSelectedMembers = () => {
        const checkedMembers = regularMembers.filter((member) => member.checked);
        setSelectedMembers(checkedMembers);
    };

    const onClickAddSpread = (notificationName, sensorType, notifyMessage) => {
        if (!notificationName || !sensorType || !notifyMessage) {
            handleToast('필수 항목이 입력되지 않았습니다');
            return;
        }

        if (selectedMembers.length === 0) {
            handleToast('전파대상자가 선택되지 않았습니다');
            return;
        }

        updateSpread(notificationName, sensorType, notifyMessage, selectedMembers);
    };

    const updateSpread = async (notificationName, sensorTypeCode, notifyMessage, members, isActive = true, notificationNo = -1) => {
        const messageType = 400400;
        const regularNos = [];
        const detectType = -1;

        let sensorSubTypes = null;

        const regularMemberNos = members.filter(member => member.rgl_memb_sn).map(member => member.rgl_memb_sn);

        const [result, errorCode, message] = await SettingController.requestSetSpreadMessage(
            notificationName, notifyMessage, Number(sensorTypeCode), sensorSubTypes, messageType,
            detectType, isActive, notificationNo, null, null, null, regularNos, regularMemberNos
        );

        if (result === null) {
            if (errorCode === ProjectResource.errorCode.duplicateData) {
                handleToast('이미 등록된 전파입니다');
                return;
            }
            else {
                props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
                return;
            }
        }
        else {
            const successMsg = notificationNo > 0 ? "저장되었습니다." : "등록 되었습니다";
            handleToast(successMsg);

            if (notificationNo > 0) {
                // 기존 전파관리 데이터가 수정된 경우
                setRegularMember([]);
                searchSpreadList();
            }
            else {
                setMenu(SettingsResource.spreadMenu.spreadList);
            }

            setSelectedMembers([]);
            onCheckedRow(false, -1);
            return;
        }
    };

    const setPage = (page) => {
        setPageIndex(page);
    };

    const getSpreadMembersText = (members) => {
        if (!members) return '';

        return <span>{`${members.length}명`}</span>;
    };

    const handleUpdateSpreadPopup = (e, spread) => {
        e.preventDefault();
        e.currentTarget.classList.add('selected');

        setSelectedSpread(spread);
        setEditMembersDraft(spread?.regularMembers || []);
        handlePopup(true);
    };

    const handlePopup = (isShow) => {
        if (!isShow) {
            let element = document.getElementsByClassName('selected');
            element = Array.prototype.slice.call(element);
            element.forEach(item => item.classList.remove('selected'));

            setSelectedSpread(null);
        }
        setShowUpdateSpreadPopup(isShow);
    };

    const onCheckedRowDraft = (checked, index) => {
        if (index === -1) {
            // 전체 선택/해제: 후보 리스트(regularMembers) 기준
            setEditMembersDraft(checked ? [...regularMembers] : []);
            return;
        }
        const m = regularMembers[index];
        setEditMembersDraft(prev => {
            const exists = prev.some(x => x.rgl_memb_sn === m.rgl_memb_sn);
            if (checked && !exists) return [...prev, m];
            if (!checked && exists) return prev.filter(x => x.rgl_memb_sn !== m.rgl_memb_sn);
            return prev;
        });
    };

    const openFindMemberPopupForAdd = () => {
        // selectedMembers → regularMembers.checked 동기화
        const selectedSet = new Set((selectedMembers || []).map(m => m.rgl_memb_sn));
        setRegularMember(prev => (prev || []).map(m => ({
            ...m,
            checked: selectedSet.has(m.rgl_memb_sn)
        })));
        setShowFindMemberPopup(true);
    };

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
                    setShowFindMemberPopup={openFindMemberPopupForAdd}
                    selectedMembers={selectedMembers}
                    onClickAddSpread={onClickAddSpread}
                    getSpreadMembersText={getSpreadMembersText}
                />
            );
        }

        return ui;
    };

    return (
        <ModalBackground className='UI_Section'>
            <SpreadComponent>
                <div className='titleWrap'>
                    <h5 className='title'>
                        초기상황 전파 설정
                    </h5>
                    <IconButton
                        variant="unfill"
                        size="xxs"
                        icon={<Icon.Closer size={"xxs"} />}
                        onClick={() => props.setShowSpread(false)}
                    >
                        닫기
                    </IconButton>
                </div>
                <div className='content'>
                    <div className='menuWrap'>
                        <ul className='menuTypeWrap'>
                            <li className={menu === SettingsResource.spreadMenu.spreadList ? 'on' : null} onClick={() => onClickMenu(SettingsResource.spreadMenu.spreadList)}>목록</li>
                            <li className={menu === SettingsResource.spreadMenu.addSpread ? 'on' : null} onClick={() => onClickMenu(SettingsResource.spreadMenu.addSpread)}>신규등록</li>
                        </ul>
                    </div>
                    {getDisplayView()}
                </div>
            </SpreadComponent>

            {showUpdateSpreadPopup && (
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
                    handleToast={handleToast}
                    setShowFindMemberPopup={setShowFindMemberPopup}
                    selectedMembersDraft={editMembersDraft}
                    setSelectedMembersDraft={setEditMembersDraft}
                />
            )}

            {showFindMemberPopup && (
                <AccountFindMember
                    type="spread"
                    mode={showUpdateSpreadPopup ? 'edit' : 'add'}
                    handlePopup={setShowFindMemberPopup}
                    regularMembers={regularMembers}
                    setRegularMembers={setRegularMembers}
                    getJobPositionName={getJobPositionName}
                    getTeamName={getTeamName}
                    regularDatas={regularDatas}
                    onCheckedRow={showUpdateSpreadPopup ? undefined : onCheckedRow}
                    updateSelectedMembers={showUpdateSpreadPopup ? undefined : updateSelectedMembers}
                    selectedMembers={showUpdateSpreadPopup ? undefined : selectedMembers}
                    onCheckedRowDraft={showUpdateSpreadPopup ? onCheckedRowDraft : undefined}
                    selectedMembersDraft={showUpdateSpreadPopup ? editMembersDraft : undefined}
                    selectedSpread={showUpdateSpreadPopup ? selectedSpread : undefined}
                    setSelectedMembersDraft={setEditMembersDraft}
                />
            )}
        </ModalBackground>
    );
}

export default SpreadManager;