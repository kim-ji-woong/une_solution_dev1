import React, { Component } from 'react';
import SopManagerResource from '../../resource/id';
import PanelAreas from '../panelAreas';
import SopDataManager from '../../services/sopDataManager';

import ProcessShape from '../../../SOPManager/images/process.png';
import DecisionShape from '../../../SOPManager/images/judgment.png'; 
import AnnotationShape from '../../../SOPManager/images/explanation.png'; 
import EndPointShape from '../../../SOPManager/images/startEnd.png';
import InternalShape from '../../../SOPManager/images/internal.png';

import SopController from '../../services/sopController';
import ComponentProperties from '../components/componentProperties';
import CommonResource from '../../../Common/resource/id';

import { SOPManagerBodyMainComponent } from '../../../SOPManager/styled/managerStyled';
import ProjectResource from '../../../Root/resource/id.js';


class SopManagerBodyMain extends Component {
	static currentActionStepName = null;

	constructor(props) {
		super(props);

		this.props = props;

		this.state =
		{
			currentMenu: { menuType: "" },
			sopData: this.props.sopData,
			menuType: SopManagerBodyMain.Menu_None,
			menuDatas: null,
			// 복사, 붙여넣기, 잘라내기등을 위한 데이터
			editDatas:
			{
				command: "",
				sectionCellDatas: null
            },
			selectedSectionData: [],
			selectedArrowData: [],
			actionStepName: SopManagerBodyMain.getActionStepName(this.props.sopData),
			loading: true,
			rowCount: SopManagerBodyMain.getRowCount(this.props.sopData),
			columnCount: SopManagerBodyMain.getColumnCount(this.props.sopData),
			specialMessage:
			{
				messages: [],
				currentID: -1,
				currentMessage: "",
			},
			prevProps: this.props
		};

		this.refSpLft = React.createRef();
		this.refSpWrap = React.createRef();
		this.refDTActionStep = React.createRef();
		this.refDDActionStep = React.createRef();
		this.refDDComponent = React.createRef();
		this.refDDSpecialCharacter = React.createRef();
		this.refUserDefined = React.createRef();
		this.refRadioActionStep1 = React.createRef();
		this.refRadioActionStep2 = React.createRef();
		this.refRadioActionStep3 = React.createRef();
		this.refRadioActionStep4 = React.createRef();
		this.refRadioNormal = React.createRef();
		this.refRadioAbnormal = React.createRef();
		this.refProcessImage = React.createRef();
		this.refDecisionImage = React.createRef();
		this.refAnnotationImage = React.createRef();
		this.refEndpointImage = React.createRef();
		this.refInternalImage = React.createRef();

		this.selectedCells = {};
	}

	static getDerivedStateFromProps(props, state) {
		if (props === state.prevProps) {
			return state;
		}

		return {
			currentMenu: { menuType: "" },
			sopData: props.sopData,
			menuType: SopManagerBodyMain.Menu_None,
			menuDatas: null,
			// 복사, 붙여넣기, 잘라내기등을 위한 데이터
			editDatas: state.editDatas,
			selectedSectionData: [],
			selectedArrowData: [],
			actionStepName: SopManagerBodyMain.getActionStepName(props.sopData),
			loading: true,
			rowCount: SopManagerBodyMain.getRowCount(props.sopData),
			columnCount: SopManagerBodyMain.getColumnCount(props.sopData),
			specialMessage: state.specialMessage,
			prevProps: props
		};
	}

	static getActionStepName(sopData) {
		if (sopData?.actionStepDatas) {
			if (sopData.currentActionStep?.stepName) {
				SopManagerBodyMain.currentActionStepName = sopData.currentActionStep.stepName;
				return sopData.currentActionStep.stepName;
			}
			
			if (sopData.actionStepDatas[0]?.stepName) {
				return sopData.actionStepDatas[0]?.stepName;
			}

			if (SopManagerBodyMain.currentActionStepName) {
				return SopManagerBodyMain.currentActionStepName;
			}

			const actionStepCount = sopData.actionStepDatas.length;

			for (let i = 0; i < actionStepCount; i++) {
				const actionStepData = sopData.actionStepDatas[i];

				if (actionStepData.actionStep) {
					SopManagerBodyMain.currentActionStepName = actionStepData.stepName;
					return actionStepData.stepName;
                }
            }
		}

		SopManagerBodyMain.currentActionStepName = SopManagerResource.ID.actionStep._1st;
		return SopManagerResource.ID.actionStep._1st;
    }

	onSelectComponent = (sectionData, actionStep) => {
		if (sectionData) {
			this.props.sopData.selectedTime = new Date();
		}

		this.setState({ selectedSectionData: [sectionData, actionStep], selectedArrowData: [] });
	}

	onSelectArrow = (arrow, actionStep) => {
		this.setState({ selectedArrowData: [arrow, actionStep], selectedSectionData: [] });
    }

	componentDidMount() {
		if (this.state.sopData?.disaster) {
			this.init(this.state.sopData.disaster);
		}

		this.refProcessImage.current.addEventListener("dragstart", (event) => this.onDragStart(event, SopManagerResource.ID.component.process));
		this.refDecisionImage.current.addEventListener("dragstart", (event) => this.onDragStart(event, SopManagerResource.ID.component.decision));
		this.refAnnotationImage.current.addEventListener("dragstart", (event) => this.onDragStart(event, SopManagerResource.ID.component.annotation));
		this.refEndpointImage.current.addEventListener("dragstart", (event) => this.onDragStart(event, SopManagerResource.ID.component.endpoint));
		this.refInternalImage.current.addEventListener("dragstart", (event) => this.onDragStart(event, SopManagerResource.ID.component.internal));
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.editDatas.command === prevState.editDatas.command && this.state.editDatas.command.length > 0) {
			this.setState({
				editDatas:
				{
					command: "",
					sectionCellDatas: this.state.editDatas.sectionCellDatas
				}
			});
        }
	}

	static getRowCount(sopData) {
		if (sopData) {
			if (sopData.currentActionStep) {
				if (sopData.currentActionStep.stepMemberDatas) {
					if (sopData.currentActionStep.stepMemberDatas.length > 0) {
						const stepMemberData = sopData.currentActionStep.stepMemberDatas[0];

						if (stepMemberData.grid) {
							if (stepMemberData.grid.rows) {
								return stepMemberData.grid.rows.length;
							}
						}
					}
				}
			}
		}

		return 30;
	}

	static getColumnCount(sopData) {
		if (sopData) {
			if (sopData.currentActionStep) {
				if (sopData.currentActionStep.stepMemberDatas) {
					if (sopData.currentActionStep.stepMemberDatas.length > 0) {
						const stepMemberData = sopData.currentActionStep.stepMemberDatas[0];

						if (stepMemberData.grid) {
							if (stepMemberData.grid.columns) {
								return stepMemberData.grid.columns.length;
							}
						}
					}
				}
			}
		}

		return 30;
	}

	onDragStart(event, imgName)
	{
		event.dataTransfer.setData("text/plain", imgName);
		/*const img = new Image();
		img.src = event.target.src;
		event.dataTransfer.setDragImage(img, 0, 0);*/
		event.dataTransfer.dropEffect = "copy";
    }

	init(disasterData) {
		this.onClickDt(this.refDTActionStep.current, this.refDDActionStep);

		/*this.initActionSteps(disasterData);
		
		if (disasterData.version) {
			this.setState({ isNormal: disasterData.version.isNormal });
        }*/
	}

	initActionSteps(disasterData) {
		if (disasterData.actionSteps && disasterData.actionSteps.length > 0) {
			const actionStepCount = disasterData.actionSteps.length;

			for (let i = 0; i < actionStepCount; i++) {
				const actionStep = disasterData.actionSteps[i];

				if (actionStep.actionStep === null) {
					actionStep.actionStep = SopDataManager.makeNewActionStep(actionStep.stepName, disasterData.disaster ? disasterData.disaster.id : -1);
				}
			}
		}
		else {
			disasterData.actionSteps = [];
			let actionStepName = "";

			for (let i = 0; i < 4; i++) {
				if (i === 0) {
					actionStepName = SopManagerResource.ID.actionStep._1st;
				}
				else if (i === 1) {
					actionStepName = SopManagerResource.ID.actionStep._2nd;
				}
				else if (i === 2) {
					actionStepName = SopManagerResource.ID.actionStep._3rd;
				}
				else/* if (i === 3)*/ {
					actionStepName = SopManagerResource.ID.actionStep._4th;
				}

				const actionStep = SopDataManager.makeNewActionStep(actionStepName, disasterData.disaster ? disasterData.disaster.id : -1);
				const actionStepData = SopDataManager.makeNewActionStepData(actionStepName, actionStep);
				disasterData.actionSteps.push(actionStepData);
			}
        }

		const firstActionStep = disasterData.actionSteps[0];
		this.selectActionStep(firstActionStep.stepName);
    }

	OnClickSplTgl = (event) => {
		if (event.target.classList.contains("on")) {
			event.target.classList.remove("on");
			this.refSpWrap.current.classList.remove("on");
			this.refSpLft.current.classList.remove("on");
			/*this.refSpWrap.current.animate({ 'left': '0px' });
			this.refSpLft.current.animate({ 'padding-left': '410px' });*/
		}
		else {
			event.target.classList.add("on");
			this.refSpWrap.current.classList.add("on");
			this.refSpLft.current.classList.add("on");
			/*this.refSpWrap.current.animate({ 'left': '-390px' });
			this.refSpLft.current.animate({ 'padding-left': '20px' });*/
		}
	}

	onAddComponent = (sectionData, actionStep) => {
		if (sectionData === null) {
			return;
		}

		this.addComponent(sectionData, actionStep);
	}

	async addComponent(sectionData, actionStep) {
		let stepMember = SopDataManager.getStepMember(actionStep);

		if (stepMember === null) {
			const [stepMemberData, message] = await SopController.requestDefaultStepMemberData(actionStep);

			if (stepMemberData === null) {
				this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
				return;
			}

			stepMember = stepMemberData;
		}

		if (stepMember !== null) {
			const _sectionData = SopDataManager.getSectionData(stepMember, sectionData.component.column_no, sectionData.component.row_no);

			if (_sectionData === null) {
				stepMember.sections.push(sectionData);
			}
			else {
				SopDataManager.copySectionData(sectionData, _sectionData);
			}

			if (sectionData.component.column_no === this.state.columnCount - 1) {
				this.setState({ columnCount: this.state.columnCount + 1 });
			}
			else if (sectionData.component.row_no === this.state.rowCount - 1) {
				this.setState({ rowCount: this.state.rowCount + 1 });
			}
			else {
				this.setState({ loading: false });
			}
		}
	}

	onRemoveComponent = (columnIndex, rowIndex, actionStep) => {
		this.removeComponent(columnIndex, rowIndex, actionStep);
	}

	async removeComponent(columnIndex, rowIndex, actionStep) {
		const stepMember = SopDataManager.getStepMember(actionStep);

		if (stepMember === null) {
			const stepMemberData = await SopController.requestDefaultStepMemberData(actionStep);

			if (stepMemberData === null) {
				// this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
				return;
			}

			stepMember = stepMemberData;
		}

		if (stepMember !== null) {
			if (stepMember.sections) {
				for (let i = 0; i < stepMember.sections.length; i++) {
					const sectionData = stepMember.sections[i];

					if (sectionData.component.column_no === columnIndex && sectionData.component.row_no === rowIndex) {
						this.removeArrows(columnIndex, rowIndex, stepMember);
						stepMember.sections.splice(i, 1);
						this.setState({ selectedSectionData: [] });
						break;
					}
				}
			}
		}
	}

	removeArrow(arrowData, actionStep) {
		const stepMemberCount = actionStep.stepMemberDatas.length;

		for (let i = 0; i < stepMemberCount; i++) {
			const stepMember = actionStep.stepMemberDatas[i];
			const arrowCount = stepMember.arrows.length;

			for (let j = arrowCount - 1; j >= 0; j--) {
				const arrow = stepMember.arrows[j];

				if (arrow.beginCell === arrowData.beginCell &&
					arrow.endCell === arrowData.endCell &&
					arrow.beginPosition === arrowData.beginPosition &&
					arrow.endPosition === arrowData.endPosition) {
					stepMember.arrows.splice(j, 1);
					this.setState({ selectedSectionData: [] });
					return;
                }
            }
        }
    }

	removeArrows(columnIndex, rowIndex, stepMember) {
		const arrowCount = stepMember.arrows.length;

		for (let i = arrowCount - 1; i >= 0; i--) {
			const arrow = stepMember.arrows[i];

			if ((arrow.getColumnIndex(true) === columnIndex && arrow.getRowIndex(true) === rowIndex) ||
				(arrow.getColumnIndex(false) === columnIndex && arrow.getRowIndex(false) === rowIndex)) {
				stepMember.arrows.splice(i, 1);
            }
        }
    }

	selectActionStep(actionStepName) {
		if (this.state.sopData?.actionStepDatas) {
			const actionStepCount = this.state.sopData.actionStepDatas.length;
			const sopData = this.state.sopData;

			if (actionStepName === SopManagerResource.ID.actionStep._1st && actionStepCount > 0) {
				sopData.currentActionStep = this.state.sopData.actionStepDatas[0];
			}
			else if (actionStepName === SopManagerResource.ID.actionStep._2nd && actionStepCount > 1) {
				sopData.currentActionStep = this.state.sopData.actionStepDatas[1];
			}
			else if (actionStepName === SopManagerResource.ID.actionStep._3rd && actionStepCount > 2) {
				sopData.currentActionStep = this.state.sopData.actionStepDatas[2];
			}
			else if (actionStepName === SopManagerResource.ID.actionStep._4th && actionStepCount > 3) {
				sopData.currentActionStep = this.state.sopData.actionStepDatas[3];
			}
		}

		SopManagerBodyMain.currentActionStepName = actionStepName;
		this.setState({actionStepName: actionStepName});
	}

	getSOPName() {
		if (this.state.sopData?.disaster?.disaster) {
			const sopName = this.state.sopData.disaster.disaster.sclas_name;

			if (this.state.sopData.disaster.version) {
				const mode = this.state.sopData.disaster.version.isNormal ? "(" + SopManagerResource.ID.sopMode.day + ")" : "(" + SopManagerResource.ID.sopMode.night + ")";
				return sopName + mode;
			}

			return sopName;
		}

		return "";
	}

	onClickDt(cascading, show) {
		if (cascading === SopManagerResource.ID.cascadingMenu.specialCharacter && show) {
			this.readSpecialMessages();
		}

		this.props.changeCascadingMode(cascading, show);
	}

	async readSpecialMessages() {
		const prevSpecialMessage = { ...this.state.specialMessage };
		const [specialMessages, errorMessage] = await SopController.requestSpecialMessageList();

		if (specialMessages) {
			prevSpecialMessage.messages = specialMessages;

			let findID = false;
			const messageCount = specialMessages.length;

			for (let i = 0; i < messageCount; i++) {
				if (prevSpecialMessage.currentID === specialMessages[i].spcl_chrctr_sn) {
					prevSpecialMessage.currentMessage = specialMessages[i].contents;
					findID = true;
					break;
                }
            }

			if (findID === false) {
				if (messageCount > 0) {
					prevSpecialMessage.currentID = specialMessages[0].spcl_chrctr_sn;
					prevSpecialMessage.currentMessage = specialMessages[0].contents;
				}
				else {
					prevSpecialMessage.currentID = -1;
					prevSpecialMessage.currentMessage = "";
				}
            }
			
			this.setState({ specialMessage: prevSpecialMessage });
		}
		else if (errorMessage) {
			this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [errorMessage], null, null);
        }
    }

	onClickEditMenu(menu, data) {
		if (menu === SopManagerResource.ID.editMenu.copy ||
			menu === SopManagerResource.ID.editMenu.cut ||
			menu === SopManagerResource.ID.editMenu.delete) {
			this.setState({
				editDatas:
				{
					command: menu,
					sectionCellDatas: null
				}
			});
		}
		else if (menu === SopManagerResource.ID.editMenu.paste) {
			this.setState({
				editDatas:
				{
					command: menu,
					sectionCellDatas: this.state.editDatas.sectionCellDatas
				}
			});
		}
	}

	onApplyComponentProperty = async (sectionData, actionStep, shouldUpdate) => {
		const stepMember = SopDataManager.getStepMember(actionStep);

		if (stepMember !== null) {
			const [success, errorMessage] = await SopController.checkSectionValidation(sectionData, stepMember.stepMember?.step_memb_sn);

			if (!success) {
				this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [errorMessage], null, null);
				return;
			}

			// 화살표
			if (sectionData.beginCell && sectionData.endCell) {
				this.setArrow(stepMember, sectionData);

				if (shouldUpdate) {
					const selectedSectionData = this.state.selectedSectionData.length > 0 && this.state.selectedArrowData.length === 0 ? this.state.selectedSectionData : [];
					this.setState({ selectedSectionData: selectedSectionData/*, selectedArrowData: []*/ });
				}
				return;
			}

			if (!sectionData.component) {
				return;
            }

			// Section
			const _sectionData = SopDataManager.getSectionData(stepMember, sectionData.component.column_no, sectionData.component.row_no);

			if (_sectionData === null) {
				return;
			}
			else {
				if (sectionData.component.compn_code !== _sectionData.component.compn_code) {
					return;
				}

				SopDataManager.copySectionData(sectionData, _sectionData);
			}

			if (shouldUpdate) {
				const currentMenu = { ...this.state.currentMenu };

				const selectedArrowData = this.state.selectedArrowData.length > 0 && this.state.selectedSectionData.length === 0 ? this.state.selectedArrowData : [];
				const selectedSectionData = this.needClearSectionData() ? [] : this.state.selectedSectionData;
				this.setState({ currentMenu: currentMenu, selectedSectionData, selectedArrowData, loading: false });
			}
		}
	}

	needClearSectionData() {
		const selectedSectionDatas = [...this.state.selectedSectionData];

		if (selectedSectionDatas.length < 2) {
			return true;
		}

		const selectedSectionData = selectedSectionDatas[0];

		if (!selectedSectionData) {
			return true;
        }

		const selectedCells = { ...this.selectedCells };

		for (const columnIndex in selectedCells) {
			const _columnIndex = parseInt(columnIndex);
			const rowIndices = selectedCells[columnIndex];

			for (const rowIndex of rowIndices) {
				if (selectedSectionData.component.row_no === rowIndex && selectedSectionData.component.column_no === _columnIndex) {
					return false;
                }
            }
		}

		return true;
    }

	setArrow(stepMember, arrowData) {
		const arrowCount = stepMember.arrows.length;

		for (let i = 0; i < arrowCount; i++) {
			const arrow = stepMember.arrows[i];

			if (arrow.beginPosition === arrowData.beginPosition && arrow.endPosition === arrowData.endPosition &&
				arrow.beginVertex.x === arrowData.beginVertex.x && arrow.beginVertex.y === arrowData.beginVertex.y &&
				arrow.endVertex.x === arrowData.endVertex.x && arrow.endVertex.y === arrowData.endVertex.y) {
				arrow.text = arrowData.text;
				break;
            }
        }
    }

	onProcessEdit = (command, sectionCellDatas) =>
	{
		if (command === sectionCellDatas) {
			this.onClickEditMenu(command, null);
			return;
		}

		if (command === SopManagerResource.ID.editMenu.copy ||
			command === SopManagerResource.ID.editMenu.cut ||
			command === SopManagerResource.ID.editMenu.delete) {
			this.setState({
				editDatas: {
					command: "",
					sectionCellDatas: sectionCellDatas
				}
			});
		}
		else {
			this.setState({
				editDatas: {
					command: "",
					sectionCellDatas: this.state.editDatas.sectionCellDatas
				}
			});
        }
	}

	onChangeGrid = (menuType, index) => {
		if (this.props.sopData) {
			const actionStep = this.props.sopData.currentActionStep;

			if (actionStep) {
				const stepMemberCount = actionStep.stepMemberDatas.length;

				for (let i = 0; i < stepMemberCount; i++) {
					const stepMemberData = actionStep.stepMemberDatas[i];

					if (stepMemberData.grid) {
						if (menuType === CommonResource.ID.contextMenu.columns.addToLeft) {
							SopDataManager.addToPrev(stepMemberData.grid.columns, stepMemberData.gridColumnWidth, stepMemberData, index, true);
							this.setState({ columnCount: stepMemberData.grid.columns.length });
						}
						else if (menuType === CommonResource.ID.contextMenu.columns.delete) {
							SopDataManager.deleteArray(stepMemberData.grid.columns, stepMemberData.gridColumnWidth, stepMemberData, index, true);
							this.setState({ columnCount: stepMemberData.grid.columns.length });
						}
						else if (menuType === CommonResource.ID.contextMenu.columns.addToRight) {
							SopDataManager.addToNext(stepMemberData.grid.columns, stepMemberData.gridColumnWidth, stepMemberData, index, true);
							this.setState({ columnCount: stepMemberData.grid.columns.length });
						}
						else if (menuType === CommonResource.ID.contextMenu.rows.addToUp) {
							SopDataManager.addToPrev(stepMemberData.grid.rows, stepMemberData.gridRowHeight, stepMemberData, index, false);
							this.setState({ rowCount: stepMemberData.grid.rows.length });
						}
						else if (menuType === CommonResource.ID.contextMenu.rows.delete) {
							SopDataManager.deleteArray(stepMemberData.grid.rows, stepMemberData.gridRowHeight, stepMemberData, index, false);
							this.setState({ rowCount: stepMemberData.grid.rows.length });
						}
						else if (menuType === CommonResource.ID.contextMenu.rows.addToDown) {
							SopDataManager.addToNext(stepMemberData.grid.rows, stepMemberData.gridRowHeight, stepMemberData, index, false);
							this.setState({ rowCount: stepMemberData.grid.rows.length });
						}
					}
				}
			}
		}
	}

	getActionStepClassName() {
		if (this.state.actionStepName === SopManagerResource.ID.actionStep._1st) {
			return "grn";
		}
		else if (this.state.actionStepName === SopManagerResource.ID.actionStep._2nd) {
			return "ylw";
		}
		else if (this.state.actionStepName === SopManagerResource.ID.actionStep._3rd) {
			return "org";
		}
		else if (this.state.actionStepName === SopManagerResource.ID.actionStep._4th) {
			return "hpk";
		}

		return "grn";
	}

	getSectionArrowData() {
		let sectionData = null, actionStep = null, arrowData = null;

		if (this.state.selectedSectionData && this.state.selectedSectionData.length >= 2) {
			sectionData = this.state.selectedSectionData[0];
			actionStep = this.state.selectedSectionData[1];
		}

		if (this.state.selectedArrowData && this.state.selectedArrowData.length >= 2) {
			arrowData = this.state.selectedArrowData[0];

			if (actionStep === null) {
				actionStep = this.state.selectedArrowData[1];
            }
        }

		return [sectionData, arrowData, actionStep];
	}

	checkCurrentActionStep() {
		if (this.state.sopData?.disaster && this.state.sopData?.actionStepDatas/* && !this.state.sopData.currentActionStep*/) {
			const actionStepCount = this.state.sopData?.actionStepDatas.length;

			for (let i = 0; i < actionStepCount; i++) {
				const actionStepData = this.state.sopData.actionStepDatas[i];

				if (actionStepData.stepName === this.state.actionStepName) {
					if (!actionStepData.actionStep) {
						actionStepData.actionStep = SopDataManager.makeNewActionStep(actionStepData.stepName, this.state.sopData?.disaster.id);
					}

					const sopData = this.state.sopData;
					sopData.currentActionStep = actionStepData;
					break;
				}
			}
		}
	}

	getSpecialMessageElements() {
		const specialMessage = { ...this.state.specialMessage };
		const messageCount = specialMessage.messages.length;

		if (messageCount > 0) {
			return (
				<select onChange={this.onSelectSpecialMessage}>
					{
						specialMessage.messages.map((message, index) => {
							const key = "select_" + index;
							const value = index;
							return <option key={key} value={value}>{message.cl}</option>
                        })
					}
				</select>
				);
		}

		return <></>
	}

	onSelectSpecialMessage = (event) => {
		const specialMessage = { ...this.state.specialMessage };
		const index = parseInt(event.target.value);

		if (index !== null && index !== undefined) {
			const message = specialMessage.messages[index];

			if (message) {
				specialMessage.currentID = message.spcl_chrctr_sn;
				specialMessage.currentMessage = message.contents;
				this.setState({ specialMessage: specialMessage });
            }
        }
	}

	onSelectedCells = (cells) => {
		this.selectedCells = cells;
    }

	render() {
		const sopName = this.state.sopData?.disaster?.sclas_name;
		const [sectionData, arrowData, actionStep] = this.getSectionArrowData();
		const cascadingActionStep = this.props.showCascading.actionStep ? "on" : "";
		const cascadingAddComponent = this.props.showCascading.addComponent ? "on" : "";
		const cascadingSpecialCharacter = this.props.showCascading.specialCharacter ? "on" : "";
		const cascadingUserDefinedDT = this.props.showCascading.userDefined ? " " + "on" : "";
		const cascadingUserDefinedDD = this.props.showCascading.userDefined ? "on" : "";

		const isNormal = this.state.sopData?.disaster ? this.state.sopData.disaster.nor_yn : true;
		const sopMode = isNormal ? SopManagerResource.ID.sopMode.day : SopManagerResource.ID.sopMode.night;

		this.checkCurrentActionStep();

		return (
			<>
			    <SOPManagerBodyMainComponent>
					<div className={'sopProcessLeft'} ref={this.refSpLft}>
						<div className={'scrollbarOuter'}>
							<div className={'sopAcdn'}>
								<dt ref={this.refDTActionStep} className={cascadingActionStep} onClick={(event) => this.onClickDt(SopManagerResource.ID.cascadingMenu.actionStep, !this.props.showCascading.actionStep)}>{SopManagerResource.ID.cascadingMenu.actionStep}</dt>
								<dd ref={this.refDDActionStep} className={cascadingActionStep}>
									<div className={'sopEdt1'}>
										<div className={'sopEdtTitle'}>
											<span className={this.getActionStepClassName()}>{this.state.actionStepName}</span>
											<h4>{this.getSOPName()}</h4>
										</div>
										<div className={'sopEdtRdo'}>
											<li>
												<label>
													<span className={'labelInputRadio'}>
														<input ref={this.refRadioActionStep1} type="radio" name="rdo01" id={'rdo0101'} checked={this.state.actionStepName === SopManagerResource.ID.actionStep._1st} onChange={() => this.selectActionStep(SopManagerResource.ID.actionStep._1st)} />
														&nbsp;{SopManagerResource.ID.actionStep._1st}
													</span>
												</label>
											</li>
											<li>
												<label>
													<span className={'labelInputRadio'}>
														<input ref={this.refRadioActionStep2} type="radio" name="rdo01" id={'rdo0102'} checked={this.state.actionStepName === SopManagerResource.ID.actionStep._2nd} onChange={() => this.selectActionStep(SopManagerResource.ID.actionStep._2nd)} />
														&nbsp;{SopManagerResource.ID.actionStep._2nd}
													</span>
												</label>
											</li>
											<li>
												<label>
													<span className={'labelInputRadio'}>
														<input ref={this.refRadioActionStep3} type="radio" name="rdo01" id={'rdo0103'} checked={this.state.actionStepName === SopManagerResource.ID.actionStep._3rd} onChange={() => this.selectActionStep(SopManagerResource.ID.actionStep._3rd)} />
														&nbsp;{SopManagerResource.ID.actionStep._3rd}
													</span>
												</label>
											</li>
											<li>
												<label>
													<span className={'labelInputRadio'}>
														<input ref={this.refRadioActionStep4} type="radio" name="rdo01" id={'rdo0104'} checked={this.state.actionStepName === SopManagerResource.ID.actionStep._4th} onChange={() => this.selectActionStep(SopManagerResource.ID.actionStep._4th)} />
														&nbsp;{SopManagerResource.ID.actionStep._4th}
													</span>
												</label>
											</li>
										</div>
										<div className={'sopEdtRdo2'}>
											<li>
												<label className={'sopMode'}>{sopMode}</label>
											</li>
										</div>
									</div>
								</dd>
								<dt className={cascadingAddComponent} onClick={(event) => this.onClickDt(SopManagerResource.ID.cascadingMenu.addComponent, !this.props.showCascading.addComponent)}>{SopManagerResource.ID.cascadingMenu.addComponent}</dt>
								<dd ref={this.refDDComponent} className={cascadingAddComponent}>
									<div className={'sopEdt2'}>
										<div className={'sopEdtCpnt'}>
											<li><img ref={this.refProcessImage} src={ProcessShape} alt="" /></li>
											<li><img ref={this.refAnnotationImage} src={AnnotationShape} alt="" /></li>
											<li><img ref={this.refDecisionImage} src={DecisionShape} alt="" /></li>
											<li><img ref={this.refEndpointImage} src={EndPointShape} alt="" /></li>
											<li><img ref={this.refInternalImage} src={InternalShape} alt="" /></li>
										</div>
									</div>
								</dd>
								<dt className={cascadingSpecialCharacter} onClick={(event) => this.onClickDt(SopManagerResource.ID.cascadingMenu.specialCharacter, !this.props.showCascading.specialCharacter)}>{SopManagerResource.ID.cascadingMenu.specialCharacter}</dt>
								<dd ref={this.refDDSpecialCharacter} className={cascadingSpecialCharacter}>
									<div className={'sopEdt3'}>
										<div className={'sopEdtTpy'}>
											<span>{SopManagerResource.ID.specialCharacter.selectType}</span>
												{
													this.getSpecialMessageElements()
												} 
										</div>
										<textarea cols="30" rows="6" className={'sopEdtText' + " " + 'scrollbarOuter'} value={this.state.specialMessage.currentMessage} onChange={() => { }}>
										</textarea>
									</div>
								</dd>
							</div>
						</div>
					</div>

					<div className={'sopCent'}>
						<div className={'spcTop'}>
							<li onClick={() => this.onClickEditMenu(SopManagerResource.ID.editMenu.copy, null)}><span className={'sopTopCopy'}></span><p>{SopManagerResource.ID.editMenu.copy}</p></li>
							<li onClick={() => this.onClickEditMenu(SopManagerResource.ID.editMenu.cut, null)}><span className={'sopTopCut'}></span><p>{SopManagerResource.ID.editMenu.cut}</p></li>
							<li onClick={() => this.onClickEditMenu(SopManagerResource.ID.editMenu.paste, null)}><span className={'sopTopPaste'}></span><p>{SopManagerResource.ID.editMenu.paste}</p></li>
							<li onClick={() => this.onClickEditMenu(SopManagerResource.ID.editMenu.delete, null)}><span className={'sopTopDel'}></span><p>{SopManagerResource.ID.editMenu.delete}</p></li>
						</div>
						<div className={'spcWrap'}>
							<span className={'sopTitle'}>{sopName}</span>
							<div className={'spcCont'}>
								<PanelAreas panelCount="1"
									currentMenu={this.state.currentMenu}
									sopData={this.state.sopData}
									loginUser={this.props.loginUser}
									selectedSectionData={sectionData}
									selectedArrowData={arrowData}
									editDatas={this.state.editDatas}
									onProcessEdit={this.onProcessEdit}
									rowCount={this.state.rowCount}
									columnCount={this.state.columnCount}
									content={this.props.content}
									onSelectComponent={this.onSelectComponent}
									onSelectArrow={this.onSelectArrow}
									onAddComponent={this.onAddComponent}
									onRemoveComponent={this.onRemoveComponent}
									onChangeGrid={this.onChangeGrid}
									onSelectedCells={this.onSelectedCells}
									showConfirmDialog={this.props.showConfirmDialog}
								/>
							</div>
						</div>
					</div>

					<div className={'spRht'}>
						<ComponentProperties sectionData={sectionData} arrowData={arrowData} actionStep={actionStep} sopData={this.state.sopData} onApplyComponentProperty={this.onApplyComponentProperty} onSelectComponent={this.onSelectComponent} showConfirmDialog={this.props.showConfirmDialog} />
					</div>

				</SOPManagerBodyMainComponent>
			</>
		);
	}
}

export default SopManagerBodyMain;