import React, { Component } from 'react';
import SectionGridColumn from './sectionGridColumn';
import Svg from './components/svg';
import Arrow from './components/arrow';
import Vertex2D from '../util/Vertex2D';
import SopManager from '../../SOPManager/ui/sopManager';
import SopManagerResource from '../../SOPManager/resource/id';
import SopDataManager from '../../SOPManager/services/sopDataManager';
import ClipboardManager from '../../SOPManager/services/ClipboardManager';
import ProjectResource from '../../Root/resource/id';

import { SectionGridComponent } from '../../SOPSimulator/styled/sectionGridStyled';

class SectionGrid extends Component {
    constructor(props) {
        super(props);
        this.props = props;

        this.state =
        {
            selectedCells: {},
            lastSelectedCell: [],
            currentArrow: null,
            calcArrow: this.props.calcArrow,
            drawingAreaRect: false,
            instance: this,
            //resetArrows: false,
            prevProps: this.props
        };

        this.onChangeArrow = null;
        this.onDrawAreaRect = null;
        //this.onRemove = null;
        this.gridPosX = 0;
        this.gridPosY = 0;//-100000

        this.refGrid = React.createRef();
        this.cellDatas = {};

        // 마우스 왼쪽버튼 Down 좌표
        this.vLButtonDown = null;
        this.lButtonDownCellColumnIndex = null;
        this.lButtonDownCellRowIndex = null;
    }

    // Cell 크기 변경후에 화살표 좌표를 다시 계산해야 하는데
    // render() 함수 호출이 끝나야만 cell의 크기가 변경된다.
    // 따라서, render() 함수 호출 이후에 화살표 좌표를 새로 계산한다.
    componentDidMount() {
        if (this.state.calcArrow && this.isActiveActionStep()) {
            this.calcArrow(this.props.sopData);
        }

        SectionGrid.checkArrow(this.props, this);
        this.processEditDatas(this.props, this.state.selectedCells);
    }

    // Cell 크기 변경후에 화살표 좌표를 다시 계산해야 하는데
    // render() 함수 호출이 끝나야만 cell의 크기가 변경된다.
    // 따라서, render() 함수 호출 이후에 화살표 좌표를 새로 계산한다.
    componentDidUpdate(prevProps) {
        if (this.state.calcArrow && this.isActiveActionStep()) {
            this.calcArrow(this.props.sopData);
        }

        SectionGrid.checkArrow(this.props, this, true);
    }

    static getDerivedStateFromProps(props, state) {
        if (props === state.prevProps) {
            return state;
        }

        SectionGrid.checkArrow(props, state.instance, false);
        state.instance.processEditDatas(props, state.selectedCells);

        /*if (state.resetArrows) {
            if (state.instance?.refGrid?.current) {
                SectionGrid.checkArrow(props, state.instance);
            }
            else {
                resetArrows = true;
            }
        }*/

        return {
            selectedCells: state.selectedCells,
            lastSelectedCell: state.lastSelectedCell,
            currentArrow: state.currentArrow,
            calcArrow: props.calcArrow,
            drawingAreaRect: state.drawingAreaRect,
            instance: state.instance,
            //resetArrows: resetArrows,
            prevProps: props
        };
    }

    processEditDatas(props, selectedCells) {
        if (SectionGrid._isActiveActionStep(props)) {
            const stepMemberData = SectionGrid._getStepMember(props);

            if (props.editDatas.command.length > 0 && stepMemberData) {
                if (props.editDatas.command === SopManagerResource.ID.editMenu.copy) {
                    const sectionCellDatas = ClipboardManager.makeCopyData(stepMemberData, selectedCells);
                    props.onProcessEdit(props.editDatas.command, sectionCellDatas);
                }
                else if (props.editDatas.command === SopManagerResource.ID.editMenu.cut) {
                    const sectionCellDatas = ClipboardManager.makeCutData(stepMemberData, selectedCells);
                    props.onProcessEdit(props.editDatas.command, sectionCellDatas);
                }
                else if (props.editDatas.command === SopManagerResource.ID.editMenu.paste) {
                    // 붙여넣기
                    ClipboardManager.addPasteData(stepMemberData, props.editDatas.sectionCellDatas, selectedCells);
                    props.onProcessEdit(props.editDatas.command, props.editDatas.sectionCellDatas);
                }
                else if (props.editDatas.command === SopManagerResource.ID.editMenu.delete) {
                    if (SectionGrid.removeArrow(props.sopData, props.selectedArrowData) === false) {
                        ClipboardManager.makeCutData(stepMemberData, selectedCells);
                    }

                    if (props.editDatas.command === SopManagerResource.ID.editMenu.cut ||
                        props.editDatas.command === SopManagerResource.ID.editMenu.delete) {
                        // 임시 화살표를 그리는 중이면 삭제한다.
                        this.onClickCell(null);
                    }

                    props.onProcessEdit(props.editDatas.command, null);

                    if (props.editDatas.command === SopManagerResource.ID.editMenu.delete) {
                        // 삭제하면 선택영역도 없앤다.
                        this.setState({ selectedCells: {} })
                    }
                }
            }
        }
    }

    static removeArrow(sopData, arrow) {
        if (!arrow) {
            return false;
        }

        const stepMemberDatas = sopData?.currentActionStep?.stepMemberDatas;

        if (stepMemberDatas && stepMemberDatas.length > 0) {
            const arrows = stepMemberDatas[0].arrows;

            if (arrows) {
                const arrowCount = arrows.length;

                for (let i = 0; i < arrowCount; i++) {
                    const _arrow = arrows[i];

                    if (_arrow == arrow) {
                        arrows.splice(i, 1);
                        return true;
                    }
                }
            }
        }

        return false;
    }

    static checkArrow(props, instance, updateState) {
        const stepMember = SectionGrid._getStepMember(props);

        if (stepMember?.arrows && stepMember.resetArrows) {
            const arrowCount = stepMember.arrows.length;
            let needCheck = false;

            if (stepMember.remakeGrid) {
                stepMember.remakeGrid = false;
                return;
            }

            for (let i = 0; i < arrowCount; i++) {
                const arrow = stepMember.arrows[i];

                if (!arrow.beginCell || !arrow.endCell) {
                    needCheck = true;
                    break;
                }
            }

            if (needCheck) {
                if (instance.refGrid.current) {
                    const childCount = instance.refGrid.current.children.length;
                    const cellDatas = {};

                    for (let i = 0; i < childCount; i++) {
                        const element = instance.refGrid.current.children[i];

                        if (SectionGrid.containsClassName(element, "sectionGridColumn")) {
                            const columnIndex = element.dataset.index;

                            instance.readGridColumn(element, columnIndex, cellDatas);
                        }
                    }

                    if (SectionGrid.checkArrows2(stepMember, cellDatas, instance)) {
                        stepMember.resetArrows = false;

                        // 화살표를 새로 만들었으니 다시 render()를 호출한다.
                        instance.setState({ instance });
                    }
                }
                else {
                    /*if (updateState) {
                        instance.setState({ resetArrows: true });
                    }*/
                    stepMember.resetArrows = true;
                    return;
                }
            }
            else {
                stepMember.resetArrows = false;
            }
        }
    }

    static containsClassName(element, name) {
        const classCount = element.classList.length;

        for (let i = 0; i < classCount; i++) {
            const className = element.classList[i];

            if (className.includes(name)) {
                return true;
            }
        }

        return false;
    }

    readGridColumn(element, columnIndex, cellDatas) {
        const childCount = element.children.length;

        for (let i = 0; i < childCount; i++) {
            const child = element.children[i];

            if (SectionGrid.containsClassName(child, "sectionGridCell")) {
                const rowIndex = child.dataset.index;
                const cellIndex = columnIndex + "_" + rowIndex;

                const cellData = this.readGridCell(child);
                cellDatas[cellIndex] = cellData;
            }
        }
    }

    readGridCell(element) {
        const cellData = {};
        cellData.cell = element;

        const childCount = element.children.length;

        for (let i = 0; i < childCount; i++) {
            const child = element.children[i];

            if (SectionGrid.containsClassName(child, "sectionMark")) {
                continue;
            }

            if (SectionGrid.containsClassName(child, "process") ||
                SectionGrid.containsClassName(child, "endpoint") ||
                SectionGrid.containsClassName(child, "decision") ||
                SectionGrid.containsClassName(child, "annotation") ||
                SectionGrid.containsClassName(child, "internal")) {
                this.readArrowButton(child, cellData);
                break;
            }
            else if (SectionGrid.containsClassName(child, "sectionInternal") ||
                SectionGrid.containsClassName(child, "sectionProcess")) {
                const _cellData = this.readGridCell(child);

                if (_cellData) {
                    _cellData.cell = element;
                }

                return _cellData;
            }
        }

        return cellData;
    }

    readArrowButton(element, cellData) {
        const childCount = element.children.length;

        for (let i = 0; i < childCount; i++) {
            const child = element.children[i];

            if (SectionGrid.containsClassName(child, "btnArrowTop")) {
                cellData[Arrow.Top] = child;
            }
            else if (SectionGrid.containsClassName(child, "btnArrowBottom")) {
                cellData[Arrow.Bottom] = child;
            }
            else if (SectionGrid.containsClassName(child, "btnArrowLeft")) {
                cellData[Arrow.Left] = child;
            }
            else if (SectionGrid.containsClassName(child, "btnArrowRight")) {
                cellData[Arrow.Right] = child;
            }
        }
    }

    /*setCellDatas = (columnIndex, rowIndex, cell, sectionData, arrowButton, arrowButtonPosition) => {
        const cellIndex = columnIndex + "_" + rowIndex;
        const cellDatas = this.cellDatas;

        if (!cellDatas[cellIndex]) {
            cellDatas[cellIndex] = {};
        }

        if (cell) {
            cellDatas[cellIndex].cell = cell;
        }

        if (sectionData) {
            cellDatas[cellIndex].sectionData = sectionData;
        }

        if (arrowButton) {
            cellDatas[cellIndex][arrowButtonPosition] = arrowButton;
        }

        if (columnIndex === this.props.columnCount - 1 && rowIndex === this.props.rowCount - 1) {
            const stepMember = this.getStepMember();
            this.checkArrows(stepMember, cellDatas);
        }

        //console.log(`setCellDatas : ${columnIndex}, ${rowIndex}, ${cell}, ${sectionData}, ${arrowButton}, ${arrowButtonPosition}`);
    }*/

    static checkArrows2(stepMember, cellDatas, instance) {
        if (stepMember && stepMember.arrows) {
            let success = true;
            const arrowCount = stepMember.arrows.length;

            for (let i = 0; i < arrowCount; i++) {
                const arrow = stepMember.arrows[i];

                if (!arrow.beginCell || !arrow.endCell) {
                    const beginArrowDatas = instance.getArrowData(arrow.beginColumnIndex, arrow.beginRowIndex, arrow.beginPosition, cellDatas);
                    const endArrowDatas = instance.getArrowData(arrow.endColumnIndex, arrow.endRowIndex, arrow.endPosition, cellDatas);

                    if (beginArrowDatas[0] && endArrowDatas[0] && beginArrowDatas[1] && endArrowDatas[1]) {
                        const _arrow = Arrow.makeArrow2(beginArrowDatas[0], endArrowDatas[0], beginArrowDatas[1], endArrowDatas[1], stepMember, arrow.beginColumnIndex, arrow.beginRowIndex, arrow.beginPosition, arrow.endColumnIndex, arrow.endRowIndex, arrow.endPosition);
                        _arrow.arrowNo = arrow.arrowNo;
                        _arrow.text = arrow.text;
                        stepMember.arrows[i] = _arrow;
                    }
                    else {
                        success = false;
                    }
                }
            }

            return success;
        }

        return false;
    }

    getArrowData(columnIndex, rowIndex, arrowPosition, cellDatas) {
        const cellIndex = columnIndex + "_" + rowIndex;
        const cellData = cellDatas[cellIndex];

        if (cellData && cellData.cell &&
            cellData[Arrow.Top] &&
            cellData[Arrow.Right] &&
            cellData[Arrow.Bottom] &&
            cellData[Arrow.Left]) {
            return [cellData.cell, cellData[Arrow.getPositionIndex(arrowPosition)]];
        }

        return [null, null];
    }

    calcArrow(sopData) {
        if (!sopData) {
            return;
        }

        if (!sopData.currentActionStep) {
            return;
        }

        let update = false;
        const stepMember = this.getStepMember();

        sopData.currentActionStep.stepMemberDatas.map(stepMemberData => {
            stepMemberData.arrows.map(arrow => {
                arrow.calc(stepMember);
                update = true;
            });
        });

        if (update) {
            this.setState({ calcArrow: false });
        }
    }

    setArrowFunction = (funcChangeArrow, funcDrawAreaRect) => {
        this.onChangeArrow = funcChangeArrow;
        this.onDrawAreaRect = funcDrawAreaRect;
    }

    /*setRemoveFunction = (func) => {
        this.onRemove = func;
    }*/

    getCurrentArrow = () => {
        return this.state.currentArrow;
    }

    clearAreaRect() {
        if (this.onDrawAreaRect) {
            this.onDrawAreaRect(null, null);
            this.setState({ drawingAreaRect: false });
        }
    }

    onAddArrow = (arrowCell, arrowButton, positionType) => {
        if (arrowCell === null && arrowButton === null && positionType === null) {
            if (this.onChangeArrow !== null) {
                this.onChangeArrow(null, null, Svg.RemoveArrow);
            }

            this.clearAreaRect();
            this.setState({ currentArrow: null });
        }
        else if (this.state.currentArrow === null || this.state.currentArrow.getBeginCell() === null) {
            const currentArrow = new Arrow();
            currentArrow.setBeginCell(arrowCell);
            currentArrow.setBeginButton(arrowButton, positionType);

            this.clearAreaRect();
            this.setState({ currentArrow: currentArrow });
            /*this.state.currentArrow = new Arrow();
            this.state.currentArrow.setBeginCell(arrowCell);
            this.state.currentArrow.setBeginButton(arrowButton, positionType);*/
        }
        else {
            if (this.state.currentArrow.getBeginCell() !== arrowCell) {
                this.state.currentArrow.setEndCell(arrowCell);
                this.state.currentArrow.setEndButton(arrowButton, positionType);

                if (this.checkArrowSectionConnections(this.state.currentArrow) === false) {
                    this.props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ["이미 연결되어 있는 컴포넌트입니다."], null, null);
                    this.clearAreaRect();
                    this.setState({ currentArrow: null });
                    return;
                }
                
                if (this.onChangeArrow !== null) {
                    this.onChangeArrow(this.state.currentArrow, null, Svg.AddArrow);
                }

                this.clearAreaRect();
                this.setState({ currentArrow: null });
                //this.state.currentArrow = null;
            }
        }
    }

    // 이미 연결되어 있는 두 Component를 다시 연결하려는 것인지 확인한다.
    checkArrowSectionConnections(currentArrow) {
        const beginColumnIndex = currentArrow.getColumnIndex(true);
        const beginRowIndex = currentArrow.getRowIndex(true);
        const endColumnIndex = currentArrow.getColumnIndex(false);
        const endRowIndex = currentArrow.getRowIndex(false);

        const stepMemberDatas = this.props.sopData?.currentActionStep?.stepMemberDatas;

        if (stepMemberDatas) {
            for (const stepMemberData of stepMemberDatas) {
                for (const arrow of stepMemberData.arrows) {
                    if (arrow.beginCell && arrow.endCell) {
                        const beginColumn = arrow.getColumnIndex(true);
                        const beginRow = arrow.getRowIndex(true);
                        const endColumn = arrow.getColumnIndex(false);
                        const endRow = arrow.getRowIndex(false);

                        if (beginColumn === beginColumnIndex &&
                            beginRow === beginRowIndex &&
                            endColumn === endColumnIndex &&
                            endRow === endRowIndex) {
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }

    onRemoveComponent = (columnIndex, rowIndex) => {
        /*if (this.onRemove !== null) {
            this.onRemove(columnIndex, rowIndex);
        }*/

        const stepMember = SopManager.getStepMember(this.props.actionStep);

        if (stepMember) {
            this.props.onRemoveComponent(columnIndex, rowIndex, this.props.actionStep);
        }

        this.clearAreaRect();
    }

    onSelectComponent = (sectionData, actionStep) => {
        this.props.onSelectComponent(sectionData, actionStep);
        this.clearAreaRect();
    }

    onClickCell = (cell) => {
        if (this.state.currentArrow !== null) {
            // 임시화살표를 그리는 중이었으면 임시 화살표를 없앤다.
            if (this.onChangeArrow !== null) {
                this.onChangeArrow(null, null, Svg.TempArrow);
            }

            this.clearAreaRect();
            this.setState({ currentArrow: null });
        }
    }

    onSelectCell = (columnIndex, rowIndex, withCtrl, withShift) => {
        this._onSelectCell(columnIndex, rowIndex, withCtrl, withShift, this.state.lastSelectedCell);
        /*let selectedCells = {};
        let lastSelectedCell = [];

        if (withShift) {
            if (this.state.lastSelectedCell.length === 2) {
                selectedCells = this.getShiftSelectedCells(columnIndex, rowIndex);
            }
            else {
                selectedCells[columnIndex] = [rowIndex];
            }

            lastSelectedCell = [columnIndex, rowIndex];
        }
        else if (withCtrl) {
            selectedCells = { ...this.state.selectedCells };
            const index = selectedCells[columnIndex]?.indexOf(rowIndex);

            if (index !== undefined && index !== null && index >= 0) {
                selectedCells[columnIndex].splice(index, 1);
            }
            else {
                if (selectedCells[columnIndex]) {
                    selectedCells[columnIndex].push(rowIndex);
                }
                else {
                    selectedCells[columnIndex] = [rowIndex];
                }

                lastSelectedCell = [columnIndex, rowIndex];
            }
        }
        else {
            if (this.state.selectedCells[columnIndex] && this.state.selectedCells[columnIndex].includes(rowIndex)) {
                let count = 0;

                for (let column in this.state.selectedCells) {
                    count += this.state.selectedCells[column].length;

                    if (count > 1) {
                        break;
                    }
                }

                if (count > 1) {
                    // 기존에 선택된 Cell들의 개수가 둘 이상이면 클릭한 Cell을 선택된 상태로 만든다.
                    selectedCells[columnIndex] = [rowIndex];
                    lastSelectedCell = [columnIndex, rowIndex];
                }
            }
            else {
                selectedCells[columnIndex] = [rowIndex];
                lastSelectedCell = [columnIndex, rowIndex];
            }
        }

        if (this.props.sopData.selectedTime) {
            const current = new Date();
            const timeSpan = current - this.props.sopData.selectedTime;

            if (timeSpan > 100) {
                // Component 속성을 비워두게 한다.
                this.props.onSelectComponent(null, this.props.actionStep);
            }
        }

        this.setState({ selectedCells: selectedCells, lastSelectedCell: lastSelectedCell });*/
    }

    // cell2의 값을 cell1에 넣는다.
    unionCells(cells1, cells2) {
        for (const columnIndex in cells2) {
            const rowIndexArray = cells2[columnIndex];

            const trg = cells1[columnIndex];

            if (!trg) {
                cells1[columnIndex] = rowIndexArray;
            }
            else {
                rowIndexArray.forEach((item, index, array) => {
                    if (trg.indexOf(item) < 0) {
                        trg.push(item);
                    }
                });

                trg.sort();
            }
        }
    }

    _onSelectCell(columnIndex, rowIndex, withCtrl, withShift, lastSelectedCellData) {
        let selectedCells = {};
        let lastSelectedCell = [];

        if (withShift) {
            if (lastSelectedCellData.length === 2) {
                selectedCells = this.getShiftSelectedCells(columnIndex, rowIndex, lastSelectedCellData[0], lastSelectedCellData[1]);
            }
            else {
                selectedCells[columnIndex] = [rowIndex];
            }

            if (withCtrl) {
                this.unionCells(selectedCells, this.state.selectedCells);
            }

            lastSelectedCell = [columnIndex, rowIndex];
        }
        else if (withCtrl) {
            selectedCells = { ...this.state.selectedCells };
            const index = selectedCells[columnIndex]?.indexOf(rowIndex);

            if (index !== undefined && index !== null && index >= 0) {
                selectedCells[columnIndex].splice(index, 1);
            }
            else {
                if (selectedCells[columnIndex]) {
                    selectedCells[columnIndex].push(rowIndex);
                }
                else {
                    selectedCells[columnIndex] = [rowIndex];
                }

                lastSelectedCell = [columnIndex, rowIndex];
            }
        }
        else {
            if (this.state.selectedCells[columnIndex] && this.state.selectedCells[columnIndex].includes(rowIndex)) {
                let count = 0;

                for (let column in this.state.selectedCells) {
                    count += this.state.selectedCells[column].length;

                    if (count > 1) {
                        break;
                    }
                }

                if (count > 1) {
                    // 기존에 선택된 Cell들의 개수가 둘 이상이면 클릭한 Cell을 선택된 상태로 만든다.
                    selectedCells[columnIndex] = [rowIndex];
                    lastSelectedCell = [columnIndex, rowIndex];
                }
            }
            else {
                selectedCells[columnIndex] = [rowIndex];
                lastSelectedCell = [columnIndex, rowIndex];
            }
        }

        if (this.props.sopData.selectedTime) {
            const current = new Date();
            const timeSpan = current - this.props.sopData.selectedTime;

            if (timeSpan > 100) {
                // Component 속성을 비워두게 한다.
                this.props.onSelectComponent(null, this.props.actionStep);
            }
        }

        this.onSelectCells(selectedCells);
        this.setState({ selectedCells: selectedCells, lastSelectedCell: lastSelectedCell });
    }

    onSelectCells(cells) {
        if (this.props.onSelectedCells) {
            this.props.onSelectedCells(cells);
        }
    }

    getShiftSelectedCells(endColumnIndex, endRowIndex, beginColumnIndex, beginRowIndex) {
        /*const beginColumnIndex = this.state.lastSelectedCell[0];
        const beginRowIndex = this.state.lastSelectedCell[1];*/
        
        if (beginColumnIndex === endColumnIndex && beginRowIndex === endRowIndex) {
            return {};
        }
        else {
            if (beginColumnIndex < endColumnIndex) {
                if (beginRowIndex < endRowIndex) {
                    return this._getShiftSelectedCells(beginColumnIndex, beginRowIndex, endColumnIndex, endRowIndex);
                }
                else {
                    return this._getShiftSelectedCells(beginColumnIndex, endRowIndex, endColumnIndex, beginRowIndex);
                }
            }
            else {
                if (beginRowIndex < endRowIndex) {
                    return this._getShiftSelectedCells(endColumnIndex, beginRowIndex, beginColumnIndex, endRowIndex);
                }
                else {
                    return this._getShiftSelectedCells(endColumnIndex, endRowIndex, beginColumnIndex, beginRowIndex);
                }
            }
        }
    }

    _getShiftSelectedCells(beginColumnIndex, beginRowIndex, endColumnIndex, endRowIndex) {
        const selectedCells = {};

        for (let i = beginColumnIndex; i <= endColumnIndex; i++) {
            selectedCells[i] = [];

            for (let j = beginRowIndex; j <= endRowIndex; j++) {
                selectedCells[i].push(j);
            }
        }

        return selectedCells;
    }

    onMouseMove = (event) => {
        if (this.state.currentArrow !== null && this.onChangeArrow !== null) {
            const vCurrent = this.getMousePosition(event);
            this.onChangeArrow(this.state.currentArrow, vCurrent, Svg.TempArrow);
        }
        else if (this.vLButtonDown && this.onDrawAreaRect) {
            this.setState({ drawingAreaRect: true });

            const vCurrent = this.getMousePosition(event);
            this.onDrawAreaRect(this.vLButtonDown, vCurrent);
        }
    }

    getMousePosition(e) {
        let x = 0;
        let y = 0;

        if (e == null) {
            e = window.event;
        }

        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        }
        else if (e.clientX || e.clientY) {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        const rect = this.refGrid.current.getBoundingClientRect();
        return new Vertex2D(x - rect.x, y - rect.y);

        /*if (this.gridPosY === -100000) {
            const grid = document.querySelector('.sectionGrid');

            if (grid != null) {
                this.gridPosX = grid.offsetLeft;
                this.gridPosY = grid.offsetTop;
            }
        }

        return new Vertex2D(x - this.gridPosX, y - this.gridPosY);*/
    }

    isActiveActionStep() {
        if (!this.props.actionStep || !this.props.actionStep.actionStep || !this.props.sopData) {
            return false;
        }

        if (!this.props.actionStep.stepMemberDatas) {
            return false;
        }

        return this.props.actionStep === this.props.sopData.currentActionStep;
    }

    static _isActiveActionStep(props) {
        if (!props.actionStep || !props.actionStep.actionStep || !props.sopData) {
            return false;
        }

        if (!props.actionStep.stepMemberDatas) {
            return false;
        }

        return props.actionStep === props.sopData.currentActionStep;
    }

    getStepMember() {
        return SectionGrid._getStepMember(this.props);
    }

    static _getStepMember(props) {
        const stepMemberData = props.actionStep && props.actionStep.stepMemberDatas && props.actionStep.stepMemberDatas.length > 0 ? props.actionStep.stepMemberDatas[0] : null;

        if (stepMemberData && !stepMemberData.grid) {
            stepMemberData.grid = {
                columns: [],
                rows: []
            }
        }

        return stepMemberData;
    }

    setLButtonDownPosition = (vPos1/*: Vertex2D*/, vPos2/*: Vertex2D*/, columnIndex, rowIndex, withCtrl) => {
        if (this.props.mode === 'exec') {
            return false;
        }

        const prevColumnIndex = this.lButtonDownCellColumnIndex;
        const prevRowIndex = this.lButtonDownCellRowIndex;

        if (vPos1 && vPos2 && this.vLButtonDown && (this.vLButtonDown.x !== vPos1.x || this.vLButtonDown.y !== vPos1.y) &&
            columnIndex !== null && rowIndex !== null && prevColumnIndex !== null && prevRowIndex !== null) {
            // 마우스 Drag 하는 도중 Scroll 하였을 경우...
            // 이때는 MouseDown이지만 MouseUp과 같은 처리를 한다.
            this.vLButtonDown = null;
            this.lButtonDownCellColumnIndex = null;
            this.lButtonDownCellRowIndex = null;

            this._onSelectCell(columnIndex, rowIndex, withCtrl, true, [prevColumnIndex, prevRowIndex]);
            this.clearAreaRect();
            return true;
        }

        const distance = this.vLButtonDown && vPos2 ? this.vLButtonDown.getDistance(vPos2) : 0;

        this.vLButtonDown = vPos1;
        this.lButtonDownCellColumnIndex = columnIndex;
        this.lButtonDownCellRowIndex = rowIndex;

        if (!vPos1 && columnIndex !== null && rowIndex !== null && prevColumnIndex !== null && prevRowIndex !== null) {
            if (distance > 1) {
                // onClickCell()에서 처리될 예정이다.
                // 중복으로 처리되면 ctrlKey와 shiftKey 선택이 동작하지 않는다.
                this._onSelectCell(columnIndex, rowIndex, withCtrl, true, [prevColumnIndex, prevRowIndex]);
            }

            this.clearAreaRect();
        }

        return false;
    }

    getLButtonDownPosition = ()/*: Vertex2D*/ => {
        return this.vLButtonDown;
    }

    onSelectArrow = (arrow, actionStep) => {
        this.onSelectCells({});
        this.setState({ selectedCells: {}, lastSelectedCell: [] });
        this.props.onSelectArrow(arrow, actionStep);
    }

    render() {
        if (this.isActiveActionStep() === false) {
            return <></>
        }

        const stepMember = this.getStepMember();//this.props.actionStep && this.props.actionStep.stepMemberDatas && this.props.actionStep.stepMemberDatas.length > 0 ? this.props.actionStep.stepMemberDatas[0] : null;
        const columns = [];
        const gridAddName = this.props.showGrid ? "" : " " + 'disableBorder';

        for (let i = 0; i < this.props.columnCount; i++) {
            columns.push(<SectionGridColumn key={"sectionColumn_" + i}
                index={i}
                rowCount={this.props.rowCount}
                currentMenu={this.props.currentMenu}
                onClickArrowButton={this.onAddArrow}
                getCurrentArrow={this.getCurrentArrow}
                onClickCell={this.onClickCell}
                selectedCells={this.state.selectedCells}
                onSelectCell={this.onSelectCell}
                onRemoveComponent={this.onRemoveComponent}
                onSelectComponent={this.onSelectComponent}
                onSelectArrow={this.onSelectArrow}
                onAddComponent={this.props.onAddComponent}
                onProcessEdit={this.props.onProcessEdit}
                setLButtonDownPosition={this.setLButtonDownPosition}
                getLButtonDownPosition={this.getLButtonDownPosition}
                sopData={this.props.sopData}
                selectedSectionData={this.props.selectedSectionData}
                actionStep={this.props.actionStep}
                stepMemberData={stepMember}
                columnRef={this.props.columnRefs[i]}
                rowRefs={this.props.rowRefs}
                mode={this.props.mode}
                drawingAreaRect={this.state.drawingAreaRect}
            />);
        }

        return (
            <SectionGridComponent ref={this.refGrid} className={'_sectionGrid_' + gridAddName}
                onMouseMove={this.onMouseMove}>
                <Svg stepMember={stepMember} selectedArrowData={this.props.selectedArrowData} setChangeArrowFunction={this.setArrowFunction} mode={this.props.mode} />
                {columns}
            </SectionGridComponent>
        );
    }
}

export default SectionGrid;