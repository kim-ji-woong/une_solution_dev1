import React, { Component } from 'react';

import { FacilityInfoComponent, NoFacilityInfoComponent } from '../../styled/mainStyled';

class FacilityInfo extends Component {
    constructor(props) {
        super(props);

    }

    getFacilityInfoUI = () => {
        const ui = [];

        const facilityImagePath = this.props.facilityImagePath;
        
        if (facilityImagePath === null || facilityImagePath === undefined) {
            ui.push(
                <NoFacilityInfoComponent key='facilityInfo' className='UI_Section'>
                    <p>설비정보가 존재하지 않습니다</p>
                    <div className={'close'} onClick={() => this.props.handleModalPopup('facility', false)}>
                        <button>닫기버튼</button>
                    </div>
                </NoFacilityInfoComponent>
            );
        }
        else {
            ui.push(
                <FacilityInfoComponent key='facilityInfo' className='UI_Section'>
                    <img src={this.props.facilityImagePath} alt='설비 정보 이미지' />
                    <button onClick={() => this.props.handleModalPopup('facility', false)}>닫기 버튼</button>
                </FacilityInfoComponent>
            );
        }

        return ui;
    }

    render() {

        const ui = this.getFacilityInfoUI();

        return (
            <>
                {ui}
            </>
        );
    }
}

export default FacilityInfo;