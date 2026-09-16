import React, { Component } from 'react';

class StatusInfoRackItem extends Component {
    constructor(props) {
        super(props);

        this.refSelectedSensor = React.createRef();
        this.refNotSelectedSensor = React.createRef();
    }

    componentDidUpdate() {
        if (this.refSelectedSensor.current !== null) {
            this.refSelectedSensor.current.scrollIntoView({behavior : "smooth", block: "center"});
        }
    }

    checkAlarmStatus = (itemNo) => {
        const sensorAlarms = this.props.sensorAlarms;

        if (sensorAlarms && sensorAlarms.length > 0) {
            for (let alarm of sensorAlarms) {
                if (alarm.itemNo === itemNo) {
                    return true;
                }
            }
        }
        
        return false;
    }

    getItemsUI() {
        const ui = [];

        if (this.props.items && this.props.items?.length > 0) {
            
            for (let i = 0; i < this.props.items.length; i++) {
                const item = this.props.items[i];

                if (item.visible === false && this.props.searchText.length > 0)
                    continue;

                const itemClass = this.props.selectedStatusInfo.item?.itemNo === item.itemNo ? 'on' : '';
                const ref = this.props.selectedStatusInfo.item?.itemNo === item.itemNo ? this.refSelectedSensor : this.refNotSelectedSensor;

                const isAlarm = this.checkAlarmStatus(item.itemNo);

                ui.push(
                    <li key={'item_' + item.itemNo}>
                        <ul className={itemClass} ref={ref} onClick={(e) => this.props.setSelectedRackItem(item, e)}> 
                            <li>{item.uPos}</li>
                            <li>{item.equipmentTypeName}</li>
                            <li>{item.itemName}</li>
                            <li>{item.itemType.unit}U</li>
                            <li>활성화</li>
                            <li className={isAlarm ? 'on' : null}>알람여부</li>
                        </ul>
                    </li>
                );
            }
        }

        return ui;
    }

    render() {
        let itemsUI = this.getItemsUI();

        return (
            <>
                {itemsUI}
            </>
        )
    }
}

export default StatusInfoRackItem;