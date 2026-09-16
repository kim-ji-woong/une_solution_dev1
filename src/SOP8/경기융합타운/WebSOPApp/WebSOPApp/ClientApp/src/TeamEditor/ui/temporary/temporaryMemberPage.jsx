import React, { useState, useEffect } from 'react';
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
	const [selectedTeam, setSelectedTeam] = useState(null);		// 선택된 팀
	const [members, setMembers] = useState(null);				// 선택된 팀원 정보들
	const [displayMembers, setDisplayMembers] = useState([]);	// 화면에 출력할 팀원 정보들 (검색에 활용)
	const [roles, setRoles] = useState(null);					// 정/부 정보들 (JSON {{value: "value값", name: "name값"}...})
	const [openPopup, setOpenPopup] = useState(false);			// 팝업창(조직 담당자 설정) 오픈 여부
	const [popupMember, setPopupMember] = useState(null);		// 팝업창(조직 담당자 설정) 파라미터 >> 설정된 담당자
	const [addIndex, setAddIndex] = useState(-1);				/* 새로 추가될 멤버의 ID (addIndex--; 되서 겹치지 않게 한다) */
	const [memberGridData, setMemberGridData] = useState([]);
	const [search, setSearch] = useState("");
	const [confirmMessage, setConfirmMessage] = useState({
        visible: false,
        type: null,
        messages: [""],
        buttons: ["확인"],
        onClickButton: null
    });

	let confirmDialogData = []; // 삭제에 활용

	useEffect(() => {
		$('table').css({ 'width': '100%', 'border-spacing': '0', 'border-collapse': 'collapse', 'table-layout': 'fixed' });

		// 정/부 ColComboBox 데이터형 만들기
		initRoles();
	}, [])

	const initRoles = () => {
		const arrRoles = new Array();

		// 정/부 ColComboBox 데이터형 만들기 >> JSON {{value: "value값", name: "name값"}...}
		let item = new Object();
		item.value = "";
		item.name = "알수 없음";
		arrRoles.push(item);

		item = new Object();
		item.value = 0;
		item.name = "정";
		arrRoles.push(item);

		item = new Object();
		item.value = 1;
		item.name = "부";
		arrRoles.push(item);

		item = new Object();
		item.value = 2;
		item.name = "일반";
		arrRoles.push(item);

		setRoles(arrRoles);
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

	const getTemporaryMember = async (team, isNormal) => {
		let members = new Array();

		if (team != null) 
			members = await TeamEditController.displayTemporaryMember(team.ID, isNormal);	// 해당 팀원 불러오기

		if (members !== null) {
			setMembers(members);
			setDisplayMembers(members);
		}
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
		member.id = index;
		member.isNormal = isNormal;
		member.displaySOPName = "새 인원";
		member.regular = null;
		member.regularMember = null;
		member.role = null;
		member.temporary = temporary;

		let members = props.memberGridData;
		let temporaryMembers = props.temporaryMembers;

		members.push(member);
		temporaryMembers.push(member);
	}

	const makeTemporaryData = (selectedTeam, isNormal) => {
		let temporary = new Object();
		temporary.id = selectedTeam.ID;
		temporary.teamName = selectedTeam.TeamName
		temporary.isNormal = isNormal === 1 ? true : false;
		temporary.parentTeamID = selectedTeam.ParentTeamID;

		return temporary;
    }

	const onClickRemoveMember = () => {
		let curMembers = props.memberGridData;
		// 삭제할 인원 분류
		const deleteMembers = [];
		for (let i = 0; i < curMembers.length; i++) {
			if (curMembers[i].check) {
				//await props.onDeleteMember(curMembers[i]);
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

		const [success, message] = await TeamEditController.RemoveTemporaryMembers(deleteMembers);
		if (!success && message.length > 0) {
			showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
			return;
		}

		let curMembers = displayMembers;
		let members = props.memberGridData;
		let temporaryMembers = props.temporaryMembers;

		for (let i = 0; i < deleteMembers.length; i++) {
			for (let j = 0; j < members.length; j++) {
				if (members[j].id === deleteMembers[i].id) {
					members.splice(j, 1);
					break;
				}
			}

			for (let j = 0; j < temporaryMembers.length; j++) {
				if (temporaryMembers[j].id === deleteMembers[i].id) {
					temporaryMembers.splice(j, 1);
					break;
				}
			}

			for (let j = 0; j < curMembers.length; j++) {
				if (curMembers[j].id === deleteMembers[i].id) {
					curMembers.splice(j, 1);
					break;
				}
			}
		}

		setDisplayMembers(curMembers);

		onCloseConfirmDialog();
	}

	const onChangeMember = (index, member) => {
		let members = memberGridData;
		members[index] = member;

		setMemberGridData(members);
		setDisplayMembers(members);
		return;
	}

	const onClickSearch = () => {
		const search = document.getElementById('search').value;

		setSearch(search);
		return;
	}

	const searchMember = () => {
		const members = props.memberGridData;

		let searchMembers = [];

		if (members === null) {
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
					regularName = member.regular.teamName;

					if (regularName.indexOf(search) !== -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 멤버 이름에서 검색
				if (member.regularMember != null) {
					let regularMemberName = null;
					regularMemberName = member.regularMember.memberName;

					if (regularMemberName.indexOf(search) !== -1) {
						searchMembers.push(members[i]);
						continue;
					}
					else if (member.regularMember.jobPositionID != null || props.jobPositions[member.regularMember.jobPositionID] != null) {
						// 멤버 직위에서 검색
						let jobPosition = props.jobPositions[member.regularMember.jobPositionID].name;

						if (jobPosition.indexOf(search) != -1) {
							searchMembers.push(members[i]);
							continue;
						}
					}
				}

				// 정/부에서 검색
				if (member.role != null) {
					for (let j = 0; j < roles.length; j++) {
						let role = roles[j];

						if (role.value === member.role) {
							if (role.name.indexOf(search) != -1) {
								searchMembers.push(members[i]);
							}

							break;
						}
					}
				}
			}
			else {
				searchMembers.push(members[i]);
			}
		}

		return searchMembers;
	}

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
		let members = memberGridData;

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

	const onKeyPressSearch = (e) => {
		if (e.key === 'Enter') {
			onClickSearch();
		}

		return;
	}

	// 왼쪽 메뉴 높이 가져와 스크롤 높이 넣기
	const target = $('.pageMenu');
	let menuHeight = 0;

	if (target[0] != null) {
		menuHeight = target[0].clientHeight;
	}

	const getTeamName = (team) => {
		if (!team) {
			return '';
		}
	
		let name = team.TeamName;
		let parent = team.ParentTeam;
		
		// ParentTeam 데이터를 가지고 있으면 실행
		while (parent) {
			name = parent.TeamName + ' > ' + name;
			parent = parent.ParentTeam;
		}
	
		return name;
	};

	// 테이블 상단에 표시될 트리 경로 Breadcrumbs
	const teamName = getTeamName(props.selectedTeam);

	const searchMembers = searchMember();

	const rowContent = [];
	if (searchMembers !== null && searchMembers !== undefined) {
		searchMembers.map((member, index) =>
			(
				rowContent.push(
					<li key={Math.random()}>
						<ColTemporaryMemberNew
							member={member}
							jobPositions={props.jobPositions}
							roles={roles}
							index={index}
							openPopup={handleOpenPopup}
							onChangeMemberEditMode={props.onChangeMemberEditMode}
							onChangeMember={props.onChangeMember}
						/>
					</li>
				)
			))
	} 

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

	let popupSelectManagerUI = openPopupSelectManager();

	return (
		<>
			<SubContTemporaryComponent className={'subConts'}>
				<div className={'scWrap'}>
					<div className={'scCont'}>
						<div className={'scTop'}>
							<h4>{teamName}</h4>
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
									<div><input type='checkbox' /></div>
									<div>NO</div>
									<div>소속 조직</div>
									<div>이름</div>
									<div>직위</div>
									<div>정/부</div>
									<div>SOP이름</div>
								</li>
								<li className='body'>
									<ul>
										{rowContent}
									</ul>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</SubContTemporaryComponent>

			{popupSelectManagerUI}

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