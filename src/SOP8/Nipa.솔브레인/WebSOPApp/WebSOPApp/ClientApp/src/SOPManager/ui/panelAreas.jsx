import React from 'react';
import SectionPanel from '../../Common/sections/sectionPanel';

import { PanelAreasComponent } from '../../SOPManager/styled/managerStyled';

function PanelAreas(props) {

    const panels = [];

    for (let i=0;i<props.panelCount;i++)
    {
        panels.push(<SectionPanel
            key={i}
            currentMenu={props.currentMenu}
            selectedSectionData={props.selectedSectionData}
            editDatas={props.editDatas}
            onProcessEdit={props.onProcessEdit}
            onSelectComponent={props.onSelectComponent}
            selectedArrowData={props.selectedArrowData}
            onAddComponent={props.onAddComponent}
            onRemoveComponent={props.onRemoveComponent}
            onSelectArrow={props.onSelectArrow}
            sopData={props.sopData}
            loginUser={props.loginUser}
            rowCount={props.rowCount}
            columnCount={props.columnCount}
            onChangeGrid={props.onChangeGrid}
            content={props.content}
            onSelectedCells={props.onSelectedCells}
            showConfirmDialog={props.showConfirmDialog}
        />);
    }

    return (
        <PanelAreasComponent>
            <div className={'sectionPanels' + " " + 'panelScrollbar'}>
                {panels}
            </div>
        </PanelAreasComponent>
    );
}

export default PanelAreas;