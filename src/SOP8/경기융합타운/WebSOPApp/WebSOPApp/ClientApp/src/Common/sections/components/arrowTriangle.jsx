import React, { Component } from 'react';
import Arrow from './arrow';

class ArrowTriangle extends Component{
    getTriangle()
    {
        if (!this.props.arrow.triangleVertices ||
            this.props.arrow.endPosition === Arrow.None ||
            !this.props.arrow.endVertex)
        {
            return null;
        }

        if (this.props.arrow.endPosition === Arrow.Top)
        {
            const x1 = this.props.arrow.endVertex.x - Arrow.TriangleWidth / 2;
            const y = this.props.arrow.endVertex.y - Arrow.TriangleHeight;
            const x2 = this.props.arrow.endVertex.x + Arrow.TriangleWidth / 2;
            const points = `${x1},${y} ${x2},${y} ${this.props.arrow.endVertex.x},${this.props.arrow.endVertex.y}`;

            return <polyline points={points} style={Arrow.getTriangleStyle(this.props.isSelected)} />;
        }
        else if (this.props.arrow.endPosition === Arrow.Bottom)
        {
            const x1 = this.props.arrow.endVertex.x - Arrow.TriangleWidth / 2;
            const y = this.props.arrow.endVertex.y + Arrow.TriangleHeight;
            const x2 = this.props.arrow.endVertex.x + Arrow.TriangleWidth / 2;
            const points = `${x1},${y} ${x2},${y} ${this.props.arrow.endVertex.x},${this.props.arrow.endVertex.y}`;

            return <polyline points={points} style={Arrow.getTriangleStyle(this.props.isSelected)} />;
        }
        else if (this.props.arrow.endPosition === Arrow.Left)
        {
            const y1 = this.props.arrow.endVertex.y - Arrow.TriangleHeight / 2;
            const x = this.props.arrow.endVertex.x - Arrow.TriangleWidth;
            const y2 = this.props.arrow.endVertex.y + Arrow.TriangleHeight / 2;
            const points = `${x},${y1} ${x},${y2} ${this.props.arrow.endVertex.x},${this.props.arrow.endVertex.y}`;

            return <polyline points={points} style={Arrow.getTriangleStyle(this.props.isSelected)} />;
        }
        else// if (this.props.arrow.endPositionType === Arrow.Right)
        {
            const moveX = 5;

            const y1 = this.props.arrow.endVertex.y - Arrow.TriangleHeight / 2;
            const x = this.props.arrow.endVertex.x + Arrow.TriangleWidth - moveX;
            const y2 = this.props.arrow.endVertex.y + Arrow.TriangleHeight / 2;
            const points = `${x},${y1} ${x},${y2} ${this.props.arrow.endVertex.x - moveX},${this.props.arrow.endVertex.y}`;

            return <polyline points={points} style={Arrow.getTriangleStyle(this.props.isSelected)} />;
        }

        return null;
    }

    render() {
        const triangle = this.getTriangle();

        if (triangle === null)
        {
            return <></>;
        }

        return (
            triangle
        );
    }
}

export default ArrowTriangle;