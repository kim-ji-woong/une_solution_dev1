import React, { Component } from 'react';
import SectionGridCell from './sectionGridCell';
import SectionPanel from './sectionPanel';

class SectionGridColumn extends Component {
    constructor(props) {
        super(props);

        this.props = props;
        this.refColumn = React.createRef();

        this.state = {
            instance: this,
            prevProps: props
        }
    }

    componentDidMount() {
        if (this.props.columnRef) {
            const columnWidth = this.props.columnRef.current.getBoundingClientRect().width;
            this.refColumn.current.style.width = columnWidth + "px";

            if (this.props.stepMemberData) {
                this.props.stepMemberData.grid.columns[this.props.index] = parseInt(columnWidth.toFixed());
            }
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props === state.prevProps) {
            return state;
        }

        if (state.instance?.refColumn && state.prevProps?.columnRef) {
            const columnWidth = state.prevProps.columnRef.current.getBoundingClientRect().width;
            state.instance.refColumn.current.style.width = columnWidth + "px";

            if (props.stepMemberData) {
                props.stepMemberData.grid.columns[props.index] = parseInt(columnWidth.toFixed());
            }
        }

        return {
            instance: state.instance,
            prevProps: props
        };
    }

    onRemoveComponent = (rowIndex) =>
    {
        this.props.onRemoveComponent(this.props.index, rowIndex);
    }

    getSelectedCells() {
        const selectedCells = [];

        for (let i = 0; i < this.props.rowCount; i++) {
            selectedCells.push(false);
        }

        if (!this.props.selectedCells) {
            return selectedCells;
        }

        const selectedColumnCells = this.props.selectedCells[this.props.index] ? this.props.selectedCells[this.props.index] : [];

        selectedColumnCells.map(cellIndex => {
            if (cellIndex < this.props.rowCount) {
                selectedCells[cellIndex] = true;
            }
        });

        return selectedCells;
    }

    render() {
        const cells = [];
        const selectedCells = this.getSelectedCells();
        
        for (let i=0;i<this.props.rowCount;i++)
        {
            cells.push(<SectionGridCell key={i}
                columnIndex={this.props.index}
                index={i}
                rowRef={this.props.rowRefs[i]}
                currentMenu={this.props.currentMenu}
                onClickArrowButton={this.props.onClickArrowButton}
                getCurrentArrow={this.props.getCurrentArrow}
                onClickCell={this.props.onClickCell}
                isSelected={selectedCells[i]}
                onSelectCell={this.props.onSelectCell}
                onRemoveComponent={this.onRemoveComponent}
                onSelectComponent={this.props.onSelectComponent}
                onSelectArrow={this.props.onSelectArrow}
                onAddComponent={this.props.onAddComponent}
                onProcessEdit={this.props.onProcessEdit}
                setLButtonDownPosition={this.props.setLButtonDownPosition}
                getLButtonDownPosition={this.props.getLButtonDownPosition}
                sopData={this.props.sopData}
                selectedSectionData={this.props.selectedSectionData}
                actionStep={this.props.actionStep}
                stepMemberData={this.props.stepMemberData}
                mode={this.props.mode}
            />);
        }

        return (
            <div
                ref={this.refColumn}
                className={'sectionGridColumn'}
                data-index={this.props.index}>
                {cells}
            </div>
        );
    }
}

export default SectionGridColumn;