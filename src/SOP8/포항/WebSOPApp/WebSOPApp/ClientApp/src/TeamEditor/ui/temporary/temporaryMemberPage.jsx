import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars-2';

import { TeamEditController } from '../../services/teamEditController';
import ColTemporaryMemberNew from './colTemporaryMemberNew';
import PopupSelectManager from './popupSelectManager';
import ConfirmDialog from '../../../Common/ui/confirmDialog';

import $ from 'jquery';

import TeamEditorResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../../Account/resource/id';

import { SubContTemporaryComponent } from '../../../TeamEditor/styled/teamStyled';

function TemporaryMemberPage(props) {
	const [roles, setRoles] = useState(null);					// 정/부 정보
	const [openPopup, setOpenPopup] = useState(false);			// 팝업창(조직 담당자 설정) 오픈 여부
	const [popupMember, setPopupMember] = useState(null);		// 팝업창(조직 담당자 설정) 파라미터 >> 설정된 담당자

	const [displayMembers, setDisplayMembers] = useState([]);	// 화면에 출력할 팀원 정보들 (검색에 활용)
	const [addIndex, setAddIndex] = useState(-1);				/* 새로 추가될 멤버의 ID (addIndex--; 되서 겹치지 않게 한다) */
	const [search, setSearch] = useState("");
	const [teamName, setTeamName] = useState('');
	const [displayContent, setDisplayContent] = useState([]);
	const [allChecked, setAllChecked] = useState(true); // 테이블 전체 체크 여부에 활용
	const [confirmMessage, setConfirmMessage] = useState({
        visible: false,
        type: null,
        messages: [""],
        buttons: ["확인"],
        onClickButton: null
    });

	let confirmDialogData = []; // 삭제에 활용

	const isFirstRender = useRef(true);

	useEffect(() => {
		// 정/부 ColComboBox 데이터형 만들기
		initRoles();
	}, [])

	const initRoles = async () => {
		// 정/부 ColComboBox 데이터
		const [roleDatas, message] = await TeamEditController.getTemporaryRoleList();

		if (!roleDatas || roleDatas === null) {
			showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
			return;
		}
		else {
			setRoles(roleDatas);
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

	const onClickAddMember = () => {
		if (props.selectedTeam === null || props.selectedTeam === undefined) {
			showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["선택된 팀이 없습니다.", "팀을 먼저 선택해주세요."], null, null);
			return;
        }

		const index = addIndex;
		onAddMember(index);
		setAddIndex(index - 1);
	}

	const onAddMember = (addIndex) => {
		const index = addIndex;

		const isNormal = (props.teamType == TeamEditorResource.ID.textTemporary ? 1 : 0);
		const selectedTeam = props.selectedTeam;
		const temporary = makeTemporaryData(selectedTeam, isNormal);

		const member = new Object();
		member.memberNo = index;
		member.tmpr_sn = props.selectedTeam.No;
		member.isNormal = isNormal;
		member.temporary = temporary;

		let members = props.memberGridData;
		let temporaryMembers = props.temporaryMembers;

		members.push(member);
		temporaryMembers.push(member);

		props.setMemberGridData([...members]);
		props.setTemporaryMembers([...temporaryMembers]);
	}

	const makeTemporaryData = (selectedTeam, isNormal) => {
		let temporary = new Object();
		temporary.tmpr_sn = selectedTeam.No;
		temporary.team_name = selectedTeam.TeamName
		temporary.nor_yn = isNormal === 1 ? true : false;
		temporary.parnts_sn = selectedTeam.ParentTeamNo;

		return temporary;
    }

	const onClickRemoveMember = () => {
		let curMembers = props.memberGridData;
		// 삭제할 인원 분류
		const deleteMembers = [];
		for (let i = 0; i < curMembers.length; i++) {
			if (curMembers[i].checked) {
				deleteMembers.push(curMembers[i]);
			}
		}

		if (deleteMembers.length === 0) {
			showConfirmDialog(ProjectResource.dialogTypes.WARNING, ['삭제할 비상조직원을 선택하세요.'], null, null);
		}
		else {
			confirmDialogData = deleteMembers;
			showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['선택한 비상조직원을 삭제할까요?'], ['취소', '삭제'], onDeleteMember);
		}
	}

	const onDeleteMember = async (index) => {
		if (index !== 1 || !confirmDialogData || confirmDialogData.length === 0) {
			onCloseConfirmDialog();
			return;
        }

		const deleteMembers = confirmDialogData;

		const [success, message] = await TeamEditController.removeTemporaryMembers(deleteMembers);
		if (!success && message.length > 0) {
			showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
			return;
		}

		let curMembers = displayMembers;
		let members = props.memberGridData;
		let temporaryMembers = props.temporaryMembers;

		for (let i = 0; i < deleteMembers.length; i++) {
			for (let j = 0; j < members.length; j++) {
				if (members[j].memberNo === deleteMembers[i].memberNo) {
					members.splice(j, 1);
					break;
				}
			}

			for (let j = 0; j < temporaryMembers.length; j++) {
				if (temporaryMembers[j].memberNo === deleteMembers[i].memberNo) {
					temporaryMembers.splice(j, 1);
					break;
				}
			}

			for (let j = 0; j < curMembers.length; j++) {
				if (curMembers[j].memberNo === deleteMembers[i].memberNo) {
					curMembers.splice(j, 1);
					break;
				}
			}
		}

		setDisplayMembers([...curMembers]);

		onCloseConfirmDialog();
	}

	const searchMember = () => {
		const members = props.memberGridData;

		let searchMembers = [];

		if (!members) {
			setDisplayMembers(searchMembers);
			return searchMembers;
		}

		for (let i = 0; i < members.length; i++) {
			const member = members[i];

			if (search !== null && search !== undefined && search !== "") {

				// SOP 표시 이름에서 검색
				if (member.displaySOPName != null) {
					let displaySOPName = null;
					displaySOPName = member.displaySOPName;

					if (displaySOPName.indexOf(search) !== -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 부서명에서 검색
				if (member.regular != null) {
					let regularName = null;
					regularName = member.regular.team_name;

					if (regularName.indexOf(search) !== -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 멤버 이름에서 검색
				if (member.regularMember != null) {
					let regularMemberName = null;
					regularMemberName = member.regularMember.memb_name;

					if (regularMemberName.indexOf(search) !== -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 멤버 직위에서 검색
				if (member.regularMember && member.regularMember.ofcps_no != null && props.jobPositions != null) {
					let ispush = false;

					for (const [bKey, bValue] of Object.entries(props.jobPositions)) {
						if (bValue.value === member.regularMember.ofcps_no) {
							if (bValue.name.indexOf(search) != -1) {
								searchMembers.push(members[i]);
								ispush = true;
								break;
							}
						}
					}

					if (ispush)
						continue;
				}

				// 정/부에서 검색
				const roles = [
					{name: "정", value: 500400},
					{name: "부", value: 500401}
				];

				if (member.role != null) {
					let ispush = false;

					for (const [bKey, bValue] of Object.entries(roles)) {
						if (bValue.value === member.role) {
							if (bValue.name.indexOf(search) != -1) {
								searchMembers.push(members[i]);
								ispush = true;
								break;
							}
						}
					}

					if (ispush)
						continue;
				}
			}
			else {
				searchMembers.push(members[i]);
			}
		}

		return searchMembers;
	}

	const onClickSearch = () => {
		const search = document.getElementById('search').value;
		setSearch(search);
		return;
	}

	const onKeyPressSearch = (e) => {
		if (e.key === 'Enter') {
			onClickSearch();
		}

		return;
	}

	const onTreeNodeChanged = (team) => {
		if (props.selectedTeam !== team) {
			props.onTeamNodeChanged(team);
		}
	}

	const getTeamName = (team) => {
		if (!team) {
			return '';
		}
	
		let name = [];
		name.push(<p key={team.No} onClick={() => onTreeNodeChanged(team)}>{team.TeamName}</p>);
		let parent = team.ParentTeam;
		
		// ParentTeam 데이터를 가지고 있으면 실행
		while (parent) {
			let currentParent = parent;
			name.unshift(<p key={parent.No} onClick={() => onTreeNodeChanged(currentParent)}>{currentParent.TeamName}</p>);
			parent = currentParent.ParentTeam;
		}
	
		return name;
	};

	// 하위 트리의 팀 ID, TeamName 모두 얻기
	const getChildTeamInfos = (team) => {
		if (!team) {
			return '';
		}

		let teamInfo = [{id: team.No, teamName: team.TeamName}];
	
		if (team.Children.length > 0) {
			team.Children.forEach((child) => {
				teamInfo = teamInfo.concat(getChildTeamInfos(child));
			});
		}
	
		return teamInfo;
	};

	const handleOpenPopup = (member) => {
		setOpenPopup(true);
		setPopupMember(member);

		return;
	}

	const closePopup = () => {
		setOpenPopup(false);

		return;
	}

	const onChangeSelect = (member) => {
		let members = [...props.memberGridData];

		for (let i = 0; i < members.length; i++) {
			let oldMember = members[i];
			
			if (oldMember.TemporaryMemberID === member.TemporaryMemberID) {
				members[i] = member;
            }
		}

		props.onChangeMember(member, true);
		setOpenPopup(false);
	}

	const openPopupSelectManager = () => {
		let popupSelectManagerUI = null;

		if (props.isEditMode && openPopup === true) {
			popupSelectManagerUI = <>
				<PopupSelectManager
					popupMember={popupMember}
					close={closePopup}
					select={onChangeSelect}
					jobLevels={props.jobLevels}
					jobPositions={props.jobPositions}
					regularTreeData={props.regularTreeData}
					regularMembers={props.regularMembers}
					onChangeMember={props.onChangeMember}
					selectedTeam={props.selectedTeam}
				/>
			</>;
		}

		return popupSelectManagerUI;
	}

	const onCheckedRow = (checked, index) => {
		let members = [...props.memberGridData];
		
		if (index === -1) {
			for (let member of members) {
				member.checked = checked;
			}			
		}
		else {
			members[index].checked = checked;
		}

		props.setMemberGridData(members);
	}

	const getViewTemporaryMember = (selectedTeam, members) => {
		const teamInfo = getChildTeamInfos(selectedTeam);

		// 하위 트리가 존재하지 않는 조직
		if (!selectedTeam || selectedTeam.Children.length === 0) {
			const memberList = members.filter(member => member?.temporary?.tmpr_sn === selectedTeam?.No);
			memberList.forEach(member => member.teamName = teamInfo[0]?.teamName);
			return selectedTeam && memberList || [];
		}
		
		// 하위 트리가 존재하는 조직
		const teamIDs = teamInfo.map(team => team.id);
		const memberList = members.filter(member => teamIDs.includes(member.temporary?.tmpr_sn));

		memberList.forEach(member => {
			const team = teamInfo.find(team => member.temporary.tmpr_sn === team.id);
			if (team) {
				member.teamName = team.teamName;
			}
		});

		return memberList;
	}


	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		if (props.temporaryMembers.length === 0) {
			setDisplayContent([]);
			return;
		}

		// 테이블 상단에 표시될 트리 경로 Breadcrumbs
		setTeamName(getTeamName(props.selectedTeam));
		
		// 테이블에 표출할 비상조직원 데이터
		const searchMembers = searchMember();

		const memberList = getViewTemporaryMember(props.selectedTeam, searchMembers);

		const rowContent = [];

		if (memberList && memberList.length > 0) {
			let allMembersChecked = true; // 모든 멤버가 체크되었는지 확인

			memberList.map((member, index) => {
				rowContent.push(
					<li key={member.memberNo} id="temporaryMemberTableBody" className={member.checked ? 'colorOn' : ''}>
						<ColTemporaryMemberNew
							member={member}
							jobPositions={props.jobPositions}
							roles={roles}
							index={index}
							openPopup={handleOpenPopup}
							onChangeMemberEditMode={props.onChangeMemberEditMode}
							onChangeMember={props.onChangeMember}
							onCheckedRow={onCheckedRow}
						/>
					</li>
				);

				// 멤버가 체크되지 않았으면 allMembersChecked를 false로 설정
				if (!member.checked) {
					allMembersChecked = false;
				}
			});

			// allMembersChecked 값에 따라 allChecked 상태 업데이트
			setAllChecked(allMembersChecked);

			setDisplayContent(rowContent);
		} else {
			setAllChecked(false); // 멤버가 없으면 전체 선택 해제
			setDisplayContent([]);
		}

	}, [props.selectedTeam, props.teamType, props.temporaryMembers, props.memberGridData, displayMembers, search]);

	let editArea = null;
	if (props.isEditMode) {
		editArea =
			<>
				<div className={'sctAdd'} onClick={onClickAddMember}>추가</div>
				<div className={'sctDel'} onClick={onClickRemoveMember}>삭제</div>
			</>
	}
	else {
		editArea = null;
	}

	const userInfo = ProjectResource.getUserInfo();

	return (
		<>
			<SubContTemporaryComponent className={'subConts'} $userLevel={userInfo?.grad_sn}>
				<div className={'scWrap'}>
					<div className={'scCont'}>
						<div className={'scTop'}>
							<div>{teamName}</div>
							<div className={'sctRht'}>
								<div className={'sctSch'}>
									<span className={'labelInputText'}>
										<input id="search" type="text" onKeyPress={(e) => onKeyPressSearch(e)} placeholder={TeamEditorResource.ID.textFilter} title={TeamEditorResource.ID.textFilter} />
									</span>
									<a onClick={onClickSearch}></a>
								</div>
								{editArea}
							</div>
						</div>

						<div className='memberListArea'>
							<ul className='memberList temporary'>
								<li className='head'>
									<div><input type='checkbox' checked={allChecked} onChange={(e) => onCheckedRow(e.target.checked, -1)} /></div>
									<div>NO</div>
									<div>소속 조직</div>
									<div>이름</div>
									<div>직위</div>
									<div>정/부</div>
									{/* <div>SOP이름</div> */}
								</li>
								<li className='body'>
									<ul>
										{displayContent}
									</ul>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</SubContTemporaryComponent>

			{openPopupSelectManager()}

			{
				/* alert창 대신 사용 */
				confirmMessage.visible &&
				<ConfirmDialog 
					messages={confirmMessage.messages} 
					buttons={confirmMessage.buttons} 
					onClose={confirmMessage.onClose}
					onClickButton={confirmMessage.onClickButton}
					onCloseConfirmDialog={onCloseConfirmDialog}
					type={confirmMessage.type}
				/>
			}
		</>
	);
}

export default TemporaryMemberPage;