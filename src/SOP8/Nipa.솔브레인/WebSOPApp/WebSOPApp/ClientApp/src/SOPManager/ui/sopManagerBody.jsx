import React from 'react';
import SopManagerResource from '../resource/id';
import PanelAreas from './panelAreas';
import SopController from '../services/sopController';
import SectionData from '../../Common/models/sections/sectionData';
import SectionDataAnnotation from '../../Common/models/sections/sectionDataAnnotation';
import SectionDataDecision from '../../Common/models/sections/sectionDataDecision';
import SectionDataEndpoint from '../../Common/models/sections/sectionDataEndpoint';
import SectionDataInternal from '../../Common/models/sections/sectionDataInternal';
import SectionDataProcess from '../../Common/models/sections/sectionDataProcess';
import JsonManager from '../services/jsonManager';
import NewSOPOptions from './body/newSOPOptions';
import SopManagerBodyMain from './body/sopManagerBodyMain';
import SaveSOPOptions from './popup/saveSOPOptions';

import { SOPManagerBodyComponent } from '../../SOPManager/styled/managerStyled';


function SopManagerBody(props) {

	const getBodyContents = () => {
		if (props.menu === SopManagerResource.menu.editSOP ||
			props.menu === SopManagerResource.menu.open) {
			return <SopManagerBodyMain sopData={props.menuDatas} loginUser={props.loginUser} showCascading={props.showCascading} content={props.content} changeCascadingMode={props.changeCascadingMode} showConfirmDialog={props.showConfirmDialog} />;
		}
		else if (props.menu === SopManagerResource.menu.newSOP) {
			return <NewSOPOptions content={props.content} sopData={props.sopData} loginUser={props.loginUser} showConfirmDialog={props.showConfirmDialog} selectedSiteNo={props.selectedSiteNo} />;
		}
		else if (props.menu === SopManagerResource.menu.save) {
			return <SaveSOPOptions sopData={props.menuDatas} content={props.content} loginUser={props.loginUser} showConfirmDialog={props.showConfirmDialog} onCloseConfirmDialog={props.onCloseConfirmDialog} isAction={props.isAction} />;
		} else {
			return <SopManagerBodyMain sopData={props.menuDatas} loginUser={props.loginUser} showCascading={props.showCascading} content={props.content} changeCascadingMode={props.changeCascadingMode} showConfirmDialog={props.showConfirmDialog} />;
		}
    }

	return (
		<SOPManagerBodyComponent>
			<div className={'sopCont'}>
				{
					getBodyContents()
				}
			</div>
		</SOPManagerBodyComponent>
	);
}

export default SopManagerBody;