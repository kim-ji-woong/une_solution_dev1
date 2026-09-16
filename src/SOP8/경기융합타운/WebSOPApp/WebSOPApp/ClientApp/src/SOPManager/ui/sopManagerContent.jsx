import React from 'react';

import SopManagerResource from '../resource/id';
import SopDataManager from '../services/sopDataManager';
import { SopManagerContentComponent } from '../../SOPManager/styled/managerStyled';


function SopManagerContent(props) {

	const onClickMenu = (e) => {
		var target = e;

		if (target.innerText === SopManagerResource.menu.editSOP) {
			props.content(SopManagerResource.menu.editSOP, null);
		}
		else if (target.innerText === SopManagerResource.menu.open) {
			props.content(SopManagerResource.menu.open, null);
		}
		else if (target.innerText === SopManagerResource.menu.save) {
			if (props.sopData) {
				props.content(SopManagerResource.menu.save, props.sopData, true);
			}
		}
		else if (target.innerText === SopManagerResource.menu.saveXML) {
			if (props.sopData) {
				if (!props.sopData.version.createTime) {
					props.sopData.version = SopDataManager.makeNewVersion(props.sopData.version.isNormal, "", props.loginUser ? props.loginUser.id : -1, "");
				}

				props.content(SopManagerResource.menu.saveXML, props.sopData);
			}
		}
		else if (target.innerText === SopManagerResource.menu.openXML) {
			props.content(SopManagerResource.menu.openXML, null);
		}
		else if (target.innerText === SopManagerResource.menu.newSOP) {
			props.content(SopManagerResource.menu.newSOP, null);
		}
		else if (target.innerText === SopManagerResource.menu.delete) {
			props.content(SopManagerResource.menu.delete, null);
		}
	}

	return (
		<SopManagerContentComponent $disabled={props.sopData}>
			<div className={'sopMLeft'}>
				<div className={'aslWrap' + " " + 'typeC'}>
					<div className={'salMenu' + " " + 'on'}>
						<div className={'salCont'}>
							<dd><a><span className={'newSOPIcon'} onClick={(e) => onClickMenu(e.target)}>{SopManagerResource.menu.newSOP}</span></a></dd>
							<dd><a><span className={'sopOpenIcon'} onClick={(e) => onClickMenu(e.target)}>{SopManagerResource.menu.open}</span></a></dd>
							<dd><a><span className={'sopSaveIcon'} onClick={(e) => onClickMenu(e.target)}>{SopManagerResource.menu.save}</span></a></dd>
							{/* <dd><a><SopSaveAsIcon onClick={(e) => onClickMenu(e.target)}>{SopManagerResource.menu.save}</SopSaveAsIcon></a></dd> */}
							<dd><a><span className={'sopDeleteIcon'} onClick={(e) => onClickMenu(e.target)}>{SopManagerResource.menu.delete}</span></a></dd>
							<dd><a><span className={'sopOpenXMLIcon'} onClick={(e) => onClickMenu(e.target)}>{SopManagerResource.menu.openXML}</span></a></dd>
							<dd><a><span className={'sopSaveXMLIcon'} onClick={(e) => onClickMenu(e.target)}>{SopManagerResource.menu.saveXML}</span></a></dd>
						</div>
					</div>
				</div>
			</div>
		</SopManagerContentComponent>
	);
}

export default SopManagerContent;