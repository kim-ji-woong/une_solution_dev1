import React, { Component } from 'react';
import $ from 'jquery';
import TreeNode from './treenode';
import '../../../Common/js/treeview.js';
// import './css/style.css'; /* 사용중인것, 지우지마세요 */
import { TreeViewComponent } from '../../../TeamEditor/styled/teamStyled';

class TreeView extends Component {
	static EventCheckedChanged = 1;

	constructor(props) {
		super(props);

		this.state = {
			teamTreeData: this.props.teamTreeData,
			useCheckBox: this.getCheckBoxType()
		}
	}

	componentDidMount() {
		$('.regularNameTag').click(function () {
			console.log("regularNameTag 제이쿼리");

		});
	}

	getCheckBoxType() {
		if (this.props.useCheckBox !== null && this.props.useCheckBox !== undefined) {
			return this.props.useCheckBox;
		}

		return TreeNode.CheckBox_NotUse;
    }

	onTreeNodeChanged = (team, event) => {
		this.props.onTreeNodeChanged(team, event);
	}

	render() {
		const target = $('#' + this.props.treeViewID);
		//const area = $('#' + this.props.treeViewID + "Area");
		let treeHeight = this.props.treeViewHeight;

		if(this.props.treeViewID === 'teamTree') {
			treeHeight = this.props.treeViewHeight;
		}
		else if(this.props.treeViewID === 'temporaryPopupTree') {
			treeHeight = '100%';
		}
		else if (treeHeight === null || treeHeight === undefined || isNaN(treeHeight) === true) {
			// 트리뷰 높이 Props값  설정이 없을 경우 or 값이 잘못 들어가 있을 경우
			if (target[0] != null) {
				treeHeight = target[0].clientHeight - 30;
				//area.css("height", treeHeight);
			} else {
				treeHeight = 0;
			}
		} 

		if (this.props.teamTreeData && this.props.teamTreeData.length > 0) {
			return (
				<>
				<TreeViewComponent>
					<div id={this.props.treeViewID} className={'scrollbarOuter'}>
						<ul id={this.props.treeViewID + "Area"} className={'sarTree treeview'} style={{ "height": treeHeight }}  >
							{
								this.props.teamTreeData.map((data, index) => (
									(this.props.teamTreeData[index].Children === null || this.props.teamTreeData[index].Children === undefined || this.props.teamTreeData[index].length === 0)
										?
										<TreeNode key={data.ID}
											teamTreeData={data}
											onTreeNodeChanged={this.onTreeNodeChanged}
											isEditMode={this.props.isEditMode}
											editNodeID={this.props.editNodeID}
											editTeamInfo={this.props.editTeamInfo}
											useCheckBox={this.state.useCheckBox}
											addTeam={this.props.addTeam}
											selectedTeam={this.props.selectedTeam}
											editTeam={this.props.editTeam}
											removeTeam={this.props.removeTeam}
										/>
										:
										<li key={data.ID}>
											<TreeNode key={data.ID}
												teamTreeData={data}
												onTreeNodeChanged={this.onTreeNodeChanged}
												isEditMode={this.props.isEditMode}
												editNodeID={this.props.editNodeID}
												editTeamInfo={this.props.editTeamInfo}
												useCheckBox={this.state.useCheckBox}
												addTeam={this.props.addTeam}
												selectedTeam={this.props.selectedTeam}
												editTeam={this.props.editTeam}
												removeTeam={this.props.removeTeam}
											/>
										</li>
								))
							}
						</ul>
					</div>
				</TreeViewComponent>
				</>
			);
		}
		else {
			return (<div id={this.props.treeViewID} className={'scrollbarOuter'} > </div>);
        }
	}
}

export default TreeView;