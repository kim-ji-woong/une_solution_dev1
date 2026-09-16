import React, { useEffect, useState } from 'react';
import TeamMenu from './teamMenu';
import RegularMemberPage from './regular/regularMemberPage';
import TemporaryMemberPage from './temporary/temporaryMemberPage';
import ConfirmDialog from '../../Common/ui/confirmDialog';

import $ from 'jquery';

import TeamEditorResource from '../resource/id';
import { TeamEditController } from '../services/teamEditController';

import ProjectResource from '../../Root/resource/id';
import AccountResource from '../../Account/resource/id';

import { SubPageComponent } from '../../TeamEditor/styled/teamStyled';
import { useToast } from '../../Common/components/Toast/ToastProvider';


function TeamEditor(props) {
	const { onShowToast } = useToast();

	const [teamType, setTeamType] = useState(TeamEditorResource.ID.textRegular); 		// 조직 메뉴내 정규/평일비상/휴일비상 구분
	const [schedule, setSchedule] = useState(TeamEditorResource.ID.textFixed);	 		// 근무표내 고정근무표/실시간근무표 구분
	const [regularTreeData, setRegularTreeData] = useState([]);					 		// 정규조직 팀 데이터
	const [temporaryTreeData, setTemporaryTreeData] = useState([]);					 	// 평일 비상조직 팀 데이터
	const [temporaryEmergencyTreeData, setTemporaryEmergencyTreeData] = useState([]);	// 주말 비상조직 팀 데이터
	const [teamTreeData, setTeamTreeData] = useState([]);								/* Treeview에 바인딩된 데이터(현재 선택된 팀 데이터) */
	const [selectedTeam, setSelectedTeam] = useState(null);								/* Treeview에서 선택된 팀정보 */
	const [regularMembers, setRegularMembers] = useState([]);							// 정규조직 멤버 데이터
	const [temporaryMembers, setTemporaryMembers] = useState([]);						
	const [memberGridData, setMemberGridData] = useState([]);							/* GridView에 바인딩된 데이터(현재 선택된 팀 멤버 데이터 */
	const [jobLevels, setJobLevels] = useState(null);									/* 직급 정보들 (JSON {{value: "value값", name: "name값"}...}) */
	const [jobPositions, setJobPositions] = useState(null);								/* 직위 정보들 (JSON {{value: "value값", name: "name값"}...}) */
	const [selectedSiteNo, setSelectedSiteNo] = useState(null);

	const [confirmMessage, setConfirmMessage] = useState({
		visible: false,
		type: null,
		messages: [""],
		buttons: ["확인"],
		onClickButton: null
	});
	
	useEffect(() => {
		// 각 페이지 별로 클래스 초기화
		$('#subPage').removeClass('sop');

		$('#subPage').click(function (e) {
			// 새 인원 css 효과가 있을 경우 제거
			$('#regularMemberTableBody').removeClass('addPointer');
			$('#temporaryMemberTableBody').removeClass('addPointer');
		});
				
		init();
		displayJob();
	}, [])

	const init = async () => {
		let userInfo = await ProjectResource.initUserInfo();
		if (userInfo === null || userInfo === undefined)
			return;

		let site_sn = null;
		
		if (userInfo.site_sn) {
			site_sn = userInfo.site_sn;
		} else if (ProjectResource.site_sn) {
			site_sn = ProjectResource.site_sn;
        }

		setSelectedSiteNo(site_sn);
		initTeamData();
	}

	const displayJob = async () => {
		let arrJobLevels = new Array();
		let [jobLevels] = await TeamEditController.getJobLevels(); // 직급 

		// ColComboBox 데이터형 만들기 >> JSON {{value: "value값", name: "name값"}}
		if (jobLevels !== null) {
			for (let i = 0; i < jobLevels.length; i++) {
				const item = { value: jobLevels[i].team_optn_no, name: jobLevels[i].team_optn_name }
				arrJobLevels.push(item);
			}
		}

		let arrJobPositions = new Array();
		let [jobPositions] = await TeamEditController.getJobPositions(); // 직책

		// ColComboBox 데이터형 만들기 >> JSON {{value: "value값", name: "name값"}}
		if (jobPositions !== null) {
			for (let i = 0; i < jobPositions.length; i++) {
				const item = { value: jobPositions[i].team_optn_no, name: jobPositions[i].team_optn_name }
				arrJobPositions.push(item);
			}
		}

		setJobLevels(arrJobLevels);
		setJobPositions(arrJobPositions);
	}

	const initTeamData = async () => {
		let regularTreeData = [];
		let temporaryTreeData = [];
		let temporaryEmergencyTreeData = [];

		let regularMembers = [];
		let temporaryMembers = [];

		let teamTreeData = [];
		let _selectedTeam = null;
		let _memberGridData = [];

		let [regularDatas] = await TeamEditController.displayRegular();
		let [temporaryDatas] = await TeamEditController.displayTemporary(true);
		let [temporaryEmergencyDatas] = await TeamEditController.displayTemporary(false);

		if (regularDatas?.length > 0) {
			let [members] = await TeamEditController.displayRegularMember(); // 해당 팀원 불러오기
			let displayMembers = getViewRegularMember(regularDatas[0], members);

			regularTreeData = regularDatas;
			regularMembers = members;

			teamTreeData = regularDatas;
			_selectedTeam = regularDatas[0];
			_memberGridData = displayMembers;
		}

		setRegularTreeData(regularTreeData);
		setRegularMembers(regularMembers);
		setTeamTreeData(teamTreeData);

		if (selectedTeam === null) {
			setSelectedTeam(_selectedTeam);
		}

		if (memberGridData.length === 0 && _memberGridData && _memberGridData.length > 0) {
			setMemberGridData(_memberGridData);
		}

		if (temporaryDatas?.length > 0) {
			const [temporaryMemberData, message] = await TeamEditController.requestTemporaryMembers();

			temporaryTreeData = temporaryDatas;
			temporaryMembers = temporaryMemberData;
		}

		if (temporaryEmergencyDatas?.length > 0) {
			temporaryEmergencyTreeData = temporaryEmergencyDatas;
		}

		setTemporaryTreeData(temporaryTreeData);
		setTemporaryMembers(temporaryMembers);
		setTemporaryEmergencyTreeData(temporaryEmergencyTreeData);
    }

	const displayRegular = async () => {
		let [teamDatas] = await TeamEditController.displayRegular();
		let members = [];
		let displayMembers = [];
		
		if (teamDatas.length > 0) {
			[members] = await TeamEditController.displayRegularMember(); // 해당 팀원 불러오기
			displayMembers = getViewRegularMember(teamDatas[0], members);
			
			setTeamTreeData(teamDatas);
			setRegularTreeData(teamDatas);
			setSelectedTeam(teamDatas[0]);
			setRegularMembers(members);

			if (displayMembers) {
				setMemberGridData(displayMembers);
			}
		}
		else {
			setRegularTreeData([]);
			setTeamTreeData([]);
			setSelectedTeam(null);
			setRegularMembers(members);

			if (displayMembers) {
				setMemberGridData(displayMembers);
			}
		}
	}

	const displayTemporary = async () => {
		let [teamDatas] = await TeamEditController.displayTemporary(true);
		let temporaryMembers = [];
		let message = null;
		let displayMembers = [];
		
		if (teamDatas?.length > 0) {
			[temporaryMembers, message] = await TeamEditController.requestTemporaryMembers();			
			displayMembers = getViewTemporaryMember(teamDatas[0], temporaryMembers);
			
			setTemporaryTreeData(teamDatas);
			setTeamTreeData(teamDatas);
			setSelectedTeam(teamDatas[0]);
			setTemporaryMembers(temporaryMembers);
			setMemberGridData(displayMembers);
		} else {
			setTemporaryTreeData([]);
			setTeamTreeData([]);
			setSelectedTeam(null);
			setTemporaryMembers(temporaryMembers);
			setMemberGridData(displayMembers);
		}
	}

	const displayTemporaryEmergency = async () => {
		let [teamDatas] = await TeamEditController.displayTemporary(false);
		let temporaryMembers = [];
		let message = null;
		let displayMembers = [];
		
		if (teamDatas?.length > 0) {
			[temporaryMembers, message] = await TeamEditController.requestTemporaryMembers();
			displayMembers = getViewTemporaryMember(teamDatas[0], temporaryMembers);

			setTemporaryEmergencyTreeData(teamDatas);
			setTeamTreeData(teamDatas);
			setSelectedTeam(teamDatas[0]);
			setTemporaryMembers(temporaryMembers);
			setMemberGridData(displayMembers);
		}
		else {
			setTemporaryEmergencyTreeData([]);
			setTeamTreeData([]);
			setSelectedTeam(null);
			setTemporaryMembers(temporaryMembers);
			setMemberGridData(displayMembers);
		}
	}

	const getViewTeam = () => {
		let teamData = [];
		if (teamType === TeamEditorResource.ID.textRegular) {
			teamData = regularTreeData;
		}
		else if (teamType === TeamEditorResource.ID.textTemporary) {
			teamData = temporaryTreeData;
		}
		else if (teamType === TeamEditorResource.ID.textTemporaryEmergency) {
			teamData = temporaryEmergencyTreeData;
		}
		else {
			return;
        }

		if (teamData.length === 0) {
			setSelectedTeam(null);
			setTeamTreeData([]);
		}
		else {
			let members = [];
			if (teamType === TeamEditorResource.ID.textRegular) {
				members = getViewRegularMember(teamData[0], regularMembers);
			}
			else if (teamType === TeamEditorResource.ID.textTemporary || teamType === TeamEditorResource.ID.textTemporaryEmergency) {
				members = getViewTemporaryMember(teamData[0], temporaryMembers);
			}

			setSelectedTeam(teamData[0]);
			setTeamTreeData(teamData);
			setMemberGridData(members)
        }
	}

	// 하위 트리의 팀 ID 얻기
	const getChildTeamInfos = (team) => {
		let teamInfo = [{id: team.No}];
	
		if (team.Children.length > 0) {
			team.Children.forEach((child) => {
				teamInfo = teamInfo.concat(getChildTeamInfos(child));
			});
		}
	
		return teamInfo;
	};

	const getViewRegularMember = (selectedTeam, members) => {
		if (!selectedTeam || members.length === 0) {
			return;
		}

		const teamInfo = getChildTeamInfos(selectedTeam);

		// 하위 트리가 존재하지 않는 조직
		if (!selectedTeam || selectedTeam.Children.length === 0) {
			const memberList = members.filter(member => member.rgl_sn === selectedTeam.No);
			return selectedTeam && memberList || [];
		}
		
		// 하위 트리가 존재하는 조직
		const teamIDs = teamInfo.map(team => team.id);
		const memberList = members.filter(member => teamIDs.includes(member.rgl_sn));

		return memberList;
	};

	const getViewTemporaryMember = (selectedTeam, members) => {
		const teamInfo = getChildTeamInfos(selectedTeam);

		// 하위 트리가 존재하지 않는 조직
		if (!selectedTeam || selectedTeam.Children.length === 0) {
			const memberList = members.filter(member => member.temporary.tmpr_sn === selectedTeam.No);
			memberList.forEach(member => member.teamName = teamInfo[0].teamName);
			return selectedTeam && memberList || [];
		}
		
		// 하위 트리가 존재하는 조직
		const teamIDs = teamInfo.map(team => team.id);
		const memberList = members.filter(member => teamIDs.includes(member.temporary.tmpr_sn));

		memberList.forEach(member => {
			const team = teamInfo.find(team => member.temporary.tmpr_sn === team.id);
			if (team) {
				member.teamName = team.teamName;
			}
		});

		return memberList;
	}

	const handleToast = (message) => {
        onShowToast(message);
    };

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

	const onChangeTeamType = (type) => {
		if (teamType === type) {
			return;
		}

		setTeamType(type);
		if (type === TeamEditorResource.ID.textRegular) {
			// 조직
			displayRegular();
		} else if (type === TeamEditorResource.ID.textTemporary) {
			// 평일 비상조직
			displayTemporary();
		} else if (type === TeamEditorResource.ID.textTemporaryEmergency) {
			// 휴일 비상 조직
			displayTemporaryEmergency();
		}
		return;
	}

	const changeScheduleType = (type) => {
		setSchedule(type);
		return;
	}

	const onUpdateTeamTreeData = (teamTreeData) => {
		if (!selectedTeam || selectedTeam === null) {
			setTeamTreeData([...teamTreeData]);
			setSelectedTeam(teamTreeData[0]);
		}
		else {
			setTeamTreeData([...teamTreeData]);
        }
    }

	// 조직,비상조직 TreeView 팀을 선택 했을 때 Member 조회를 한다
	const onTeamNodeChanged = (team) => {
		if (team === undefined) {
			return;
		}
		if (team === null) {
			setSelectedTeam(team);
		}

		else if (teamType === TeamEditorResource.ID.textRegular) {
			let members = getViewRegularMember(team, regularMembers);

			if (members) {
				// 선택 팀 변경될 경우 전부 체크 해제
				members.forEach(member => {
					if (member.checked) {
						member.checked = false;
					}
				});
			}

			setSelectedTeam(team);

			if (members) {
				setMemberGridData(members);
			}
		}
		else if (teamType === TeamEditorResource.ID.textTemporary || teamType === TeamEditorResource.ID.textTemporaryEmergency) {
			let members = getViewTemporaryMember(team, temporaryMembers);

			if (members) {
				// 선택 팀 변경될 경우 전부 체크 해제
				members.forEach(member => {
					if(member.checked) {
						member.checked = false;
					}
				});
	
				setSelectedTeam(team);
				setMemberGridData(members);
			}
		} 
	}

	const makeRemoveRegularMember = (deleteMembers, data) => {
		let memberGridData = data;

		for (let i = 0; i < deleteMembers.length; i++) {
			for (let j = 0; j < memberGridData.length; j++) {
				if (memberGridData[j].rgl_memb_sn === deleteMembers[i].rgl_memb_sn) {
					memberGridData.splice(j, 1);
					break;
				}
			}
		}

		let members = null;

		if (teamType === TeamEditorResource.ID.textRegular) {
			members = regularMembers;

			for (let i = 0; i < deleteMembers.length; i++) {
				for (let j = 0; j < members.length; j++) {
					if (members[j].rgl_memb_sn === deleteMembers[i].rgl_memb_sn) {
						members.splice(j, 1);
						break;
					}
				}
			}
		} else if (teamType === TeamEditorResource.ID.textTemporary || teamType === TeamEditorResource.ID.textTemporaryEmergency) {
			members = temporaryMembers;

			for (let i = 0; i < deleteMembers.length; i++) {
				for (let j = 0; j < members.length; j++) {
					if (members[j].id === deleteMembers[i].id) {
						members.splice(j, 1);
						break;
					}
				}
			}
		}

		return [memberGridData, members];
    }

	const removeTeam = () => {
		// 경고 메시지 띄우기
		if (teamType === TeamEditorResource.ID.textRegular) {
			showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ["조직을 삭제하시겠습니까?", "삭제 시 되돌릴 수 없으며, 하위 조직·구성원·관련 권한도 함께 삭제됩니다."], ["취소", "삭제하기"], doRemoveTeam);
		}
		else if (teamType === TeamEditorResource.ID.textTemporary || teamType === TeamEditorResource.ID.textTemporaryEmergency
		) {
			showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ["비상조직을 삭제하시겠습니까?", "삭제 시 되돌릴 수 없으며, 하위 조직도 함께 삭제됩니다."], ["취소", "삭제하기"], doRemoveTeam);
		}
	}

	const doRemoveTeam = async (index) => {
		const confirmInfo = {};
		confirmInfo.visible = false;

		if (index === 1) {
			// yes
			const curTeamTreeData = [...teamTreeData];

			if (teamType === TeamEditorResource.ID.textRegular) {
				const data = await makeRemoveRegularTeam(selectedTeam, curTeamTreeData);

				// this.setState({ teamTreeData: curTeamTreeData, regularTreeData: curTeamTreeData, confirmMessage }, () => this.onTeamNodeChanged(curTeamTreeData[0]));
				setTeamTreeData(curTeamTreeData);
				setRegularTreeData(curTeamTreeData);
				setConfirmMessage(confirmInfo);
				onTeamNodeChanged(curTeamTreeData[0]);

			} else if (teamType === TeamEditorResource.ID.textTemporary) {
				const data = await makeRemoveRegularTeam(selectedTeam, curTeamTreeData);

				// this.setState({ teamTreeData: curTeamTreeData, temporaryTreeData: curTeamTreeData, confirmMessage }, () => this.onTeamNodeChanged(curTeamTreeData[0]));
				setTeamTreeData(curTeamTreeData);
				setTemporaryTreeData(curTeamTreeData);
				setConfirmMessage(confirmInfo);
				onTeamNodeChanged(curTeamTreeData[0]);
				
			} else if (teamType === TeamEditorResource.ID.textTemporaryEmergency) {
				const data = await makeRemoveRegularTeam(selectedTeam, curTeamTreeData);

				// setState({ teamTreeData: curTeamTreeData, temporaryEmergencyTreeData: curTeamTreeData, confirmMessage }, () => onTeamNodeChanged(curTeamTreeData[0]));
				setTeamTreeData(curTeamTreeData);
				setTemporaryEmergencyTreeData(curTeamTreeData);
				setConfirmMessage(confirmInfo);
				onTeamNodeChanged(curTeamTreeData[0]);
			}

			return;
		}

		setConfirmMessage(confirmInfo);
	}

	// 조직 삭제
    // data : 모든 팀 정보
	const makeRemoveRegularTeam = async (selectedTeam, data) => {
		// 하위 팀
		const deleteTeams = [];
		deleteTeams.push({ No: selectedTeam.No, TeamName: selectedTeam.TeamName, ParentTeamNo: selectedTeam.ParentTeamNo });
		if (selectedTeam.Children) {
			TeamEditController.findChild(selectedTeam.No, selectedTeam.Children, deleteTeams);
		}

		let members = [];
		let deleteMembers = [];

		// 속한 직원 (팀 타입에 따라 달리 설정 필요.)
		if (teamType === TeamEditorResource.ID.textRegular) {
			members = regularMembers;

			for (var i = 0; i < members.length; i++) {
				for (var j = 0; j < deleteTeams.length; j++) {
					if (deleteTeams[j].No === members[i].rgl_sn) {
						deleteMembers.push(members[i]);
						break;
					}
				}
			}
		} else if (teamType === TeamEditorResource.ID.textTemporary || teamType === TeamEditorResource.ID.textTemporaryEmergency) {
			members = temporaryMembers;

			for (var i = 0; i < members.length; i++) {
				for (var j = 0; j < deleteTeams.length; j++) {
					if (deleteTeams[j].No === members[i].temporary.rgl_sn) {
						deleteMembers.push(members[i]);
						break;
					}
				}
			}
		}
		else {
			return;
        }

		let deleteTeamIDs = [];
		for (let i = 0; i < deleteTeams.length; i++) {
			deleteTeamIDs.push(deleteTeams[i].No);
        }

		if (teamType === TeamEditorResource.ID.textRegular) {
			const [success, message] = await TeamEditController.removeRegularTeams(deleteTeamIDs);
			if (!success) {
				// 사용자에게 불필요한 메시지 수정 - K.D.R
				//alert(message);
				showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["조직 삭제 실패하였습니다.", "새로고침 후에 다시 시도하거나 시스템 관리자에게 문의해주세요."], null, null);
				return;
			}
			else {
				handleToast("조직이 삭제되었습니다");
			}
		}
		else {
			const [success, message] = await TeamEditController.removeTemporaryTeams(deleteTeamIDs);
			if (!success) {
				// 사용자에게 불필요한 메시지 수정 - K.D.R
				//alert(message);
				showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["비상조직 삭제 실패하였습니다.", "새로고침 후에 다시 시도하거나 시스템 관리자에게 문의해주세요."], null, null);
				return;
			}
			else {
				handleToast("비상조직이 삭제되었습니다");
			}
        }

		if (deleteMembers.length > 0) {
			const [memberDatas, members] = makeRemoveRegularMember(deleteMembers, memberGridData);
			setMemberGridData(memberDatas);

			if (teamType === TeamEditorResource.ID.textRegular) {
				// regularMembers = members;
				setRegularMembers(members);
			} else if (teamType === TeamEditorResource.ID.textTemporary || teamType === TeamEditorResource.ID.textTemporaryEmergency) {
				// temporaryMembers = members;
				setTemporaryMembers(members);
            }
        }

		let findNode = null;

		if (selectedTeam.ParentTeamNo === null) {
			// 루트 노드일 경우
			findNode = TeamEditController.findParent(selectedTeam.No, data);

			const idx = data.findIndex(function (item) { return item.No === selectedTeam.No });
			if (idx > -1) {
				data.splice(idx, 1);
				setTeamTreeData(data);
				setSelectedTeam(null);
			}

		} else {
			// 자식 노드일 경우
			findNode = TeamEditController.findParent(selectedTeam.ParentTeamNo, data);

			if (findNode !== null && findNode.Children !== null && findNode.Children) {
				const idx = findNode.Children.findIndex(function (item) { return item.No === selectedTeam.No })
				if (idx > -1) {
					findNode.Children.splice(idx, 1);
					setTeamTreeData(data);
				}
			}
        }
    }

	const editTeam = async (team, chgName) => {
		// 변경할 이름 검사
		if (chgName === null || chgName === undefined || chgName.replace(/\s/gi, "") === "") {
			showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["변경할 팀 이름을 다시 확인해주세요."], null, null);
			return;
		} 

		const curTeamTreeData = [...teamTreeData];
		
		const nodeData = { No: team.No, TeamName: chgName, ParentTeamNo: team.ParentTeamNo, site_sn: ProjectResource.site_sn};
		if (teamType === TeamEditorResource.ID.textRegular) {			
			const [success, message] = await TeamEditController.updateRegularTeam(nodeData);
			if (!success) {
				// 사용자에게 불필요한 메시지 수정 - K.D.R
				//alert(message);
				showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["조직 정보 수정 실패하였습니다.", "새로고침 후에 다시 시도하거나 시스템 관리자에게 문의해주세요."], null, null);
				return;
            }

			const data = await makeChangeRegularTeamInfo(selectedTeam, chgName, curTeamTreeData);
			setTeamTreeData(data);
			setRegularTreeData(data);

		} else if (teamType === TeamEditorResource.ID.textTemporary || teamType === TeamEditorResource.ID.textTemporaryEmergency) {
			if (teamType === TeamEditorResource.ID.textTemporary) {
				nodeData.IsNormal = true;
			}
			else {
				nodeData.IsNormal = false;
			}
			nodeData.site_sn = ProjectResource.site_sn;

			const [success, message] = await TeamEditController.updateTemporaryTeam(nodeData);
			if (!success) {
				// 사용자에게 불필요한 메시지 수정 - K.D.R
				//alert(message);
				showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["비상조직 정보 수정 실패하였습니다.", "새로고침 후에 다시 시도하거나 시스템 관리자에게 문의해주세요."], null, null);
				return;
			}

			const data = await makeChangeRegularTeamInfo(selectedTeam, chgName, curTeamTreeData);
			if (teamType === TeamEditorResource.ID.textTemporary) {
				setTeamTreeData(data);
				setTemporaryTreeData(data);
			}
			else {
				setTeamTreeData(data);
				setTemporaryEmergencyTreeData(data);
            }
		} 
	}

	const makeChangeRegularTeamInfo = async (selectedTeam, newData, data) => {
		//const findNode = await TeamEditController.findNode(data[0], selectedTeam.No);
		const findNode = await TeamEditController.findNode(data, selectedTeam.No);
		findNode.TeamName = newData;

		return data;
    }

	const checkEmail = (id, email, target) => {
		let members = [];
		let chk = false;

		if (id === null || id === undefined ||
			email === null || email === undefined)
			return chk;

		members = regularMembers;

		for (let i = 0; i < members.length; i++) {
			let member = members[i];

			if (member.rgl_memb_sn !== id && member.email === email) {
				chk = true;
				break;
			}
		}

		if (chk === true) {
			showConfirmDialog(ProjectResource.dialogTypes.ERROR, [email + " 이메일 주소가 이미 사용 중입니다."], null, null);
        }

		return chk;
    }

	const checkMemberID = (id, memberID, target) => {
		if (id === null || id === undefined ||
			memberID === null || memberID === undefined)
			return;

		let members = [];
		let chk = false;

		// 속한 직원 (팀 타입에 따라 달리 설정 필요.)
		//if (teamType === TeamEditorResource.ID.textRegular)
		//	members = regularMembers;
		//else
		//	members = regularMembers;
		members = regularMembers;

		for (let i = 0; i < members.length; i++) {
			let member = members[i];

			if (member.rgl_memb_sn !== id && member.unq_key === memberID) {
				chk = true;
				break;
            }
        }

		if (chk === true) {
			// 사번이 중복됨.
			showConfirmDialog(ProjectResource.dialogTypes.ERROR, [memberID + " 사번이 이미 사용 중입니다."], null, null);
		}

		return chk;
	}

	const checkPhoneNumber = (id, phoneNumber, target) => {
		let members = [];
		let chk = false;

		// console.log("ID: " + id + ", 휴대폰:" + phoneNumber);

		if (id === null || id === undefined ||
			phoneNumber === null || phoneNumber === undefined)
			return chk;

		// 속한 직원 (팀 타입에 따라 달리 설정 필요.)
		if (teamType === TeamEditorResource.ID.textRegular)
			members = regularMembers;
		else
			members = regularMembers;

		for (let i = 0; i < members.length; i++) {
			let member = members[i];

			if (member.rgl_memb_sn !== id && member.telno === phoneNumber) {
				chk = true;
				break;
			}
		}

		if (chk === true) {
			// 휴대전화번호이 중복됨.
			showConfirmDialog(ProjectResource.dialogTypes.ERROR, [phoneNumber + " 휴대전화번호가 이미 사용 중입니다."], null, null);
		}

		return chk;
	}

	const onChangeMemberEditMode = (member, editType, isEditMode) => {
		let members = [...memberGridData];

		let userInfo = ProjectResource.getUserInfo();
		if (userInfo && 
			((userInfo.grad_sn !== AccountResource.accountLevelNo.master && userInfo.grad_sn !== AccountResource.accountLevelNo.admin) ||
			userInfo.options?.teamEditor?.useRegularEditor === false)) {
			isEditMode = false;
		}

		const memberCount = members.length;
		for (let i = 0; i < memberCount; i++) {
			if ((teamType === TeamEditorResource.ID.textRegular && member.rgl_memb_sn === members[i].rgl_memb_sn) || 
				(teamType === TeamEditorResource.ID.textTemporary && member.memberNo === members[i].memberNo) ||
				(teamType === TeamEditorResource.ID.textTemporaryEmergency && member.memberNo === members[i].memberNo)) {
				members[i].isEditMode = isEditMode;

				if (!isEditMode)
					members[i].editType = '';
				else
					members[i].editType = editType;
			}
			else if (isEditMode) {
				members[i].isEditMode = false;
				members[i].editType = '';
			}
		}

		setMemberGridData(members);
	}

	const onChangeMember = async (member, isUpdate) => {
		let members = [];
		if (teamType === TeamEditorResource.ID.textRegular) {
			members = [...memberGridData];
			const memberCount = memberGridData.length;
			for (let i = 0; i < memberCount; i++) {
				if (member.rgl_memb_sn === members[i].rgl_memb_sn) {
					members[i].isEditMode = false;
					members[i].editType = '';
					break;
				}
			}

			if (isUpdate) {
				const [success, newNo, message] = await TeamEditController.updateRegularMember(member);
				if (!success && message.length > 0) {
					showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["조직원 정보 수정 실패하였습니다.", "새로고침 후에 다시 시도하거나 시스템 관리자에게 문의해주세요."], null, null);
					return;
				}

				if (member.rgl_memb_sn < 0) {
					for (let i = 0; i < memberCount; i++) {
						if (member.rgl_memb_sn === members[i].rgl_memb_sn) {
							member.rgl_memb_sn = newNo;
							break;
						}
					}
				}
			}
		}
		else if (teamType === TeamEditorResource.ID.textTemporary || teamType === TeamEditorResource.ID.textTemporaryEmergency) {
			members = [...memberGridData];
			const memberCount = memberGridData.length;
			for (let i = 0; i < memberCount; i++) {
				if (member.memberNo === members[i].memberNo) {
					members[i].isEditMode = false;
					members[i].editType = '';
					break;
				}
			}

			if (isUpdate) {
				const [success, newID, message] = await TeamEditController.updateTemporaryMember(member);
				if (!success && message.length > 0) {
					showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["조직원 정보 수정 실패하였습니다.", "새로고침 후에 다시 시도하거나 시스템 관리자에게 문의해주세요."], null, null);
					return;
				}
				
				if (member.memberNo < 0) {
					for (let i = 0; i < memberCount; i++) {
						if (member.memberNo === members[i].memberNo) {
							member.memberNo = newID;
							break;
						}
					}
				}
			}
        }

		setMemberGridData([...members]);
	}

	let isEditMode = false;
	const userInfo = ProjectResource.getUserInfo();
	if (userInfo && (userInfo.grad_sn === AccountResource.accountLevelNo.master || userInfo.grad_sn === AccountResource.accountLevelNo.admin)) {
		isEditMode = true;
	}

	return (
		<SubPageComponent className='UI_Section'>
			<div className={'teamSubAside pageMenu'}>
				{/* 조직, 근무표 선택 시 해당 메뉴 컴포넌트 */}
				<DisplayMenu
					teamType={teamType}
					onChangeTeamType={onChangeTeamType}
					scheduleType={changeScheduleType}
					onTeamNodeChanged={onTeamNodeChanged}
					isEditMode={isEditMode}
					teamTreeData={teamTreeData}
					selectedTeam={selectedTeam}
					removeTeam={removeTeam}
					editTeam={editTeam}
					onUpdateTeamTreeData={onUpdateTeamTreeData}
					showConfirmDialog={showConfirmDialog}	
					selectedSiteNo={selectedSiteNo}
					init={init}
				/>
			</div>

			{/* 멤버 테이블 또는 근무표 테이블 */}
			<DisplayContent
				teamType={teamType}
				scheduleType={schedule}
				selectedTeam={selectedTeam}
				isEditMode={isEditMode}
				regularTreeData={regularTreeData}
				regularMembers={regularMembers}
				temporaryMembers={temporaryMembers}
				memberGridData={memberGridData}
				jobLevels={jobLevels}
				jobPositions={jobPositions}
				checkMemberID={checkMemberID}
				checkPhoneNumber={checkPhoneNumber}
				checkEmail={checkEmail}
				onChangeMemberEditMode={onChangeMemberEditMode}
				onChangeMember={onChangeMember}
				showConfirmDialog={showConfirmDialog}	
				setMemberGridData={setMemberGridData}
				setRegularMembers={setRegularMembers}
				setTemporaryMembers={setTemporaryMembers}
				onTeamNodeChanged={onTeamNodeChanged}
				handleToast={handleToast}
			/>
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
		</SubPageComponent>
	);
}

function DisplayMenu(props) {

	const onChangeTeamType = (type) => {
		props.onChangeTeamType(type);

		return;
	}

	const relayScheduleType = (type) => {
		props.scheduleType(type);
		return;
	}
	
	if (props.teamType === TeamEditorResource.ID.textRegular ||
		props.teamType === TeamEditorResource.ID.textTemporary ||
		props.teamType === TeamEditorResource.ID.textTemporaryEmergency) {
		return <TeamMenu
			teamTreeData={props.teamTreeData}
			selectedTeam={props.selectedTeam}
			onChangeTeamType={onChangeTeamType}
			teamType={props.teamType}
			onTeamNodeChanged={props.onTeamNodeChanged}
			isEditMode={props.isEditMode}
			removeTeam={props.removeTeam}
			editTeam={props.editTeam}
			onUpdateTeamTreeData={props.onUpdateTeamTreeData}
			showConfirmDialog={props.showConfirmDialog}
			selectedSiteNo={props.selectedSiteNo}
			init={props.init}
		/>;
	}
	else {
		return null;
	}
}

function DisplayContent(props) {

	if (props.teamType === TeamEditorResource.ID.textRegular) {
		return (
			<RegularMemberPage
				isEditMode={props.isEditMode}
				selectedTeam={props.selectedTeam}
				regularMembers={props.regularMembers}
				memberGridData={props.memberGridData}
				jobLevels={props.jobLevels}
				jobPositions={props.jobPositions}
				checkMemberID={props.checkMemberID}
				checkPhoneNumber={props.checkPhoneNumber}
				checkEmail={props.checkEmail}
				onChangeMemberEditMode={props.onChangeMemberEditMode}
				onChangeMember={props.onChangeMember}
				showConfirmDialog={props.showConfirmDialog}
				setMemberGridData={props.setMemberGridData}
				setRegularMembers={props.setRegularMembers}
				onTeamNodeChanged={props.onTeamNodeChanged}
				handleToast={props.handleToast}
			/>
		);
	} else if (props.teamType === TeamEditorResource.ID.textTemporary || props.teamType === TeamEditorResource.ID.textTemporaryEmergency) {
		return (
			<TemporaryMemberPage
				isEditMode={props.isEditMode}
				selectedTeam={props.selectedTeam}
				temporaryMembers={props.temporaryMembers}
				memberGridData={props.memberGridData}
				teamType={props.teamType}
				jobLevels={props.jobLevels}
				jobPositions={props.jobPositions}
				regularTreeData={props.regularTreeData}
				regularMembers={props.regularMembers}
				onChangeMemberEditMode={props.onChangeMemberEditMode}
				onChangeMember={props.onChangeMember}
				showConfirmDialog={props.showConfirmDialog}
				setMemberGridData={props.setMemberGridData}
				setTemporaryMembers={props.setTemporaryMembers}
				onTeamNodeChanged={props.onTeamNodeChanged}
				handleToast={props.handleToast}
			/>
		);
	} else {
		return null;
	} 
}

export default TeamEditor;