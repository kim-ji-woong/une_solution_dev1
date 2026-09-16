import React, { Component } from 'react';
import { DataCenterInfoComponent } from '../styled/dashboardStyled';

class DataCenterInfo extends Component {

    constructor(props){
        super(props);
    }

    getDataCenters = (dataCenters) => {
        let ui = [];

        for (let data of dataCenters) {
            ui.push(
                <li 
                    key={data.dataCenterNo} 
                    className={this.props.selectedCenterNo === data.dataCenterNo ? 'on' : null}
                    onClick={(e) => this.props.setSelectedCenter(data, e)}
                >
                    {data.dataCenterName}
                </li>
            );
        }

        return ui;
    }

    getDataCenterList = () => {
        let ui = [];
        const dataCenterList = this.props.dataCenterList;

        if (dataCenterList && dataCenterList.length > 0) {
            for (let data of dataCenterList) {
                if (data.dataCenters.length > 0) {
                    ui.push(
                        <div className={this.props.selectedRegionNo === data.region.regionNo ? 'npListArea on' : 'npListArea'} key={data.region.regionNo} onClick={() => this.props.setSelectedRegion(data.region.regionNo)}>
                            <div className={'npListBox'}>
                                <span></span>
                                <span>{data.region.regionName}</span>
                                <span>{data.dataCenters.length}</span>
                                <span></span>
                            </div>
                            <ul>
                                {this.getDataCenters(data.dataCenters)}
                            </ul>
                        </div>
                    );
                }
            }
        }

        return ui;
    }

    render(){
        const dataCenterList = this.getDataCenterList();

        return (
            <DataCenterInfoComponent>
                <div className={'npListTitle'}>
                    <span className={'npIcon'}></span>
                    <span className={'npTitle'}>국사목록</span>
                </div>
                {dataCenterList}
            </DataCenterInfoComponent>
        );
    }
}

export default DataCenterInfo;