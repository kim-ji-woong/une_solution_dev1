import React, { Component } from 'react';
import SectionGrid from './sectionGrid';
import $ from 'jquery';
import '../../Root/css/resizable.css';
import '../../Root/external/resizable.js';
import CommonResource from '../resource/id';
import SectionGridCell from './sectionGridCell';
import SectionGridDefault from './SectionGridDefault';

import { SectionPanelComponent } from '../../SOPSimulator/styled/sopSimulatorStyled';
import SopManagerResource from '../../SOPManager/resource/id';

class SectionPanel extends Component {
    static COLUMN_HEADER_CELL = "columnHeader";
    static ROW_HEADER_CELL = "rownHeader";

    static COLUMN_MENU_TYPE = 1;
    static ROW_MENU_TYPE = 2;

    static getSectionColumnHeaderID(columnIndex) {
        return "sectionColumnHeader_" + columnIndex;
    }

    static getSectionRowHeaderID(rowIndex) {
        return "sectionRowHeader_" + rowIndex;
    }

    constructor(props) {
        super(props);
        this.props = props;

        this.state = {
            columns: {},
            calcArrow: false,
            showGrid: true,
            prevProps: this.props,
            mode: "edit",
            menuStyle: null,
            updateRender: true
        }

        // this.refToggleBorder = React.createRef();
        this.refPanel = React.createRef();
        this.refFixColumn = React.createRef();
        this.refFixRow = React.createRef();

        this.refAddToLeft = React.createRef();
        this.refDeleteColumn = React.createRef();
        this.refAddToRight = React.createRef();
        this.refAddToUp = React.createRef();
        this.refDeleteRow = React.createRef();
        this.refAddToDown = React.createRef();

        // 실행모드일 경우 그리드 선 제거
        if (this.props.mode === "exec") {
            this.state.mode = this.props.mode;
            this.state.showGrid = false;
        }

        this.selectedFixedCell = null;
    }

    static getDerivedStateFromProps(props, state) {
        if (props === state.prevProps) {
            return state;
        }

        return {
            columns: state.columns,
            calcArrow: false,
            showGrid: state.showGrid,
            prevProps: props,
            updateRender: true
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.updateRender) {
            return true;
        }
        return false;
    }

    componentDidUpdate() {
        if (this.state.menuStyle) {
            const actionStep1st = this.getActionStep(0);
            const actionStep2nd = this.getActionStep(1);
            const actionStep3rd = this.getActionStep(2);
            const actionStep4th = this.getActionStep(3);

            if (!actionStep1st && !actionStep2nd && !actionStep3rd && !actionStep4th) {
                this.setMenuStyle(null, null, null, null, false);
            }
        }
    }

    componentDidMount() {
        const resizableColumnCell = "." + "sectionGridFix" + " ." + "sectionGridColumn" + " ." + "sectionGridCell";
        const resizableRowCell = "." + "sectionGridFix" + " ." + "sectionGridRow" + " ." + "sectionGridCell";
        const sectionPanel = this;

        $(function () {
            $(resizableColumnCell).resizable({
                direction: 'right',
                stop: function () {
                    sectionPanel.setState({ showGrid: sectionPanel.state.showGrid, calcArrow: true, updateRender: true });
                }
            });

            $(resizableRowCell).resizable({
                direction: 'bottom',
                stop: function () {
                    sectionPanel.setState({ showGrid: sectionPanel.state.showGrid, calcArrow: true, updateRender: true });
                }
            });
        });

        // 실행모드일 경우 헤더 안보이게 처리
        if (this.state.mode === "exec") {
            $('.' + "sectionGridFix").css('visibility', 'hidden');
            $('.' + "sectionPanel").css('border', 'none');
        }
        else {
            // 편집기를 위한 팝업메뉴
            this.refPanel.current.addEventListener('contextmenu', (e) => {
                sectionPanel.setContextMenu(e);
                e.preventDefault();
            });
        }

        //마우스 오른쪽 클릭
        /*$('sectionGridCell').on('auxclick', function () {
            if (sectionPanel.selectedFixedCell !== null) {
                sectionPanel.selectedFixedCell.classList.remove('selected');
            }
            //$('.' + sectionStyles.sectionGridCell).removeClass(sectionStyles.selected);
            $(this).addClass('selected');
            sectionPanel.selectedFixedCell = this;
        });*/

        // 다른 곳 클릭했을때 이벤트 발생
        $('#mainSB').click(function (e) {
            if (sectionPanel.selectedFixedCell !== null) {
                sectionPanel.selectedFixedCell.classList.remove('selected');
                sectionPanel.selectedFixedCell = null;
            }
            //$('.' + sectionStyles.sectionGridCell).removeClass(sectionStyles.selected);
            // 여기서 즉시 MenuStyle을 null로 만들면 ContextMenu handler가 동작하지 않는다.
            // 그래서, 0.2초의 delay를 준다.
            if (SectionGridCell.isEditMode(sectionPanel.state.mode)) {
                setTimeout(() => {
                    sectionPanel.setMenuStyle(null, null, null, null, true);
                }, 200);
            }
            //sectionPanel.setMenuStyle(null, null, null, null, true); 
        });
    }


    setContextMenu = (event) => {
        if (event && event.button === 2) {
            if (event.target) {
                const [scrollLeft, scrollTop] = this.getScollPosition(event.target);

                if (this.selectedFixedCell && event.target !== this.selectedFixedCell) {
                    // 팝업메뉴 닫기
                    this.selectedFixedCell.classList.remove('selected');
                    this.selectedFixedCell = null;
                }

                if (event.target.dataset.type === SectionPanel.COLUMN_HEADER_CELL) {
                    const x = event.target.offsetLeft - scrollLeft + event.offsetX + 60;
                    this.setMenuStyle(SectionPanel.COLUMN_MENU_TYPE, event.target, x, event.offsetY, true);
                    return;
                }
                else if (event.target.dataset.type === SectionPanel.ROW_HEADER_CELL) {
                    const y = event.target.offsetTop - scrollTop + event.offsetY + 60;
                    this.setMenuStyle(SectionPanel.ROW_MENU_TYPE, event.target, event.offsetX, y, true);
                    return;
                }
            }
        }

        this.setMenuStyle(null, null, null, null, true);
    }

    getScollPosition(element) {
        const target = element?.parentNode?.parentNode?.parentNode;

        if (target) {
            return [target.scrollLeft, target.scrollTop];
        }

        return [0, 0];
    }

    setMenuStyle(menuType, target, x, y, refresh) {
        let menuStyle = {};

        if (menuType === null) {
            menuStyle = null;
        }
        else {
            menuStyle["type"] = menuType;
            menuStyle["target"] = target;
            menuStyle["style"] = { top: y.toString() + "px", left: x.toString() + "px" };
        }

        if (refresh) {
            this.setState({ menuStyle: menuStyle, updateRender: true });
        }
        else {
            this.setState({ menuStyle: menuStyle, updateRender: false });
        }
    }

    getActionStep(index) {
        if (this.props.sopData == null || this.props.sopData.disaster == null) {
            return null;
        }

        const actionStepCount = this.props.sopData.actionStepDatas.length;
        //const actionStepCount = this.props.sopData.disaster.actionSteps.length;

        if (actionStepCount <= index)
            return null;

        return this.props.sopData.actionStepDatas[index];
        //return this.props.sopData.disaster.actionSteps[index];
    }

    // onClickToggleBorder = () => {
    //     if (this.refToggleBorder.current.classList.contains('isClose')) {
    //         this.refToggleBorder.current.classList.remove('isClose');
    //         this.setState({ showGrid: true, calcArrow: false, menuStyle: null, updateRender: true });
    //     }
    //     else {
    //         this.refToggleBorder.current.classList.add('isClose');
    //         this.setState({ showGrid: false, calcArrow: false, menuStyle: null, updateRender: true });
    //     }
    // }

    onScroll = () => {
        const top = this.refPanel.current.scrollTop;
        const left = this.refPanel.current.scrollLeft;

        // this.refToggleBorder.current.style.transform = "translate(" + left + "px," + top + "px)";
        this.refFixColumn.current.style.transform = "translateY(" + top + "px)";
        this.refFixRow.current.style.transform = "translateX(" + left + "px)";
    }

    onClick = () => {
        this.setMenuStyle(null, null, null, null, true);
    }

    onClickContextMenu = (event) => {
        const dataset = this.state.menuStyle?.target?.dataset;

        if (dataset.key !== null && dataset.key !== undefined) {
            const index = parseInt(dataset.key);

            if (index !== null && index !== undefined) {
                const target = event.target.tagName === "SPAN" ? event.target.parentNode : event.target;

                if (dataset.type === SectionPanel.ROW_HEADER_CELL) {
                    if (target === this.refAddToUp.current) {
                        this.props.onChangeGrid(SopManagerResource.contextMenu.위쪽_행_추가, index);
                    }
                    else if (target === this.refDeleteRow.current) {
                        this.props.onChangeGrid(SopManagerResource.contextMenu.행_삭제, index);
                    }
                    else if (target === this.refAddToDown.current) {
                        this.props.onChangeGrid(SopManagerResource.contextMenu.아래쪽_행_추가, index);
                    }
                }
                else if (dataset.type === SectionPanel.COLUMN_HEADER_CELL) {
                    if (target === this.refAddToLeft.current) {
                        this.props.onChangeGrid(SopManagerResource.contextMenu.왼쪽_열_추가, index);
                    }
                    else if (target === this.refDeleteColumn.current) {
                        this.props.onChangeGrid(SopManagerResource.contextMenu.열_삭제, index);
                    }
                    else if (target === this.refAddToRight.current) {
                        this.props.onChangeGrid(SopManagerResource.contextMenu.오른쪽_열_추가, index);
                    }
                }
            }
        }
    }

    getRowHeaders() {
        const rows = [];
        const rowRefs = [];

        for (let i = 0; i < this.props.rowCount; i++) {
            const refRowHeader = React.createRef();
            const rowHeight = this.getRowHeight(i);
            rows.push(<div ref={refRowHeader} key={"row_" + i} data-type={SectionPanel.ROW_HEADER_CELL} data-key={i} className={"sectionGridCell"} onClick={this.setContextMenu} style={{ height: rowHeight + "px" }}>{i + 1}</div>);
            rowRefs.push(refRowHeader);
        }

        return [rows, rowRefs];
    }

    getRowHeight(rowIndex) {
        const defaultHeight = 200;

        if (!this.props.sopData || !this.props.sopData.currentActionStep) {
            return defaultHeight;
        }

        const actionStep = this.props.sopData.currentActionStep;

        if (!actionStep.stepMemberDatas || actionStep.stepMemberDatas.length === 0) {
            return defaultHeight;
        }

        const stepMemberData = actionStep.stepMemberDatas[0];

        if (rowIndex >= stepMemberData.gridRowHeight.length) {
            return defaultHeight;
        }

        return stepMemberData.gridRowHeight[rowIndex];
    }

    getColumnName(index) {
        const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        const arrCount = arr.length;

        if (index < arrCount) {
            return arr[index];
        }

        const index1 = parseInt(index / arrCount) - 1;
        const index2 = index % arrCount;
        return arr[index1] + arr[index2];
    }

    getColumnHeaders() {
        const columns = [];
        const columnRefs = [];

        for (let i = 0; i < this.props.columnCount; i++) {
            const refColumnHeader = React.createRef();
            const columnWidth = this.getColumnWidth(i);
            columns.push(<div ref={refColumnHeader} key={"column_" + i} data-type={SectionPanel.COLUMN_HEADER_CELL} data-key={i} id={SectionPanel.getSectionColumnHeaderID(i)} className={"sectionGridCell"} onClick={this.setContextMenu} style={{ width: columnWidth + "px" }}>{this.getColumnName(i)}</div>);
            columnRefs.push(refColumnHeader);
        }

        return [columns, columnRefs];
    }

    getColumnWidth(columnIndex) {
        const defaultWidth = 300;

        if (!this.props.sopData || !this.props.sopData.currentActionStep) {
            return defaultWidth;
        }

        const actionStep = this.props.sopData.currentActionStep;

        if (!actionStep.stepMemberDatas || actionStep.stepMemberDatas.length === 0) {
            return defaultWidth;
        }

        const stepMemberData = actionStep.stepMemberDatas[0];

        if (columnIndex >= stepMemberData.gridColumnWidth.length) {
            return defaultWidth;
        }

        return stepMemberData.gridColumnWidth[columnIndex];
    }

    getContextMenuItems(actionStep1st, actionStep2nd, actionStep3rd, actionStep4th) {
        if (this.state.menuStyle === null) {
            return ["invisible", {}, "invisible", {}, null];
        }

        if (actionStep1st) {
            if (this.state.menuStyle.type === SectionPanel.COLUMN_MENU_TYPE) {
                return ["visible", this.state.menuStyle.style, "invisible", {}, actionStep1st];
            }
            else if (this.state.menuStyle.type === SectionPanel.ROW_MENU_TYPE) {
                return ["invisible", {}, "visible", this.state.menuStyle.style, actionStep1st];
            }
        }
        else if (actionStep2nd) {
            if (this.state.menuStyle.type === SectionPanel.COLUMN_MENU_TYPE) {
                return ["visible", this.state.menuStyle.style, "invisible", {}, actionStep2nd];
            }
            else if (this.state.menuStyle.type === SectionPanel.ROW_MENU_TYPE) {
                return ["invisible", {}, "visible", this.state.menuStyle.style, actionStep2nd];
            }
        }
        else if (actionStep3rd) {
            if (this.state.menuStyle.type === SectionPanel.COLUMN_MENU_TYPE) {
                return ["visible", this.state.menuStyle.style, "invisible", {}, actionStep3rd];
            }
            else if (this.state.menuStyle.type === SectionPanel.ROW_MENU_TYPE) {
                return ["invisible", {}, "visible", this.state.menuStyle.style, actionStep3rd];
            }
        }
        else if (actionStep4th) {
            if (this.state.menuStyle.type === SectionPanel.COLUMN_MENU_TYPE) {
                return ["visible", this.state.menuStyle.style, "invisible", {}, actionStep4th];
            }
            else if (this.state.menuStyle.type === SectionPanel.ROW_MENU_TYPE) {
                return ["invisible", {}, "visible", this.state.menuStyle.style, actionStep4th];
            }
        }

        return ["invisible", {}, "invisible", {}, null];
    }


    render() {
        const actionStep1st = this.getActionStep(0);
        const actionStep2nd = this.getActionStep(1);
        const actionStep3rd = this.getActionStep(2);
        const actionStep4th = this.getActionStep(3);

        const [rowHeaders, rowRefs] = this.getRowHeaders();
        const [columnHeaders, columnRefs] = this.getColumnHeaders();

        const [columnMenuID, columnMenuStyle, rowMenuID, rowMenuStyle, currentActionStep] = this.getContextMenuItems(actionStep1st, actionStep2nd, actionStep3rd, actionStep4th);
        const emptyGrid = actionStep1st === null && actionStep2nd === null && actionStep3rd === null && actionStep4th === null;

        return (
            <SectionPanelComponent ref={this.refPanel} className={"sectionPanel"} onScroll={this.onScroll} onClick={this.onClick}>
                <div className={"sectionGridFix"}>
                    {/* <button ref={this.refToggleBorder} className={"btnToggleBorder"} onClick={this.onClickToggleBorder}></button> */}
                    <div ref={this.refFixRow} className={"sectionGridRow"}>
                        {
                            rowHeaders
                        }
                    </div>
                    <div ref={this.refFixColumn} className={"sectionGridColumn"}>
                        { 
                            columnHeaders
                        }
                    </div>
                </div>
                <SectionGrid currentMenu={this.props.currentMenu} onSelectComponent={this.props.onSelectComponent} onSelectArrow={this.props.onSelectArrow} onAddComponent={this.props.onAddComponent} onRemoveComponent={this.props.onRemoveComponent} sopData={this.props.sopData} selectedSectionData={this.props.selectedSectionData} selectedArrowData={this.props.selectedArrowData} editDatas={this.props.editDatas} onProcessEdit={this.props.onProcessEdit} actionStep={actionStep1st} rowCount={this.props.rowCount} columnCount={this.props.columnCount} showGrid={this.state.showGrid} calcArrow={this.state.calcArrow} columnRefs={columnRefs} rowRefs={rowRefs} mode={this.state.mode} onSelectedCells={this.props.onSelectedCells} showConfirmDialog={this.props.showConfirmDialog} />
                <SectionGrid currentMenu={this.props.currentMenu} onSelectComponent={this.props.onSelectComponent} onSelectArrow={this.props.onSelectArrow} onAddComponent={this.props.onAddComponent} onRemoveComponent={this.props.onRemoveComponent} sopData={this.props.sopData} selectedSectionData={this.props.selectedSectionData} selectedArrowData={this.props.selectedArrowData} editDatas={this.props.editDatas} onProcessEdit={this.props.onProcessEdit} actionStep={actionStep2nd} rowCount={this.props.rowCount} columnCount={this.props.columnCount} showGrid={this.state.showGrid} calcArrow={this.state.calcArrow} columnRefs={columnRefs} rowRefs={rowRefs} mode={this.state.mode} onSelectedCells={this.props.onSelectedCells} showConfirmDialog={this.props.showConfirmDialog} />
                <SectionGrid currentMenu={this.props.currentMenu} onSelectComponent={this.props.onSelectComponent} onSelectArrow={this.props.onSelectArrow} onAddComponent={this.props.onAddComponent} onRemoveComponent={this.props.onRemoveComponent} sopData={this.props.sopData} selectedSectionData={this.props.selectedSectionData} selectedArrowData={this.props.selectedArrowData} editDatas={this.props.editDatas} onProcessEdit={this.props.onProcessEdit} actionStep={actionStep3rd} rowCount={this.props.rowCount} columnCount={this.props.columnCount} showGrid={this.state.showGrid} calcArrow={this.state.calcArrow} columnRefs={columnRefs} rowRefs={rowRefs} mode={this.state.mode} onSelectedCells={this.props.onSelectedCells} showConfirmDialog={this.props.showConfirmDialog} />
                <SectionGrid currentMenu={this.props.currentMenu} onSelectComponent={this.props.onSelectComponent} onSelectArrow={this.props.onSelectArrow} onAddComponent={this.props.onAddComponent} onRemoveComponent={this.props.onRemoveComponent} sopData={this.props.sopData} selectedSectionData={this.props.selectedSectionData} selectedArrowData={this.props.selectedArrowData} editDatas={this.props.editDatas} onProcessEdit={this.props.onProcessEdit} actionStep={actionStep4th} rowCount={this.props.rowCount} columnCount={this.props.columnCount} showGrid={this.state.showGrid} calcArrow={this.state.calcArrow} columnRefs={columnRefs} rowRefs={rowRefs} mode={this.state.mode} onSelectedCells={this.props.onSelectedCells} showConfirmDialog={this.props.showConfirmDialog} />
                {
                    emptyGrid &&
                    <SectionGridDefault content={this.props.content} />
                }
                <div id={columnMenuID} className={"staticContextMenu" + " " + "row3"} style={columnMenuStyle}>
                    <div id={"stopDrag"} className={"menuBody"}>
                        <ul>
                            <li ref={this.refAddToLeft} onClick={this.onClickContextMenu}><span>{CommonResource.ID.contextMenu.columns.addToLeft}</span></li>
                            <li ref={this.refDeleteColumn} onClick={this.onClickContextMenu}><span>{CommonResource.ID.contextMenu.columns.delete}</span></li>
                            <li ref={this.refAddToRight} onClick={this.onClickContextMenu}><span>{CommonResource.ID.contextMenu.columns.addToRight}</span></li>
                        </ul>
                    </div>
                </div>
                <div id={rowMenuID} className={"staticContextMenu" + " " + "row3"} style={rowMenuStyle}>
                    <div id={"stopDrag"} className={"menuBody"}>
                        <ul>
                            <li ref={this.refAddToUp} onClick={this.onClickContextMenu}><span>{CommonResource.ID.contextMenu.rows.addToUp}</span></li>
                            <li ref={this.refDeleteRow} onClick={this.onClickContextMenu}><span>{CommonResource.ID.contextMenu.rows.delete}</span></li>
                            <li ref={this.refAddToDown} onClick={this.onClickContextMenu}><span>{CommonResource.ID.contextMenu.rows.addToDown}</span></li>
                        </ul>
                    </div>
                </div>
            </SectionPanelComponent>
        );
    }
}

export default SectionPanel;