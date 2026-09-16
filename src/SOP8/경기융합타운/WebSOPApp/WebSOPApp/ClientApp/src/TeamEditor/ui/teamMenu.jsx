import React, { useState } from 'react';
import '../../Common/js/treeview.js';
import $ from 'jquery';
import { TeamEditController } from '../services/teamEditController';
import TeamEditorResource from '../resource/id';
import TreeView from './utility/treeview';
import ProjectResource from '../../Root/resource/id';

import { SaRhtComponent } from '../../TeamEditor/styled/teamStyled';

function TeamMenu(props) {
	const [editNodeID, setEditNodeID] = useState(0);

	const onClickList = (e) => {
		var target = e;

		if ($(target).is('.' + 'on')) {
			$(target).removeClass('on');
			$(target).next().slideUp();
		} else {
			$(target).addClass('on');
			$(target).next().slideDown();
		}

		return;
	}

	const onClickTeam = (teamType) => {		
		props.onChangeTeamType(teamType);

		$('#btnTeamMenu').removeClass('on');
		$('#btnTeamMenu').next().slideUp();
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

		const nodeData = { ID: -1, TeamName: name, ParentTeam: null, ParentTeamID: null, Children: [], SiteNo: props.selectedSiteNo };

		if (props.teamType === TeamEditorResource.ID.textRegular) {
			const [success, newID, message] = await TeamEditController.UpdateRegularTeam(nodeData);
			if (!success) {
				props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
				return;
			}

			nodeData.ID = newID;
		}
		else if (props.teamType === TeamEditorResource.ID.textTemporary || props.teamType === TeamEditorResource.ID.textTemporaryEmergency) {
			if (props.teamType === TeamEditorResource.ID.textTemporary) {
				nodeData.IsNormal = true;
			}
			else {
				nodeData.IsNormal = false;
			}
			nodeData.SiteNo = ProjectResource.SiteNo;

			const [success, newID, message] = await TeamEditController.UpdateTemporaryTeam(nodeData);
			if (!success) {
				props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
				return;
			}

			nodeData.ID = newID;
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

		const nodeData = { ID: -1, TeamName: name, ParentTeam: null, ParentTeamID: props.selectedTeam.ID, Children: [], SiteNo: ProjectResource.SiteNo };

		if (props.teamType === TeamEditorResource.ID.textRegular) {
			const [success, newID, message] = await TeamEditController.UpdateRegularTeam(nodeData);
			if (!success) {
				props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
				return;
			}

			nodeData.ID = newID;
		}
		else if (props.teamType === TeamEditorResource.ID.textTemporary || props.teamType === TeamEditorResource.ID.textTemporaryEmergency) {
			if (props.teamType === TeamEditorResource.ID.textTemporary) {
				nodeData.IsNormal = true;
			}
			else {
				nodeData.IsNormal = false;
			}
			nodeData.SiteNo = ProjectResource.SiteNo;

			const [success, newID, message] = await TeamEditController.UpdateTemporaryTeam(nodeData);
			if (!success) {
				props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
				return;
			}

			nodeData.ID = newID;
		}

		const findNode = TeamEditController.findParent(nodeData.ParentTeamID, props.teamTreeData);
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
				
		setEditNodeID(props.selectedTeam.ID);
	}

	const editTeamInfo = (team, chgName) => {
		if (team !== null) {
			props.editTeam(team, chgName);
		}

		// 팀 이름 수정이 끝났으면 텍스트박스를 label tag로 바꿔주려고
		setEditNodeID(0);
    }

	let editArea = null;
	if (props.isEditMode) {
		editArea =
			<div className={'sarEditBox'}>
				<button className={'sarEdit'} onClick={() => addRootTeam()}>
					조직추가
				</button>
			</div>
	} 

	return (			
		<SaRhtComponent $isEditMode={props.isEditMode}>
			<div className={'sarSel'}>					
				<button id="btnTeamMenu" onClick={(e) => onClickList(e.target)}>
					{props.teamType}
				</button>
				<ul>
					<li onClick={() => onClickTeam(TeamEditorResource.ID.textRegular)}><a>{TeamEditorResource.ID.textRegular}</a></li>
					<li onClick={() => onClickTeam(TeamEditorResource.ID.textTemporary)}><a>{TeamEditorResource.ID.textTemporary}</a></li>
					<li onClick={() => onClickTeam(TeamEditorResource.ID.textTemporaryEmergency)}><a>{TeamEditorResource.ID.textTemporaryEmergency}</a></li>
				</ul>
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
				treeViewHeight={props.isEditMode ? 'calc(100% - 220px)' : 'calc(100% - 164px)'}
			/>
			<div className={'memberInfoWrap'}>
				<button className={'upload'}>
					조직 업로드
				</button>
				<button className={'download'}>
					조직 다운로드
				</button>
			</div>
		</SaRhtComponent>
	);
}

export default TeamMenu;