import React, { useState, useEffect, useRef } from 'react';
import SectionGrid from './sectionGrid';
import $ from 'jquery';
import '../../Root/css/resizable.css';
import '../../Root/external/resizable.js';
import CommonResource from '../resource/id';
import SectionGridCell from './sectionGridCell';
import SectionGridDefault from './SectionGridDefault';

import { SectionPanelComponent } from '../../SOPSimulator/styled/sopSimulatorStyled.js';

function SectionPanel(props) {
    const [columns, setColumns] = useState({});
    const [calcArrow, setCalcArrow] = useState(false);
    const [showGrid, setShowGrid] = useState(true);
    const [mode, setMode] = useState("edit");
    const [menuStyle, setMenuStyle] = useState(null);
    const [updateRender, setUpdateRender] = useState(true);

    const refToggleBorder = useRef();
    const refPanel = useRef();
    const refFixColumn = useRef();
    const refFixRow = useRef();
    const refAddToLeft = useRef();
    const refDeleteColumn = useRef();
    const refAddToRight = useRef();
    const refAddToUp = useRef();
    const refDeleteRow = useRef();
    const refAddToDown = useRef();

    let selectedFixedCell = null;
    const COLUMN_HEADER_CELL = "columnHeader";
    const ROW_HEADER_CELL = "rownHeader";
    const COLUMN_MENU_TYPE = 1;
    const ROW_MENU_TYPE = 2;


    useEffect(() => {
        const resizableColumnCell = "." + "sectionGridFix" + " ." + "sectionGridColumn" + " ." + "sectionGridCell";
        const resizableRowCell = "." + "sectionGridFix" + " ." + "sectionGridRow" + " ." + "sectionGridCell";

        $(function () {
            $(resizableColumnCell).resizable({
                direction: 'right',
                stop: function () {
                    setShowGrid(showGrid);
                    setCalcArrow(true);
                    setUpdateRender(true);
                }
            });

            $(resizableRowCell).resizable({
                direction: 'bottom',
                stop: function () {
                    setShowGrid(showGrid);
                    setCalcArrow(true);
                    setUpdateRender(true);
                }
            });
        });

        // 실행모드일 경우 헤더 안보이게 처리
        if (props.mode === "exec") {
            $('.' + "sectionGridFix").css('visibility', 'hidden');
            $('.' + "sectionPanel").css('border', 'none');

            setMode(props.mode);
            setShowGrid(false);
        }
        else {
            // 편집기를 위한 팝업메뉴
            refPanel.current.addEventListener('contextmenu', (e) => {
                setContextMenu(e);
                e.preventDefault();
            });
        }

        //마우스 오른쪽 클릭
        $('.' + "sectionGridCell").on('auxclick', function () {
            if (selectedFixedCell !== null) {
                selectedFixedCell.classList.remove('selected');
            }
            //$('.' + sectionStyles.sectionGridCell).removeClass(sectionStyles.selected);
            $(this).addClass('selected');
            selectedFixedCell = this;
        });

        // 다른 곳 클릭했을때 이벤트 발생
        $('#mainSB').click(function (e) {
            if (selectedFixedCell !== null) {
                selectedFixedCell.classList.remove('selected');
                selectedFixedCell = null;
            }
            //$('.' + sectionStyles.sectionGridCell).removeClass(sectionStyles.selected);
            // 여기서 즉시 MenuStyle을 null로 만들면 ContextMenu handler가 동작하지 않는다.
            // 그래서, 0.2초의 delay를 준다.
            if (SectionGridCell.isEditMode(state.mode)) {
                setTimeout(() => {
                    handleMenuStyle(null, null, null, null, true);
                }, 200);
            }
        });
    }, [])

    // 실행모드일 경우 그리드 선 제거
    useEffect(() => {
        if (props.mode === "exec") {
            setMode(props.mode);
            setShowGrid(false);
        }
    }, [props.mode]);

    useEffect(() => {
        if (menuStyle) {
            const actionStep1st = getActionStep(0);
            const actionStep2nd = getActionStep(1);
            const actionStep3rd = getActionStep(2);
            const actionStep4th = getActionStep(3);

            if (!actionStep1st && !actionStep2nd && !actionStep3rd && !actionStep4th) {
                handleMenuStyle(null, null, null, null, false);
            }
        }
    });

    const getSectionColumnHeaderID = (columnIndex) => {
        return "sectionColumnHeader_" + columnIndex;
    };

    const getSectionRowHeaderID = (rowIndex) => {
        return "sectionRowHeader_" + rowIndex;
    };

    const setContextMenu = (event) => {
        if (event && event.button === 2) {
            if (event.target) {
                const [scrollLeft, scrollTop] = getScollPosition(event.target);

                if (selectedFixedCell && event.target !== selectedFixedCell) {
                    // 팝업메뉴 닫기
                    selectedFixedCell.classList.remove('selected');
                    selectedFixedCell = null;
                }

                if (event.target.dataset.type === COLUMN_HEADER_CELL) {
                    const x = event.target.offsetLeft - scrollLeft + event.offsetX + 60;
                    handleMenuStyle(COLUMN_MENU_TYPE, event.target, x, event.offsetY, true);
                    return;
                }
                else if (event.target.dataset.type === ROW_HEADER_CELL) {
                    const y = event.target.offsetTop - scrollTop + event.offsetY + 60;
                    handleMenuStyle(ROW_MENU_TYPE, event.target, event.offsetX, y, true);
                    return;
                }
            }
        }

        handleMenuStyle(null, null, null, null, true);
    }

    const getScollPosition = (element) => {
        const target = element?.parentNode?.parentNode?.parentNode;

        if (target) {
            return [target.scrollLeft, target.scrollTop];
        }

        return [0, 0];
    }

    const handleMenuStyle = (menuType, target, x, y, refresh) => {
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
            setMenuStyle(menuStyle);
            setUpdateRender(true);
        }
        else {
            setMenuStyle(menuStyle);
            setUpdateRender(false);
        }
    }

    const getActionStep = (index) => {
        if (props.sopData == null || props.sopData.disaster == null) {
            return null;
        }

        const actionStepCount = props.sopData.actionStepDatas.length;
        //const actionStepCount = props.sopData.disaster.actionSteps.length;

        if (actionStepCount <= index)
            return null;

        return props.sopData.actionStepDatas[index];
        //return props.sopData.disaster.actionSteps[index];
    }

    const onClickToggleBorder = () => {
        if (refToggleBorder.current.classList.contains('isClose')) {
            refToggleBorder.current.classList.remove('isClose');
            setShowGrid(true);
            setCalcArrow(false);
            setMenuStyle(null);
            setUpdateRender(true);
        }
        else {
            refToggleBorder.current.classList.add('isClose');
            setShowGrid(false);
            setCalcArrow(false);
            setMenuStyle(null);
            setUpdateRender(true);
        }
    }

    const onScroll = () => {
        const top = refPanel.current.scrollTop;
        const left = refPanel.current.scrollLeft;

        // refToggleBorder.current.style.transform = "translate(" + left + "px," + top + "px)";
        refFixColumn.current.style.transform = "translateY(" + top + "px)";
        refFixRow.current.style.transform = "translateX(" + left + "px)";
    }

    const onClick = () => {
        handleMenuStyle(null, null, null, null, true);
    }

    const onClickContextMenu = (event) => {
        const dataset = menuStyle?.target?.dataset;

        if (dataset.key !== null && dataset.key !== undefined) {
            const index = parseInt(dataset.key);

            if (index !== null && index !== undefined) {
                const target = event.target.tagName === "SPAN" ? event.target.parentNode : event.target;

                if (dataset.type === ROW_HEADER_CELL) {
                    if (target === refAddToUp.current) {
                        props.onChangeGrid(CommonResource.ID.contextMenu.rows.addToUp, index);
                    }
                    else if (target === refDeleteRow.current) {
                        props.onChangeGrid(CommonResource.ID.contextMenu.rows.delete, index);
                    }
                    else if (target === refAddToDown.current) {
                        props.onChangeGrid(CommonResource.ID.contextMenu.rows.addToDown, index);
                    }
                }
                else if (dataset.type === COLUMN_HEADER_CELL) {
                    if (target === refAddToLeft.current) {
                        props.onChangeGrid(CommonResource.ID.contextMenu.columns.addToLeft, index);
                    }
                    else if (target === refDeleteColumn.current) {
                        props.onChangeGrid(CommonResource.ID.contextMenu.columns.delete, index);
                    }
                    else if (target === refAddToRight.current) {
                        props.onChangeGrid(CommonResource.ID.contextMenu.columns.addToRight, index);
                    }
                }
            }
        }
    }

    const getRowHeaders = () => {
        const rows = [];
        const rowRefs = [];

        for (let i = 0; i < props.rowCount; i++) {
            const refRowHeader = React.createRef();
            const rowHeight = getRowHeight(i);
            rows.push(<div ref={refRowHeader} key={"row_" + i} data-type={ROW_HEADER_CELL} data-key={i} className={"sectionGridCell"} onClick={setContextMenu} style={{ height: rowHeight + "px" }}>{i + 1}</div>);
            rowRefs.push(refRowHeader);
        }

        return [rows, rowRefs];
    }

    const getRowHeight = (rowIndex) => {
        const defaultHeight = 200;

        if (!props.sopData || !props.sopData.currentActionStep) {
            return defaultHeight;
        }

        const actionStep = props.sopData.currentActionStep;

        if (!actionStep.stepMemberDatas || actionStep.stepMemberDatas.length === 0) {
            return defaultHeight;
        }

        const stepMemberData = actionStep.stepMemberDatas[0];

        if (rowIndex >= stepMemberData.gridRowHeight.length) {
            return defaultHeight;
        }

        return stepMemberData.gridRowHeight[rowIndex];
    }

    const getColumnName = (index) => {
        const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        const arrCount = arr.length;

        if (index < arrCount) {
            return arr[index];
        }

        const index1 = parseInt(index / arrCount) - 1;
        const index2 = index % arrCount;
        return arr[index1] + arr[index2];
    }

    const getColumnHeaders = () => {
        const columns = [];
        const columnRefs = [];

        for (let i = 0; i < props.columnCount; i++) {
            const refColumnHeader = React.createRef();
            const columnWidth = getColumnWidth(i);
            columns.push(<div ref={refColumnHeader} key={"column_" + i} data-type={COLUMN_HEADER_CELL} data-key={i} id={getSectionColumnHeaderID(i)} className={"sectionGridCell"} onClick={setContextMenu} style={{ width: columnWidth + "px" }}>{getColumnName(i)}</div>);
            columnRefs.push(refColumnHeader);
        }

        return [columns, columnRefs];
    }

    const getColumnWidth = (columnIndex) => {
        const defaultWidth = 300;

        if (!props.sopData || !props.sopData.currentActionStep) {
            return defaultWidth;
        }

        const actionStep = props.sopData.currentActionStep;

        if (!actionStep.stepMemberDatas || actionStep.stepMemberDatas.length === 0) {
            return defaultWidth;
        }

        const stepMemberData = actionStep.stepMemberDatas[0];

        if (columnIndex >= stepMemberData.gridColumnWidth.length) {
            return defaultWidth;
        }

        return stepMemberData.gridColumnWidth[columnIndex];
    }

    const getContextMenuItems = (actionStep1st, actionStep2nd, actionStep3rd, actionStep4th) => {
        if (menuStyle === null) {
            return ["invisible", {}, "invisible", {}, null];
        }

        if (actionStep1st) {
            if (menuStyle.type === COLUMN_MENU_TYPE) {
                return ["visible", menuStyle.style, "invisible", {}, actionStep1st];
            }
            else if (menuStyle.type === ROW_MENU_TYPE) {
                return ["invisible", {}, "visible", menuStyle.style, actionStep1st];
            }
        }
        else if (actionStep2nd) {
            if (menuStyle.type === COLUMN_MENU_TYPE) {
                return ["visible", menuStyle.style, "invisible", {}, actionStep2nd];
            }
            else if (menuStyle.type === ROW_MENU_TYPE) {
                return ["invisible", {}, "visible", menuStyle.style, actionStep2nd];
            }
        }
        else if (actionStep3rd) {
            if (menuStyle.type === COLUMN_MENU_TYPE) {
                return ["visible", menuStyle.style, "invisible", {}, actionStep3rd];
            }
            else if (menuStyle.type === ROW_MENU_TYPE) {
                return ["invisible", {}, "visible", menuStyle.style, actionStep3rd];
            }
        }
        else if (actionStep4th) {
            if (menuStyle.type === COLUMN_MENU_TYPE) {
                return ["visible", menuStyle.style, "invisible", {}, actionStep4th];
            }
            else if (menuStyle.type === ROW_MENU_TYPE) {
                return ["invisible", {}, "visible", menuStyle.style, actionStep4th];
            }
        }

        return ["invisible", {}, "invisible", {}, null];
    }

    const actionStep1st = getActionStep(0);
    const actionStep2nd = getActionStep(1);
    const actionStep3rd = getActionStep(2);
    const actionStep4th = getActionStep(3);

    const [rowHeaders, rowRefs] = getRowHeaders();
    const [columnHeaders, columnRefs] = getColumnHeaders();

    const [columnMenuID, columnMenuStyle, rowMenuID, rowMenuStyle, currentActionStep] = getContextMenuItems(actionStep1st, actionStep2nd, actionStep3rd, actionStep4th);
    const emptyGrid = actionStep1st === null && actionStep2nd === null && actionStep3rd === null && actionStep4th === null;

    return (
        <SectionPanelComponent ref={refPanel} className={"sectionPanel"} onScroll={onScroll} onClick={onClick}>
            <div className={"sectionGridFix"}>
                {/* <button ref={refToggleBorder} className={sectionStyles.btnToggleBorder} onClick={onClickToggleBorder}></button> */}
                <div ref={refFixRow} className={"sectionGridRow"}>
                    {
                        rowHeaders
                    }
                </div>
                <div ref={refFixColumn} className={"sectionGridColumn"}>
                    { 
                        columnHeaders
                    }
                </div>
            </div>
            <SectionGrid currentMenu={props.currentMenu} onSelectComponent={props.onSelectComponent} onSelectArrow={props.onSelectArrow} onAddComponent={props.onAddComponent} onRemoveComponent={props.onRemoveComponent} sopData={props.sopData} selectedSectionData={props.selectedSectionData} selectedArrowData={props.selectedArrowData} editDatas={props.editDatas} onProcessEdit={props.onProcessEdit} actionStep={actionStep1st} rowCount={props.rowCount} columnCount={props.columnCount} showGrid={showGrid} calcArrow={calcArrow} columnRefs={columnRefs} rowRefs={rowRefs} mode={mode} onSelectedCells={props.onSelectedCells} showConfirmDialog={props.showConfirmDialog} />
            <SectionGrid currentMenu={props.currentMenu} onSelectComponent={props.onSelectComponent} onSelectArrow={props.onSelectArrow} onAddComponent={props.onAddComponent} onRemoveComponent={props.onRemoveComponent} sopData={props.sopData} selectedSectionData={props.selectedSectionData} selectedArrowData={props.selectedArrowData} editDatas={props.editDatas} onProcessEdit={props.onProcessEdit} actionStep={actionStep2nd} rowCount={props.rowCount} columnCount={props.columnCount} showGrid={showGrid} calcArrow={calcArrow} columnRefs={columnRefs} rowRefs={rowRefs} mode={mode} onSelectedCells={props.onSelectedCells} showConfirmDialog={props.showConfirmDialog} />
            <SectionGrid currentMenu={props.currentMenu} onSelectComponent={props.onSelectComponent} onSelectArrow={props.onSelectArrow} onAddComponent={props.onAddComponent} onRemoveComponent={props.onRemoveComponent} sopData={props.sopData} selectedSectionData={props.selectedSectionData} selectedArrowData={props.selectedArrowData} editDatas={props.editDatas} onProcessEdit={props.onProcessEdit} actionStep={actionStep3rd} rowCount={props.rowCount} columnCount={props.columnCount} showGrid={showGrid} calcArrow={calcArrow} columnRefs={columnRefs} rowRefs={rowRefs} mode={mode} onSelectedCells={props.onSelectedCells} showConfirmDialog={props.showConfirmDialog} />
            <SectionGrid currentMenu={props.currentMenu} onSelectComponent={props.onSelectComponent} onSelectArrow={props.onSelectArrow} onAddComponent={props.onAddComponent} onRemoveComponent={props.onRemoveComponent} sopData={props.sopData} selectedSectionData={props.selectedSectionData} selectedArrowData={props.selectedArrowData} editDatas={props.editDatas} onProcessEdit={props.onProcessEdit} actionStep={actionStep4th} rowCount={props.rowCount} columnCount={props.columnCount} showGrid={showGrid} calcArrow={calcArrow} columnRefs={columnRefs} rowRefs={rowRefs} mode={mode} onSelectedCells={props.onSelectedCells} showConfirmDialog={props.showConfirmDialog} />
            {
                emptyGrid &&
                <SectionGridDefault content={props.content} />
            }
            <div id={columnMenuID} className={"staticContextMenu" + " " + "row3"} style={columnMenuStyle}>
                <div id={"stopDrag"} className={"menuBody"}>
                    <ul>
                        <li ref={refAddToLeft} onClick={onClickContextMenu}><span>{CommonResource.ID.contextMenu.columns.addToLeft}</span></li>
                        <li ref={refDeleteColumn} onClick={onClickContextMenu}><span>{CommonResource.ID.contextMenu.columns.delete}</span></li>
                        <li ref={refAddToRight} onClick={onClickContextMenu}><span>{CommonResource.ID.contextMenu.columns.addToRight}</span></li>
                    </ul>
                </div>
            </div>
            <div id={rowMenuID} className={"staticContextMenu" + " " + "row3"} style={rowMenuStyle}>
                <div id={"stopDrag"} className={"menuBody"}>
                    <ul>
                        <li ref={refAddToUp} onClick={onClickContextMenu}><span>{CommonResource.ID.contextMenu.rows.addToUp}</span></li>
                        <li ref={refDeleteRow} onClick={onClickContextMenu}><span>{CommonResource.ID.contextMenu.rows.delete}</span></li>
                        <li ref={refAddToDown} onClick={onClickContextMenu}><span>{CommonResource.ID.contextMenu.rows.addToDown}</span></li>
                    </ul>
                </div>
            </div>
        </SectionPanelComponent>
    );
}

export default SectionPanel;