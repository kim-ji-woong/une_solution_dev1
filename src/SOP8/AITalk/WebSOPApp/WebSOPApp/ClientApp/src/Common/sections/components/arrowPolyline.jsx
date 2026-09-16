import React, { Component } from 'react';

class ArrowPolyline extends Component {
    getPolyline()
    {
        if (this.props.arrow.polylineVertices === null)
        {
            return null;
        }

        if (this.props.arrow.polylineID !== null)
        {
            if (this.props.arrow.polylineDash !== null)
            {
                return <polyline key={this.props.arrow.polylineID} id={this.props.arrow.polylineID} points={this.props.arrow.polylineVertices} fill="none" style={this.props.polylineStyle} strokeDasharray={this.props.arrow.polylineDash} />;
            }
            else
            {
                return <polyline key={this.props.arrow.polylineID} id={this.props.arrow.polylineID} points={this.props.arrow.polylineVertices} fill="none" style={this.props.polylineStyle} />;
            }
        }

        if (this.props.arrow.polylineDash !== null)
        {
            return <polyline points={this.props.arrow.polylineVertices} fill="none" style={this.props.polylineStyle} strokeDasharray={this.props.arrow.polylineDash} />;
        }

        return <polyline points={this.props.arrow.polylineVertices} fill="none" style={this.props.polylineStyle} />;
    }

    getText() {
        if (this.props.arrow.text && this.props.arrow.text.length > 0 && this.props.arrow.textCenter !== null) {
            if (this.props.mode === "exec") {
                return <text className={'arrowText'} x={this.props.arrow.textCenter.x} y={this.props.arrow.textCenter.y} textAnchor="middle" fontSize={20}>{this.props.arrow.text}</text>;
            }
            else {
                return <text x={this.props.arrow.textCenter.x} y={this.props.arrow.textCenter.y} textAnchor="middle" fontSize={20}>{this.props.arrow.text}</text>;
            }
        }

        return <></>;
    }

    render() {
        const polyline = this.getPolyline();

        if (polyline === null)
        {
            return <></>;
        }

        return (
            <>
                {
                    polyline
                }
                {
                    this.getText()
                }
            </>
        );
    }
}

export default ArrowPolyline