import React from 'react';
import { EquipmentAnalysisComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';
import equipmentAnalysis from '../../images/equipmentAnalysis.png';

function EquipmentAnalysisFixed(props) {
    const isDraggable = false;

    return (
        <EquipmentAnalysisComponent className='UI_Section equipmentAnalysis' $resize={false} $isDraggable={isDraggable}>
            <div className='dslTop'>
                <h5 className='dslTitle'>
                    {SdmsResource.ID.menu.equipmentAnalysis}
                </h5>
            </div>
            <div className='content'>
                <div className='infoWrap'>
                    <p>설비 명</p>
                    <p>MB Polisher (전처리 필터)</p>
                </div>
                <div className='imgWrap'>
                    <img src={equipmentAnalysis} alt="equipment analysis" />
                </div>
            </div>
        </EquipmentAnalysisComponent>
    );
}

export default EquipmentAnalysisFixed;