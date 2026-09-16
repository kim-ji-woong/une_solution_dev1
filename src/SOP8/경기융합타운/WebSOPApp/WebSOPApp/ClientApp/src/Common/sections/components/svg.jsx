import React, { Component } from 'react';
//import Vertex2D from '../../util/Vertex2D';
import Arrow from './arrow';

import { SvgComponent } from '../../../SOPSimulator/styled/sectionGridStyled';

class Svg extends Component {
    static AddArrow = 0;
    static RemoveArrow = 1;
    static MoveArrow = 2;
    static TempArrow = 3;

    static TempLineStyle = {stroke: "rgb(128, 128, 128)", strokeWidth: 4};
    static TempDashed = "5, 5";

    constructor(props)
    {
        super(props);
        this.props = props;
        this.props.setChangeArrowFunction(this.onChangeArrow, this.onDrawAreaRect);
        //this.props.setRemoveComponentFunction(this.onRemoveComponent);

        this.state =
        {
            //arrows: [],
            tempArrowBegin: null,
            tempArrowEnd: null,
            areaRectBegin: null,
            areaRectEnd: null
        }
    }

    onChangeArrow = (arrow, vPos, type) =>
    {
        if (type === Svg.TempArrow) {
            if (arrow !== null && vPos !== null) {
                const vBegin = arrow.getBeginVertex();

                if (vBegin !== null && vPos !== null) {
                    //const arrows = [...this.state.arrows];
                    this.setState(
                        {
                            /*arrows: arrows, */tempArrowBegin: vBegin,
                            tempArrowEnd: vPos,
                            areaRectBegin: null,
                            areaRectEnd: null
                        });
                }
            }
            else {
                if (this.state.tempArrowBegin !== null || this.state.tempArrowEnd !== null) {
                    //const arrows = [...this.state.arrows];
                    this.setState(
                        {
                            /*arrows: arrows, */tempArrowBegin: null,
                            tempArrowEnd: null,
                            areaRectBegin: null,
                            areaRectEnd: null
                        });
                }
            }
        }
        else if (type === Svg.AddArrow) {
            if (arrow !== null) {
                const arrows = this.props.stepMember == null ? [] : this.props.stepMember.arrows;

                if (arrows !== null) {
                    //const arrows = [...this.state.arrows];
                    const _arrow = arrow.makeArrow(this.props.stepMember);

                    if (_arrow !== null) {
                        arrows.push(_arrow);
                    }

                    this.setState(
                        {
                            /*arrows: arrows, */tempArrowBegin: null,
                            tempArrowEnd: null,
                            areaRectBegin: null,
                            areaRectEnd: null
                        });
                }
            }
        }
        else if (type === Svg.RemoveArrow) {
            if (arrow === null) {
                this.setState({ tempArrowBegin: null, tempArrowEnd: null });
            }
            else {
                const arrows = this.props.stepMember == null ? [] : this.props.stepMember.arrows;

                if (arrows !== null) {
                    for (let i = 0; i < arrows.length; i++) {
                        if (arrows[i] === arrow) {
                            arrows.splice(i, 1);
                            break;
                        }
                    }

                    this.setState(
                        {
                            /*arrows: arrows, */tempArrowBegin: null,
                            tempArrowEnd: null,
                            areaRectBegin: null,
                            areaRectEnd: null
                        }
                    );
                }
            }
        }
    }

    onDrawAreaRect = (vPos1, vPos2) => {
        this.setState(
            {
                tempArrowBegin: null,
                tempArrowEnd: null,
                areaRectBegin: vPos1,
                areaRectEnd: vPos2
            });
    }

    //onRemoveComponent = (columnIndex, rowIndex) =>
    //{
    //    const arrows = this.props.stepMember == null ? [] : this.props.stepMember.arrows;

    //    if (arrows !== null)
    //    {
    //        //const arrows = [...this.state.arrows];
    //        const arrowCount = arrows.length;
    //        let isChanged = false;

    //        for (let i = arrowCount - 1; i >= 0; i--) {
    //            const arrow = arrows[i];

    //            if (arrow.linkedCell(columnIndex, rowIndex)) {
    //                isChanged = true;
    //                arrows.splice(i, 1);
    //            }
    //        }

    //        if (isChanged) {
    //            this.setState({ /*arrows: arrows, */tempArrowBegin: null, tempArrowEnd: null });
    //        }
    //    }
    //}

    makeTempArrow()
    {
        if (this.state.tempArrowBegin === null ||
            this.state.tempArrowEnd === null)
        {
            return null;
        }

        return this.makeLineElement(this.state.tempArrowBegin,
                this.state.tempArrowEnd,
                Svg.TempLineStyle,
                "tempArrowLine",
                Svg.TempDashed);
    }

    makeLineElement(vBegin, vEnd, styleValue, id, dashed)
    {
        if (id === null)
        {
            if (dashed === null)
            {
                return <line x1={vBegin.x} y1={vBegin.y} x2={vEnd.x} y2={vEnd.y} style={styleValue} />;
            }
            else
            {
                return <line x1={vBegin.x} y1={vBegin.y} x2={vEnd.x} y2={vEnd.y} style={styleValue} strokeDasharray={dashed} />;
            }
        }
       
        if (dashed === null)
        {
            return <line id={id} x1={vBegin.x} y1={vBegin.y} x2={vEnd.x} y2={vEnd.y} style={styleValue} />;
        }

        return <line id={id} x1={vBegin.x} y1={vBegin.y} x2={vEnd.x} y2={vEnd.y} style={styleValue} strokeDasharray={Svg.TempDashed} />;
    }

    makeAreaRect() {
        if (this.state.areaRectBegin && this.state.areaRectEnd) {
            let left, right, top, bottom;

            if (this.state.areaRectBegin.x < this.state.areaRectEnd.x) {
                left = this.state.areaRectBegin.x;
                right = this.state.areaRectEnd.x;
            }
            else {
                left = this.state.areaRectEnd.x;
                right = this.state.areaRectBegin.x;
            }

            if (this.state.areaRectBegin.y < this.state.areaRectEnd.y) {
                bottom = this.state.areaRectBegin.y;
                top = this.state.areaRectEnd.y;
            }
            else {
                bottom = this.state.areaRectEnd.y;
                top = this.state.areaRectBegin.y;
            }

            const points = `${left},${top} ${right},${top} ${right},${bottom} ${left},${bottom} ${left},${top}`;
            return <polyline className={'svgPolyline'} points={points}></polyline>;
        }

        return <></>;
    }

    render() {
        const temporaryArrow = this.makeTempArrow();
        const areaRect = this.makeAreaRect();
        const arrows = this.props.stepMember && this.props.stepMember.arrows ? this.props.stepMember.arrows : [];

        return (
            <SvgComponent>
                {
                    arrows.map((arrow) => arrow.beginCell && arrow.endCell && (
                        <Arrow key={arrow.getArrowID()} selectedArrowData={this.props.selectedArrowData} arrow={arrow} mode={this.props.mode} />
                    ))
                }
                {temporaryArrow}
                {areaRect}
            </SvgComponent>
        );
    }
}

export default Svg;