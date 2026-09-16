import SectionData from "../../Common/models/sections/sectionData";
import SectionDataAnnotation from "../../Common/models/sections/sectionDataAnnotation";
import SectionDataDecision from "../../Common/models/sections/sectionDataDecision";
import SectionDataEndpoint from "../../Common/models/sections/sectionDataEndpoint";
import SectionDataInternal from "../../Common/models/sections/sectionDataInternal";
import SectionDataProcess from "../../Common/models/sections/sectionDataProcess";
import Arrow from "../../Common/sections/components/arrow";
import SopDataManager from "./sopDataManager";

export default class ClipboardManager {
	static makeCopyData(stepMemberData, selectedCells) {
		const sectionCellDatas = {};
		const cells = new Map();

		let minColumnIndex = -1;
		let minRowIndex = -1;
		const columns = [];
		
		for (let columnIndex in selectedCells) {
			const column = parseInt(columnIndex);

			sectionCellDatas[columnIndex] = [];
			const cellCount = selectedCells[columnIndex].length;

			if (minColumnIndex < 0 || minColumnIndex > column) {
				minColumnIndex = column;
			}

			columns.push(column);

			for (let i = 0; i < cellCount; i++) {
				const rowIndex = selectedCells[columnIndex][i];
				const section = SopDataManager.getSectionData(stepMemberData, column, rowIndex);
				sectionCellDatas[columnIndex].push([rowIndex, section]);

				const key = ((column << 16) | (rowIndex));
				cells.set(key, true);

				if (minRowIndex < 0 || minRowIndex > rowIndex) {
					minRowIndex = rowIndex;
				}
			}
		}

		sectionCellDatas.minColumnIndex = minColumnIndex;
		sectionCellDatas.minRowIndex = minRowIndex;
		sectionCellDatas.columns = columns;
		sectionCellDatas.arrowDatas = [];

		const arrowCount = stepMemberData.arrows.length;

		for (let i = 0; i < arrowCount; i++) {
			const arrow = stepMemberData.arrows[i];
			const [beginColumnIndex, beginRowIndex, endColumnIndex, endRowIndex, beginPosition, endPosition, text] = arrow.getArrowInfo();

			if (beginColumnIndex === null || beginRowIndex === null ||
				endColumnIndex === null || endRowIndex === null ||
				beginPosition === Arrow.None || endPosition === Arrow.None) {
				continue;
			}

			const beginKey = ((beginColumnIndex << 16) | (beginRowIndex));
			const endKey = ((endColumnIndex << 16) | (endRowIndex));

			if (cells.get(beginKey) && cells.get(endKey)) {
				sectionCellDatas.arrowDatas.push([beginKey, beginPosition, endKey, endPosition, text]);
			}
		}

		return sectionCellDatas;
	}

	static makeCutData(stepMemberData, selectedCells) {
		const sectionCellDatas = ClipboardManager.makeCopyData(stepMemberData, selectedCells);

		for (let columnIndex in selectedCells) {
			const column = parseInt(columnIndex);
			const cellCount = selectedCells[columnIndex].length;

			for (let i = 0; i < cellCount; i++) {
				const rowIndex = selectedCells[columnIndex][i];
				const [sectionData, index] = SopDataManager.getSectionDataWithIndex(stepMemberData, column, rowIndex);

				if (sectionData && index >= 0) {
					sectionData.removed = true;
					stepMemberData.sections.splice(index, 1);
					ClipboardManager.removeArrows(column, rowIndex, stepMemberData);
                }
			}
		}

		return sectionCellDatas;
	}

	static addPasteData(stepMemberData, sectionCellDatas, selectedCells) {
		if (!stepMemberData || !sectionCellDatas) {
			return;
		}

		let minColumnIndex = -1;
		let minRowIndex = -1;

		for (let columnIndex in selectedCells) {
			const column = parseInt(columnIndex);

			if (minColumnIndex < 0 || minColumnIndex > column) {
				minColumnIndex = column;
			}

			const cellCount = selectedCells[columnIndex].length;

			for (let i = 0; i < cellCount; i++) {
				const rowIndex = selectedCells[columnIndex][i];

				if (minRowIndex < 0 || minRowIndex > rowIndex) {
					minRowIndex = rowIndex;
                }
			}
		}

		if (minColumnIndex < 0 || minRowIndex < 0) {
			return;
		}

		const columnCount = sectionCellDatas.columns.length;

		for (let i = 0; i < columnCount; i++) {
			const columnIndex = sectionCellDatas.columns[i];
			const cellCount = sectionCellDatas[columnIndex.toString()].length;

			for (let j = 0; j < cellCount; j++) {
				const [rowIndex, section] = sectionCellDatas[columnIndex.toString()][j];
				ClipboardManager.setPasteData(stepMemberData, minColumnIndex, minRowIndex, columnIndex - sectionCellDatas.minColumnIndex, rowIndex - sectionCellDatas.minRowIndex, section);
            }
		}

		const arrowCount = sectionCellDatas.arrowDatas.length;

		for (let i = 0; i < arrowCount; i++) {
			const [beginKey, beginPosition, endKey, endPosition, text] = sectionCellDatas.arrowDatas[i];
			const beginColumnIndex = (beginKey >> 16);
			const beginRowIndex = (beginKey & 0xffff);
			const endColumnIndex = (endKey >> 16);
			const endRowIndex = (endKey & 0xffff);

			ClipboardManager.setArrow(stepMemberData, minColumnIndex + beginColumnIndex - sectionCellDatas.minColumnIndex, minRowIndex + beginRowIndex - sectionCellDatas.minRowIndex, minColumnIndex + endColumnIndex - sectionCellDatas.minColumnIndex, minRowIndex + endRowIndex - sectionCellDatas.minRowIndex, beginPosition, endPosition, text);
			stepMemberData.resetArrows = true;
        }
	}

	static setArrow(stepMemberData, beginColumnIndex, beginRowIndex, endColumnIndex, endRowIndex, beginPosition, endPosition, text) {
		const arrow = new Arrow();

		arrow.beginComponentColumnIndex = beginColumnIndex;
		arrow.beginComponentRowIndex = beginRowIndex;
		arrow.beginComponentPosition = beginPosition;
		arrow.endComponentColumnIndex = endColumnIndex;
		arrow.endComponentRowIndex = endRowIndex;
		arrow.endComponentPosition = endPosition;
		arrow.text = text;

		stepMemberData.arrows.push(arrow);
    }

	static setPasteData(stepMemberData, beginColumnIndex, beginRowIndex, columnIndex, rowIndex, section) {
		if (beginColumnIndex < 0 || beginRowIndex < 0 ||
			columnIndex < 0 || rowIndex < 0) {
			return;
		}

		const column = beginColumnIndex + columnIndex;
		const row = beginRowIndex + rowIndex;
		const [sectionData, index] = SopDataManager.getSectionDataWithIndex(stepMemberData, column, row);

		if (sectionData && index >= 0) {
			stepMemberData.sections.splice(index, 1);
			ClipboardManager.removeArrows(column, row, stepMemberData);
		}

		if (section) {
			const newSection = ClipboardManager.cloneSection(section, column, row);

			if (newSection) {
				stepMemberData.sections.push(newSection);
			}
        }
	}

	static cloneSection(section, columnIndex, rowIndex) {
		let sectionData = null;

		if (section.componentType === SectionDataProcess.getComponentType() || section.componentType === SectionData.ProcessType) {
			sectionData = new SectionDataProcess();
			SectionDataProcess.copyTo(section, sectionData);
		}
		else if (section.componentType === SectionDataDecision.getComponentType() || section.componentType === SectionData.DecisionType) {
			sectionData = new SectionDataDecision();
			SectionDataDecision.copyTo(section, sectionData);
		}
		else if (section.componentType === SectionDataAnnotation.getComponentType() || section.componentType === SectionData.AnnotationType) {
			sectionData = new SectionDataAnnotation();
			SectionDataAnnotation.copyTo(section, sectionData);
		}
		else if (section.componentType === SectionDataEndpoint.getComponentType() || section.componentType === SectionData.EndpointType) {
			sectionData = new SectionDataEndpoint();
			SectionDataEndpoint.copyTo(section, sectionData);
		}
		else if (section.componentType === SectionDataInternal.getComponentType() || section.componentType === SectionData.InternalType) {
			sectionData = new SectionDataInternal();
			SectionDataInternal.copyTo(section, sectionData);
		}

		if (sectionData) {
			sectionData.gridColumnIndex = columnIndex;
			sectionData.gridRowIndex = rowIndex;
        }

		return sectionData;
    }

	static removeArrows(columnIndex, rowIndex, stepMemberData) {
		const arrowCount = stepMemberData.arrows.length;

		for (let i = arrowCount - 1; i >= 0; i--) {
			const arrow = stepMemberData.arrows[i];

			if ((arrow.getColumnIndex(true) === columnIndex && arrow.getRowIndex(true) === rowIndex) ||
				(arrow.getColumnIndex(false) === columnIndex && arrow.getRowIndex(false) === rowIndex)) {
				stepMemberData.arrows.splice(i, 1);
			}
		}
	}
}
