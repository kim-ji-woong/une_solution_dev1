import React, { Component } from 'react';

class ColComboBox extends Component {
    constructor(props) {
        super(props);
        this.state =
        {
            value: null,     // 선택된 값
        };

        this.props = props;

        if (this.props.value >= 0) {
            this.state.value = this.props.value;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.options !== this.props.options) {
            this.setState({ options: this.props.options });
        }
    }

    onChangeCheck = (e) => {
        let value = Number(e.target.value);
        if (!value && value !== 0)
            value = null;

        this.props.onChange(this.props.type, value, this.props.member);
    }

    render() {
        let value = this.state.value;

        return (
            <select defaultValue={value} onChange={(e) => this.onChangeCheck(e)} >
            {
                this.props.options.map((level, index) =>
                (
                    <option key={level.value} value={level.value}>{level.name}</option>
                ))
            }
            </select>
        );
    }
}

export default ColComboBox;