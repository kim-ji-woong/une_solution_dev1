import React, { useState, useEffect, useRef } from 'react';
import { TeamEditController } from '../../services/teamEditController';
import ColTemporaryMemberNew from './colTemporaryMemberNew';
import PopupSelectManager from './popupSelectManager';
import ConfirmDialog from '../../../Common/ui/confirmDialog';
import TeamEditorResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';
import { SubContTemporaryComponent } from '../../../TeamEditor/styled/teamStyled';
import Icon from '../../../Common/components/Icon/Icon';
import EmptyContent from '../../../Common/components/emptyContent';

function TemporaryMemberPage(props) {
	const [openPopup, setOpenPopup] = useState(false);			// 팝업창(조직 담당자 설정) 오픈 여부
	const [popupMember, setPopupMember] = useState(null);		// 팝업창(조직 담당자 설정) 파라미터 >> 설정된 담당자

	const [addIndex, setAddIndex] = useState(-1);				/* 새로 추가될 멤버의 ID (addIndex--; 되서 겹치지 않게 한다) */
	const [search, setSearch] = useState("");
	const [teamName, setTeamName] = useState('');
	const [displayContent, setDisplayContent] = useState([]);
	const [allChecked, setAllChecked] = useState(false); // 테이블 전체 체크 여부에 활용
	const [visibleMemberIds, setVisibleMemberIds] = useState([]);
	const [confirmMessage, setConfirmMessage] = useState({
        visible: false,
        type: null,
        messages: [""],
        buttons: ["확인"],
        onClickButton: null
    });

	const [sortInfo, setSortInfo] = useState({
		key: null,        // 정렬 기준 컬럼
		direction: 'asc', // 'asc' | 'desc'
	});

	const confirmDialogData = useRef([]);

	const isFirstRender = useRef(true);

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
		// 삭제할 인원 분류
		const deleteMembers = props.memberGridData.filter(member =>
			member.checked &&
			visibleMemberIds.includes(member.memberNo)
		);

		if (deleteMembers.length === 0) {
			showConfirmDialog(ProjectResource.dialogTypes.WARNING, ['삭제할 비상조직원을 선택하세요.'], null, null);
			return;
		}

		confirmDialogData.current = deleteMembers;
		showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['선택한 사용자를 팀에서 제거하시겠습니까?', '제거 후 되돌릴 수 없습니다.'], ['취소', '제거하기'], onDeleteMember);
	}

	const onDeleteMember = async (index) => {
		if (index !== 1 || !confirmDialogData.current.length) {
			onCloseConfirmDialog();
			return;
		}

		const deleteMembers = confirmDialogData.current;

		const [success, message] = await TeamEditController.removeTemporaryMembers(deleteMembers);

		if (!success && message.length > 0) {
			showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
			return;
		}

		props.handleToast('선택한 사용자가 팀에서 제거되었습니다');

		const newMemberGridData = props.memberGridData.filter(
			m => !deleteMembers.some(d => d.memberNo === m.memberNo)
		);

		const newTemporaryMembers = props.temporaryMembers.filter(
			m => !deleteMembers.some(d => d.memberNo === m.memberNo)
		);

		props.setMemberGridData(newMemberGridData);
		props.setTemporaryMembers(newTemporaryMembers);

		onCloseConfirmDialog();
	};

	const searchMember = () => {
		const members = props.memberGridData;

		let searchMembers = [];

		if (!members) {
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

				// 주/부에서 검색
				const roles = [
					{name: "주", value: 500400},
					{name: "부", value: 500401},
					{name: "일반", value: 500402}
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

	const onCheckedRow = (checked, memberNo) => {
		const members = props.memberGridData.map(member =>
			member.memberNo === memberNo
				? { ...member, checked }
				: member
		);

		props.setMemberGridData(members);
	};

	const onCheckedAll = (checked) => {
		const members = props.memberGridData.map(member =>
			visibleMemberIds.includes(member.memberNo)
				? { ...member, checked }
				: member
		);

		props.setMemberGridData(members);
	};

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

		// 정렬
		const sortedMembers = sortMembers(memberList);

		const rowContent = [];

		if (sortedMembers && sortedMembers.length > 0) {
			let allMembersChecked = true; // 모든 멤버가 체크되었는지 확인

			sortedMembers.map((member, index) => {
				rowContent.push(
					<li key={member.memberNo} id="temporaryMemberTableBody" className={member.checked ? 'colorOn' : ''}>
						<ColTemporaryMemberNew
							member={member}
							jobPositions={props.jobPositions}
							roles={props.roles}
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
			setVisibleMemberIds(sortedMembers.map(m => m.memberNo));
		} else {
			setAllChecked(false); // 멤버가 없으면 전체 선택 해제
			setDisplayContent([]);
			setVisibleMemberIds([]);
		}

	}, [props.selectedTeam, props.teamType, props.temporaryMembers, props.memberGridData, search, sortInfo]);

	const getSortValue = (member, key) => {
		switch (key) {
			case 'teamName':
				return member?.regular?.team_name ?? '';

			case 'memb_name':
				return member?.regularMember?.memb_name ?? '';

			case 'ofcps_name': {
				const ofcpsNo = member?.regularMember?.ofcps_no;
				if (!ofcpsNo || !props.jobPositions) return '';

				const found = Object.values(props.jobPositions)
					.find(v => v.value === ofcpsNo);

				return found?.name ?? '';
			}

			case 'roleName': {
				const roleNo = member?.role;
				if (!roleNo || !props.roles) return '';

				const found = Object.values(props.roles)
					.find(v => v.roleNo === roleNo);

					return found?.roleName ?? '';
			}

			case 'displaySOPName':
				return member?.displaySOPName ?? '';

			default:
				return member[key];
		}
	};

	const sortMembers = (members) => {
		if (!sortInfo.key) return members;

		return [...members].sort((a, b) => {
			const aVal = getSortValue(a, sortInfo.key);
			const bVal = getSortValue(b, sortInfo.key);

			// null / undefined → 항상 뒤로
			if (aVal == null && bVal == null) return 0;
			if (aVal == null) return 1;
			if (bVal == null) return -1;

			// 문자열
			if (typeof aVal === 'string' && typeof bVal === 'string') {
				return sortInfo.direction === 'asc'
					? aVal.localeCompare(bVal, 'ko')
					: bVal.localeCompare(aVal, 'ko');
			}

			// 숫자
			return sortInfo.direction === 'asc'
				? aVal - bVal
				: bVal - aVal;
		});
	};

	// 체크된 멤버가 한 명이라도 존재할 때에만 삭제 버튼 활성화
	const visibleChecked = props.memberGridData.some(m =>
		m.checked && visibleMemberIds.includes(m.memberNo)
	);

	let editArea = null;
	if (props.isEditMode) {
		editArea = (
			<>
				<button className="sctBtn" onClick={onClickAddMember}>추가</button>
				<button
					className="sctBtn"
					onClick={onClickRemoveMember}
					disabled={!visibleChecked}
				>
					삭제
				</button>
			</>
		);
	} else {
		editArea = null;
	}

	const onClickSort = (key) => {
		setSortInfo(prev => {
			// 같은 컬럼 클릭 > 방향 토글
			if (prev.key === key) {
				return {
					key,
					direction: prev.direction === 'asc' ? 'desc' : 'asc'
				};
			}

			// 다른 컬럼 클릭 > 오름차순부터
			return {
				key,
				direction: 'asc'
			};
		});
	};

	const getSortDirection = (key) => {
		if (sortInfo.key !== key) return null; // 정렬 안됨
		return sortInfo.direction === 'asc' ? 'top' : 'bottom';
	};

	const userInfo = ProjectResource.getUserInfo();

	return (
		<>
			<SubContTemporaryComponent className={'subConts'} $userLevel={userInfo?.grad_sn}>
				<div className={'scWrap'}>
					<div className={'scCont'}>
						<div className={'scTop'}>
							<div>{teamName}</div>
							<div className={'sctRht'}>
								<div className='searchWrap'>
									<input type="text" id="search" placeholder='검색어를 입력하세요' onKeyUp={onKeyPressSearch} />
									<button onClick={onClickSearch}>검색</button>
								</div>
								{editArea}
							</div>
						</div>

						<div className='memberListArea'>
							<ul className='memberList temporary'>
								<li className='head'>
									<div><input type='checkbox' checked={allChecked} onChange={(e) => onCheckedAll(e.target.checked)} /></div>
									<div>NO</div>
									<div>
										<span>소속 조직</span>
										<button onClick={() => onClickSort('teamName')}>
											<Icon.SortIcon size="xxxxs" direction={getSortDirection('teamName')} />
										</button>
									</div>
									<div>
										<span>이름</span>
										<button onClick={() => onClickSort('memb_name')}>
											<Icon.SortIcon size="xxxxs" direction={getSortDirection('memb_name')} />
										</button>
									</div>
									<div>
										<span>직위</span>
										<button onClick={() => onClickSort('ofcps_name')}>
											<Icon.SortIcon size="xxxxs" direction={getSortDirection('ofcps_name')} />
										</button>
									</div>
									<div>
										<span>담당자 구분 (주/부/일반)</span>
										<button onClick={() => onClickSort('roleName')}>
											<Icon.SortIcon size="xxxxs" direction={getSortDirection('roleName')} />
										</button>
									</div>
									<div>
										<span>SOP이름</span>
										<button onClick={() => onClickSort('displaySOPName')}>
											<Icon.SortIcon size="xxxxs" direction={getSortDirection('displaySOPName')} />
										</button>
									</div>
								</li>
								<li className='body'>
									{displayContent.length > 0 ?
										<ul>
											{displayContent}
										</ul>
										:
										<EmptyContent
											layout="list"
											title="선택한 조직에 속한 사용자가 없습니다"
											description="추가하기 버튼을 이용해 사용자를 추가하세요"
										/>
									}	
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