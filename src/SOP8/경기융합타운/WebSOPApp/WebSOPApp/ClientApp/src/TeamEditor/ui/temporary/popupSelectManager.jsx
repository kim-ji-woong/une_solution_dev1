import React, { useState, useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import $ from 'jquery';

import TreeView from '../utility/treeview';
import { TeamEditController } from '../../services/teamEditController';
import SessionString from '../../../Common/js/sessionString';
import ColSelectManager from './colSelectManager';

import TeamEditorResource from '../../resource/id';
import { ScPopComponent } from '../../../TeamEditor/styled/teamStyled';

function PopupSelectManager(props) {
	const [teamTreeData, setTeamTreeData] = useState(null);		// 정규조직 정보
	const [selectedTeam, setSelectedTeam] = useState(null);		// 팝업창에서 선택한 팀
	const [selectedMember, setSelectedMember] = useState(null);
	const [gridMembers, setGridMembers] = useState(null);		// 선택된 정규조직 멤버
	const [displayMembers, setDisplayMembers] = useState(null); // 팝업창에서 표시된 정규조직 멤버

	useEffect(() => {
		$('table').css({ 'width': '100%', 'border-spacing': '0', 'border-collapse': 'collapse', 'table-layout': 'fixed' });

		initManager();
	}, [])

	useEffect(() => {
		displayRegularMember();
	}, [selectedTeam]);


	const onClickClose = () => {
		props.close();
	}

	const initManager = () => {
		const popupMember = props.popupMember;

		if (popupMember === null || popupMember === undefined)
			return;

		let regular = null;
		let regularMember = null;

		if (popupMember.regular !== null && popupMember.regular !== undefined) {
			regular = new Object();
			regular.ID = popupMember.regular.id;
			regular.TeamName = popupMember.regular.teamName;
			regular.ParentTeamID = popupMember.regular.parentTeamID;
		}

		if (popupMember.regularMember !== null && popupMember.regularMember !== undefined) {
			regularMember = new Object();
			regularMember.ID = popupMember.regularMember.id;
			regularMember.MemberID = popupMember.regularMember.memberID;
			regularMember.MemberName = popupMember.regularMember.memberName;
			regularMember.JobLevelID = popupMember.regularMember.jobLevelID; 
			regularMember.JobPositionID = popupMember.regularMember.jobPositionID; 
			regularMember.Email = popupMember.regularMember.email;
			regularMember.PhoneNumber = popupMember.regularMember.phoneNumber; 
			regularMember.OfficePhoneNumber = popupMember.regularMember.officePhoneNumber; 
			regularMember.RegularID = popupMember.regularMember.regularID;
		}

		let selectedTeam = null;
		if (regular && regular !== null) {
			selectedTeam = getTeamInfoByID(regular, props.regularTreeData);
		}
		else if (props.regularTreeData && props.regularTreeData.length > 0) {
			selectedTeam = props.regularTreeData[0];
        }

		setSelectedTeam(selectedTeam);
		setSelectedMember(regularMember);
		// displayRegularMember();
    }

	const getTeamInfoByID = (team, data) => {
		if (!team || !data) {
			return '';
		}
	
		let teamInfo = '';
	
		const searchChildren = (children) => {
			children.forEach(child => {
				if (child.ID === team.ID) {
					teamInfo = child;
				}
				if (child.Children && child.Children.length > 0) {
					searchChildren(child.Children);
				}
			});
		};
	
		data.forEach((item) => {
			if (team.ID === item.ID) {
				teamInfo = item;
			}
			else if (item.Children && item.Children.length > 0) {
				searchChildren(item.Children);
			}
		})
	
		return teamInfo;
	};

	// 하위 트리의 팀 ID, TeamName 모두 얻기
	const getChildTeamInfos = (team) => {
		if (!team) {
			return '';
		}

		let teamInfo = [{id: team.ID, teamName: team.TeamName}];
	
		if (team.Children?.length > 0) {
			team.Children.forEach((child) => {
				teamInfo = teamInfo.concat(getChildTeamInfos(child));
			});
		}
	
		return teamInfo;
	};

	const compareByID = (a, b) => {
		return a.RegularID - b.RegularID;
	};

	const displayRegularMember = () => {
		const regularMembers = props.regularMembers;
		const teamInfo = getChildTeamInfos(selectedTeam);

		if (regularMembers === null || regularMembers === undefined) {
			return;
		}

		let members = [];

		// 하위 트리가 존재하지 않는 조직
		if (!selectedTeam || selectedTeam.Children?.length === 0) {
			members = regularMembers.filter(member => member.RegularID === selectedTeam?.ID);
			members.forEach(member => member.teamName = teamInfo[0].teamName);
		}
		else {
			// 하위 트리가 존재하는 조직
			const teamIDs = teamInfo.map(team => team.id);
			members = regularMembers.filter(member => teamIDs.includes(member.RegularID));
	
			members.forEach(member => {
				const team = teamInfo.find(team => member.RegularID === team.id);
				if (team) {
					member.teamName = team.teamName;
				}
			});
		}

		// member.RegularID 순으로 정렬
		members.sort(compareByID);

		setGridMembers(members);
		setDisplayMembers(members);
	}

	const onTreeNodeChanged = (team) => {
		// 선택된 멤버 해제
		setSelectedMember(null);

		setSelectedTeam(team)
		displayRegularMember();
	}

	const onClickSearch = () => {

		// 1. 팀원 정보 및 검색 단어 불러오기
		const members = gridMembers;
		const search = document.getElementById('searchManager').value;
		let searchMembers = new Array();

		if (members == null || search == null) {
			return;
		}

		// 2. 팀원 정보와 검색 단어 비교하기
		for (let i = 0; i < members.length; i++) {
			const member = members[i];

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
			if (member.JobLevelID != null || props.jobLevels[member.JobLevelID] != null) {
				let jobLevel = props.jobLevels[member.JobLevelID].name;

				if (jobLevel.indexOf(search) != -1) {
					searchMembers.push(members[i]);
					continue;
				}
			}

			// 멤버 직위에서 검색
			if (member.JobPositionID != null || props.jobPositions[member.JobPositionID] != null) {
				let jobPosition = props.jobPositions[member.JobPositionID].name;

				if (jobPosition.indexOf(search) != -1) {
					searchMembers.push(members[i]);
					continue;
				}
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
		}

		setDisplayMembers(searchMembers);
		return;
	}

	const onKeyPressSearch = (e) => {
		if (e.key === 'Enter') {
			onClickSearch();
		}

		return;
	}

	const onClickRow = (index) => {

		for (let i = 0; i < displayMembers.length; i++) {
			let member = displayMembers[i];
			member.check = false;

			if (i === index) {
				member.check = true;
				setSelectedMember(member);
            }
		}

		// setSelectedMember(selectedMember);
	}

	const onClickSelect = () => {
		// props 멤버 정보를 수정
		let popupMember = props.popupMember;
		
		popupMember.regular = null;
		popupMember.regularMember = null;

		if (selectedTeam !== null && selectedTeam !== undefined) {
			let regular = makeRegularData(selectedTeam);
			popupMember.regular = regular;
		}

		if (selectedMember !== null && selectedMember !== undefined) {
			let regularMember = makeRegularMemberData(selectedMember);
			popupMember.regularMember = regularMember;
		}

		props.onChangeMember(popupMember, true);
		
		onClickClose();
	}

	const makeRegularData = (selectedTeam) => {
		let regular = new Object();
		regular.id = selectedTeam.ID;
		regular.teamName = selectedTeam.TeamName;
		regular.parentTeamID = selectedTeam.ParentTeamID;

		return regular;
	}

	const makeRegularMemberData = (selectedMember) => {
		let regularMember = new Object();
		regularMember.id = selectedMember.ID;
		regularMember.memberID = selectedMember.MemberID;
		regularMember.memberName = selectedMember.MemberName;
		regularMember.jobLevelID = selectedMember.JobLevelID;
		regularMember.jobPositionID = selectedMember.JobPositionID;
		regularMember.email = selectedMember.Email;
		regularMember.phoneNumber = selectedMember.PhoneNumber;
		regularMember.officePhoneNumber = selectedMember.OfficePhoneNumber;
		regularMember.regularID = selectedMember.RegularID;

		return regularMember;
    }

	let teamName = "";
	if (selectedTeam !== null && selectedTeam !== undefined)
		teamName = selectedTeam.TeamName;

	// 헤더와 바텀 높이를 제외한 높이를 가져와 스크롤 높이 넣기
	let scpRht = $('.scpRht');
	let scprTop = $('.scprTop');
	let scprBot = $('.scprBot');
	let menuHeight = 0;

	if (scpRht[0] != null && scprTop[0] != null && scprBot[0] != null) {
		scpRht = scpRht[0].clientHeight;
		scprTop = scprTop[0].clientHeight;
		scprBot = scprBot[0].clientHeight;

		menuHeight = scpRht - scprTop - scprBot;
	}

	const rowContent = [];

	if (displayMembers !== null) {
		displayMembers.map((member, index) =>
			(
				rowContent.push(
					<tr key={member.ID} onClick={() => onClickRow(index)}>
						<ColSelectManager
							member={member}
							teamName={teamName}
							jobLevels={props.jobLevels}
							jobPositions={props.jobPositions}
							index={index}
						/>
					</tr>
				)
			))
	} 

	return (
		<ScPopComponent>
			<div>
				<div>
					<div className={'scpWrap w950'}>
						<div className={'scpTop scpTop'}>
							<h3>{TeamEditorResource.ID.textSetTeamManager}</h3>
							<a onClick={onClickClose}>닫기</a>
						</div>
						<div className={'scpCont'}>
							<div className={'scpLft' + " popupMenu"}>
								<h4 className={'scplTitle'}>{TeamEditorResource.ID.textSelectTeam}</h4>
								<div className={'scplOgz' + " scrollbarOuter"}>
									{/* 트리뷰 위치 */}
									<TreeView treeViewID="temporaryPopupTree" teamTreeData={props.regularTreeData} onTreeNodeChanged={onTreeNodeChanged} />
								</div>
							</div>
							<div className={'scpRht'}>
								<div className={'scprTop scprTop'}>
									<h4>{teamName}</h4>
									<div className={'scprTopForm'}>
										<input id="searchManager" type="text" placeholder={TeamEditorResource.ID.textFilter} title={TeamEditorResource.ID.textFilter} onKeyPress={(e) => onKeyPressSearch(e)} />
										<a onClick={onClickSearch}>{TeamEditorResource.ID.textSearch}</a>
									</div>
								</div>
								{/*<div className="scrollbar-outer">*/}
								<div className={'scrollbar'} style={{ height: menuHeight }} >
									<div className={'scprCont'}>
										<table className={'scprTb'}>
											<caption>선택, 번호, 소속팀, 이름, 직위, 직급, 휴대정화번호, 사번으로 구성된 표</caption>
											<colgroup>
												<col style={{ width: "7%" }} />
												<col style={{ width: "7%" }} />
												<col style={{ width: "20%" }} />
												<col style={{ width: "19%" }} />
												<col style={{ width: "13%" }} />
												<col style={{ width: "13%" }} />
												<col style={{ width: "21%" }} />
											</colgroup>
											<thead>
												<tr>
													<th>선택</th>
													<th>번호</th>
													<th>소속 조직</th>
													<th>이름</th>
													<th>직위</th>
													<th>직급</th>
													<th>휴대전화번호</th>
												</tr>
											</thead>
											<tbody>
												{rowContent}
											</tbody>
										</table>
									</div>
								</div>
								<div className={'scprBot scprBot'}>
									<a onClick={onClickClose}>{TeamEditorResource.ID.textCancle}</a>
									<a onClick={onClickSelect} className={'navy'}>{TeamEditorResource.ID.textSelect}</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</ScPopComponent>
	);
}

export default PopupSelectManager;