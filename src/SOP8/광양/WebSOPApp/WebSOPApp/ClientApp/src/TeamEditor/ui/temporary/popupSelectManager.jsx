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
	const [allRegularMembers, setAllRegularMembers] = useState([]);

	useEffect(() => {
		$('table').css({ 'width': '100%', 'border-spacing': '0', 'border-collapse': 'collapse', 'table-layout': 'fixed' });

		initManager();
	}, [])

	useEffect(() => {
		displayRegularMember();
	}, [selectedTeam, allRegularMembers]);


	const onClickClose = () => {
		props.close();
	}

	const initManager = async () => {
		const popupMember = props.popupMember;

		if (popupMember === null || popupMember === undefined)
			return;

		const [regularMembers] = await TeamEditController.displayRegularMember(props.selectedSiteNo);
		setAllRegularMembers(regularMembers ?? []);

		let regular = null;
		let regularMember = null;

		if (popupMember.regular !== null && popupMember.regular !== undefined) {
			regular = new Object();
			regular.No = popupMember.regular.rgl_sn;
			regular.TeamName = popupMember.regular.team_name;
			regular.ParentTeamNo = popupMember.regular.parnts_sn;
		}

		if (popupMember.regularMember !== null && popupMember.regularMember !== undefined) {
			regularMember = new Object();
			regularMember.ID = popupMember.memberNo;
			regularMember.MemberID = popupMember.regularMember.rgl_memb_sn;
			regularMember.MemberName = popupMember.regularMember.memb_name;
			regularMember.JobLevelNo = popupMember.regularMember.clsf_no;
			regularMember.JobPositionID = popupMember.regularMember.ofcps_no; 
			regularMember.Email = popupMember.regularMember.email;
			regularMember.PhoneNumber = popupMember.regularMember.telno; 
			regularMember.OfficePhoneNumber = popupMember.regularMember.offm_telno; 
			regularMember.RegularID = popupMember.regularMember.rgl_sn;
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
				if (child.No === team.No) {
					teamInfo = child;
				}
				if (child.Children && child.Children.length > 0) {
					searchChildren(child.Children);
				}
			});
		};
	
		data.forEach((item) => {
			if (team.No === item.No) {
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

		let teamInfo = [{id: team.No, teamName: team.TeamName}];
	
		if (team.Children?.length > 0) {
			team.Children.forEach((child) => {
				teamInfo = teamInfo.concat(getChildTeamInfos(child));
			});
		}
	
		return teamInfo;
	};

	const compareByID = (a, b) => {
		return a.rgl_sn - b.rgl_sn;
	};

	const displayRegularMember = () => {
		const regularMembers = allRegularMembers;
		const teamInfo = getChildTeamInfos(selectedTeam);

		if (regularMembers === null || regularMembers === undefined) {
			return;
		}

		let members = [];

		// 하위 트리가 존재하지 않는 조직
		if (!selectedTeam || selectedTeam.Children?.length === 0) {
			members = regularMembers.filter(member => member.rgl_sn === selectedTeam?.No);
			members.forEach(member => member.teamName = teamInfo[0].teamName);
		}
		else {
			// 하위 트리가 존재하는 조직
			const teamIDs = teamInfo.map(team => team.id);
			members = regularMembers.filter(member => teamIDs.includes(member.rgl_sn));
	
			members.forEach(member => {
				const team = teamInfo.find(team => member.rgl_sn === team.id);
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
		// 조직원 선택했을 경우
		if (index >= 0) {
			for (let i = 0; i < displayMembers.length; i++) {
				let member = displayMembers[i];
				member.check = false;
	
				if (i === index) {
					member.check = true;
					setSelectedMember(member);
				}
			}
		}
		else if (index < 0) {
			for (let i = 0; i < displayMembers.length; i++) {
				let member = displayMembers[i];
				member.check = false;
				setSelectedMember(member);
				setSelectedMember(null);
			}
		}
	}

	const onClickSelect = () => {
		// props 멤버 정보를 수정
		let popupMember = props.popupMember;
		
		popupMember.regular = null;
		popupMember.regularMember = null;

		if (selectedTeam !== null && selectedTeam !== undefined) {
			let regular = makeRegularData(selectedTeam, selectedMember);
			popupMember.regular = regular;
		}

		if (selectedMember !== null && selectedMember !== undefined) {
			let regularMember = makeRegularMemberData(selectedMember);
			popupMember.regularMember = regularMember;
		}

		props.onChangeMember(popupMember, true);
		
		onClickClose();
	}

	const makeRegularData = (selectedTeam, selectedMember) => {
		let regular = new Object();
		regular.rgl_sn = selectedMember === null ? selectedTeam.No : selectedMember.rgl_sn;
		regular.team_name = selectedMember === null ? selectedTeam.TeamName : selectedMember.team_name;
		// regular.parnts_sn = selectedTeam.ParentTeamNo;

		return regular;
	}

	const makeRegularMemberData = (selectedMember) => {
		let regularMember = new Object();
		regularMember.rgl_memb_sn = selectedMember.rgl_memb_sn;
		regularMember.memb_name = selectedMember.memb_name;
		regularMember.clsf_no = selectedMember.clsf_no;
		regularMember.ofcps_no = selectedMember.ofcps_no;
		regularMember.email = selectedMember.email;
		regularMember.telno = selectedMember.telno;
		regularMember.offm_telno = selectedMember.offm_telno;
		regularMember.rgl_sn = selectedMember.rgl_sn;

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
					<tr key={member.rgl_memb_sn} onClick={() => onClickRow(index)}>
						<td><input type="radio" name="selectMember" checked={member.check || ""} onChange={() => onClickRow(index)} /></td>
						<ColSelectManager
							displayMembers={displayMembers}
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

	const getRowContentRegular = () => {
		const rowContentRegular = [];

		rowContentRegular.push(
			<tr key='selectedTeam' onClick={() => onClickRow(-1)}>
				<td><input type="radio" name="selectMember" checked={selectedMember === null ? true : false} onChange={() => onClickRow(-1)} /></td>
				<td className={'colTextSpan'}>{selectedTeam?.TeamName}</td>
			</tr>
		);

		return rowContentRegular;
	}


	return (
		<ScPopComponent>
			<div>
				<div>
					<div className={'scpWrap w950'}>
						<div className={'scpTop scpTop'}>
							<h3>{TeamEditorResource.ID.textSetTeamManager}</h3>
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


								<div>
									<div className={'scprCont team'}>
										<table className={'scprTb'}>
											<caption>선택, 조직명으로 구성된 표</caption>
											<colgroup>
												<col style={{ width: "7%" }} />
												<col style={{ width: "93%" }} />
											</colgroup>
											<thead>
												<tr>
													<th>선택</th>
													<th>조직명</th>
												</tr>
											</thead>
											<tbody>
												{getRowContentRegular()}
											</tbody>
										</table>
									</div>
								</div>

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
								<div className={'scprBot'}>
									<a onClick={onClickSelect} className={'navy'}>{TeamEditorResource.ID.textSelect}</a>
									<a onClick={onClickClose}>{TeamEditorResource.ID.textCancle}</a>
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