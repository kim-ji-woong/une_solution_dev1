import React, { Component } from 'react';
import SopDataManager from '../../../SOPManager/services/sopDataManager';
import SectionData from '../../models/sections/sectionData';
import Vertex2D from '../../util/Vertex2D';
import Geometry from '../../util/Geometry';
import ArrowPolyline from './arrowPolyline';
import ArrowTriangle from './arrowTriangle';
import Svg from './svg';
import SectionGrid from '../sectionGrid';

class Arrow extends Component {
    static Top = 0;
    static Right = 1;
    static Bottom = 2;
    static Left = 3;
    static None = 4;

    static LineThick = 4;
    static LineStyle = { stroke: "rgb(72, 87, 117)", strokeWidth: 4 };
    static Tolerance = 0.0001;
    static TriangleStyle = { fill: "rgb(72, 87, 117)" };
    static SelectedTriangleStyle = { fill: "rgb(128, 0, 128)" };
    static TriangleWidth = 15;
    static TriangleHeight = 15;
    static SelectedColor = "rgb(128, 0, 128)";

    // 화살표 꺽임선의 최소 길이
    static MIN_DISTANCE = 30;
    // 화살표 삼각형의 가로와 세로 높이
    static TRIANGLE_SIZE = 20;
    // 선택 표시를 위한 사각형 너비와 높이
    static SMALL_RECT_SIZE = 8;

    static HitTestDistance = 5;

    constructor(props) {
        super(props);
        this.props = props;

        this.arrowNo = -1;
        this.beginCell = null;
        this.beginButton = null;
        this.beginPosition = Arrow.None;
        this.beginVertex = null;
        this.endCell = null;
        this.endButton = null;
        this.endPosition = Arrow.None;
        this.endVertex = null;
        this.polylineID = null;
        this.polylineVertices = null;
        this.polylineStyle = null;
        this.polylineDash = null;
        this.triangleVertices = null;
        this.isDashLine = false;
        this.text = "";
        this.textCenter = null;
    }

    clone() {
        const arrow = new Arrow();

        arrow.arrowNo = this.arrowNo;
        arrow.beginCell = this.beginCell;
        arrow.beginButton = this.beginButton;
        arrow.beginPosition = this.beginPosition;
        arrow.beginVertex = this.beginVertex;
        arrow.endCell = this.endCell;
        arrow.endButton = this.endButton;
        arrow.endPosition = this.endPosition;
        arrow.endVertex = this.endVertex;
        arrow.polylineID = this.polylineID;
        arrow.polylineVertices = this.polylineVertices;
        arrow.polylineStyle = this.polylineStyle;
        arrow.polylineDash = this.polylineDash;
        arrow.triangleVertices = this.triangleVertices;
        arrow.isDashLine = this.isDashLine;
        arrow.text = this.text;
        arrow.textCenter = this.textCenter;

        return arrow;
    }

    getBeginCell() {
        return this.beginCell;
    }

    setBeginCell(value) {
        this.beginCell = value;
        this.beginVertex = Arrow.getArrowButtonPosition(this.beginCell, this.beginButton, this.beginPosition);
    }

    getEndCell() {
        return this.endCell;
    }

    setEndCell(cell) {
        this.endCell = cell;
        this.endVertex = Arrow.getArrowButtonPosition(this.endCell, this.endButton, this.endPosition);
    }

    getBeginButton() {
        return this.beginButton;
    }

    setBeginButton(btn, position) {
        this.beginButton = btn;
        this.beginPosition = position;
        this.beginVertex = Arrow.getArrowButtonPosition(this.beginCell, this.beginButton, this.beginPosition);

        if (this.beginVertex) {
            return true;
        }

        return false;
    }

    getEndButton() {
        return this.endButton;
    }

    setEndButton(btn, position) {
        this.endButton = btn;
        this.endPosition = position;
        this.endVertex = Arrow.getArrowButtonPosition(this.endCell, this.endButton, this.endPosition);

        if (this.endVertex) {
            return true;
        }

        return false;
    }

    getBeginVertex() {
        return this.beginVertex;
    }

    getEndVertex() {
        return this.endVertex;
    }

    static getArrowButtonParentElement(parentElement) {
        if (parentElement.parentElement === null) {
            return null;
        }

        if (SectionGrid.containsClassName(parentElement.parentElement, "sectionGridCell")) {
            return parentElement;
        }

        return parentElement.parentElement;
    }

    static getArrowButtonPosition(cell, btn, positionType) {
        if (cell === null || btn === null || positionType === Arrow.None) {
            return null;
        }

        let x = 0;
        let y = 0;

        const btnParentElement = Arrow.getArrowButtonParentElement(btn.parentElement);

        if (btnParentElement === null) {
            return undefined;
        }

        const cellLeft = cell.offsetLeft;
        const cellTop = cell.offsetTop;
        const parentLeft = btnParentElement.offsetLeft;
        const parentTop = btnParentElement.offsetTop;
        let posLeft = btn.offsetLeft;
        let posTop = btn.offsetTop;
        const rect = btn.getBoundingClientRect();

        if (Arrow.isDAI(btn.parentElement)) {
            posLeft -= 5;
            posTop -= 5;
        }

        if (positionType === Arrow.Top || positionType === Arrow.Bottom) {
            x = cellLeft + parentLeft + posLeft + rect.width - Arrow.LineThick;

            if (positionType === Arrow.Top) {
                y = cellTop + parentTop + posTop + rect.height;
            }
            else {
                y = cellTop + parentTop + posTop - rect.height;
            }

            y += 10;
        }
        else {
            y = cellTop + parentTop + posTop + rect.height - Arrow.LineThick;

            if (positionType === Arrow.Left) {
                x = cellLeft + parentLeft + posLeft + rect.width;
            }
            else {
                x = cellLeft + parentLeft + posLeft - rect.width / 2;
            }

            x += 10;
        }

        return new Vertex2D(x, y);
    }

    static isDAI(element) {
        const classCount = element.classList.length;

        for (let i = 0; i < classCount; i++) {
            const className = element.classList[i];

            if (className.includes("decision") ||
                className.includes("annotation") ||
                className.includes("internal")) {
                return true;
            }
        }

        return false;
    }

    static makeArrow2(beginCell, endCell, beginButton, endButton, stepMember, beginColumnIndex, beginRowIndex, beginPositionType, endColumnIndex, endRowIndex, endPositionType) {
        if (beginCell === null || endCell === null ||
            beginCell.parentElement === null || endCell.parentElement === null ||
            beginCell.parentElement.parentElement === null || endCell.parentElement.parentElement === null ||
            beginCell.parentElement.parentElement !== endCell.parentElement.parentElement) {
            // 같은 구역이 아니면 화살표 연결을 하지 않는다.
            return null;
        }

        const beginSection = SopDataManager.getSectionData(stepMember, parseInt(beginCell.parentElement.dataset.index, 10), parseInt(beginCell.dataset.index, 10));
        const endSection = SopDataManager.getSectionData(stepMember, parseInt(endCell.parentElement.dataset.index, 10), parseInt(endCell.dataset.index, 10));

        if (!beginSection || !endSection) {
            return null;
        }

        // 새로운 객체를 생성한다.
        const id = Arrow.makeArrowID(beginColumnIndex, beginRowIndex, beginPositionType, endColumnIndex, endRowIndex, endPositionType);
        const arrow = new Arrow();

        arrow.beginCell = beginCell;
        arrow.beginButton = beginButton;
        arrow.beginPosition = beginPositionType;
        arrow.beginVertex = Arrow.getArrowButtonPosition(beginCell, beginButton, beginPositionType);
        arrow.endCell = endCell;
        arrow.endButton = endButton;
        arrow.endPosition = endPositionType;
        arrow.endVertex = Arrow.getArrowButtonPosition(endCell, endButton, endPositionType);
        arrow.isDashLine = (beginSection.component.compn_code === SectionData.AnnotationType) || (endSection.component.compn_code === SectionData.AnnotationType);

        if (arrow.isDashLine) {
            arrow.calcArrowPolyline(Svg.TempLineStyle, id, Svg.TempDashed);
        }
        else {
            arrow.calcArrowPolyline(Arrow.LineStyle, id, null);
        }

        return arrow;
    }

    makeArrow(stepMember)
    {
        if (this.beginCell === null || this.endCell === null ||
            this.beginCell.parentElement === null || this.endCell.parentElement === null ||
            this.beginCell.parentElement.parentElement === null || this.endCell.parentElement.parentElement === null ||
            this.beginCell.parentElement.parentElement !== this.endCell.parentElement.parentElement)
        {
           // 같은 구역이 아니면 화살표 연결을 하지 않는다.
           return null;
        }

        const beginSection = SopDataManager.getSectionData(stepMember, parseInt(this.beginCell.parentElement.dataset.index, 10), parseInt(this.beginCell.dataset.index, 10));
        const endSection = SopDataManager.getSectionData(stepMember, parseInt(this.endCell.parentElement.dataset.index, 10), parseInt(this.endCell.dataset.index, 10));

        if (!beginSection || !endSection) {
            return null;
        }

        // 새로운 객체를 생성한다.
        const id = this.getArrowID();
        const arrow = this.clone();

        arrow.isDashLine = (beginSection.component.compn_code === SectionData.AnnotationType) || (endSection.component.compn_code === SectionData.AnnotationType);

        if (arrow.isDashLine) {
            arrow.calcArrowPolyline(Svg.TempLineStyle, id, Svg.TempDashed);
        }
        else {
            arrow.calcArrowPolyline(Arrow.LineStyle, id, null);
        }

        return arrow;
    }

    getArrowInfo() {
        if (this.beginCell === null || this.endCell === null ||
            this.beginCell.parentElement === null || this.endCell.parentElement === null) {
            return [null, null, null, null, Arrow.None, Arrow.None, ""];
        }

        const beginColumnIndex = parseInt(this.beginCell.parentElement.dataset.index, 10);
        const beginRowIndex = parseInt(this.beginCell.dataset.index, 10);
        const endColumnIndex = parseInt(this.endCell.parentElement.dataset.index, 10);
        const endRowIndex = parseInt(this.endCell.dataset.index, 10);
        return [beginColumnIndex, beginRowIndex, endColumnIndex, endRowIndex, this.beginPosition, this.endPosition, this.text];
    }

    calc(stepMember) {
        this._calc(stepMember, 0);
    }

    static recalc(arrowData) {
        const arrow = arrowData[0];
        const stepMember = arrowData[1];
        const redoCount = arrowData[2];

        arrow._calc(stepMember, redoCount);
    }

    _calc(stepMember, redoCount) {
        if (this.beginCell === null || this.endCell === null ||
            this.beginCell.parentElement === null || this.endCell.parentElement === null ||
            this.beginCell.parentElement.parentElement === null || this.endCell.parentElement.parentElement === null ||
            this.beginCell.parentElement.parentElement !== this.endCell.parentElement.parentElement) {
            // 같은 구역이 아니면 화살표 연결을 하지 않는다.
            return;
        }

        const beginSection = SopDataManager.getSectionData(stepMember, parseInt(this.beginCell.parentElement.dataset.index, 10), parseInt(this.beginCell.dataset.index, 10));
        const endSection = SopDataManager.getSectionData(stepMember, parseInt(this.endCell.parentElement.dataset.index, 10), parseInt(this.endCell.dataset.index, 10));

        if (!beginSection || !endSection) {
            return;
        }

        if (this.setBeginButton(this.beginButton, this.beginPosition) === false) {
            if (redoCount < 3) {
                // HTML 생성이 완료되지 않았기 때문에 1초뒤 다시 시도한다.
                setTimeout(Arrow.recalc, 1000, [this, stepMember, redoCount + 1]);
            }

            return;
        }

        if (this.setEndButton(this.endButton, this.endPosition) === false) {
            if (redoCount < 3) {
                // HTML 생성이 완료되지 않았기 때문에 1초뒤 다시 시도한다.
                setTimeout(Arrow.recalc, 1000, [this, stepMember, redoCount + 1]);
            }

            return;
        }

        const id = this.getArrowID();
        this.isDashLine = beginSection.component.compn_code === SectionData.AnnotationType || endSection.component.compn_code === SectionData.AnnotationType;

        if (this.isDashLine) {
            this.calcArrowPolyline(Svg.TempLineStyle, id, Svg.TempDashed);
        }
        else {
            this.calcArrowPolyline(Arrow.LineStyle, id, null);
        }
    }

    static makeArrowID(beginColumnIndex, beginRowIndex, beginPositionType, endColumnIndex, endRowIndex, endPositionType) {
        return `arrow_${beginColumnIndex}_${beginRowIndex}_${beginPositionType}_${endColumnIndex}_${endRowIndex}_${endPositionType}`;
    }

    getArrowID()
    {
        const beginColumnIndex = this.beginCell.parentElement.dataset.index;
        const beginRowIndex = this.beginCell.dataset.index;
        const beginPositionType = this.beginPosition;
        const endColumnIndex = this.endCell.parentElement.dataset.index;
        const endRowIndex = this.endCell.dataset.index;
        const endPositionType = this.endPosition;
        return `arrow_${beginColumnIndex}_${beginRowIndex}_${beginPositionType}_${endColumnIndex}_${endRowIndex}_${endPositionType}`;
    }

    getColumnIndex(isBegin) {
        if (isBegin) {
            if (this.beginCell?.parentElement?.dataset) {
                return parseInt(this.beginCell.parentElement.dataset.index, 10);
            }
        }
        else {
            if (this.endCell?.parentElement?.dataset) {
                return parseInt(this.endCell.parentElement.dataset.index, 10);
            }
        }

        return null;
    }

    getRowIndex(isBegin) {
        if (isBegin) {
            if (this.beginCell?.dataset) {
                return parseInt(this.beginCell.dataset.index, 10);
            }
        }
        else {
            if (this.endCell?.dataset) {
                return parseInt(this.endCell.dataset.index, 10);
            }
        }

        return null;
    }

    static toJson(arrow, sections)
    {
        if (!arrow.getComponentInfo) {
            return Arrow.toJson2(arrow);
        }

        const beginComponentInfo = arrow.getComponentInfo(arrow.beginCell, sections);

        if (beginComponentInfo === null) {
            return null;
        }

        const endComponentInfo = arrow.getComponentInfo(arrow.endCell, sections);

        if (endComponentInfo === null) {
            return null;
        }

        const json = {
            "arrowNo": arrow.arrowNo,
            //"beginComponentID": beginComponentInfo[0],
            "beginColumnIndex": beginComponentInfo[1],
            "beginRowIndex": beginComponentInfo[2],
            "beginPosition": arrow.beginPosition,
            //"endComponentID": endComponentInfo[0],
            "endColumnIndex": endComponentInfo[1],
            "endRowIndex": endComponentInfo[2],
            "endPosition": arrow.endPosition,
            "text": arrow.text
        }

        return json;
    }

    static toJson2(arrow) {
        const beginComponentInfo = Arrow.getBeginComponentInfo(arrow);

        if (beginComponentInfo === null) {
            return null;
        }

        const endComponentInfo = Arrow.getEndComponentInfo(arrow);

        if (endComponentInfo === null) {
            return null;
        }

        const json = {
            "arrowNo": arrow.arrowNo,
            "beginComponentID": beginComponentInfo[0],
            "beginColumnIndex": beginComponentInfo[1],
            "beginRowIndex": beginComponentInfo[2],
            "beginPosition": arrow.beginPosition,
            "endComponentID": endComponentInfo[0],
            "endColumnIndex": endComponentInfo[1],
            "endRowIndex": endComponentInfo[2],
            "endPosition": arrow.endPosition,
            "text": arrow.text
        }

        return json;
    }

    static toJson3(arrow)
    {
        const json = {
            "arrowNo": arrow.arrowNo,
            "beginColumnIndex": arrow.beginColumnIndex,
            "beginRowIndex": arrow.beginRowIndex,
            "beginPosition": arrow.beginPosition,
            "endColumnIndex": arrow.endColumnIndex,
            "endRowIndex": arrow.endRowIndex,
            "endPosition": arrow.endPosition,
            "text": arrow.text
        }

        return json;
    }

    static getBeginComponentInfo(arrow) {
        const columnIndex = arrow.beginColumnIndex;
        const rowIndex = arrow.beginRowIndex;
        const componentID = arrow.beginComponentID;

        if (componentID === null || componentID === undefined ||
            columnIndex === null || columnIndex === undefined ||
            rowIndex === null || rowIndex === undefined) {
            return null;
        }

        const componentType = (componentID >> 24);
        return [componentID, columnIndex, rowIndex, componentType];
    }

    static getEndComponentInfo(arrow) {
        const columnIndex = arrow.endColumnIndex;
        const rowIndex = arrow.endRowIndex;
        const componentID = arrow.endComponentID;

        if (componentID === null || componentID === undefined ||
            columnIndex === null || columnIndex === undefined ||
            rowIndex === null || rowIndex === undefined) {
            return null;
        }

        const componentType = (componentID >> 24);
        return [componentID, columnIndex, rowIndex, componentType];
    }

    getComponentInfo(cell, sections)
    {
        if (cell === null || cell.parentElement === null) {
            return null;
        }

        const columnIndex = Number(cell.parentElement.dataset.index);
        const rowIndex = Number(cell.dataset.index);

        let arrowSection = null;

        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];

            if (section !== undefined &&
                section.component.column_no === columnIndex &&
                section.component.row_no === rowIndex) {
                arrowSection = section;
                break;
            }
        }

        if (arrowSection === null) {
            return null;
        }

        var componentType = arrowSection.typeID;
        if (componentType === undefined) {
            componentType = arrowSection.componentType;
        }

        const componentID = ((componentType << 24) | arrowSection.componentNo);
        return [componentID, arrowSection.component.column_no, arrowSection.component.row_no, componentType];

    }

    linkedCell(columnIndex, rowIndex)
    {
        if (this.polylineID.length === 0) {
            return false;
        }

        const cIndex = columnIndex.toString();
        const rIndex = rowIndex.toString();
        const tokens = this.polylineID.split('_');

        if (tokens.length >= 7) {
            const beginColumnIndex = tokens[1];
            const beginRowIndex = tokens[2];
            const endColumnIndex = tokens[4];
            const endRowIndex = tokens[5];

            if ((cIndex === beginColumnIndex && rIndex === beginRowIndex) ||
                (cIndex === endColumnIndex && rIndex === endRowIndex)) {
                return true;
            }
        }

        return false;
    }

    abs(data)
    {
        if (data < 0)
        {
            data = -data;
        }

        return data;
    }

    calcArrowPolyline(style, id, dashed)
    {
        let arrVertex = null;

        if (this.abs(this.beginVertex.x - this.endVertex.x) < Arrow.Tolerance || this.abs(this.beginVertex.y - this.endVertex.y) < Arrow.Tolerance)
        {
            arrVertex = this.calcStraightArrowLine(this.beginVertex, this.endVertex, this.beginCell, this.endCell, this.beginPosition, this.endPosition);

            if (arrVertex != null)
            {
                return this.calcPolylines(arrVertex, style, id, dashed);
            }
        }

        if (this.beginVertex.x < this.endVertex.x)
        {
            if (this.beginVertex.y < this.endVertex.y)
            {
                // 좌측 상단에서 우측 하단 방향으로 화살표
                arrVertex = this.calcNWArrowLine(this.beginVertex, this.endVertex, this.beginCell, this.endCell, this.beginPosition, this.endPosition);
            }
            else
            {
                // 좌측 하단에서 우측 상단 방향으로 화살표
                arrVertex = this.calcSWArrowLine(this.beginVertex, this.endVertex, this.beginCell, this.endCell, this.beginPosition, this.endPosition);
            }
        }
        else
        {
            if (this.beginVertex.y < this.endVertex.y)
            {
                // 우측 상단에서 좌측 하단 방향으로 화살표
                arrVertex = this.calcNEArrowLine(this.beginVertex, this.endVertex, this.beginCell, this.endCell, this.beginPosition, this.endPosition);
            }
            else
            {
                // 우측 하단에서 좌측 상단 방향으로 화살표
                arrVertex = this.calcSEArrowLine(this.beginVertex, this.endVertex, this.beginCell, this.endCell, this.beginPosition, this.endPosition);
            }
        }

        return this.calcPolylines(arrVertex, style, id, dashed);
    }

    calcStraightArrowLine(vBegin, vEnd, beginCell, endCell, posBegin, posEnd)
    {
        let arrVertex = [];

        if (this.abs(vBegin.x - vEnd.x) < Arrow.Tolerance)
        {
            // 수직 방향 화살표
            if (posBegin === Arrow.Top && posEnd === Arrow.Bottom)
            {
                if (vBegin.y > vEnd.y)
                {
                    arrVertex.push(vBegin);
                    arrVertex.push(vEnd);
                }
            }
            else if (posBegin === Arrow.Bottom && posEnd === Arrow.Top)
            {
                if (vBegin.y < vEnd.y)
                {
                    arrVertex.push(vBegin);
                    arrVertex.push(vEnd);
                }
            }

            if ((posBegin !== Arrow.Top && posBegin !== Arrow.Bottom) ||
                (posEnd !== Arrow.Top && posEnd !== Arrow.Bottom))
                return null;

            if (arrVertex.length === 0)
            {
                const rectBeginCell = beginCell.getBoundingClientRect();
                const rectEndCell = endCell.getBoundingClientRect();
                let x;

                // 아래에서 위를 향할땐 왼쪽으로
                // 위에서 아래를 향할땐 오른쪽으로
                if (rectBeginCell.width > rectEndCell.width)
                {
                    x = vBegin.y > vEnd.y ? vBegin.x - rectBeginCell.width / 2 - Arrow.MIN_DISTANCE : vBegin.x + rectBeginCell.width / 2 + Arrow.MIN_DISTANCE;
                }
                else
                {
                    x = vBegin.y > vEnd.y ? vBegin.x - rectEndCell.width / 2 - Arrow.MIN_DISTANCE : vBegin.x + rectEndCell.width / 2 + Arrow.MIN_DISTANCE;
                }

                const y1 = posBegin === Arrow.Top ? vBegin.y - Arrow.MIN_DISTANCE : vBegin.y + Arrow.MIN_DISTANCE;
                const y2 = posEnd === Arrow.Top ? vEnd.y - Arrow.MIN_DISTANCE : vEnd.y + Arrow.MIN_DISTANCE;

                arrVertex.push(vBegin);
                arrVertex.push(new Vertex2D(vBegin.x, y1));
                arrVertex.push(new Vertex2D(x, y1));
                arrVertex.push(new Vertex2D(x, y2));
                arrVertex.push(new Vertex2D(vEnd.x, y2));
                arrVertex.push(vEnd);
            }
        }
        else
        {
            // 수평 방향 화살표
            if (posBegin === Arrow.Right && posEnd === Arrow.Left)
            {
                if (vBegin.x < vEnd.x)
                {
                    arrVertex.push(vBegin);
                    arrVertex.push(vEnd);
                }
            }
            else if (posBegin === Arrow.Left && posEnd === Arrow.Right)
            {
                if (vBegin.x > vEnd.x)
                {
                    arrVertex.push(vBegin);
                    arrVertex.push(vEnd);
                }
            }

            if ((posBegin !== Arrow.Left && posBegin !== Arrow.Right) ||
                (posEnd !== Arrow.Left && posEnd !== Arrow.Right))
                return null;

            if (arrVertex.length === 0)
            {
                const rectBeginCell = beginCell.getBoundingClientRect();
                const rectEndCell = endCell.getBoundingClientRect();
                let y;

                // 왼쪽에서 오른쪽을 향할땐 위쪽으로
                // 오른쪽에서 왼쪽을 향할땐 아래쪽으로
                if (rectBeginCell.height > rectEndCell.height)
                {
                    y = vBegin.x < vEnd.x ? vBegin.y - rectBeginCell.height / 2 - Arrow.MIN_DISTANCE : vBegin.y + rectBeginCell.height / 2 + Arrow.MIN_DISTANCE;
                }
                else
                {
                    y = vBegin.x < vEnd.x ? vBegin.y - rectEndCell.height / 2 - Arrow.MIN_DISTANCE : vBegin.y + rectEndCell.height / 2 + Arrow.MIN_DISTANCE;
                }

                const x1 = posBegin === Arrow.Left ? vBegin.x - Arrow.MIN_DISTANCE : vBegin.x + Arrow.MIN_DISTANCE;
                const x2 = posEnd === Arrow.Left ? vEnd.x - Arrow.MIN_DISTANCE : vEnd.x + Arrow.MIN_DISTANCE;

                arrVertex.push(vBegin);
                arrVertex.push(new Vertex2D(x1, vBegin.y));
                arrVertex.push(new Vertex2D(x1, y));
                arrVertex.push(new Vertex2D(x2, y));
                arrVertex.push(new Vertex2D(x2, vEnd.y));
                arrVertex.push(vEnd);
            }
        }

        return arrVertex;
    }

    calcPolylines(arrVertex, style, id, dashed)
    {
        let strVertices = "";
        const vertexCount = arrVertex.length;

        for (let i=0;i<vertexCount;i++)
        {
            let x = arrVertex[i].x;
            let y = arrVertex[i].y;

            if (i === vertexCount - 1)
            {
                // 마지막 버텍스는 삼각형 안에 들어가도록 위치를 조금 옮긴다.
                if (this.endPositionType === Arrow.Top)
                {
                    y = y - Arrow.TriangleHeight * 2 / 3;
                }
                else if (this.endPositionType === Arrow.Bottom)
                {
                    y = y + Arrow.TriangleHeight * 2 / 3;
                }
                else if (this.endPositionType === Arrow.Left)
                {
                    x = x - Arrow.TriangleWidth - 2 / 3;
                }
                else if (this.endPositionType === Arrow.Right)
                {
                    x = x + Arrow.TriangleWidth - 2 / 3;
                }
            }

            if (i === 0)
            {
                strVertices = x + "," + y;
            }
            else
            {
                strVertices += " " + x + "," + y;
            }
        }

        this.polylineID = id;
        this.polylineVertices = strVertices;
        this.polylineStyle = style;
        this.polylineDash = dashed;
        this.calcTriangleString();
        this.calcTextCenter();

        /*this.setState( 
            {
                _polylineID: this.polylineID,
                _polylineVertices: this.polylineVertices,
                _polylineStyle: this.polylineStyle,
                _polylineDash: this.polylineDash,
                _triangleVertices: this.triangleVertices
            }
        );*/

        return true;
    }

    calcTextCenter() {
        const vertexList = Geometry.stringToVertexList(this.polylineVertices);
        this.textCenter = Geometry.getVertexListCenter(vertexList);
    }

    calcTriangleString()
    {
        if (this.endPosition === Arrow.Top)
        {
            const x1 = this.endVertex.x - Arrow.TriangleWidth / 2;
            const y = this.endVertex.y - Arrow.TriangleHeight;
            const x2 = this.endVertex.x + Arrow.TriangleWidth / 2;

            this.triangleVertices = `"${x1},${y} ${x2},${y} ${this.endVertex.x},${this.endVertex.y}"`;
        }
        else if (this.endPosition === Arrow.Bottom)
        {
            const x1 = this.endVertex.x - Arrow.TriangleWidth / 2;
            const y = this.endVertex.y + Arrow.TriangleHeight;
            const x2 = this.endVertex.x + Arrow.TriangleWidth / 2;

            this.triangleVertices = `"${x1},${y} ${x2},${y} ${this.endVertex.x},${this.endVertex.y}"`;
        }
        else if (this.endPosition === Arrow.Left)
        {
            const y1 = this.endVertex.y - Arrow.TriangleHeight / 2;
            const x = this.endVertex.x - Arrow.TriangleWidth;
            const y2 = this.endVertex.y + Arrow.TriangleHeight / 2;

            this.triangleVertices = `"${x},${y1} ${x},${y2} ${this.endVertex.x},${this.endVertex.y}"`;
        }
        else// if (this.endPositionType === Arrow.Right)
        {
            const moveX = 5;
            const y1 = this.endVertex.y - Arrow.TriangleHeight / 2;
            const x = this.endVertex.x + Arrow.TriangleWidth - moveX;
            const y2 = this.endVertex.y + Arrow.TriangleHeight / 2;

            this.triangleVertices = `"${x},${y1} ${x},${y2} ${this.endVertex.x - moveX},${this.endVertex.y}"`;
        }
    }

    // 좌측 상단에서 우측 하단 방향으로 화살표
    calcNWArrowLine(vBegin, vEnd, beginCell, endCell, posBegin, posEnd)
    {
        const rectBeginCell = beginCell.getBoundingClientRect();
        const rectEndCell = endCell.getBoundingClientRect();

        let arrVertex = [];

        if (posBegin === Arrow.Top)
        {
            const fBeginRight = vBegin.x + rectBeginCell.width / 2;

            if (posEnd === Arrow.Top)
            {
                if (vEnd.x >= fBeginRight + Arrow.MIN_DISTANCE)
                {
                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x, vBegin.y - Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(vEnd.x, arrVertex[1].y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x, vBegin.y - Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(fBeginRight + Arrow.MIN_DISTANCE, arrVertex[1].y));
                    arrVertex.push(new Vertex2D(arrVertex[2].x, vEnd.y - Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(vEnd.x, arrVertex[3].y));
                    arrVertex.push(vEnd);
                }
            }
            else if (posEnd === Arrow.Right)
            {
                const fEndRight = vEnd.x + rectEndCell.width / 2;

                const x = fEndRight >= fBeginRight ? fEndRight + Arrow.MIN_DISTANCE : fBeginRight + Arrow.MIN_DISTANCE;

                arrVertex.push(vBegin);
                arrVertex.push(new Vertex2D(vBegin.x, vBegin.y - Arrow.MIN_DISTANCE));
                arrVertex.push(new Vertex2D(x, arrVertex[1].y));
                arrVertex.push(new Vertex2D(x, vEnd.y));
                arrVertex.push(vEnd);
            }
            else if (posEnd === Arrow.Bottom)
            {
                const fEndLeft = vEnd.x - rectEndCell.width / 2;

                const x = fEndLeft >= fBeginRight + Arrow.MIN_DISTANCE ? fBeginRight + Arrow.MIN_DISTANCE : vEnd.x + rectBeginCell.width / 2 + Arrow.MIN_DISTANCE;

                arrVertex.push(vBegin);
                arrVertex.push(new Vertex2D(vBegin.x, vBegin.y - Arrow.MIN_DISTANCE));
                arrVertex.push(new Vertex2D(x, arrVertex[1].y));
                arrVertex.push(new Vertex2D(x, vEnd.y + Arrow.MIN_DISTANCE));
                arrVertex.push(new Vertex2D(vEnd.x, arrVertex[3].y));
                arrVertex.push(vEnd);
            }
            else// if (posEnd === Arrow.Left)
            {
                const fEndLeft = vEnd.x;
                const fBeginBottom = vBegin.y + rectBeginCell.height;

                const isLeft = fEndLeft <= fBeginRight && vEnd.y < fBeginBottom + Arrow.MIN_DISTANCE * 2;

                if (isLeft)
                {
                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x, vBegin.y - Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(vBegin.x - rectBeginCell.width / 2 - Arrow.MIN_DISTANCE, arrVertex[1].y));
                    arrVertex.push(new Vertex2D(arrVertex[2].x, vEnd.y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    if (fEndLeft < fBeginRight + Arrow.MIN_DISTANCE * 2)
                    {
                        arrVertex.push(vBegin);
                        arrVertex.push(new Vertex2D(vBegin.x, vBegin.y - Arrow.MIN_DISTANCE));
                        arrVertex.push(new Vertex2D(fBeginRight + Arrow.MIN_DISTANCE, arrVertex[1].y));
                        arrVertex.push(new Vertex2D(arrVertex[2].x, vEnd.y - Arrow.MIN_DISTANCE));
                        arrVertex.push(new Vertex2D(vEnd.x - Arrow.MIN_DISTANCE, arrVertex[3].y));
                        arrVertex.push(new Vertex2D(arrVertex[4].x, vEnd.y));
                        arrVertex.push(vEnd);
                    }
                    else
                    {
                        arrVertex.push(vBegin);
                        arrVertex.push(new Vertex2D(vBegin.x, vBegin.y - Arrow.MIN_DISTANCE));
                        arrVertex.push(new Vertex2D(fBeginRight + Arrow.MIN_DISTANCE, arrVertex[1].y));
                        arrVertex.push(new Vertex2D(arrVertex[2].x, vEnd.y));
                        arrVertex.push(vEnd);
                    }
                }
            }
        }
        else if (posBegin === Arrow.Right)
        {
            if (posEnd === Arrow.Top)
            {
                if (vEnd.y < vBegin.y + Arrow.MIN_DISTANCE)
                {
                    arrVertex.push(vBegin);

                    const fEndLeft = vEnd.x - rectEndCell.width / 2;
                    const x = fEndLeft >= vBegin.x + Arrow.MIN_DISTANCE * 2 ? vBegin.x + Arrow.MIN_DISTANCE : (vBegin.x + fEndLeft) / 2;

                    arrVertex.push(new Vertex2D(x, vBegin.y));
                    arrVertex.push(new Vertex2D(x, vEnd.y - Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(vEnd.x, arrVertex[2].y));
                    arrVertex.push(vEnd);
                }
                else if (vEnd.x < vBegin.x + Arrow.MIN_DISTANCE)
                {
                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x + Arrow.MIN_DISTANCE, vBegin.y));

                    const fBeginBottom = vBegin.y + rectBeginCell.height;
                    const y = vEnd.y >= fBeginBottom + Arrow.MIN_DISTANCE * 2 ? vEnd.y - Arrow.MIN_DISTANCE : (fBeginBottom + vEnd.y) / 2;

                    arrVertex.push(new Vertex2D(arrVertex[1].x, y));
                    arrVertex.push(new Vertex2D(vEnd.x, y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vEnd.x, vBegin.y));
                    arrVertex.push(vEnd);
                }
            }
            else if (posEnd === Arrow.Right)
            {
                const fEndTop = vEnd.y - Arrow.MIN_DISTANCE / 2;

                if (fEndTop < vBegin.y + Arrow.MIN_DISTANCE)
                {
                    const fEndLeft = vEnd.x - rectEndCell.width;
                    const x = fEndLeft >= vBegin.x + Arrow.MIN_DISTANCE * 2 ? vBegin.x + Arrow.MIN_DISTANCE : (fEndLeft + vBegin.x) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(x, vBegin.y));
                    arrVertex.push(new Vertex2D(x, fEndTop + Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(vEnd.x + Arrow.MIN_DISTANCE, arrVertex[2].y));
                    arrVertex.push(new Vertex2D(arrVertex[3].X, vEnd.y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vEnd.x + Arrow.MIN_DISTANCE, vBegin.y));
                    arrVertex.push(new Vertex2D(arrVertex[1].x, vEnd.y));
                    arrVertex.push(vEnd);
                }
            }
            else if (posEnd === Arrow.Bottom)
            {
                const fEndLeft = vEnd.x - rectEndCell.width / 2;

                if (fEndLeft >= vBegin.x + Arrow.MIN_DISTANCE)
                {
                    const x = fEndLeft >= vBegin.x + Arrow.MIN_DISTANCE * 2 ? vBegin.x + Arrow.MIN_DISTANCE : (fEndLeft + vBegin.x) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(x, vBegin.y));
                    arrVertex.push(new Vertex2D(arrVertex[1].x, vEnd.y + Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(vEnd.x, arrVertex[2].y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    const fEndTop = vEnd.y - rectEndCell.height;
                    const fBeginBottom = vBegin.y + rectBeginCell.height / 2;

                    const y = fEndTop >= fBeginBottom + Arrow.MIN_DISTANCE * 2 ? fEndTop - Arrow.MIN_DISTANCE : (fEndTop + fBeginBottom) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x + Arrow.MIN_DISTANCE, vBegin.y));
                    arrVertex.push(new Vertex2D(arrVertex[1].x, y));
                    arrVertex.push(new Vertex2D(fEndLeft - Arrow.MIN_DISTANCE, y));
                    arrVertex.push(new Vertex2D(arrVertex[3].x, vEnd.y + Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(vEnd.x, arrVertex[4].y));
                    arrVertex.push(vEnd);
                }
            }
            else// if (posEnd === Arrow.Left)
            {
                const fEndLeft = vEnd.x;

                if (fEndLeft >= vBegin.x + Arrow.MIN_DISTANCE)
                {
                    const x = fEndLeft >= vBegin.x + Arrow.MIN_DISTANCE * 2 ? vBegin.x + Arrow.MIN_DISTANCE : (fEndLeft + vBegin.x) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(x, vBegin.y));
                    arrVertex.push(new Vertex2D(x, vEnd.y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    const fEndTop = vEnd.y - rectEndCell.height / 2;
                    const fBeginBottom = vBegin.y + rectBeginCell.height / 2;

                    const y = fEndTop >= fBeginBottom + Arrow.MIN_DISTANCE * 2 ? fEndTop - Arrow.MIN_DISTANCE : (fBeginBottom + fEndTop) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x + Arrow.MIN_DISTANCE, vBegin.y));
                    arrVertex.push(new Vertex2D(arrVertex[1].x, y));
                    arrVertex.push(new Vertex2D(vEnd.x - Arrow.MIN_DISTANCE, y));
                    arrVertex.push(new Vertex2D(arrVertex[3].x, vEnd.y));
                    arrVertex.push(vEnd);
                }
            }
        }
        else if (posBegin === Arrow.Bottom)
        {
            if (posEnd === Arrow.Top)
            {
                const y = vEnd.y >= vBegin.y + Arrow.MIN_DISTANCE * 2 ? vEnd.y - Arrow.MIN_DISTANCE : (vEnd.y + vBegin.y) / 2;

                arrVertex.push(vBegin);
                arrVertex.push(new Vertex2D(vBegin.x, y));
                arrVertex.push(new Vertex2D(vEnd.x, y));
                arrVertex.push(vEnd);
            }
            else if (posEnd === Arrow.Right)
            {
                const fEndTop = vEnd.y - rectEndCell.height / 2;

                if (fEndTop >= vBegin.y + Arrow.MIN_DISTANCE)
                {
                    const y = fEndTop >= vBegin.y + Arrow.MIN_DISTANCE * 2 ? fEndTop - Arrow.MIN_DISTANCE : (fEndTop + vBegin.y) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x, y));
                    arrVertex.push(new Vertex2D(vEnd.x + Arrow.MIN_DISTANCE, y));
                    arrVertex.push(new Vertex2D(arrVertex[2].x, vEnd.y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x, vEnd.y + rectEndCell.height / 2 + Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(vEnd.x + Arrow.MIN_DISTANCE, arrVertex[1].y));
                    arrVertex.push(new Vertex2D(arrVertex[2].x, vEnd.y));
                    arrVertex.push(vEnd);
                }
            }
            else if (posEnd === Arrow.Bottom)
            {
                const fEndLeft = vEnd.x - rectEndCell.width / 2;

                if (fEndLeft >= vBegin.x + Arrow.MIN_DISTANCE)
                {
                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x, vEnd.y + Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(vEnd.x, arrVertex[1].y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    const fEndTop = vEnd.y - rectEndCell.height;
                    const y = fEndTop >= vBegin.y + Arrow.MIN_DISTANCE * 2 ? fEndTop - Arrow.MIN_DISTANCE : (fEndTop + vBegin.y) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x, y));
                    arrVertex.push(new Vertex2D(fEndLeft - Arrow.MIN_DISTANCE, y));
                    arrVertex.push(new Vertex2D(arrVertex[2].x, vEnd.y));
                    arrVertex.push(new Vertex2D(vEnd.x, arrVertex[3].y));
                    arrVertex.push(vEnd);
                }
            }
            else// if (posEnd === Arrow.Left)
            {
                arrVertex.push(vBegin);
                arrVertex.push(new Vertex2D(vBegin.x, vEnd.y));
                arrVertex.push(vEnd);
            }
        }
        else// if (posBegin === Arrow.Left)
        {
            if (posEnd === Arrow.Top)
            {
                const fBeginRight = vBegin.x + rectBeginCell.width;
                const fBeginBottom = vBegin.y + rectBeginCell.height / 2;

                if (vEnd.x >= fBeginRight + Arrow.MIN_DISTANCE && vEnd.y < fBeginBottom + Arrow.MIN_DISTANCE)
                {
                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x - Arrow.MIN_DISTANCE, vBegin.y));
                    arrVertex.push(new Vertex2D(arrVertex[1].x, vBegin.y - rectBeginCell.height / 2 - Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(fBeginRight + Arrow.MIN_DISTANCE, arrVertex[2].y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    const y = vEnd.y >= fBeginBottom + Arrow.MIN_DISTANCE * 2 ? vEnd.y - Arrow.MIN_DISTANCE : (vEnd.y + fBeginBottom) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x - Arrow.MIN_DISTANCE, vBegin.y));
                    arrVertex.push(new Vertex2D(arrVertex[1].x, y));
                    arrVertex.push(new Vertex2D(vEnd.x, y));
                    arrVertex.push(vEnd);
                }
            }
            else if (posEnd === Arrow.Right)
            {
                const fEndTop = vEnd.y - rectEndCell.height / 2;
                const fBeginBottom = vBegin.y + rectBeginCell.height / 2;

                if (fEndTop >= fBeginBottom + Arrow.MIN_DISTANCE)
                {
                    const y = fEndTop >= fBeginBottom + Arrow.MIN_DISTANCE * 2 ? fEndTop - Arrow.MIN_DISTANCE : (fEndTop + fBeginBottom) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x - Arrow.MIN_DISTANCE, vBegin.y));
                    arrVertex.push(new Vertex2D(arrVertex[1].x, y));
                    arrVertex.push(new Vertex2D(vEnd.x + Arrow.MIN_DISTANCE, y));
                    arrVertex.push(new Vertex2D(arrVertex[3].x, vEnd.y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    const fBeginRight = vBegin.x + rectBeginCell.width;

                    if (vEnd.x >= fBeginRight + Arrow.MIN_DISTANCE)
                    {
                        arrVertex.push(vBegin);
                        arrVertex.push(new Vertex2D(vBegin.x - Arrow.MIN_DISTANCE, vBegin.y));
                        arrVertex.push(new Vertex2D(arrVertex[1].X, vBegin.y + rectBeginCell.height / 2 + Arrow.MIN_DISTANCE));
                        arrVertex.push(new Vertex2D(vEnd.x + Arrow.MIN_DISTANCE, arrVertex[2].y));
                        arrVertex.push(new Vertex2D(arrVertex[3].x, vEnd.y));
                        arrVertex.push(vEnd);
                    }
                    else
                    {
                        arrVertex.push(vBegin);
                        arrVertex.push(new Vertex2D(vBegin.x - Arrow.MIN_DISTANCE, vBegin.y));
                        arrVertex.push(new Vertex2D(arrVertex[1].x, vEnd.y + rectEndCell.height / 2 + Arrow.MIN_DISTANCE));
                        arrVertex.push(new Vertex2D(vEnd.x + Arrow.MIN_DISTANCE, arrVertex[2].y));
                        arrVertex.push(new Vertex2D(arrVertex[3].x, vEnd.y));
                        arrVertex.push(vEnd);
                    }
                }
            }
            else if (posEnd === Arrow.Bottom)
            {
                const fBeginBottom = vBegin.y + rectBeginCell.height / 2;
                const y = vEnd.y > fBeginBottom ? vEnd.y + Arrow.MIN_DISTANCE : fBeginBottom + Arrow.MIN_DISTANCE;

                arrVertex.push(vBegin);
                arrVertex.push(new Vertex2D(vBegin.x - Arrow.MIN_DISTANCE, vBegin.y));
                arrVertex.push(new Vertex2D(arrVertex[1].x, y));
                arrVertex.push(new Vertex2D(vEnd.x, y));
                arrVertex.push(vEnd);
            }
            else// if (posEnd === Arrow.Left)
            {
                const fBeginBottom = vBegin.y + rectBeginCell.height / 2;
                const fBeginRight = vBegin.x + rectBeginCell.width;

                if (vEnd.x >= fBeginRight + Arrow.MIN_DISTANCE)
                {
                    const x = vEnd.x >= fBeginRight + Arrow.MIN_DISTANCE * 2 ? vEnd.x - Arrow.MIN_DISTANCE : (fBeginRight + vEnd.x) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x - Arrow.MIN_DISTANCE, vBegin.y));
                    arrVertex.push(new Vertex2D(arrVertex[1].x, fBeginBottom + Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(x, arrVertex[2].y));
                    arrVertex.push(new Vertex2D(x, vEnd.y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x - Arrow.MIN_DISTANCE, vBegin.y));
                    arrVertex.push(new Vertex2D(arrVertex[1].x, vEnd.y));
                    arrVertex.push(vEnd);
                }
            }
        }

        return arrVertex;
    }

    // 좌측 하단에서 우측 상단 방향으로 화살표
    calcSWArrowLine(vBegin, vEnd, beginCell, endCell, posBegin, posEnd)
    {
        const rectBeginCell = beginCell.getBoundingClientRect();
        const rectEndCell = endCell.getBoundingClientRect();

        let arrVertex = [];

        if (posBegin === Arrow.Top)
        {
            if (posEnd === Arrow.Top)
            {
                const fEndLeft = vEnd.x - rectEndCell.width / 2;

                if (fEndLeft >= vBegin.x + Arrow.MIN_DISTANCE)
                {
                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x, vEnd.y - Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(vEnd.x, arrVertex[1].y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    const fEndBottom = vEnd.y + rectEndCell.height;
                    const y = vBegin.y >= fEndBottom + Arrow.MIN_DISTANCE * 2 ? vBegin.y - Arrow.MIN_DISTANCE : (vBegin.y + fEndBottom) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x, y));
                    arrVertex.push(new Vertex2D(fEndLeft - Arrow.MIN_DISTANCE, y));
                    arrVertex.push(new Vertex2D(arrVertex[2].x, vEnd.y - Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(vEnd.x, arrVertex[3].y));
                    arrVertex.push(vEnd);
                }
            }
            else if (posEnd === Arrow.Right)
            {
                const fEndLeft = vEnd.x - rectEndCell.width;
                const fEndBottom = vEnd.y + rectEndCell.height / 2;

                if (vBegin.x <= fEndLeft - Arrow.MIN_DISTANCE && vBegin.y < fEndBottom + Arrow.MIN_DISTANCE)
                {
                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x, vEnd.y - rectEndCell.height / 2 - Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(vEnd.x + Arrow.MIN_DISTANCE, arrVertex[1].y));
                    arrVertex.push(new Vertex2D(arrVertex[2].x, vEnd.y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    const y = vBegin.y >= fEndBottom + Arrow.MIN_DISTANCE * 2 ? vBegin.y - Arrow.MIN_DISTANCE : (vBegin.y + fEndBottom) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x, y));
                    arrVertex.push(new Vertex2D(vEnd.x + Arrow.MIN_DISTANCE, y));
                    arrVertex.push(new Vertex2D(arrVertex[2].x, vEnd.y));
                    arrVertex.push(vEnd);
                }
            }
            else if (posEnd === Arrow.Bottom)
            {
                const fEndLeft = vEnd.x - rectEndCell.width / 2;
                const fBeginRight = vBegin.x + rectBeginCell.width / 2;

                if (vBegin.y < vEnd.y + Arrow.MIN_DISTANCE && fEndLeft >= fBeginRight + Arrow.MIN_DISTANCE)
                {
                    const x = fEndLeft >= fBeginRight + Arrow.MIN_DISTANCE * 2 ? fBeginRight + Arrow.MIN_DISTANCE : (fEndLeft + fBeginRight) / 2;
                    const y = (vBegin.y + vEnd.y) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x, y));
                    arrVertex.push(new Vertex2D(x, y));
                    arrVertex.push(new Vertex2D(x, vEnd.y - Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(vEnd.x, arrVertex[3].y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    const y = vBegin.y >= vEnd.y + Arrow.MIN_DISTANCE * 2 ? vEnd.y + Arrow.MIN_DISTANCE : (vBegin.y + vEnd.y) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x, y));
                    arrVertex.push(new Vertex2D(vEnd.x, y));
                    arrVertex.push(vEnd);
                }
            }
            else// if (posEnd === Arrow.Left)
            {
                arrVertex.push(vBegin);
                arrVertex.push(new Vertex2D(vBegin.x, vEnd.y));
                arrVertex.push(vEnd);
            }
        }
        else if (posBegin === Arrow.Right)
        {
            if (posEnd === Arrow.Top)
            {
                const fEndLeft = vEnd.x - rectEndCell.width / 2;

                if (fEndLeft >= vBegin.x + Arrow.MIN_DISTANCE)
                {
                    const x = fEndLeft >= vBegin.x + Arrow.MIN_DISTANCE * 2 ? vBegin.x + Arrow.MIN_DISTANCE : (vBegin.x + fEndLeft) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(x, vBegin.y));
                    arrVertex.push(new Vertex2D(arrVertex[1].x, vEnd.y - Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(vEnd.x, arrVertex[2].y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vEnd.x + rectEndCell.width / 2 + Arrow.MIN_DISTANCE, vBegin.y));
                    arrVertex.push(new Vertex2D(arrVertex[1].x, vEnd.y - Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(vEnd.x, arrVertex[2].y));
                    arrVertex.push(vEnd);
                }
            }
            else if (posEnd === Arrow.Right)
            {
                const fEndBottom = vEnd.y - rectEndCell.height / 2;

                if (vBegin.y >= fEndBottom + Arrow.MIN_DISTANCE)
                {
                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vEnd.x + Arrow.MIN_DISTANCE, vBegin.y));
                    arrVertex.push(new Vertex2D(arrVertex[1].x, vEnd.y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    const fEndLeft = vEnd.x - rectEndCell.width;
                    const x = fEndLeft >= vBegin.x + Arrow.MIN_DISTANCE * 2 ? vBegin.x + Arrow.MIN_DISTANCE : (vBegin.x + fEndLeft) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(x, vBegin.y));
                    arrVertex.push(new Vertex2D(x, fEndBottom + Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(vEnd.x + Arrow.MIN_DISTANCE, arrVertex[2].y));
                    arrVertex.push(new Vertex2D(arrVertex[3].x, vEnd.y));
                    arrVertex.push(vEnd);
                }
            }
            else if (posEnd === Arrow.Bottom)
            {
                if (vEnd.x < vBegin.x + Arrow.MIN_DISTANCE)
                {
                    const fBeginTop = vBegin.y - rectBeginCell.height / 2;
                    const y = fBeginTop >= vEnd.y + Arrow.MIN_DISTANCE * 2 ? vEnd.y + Arrow.MIN_DISTANCE : (fBeginTop + vEnd.y) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x + Arrow.MIN_DISTANCE, vBegin.y));
                    arrVertex.push(new Vertex2D(arrVertex[1].x, y));
                    arrVertex.push(new Vertex2D(vEnd.x, y));
                    arrVertex.push(vEnd);
                }
                else if (vBegin.y < vEnd.y + Arrow.MIN_DISTANCE)
                {
                    const fEndLeft = vEnd.x - rectEndCell.width / 2;
                    const x = fEndLeft >= vBegin.x + Arrow.MIN_DISTANCE * 2 ? vBegin.x + Arrow.MIN_DISTANCE : (vBegin.x + fEndLeft) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(x, vBegin.y));
                    arrVertex.push(new Vertex2D(x, vEnd.y + Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(vEnd.x, arrVertex[2].y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vEnd.x, vBegin.y));
                    arrVertex.push(vEnd);
                }
            }
            else// if (posEnd === Arrow.Left)
            {
                if (vEnd.x < vBegin.x + Arrow.MIN_DISTANCE)
                {
                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vEnd.x + rectEndCell.width + Arrow.MIN_DISTANCE, vBegin.y));
                    arrVertex.push(new Vertex2D(arrVertex[1].x, vEnd.y - rectEndCell.height / 2 - Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(vEnd.x - Arrow.MIN_DISTANCE, arrVertex[2].y));
                    arrVertex.push(new Vertex2D(arrVertex[3].x, vEnd.y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    const x = vEnd.x >= vBegin.x + Arrow.MIN_DISTANCE * 2 ? vBegin.x + Arrow.MIN_DISTANCE : (vBegin.x + vEnd.x) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(x, vBegin.y));
                    arrVertex.push(new Vertex2D(x, vEnd.y));
                    arrVertex.push(vEnd);
                }
            }
        }
        else if (posBegin === Arrow.Bottom)
        {
            if (posEnd === Arrow.Top)
            {
                const fEndLeft = vEnd.x - rectEndCell.width / 2;
                const fBeginRight = vBegin.x + rectBeginCell.width / 2;

                if (fEndLeft >= fBeginRight + Arrow.MIN_DISTANCE)
                {
                    const x = fEndLeft >= fBeginRight + Arrow.MIN_DISTANCE * 2 ? fBeginRight + Arrow.MIN_DISTANCE : (fEndLeft + fBeginRight) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x, vBegin.y + Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(x, arrVertex[1].y));
                    arrVertex.push(new Vertex2D(x, vEnd.y - Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(vEnd.x, arrVertex[3].y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x, vBegin.y + Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(vEnd.x + rectEndCell.width / 2 + Arrow.MIN_DISTANCE, arrVertex[1].y));
                    arrVertex.push(new Vertex2D(arrVertex[2].x, vEnd.y - Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(vEnd.x, vEnd.y - Arrow.MIN_DISTANCE));
                    arrVertex.push(vEnd);
                }
            }
            else if (posEnd === Arrow.Right)
            {
                const fBeginRight = vBegin.x + rectBeginCell.width / 2;
                const fEndBottom = vEnd.y + rectEndCell.height / 2;
                const y = fEndBottom > vBegin.y ? fEndBottom + Arrow.MIN_DISTANCE : vBegin.y + Arrow.MIN_DISTANCE;
                const x = vEnd.x > fBeginRight ? vEnd.x + Arrow.MIN_DISTANCE : fBeginRight + Arrow.MIN_DISTANCE;

                arrVertex.push(vBegin);
                arrVertex.push(new Vertex2D(vBegin.x, y));
                arrVertex.push(new Vertex2D(x, y));
                arrVertex.push(new Vertex2D(x, vEnd.y));
                arrVertex.push(vEnd);
            }
            else if (posEnd === Arrow.Bottom)
            {
                const fBeginRight = vBegin.x + rectBeginCell.width / 2;
                const fBeginTop = vBegin.y - rectBeginCell.height;

                if (vEnd.x >= fBeginRight + Arrow.MIN_DISTANCE)
                {
                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x, vBegin.y + Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(vEnd.x, arrVertex[1].y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    const y = fBeginTop >= vEnd.y + Arrow.MIN_DISTANCE * 2 ? vEnd.y + Arrow.MIN_DISTANCE : (vEnd.y + fBeginTop) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x, vBegin.y + Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(fBeginRight + Arrow.MIN_DISTANCE, arrVertex[1].y));
                    arrVertex.push(new Vertex2D(arrVertex[2].x, y));
                    arrVertex.push(new Vertex2D(vEnd.x, y));
                    arrVertex.push(vEnd);
                }
            }
            else// if (posEnd === Arrow.Left)
            {
                const fBeginRight = vBegin.x + rectBeginCell.width / 2;
                const fBeginTop = vBegin.y - rectBeginCell.height;

                if (vEnd.x >= fBeginRight + Arrow.MIN_DISTANCE)
                {
                    const x = vEnd.x >= fBeginRight + Arrow.MIN_DISTANCE * 2 ? vEnd.x - Arrow.MIN_DISTANCE : (vEnd.x + fBeginRight) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x, vBegin.y + Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(x, arrVertex[1].y));
                    arrVertex.push(new Vertex2D(x, vEnd.y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    const fEndBottom = vEnd.y + rectEndCell.height / 2;

                    if (fBeginTop >= fEndBottom + Arrow.MIN_DISTANCE)
                    {
                        const y = fBeginTop >= fEndBottom + Arrow.MIN_DISTANCE * 2 ? fEndBottom + Arrow.MIN_DISTANCE : (fBeginTop + fEndBottom) / 2;

                        arrVertex.push(vBegin);
                        arrVertex.push(new Vertex2D(vBegin.x, vBegin.y + Arrow.MIN_DISTANCE));
                        arrVertex.push(new Vertex2D(fBeginRight + Arrow.MIN_DISTANCE, arrVertex[1].y));
                        arrVertex.push(new Vertex2D(arrVertex[2].x, y));
                        arrVertex.push(new Vertex2D(vEnd.x - Arrow.MIN_DISTANCE, y));
                        arrVertex.push(new Vertex2D(arrVertex[4].x, vEnd.y));
                        arrVertex.push(vEnd);
                    }
                    else
                    {
                        arrVertex.push(vBegin);
                        arrVertex.push(new Vertex2D(vBegin.x, vBegin.y + Arrow.MIN_DISTANCE));
                        arrVertex.push(new Vertex2D(vBegin.x - rectBeginCell.width / 2 - Arrow.MIN_DISTANCE, arrVertex[1].y));
                        arrVertex.push(new Vertex2D(arrVertex[2].x, vEnd.y));
                        arrVertex.push(vEnd);
                    }
                }
            }
        }
        else// if (posBegin === Arrow.Left)
        {
            if (posEnd === Arrow.Top)
            {
                const fBeginTop = vBegin.y - rectBeginCell.height / 2;
                const fEndLeft = vEnd.x - rectEndCell.width / 2;
                const x = fEndLeft > vBegin.x ? vBegin.x - Arrow.MIN_DISTANCE : fEndLeft - Arrow.MIN_DISTANCE;
                const y = fBeginTop < vEnd.y ? fBeginTop - Arrow.MIN_DISTANCE : vEnd.y - Arrow.MIN_DISTANCE;

                arrVertex.push(vBegin);
                arrVertex.push(new Vertex2D(x, vBegin.y));
                arrVertex.push(new Vertex2D(x, y));
                arrVertex.push(new Vertex2D(vEnd.x, y));
                arrVertex.push(vEnd);
            }
            else if (posEnd === Arrow.Right)
            {
                const fEndBottom = vEnd.y + rectEndCell.height / 2;
                const fBeginTop = vBegin.y - rectBeginCell.height / 2;

                if (fBeginTop >= fEndBottom + Arrow.MIN_DISTANCE) {
                    const y = fBeginTop >= fEndBottom + Arrow.MIN_DISTANCE * 2 ? fBeginTop - Arrow.MIN_DISTANCE : (fBeginTop + fEndBottom) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x - Arrow.MIN_DISTANCE, vBegin.y));
                    arrVertex.push(new Vertex2D(arrVertex[1].x, y));
                    arrVertex.push(new Vertex2D(vEnd.x + Arrow.MIN_DISTANCE, y));
                    arrVertex.push(new Vertex2D(arrVertex[3].x, vEnd.y));
                    arrVertex.push(vEnd);
                }
                else {
                    const fBeginRight = vBegin.x + rectBeginCell.width;

                    if (vEnd.x >= fBeginRight + Arrow.MIN_DISTANCE) {
                        arrVertex.push(vBegin);
                        arrVertex.push(new Vertex2D(vBegin.x - Arrow.MIN_DISTANCE, vBegin.y));
                        arrVertex.push(new Vertex2D(arrVertex[1].X, vBegin.y + rectBeginCell.height / 2 + Arrow.MIN_DISTANCE));
                        arrVertex.push(new Vertex2D(vEnd.x + Arrow.MIN_DISTANCE, arrVertex[2].y));
                        arrVertex.push(new Vertex2D(arrVertex[3].x, vEnd.y));
                        arrVertex.push(vEnd);
                    }
                    else {
                        arrVertex.push(vBegin);
                        arrVertex.push(new Vertex2D(vBegin.x - Arrow.MIN_DISTANCE, vBegin.y));
                        arrVertex.push(new Vertex2D(arrVertex[1].x, vEnd.y + rectEndCell.height / 2 + Arrow.MIN_DISTANCE));
                        arrVertex.push(new Vertex2D(vEnd.x + Arrow.MIN_DISTANCE, arrVertex[2].y));
                        arrVertex.push(new Vertex2D(arrVertex[3].x, vEnd.y));
                        arrVertex.push(vEnd);
                    }
                }
                /*const fBeginTop = vBegin.y - rectBeginCell.height / 2;
                const fEndBottom = vEnd.y + rectEndCell.height / 2;

                if (fBeginTop >= fEndBottom + Arrow.MIN_DISTANCE)
                {
                    const y = fBeginTop >= fEndBottom + Arrow.MIN_DISTANCE * 2 ? fEndBottom + Arrow.MIN_DISTANCE : (fBeginTop + fEndBottom) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x - Arrow.MIN_DISTANCE, vBegin.y));
                    arrVertex.push(new Vertex2D(arrVertex[1].x, y));
                    arrVertex.push(new Vertex2D(vEnd.x + Arrow.MIN_DISTANCE, y));
                    arrVertex.push(new Vertex2D(arrVertex[3].x, vEnd.y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    const fBeginRight = vBegin.x + rectBeginCell.width;

                    if (vEnd.x > fBeginRight)
                    {
                        arrVertex.push(vBegin);
                        arrVertex.push(new Vertex2D(vBegin.x - Arrow.MIN_DISTANCE, vBegin.y));
                        arrVertex.push(new Vertex2D(arrVertex[1].x, vBegin.y + rectBeginCell.height / 2 + Arrow.MIN_DISTANCE));
                        arrVertex.push(new Vertex2D(vEnd.x + Arrow.MIN_DISTANCE, arrVertex[2].y));
                        arrVertex.push(new Vertex2D(arrVertex[3].x, vEnd.y));
                        arrVertex.push(vEnd);
                    }
                    else
                    {
                        const fEndLeft = vEnd.x - rectEndCell.width;
                        const x = fEndLeft > vBegin.x ? vBegin.x - Arrow.MIN_DISTANCE : fEndLeft - Arrow.MIN_DISTANCE;

                        arrVertex.push(vBegin);
                        arrVertex.push(new Vertex2D(x, vBegin.y));
                        arrVertex.push(new Vertex2D(x, vEnd.y - rectEndCell.height / 2 - Arrow.MIN_DISTANCE));
                        arrVertex.push(new Vertex2D(vEnd.x + Arrow.MIN_DISTANCE, arrVertex[2].y));
                        arrVertex.push(new Vertex2D(arrVertex[3].x, vEnd.y));
                        arrVertex.push(vEnd);
                    }
                }*/
            }
            else if (posEnd === Arrow.Bottom)
            {
                const fBeginTop = vBegin.y - rectEndCell.height / 2;

                if (fBeginTop >= vEnd.y + Arrow.MIN_DISTANCE)
                {
                    const fEndLeft = vEnd.x - rectEndCell.width / 2;
                    const y = fBeginTop >= vEnd.y + Arrow.MIN_DISTANCE * 2 ? vEnd.y + Arrow.MIN_DISTANCE : (fBeginTop + vEnd.y) / 2;
                    const x = fEndLeft > vBegin.x ? vBegin.x - Arrow.MIN_DISTANCE : fEndLeft - Arrow.MIN_DISTANCE;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(x, vBegin.y));
                    arrVertex.push(new Vertex2D(x, y));
                    arrVertex.push(new Vertex2D(vEnd.x, y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    const fBeginRight = vBegin.x + rectBeginCell.width;

                    if (vEnd.x > fBeginRight)
                    {
                        arrVertex.push(vBegin);
                        arrVertex.push(new Vertex2D(vBegin.x - Arrow.MIN_DISTANCE, vBegin.y));
                        arrVertex.push(new Vertex2D(arrVertex[1].x, vBegin.y + rectBeginCell.height / 2 + Arrow.MIN_DISTANCE));
                        arrVertex.push(new Vertex2D(vEnd.x, arrVertex[2].y));
                        arrVertex.push(vEnd);
                    }
                    else
                    {
                        const fEndLeft = vEnd.x - rectEndCell.width / 2;
                        const x = fEndLeft > vBegin.x ? vBegin.x - Arrow.MIN_DISTANCE : fEndLeft - Arrow.MIN_DISTANCE;
                        const y = (fBeginTop + vEnd.y) / 2;

                        arrVertex.push(vBegin);
                        arrVertex.push(new Vertex2D(x, vBegin.y));
                        arrVertex.push(new Vertex2D(x, y));
                        arrVertex.push(new Vertex2D(vEnd.x, y));
                        arrVertex.push(vEnd);
                    }
                }
            }
            else// if (posEnd === Arrow.Left)
            {
                const fBeginTop = vBegin.y - rectBeginCell.height / 2;

                if (fBeginTop >= vEnd.y + Arrow.MIN_DISTANCE)
                {
                    const x = vEnd.x > vBegin.x ? vBegin.x - Arrow.MIN_DISTANCE : vEnd.x - Arrow.MIN_DISTANCE;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(x, vBegin.y));
                    arrVertex.push(new Vertex2D(x, vEnd.y));
                    arrVertex.push(vEnd);
                }
                else
                {
                    const fBeginRight = vBegin.x + rectBeginCell.width;
                    const x = vEnd.x >= fBeginRight + Arrow.MIN_DISTANCE * 2 ? vEnd.x - Arrow.MIN_DISTANCE : (vEnd.x + fBeginRight) / 2;

                    arrVertex.push(vBegin);
                    arrVertex.push(new Vertex2D(vBegin.x - Arrow.MIN_DISTANCE, vBegin.y));
                    arrVertex.push(new Vertex2D(arrVertex[1].x, fBeginTop - Arrow.MIN_DISTANCE));
                    arrVertex.push(new Vertex2D(x, arrVertex[2].y));
                    arrVertex.push(new Vertex2D(x, vEnd.y));
                    arrVertex.push(vEnd);
                }
            }
        }

        return arrVertex;
    }

    // 우측 상단에서 좌측 하단 방향으로 화살표
    calcNEArrowLine(vBegin, vEnd, beginCell, endCell, posBegin, posEnd)
    {
        // NE의 반대인 SW를 사용한다.
        let arrVertex = this.calcSWArrowLine(vEnd, vBegin, endCell, beginCell, posEnd, posBegin);

        // Begin과 End를 바꾸어서 계산하였으므로, m_arrPoint의 순서를 뒤집어준다.
        const vertexCount = arrVertex.length;
        const halfCount = vertexCount / 2;

        for (let i = 0; i < halfCount; i++)
        {
            const v1 = arrVertex[i];
            const v2 = arrVertex[vertexCount - 1 - i];
            const vTemp = v1;

            arrVertex[i] = v2;
            arrVertex[vertexCount - 1 - i] = vTemp;
        }

        return arrVertex;
    }

    // 우측 하단에서 좌측 상단 방향으로 화살표
    calcSEArrowLine(vBegin, vEnd, beginCell, endCell, posBegin, posEnd)
    {
        // SE의 반대인 NW를 사용한다.
        let arrVertex = this.calcNWArrowLine(vEnd, vBegin, endCell, beginCell, posEnd, posBegin);

        // Begin과 End를 바꾸어서 계산하였으므로, arrVertex의 순서를 뒤집어준다.
        const vertexCount = arrVertex.length;
        const halfCount = vertexCount / 2;

        for (let i = 0; i < halfCount; i++)
        {
            const v1 = arrVertex[i];
            const v2 = arrVertex[vertexCount - 1 - i];
            const vTemp = v1;

            arrVertex[i] = v2;
            arrVertex[vertexCount - 1 - i] = vTemp;
        }

        return arrVertex;
    }

    hitTest(vertex) {
        const vertexList = Geometry.stringToVertexList(this.polylineVertices);
        const distance = Geometry.getPolylineDistance(vertexList, vertex);

        if (distance === null) {
            return false;
        }

        if (distance <= Arrow.HitTestDistance) {
            return true;
        }

        return false;
    }

    static getTriangleStyle(isSelected) {
        if (isSelected) {
            return Arrow.SelectedTriangleStyle;
        }

        return Arrow.TriangleStyle;
    }

    static getArrowInfo2(arrow, sections) {
        const beginComponentInfo = arrow.getComponentInfo(arrow.beginCell, sections);

        if (beginComponentInfo === null) {
            return null;
        }

        const endComponentInfo = arrow.getComponentInfo(arrow.endCell, sections);

        if (endComponentInfo === null) {
            return null;
        }

        //return beginComponentType, beginComponentID, endComponentType, endComponentID
        return [beginComponentInfo[3], beginComponentInfo[0], endComponentInfo[3], endComponentInfo[0]];
        //const json = {
        //    "id": arrow.id,
        //    "beginComponentID": beginComponentInfo[0],
        //    "beginComponentColumnIndex": beginComponentInfo[1],
        //    "beginComponentRowIndex": beginComponentInfo[2],
        //    "beginComponentPosition": arrow.beginPosition,
        //    "endComponentID": endComponentInfo[0],
        //    "endComponentColumnIndex": endComponentInfo[1],
        //    "endComponentRowIndex": endComponentInfo[2],
        //    "endComponentPosition": arrow.endPosition,
        //    "text": arrow.text
        //}

        //return json;
    }

    render() {
        if (this.props.arrow === null) {
            return <></>;
        }

        const isSelected = this.props.selectedArrowData === this.props.arrow;
        const polylineStyle = { ...this.props.arrow.polylineStyle };

        if (isSelected) {
            polylineStyle.stroke = Arrow.SelectedColor;
        }

        if (this.props.arrow.isDashLine) {
            return (
                <>
                    <ArrowPolyline arrow={this.props.arrow} polylineStyle={polylineStyle} mode={this.props.mode} />
                </>
            );
        }

        return (
            <>
                <ArrowPolyline arrow={this.props.arrow} polylineStyle={polylineStyle} mode={this.props.mode} />
                <ArrowTriangle arrow={this.props.arrow} isSelected={isSelected} mode={this.props.mode} />
            </>
        );
    }
}

export default Arrow;