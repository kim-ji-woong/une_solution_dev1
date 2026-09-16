import Receiver from "../../Common/models/sections/receiver";
import SectionData from "../../Common/models/sections/sectionData";
import SectionDataAnnotation from "../../Common/models/sections/sectionDataAnnotation";
import SectionDataDecision from "../../Common/models/sections/sectionDataDecision";
import SectionDataEndpoint from "../../Common/models/sections/sectionDataEndpoint";
import SectionDataInternal from "../../Common/models/sections/sectionDataInternal";
import SectionDataProcess from "../../Common/models/sections/sectionDataProcess";
import Arrow from "../../Common/sections/components/arrow";
import TreeNode from "../../TeamEditor/ui/utility/treenode";

export default class SopDataManager {
	static makeNewActionStep(actionStepName, disasterID) {
		const actionStep = {
			id: -1,
			stepName: actionStepName,
			disasterID: disasterID,
			userDefinedConfigID: -1
		};

		return actionStep;
	}

	static makeNewActionStepData(actionStepName, actionStep) {
		const actionStepData = {
			stepName: actionStepName,
			actionStep: actionStep,
			stepMemberDatas: []
		};

		return actionStepData;
	}

	static makeNewVersion(isNormal, versionName, ownerID, description) {
		const now = new Date();
		let currentTime = now.toISOString();

		const dotIndex = currentTime.indexOf('.');

		if (dotIndex > 0) {
			currentTime = currentTime.substring(0, dotIndex);
		}

		return {
			"id": -1,
			"isNormal": isNormal,
			"createTime": currentTime,
			"lastAccessTime": currentTime,
			"versionName": versionName,
			"ownerID": ownerID,
			"description": description
		};
    }

	static getStepMember(actionStep) {
		let stepMember = null;

		if (actionStep.stepMemberDatas && actionStep.stepMemberDatas.length > 0) {
			stepMember = actionStep.stepMemberDatas[0];
		}

		if (stepMember !== null) {
			if (!stepMember.sections) {
				stepMember.sections = [];
			}

			if (!stepMember.arrows) {
				stepMember.arrows = [];
			}
		}

		return stepMember;
	}

	static getSectionData(stepMember, columnIndex, rowIndex) {
		const [sectionData, index] = SopDataManager.getSectionDataWithIndex(stepMember, columnIndex, rowIndex);
		return sectionData;
		/*if (stepMember.sections) {
			for (let i = 0; i < stepMember.sections.length; i++) {
				const sectionData = stepMember.sections[i];

				if (sectionData.gridColumnIndex === columnIndex &&
					sectionData.gridRowIndex === rowIndex) {
					return sectionData;
				}
			}
		}

		return null;*/
	}

	static getSectionDataWithIndex(stepMember, columnIndex, rowIndex) {
		if (stepMember.sections) {
			for (let i = 0; i < stepMember.sections.length; i++) {
				const sectionData = stepMember.sections[i];

				if (sectionData.gridColumnIndex === columnIndex &&
					sectionData.gridRowIndex === rowIndex) {
					return [sectionData, i];
				}
			}
		}

		return [null, -1];
	}

	static copySectionData(src, trg) {
		SectionData.copyTo(src, trg);

		if (src.componentType === SectionDataAnnotation.getComponentType() || src.componentType === SectionData.AnnotationType) {
			SectionDataAnnotation.copyTo(src, trg);
		}
		else if (src.componentType === SectionDataDecision.getComponentType() || src.componentType === SectionData.DecisionType) {
			SectionDataDecision.copyTo(src, trg);
		}
		else if (src.componentType === SectionDataEndpoint.getComponentType() || src.componentType === SectionData.EndpointType) {
			SectionDataEndpoint.copyTo(src, trg);
		}
		else if (src.componentType === SectionDataInternal.getComponentType() || src.componentType === SectionData.InternalType) {
			SectionDataInternal.copyTo(src, trg);
		}
		else if (src.componentType === SectionDataProcess.getComponentType() || src.componentType === SectionData.ProcessType) {
			SectionDataProcess.copyTo(src, trg);
		}
	}

	static getSectionData(stepMember, columnIndex, rowIndex) {
		if (stepMember.sections) {
			for (let i = 0; i < stepMember.sections.length; i++) {
				const sectionData = stepMember.sections[i];

				if (sectionData.gridColumnIndex === columnIndex &&
					sectionData.gridRowIndex === rowIndex) {
					return sectionData;
				}
			}
		}

		return null;
	}

	static sopDataToJson(sopData) {
		const dc = SopDataManager.getDisasterCategory(sopData);
		const sdc = SopDataManager.getSubDisasterCategory(sopData);
		const disaster = sopData?.disaster;

		if (!dc || !sdc || !disaster) {
			return null;
		}

		const version = { ...sopData.version };
		// owner는 BLL의 원래 모델에는 없는 데이터기 때문에 삭제한다.
		delete version['owner'];

		const json = {
			disasterCategory: dc,
			subDisasterCategory: sdc,
			disaster: disaster,
			version: version,
			actionStepDatas: SopDataManager.actionStepsToJson(sopData.actionStepDatas)
		};

		return json;
	}

	static getDisasterCategory(sopData) {
		if (sopData?.disasterCategory?.disasterCategory) {
			return sopData?.disasterCategory.disasterCategory;
		}

		return sopData?.disasterCategory;
	}

	static getSubDisasterCategory(sopData) {
		if (sopData?.subDisasterCategory?.subDisasterCategory) {
			return sopData?.subDisasterCategory.subDisasterCategory;
		}

		return sopData?.subDisasterCategory;
	}

	static actionStepsToJson(actionSteps) {
		if (!actionSteps) {
			return null;
		}

		const jsonActionSteps = [];

		actionSteps.map(actionStepData => {
			jsonActionSteps.push(SopDataManager.actionStepDataToJson(actionStepData));
		});

		return jsonActionSteps;
	}

	static actionStepDataToJson(actionStepData) {
		if (!actionStepData) {
			return null;
		}

		return {
			"stepName": actionStepData.stepName,
			"actionStep": SopDataManager.actionStepToJson(actionStepData.actionStep),
			"stepMemberDatas": SopDataManager.stepMemberDatasToJson(actionStepData.stepMemberDatas)
		};
	}

	static actionStepToJson(actionStep) {
		if (!actionStep) {
			return null;
		}

		return {
			"id": actionStep.id,
			"stepName": actionStep.stepName,
			"disasterID": actionStep.disasterID,
			"userDefinedConfigID": actionStep.userDefinedConfigID
		};
	}

	static stepMemberDatasToJson(stepMemberDatas) {
		if (!stepMemberDatas) {
			return null;
		}

		const jsonStepMemberDatas = [];

		stepMemberDatas.map(stepMemberData => {
			jsonStepMemberDatas.push(SopDataManager.stepMemberDataToJson(stepMemberData));
		});

		return jsonStepMemberDatas;
	}

	static stepMemberDataToJson(stepMemberData) {
		if (!stepMemberData) {
			return null;
		}

		return {
			"stepMember": SopDataManager.stepMemberToJson(stepMemberData.stepMember),
			"stepMemberName": stepMemberData.stepMemberName,
			"sections": SopDataManager.sectionsToJson(stepMemberData.sections),
			"arrows": SopDataManager.arrowsToJson(stepMemberData.arrows, stepMemberData.sections),
			"gridColumnWidth": SopDataManager.gridDatasToJson(stepMemberData.grid?.columns, stepMemberData.gridColumnWidth),
			"gridRowHeight": SopDataManager.gridDatasToJson(stepMemberData.grid?.rows, stepMemberData.gridRowHeight)
		};
	}

	static gridDatasToJson(datas, originDatas) {
		const gridDatas = [];

		if (datas && datas.length > 0) {
			const dataCount = datas.length;

			for (let i = 0; i < dataCount; i++) {
				gridDatas.push(datas[i]);
			}
		}
		else if (originDatas && originDatas.length > 0) {
			const dataCount = originDatas.length;

			for (let i = 0; i < dataCount; i++) {
				gridDatas.push(originDatas[i]);
			}
        }

		return gridDatas;
    }

	static stepMemberToJson(stepMember) {
		if (!stepMember) {
			return null;
		}

		return {
			"id": stepMember.id,
			"teamID": stepMember.teamID,
			"teamType": stepMember.teamType,
			"actionStepID": stepMember.actionStepID
		};
	}

	static sectionsToJson(sections) {
		if (!sections) {
			return null;
		}

		const jsonSections = [];

		sections.map(section => {
			jsonSections.push(SopDataManager.sectionToJson(section));
		});

		return jsonSections;
	}

	static sectionToJson(section) {
		if (!section) {
			return null;
		}

		if (section.typeID === SectionData.ProcessType || section.componentType === SectionData.ProcessType) {
			return SectionDataProcess.toJson(section);
		}
		else if (section.typeID === SectionData.InternalType || section.componentType === SectionData.InternalType) {
			return SectionDataInternal.toJson(section);
		}
		else if (section.typeID === SectionData.EndpointType || section.componentType === SectionData.EndpointType) {
			return SectionDataEndpoint.toJson(section);
		}
		else if (section.typeID === SectionData.DecisionType || section.componentType === SectionData.DecisionType) {
			return SectionDataDecision.toJson(section);
		}
		else if (section.typeID === SectionData.AnnotationType || section.componentType === SectionData.AnnotationType) {
			return SectionDataAnnotation.toJson(section);
		}

		return null;
	}

	static arrowsToJson(arrows, sections) {
		if (!arrows) {
			return null;
		}

		const jsonArrows = [];

		arrows.map(arrow => {
			const json = Arrow.toJson(arrow, sections);

			if (json !== null)
				jsonArrows.push(json);
		});

		return jsonArrows;
	}

	static addToPrev(arr, gridDatas, stepMemberData, index, isColumn) {
		const sections = stepMemberData.sections;
		const arrows = stepMemberData.arrows;
		const mapSections = {};

		if (index >= 0 && index < arr.length) {
			arr.splice(index, 0, arr[index]);

			if (index < gridDatas.length) {
				gridDatas.splice(index, 0, arr[index]);
			}

			const sectionCount = sections ? sections.length : 0;
			const arrowCount = arrows ? arrows.length : 0;

			if (isColumn) {
				for (let i = 0; i < sectionCount; i++) {
					const section = sections[i];

					if (section.gridColumnIndex >= index) {
						section.gridColumnIndex += 1;
					}

					const key = section.gridColumnIndex + "_" + section.gridRowIndex;
					mapSections[key] = section;
				}

				for (let i = 0; i < arrowCount; i++) {
					const arrow = arrows[i];
					const [beginColumnIndex, beginRowIndex, endColumnIndex, endRowIndex, beginPosition, endPosition, text] = arrow.getArrowInfo();

					if (beginColumnIndex !== null && endColumnIndex !== null) {
						if (beginColumnIndex >= index) {
							SopDataManager.setArrowPosition(arrow, stepMemberData, true, beginColumnIndex + 1, beginRowIndex, beginPosition, text);

							if (endColumnIndex >= index) {
								SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex + 1, endRowIndex, endPosition, text);
							}
							else {
								SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex, endRowIndex, endPosition, text);
							}
						}
						else if (endColumnIndex >= index) {
							SopDataManager.setArrowPosition(arrow, stepMemberData, true, beginColumnIndex, beginRowIndex, beginPosition, text);
							SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex + 1, endRowIndex, endPosition, text);
						}
						else {
							SopDataManager.setArrowPosition(arrow, stepMemberData, true, beginColumnIndex, beginRowIndex, beginPosition, text);
							SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex, endRowIndex, endPosition, text);
                        }
					}

					SopDataManager.setArrowSection(arrow, mapSections);
				}
			}
			else {
				for (let i = 0; i < sectionCount; i++) {
					const section = sections[i];

					if (section.gridRowIndex >= index) {
						section.gridRowIndex += 1;
					}

					const key = section.gridColumnIndex + "_" + section.gridRowIndex;
					mapSections[key] = section;
				}

				for (let i = 0; i < arrowCount; i++) {
					const arrow = arrows[i];
					const [beginColumnIndex, beginRowIndex, endColumnIndex, endRowIndex, beginPosition, endPosition, text] = arrow.getArrowInfo();

					if (beginColumnIndex !== null && endColumnIndex !== null) {
						if (beginRowIndex >= index) {
							SopDataManager.setArrowPosition(arrow, stepMemberData, true, beginColumnIndex, beginRowIndex + 1, beginPosition, text);

							if (endRowIndex >= index) {
								SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex, endRowIndex + 1, endPosition, text);
							}
							else {
								SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex, endRowIndex, endPosition, text);
							}
						}
						else if (endRowIndex >= index) {
							SopDataManager.setArrowPosition(arrow, stepMemberData, true, beginColumnIndex, beginRowIndex, beginPosition, text);
							SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex, endRowIndex + 1, endPosition, text);
						}
						else {
							SopDataManager.setArrowPosition(arrow, stepMemberData, true, beginColumnIndex, beginRowIndex, beginPosition, text);
							SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex, endRowIndex, endPosition, text);
						}

						SopDataManager.setArrowSection(arrow, mapSections);
					}
				}
			}

			stepMemberData.remakeGrid = true;
		}
	}

	static addToNext(arr, gridDatas, stepMemberData, index, isColumn) {
		const sections = stepMemberData.sections;
		const arrows = stepMemberData.arrows;
		const arrayCount = arr.length;

		const mapSections = {};

		if (index >= 0 && index === arrayCount - 1) {
			arr.push(arr[index]);
			gridDatas.push(arr[index]);
		}
		else if (index >= 0 && index < arrayCount - 1) {
			arr.splice(index + 1, 0, arr[index]);

			if (index <= gridDatas.length - 1) {
				gridDatas.splice(index + 1, 0, arr[index]);
			}
		}
		else {
			return;
		}

		const sectionCount = sections ? sections.length : 0;
		const arrowCount = arrows ? arrows.length : 0;

		if (isColumn) {
			for (let i = 0; i < sectionCount; i++) {
				const section = sections[i];

				if (section.gridColumnIndex > index) {
					section.gridColumnIndex += 1;
				}

				const key = section.gridColumnIndex + "_" + section.gridRowIndex;
				mapSections[key] = section;
			}

			for (let i = 0; i < arrowCount; i++) {
				const arrow = arrows[i];
				const [beginColumnIndex, beginRowIndex, endColumnIndex, endRowIndex, beginPosition, endPosition, text] = arrow.getArrowInfo();

				if (beginColumnIndex !== null && endColumnIndex !== null) {
					if (beginColumnIndex > index) {
						SopDataManager.setArrowPosition(arrow, stepMemberData, true, beginColumnIndex + 1, beginRowIndex, beginPosition, text);

						if (endColumnIndex > index) {
							SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex + 1, endRowIndex, endPosition, text);
						}
						else {
							SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex, endRowIndex, endPosition, text);
						}
					}
					else if (endColumnIndex > index) {
						SopDataManager.setArrowPosition(arrow, stepMemberData, true, beginColumnIndex, beginRowIndex, beginPosition, text);
						SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex + 1, endRowIndex, endPosition, text);
					}
					else {
						SopDataManager.setArrowPosition(arrow, stepMemberData, true, beginColumnIndex, beginRowIndex, beginPosition, text);
						SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex, endRowIndex, endPosition, text);
					}

					SopDataManager.setArrowSection(arrow, mapSections);
				}
			}
		}
		else {
			for (let i = 0; i < sectionCount; i++) {
				const section = sections[i];

				if (section.gridRowIndex > index) {
					section.gridRowIndex += 1;
				}

				const key = section.gridColumnIndex + "_" + section.gridRowIndex;
				mapSections[key] = section;
			}

			for (let i = 0; i < arrowCount; i++) {
				const arrow = arrows[i];
				const [beginColumnIndex, beginRowIndex, endColumnIndex, endRowIndex, beginPosition, endPosition, text] = arrow.getArrowInfo();

				if (beginRowIndex !== null && endRowIndex !== null) {
					if (beginRowIndex > index) {
						SopDataManager.setArrowPosition(arrow, stepMemberData, true, beginColumnIndex, beginRowIndex + 1, beginPosition, text);

						if (endRowIndex > index) {
							SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex, endRowIndex + 1, endPosition, text);
						}
						else {
							SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex, endRowIndex, endPosition, text);
						}
					}
					else if (endRowIndex > index) {
						SopDataManager.setArrowPosition(arrow, stepMemberData, true, beginColumnIndex, beginRowIndex, beginPosition, text);
						SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex, endRowIndex + 1, endPosition, text);
					}
					else {
						SopDataManager.setArrowPosition(arrow, stepMemberData, true, beginColumnIndex, beginRowIndex, beginPosition, text);
						SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex, endRowIndex, endPosition, text);
					}

					SopDataManager.setArrowSection(arrow, mapSections);
				}
			}

			stepMemberData.remakeGrid = true;
		}
	}

	static deleteArray(arr, gridDatas, stepMemberData, index, isColumn) {
		const sections = stepMemberData.sections;
		const arrows = stepMemberData.arrows;

		if (index >= 0 && index < arr.length) {
			arr.splice(index, 1);

			if (index < gridDatas.length) {
				gridDatas.splice(index, 1);
			}

			const sectionCount = sections ? sections.length : 0;
			const arrowCount = arrows ? arrows.length : 0;

			const removeSectionIndices = [];
			const removeArrowIndices = [];

			if (isColumn) {
				for (let i = 0; i < sectionCount; i++) {
					const section = sections[i];

					if (section.gridColumnIndex === index) {
						removeSectionIndices.push(i);
					}
					else if (section.gridColumnIndex > index) {
						section.gridColumnIndex -= 1;
					}
				}

				for (let i = removeSectionIndices.length - 1; i >= 0; i--) {
					sections.splice(removeSectionIndices[i], 1);
				}

				for (let i = 0; i < arrowCount; i++) {
					const arrow = arrows[i];
					const [beginColumnIndex, beginRowIndex, endColumnIndex, endRowIndex, beginPosition, endPosition, text] = arrow.getArrowInfo();

					if (beginColumnIndex !== null && endColumnIndex !== null) {
						if (beginColumnIndex === index || endColumnIndex === index) {
							removeArrowIndices.push(i);
						}
						else {
							if (beginColumnIndex > index) {
								SopDataManager.setArrowPosition(arrow, stepMemberData, true, beginColumnIndex - 1, beginRowIndex, beginPosition, text);

								if (endColumnIndex > index) {
									SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex - 1, endRowIndex, endPosition, text);
								}
								else {
									SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex, endRowIndex, endPosition, text);
								}
							}
							else if (endColumnIndex > index) {
								SopDataManager.setArrowPosition(arrow, stepMemberData, true, beginColumnIndex, beginRowIndex, beginPosition, text);
								SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex - 1, endRowIndex, endPosition, text);
							}
							else {
								SopDataManager.setArrowPosition(arrow, stepMemberData, true, beginColumnIndex, beginRowIndex, beginPosition, text);
								SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex, endRowIndex, endPosition, text);
							}
						}
					}
				}

				for (let i = removeArrowIndices.length - 1; i >= 0; i--) {
					arrows.splice(removeArrowIndices[i], 1);
				}
			}
			else {
				for (let i = 0; i < sectionCount; i++) {
					const section = sections[i];

					if (section.gridRowIndex === index) {
						removeSectionIndices.push(i);
					}
					else if (section.gridRowIndex > index) {
						section.gridRowIndex -= 1;
					}
				}

				for (let i = removeSectionIndices.length - 1; i >= 0; i--) {
					sections.splice(removeSectionIndices[i], 1);
				}

				for (let i = 0; i < arrowCount; i++) {
					const arrow = arrows[i];
					const [beginColumnIndex, beginRowIndex, endColumnIndex, endRowIndex, beginPosition, endPosition, text] = arrow.getArrowInfo();

					if (beginRowIndex !== null && endRowIndex !== null) {
						if (beginRowIndex === index || endRowIndex === index) {
							removeArrowIndices.push(i);
						}
						else {
							if (beginRowIndex > index) {
								SopDataManager.setArrowPosition(arrow, stepMemberData, true, beginColumnIndex, beginRowIndex - 1, beginPosition, text);

								if (endRowIndex > index) {
									SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex, endRowIndex - 1, endPosition, text);
								}
								else {
									SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex, endRowIndex, endPosition, text);
								}
							}
							else if (endRowIndex > index) {
								SopDataManager.setArrowPosition(arrow, stepMemberData, true, beginColumnIndex, beginRowIndex, beginPosition, text);
								SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex, endRowIndex - 1, endPosition, text);
							}
							else {
								SopDataManager.setArrowPosition(arrow, stepMemberData, true, beginColumnIndex, beginRowIndex, beginPosition, text);
								SopDataManager.setArrowPosition(arrow, stepMemberData, false, endColumnIndex, endRowIndex, endPosition, text);
							}
						}
					}
				}

				for (let i = removeArrowIndices.length - 1; i >= 0; i--) {
					arrows.splice(removeArrowIndices[i], 1);
				}
			}

			const mapSections = {};
			const sectionCount2 = sections ? sections.length : 0;
			const arrowCount2 = arrows ? arrows.length : 0;

			for (let i = 0; i < sectionCount2; i++) {
				const section = sections[i];

				const key = section.gridColumnIndex + "_" + section.gridRowIndex;
				mapSections[key] = section;
			}

			for (let i = 0; i < arrowCount2; i++) {
				const arrow = arrows[i];
				SopDataManager.setArrowSection(arrow, mapSections);
			}

			stepMemberData.remakeGrid = true;
		}
	}

	static setArrowPosition(arrow, stepMemberData, isBegin, columnIndex, rowIndex, position, text) {
		if (isBegin) {
			arrow.beginCell = null;
			arrow.beginComponentRowIndex = rowIndex;
			arrow.beginComponentColumnIndex = columnIndex;
			arrow.beginComponentPosition = position;
		}
		else {
			arrow.endCell = null;
			arrow.endComponentRowIndex = rowIndex;
			arrow.endComponentColumnIndex = columnIndex;
			arrow.endComponentPosition = position;
		}

		arrow.text = text;
		stepMemberData.resetArrows = true;
	}

	static setArrowSection(arrow, mapSections) {
		const key1 = arrow.beginComponentColumnIndex + "_" + arrow.beginComponentRowIndex;
		const sectionBegin = mapSections[key1];

		if (!sectionBegin) {
			return;
		}

		const key2 = arrow.endComponentColumnIndex + "_" + arrow.endComponentRowIndex;
		const sectionEnd = mapSections[key2];

		if (!sectionEnd) {
			return;
		}

		arrow.beginComponentID = sectionBegin.id;
		arrow.endComponentID = sectionEnd.id;
	}

	static setTeamTreeDataChecked(teamTreeDatas, receivers, teamType) {
		if (!teamTreeDatas) {
			return;
		}

		const rootNodeCount = teamTreeDatas.length;

		for (let i = 0; i < rootNodeCount; i++) {
			SopDataManager.clearTreeNodeChecked(teamTreeDatas[i]);
		}

		if (receivers !== null) {
			const treeNodeMap = {};

			for (let i = 0; i < rootNodeCount; i++) {
				SopDataManager.setTreeNodeMap(teamTreeDatas[i], treeNodeMap);
			}

			const receiverCount = receivers.length;

			for (let i = 0; i < receiverCount; i++) {
				const receiver = receivers[i];

				if (receiver.teamType !== teamType)
					continue;

				const treeNode = treeNodeMap[receiver.teamID];

				if (treeNode) {
					treeNode.checked = TreeNode.CHECKED_ALL;
                }
            }
        }
	}

	static setTreeNodeMap(treeNode, treeNodeMap) {
		treeNodeMap[treeNode.ID] = treeNode;

		if (treeNode.Children) {
			treeNode.Children.map((node, index) => {
				SopDataManager.setTreeNodeMap(node, treeNodeMap);
			});
		}
    }

	static clearTreeNodeChecked(treeNode) {
		treeNode.checked = TreeNode.CHECKED_NONE;

		if (treeNode.Children) {
			treeNode.Children.map((node, index) => {
				SopDataManager.clearTreeNodeChecked(node);
			});
		}
	}

	static setReceiverNames(sopData) {
		if (sopData.actionStepDatas) {
			const actionStepCount = sopData.actionStepDatas.length;

			for (let i = 0; i < actionStepCount; i++) {
				const actionStep = sopData.actionStepDatas[i];

				if (actionStep.stepMemberDatas) {
					const stepMemberCount = actionStep.stepMemberDatas.length;

					for (let j = 0; j < stepMemberCount; j++) {
						const stepMember = actionStep.stepMemberDatas[j];

						if (stepMember.sections) {
							const sectionCount = stepMember.sections.length;

							for (let k = 0; k < sectionCount; k++) {
								const section = stepMember.sections[k];

								if (section.componentType === SectionData.ProcessType ||
									section.componentType === SectionData.InternalType) {
									section.receiverName = SopDataManager.getReceiverText(section.receivers, sopData.teamAllTreeDatas);
								}
							}
						}
					}
				}
			}
		}
	}

	static getReceiverText(receivers, teamAllTreeDatas) {
		if (!receivers) {
			return "";
		}

		const receiverCount = receivers.length;

		if (receiverCount === 0) {
			return "";
		}

		if (receiverCount === 1) {
			const teamData = SopDataManager.getReceiverName(receivers[0], teamAllTreeDatas);

			if (!teamData || teamData[0] === null) {
				return "";
			}
			else {
				return teamData[0];
            }
		}
		else if (receiverCount === 2) {
			const [teamName1, depth1] = SopDataManager.getReceiverName(receivers[0], teamAllTreeDatas);
			const [teamName2, depth2] = SopDataManager.getReceiverName(receivers[1], teamAllTreeDatas);

			if (teamName1?.length > 0 && teamName2?.length) {
				if (depth1 < depth2) {
					return teamName1 + ", " + teamName2;
				}
				else {
					return teamName2 + ", " + teamName1;
                }
			}
			else if (teamName1?.length > 0) {
				return teamName1;
			}
			else if (teamName2?.length > 0) {
				return teamName2;
			}
			else {
				return "";
			}
		}

		let rootTeamName = "";
		let rootTeamDepth = -1;

		for (let i = 0; i < receiverCount; i++) {
			const [teamName, depth] = SopDataManager.getReceiverName(receivers[i], teamAllTreeDatas);

			if (teamName && teamName?.length > 0) {
				if (rootTeamDepth < 0 || rootTeamDepth > depth) {
					rootTeamName = teamName;
					rootTeamDepth = depth;
                }
				//return teamName + "외 " + (receiverCount - 1) + "팀";
			}
		}

		if (rootTeamName?.length > 0) {
			return rootTeamName + "외 " + (receiverCount - 1) + "팀";
        }

		return "";
	}

	static getReceiverName(receiver, teamAllTreeDatas) {
		let teamData = null;

		if (receiver.teamType === Receiver.RegularTeam) {
			teamData = SopDataManager.getReceiverTeamName(receiver.teamID, teamAllTreeDatas.regular);
		}
		else if (receiver.teamType === Receiver.TemporaryNormalTeam) {
			teamData = SopDataManager.getReceiverTeamName(receiver.teamID, teamAllTreeDatas.normal);
		}
		else if (receiver.teamType === Receiver.TemporaryEmergencyTeam) {
			teamData = SopDataManager.getReceiverTeamName(receiver.teamID, teamAllTreeDatas.emergency);
		}

		return teamData;
	}

	static getReceiverTeamName(teamID, treeNodes, depth = 1) {
		if (!treeNodes) {
			return [null, depth];
		}

		const nodeCount = treeNodes.length;

		for (let i = 0; i < nodeCount; i++) {
			const treeNode = treeNodes[i];

			if (treeNode.ID === teamID) {
				return [treeNode.TeamName, depth];
			}

			const teamData = SopDataManager.getReceiverTeamName(teamID, treeNode.Children, depth + 1);

			if (teamData[0] !== null) {
				return teamData;
			}
		}

		return [null, depth];
	}
}