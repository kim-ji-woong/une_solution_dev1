import React, { useState, useEffect, useRef } from 'react';

import { TeamEditController } from '../../services/teamEditController';
import ColRegularMemberNew from './colRegularMemberNew';
import ConfirmDialog from '../../../Common/ui/confirmDialog';
import ProjectResource from '../../../Root/resource/id';
import { SubContComponent } from '../../../TeamEditor/styled/teamStyled';
import Icon from '../../../Common/components/Icon/Icon';
import EmptyContent from '../../../Common/components/emptyContent';

function RegularMemberPage(props) {
	const [addIndex, setAddIndex] = useState(-1);
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
		member.rgl_memb_sn = index;
		member.rgl_sn = props.selectedTeam.No;
		member.memb_name = "새 인원";

		let members = props.memberGridData;
		let regularMembers = props.regularMembers;

		members.push(member);
		regularMembers.push(member);

		props.setMemberGridData([...members]);
		props.setRegularMembers([...regularMembers]);
	}

	const onClickRemoveMember = () => {		
		// 삭제할 인원 분류
		const deleteMembers = props.memberGridData.filter(member =>
			member.checked &&
			visibleMemberIds.includes(member.rgl_memb_sn)
		);

		if (deleteMembers.length === 0) {
			showConfirmDialog(ProjectResource.dialogTypes.WARNING, ['삭제할 조직원을 선택하세요.'], null, null);
			return;
		}

		confirmDialogData.current = deleteMembers;
		showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['선택한 사용자를 삭제하시겠습니까?', '삭제 시 되돌릴 수 없으며, 관련 권한도 함께 삭제됩니다.'], ['취소', '삭제하기'], onDeleteMember);
	}

	const onDeleteMember = async (index) => {
		if (index !== 1 || !confirmDialogData.current.length) {
			onCloseConfirmDialog();
			return;
		}

		const deleteMembers = confirmDialogData.current;

		const [success, message] = await TeamEditController.removeRegularMembers(deleteMembers);

		if (!success && message.length > 0) {
			showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
			return;
		}

		props.handleToast('선택한 사용자가 삭제되었습니다');

		const newMemberGridData = props.memberGridData.filter(
			m => !deleteMembers.some(d => d.rgl_memb_sn === m.rgl_memb_sn)
		);

		const newRegularMembers = props.regularMembers.filter(
			m => !deleteMembers.some(d => d.rgl_memb_sn === m.rgl_memb_sn)
		);

		props.setMemberGridData(newMemberGridData);
		props.setRegularMembers(newRegularMembers);

		onCloseConfirmDialog();
	};

	const searchMember = () => {
		// 검색할 경우 member 정보를 검색어와 비교하여 rowContent에 push하기
		// 1. 팀원 정보 및 검색 단어 불러오기
		// 2. member 정보 조회 및 검색 단어와 비교하기
		// 3. 단어가 포함된다면 포함하기

		// 1. 팀원 정보 및 검색 단어 불러오기
		const members = props.memberGridData;

		let searchMembers = [];

		if (!members) {
			return searchMembers;
		}

		// 2. 팀원 정보와 검색 단어 비교하기
		for (let i = 0; i < members.length; i++) {
			const member = members[i];

			if (search !== null && search !== undefined && search !== "") {

				// 멤버 소속조직 명에서 검색
				if (member.teamName != null) {
					let teamName = null;
					teamName = member.teamName;

					if (teamName.indexOf(search) !== -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 멤버 이름에서 검색
				if (member.memb_name != null) {
					let memberName = null;
					memberName = member.memb_name;

					if (memberName.indexOf(search) !== -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 멤버 직급에서 검색
				if (member.clsf_no != null && props.jobLevels != null) {
					let ispush = false;

					for (const [bKey, bValue] of Object.entries(props.jobLevels)) {						
						if (bValue.value === member.clsf_no) {
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
				if (member.ofcps_no != null && props.jobPositions != null) {
					let ispush = false;

					for (const [bKey, bValue] of Object.entries(props.jobPositions)) {
						if (bValue.value === member.ofcps_no) {
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
				if (member.telno != null) {
					let phoneNumber = member.telno;

					if (phoneNumber.indexOf(search) != -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 근무처 전화번호에서 검색
				if (member.offm_telno != null) {
					let officePhoneNumber = member.offm_telno;

					if (officePhoneNumber.indexOf(search) != -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 사번에서 검색
				if (member.unq_key != null) {
					let memberID = null;
					memberID = member.unq_key;

					if (memberID.indexOf(search) !== -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 이메일에서 검색
				if (member.email != null) {
					let email = null;
					email = member.email;

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

	const onCheckedRow = (checked, rgl_memb_sn) => {
		let members = props.memberGridData.map(member =>
			member.rgl_memb_sn === rgl_memb_sn
				? { ...member, checked }
				: member
		);

		props.setMemberGridData(members);
	};

	const onCheckedAll = (checked) => {
		const members = props.memberGridData.map(member =>
			visibleMemberIds.includes(member.rgl_memb_sn)
				? { ...member, checked }
				: member
		);

		props.setMemberGridData(members);
	};

	const getViewRegularMember = (selectedTeam, members) => {
		const teamInfo = getChildTeamInfos(selectedTeam);
		
		// 하위 트리가 존재하지 않는 조직
		if (!selectedTeam || selectedTeam.Children.length === 0) {
			const memberList = members.filter(member => member.rgl_sn === selectedTeam.No);
			memberList.forEach(member => member.teamName = teamInfo[0].teamName);
			return selectedTeam && memberList || [];
		}
		
		// 하위 트리가 존재하는 조직
		const teamIDs = teamInfo.map(team => team.id);
		const memberList = members.filter(member => teamIDs.includes(member.rgl_sn));

		memberList.forEach(member => {
			const team = teamInfo.find(team => member.rgl_sn === team.id);
			if (team) {
				member.teamName = team.teamName;
			}
		});

		return memberList;
	};

	useEffect(() => {
		if (props.regularMembers.length === 0) {
			setDisplayContent([]);
			return;
		}

		if (props.selectedTeam) {
			// 테이블 상단에 표시될 트리 경로 Breadcrumbs
            setTeamName(getTeamName(props.selectedTeam));
	
			// 테이블에 표출할 조직원 데이터
			const searchMembers = searchMember();

			// 조직 기준 필터 + teamName 주입
			const memberList = getViewRegularMember(props.selectedTeam, searchMembers);

			// 정렬
			const sortedMembers = sortMembers(memberList);
			
			const rowContent = [];
		
			if (sortedMembers && sortedMembers.length > 0) {
				let allMembersChecked = true; // 모든 멤버가 체크되었는지 확인

				sortedMembers.map((member, index) => {
					rowContent.push(
						<li key={member.rgl_memb_sn} id="regularMemberTableBody" className={member.checked ? 'colorOn' : ''}>
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
		
					// 멤버가 체크되지 않았으면 allMembersChecked를 false로 설정
					if (!member.checked) {
						allMembersChecked = false;
					}
				});
		
				// allMembersChecked 값에 따라 allChecked 상태 업데이트
				setAllChecked(allMembersChecked);
				setDisplayContent(rowContent);
				setVisibleMemberIds(sortedMembers.map(m => m.rgl_memb_sn));
			} else {
				setAllChecked(false); // 멤버가 없으면 전체 선택 해제
				setDisplayContent([]);
				setVisibleMemberIds([]);
			}
        }
    }, [props.selectedTeam, props.regularMembers, props.memberGridData, search, sortInfo]);

	const getSortValue = (member, key) => {
		switch (key) {
			case 'teamName':
				return member?.teamName ?? '';

			case 'memb_name':
				return member?.memb_name ?? '';

			case 'ofcps_name': {
				const ofcpsNo = member?.ofcps_no;
				if (!ofcpsNo || !props.jobPositions) return '';

				const found = Object.values(props.jobPositions)
					.find(v => v.value === ofcpsNo);

				return found?.name ?? '';
			}

			case 'clsf_name': {
				const clsfNo = member?.clsf_no;
				if (!clsfNo || !props.jobLevels) return '';

				const found = Object.values(props.jobLevels)
					.find(v => v.value === clsfNo);

				return found?.name ?? '';
			}

			case 'telno':
				return member?.telno ?? '';

			case 'offm_telno':
				return member?.offm_telno ?? '';

			case 'email':
				return member?.email ?? '';

			case 'unq_key':
				return member?.unq_key ?? '';

			default:
				return member[key];
		}
	};

	const sortMembers = (members) => {
		if (!sortInfo.key) return members;

		return [...members].sort((a, b) => {
			const aVal = getSortValue(a, sortInfo.key);
			const bVal = getSortValue(b, sortInfo.key);

			// null / undefined 처리 > 항상 뒤로
			if (aVal == null && bVal == null) return 0;
			if (aVal == null) return 1;
			if (bVal == null) return -1;

			// 문자열 정렬
			if (typeof aVal === 'string' && typeof bVal === 'string') {
				return sortInfo.direction === 'asc'
					? aVal.localeCompare(bVal, 'ko')
					: bVal.localeCompare(aVal, 'ko');
			}

			// 숫자 정렬
			return sortInfo.direction === 'asc'
				? aVal - bVal
				: bVal - aVal;
		});
	};

	// 체크된 멤버가 한 명이라도 존재할 때에만 삭제 버튼 활성화
	const visibleChecked = props.memberGridData.some(m =>
		m.checked && visibleMemberIds.includes(m.rgl_memb_sn)
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
		<SubContComponent className={'subConts'} $userLevel={userInfo?.grad_sn}>
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
						<ul className='memberList regular'>
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
									<span>직급</span>
									<button onClick={() => onClickSort('clsf_name')}>
										<Icon.SortIcon size="xxxxs" direction={getSortDirection('clsf_name')} />
									</button>
								</div>
								<div>
									<span>휴대전화</span>
									<button onClick={() => onClickSort('telno')}>
										<Icon.SortIcon size="xxxxs" direction={getSortDirection('telno')} />
									</button>
								</div>
								<div>
									<span>사무실전화</span>
									<button onClick={() => onClickSort('offm_telno')}>
										<Icon.SortIcon size="xxxxs" direction={getSortDirection('offm_telno')} />
									</button>
								</div>
								<div>
									<span>이메일</span>
									<button onClick={() => onClickSort('email')}>
										<Icon.SortIcon size="xxxxs" direction={getSortDirection('email')} />
									</button>
								</div>
								<div>
									<span>사번</span>
									<button onClick={() => onClickSort('unq_key')}>
										<Icon.SortIcon size="xxxxs" direction={getSortDirection('unq_key')} />
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