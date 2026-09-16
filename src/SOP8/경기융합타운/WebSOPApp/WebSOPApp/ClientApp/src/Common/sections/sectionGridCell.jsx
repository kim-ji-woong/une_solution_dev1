import React, { Component } from 'react';
import Process from './components/process';
import Endpoint from './components/endpoint';
import Decision from './components/decision';
import Annotation from './components/annotation';
import Internal from './components/internal';
import SopManager from '../../SOPManager/ui/sopManager';
import SopManagerResource from '../../SOPManager/resource/id';
import SopDataManager from '../../SOPManager/services/sopDataManager';
import SectionData from '../models/sections/sectionData';
import Vertex2D from '../util/Vertex2D';
import $ from 'jquery';

import { SectionGridCellComponent } from '../../SOPSimulator/styled/sectionGridStyled';

class SectionGridCell extends Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.refCell = React.createRef();

        this.state = {
            instance: this,
            prevProps: props
        }

        this.ignoreClick = false;
    }

    componentDidMount() {
        if (this.props.rowRef) {
            const rowHeight = this.props.rowRef.current.getBoundingClientRect().height;
            this.refCell.current.style.height = rowHeight + "px";

            if (this.props.stepMemberData) {
                this.props.stepMemberData.grid.rows[this.props.index] = parseInt(rowHeight.toFixed());
            }
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props === state.prevProps) {
            return state;
        }

        if (state.instance?.refCell && state.prevProps?.rowRef) {
            const rowHeight = state.prevProps.rowRef.current.getBoundingClientRect().height;
            state.instance.refCell.current.style.height = rowHeight + "px";

            if (props.stepMemberData) {
                props.stepMemberData.grid.rows[props.index] = parseInt(rowHeight.toFixed());
            }
        }

        return {
            instance: state.instance,
            prevProps: props
        };
    }

    onClickCell = (event) =>
    {
        const ignoreClick = this.ignoreClick;
        this.ignoreClick = false;

        const currentArrow = this.props.getCurrentArrow();

        if (currentArrow) {
            const beginCell = currentArrow.getBeginCell();

            // 화살표를 시작한 Cell을 다시 Click하거나 비어있는 Cell을 Click하면 임시 화살표를 없앤다.
            if (beginCell == event.target || this.getSectionData(this.props.columnIndex, this.props.index) === null) {
                this.props.onClickArrowButton(null, null, null);
            }
        }
        else {
            const vMouse = this.getSvgCoord(event.clientX, event.clientY);

            if (vMouse !== null) {
                const arrow = this.getArrow(vMouse);

                if (arrow !== null) {
                    this.props.onSelectArrow(arrow, this.props.actionStep);
                    return;
                }
            }
        }

        // 실행모드일 경우 Cell 클릭 제거
        if (SectionGridCell.isEditMode(this.props.mode) && !ignoreClick) {
            this.props.onSelectCell(this.props.columnIndex, this.props.index, event.ctrlKey, event.shiftKey);          
        }
    }

    onMouseDown = (event) => {
        // 실행모드일 경우 클릭 이벤트 제거
        if (SectionGridCell.isEditMode(this.props.mode) === false)
            return;

        // Left Button
        if (event.button === 0) {
            const vLButtonDown = this.getSvgCoord(event.clientX, event.clientY);
            this.ignoreClick = this.props.setLButtonDownPosition(vLButtonDown, vLButtonDown, this.props.columnIndex, this.props.index, event.ctrlKey);
        }
        else {
            this.props.setLButtonDownPosition(null, null, null, null, false);
        }
    }

    onMouseUp = (event) => {
        // Left Button
        if (event.button === 0) {
            const vLButtonDown = this.props.getLButtonDownPosition();

            if (vLButtonDown) {
                const vCurrent = this.getSvgCoord(event.clientX, event.clientY);
                this.props.setLButtonDownPosition(null, vCurrent, this.props.columnIndex, this.props.index, event.ctrlKey);
            }
        }
    }

    static isEditMode(mode) {
        return mode !== "exec";
    }

    getSvgCoord(x, y) {
        const vPos = this.getSvgPosition();

        if (vPos === null) {
            return null;
        }

        return new Vertex2D(x - vPos.x, y - vPos.y);
    }

    getSvgPosition() {
        if (this.refCell.current) {
            const svg = this.getSvg(this.refCell.current, 0);

            if (svg === null) {
                return null;
            }

            const rect = svg.getBoundingClientRect();
            return new Vertex2D(rect.x, rect.y);
        }

        return null;
    }

    getSvg(node, depth) {
        if (node.className.includes("_sectionGrid_")) {
            const childCount = node.children.length;

            for (let i = 0; i < childCount; i++) {
                const child = node.children[i];

                if (child.tagName === "SVG" || child.tagName === "svg") {
                    return child;
                }
            }

            return null;
        }

        if (depth >= 5) {
            return null;
        }

        return this.getSvg(node.parentNode, depth + 1);
    }

    getArrow(vPos) {
        const arrowCount = this.props.stepMemberData.arrows.length;

        for (let i = 0; i < arrowCount; i++) {
            const arrow = this.props.stepMemberData.arrows[i];

            if (arrow.hitTest(vPos) === true) {
                return arrow;
            }
        }

        return null;
    }

    makeSomething(menuType) {
        const currentArrow = this.props.getCurrentArrow();

        if (currentArrow === null) {
            // 임시 화살표를 그리는 중이 아니라면...
            //const menuType = this.props.currentMenu.menuType;

            if (menuType === "delete") {
                if (this.getSectionData(this.props.columnIndex, this.props.index) !== null) {
                    this.props.onRemoveComponent(this.props.index);
                }
            }
            else if (this.getSectionData(this.props.columnIndex, this.props.index) === null) {
                if (this.props.sopData !== null && this.props.sopData.disaster !== null) {
                    const sectionData = this.makeSectionData(menuType);

                    if (sectionData !== null) {
                        this.props.onAddComponent(sectionData, this.props.actionStep);
                    }
                }
            }
        }
        else {
            const beginCell = currentArrow.getBeginCell();

            if (beginCell !== null && beginCell !== this.refCell.current) {
                this.props.onClickCell(this.refCell.current);
            }
        }
    }

    onClickComponent = (sectionData) =>
    {
        const currentArrow = this.props.getCurrentArrow();

        if (currentArrow === null)
        {
            // 임시 화살표를 그리는 중이 아니라면...
            const menuType = this.props.currentMenu.menuType;
            //const offsetHeight = this.refCell.current.offsetHeight;

            if (menuType === "delete") {
                if (this.getSectionData(this.props.columnIndex, this.props.index) !== null) {
                    //this.setState({ offsetHeight: offsetHeight });
                    this.props.onRemoveComponent(this.props.index);
                }
            }
            else {
                if (sectionData !== null) {
                    this.props.onSelectComponent(sectionData, this.props.actionStep);
                }
            }
        }
    }

    onClickArrowButton = (arrowButton, positionType) =>
    {
        // 실행모드일 경우 클릭 이벤트 제거
        if (SectionGridCell.isEditMode(this.props.mode) === false)
            return;

        const menuType = this.props.currentMenu.menuType;

        if (menuType === "delete") {
            return;
        }

        this.props.onClickArrowButton(this.refCell.current, arrowButton, positionType);
    }

    onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }

    onDrop = (event) => {
        event.preventDefault();
        this.makeSomething(event.dataTransfer.getData("text/plain"));
    }

    onKeyDown = (event) => {
        if (event.ctrlKey) {
            if (!event.repeat) {
                if (event.key === 'c' || event.key === 'C') {
                    this.props.onProcessEdit(SopManagerResource.ID.editMenu.copy, SopManagerResource.ID.editMenu.copy);
                }
                else if (event.key === 'x' || event.key === 'X') {
                    this.props.onProcessEdit(SopManagerResource.ID.editMenu.cut, SopManagerResource.ID.editMenu.cut);
                }
                else if (event.key === 'v' || event.key === 'V') {
                    this.props.onProcessEdit(SopManagerResource.ID.editMenu.paste, SopManagerResource.ID.editMenu.paste);
                }
            }
        }
        else if (!event.repeat) {
            if (event.key === 'delete' || event.key === 'Delete') {
                this.props.onProcessEdit(SopManagerResource.ID.editMenu.delete, SopManagerResource.ID.editMenu.delete);
            }
        }
    }

    makeSectionData(menuType) {
        let sectionData = null;

        if (menuType === "process" || menuType === SopManagerResource.ID.component.process) {
            sectionData = Process.makeSectionData();
        }
        else if (menuType === "endpoint" || menuType === SopManagerResource.ID.component.endpoint) {
            sectionData = Endpoint.makeSectionData();
        }
        else if (menuType === "decision" || menuType === SopManagerResource.ID.component.decision) {
            sectionData = Decision.makeSectionData();
        }
        else if (menuType === "annotation" || menuType === SopManagerResource.ID.component.annotation) {
            sectionData = Annotation.makeSectionData();
        }
        else if (menuType === "internal" || menuType === SopManagerResource.ID.component.internal) {
            sectionData = Internal.makeSectionData();
        }
        else {
            return null;
        }

        sectionData.gridColumnIndex = this.props.columnIndex;
        sectionData.gridRowIndex = this.props.index;
        return sectionData;
    }

    /*makeSectionComponent(sectionData)
    {
        if (this.state.sectionComponentType === "process")
        {
            if (sectionData === null) {
                sectionData = Process.makeSectionData();
            }

            sectionData.gridColumnIndex = this.props.columnIndex;
            sectionData.gridRowIndex = this.props.index;
            return <Process offsetHeight={this.state.offsetHeight} onClickArrowButton={this.onClickArrowButton} onClickComponent={this.onClickComponent} sectionData={sectionData} />;
        }
        else if (this.state.sectionComponentType === "endpoint")
        {
            if (sectionData === null) {
                sectionData = Endpoint.makeSectionData();
            }

            sectionData.gridColumnIndex = this.props.columnIndex;
            sectionData.gridRowIndex = this.props.index;
            return <Endpoint offsetHeight={this.state.offsetHeight} onClickArrowButton={this.onClickArrowButton} onClickComponent={this.onClickComponent} sectionData={sectionData} />;
        }
        else if (this.state.sectionComponentType === "decision")
        {
            if (sectionData === null) {
                sectionData = Decision.makeSectionData();
            }

            sectionData.gridColumnIndex = this.props.columnIndex;
            sectionData.gridRowIndex = this.props.index;
            return <Decision offsetHeight={this.state.offsetHeight} onClickArrowButton={this.onClickArrowButton} onClickComponent={this.onClickComponent} sectionData={sectionData} />;
        }
        else if (this.state.sectionComponentType === "annotation")
        {
            if (sectionData === null) {
                sectionData = Annotation.makeSectionData();
            }

            sectionData.gridColumnIndex = this.props.columnIndex;
            sectionData.gridRowIndex = this.props.index;
            return <Annotation offsetHeight={this.state.offsetHeight} onClickArrowButton={this.onClickArrowButton} onClickComponent={this.onClickComponent} sectionData={sectionData} />;
        }
        else if (this.state.sectionComponentType === "internal")
        {
            if (sectionData === null) {
                sectionData = Internal.makeSectionData();
            }

            sectionData.gridColumnIndex = this.props.columnIndex;
            sectionData.gridRowIndex = this.props.index;
            return <Internal offsetHeight={this.state.offsetHeight} onClickArrowButton={this.onClickArrowButton} onClickComponent={this.onClickComponent} sectionData={sectionData} />;
        }

        return null;
    }*/

    makeSectionComponent(sectionData) {
        if (sectionData === null) {
            return <></>;
        }

        let isSelected = false;

        if (this.props.selectedSectionData) {
            if (this.props.selectedSectionData.gridRowIndex === this.props.index && this.props.selectedSectionData.gridColumnIndex === this.props.columnIndex) {
                isSelected = true;
            }
        }

        // 실행모드일 경우 상태값 체크
        let status = null;

        if (SectionGridCell.isEditMode(this.props.mode) === false) {
            if (!sectionData.status) {
                sectionData.status = SectionData.Status_Normal;
            }

            status = sectionData.status;
        }

        if (sectionData.componentType === "process" || sectionData.componentType === SectionData.ProcessType) {
            return <Process parentCell={this.refCell} onClickArrowButton={this.onClickArrowButton} onClickComponent={this.onClickComponent} sectionData={sectionData} isSelected={isSelected} selectedSectionData={this.props.selectedSectionData} mode={this.props.mode} status={status} />;
        }
        else if (sectionData.componentType === "endpoint" || sectionData.componentType === SectionData.EndpointType) {
            return <Endpoint parentCell={this.refCell} onClickArrowButton={this.onClickArrowButton} onClickComponent={this.onClickComponent} sectionData={sectionData} isSelected={isSelected} selectedSectionData={this.props.selectedSectionData} mode={this.props.mode} status={status} />;
        }
        else if (sectionData.componentType === "decision" || sectionData.componentType === SectionData.DecisionType) {
            return <Decision parentCell={this.refCell} onClickArrowButton={this.onClickArrowButton} onClickComponent={this.onClickComponent} sectionData={sectionData} isSelected={isSelected} selectedSectionData={this.props.selectedSectionData} mode={this.props.mode} status={status} />;
        }
        else if (sectionData.componentType === "annotation" || sectionData.componentType === SectionData.AnnotationType) {
            return <Annotation parentCell={this.refCell} onClickArrowButton={this.onClickArrowButton} onClickComponent={this.onClickComponent} sectionData={sectionData} isSelected={isSelected} selectedSectionData={this.props.selectedSectionData} mode={this.props.mode} status={status} />;
        }
        else if (sectionData.componentType === "internal" || sectionData.componentType === SectionData.InternalType) {
            return <Internal parentCell={this.refCell} onClickArrowButton={this.onClickArrowButton} onClickComponent={this.onClickComponent} sectionData={sectionData} isSelected={isSelected} selectedSectionData={this.props.selectedSectionData} mode={this.props.mode} status={status} />;
        }

        return <></>;
    }

    getSectionData(columnIndex, rowIndex) {
        if (this.props.actionStep === null) {
            return null;
        }

        const stepMember = this.props.actionStep.stepMemberDatas && this.props.actionStep.stepMemberDatas.length > 0 ? this.props.actionStep.stepMemberDatas[0] : null;

        if (stepMember === null || stepMember.sections === null) {
            return null;
        }

        return SopDataManager.getSectionData(stepMember, columnIndex, rowIndex);
    }

    render() {
        const sectionData = this.getSectionData(this.props.columnIndex, this.props.index);
        const sectionComponent = this.makeSectionComponent(sectionData);
        const addClassName = this.props.isSelected ? " " + "selected" : "";
        
        return (
            <SectionGridCellComponent ref={this.refCell} tabIndex={this.props.columnIndex + "_" + this.props.index}
                className={"sectionGridCell" + addClassName + " " + "noDrag"}
                data-index={this.props.index}
                onClick={this.onClickCell}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                onDrop={this.onDrop}
                onDragOver={this.onDragOver}
                onKeyDown={this.onKeyDown}>
                {sectionComponent}
            </SectionGridCellComponent>
        );
    }
}

export default SectionGridCell;