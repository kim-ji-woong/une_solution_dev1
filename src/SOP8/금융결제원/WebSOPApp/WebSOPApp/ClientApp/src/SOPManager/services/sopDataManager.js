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
	static makeNewActionStep(actionStepName, disasterID = -1) {
		const actionStep = {
			action_step_sn: -1,
			action_step_name: actionStepName,
			sclas_sn: disasterID,
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
		let currentTime = `${now.getYear() + 1900}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}T${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}Z`;
		//let currentTime = now.toISOString();

		const dotIndex = currentTime.indexOf('.');

		if (dotIndex > 0) {
			currentTime = currentTime.substring(0, dotIndex);
		}

		return {
			"ver_sn": -1,
			//"isNormal": isNormal,
			"creat_de": currentTime,
			"last_acces_de": currentTime,
			"name": versionName,
			"user_sn": ownerID,
			"descp": description
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

	//static getSectionData(stepMember, columnIndex, rowIndex) {
	//	const [sectionData, index] = SopDataManager.getSectionDataWithIndex(stepMember, columnIndex, rowIndex);
	//	return sectionData;
	//	/*if (stepMember.sections) {
	//		for (let i = 0; i < stepMember.sections.length; i++) {
	//			const sectionData = stepMember.sections[i];

	//			if (sectionData.component.column_no === columnIndex &&
	//				sectionData.component.row_no === rowIndex) {
	//				return sectionData;
	//			}
	//		}
	//	}

	//	return null;*/
	//}

	static getSectionDataWithIndex(stepMember, columnIndex, rowIndex) {
		if (stepMember.sections) {
			for (let i = 0; i < stepMember.sections.length; i++) {
				const sectionData = stepMember.sections[i];

				if (sectionData.component.column_no === columnIndex &&
					sectionData.component.row_no === rowIndex) {
					return [sectionData, i];
				}
			}
		}

		return [null, -1];
	}

	static copySectionData(src, trg) {
		SectionData.copyTo(src, trg);

		if (SectionData.isAnnotationType(src.component.compn_code)) {
			SectionDataAnnotation.copyTo(src, trg);
		}
		else if (SectionData.isDecisionType(src.component.compn_code)) {
			SectionDataDecision.copyTo(src, trg);
		}
		else if (SectionData.isEndpointType(src.component.compn_code)) {
			SectionDataEndpoint.copyTo(src, trg);
		}
		else if (SectionData.isTransmissionType(src.component.compn_code)) {
			SectionDataInternal.copyTo(src, trg);
		}
		else if (SectionData.isProcessType(src.component.compn_code)) {
			SectionDataProcess.copyTo(src, trg);
		}
	}

	static getSectionData(stepMember, columnIndex, rowIndex) {
		if (stepMember.sections && stepMember.sections.length > 0) {
			for (let i = 0; i < stepMember.sections.length; i++) {
				const sectionData = stepMember.sections[i];

				if (sectionData.component.column_no === undefined) {
					if (sectionData.component && sectionData.component.column_no === columnIndex &&
						sectionData.component.row_no === rowIndex) {
						return SopDataManager.sectionComponenttoSectionData(sectionData.component, sectionData.sectionNumber);
					}
				}
				else {
					if (sectionData.component.column_no === columnIndex &&
						sectionData.component.row_no === rowIndex) {
						return sectionData;
					}
                }
			}
		}

		return null;
	}

	static sectionComponenttoSectionData(component, sectionNumber) {
		let sectionData = null;

		if (SectionData.isProcessType(component.compn_code)) {
			sectionData = SectionDataProcess.componentToSectionData(component);
		}
		else if (SectionData.isAnnotationType(component.compn_code)) {
			sectionData = SectionDataAnnotation.componentToSectionData(component);
		}
		else if (SectionData.isDecisionType(component.compn_code)) {
			sectionData = SectionDataDecision.componentToSectionData(component);
		}
		else if (SectionData.isEndpointType(component.compn_code)) {
			sectionData = SectionDataEndpoint.componentToSectionData(component);
		}
		else if (SectionData.isTransmissionType(component.compn_code)) {
			sectionData = SectionDataInternal.componentToSectionData(component);
		}
		else {
			return null;
		}

		sectionData.id = component.compn_sn;
		// sectionData.component.compn_code = SectionData.getcomponent.compn_codeString(component.compn_code);
		sectionData.component.column_no = component.column_no;
		sectionData.component.row_no = component.row_no;
		// sectionData.componentNo = component.compn_sn;
		sectionData.component.compn_code = component.compn_code;
		sectionData.sectionNumber = sectionNumber;

		return sectionData;
	}

	static sopDataToJson(sopData) {
		const dc = SopDataManager.getDisasterCategory(sopData);
		const sdc = SopDataManager.getSubDisasterCategory(sopData);
		const disaster = SopDataManager.disasterToJson(sopData?.disaster, sdc.mclas_sn, sopData.version.ver_sn);

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
			version: SopDataManager.versionToJson(version),
			actionStepDatas: SopDataManager.actionStepsToJson(sopData.actionStepDatas)
		};

		return json;
	}

	static disasterToJson(disaster, mclas_sn, versionNo) {
		if (!disaster) {
			return null;
        }

		const json = {
			sclas_sn: disaster.sclas_sn,
			sclas_name: disaster.sclas_name,
			mclas_sn: mclas_sn,
			ver_sn: versionNo,
			nor_yn: disaster.nor_yn,
			descp: disaster.descp
		}

		return json;
    }

	static versionToJson(ver) {
		const json = {
			ver_sn: ver.ver_sn,
			creat_de: ver.creat_de,
			last_acces_de: ver.last_acces_de,
			name: ver.name,
			user_sn: ver.user_sn,
			descp: ver.descp
		}

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
			"action_step_sn": actionStep.action_step_sn,         // actionStep.action_step_sn
			"action_step_name": actionStep.action_step_name, // actionStep.action_step_name
			"sclas_sn": actionStep.sclas_sn        // actionStep.sclas_sn
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
			//"stepMemberName": stepMemberData.stepMemberName,
			"rawSections": SopDataManager.sectionsToJson(stepMemberData.sections),
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
			"step_memb_sn": stepMember.step_memb_sn,
			//"teamID": stepMember.teamID,
			//"teamType": stepMember.teamType,
			"action_step_sn": stepMember.action_step_sn
		};
	}

	static jsonToSections(rawSections) {
		if (!rawSections) {
			return [];
		}

		const sections = [];

		rawSections.map(rawSection => {
			sections.push(SopDataManager.jsonToSection(rawSection));
		});

		return sections;
	}

	static jsonToSection(rawSection) {
		let sectionData = null;

		if (SectionData.isProcessType(rawSection.compn_code)) {
			sectionData = SectionDataProcess.fromJson(rawSection);
		}
		else if (SectionData.isTransmissionType(rawSection.compn_code)) {
			sectionData = SectionDataInternal.fromJson(rawSection);
		}
		else if (SectionData.isEndpointType(rawSection.compn_code)) {
			sectionData = SectionDataEndpoint.fromJson(rawSection);
		}
		else if (SectionData.isDecisionType(rawSection.compn_code)) {
			sectionData = SectionDataDecision.fromJson(rawSection);
		}
		else if (SectionData.isAnnotationType(rawSection.compn_code)) {
			sectionData = SectionDataAnnotation.fromJson(rawSection);
		}
		else {
			return null;
		}

		sectionData.component.column_no = rawSection.column_no;
		sectionData.component.row_no = rawSection.row_no;
		return sectionData;
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

		if (SectionData.isProcessType(section.component.compn_code)) {
			return SectionDataProcess.toJson(section);
		}
		else if (SectionData.isTransmissionType(section.component.compn_code)) {
			return SectionDataInternal.toJson(section);
		}
		else if (SectionData.isEndpointType(section.component.compn_code)) {
			return SectionDataEndpoint.toJson(section);
		}
		else if (SectionData.isDecisionType(section.component.compn_code)) {
			return SectionDataDecision.toJson(section);
		}
		else if (SectionData.isAnnotationType(section.component.compn_code)) {
			return SectionDataAnnotation.toJson(section);
		}

		return null;
	}

	static arrowsToJson(arrows, sections) {
		if (!arrows) {
			return null;
		}

		const jsonArrows = [];

		arrows.forEach(arrow => {
			const json = (arrow.beginColumnIndex === 0 || arrow.beginColumnIndex)
				? Arrow.toJson3(arrow, sections) 
				: Arrow.toJson(arrow, sections);
		
			if (json !== null) {
				jsonArrows.push(json);
			}
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

					if (section.component.column_no >= index) {
						section.component.column_no += 1;
					}

					const key = section.component.column_no + "_" + section.component.row_no;
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

					if (section.component.row_no >= index) {
						section.component.row_no += 1;
					}

					const key = section.component.column_no + "_" + section.component.row_no;
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

				if (section.component.column_no > index) {
					section.component.column_no += 1;
				}

				const key = section.component.column_no + "_" + section.component.row_no;
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

				if (section.component.row_no > index) {
					section.component.row_no += 1;
				}

				const key = section.component.column_no + "_" + section.component.row_no;
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

					if (section.component.column_no === index) {
						removeSectionIndices.push(i);
					}
					else if (section.component.column_no > index) {
						section.component.column_no -= 1;
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

					if (section.component.row_no === index) {
						removeSectionIndices.push(i);
					}
					else if (section.component.row_no > index) {
						section.component.row_no -= 1;
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

				const key = section.component.column_no + "_" + section.component.row_no;
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
			arrow.beginRowIndex = rowIndex;
			arrow.beginColumnIndex = columnIndex;
			arrow.beginPosition = position;
		}
		else {
			arrow.endCell = null;
			arrow.endRowIndex = rowIndex;
			arrow.endColumnIndex = columnIndex;
			arrow.endPosition = position;
		}

		arrow.text = text;
		stepMemberData.resetArrows = true;
	}

	static setArrowSection(arrow, mapSections) {
		const key1 = arrow.beginColumnIndex + "_" + arrow.beginRowIndex;
		const sectionBegin = mapSections[key1];

		if (!sectionBegin) {
			return;
		}

		const key2 = arrow.endColumnIndex + "_" + arrow.endRowIndex;
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
		treeNodeMap[treeNode.No] = treeNode;

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

								if (SectionData.isProcessType(section.component.compn_code) ||
									SectionData.isTransmissionType(section.component.compn_code)) {
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

			if (treeNode.No === teamID) {
				return [treeNode.TeamName, depth];
			}

			const teamData = SopDataManager.getReceiverTeamName(teamID, treeNode.Children, depth + 1);

			if (teamData[0] !== null) {
				return teamData;
			}
		}

		return [null, depth];
	}

	static setSectionComponents(sopData) {
		if (!sopData) {
			return;
		}

		for (const actionStepData of sopData.actionStepDatas) {
			for (const stepMemberData of actionStepData.stepMemberDatas) {
				for (const sectionData of stepMemberData.sections) {
					if (sectionData.commentData) {
						//sectionData.component = sectionData.commentData;
					}
					else if (sectionData.decisionData) {
						//sectionData.component = sectionData.decisionData;
					}
					else if (sectionData.endpointData) {
						//sectionData.component = sectionData.endpointData;
					}
					else if (sectionData.processData) {
						if (sectionData.process && sectionData.processData) {
							sectionData.process.missions = sectionData.processData.missions;

							sectionData.process.receivers = [];

							for (const regular of sectionData.processData.regulars) {
								const receiver = {
									"teamID": regular.rgl_sn,
									"teamType": Receiver.RegularTeam
								}

								sectionData.process.receivers.push(receiver);
							}

							for (const temporary of sectionData.processData.temporaries) {
								const receiver = {
									"teamID": temporary.tmpr_sn,
									"teamType": temporary.nor_yn ? Receiver.TemporaryNormalTeam : Receiver.TemporaryEmergencyTeam
								}

								sectionData.process.receivers.push(receiver);
							}
						}
						//sectionData.component = sectionData.processData;
					}
					else if (sectionData.transmissionData) {
						if (sectionData.transmission && sectionData.transmissionData) {
							sectionData.transmission.receivers = [];

							for (const regular of sectionData.transmissionData.regulars) {
								const receiver = {
									"teamID": regular.rgl_sn,
									"teamType": Receiver.RegularTeam
								}

								sectionData.transmission.receivers.push(receiver);
							}

							for (const temporary of sectionData.transmissionData.temporaries) {
								const receiver = {
									"teamID": temporary.tmpr_sn,
									"teamType": temporary.nor_yn ? Receiver.TemporaryNormalTeam : Receiver.TemporaryEmergencyTeam
								}

								sectionData.transmission.receivers.push(receiver);
							}
						}
						//sectionData.component = sectionData.transmissionData;
					}

					delete sectionData.commentData;
					delete sectionData.decisionData;
					delete sectionData.endpointData;
					delete sectionData.processData;
					delete sectionData.transmissionData;
                }
            }
        }
	}

	static setDisasterCategories(disasterCategories) {
		for (const disasterCategory of disasterCategories) {
			for (const subDisasterCategory of disasterCategory.subDisasterCategories) {
				for (const sopData of subDisasterCategory.sopDatas) {
					SopDataManager.setSectionComponents(sopData);
                }
            }
        }
    }
}