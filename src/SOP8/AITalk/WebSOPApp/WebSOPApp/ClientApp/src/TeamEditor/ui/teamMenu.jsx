import React, { useRef, useState } from 'react';
import '../../Common/js/treeview.js';
import $ from 'jquery';
import { TeamEditController } from '../services/teamEditController';
import { SettingController } from '../../Settings/services/settingController.js';
import TeamEditorResource from '../resource/id';
import TreeView from './utility/treeview';
import ProjectResource from '../../Root/resource/id';

import { SaRhtComponent } from '../../TeamEditor/styled/teamStyled';
import AccountResource from '../../Account/resource/id.js';
import IconButton from '../../Common/components/iconButton.jsx';
import Icon from '../../Common/components/Icon/Icon.jsx';

function TeamMenu(props) {
	const [editNodeID, setEditNodeID] = useState(0);
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const refRegularTeamFile = useRef(null);

	const onClickTeam = (teamType) => {		
		props.onChangeTeamType(teamType);
		setIsMenuOpen(false);
	}

	const onTreeNodeChanged = (team, target) => {
		if (props.selectedTeam !== team) {
			props.onTeamNodeChanged(team);
		}
	}

	const addRootTeam = async () => {
		if (!props.isEditMode)
			return;

		let name = "";

		if (props.teamType === TeamEditorResource.ID.textRegular) {
			name = "새 조직";
		} else if (props.teamType === TeamEditorResource.ID.textTemporary) {
			name = "새 비상조직";
		} else if (props.teamType === TeamEditorResource.ID.textTemporaryEmergency) {
			name = "새 휴일 비상조직";
		}

		const nodeData = { No: -1, TeamName: name, ParentTeam: null, ParentTeamNo: null, Children: [], site_sn: props.selectedSiteNo };

		if (props.teamType === TeamEditorResource.ID.textRegular) {
			const [success, newNo, message] = await TeamEditController.updateRegularTeam(nodeData);
			if (!success) {
				props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
				return;
			}

			nodeData.No = newNo;
		}
		else if (props.teamType === TeamEditorResource.ID.textTemporary || props.teamType === TeamEditorResource.ID.textTemporaryEmergency) {
			if (props.teamType === TeamEditorResource.ID.textTemporary) {
				nodeData.IsNormal = true;
			}
			else {
				nodeData.IsNormal = false;
			}
			nodeData.site_sn = ProjectResource.site_sn;

			const [success, newNo, message] = await TeamEditController.updateTemporaryTeam(nodeData);
			if (!success) {
				props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
				return;
			}

			nodeData.No = newNo;
		}
		else {
			return;
        }

		const teamTreeData = props.teamTreeData;
		teamTreeData.push(nodeData);

		props.onUpdateTeamTreeData(teamTreeData);
    }

	const addTeam = async () => {
		if (!props.isEditMode)
			return;

		let name = '';
		if (props.teamType === TeamEditorResource.ID.textRegular) {
			name = "새 조직";
		}
		else if (props.teamType === TeamEditorResource.ID.textTemporary) {
			name = "새 비상조직";
		}
		else if (props.teamType === TeamEditorResource.ID.textTemporaryEmergency) {
			name = "새 휴일 비상조직";
		}
		else {
			return;
		}

		const nodeData = { No: -1, TeamName: name, ParentTeam: null, ParentTeamNo: props.selectedTeam.No, Children: [], site_sn: ProjectResource.site_sn };

		if (props.teamType === TeamEditorResource.ID.textRegular) {
			const [success, newNo, message] = await TeamEditController.updateRegularTeam(nodeData);
			if (!success) {
				props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
				return;
			}

			nodeData.No = newNo;
			nodeData.ParentTeam = props.selectedTeam;
		}
		else if (props.teamType === TeamEditorResource.ID.textTemporary || props.teamType === TeamEditorResource.ID.textTemporaryEmergency) {
			if (props.teamType === TeamEditorResource.ID.textTemporary) {
				nodeData.IsNormal = true;
			}
			else {
				nodeData.IsNormal = false;
			}
			nodeData.site_sn = ProjectResource.site_sn;

			const [success, newNo, message] = await TeamEditController.updateTemporaryTeam(nodeData);
			if (!success) {
				props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
				return;
			}

			nodeData.No = newNo;
			nodeData.ParentTeam = props.selectedTeam;
		}

		const findNode = TeamEditController.findParent(nodeData.ParentTeamNo, props.teamTreeData);
		if (!findNode.Children)
			findNode.Children = [];
		findNode.Children.push(nodeData);

		props.onUpdateTeamTreeData(props.teamTreeData);
	}

	const removeTeam = () => {
		if (!props.isEditMode)
			return;

		props.removeTeam();
	}

	const editTeam = () => {
		if (!props.isEditMode)
			return;
				
		setEditNodeID(props.selectedTeam.No);
	}

	const editTeamInfo = (team, chgName) => {
		if (team !== null) {
			props.editTeam(team, chgName);
		}

		// 팀 이름 수정이 끝났으면 텍스트박스를 label tag로 바꿔주려고
		setEditNodeID(0);
    }

	const onClickUpload = (mode) => {
		if (mode === 'upload') {
			refRegularTeamFile.current.click();
		}
	}

	const onClickDownload = (mode) => {
		const selectedSiteNo = props.selectedSiteNo;

		if (mode === 'download') {
			downloadRegularTeam(selectedSiteNo);
		}
	}

	const downloadRegularTeam = async (selectedSiteNo) => {
		const [surcess, message] = await TeamEditController.downloadRegularTeam(selectedSiteNo);

		if (surcess === null) {
			props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
		}
	}

	const onSelectRegularTeamFile = (event) => {
		const file = event.target.files[0];
		refRegularTeamFile.current.value = "";

		const type = /(.*?)\.(xls|xlsx)$/;

		if (!file.name.match(type)) {
			props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['엑셀 파일(xls, xlsx)만 업로드 가능합니다.'], null, null);
			return;
		} else if (file.size > 10485760) {
			props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['최대 10MB 엑셀 파일을 업로드 할 수 있습니다.'], null, null);
			return;
		}

		uploadRegularTeamFile(file);
	}

	const uploadRegularTeamFile = async (file) => {
		// 조직 정보 업로드
		if (file !== null && file !== undefined) {
			const [success, message] = await TeamEditController.uploadRegularTeam(file, props.selectedSiteNo);

			if (success !== true) {
				//alert("조직 정보 업로드 실패:" + message);
				props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['조직 정보 업로드 실패 : ' + message], null, null);
				return;
			} else if (success === true) {
				props.showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, ['조직 정보를 업로드하였습니다.'], null, null);
				props.init();
			}
		}
	}

	const getRegularFileButton = () => {
		let ui = [];
		const userInfo = ProjectResource.getUserInfo();

		if (userInfo && props.teamType === TeamEditorResource.ID.textRegular) {
			ui.push(
				<div key='userFile' className={'memberInfoWrap'}>
					<p>정규조직 정보 다운로드</p>
					<IconButton
						variant="unfill_white"
						size="xxs"
						icon={<Icon.Fileload size={"xs"} />}
						onClick={() => onClickDownload('download')}
					>
						다운로드 버튼
					</IconButton>
					<input ref={refRegularTeamFile} style={{ display: 'none' }} type='file' accept='.xls,.xlsx' onChange={onSelectRegularTeamFile} />
				</div>
			);
		}

		return ui;
	}

	let editArea = null;
	if (props.isEditMode) {
		editArea =
			<div className={'sarEditBox'}>
				<p>조직 추가</p>
				<IconButton
					variant="unfill_white"
					size="xxs"
					icon={<Icon.PlusIcon size={"xxxs"} direction={isMenuOpen? "top" : "bottom"} />}
					onClick={() => addRootTeam()}
				>
					조직추가 버튼
				</IconButton>
			</div>
	} 

	return (			
		<SaRhtComponent $isEditMode={props.isEditMode}>
			<div className={'sarSel'}>	
				<div>
					<p>{props.teamType}</p>
					<IconButton
						variant="unfill_white"
						size="xxs"
						icon={<Icon.Arrow size={"xs"} direction={isMenuOpen? "top" : "bottom"} />}
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						메뉴 열기 버튼
					</IconButton>				
				</div>
				{isMenuOpen &&
					<ul>
						<li onClick={() => onClickTeam(TeamEditorResource.ID.textRegular)}><a>{TeamEditorResource.ID.textRegular}</a></li>
						<li onClick={() => onClickTeam(TeamEditorResource.ID.textTemporary)}><a>{TeamEditorResource.ID.textTemporary}</a></li>
						<li onClick={() => onClickTeam(TeamEditorResource.ID.textTemporaryEmergency)}><a>{TeamEditorResource.ID.textTemporaryEmergency}</a></li>
					</ul>
				}
			</div>
			{editArea} 
			{/* 트리뷰 위치 */}
			<TreeView
				treeViewID="teamTree"
				teamTreeData={props.teamTreeData}
				onTreeNodeChanged={onTreeNodeChanged}
				isEditMode={props.isEditMode}
				editNodeID={editNodeID}
				editTeamInfo={editTeamInfo}
				selectedTeam={props.selectedTeam}
				addTeam={addTeam}
				editTeam={editTeam}
				removeTeam={removeTeam}
				treeViewHeight={props.isEditMode ? 'calc(100% - 176px)' : 'calc(100% - 116px)'}
			/>
			{getRegularFileButton()}
		</SaRhtComponent>
	);
}

export default TeamMenu;