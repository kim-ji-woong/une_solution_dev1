import React, { Component } from 'react';
import $ from 'jquery';
import imgRectChecked from '../../../Common/img/common/checkbox_rect.png';
import TreeView from './treeview';


class TreeNode extends Component {
	static NO_CHILD = -1;
	static CHECKED_NONE = 0;
	static CHECKED_ALL = 1;
	static CHECKED_SOME = 2;

	// CheckBox 사용하지 않는다.
	static CheckBox_NotUse = 0;
	// 개별 CheckBox가 독립적으로 작동한다.
	static CheckBox_NormalUse = 1;
	// 각 CheckBox가 부모와 자식노드의 영향을 받는다.
	static Checkbox_RelativeUse = 2;


	constructor(props) {
		super(props);

		this.state = {
			teamTreeData: this.props.teamTreeData,
			nodeEdit: false /* 우클릭으로 편집하기 위해 필요한거 */
		}

		this.onTreeNodeChanged = this.onTreeNodeChanged.bind(this);
	}

	componentDidMount() {
		$(document).ready(function () {
			$('.treeview').hummingbird();
		})
	}

	onTreeNodeChanged = (e) => {
		if (e.nativeEvent.which === 1) {
			this.props.onTreeNodeChanged(this.props.teamTreeData, e.target);
		}
		else {
			if (!this.props.isEditMode)
				return;

			e.preventDefault(); // web 우클릭 메뉴 숨기기
			if (!this.state.nodeEdit) {
				this.setState({ nodeEdit: true });
			}
		}
	}

	onBlur(name) {
		if (name !== this.props.teamTreeData.TeamName) {			
			this.setState({ nodeEdit: false });
			this.props.editTeamInfo(this.props.teamTreeData, name);
		}
		else {
			this.setState({ nodeEdit: false });
			this.props.editTeamInfo(null, null);
        }
	}

	handleKeyPress = (e) => {

		if (e.key === "Enter") {
			this.onBlur(e.target.value);
		}
	}

	onChecked = (event) => {
		this.props.teamTreeData.checked = event.target.checked ? TreeNode.CHECKED_ALL : TreeNode.CHECKED_NONE;

		if (this.props.useCheckBox === TreeNode.Checkbox_RelativeUse) {
			TreeNode.setCheckCascade(this.props.teamTreeData);
			TreeNode.setCheckCascadeInverse(this.props.teamTreeData);
        }

		if (this.props.useCheckBox === TreeNode.Checkbox_RelativeUse) {
			if (this.props.onCheckedChanged) {
				this.props.onCheckedChanged(this.props.teamTreeData.checked);
			}
			const event = { type: TreeView.EventCheckedChanged, arg: null };
			this.props.onTreeNodeChanged(this.props.teamTreeData, event);
		}
		else if (this.props.useCheckBox === TreeNode.CheckBox_NormalUse && this.props.onTreeNodeChanged) {
			const event = { type: TreeView.EventCheckedChanged, arg: null };
			this.props.onTreeNodeChanged(this.props.teamTreeData, event);
			this.setState({ teamTreeData: this.state.teamTreeData });
        }
		else {
			this.setState({ teamTreeData: this.state.teamTreeData });
        }
	}

	static setCheckCascadeInverse(teamTreeData) {
		const parent = teamTreeData.ParentTeam;

		if (parent) {
			let checkedCount = 0;
			let someCount = 0;

			for (const child of parent.Children) {
				if (child.checked === TreeNode.CHECKED_ALL) {
					checkedCount++;
				}
				else if (child.checked === TreeNode.CHECKED_SOME) {
					someCount++;
                }
			}

			if (someCount > 0) {
				parent.checked = TreeNode.CHECKED_SOME;
            }
			else if (checkedCount === 0) {
				parent.checked = TreeNode.CHECKED_NONE;
			}
			else if (checkedCount === parent.Children.length) {
				parent.checked = TreeNode.CHECKED_ALL;
			}
			else {
				parent.checked = TreeNode.CHECKED_SOME;
			}

			TreeNode.setCheckCascadeInverse(parent);
        }
    }

	// 하위노드들의 checked 상태를 모두 바꾼다.
	setCheck(node, checked) {
		for (const child of node.Children) {
			child.checked = checked;
			this.setCheck(child, checked);
        }
    }

	static setCheckCascade(teamTreeData) {
		const checked = teamTreeData.checked;

		for (const child of teamTreeData.Children) {
			child.checked = checked;
			TreeNode.setCheckCascade(child);
        }
    }

	/*
	 * 1. checked => true
	 *    - 전체 자식 노드들을 true로 만든다.
	 *    - 부모 노드에게 true임을 알린다.
	 *      . 부모는 모든 자식이 true이면 true로 바뀐다.
	 *      . 부모는 일부 자식만 true이면 중간으로 바뀐다.
	 * 2. checked => false
	 *    - 전체 자식 노드들을 false로 만든다.
	 *    - 부모 노드에게 false임을 알린다.
	 *      . 부모는 모든 자식이 false이면 false로 바뀐다.
	 *      . 부모는 일부 자식만 false이면 중간으로 바뀐다.
	 */
	onCheckedChanged = (childChecked) => {
		if (this.props.useCheckBox === TreeNode.Checkbox_RelativeUse) {
			if (this.props.onCheckedChanged) {
				this.props.onCheckedChanged(childChecked);
				return;
			}
			else {
				this.setState({ teamTreeData: this.state.teamTreeData });
				return;
            }
		}

		let checked = this.props.teamTreeData.checked;

		if (checked === childChecked) {
			this.setState({ teamTreeData: this.state.teamTreeData });
			return;
		}

		const allChildChecked = this.getChildChecked();

		if (checked === allChildChecked) {
			this.setState({ teamTreeData: this.state.teamTreeData });
			return;
		}

		checked = allChildChecked;
		this.props.teamTreeData.checked = checked;

		if (this.props.onCheckedChanged) {
			this.props.onCheckedChanged(checked);
		}
		else {
			this.setState({ teamTreeData: this.state.teamTreeData });
		}
	}

	getChildChecked() {
		const childCount = this.props.teamTreeData.Children.length;

		if (childCount === 0) {
			return TreeNode.NO_CHILD;
        }

		let checked = 0;

		for (let i = 0; i < childCount; i++) {
			const data = this.props.teamTreeData.Children[i];

			if (data.checked === TreeNode.CHECKED_ALL) {
				checked++;
            }
		}

		if (checked === childCount) {
			return TreeNode.CHECKED_ALL;
		}
		else if (checked === 0) {
			return TreeNode.CHECKED_NONE;
		}

		return TreeNode.CHECKED_SOME;
    }

	getCheckBox() {
		if (this.props.useCheckBox === TreeNode.CheckBox_NormalUse) {
			if (this.props.teamTreeData.checked === TreeNode.CHECKED_ALL) {
				return <input type="checkbox" checked={true} onChange={this.onChecked} style={{ verticalAlign : 'top' }} />;
			}
			else {
				return <input type="checkbox" checked={false} onChange={this.onChecked} style={{ verticalAlign : 'top' }}/>;
			}
		}
		else if (this.props.useCheckBox === TreeNode.Checkbox_RelativeUse) {
			/*if (this.props.parentChecked === TreeNode.CHECKED_ALL) {
				this.props.teamTreeData.checked = TreeNode.CHECKED_ALL;
			}
			else if (this.props.parentChecked === TreeNode.CHECKED_NONE) {
				this.props.teamTreeData.checked = TreeNode.CHECKED_NONE;
			}*/

			if (this.props.teamTreeData.checked === TreeNode.CHECKED_ALL) {
				return <input type="checkbox" checked={true} onChange={this.onChecked} style={{ verticalAlign : 'top' }} />;
			}
			else if (this.props.teamTreeData.checked === TreeNode.CHECKED_SOME) {
				return <input type="checkbox" checked={false} onChange={this.onChecked} style={{ background: `#fff url(${imgRectChecked}) no-repeat center center` , verticalAlign : 'top' }} />;
			}
			else {
				return <input type="checkbox" checked={false} onChange={this.onChecked} style={{ verticalAlign : 'top' }}/>;
            }
		}

		return <></>;
	}

	render() {		

		let selectedTeam = this.props.selectedTeam;
		let teamTreeData = this.props.teamTreeData;
		let selectNodeClass = "";

		if (selectedTeam !== null && selectedTeam !== undefined &&
			teamTreeData !== null && teamTreeData !== undefined &&
			selectedTeam.No === teamTreeData.No) {

			if (this.props.isEditMode === true)
				selectNodeClass = "selected wordIength";
			else
				selectNodeClass = "select";
        }

		let output = null;
		
		if (this.props.teamTreeData === null || this.props.teamTreeData === undefined) {
			return <></>;
		}

		let haveChildren = null;

		if (this.props.teamTreeData.Children === null || this.props.teamTreeData.Children === undefined || this.props.teamTreeData.Children.length === 0) {
			haveChildren = false;
			output =
			<>
				{
					(this.props.editNodeID === this.props.teamTreeData.No || this.state.nodeEdit) ?
						<a><input type="text" defaultValue={this.props.teamTreeData.TeamName} onBlur={(e) => this.onBlur(e.target.value)} onKeyPress={this.handleKeyPress} autoFocus /></a>
						:
						<a className={selectNodeClass} id={'wordIength'} onClick={(e) => this.onTreeNodeChanged(e)} onContextMenu={(e) => this.onTreeNodeChanged(e)}>
							{this.props.teamTreeData.TeamName}
							<span className={'editArea'}>
								<span className={'treeEdit'} onClick={this.props.editTeam}></span>
								<span className={'treeMinus'} onClick={this.props.removeTeam}></span>
								<span className={'treePlus'} onClick={this.props.addTeam}></span>
							</span>
						</a>
				}
			</>
		}
		else {
			haveChildren = true;
			output =
				<>
					<i className="fa-minus"> 더보기</i>
					{
						(this.props.editNodeID === this.props.teamTreeData.No || this.state.nodeEdit) ?
							<>				
								<h5 style={{ marginRight: "10px" }}>
									<input type="text" defaultValue={this.props.teamTreeData.TeamName} onBlur={(e) => this.onBlur(e.target.value)} onKeyPress={this.handleKeyPress} autoFocus style={{ width: "150px" }} />
								</h5>
							</>
							:
							<>
							<h5 className={selectNodeClass} onClick={this.onTreeNodeChanged} onContextMenu={(e) => this.onTreeNodeChanged(e)}>{this.props.teamTreeData.TeamName}
								<span className={'editArea'}>
									<span className={'treeEdit'} onClick={this.props.editTeam}></span>
									<span className={'treeMinus'} onClick={this.props.removeTeam}></span>
									<span className={'treePlus'} onClick={this.props.addTeam}></span>
								</span>
							</h5>
						</> 
					}
				</>
		}

		const checkBox = this.getCheckBox();

		// if (this.props.teamTreeData.Children === null || this.props.teamTreeData.Children === undefined)
		// 	console.log(this.props.teamTreeData.TeamName + ': NULL')
		// else
		// 	console.log(this.props.teamTreeData.TeamName + ':' + this.props.teamTreeData)
		return (	
			<>
				{output}
				{checkBox}
				{
					(haveChildren) ?
						<ul>
							{
								(this.props.teamTreeData.Children === null || this.props.teamTreeData.Children === undefined)
									? <></>
									: this.props.teamTreeData.Children.map((data, index) => (
										<li key={data.No}>
											<TreeNode key={data.No}
												teamTreeData={data}
												onTreeNodeChanged={this.props.onTreeNodeChanged}
												isEditMode={this.props.isEditMode}
												editNodeID={this.props.editNodeID}
												editTeamInfo={this.props.editTeamInfo}
												useCheckBox={this.props.useCheckBox}
												parentChecked={this.props.teamTreeData?.checked}
												onCheckedChanged={this.onCheckedChanged}
												addTeam={this.props.addTeam}
												selectedTeam={this.props.selectedTeam}
												editTeam={this.props.editTeam}
												removeTeam={this.props.removeTeam}
											/>
										</li>
									))
							}							
						</ul>
					: <></>
				}
			</>
		);
	}
}

export default TreeNode;
