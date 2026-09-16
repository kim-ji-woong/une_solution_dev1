import React, { Component } from 'react';
import { MainController } from '../../services/mainController';
import StatusInfoRackItem from './statusInfoRackItem';

class StatusInfoRackGroup extends Component {
    constructor(props) {
        super(props);

        this.refSelectedRack = React.createRef();
        this.refNotSelectedRack = React.createRef();
    }

    componentDidUpdate() {
        if (this.refSelectedRack.current !== null) {
            this.refSelectedRack.current.scrollIntoView({behavior : "smooth", block: "center"});
        }
    }

    onClickShowHide = (rack) => {
        this.props.setSelectedRack(rack);
    }

    onClickShowHide = (rack) => {
        this.props.setSelectedRack(rack);
    }

    getRackUI = () => {
        const ui = [];
        const { rackItems } = this.props;

        if (this.props.rackGroup.racks) {
            const racksDatas = this.props.rackGroup.racks;

            for (let i = 0; i < racksDatas.length; i++) {
                const rack = racksDatas[i];

                if (rack.visible === false && this.props.searchText.length > 0)
                    continue;

                const rackClass = this.props.selectedStatusInfo.rack?.rackNo === rack.rackNo ? 'on' : '';
                const rackChildClass = rackClass ? 'tree-2depth on' : 'tree-2depth';

                const ref = this.props.selectedStatusInfo.rack?.rackNo === rack.rackNo ? this.refSelectedRack : this.refNotSelectedRack;

                const items = rackItems[rack.rackNo] || [];

                ui.push(
                    <li key={'rack_' + rack.rackNo} onClick={() => this.onClickShowHide(rack)}>
                        <div ref={ref}>
                            <p className={rackClass}>
                                {rack.rackName}
                            </p>
                            <p className={rackClass}>{items.length}</p>
                        </div>
                        <ul className={rackChildClass} id={'rack_' + rack.rackNo}>
                            <StatusInfoRackItem
                                id={'rack_' + rack.rackNo}
                                key={rack.rackNo}
                                searchText={this.props.searchText}
                                selectedStatusInfo={this.props.selectedStatusInfo}
                                items={items}
                                setSelectedRackItem={this.props.setSelectedRackItem}
                                sensorAlarms={this.props.sensorAlarms}
                            />
                        </ul>
                    </li>
                );
            }
        }

        return ui;
    }

    render() {
        let buildingUI = this.getRackUI();

        return (
            <>
                {buildingUI}
            </>
        );
    }
}

export default StatusInfoRackGroup;