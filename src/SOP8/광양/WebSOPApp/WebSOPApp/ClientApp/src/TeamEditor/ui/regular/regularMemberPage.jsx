import React, { useState, useEffect, useRef } from 'react';

import { TeamEditController } from '../../services/teamEditController';
import { ExternalController } from '../../../SDMS/services/externalController';
import ColRegularMemberNew from './colRegularMemberNew';
import ConfirmDialog from '../../../Common/ui/confirmDialog';

import $ from 'jquery';
import TeamEditorResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';

import { SubContComponent } from '../../styled/teamStyled';
import EmptyContent from '../../../Common/components/emptyContent';
import InputBox from '../../../Common/components/inputBox';
import Icon from '../../../Common/components/Icon/Icon';
import BoxButton from '../../../Common/components/boxButton';
import DropList from '../../../Common/components/dropList';
import Pagination from '../../../Common/ui/pagination';

function RegularMemberPage(props) {
	const [displayMembers, setDisplayMembers] = useState([]);
	const [addIndex, setAddIndex] = useState(-1);
	const [teamName, setTeamName] = useState('');
	const [displayContent, setDisplayContent] = useState([]);
	const [allChecked, setAllChecked] = useState(true); // 테이블 전체 체크 여부에 활용

	const [showFileDropdown, setShowFileDropdown] = useState(false);
	const fileWrapRef = useRef(null);
	const refRegularTeamFile = useRef(null);

	useEffect(() => {
		if (!showFileDropdown) return;

		const handleClickOutside = (e) => {
			if (fileWrapRef.current && !fileWrapRef.current.contains(e.target)) {
				setShowFileDropdown(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [showFileDropdown]);

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

	const onClickUpload = () => {
		if (!props.isEditMode) return;
		refRegularTeamFile.current.click();
	}

	const onClickDownload = () => {
		downloadRegularTeam(props.selectedSiteNo);
	}

	const downloadRegularTeam = async (selectedSiteNo) => {
		const [success, message] = await ExternalController.downloadRegularTeam(selectedSiteNo);

		if (success === null) {
			showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
		}
	}

	const onSelectRegularTeamFile = (event) => {
		const file = event.target.files[0];
		refRegularTeamFile.current.value = "";

		const type = /(.*?)\.(xls|xlsx)$/;

		if (!file.name.match(type)) {
			showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['엑셀 파일(xls, xlsx)만 업로드 가능합니다.'], null, null);
			return;
		} else if (file.size > 10485760) {
			showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['최대 10MB 엑셀 파일을 업로드 할 수 있습니다.'], null, null);
			return;
		}

		uploadRegularTeamFile(file);
	}

	const uploadRegularTeamFile = async (file) => {
		if (file !== null && file !== undefined) {
			const [success, message] = await TeamEditController.uploadRegularTeam(file, props.selectedSiteNo);

			if (success !== true) {
				showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['조직 정보 업로드 실패 : ' + message], null, null);
				return;
			} else if (success === true) {
				showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, ['조직 정보를 업로드하였습니다.'], null, null);
				props.init();
			}
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

	const onAddMember = async (addIndex) => {
		const index = addIndex;

		const member = new Object();
		member.rgl_memb_sn = index;
		member.rgl_sn = props.selectedTeam.No;
		member.memb_name = "새 인원";
		member.offm_telno = "";
		member.telno = "";
		member.email = "";
		member.clsf_no = null;
		member.ofcps_no = null;

		const [success, newNo, message] = await TeamEditController.updateRegularMember(member);
		if (!success) {
			showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message || '조직원 추가 실패'], null, null);
			return;
		}

		member.rgl_memb_sn = newNo;

		await props.refreshRegularTree?.(member.rgl_sn);

		if (props.pageIndex !== 1) {
			props.setPageIndex(1);
		}
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
			showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['조직원을 삭제하시겠습니까?', '삭제 시 되돌릴 수 없으며, 관련 권한도 함께 삭제됩니다.'], ['취소', '삭제하기'], onDeleteMember);
		}
	}

	const onDeleteMember = async (index) => {
		if (index !== 1 || !confirmDialogData || confirmDialogData.length === 0) {
			onCloseConfirmDialog();
			return;
        }

		const deleteMembers = confirmDialogData;

		const [success, message] = await TeamEditController.removeRegularMembers(deleteMembers);
		if (!success && message.length > 0) {
			showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
			return;
		}

		let curMembers = displayMembers;
		let members = props.memberGridData;
		let regularMembers = props.regularMembers;

		for (let i = 0; i < deleteMembers.length; i++) {
			for (let j = 0; j < members.length; j++) {
				if (members[j].rgl_memb_sn === deleteMembers[i].rgl_memb_sn) {
					members.splice(j, 1);
					break;
				}
			}

			for (let j = 0; j < regularMembers.length; j++) {
				if (regularMembers[j].rgl_memb_sn === deleteMembers[i].rgl_memb_sn) {
					regularMembers.splice(j, 1);
					break;
				}
			}

			for (let j = 0; j < curMembers.length; j++) {
				if (curMembers[j].rgl_memb_sn === deleteMembers[i].rgl_memb_sn) {
					curMembers.splice(j, 1);
					break;
				}
			}
		}

		props.setMemberGridData([...members]);
		props.setRegularMembers([...regularMembers]);
		setDisplayMembers([...curMembers]);

		await props.refreshRegularTree?.(props.selectedTeam?.No);

		props.handleToast('조직원이 삭제되었습니다');
		onCloseConfirmDialog();
	}

	const searchMember = () => {
		const searchText = props.searchText;

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

			if (searchText !== null && searchText !== undefined && searchText !== "") {

				// 멤버 소속조직 명에서 검색
				if (member.teamName != null) {
					let teamName = null;
					teamName = member.teamName;

					if (teamName.indexOf(searchText) !== -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 멤버 이름에서 검색
				if (member.memb_name != null) {
					let memberName = null;
					memberName = member.memb_name;

					if (memberName.indexOf(searchText) !== -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 멤버 직급에서 검색
				if (member.clsf_no != null && props.jobLevels != null) {
					let ispush = false;

					for (const [bKey, bValue] of Object.entries(props.jobLevels)) {						
						if (bValue.value === member.clsf_no) {
							if (bValue.name.indexOf(searchText) != -1) {
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
							if (bValue.name.indexOf(searchText) != -1) {
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

					if (phoneNumber.indexOf(searchText) != -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 근무처 전화번호에서 검색
				if (member.offm_telno != null) {
					let officePhoneNumber = member.offm_telno;

					if (officePhoneNumber.indexOf(searchText) != -1) {
						searchMembers.push(members[i]);
						continue;
					}
				}

				// 사번에서 검색
				// if (member.memberID != null) {
				// 	let memberID = null;
				// 	memberID = member.memberID;

				// 	if (memberID.indexOf(searchText) !== -1) {
				// 		searchMembers.push(members[i]);
				// 		continue;
				// 	}
				// }

				// 이메일에서 검색
				if (member.email != null) {
					let email = null;
					email = member.email;

					if (email.indexOf(searchText) !== -1) {
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

	const handleSubmit = (value) => {
		const searchValue = (value ?? "").trim();
		props.setSearchInput(searchValue);
		props.setSearchText(searchValue);
		props.setPageIndex(1);
	};

	const setPage = (page) => {
		props.setPageIndex(page);
	};

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

	const onCheckedRow = (checked, memberNo) => {
		let members = [...props.memberGridData];
		
		if (memberNo === 'all') {
			const currentPageMemberNos = new Set(displayMembers.map(member => member.rgl_memb_sn));

			for (let member of members) {
				if (currentPageMemberNos.has(member.rgl_memb_sn)) {
					member.checked = checked;
				}
			}			
		}
		else {
			for (let member of members) {
				if (member.rgl_memb_sn === memberNo) {
					member.checked = checked;
					break;
				}
			}
		}

		props.setMemberGridData(members);
	}

	const sortMembersByLatest = (members) => {
		return [...members].sort((a, b) => {
			const aNo = a?.rgl_memb_sn ?? 0;
			const bNo = b?.rgl_memb_sn ?? 0;
			const aIsNew = aNo < 0;
			const bIsNew = bNo < 0;

			if (aIsNew && bIsNew) {
				return aNo - bNo;
			}

			if (aIsNew !== bIsNew) {
				return aIsNew ? -1 : 1;
			}

			return bNo - aNo;
		});
	}

	const getViewRegularMember = (selectedTeam, members) => {
		const teamInfo = getChildTeamInfos(selectedTeam);
		
		// 하위 트리가 존재하지 않는 조직
		if (!selectedTeam || selectedTeam.Children.length === 0) {
			const memberList = members.filter(member => member.rgl_sn === selectedTeam.No);
			memberList.forEach(member => member.teamName = teamInfo[0].teamName);
			return selectedTeam && sortMembersByLatest(memberList) || [];
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

		return sortMembersByLatest(memberList);
	};

	const getPagedMembers = (members, currentPage, rowCount) => {
		const startIndex = (currentPage - 1) * rowCount;
		return members.slice(startIndex, startIndex + rowCount);
	};

	const getEmptyRow = (index) => (
		<li key={`empty-row-${props.pageIndex}-${index}`} className='emptyRow' aria-hidden='true'>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</li>
	);

	useEffect(() => {
		if (!props.selectedTeam) {
			setTeamName('');
			setDisplayMembers([]);
			setDisplayContent([]);
			setAllChecked(false);
			return;
		}

		setTeamName(getTeamName(props.selectedTeam));

		const teamInfos = getChildTeamInfos(props.selectedTeam);
		const members = (props.memberGridData ?? []).map((member) => {
			const teamInfo = teamInfos.find((team) => team.id === member.rgl_sn);
			return {
				...member,
				teamName: member.teamName ?? teamInfo?.teamName ?? ''
			};
		});
		setDisplayMembers(members);

		if (members.length === 0) {
			setDisplayContent([]);
			setAllChecked(false);
			return;
		}

		const rowContent = [];
		let allMembersChecked = true;

		members.forEach((member, index) => {
			rowContent.push(
				<li key={member.rgl_memb_sn} id="regularMemberTableBody" className={member.checked ? 'colorOn' : ''}>
					<ColRegularMemberNew
						member={member}
						jobLevels={props.jobLevels}
						jobPositions={props.jobPositions}
						index={(props.pageIndex - 1) * props.pageRowCount + index}
						checkMemberID={props.checkMemberID}
						showConfirmDialog={showConfirmDialog}
						onChangeMemberEditMode={props.onChangeMemberEditMode}
						onChangeMember={props.onChangeMember}
						onCheckedRow={onCheckedRow}
					/>
				</li>
			);

			if (!member.checked) {
				allMembersChecked = false;
			}
		});

		setAllChecked(allMembersChecked);

		const emptyRowCount = Math.max(0, props.pageRowCount - members.length);
		for (let i = 0; i < emptyRowCount; i++) {
			rowContent.push(getEmptyRow(i));
		}

		setDisplayContent(rowContent);
	}, [props.selectedTeam, props.memberGridData, props.pageIndex, props.pageRowCount]);

	let editArea = null;
	if (props.isEditMode) {
		editArea =
			<>
				<BoxButton
					variant="fill"
					size="sm"
					leftIcon={<Icon.IconPlus />}
					onClick={onClickAddMember}
				>
					조직원 추가
				</BoxButton>
				<BoxButton
					variant="fill"
					size="sm"
					leftIcon={<Icon.Minus />}
					onClick={onClickRemoveMember}
					disabled={!props.memberGridData.some(m => m.checked)}
				>
					조직원 삭제
				</BoxButton>
			</>
	}
	else {
		editArea = null;
	}

	const userInfo = ProjectResource.getUserInfo();

	return (
		<SubContComponent className={'subConts'} $userLevel={userInfo?.grad_sn}>
			<div className={'scWrap'}>
				<div className={'scCont'}>
					<div className={'scTop'}>
						<div>{teamName}</div>
						<div className={'sctRht'}>
							<InputBox
								className="searchWrap"
								size="sm"
								value={props.searchInput}
								onChange={(value) => {
									const searchValue = value ?? "";
									props.setSearchInput(searchValue);
									props.setSearchText(searchValue.trim());
									props.setPageIndex(1);
								}}
								placeholder={"검색"}
								onSubmit={handleSubmit}
								onClear={() => {
									props.setSearchInput("");
									props.setSearchText("");
									props.setPageIndex(1);
								}}
								fullWidth={true}
								leftIcon={<Icon.Search size={"xxs"} />}
							/>
							
							{editArea}

							<div className='fileWrap' ref={fileWrapRef}>
								<BoxButton
									variant="ghost"
									size="sm"
									leftIcon={<Icon.IconDescription />}
									onClick={() => setShowFileDropdown(!showFileDropdown)}
									className={showFileDropdown ? "selected" : null}
								>
									조직정보 파일 관리
								</BoxButton>
								{showFileDropdown &&
									<DropList
										size='sm'
										items={[
											...(props.isEditMode ? [{
												label: '조직정보 업로드',
												value: 'upload',
												onClick: () => { onClickUpload(); setShowFileDropdown(false); },
											}] : []),
											{
												label: '조직정보 다운로드',
												value: 'download',
												onClick: () => { onClickDownload(); setShowFileDropdown(false); },
											}
										]}
									/>
								}
								<input ref={refRegularTeamFile} style={{ display: 'none' }} type='file' accept='.xls,.xlsx' onChange={onSelectRegularTeamFile} />
							</div>
						</div>
					</div>

					<div className='memberListArea'>
						{displayContent.length > 0 ?
							<ul className='memberList regular'>
								<li className='head'>
									<div><input type='checkbox' checked={allChecked} onChange={(e) => onCheckedRow(e.target.checked, 'all')} /></div>
									<div>NO</div>
									<div>소속 조직</div>
									<div>이름</div>
									<div>직급</div>
									<div>직위</div>
									{/* <div>사번</div> */}
									<div>휴대전화번호</div>
									<div>근무처 전화번호</div>
									<div>Email</div>
								</li>
								<li className='body'>
									<ul>
										{displayContent}
									</ul>
								</li>
							</ul> :
							<EmptyContent
								layout="list"
								title="선택한 조직에 속한 사용자가 없습니다"
								description="추가하기 버튼을 이용해 사용자를 추가하세요"
							/>
						}
						{props.listCount > 0 &&
							<Pagination
								totalPage={props.totalCount}
								limit={5}
								page={props.pageIndex}
								setPage={setPage}
								bottom={"40px"}
							/>
						}
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