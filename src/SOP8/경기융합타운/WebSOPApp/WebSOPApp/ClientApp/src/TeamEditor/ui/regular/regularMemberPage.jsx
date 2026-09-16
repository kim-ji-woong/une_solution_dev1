import React, { useState, useEffect } from 'react';

import { TeamEditController } from '../../services/teamEditController';
import ColRegularMemberNew from './colRegularMemberNew';
import ConfirmDialog from '../../../Common/ui/confirmDialog';

import $ from 'jquery';
import TeamEditorResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';

import { SubContComponent } from '../../../TeamEditor/styled/teamStyled';

function RegularMemberPage(props) {
	const [displayMembers, setDisplayMembers] = useState([]);
	const [addIndex, setAddIndex] = useState(-1);
	const [search, setSearch] = useState("");
    const [confirmMessage, setConfirmMessage] = useState({
        visible: false,
        type: null,
        messages: [""],
        buttons: ["확인"],
        onClickButton: null
    });

	let confirmDialogData = []; // 삭제에 활용

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

	const onAddMember = async (addIndex) => {
		const index = addIndex;

		const member = new Object();
		member.ID = index;
		member.RegularID = props.selectedTeam.ID;
		member.MemberName = "새 인원";
		member.MemberID = null;
		member.OfficePhoneNumber = null;
		member.PhoneNumber = null;
		member.JobLevelID = 1;
		member.JobPositionID = 1;

		let members = props.memberGridData;
		let regularMembers = props.regularMembers;

		members.push(member);
		regularMembers.push(member);

		props.setMemberGridData(members);
		props.setRegularMembers(regularMembers);
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
			showConfirmDialog(ProjectResource.dialogTypes.WARNING, ['삭제할 조직원을 선택하세요.'], null, null);
		}
		else {
			confirmDialogData = deleteMembers;
			showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['선택한 조직원을 삭제할까요?'], ['취소', '삭제'], onDeleteMember);
		}
	}

	const onDeleteMember = async (index) => {
		if (index !== 1 || !confirmDialogData || confirmDialogData.length === 0) {
			onCloseConfirmDialog();
			return;
        }

		const deleteMembers = confirmDialogData;

		const [success, message] = await TeamEditController.RemoveRegularMembers(deleteMembers);
		if (!success && message.length > 0) {
			showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
			return;
		}

		let curMembers = displayMembers;
		let members = props.memberGridData;
		let regularMembers = props.regularMembers;

		for (let i = 0; i < deleteMembers.length; i++) {
			for (let j = 0; j < members.length; j++) {
				if (members[j].ID === deleteMembers[i].ID) {
					members.splice(j, 1);
					break;
				}
			}

			for (let j = 0; j < regularMembers.length; j++) {
				if (regularMembers[j].ID === deleteMembers[i].ID) {
					regularMembers.splice(j, 1);
					break;
				}
			}

			for (let j = 0; j < curMembers.length; j++) {
				if (curMembers[j].ID === deleteMembers[i].ID) {
					curMembers.splice(j, 1);
					break;
				}
			}
		}

		setDisplayMembers(curMembers);

		onCloseConfirmDialog();
	}

	const searchMember = () => {
		// 검색할 경우 member 정보를 검색어와 비교하여 rowContent에 push하기
		// 1. 팀원 정보 및 검색 단어 불러오기
		// 2. member 정보 조회 및 검색 단어와 비교하기
		// 3. 단어가 포함된다면 포함하기

		// 1. 팀원 정보 및 검색 단어 불러오기
		const members = props.memberGridData;

		let searchMembers = [];

		if (members === null) {
			setDisplayMembers(searchMembers);
			return searchMembers;
		}

		// 2. 팀원 정보와 검색 단어 비교하기
		for (let i = 0; i < members.length; i++) {
			const member = members[i];

			if (search !== null && search !== undefined && search !== "") {

				// 멤버 이름에서 검색
				if (member.MemberName != null) {
					let memberName = null;
					memberName = member.MemberName;

					if (memberName.indexOf(search) !== -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 멤버 직급에서 검색
				if (member.JobLevelID != null && props.jobLevels != null) {
					let ispush = false;

					for (const [bKey, bValue] of Object.entries(props.jobLevels)) {						
						if (bValue.value === member.JobLevelID) {
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

				// 멤버 직위에서 검색
				if (member.JobPositionID != null && props.jobPositions != null) {
					let ispush = false;

					for (const [bKey, bValue] of Object.entries(props.jobPositions)) {
						if (bValue.value === member.JobPositionID) {
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

				// 휴대전화번호에서 검색
				if (member.PhoneNumber != null) {
					let phoneNumber = member.PhoneNumber;

					if (phoneNumber.indexOf(search) != -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 근무처 전화번호에서 검색
				if (member.OfficePhoneNumber != null) {
					let officePhoneNumber = member.OfficePhoneNumber;

					if (officePhoneNumber.indexOf(search) != -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 사번에서 검색
				if (member.MemberID != null) {
					let memberID = null;
					memberID = member.MemberID;

					if (memberID.indexOf(search) !== -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 이메일에서 검색
				if (member.Email != null) {
					let email = null;
					email = member.Email;

					if (email.indexOf(search) !== -1) {
						searchMembers.push(members[i]);
						continue;
					}
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
		name.push(<p key={team.ID} onClick={() => onTreeNodeChanged(team)}>{team.TeamName}</p>);
		let parent = team.ParentTeam;
		
		// ParentTeam 데이터를 가지고 있으면 실행
		while (parent) {
			let currentParent = parent;
			name.unshift(<p key={parent.ID} onClick={() => onTreeNodeChanged(currentParent)}>{currentParent.TeamName}</p>);
			parent = currentParent.ParentTeam;
		}
	
		return name;
	};

	// 하위 트리의 팀 ID, TeamName 모두 얻기
	const getChildTeamInfos = (team) => {
		if (!team) {
			return '';
		}

		let teamInfo = [{id: team.ID, teamName: team.TeamName}];
	
		if (team.Children.length > 0) {
			team.Children.forEach((child) => {
				teamInfo = teamInfo.concat(getChildTeamInfos(child));
			});
		}
	
		return teamInfo;
	};

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

	const getViewRegularMember = (selectedTeam, members) => {
		const teamInfo = getChildTeamInfos(selectedTeam);

		// 하위 트리가 존재하지 않는 조직
		if (!selectedTeam || selectedTeam.Children.length === 0) {
			const memberList = members.filter(member => member.RegularID === selectedTeam.ID);
			memberList.forEach(member => member.teamName = teamInfo[0].teamName);
			return selectedTeam && memberList || [];
		}
		
		// 하위 트리가 존재하는 조직
		const teamIDs = teamInfo.map(team => team.id);
		const memberList = members.filter(member => teamIDs.includes(member.RegularID));

		memberList.forEach(member => {
			const team = teamInfo.find(team => member.RegularID === team.id);
			if (team) {
				member.teamName = team.teamName;
			}
		});

		return memberList;
	};

	// 테이블 상단에 표시될 트리 경로 Breadcrumbs
	const teamName = getTeamName(props.selectedTeam);
	
	const searchMembers = searchMember();
	

	// getViewRegularMember()
	// 1. [조직원 추가] 기능으로 인해 생성된 행에도 소속 조직명을 입력
	// 2. RegularID 순으로 정렬
	const memberList = getViewRegularMember(props.selectedTeam, searchMembers);
	
	const rowContent = [];
	let allChecked = true; // 전체 체크 여부

	if (memberList !== null && memberList !== undefined) {
		memberList.map((member, index) => {
			rowContent.push(
				<li key={Math.random()} id="regularMemberTableBody" className={(member.checked ? 'colorOn' : '')} >
					<ColRegularMemberNew
						member={member}
						jobLevels={props.jobLevels}
						jobPositions={props.jobPositions}
						index={index}
						checkMemberID={props.checkMemberID}
						checkPhoneNumber={props.checkPhoneNumber}
						checkEmail={props.checkEmail}
						showConfirmDialog={showConfirmDialog}
						onChangeMemberEditMode={props.onChangeMemberEditMode}
						onChangeMember={props.onChangeMember}
						onCheckedRow={onCheckedRow}
					/>
				</li>
			);

			if (allChecked && !member.checked) {
				allChecked = false;
			}
		});

		if (memberList.length < 1) {
			allChecked = false;
		}
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

	const userInfo = ProjectResource.getUserInfo();

	return (
		<SubContComponent className={'subConts'} $userLevel={userInfo?.levelNo}>
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
						<ul className='memberList regular'>
							<li className='head'>
								<div><input type='checkbox' checked={allChecked} onChange={(e) => onCheckedRow(e.target.checked, -1)} /></div>
								<div>NO</div>
								<div>소속 조직</div>
								<div>이름</div>
								<div>직위</div>
								<div>직급</div>
								<div>휴대전화번호</div>
								<div>근무처 전화번호</div>
								<div>Email</div>
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
		</SubContComponent>

	);
}

export default RegularMemberPage;