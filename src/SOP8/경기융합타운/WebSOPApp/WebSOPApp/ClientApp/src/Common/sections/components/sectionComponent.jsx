import React, { Component } from 'react';
import Arrow from './arrow';
import ArrowButton from './arrowButton';

class SectionComponent extends Component {
    constructor(props)
    {
        super(props);
        this.props = props;
    }

    getStyleValue(componentType)
    {
        const cellOffsetHeight = this.props.parentCell == null || this.props.parentCell.current == null ? 0 : this.props.parentCell.current.offsetHeight;
        const topMargin = 60;//px
        const borderThick = 4;//px
        const cellHeight = cellOffsetHeight - borderThick;
        
        let styleValue = "";

        if (componentType === "decision")
        {
            const componentHeight = cellHeight - topMargin - borderThick * 2;
            const topBorder = 6;//px
            const borderRatio = topBorder / (cellHeight - topMargin) * 100;
            const inverseRatio = 100 - borderRatio;

            const clipPath = `polygon(50% ${topBorder}px, ${borderRatio}% 50%, 50% calc(100% - ${topBorder}px), ${inverseRatio}% 50%)`;
            styleValue = {lineHeight: componentHeight + "px", clipPath: clipPath};
        }
        else
        {
            //const componentHeight = cellHeight - topMargin * 2 - borderThick * 2;
            //styleValue = { lineHeight: componentHeight + "px" };
            styleValue = { lineHeight: "20px" };
        }

        return styleValue;
    }

    makeArrowButtons()
    {
        const buttons = [];

        buttons.push(<ArrowButton key={Arrow.Top} positionType={Arrow.Top} onClickArrowButton={this.props.onClickArrowButton} mode={this.props.mode} />);
        buttons.push(<ArrowButton key={Arrow.Bottom} positionType={Arrow.Bottom} onClickArrowButton={this.props.onClickArrowButton} mode={this.props.mode} />);
        buttons.push(<ArrowButton key={Arrow.Left} positionType={Arrow.Left} onClickArrowButton={this.props.onClickArrowButton} mode={this.props.mode} />);
        buttons.push(<ArrowButton key={Arrow.Right} positionType={Arrow.Right} onClickArrowButton={this.props.onClickArrowButton} mode={this.props.mode} />);

        return buttons;
    }

    getSectionData() {
        return this.props.sectionData;
    }
}

export default SectionComponent;