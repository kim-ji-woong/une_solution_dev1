import React, { Component } from 'react';
import Arrow from './arrow';
import $ from 'jquery';

import { ArrowButtonComponent } from '../../../SOPSimulator/styled/sectionGridStyled';

const PositionType = { Top : 0, Right : 1, Bottom : 2, Left : 3, None : 4 };

class ArrowButton extends Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.refButton = React.createRef();

        this.state =
        {
            positionType: this.props.positionType,
            instance: this,
            prevProps: this.props
        };
    }

    componentDidMount() {
        // �������� ��� ������Ʈ ȭ��ǥ �Ⱥ��̰� ó��
        if (this.props.mode === "exec") {
            const className = this.getClassName();

            $('.' + className).css('background-image', 'none');
            $('.' + className + ':hover').css('background-image', 'none');
        }
    }

    getClassName()
    {
        if (this.state.positionType === Arrow.Top)
        {
            return 'btnArrowTop';
        }
        else if (this.state.positionType === Arrow.Bottom)
        {
            return 'btnArrowBottom';
        }
        else if (this.state.positionType === Arrow.Left)
        {
            return 'btnArrowLeft';
        }
        else if (this.state.positionType === Arrow.Right)
        {
            return 'btnArrowRight';
        }

        return "";
    }

    onClickButton = () =>
    {
        this.props.onClickArrowButton(this.refButton.current, this.state.positionType);
    }

    render() {
        const className = this.getClassName();

        return (
            <ArrowButtonComponent ref={this.refButton} className={className} onClick={this.onClickButton}>
            </ArrowButtonComponent>
        );
    }
}

export default ArrowButton;