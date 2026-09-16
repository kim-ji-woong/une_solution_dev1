import React, { useState } from 'react';
import { BrowserRouter as Link } from 'react-router-dom';

import TeamEditorResource from '../resource/id';

import { TeamEditorContentComponent } from '../../TeamEditor/styled/teamStyled';

function TeamEditorContent(props) {
	const [teamClass, setTeamClass] = useState("on");
	const [scheduleClass, setScheduleClass] = useState(null);

	const onClickMenu = (e) => {
		var target = e;

		// 각각의 state 값에 저장 한 후 해당 클래스 네임에 입력하기
		if (target.innerText == TeamEditorResource.ID.textRegular && teamClass !== cssStyles.on) {
			setTeamClass("on");
			setScheduleClass(null);
			props.changeMenuType(TeamEditorResource.ID.textRegular);
		}
		else if (target.innerText == TeamEditorResource.ID.textSchedule && scheduleClass !== cssStyles.on) {
			setTeamClass(null);
			setScheduleClass("on");
			props.changeMenuType(TeamEditorResource.ID.textSchedule);
		}
	}

	return (
		<TeamEditorContentComponent className={'saLeft'}>
			<div className={'aslWrap typeH'}>
				<div className={'salMenu' + " " + teamClass}>
					<a onClick={(e) => onClickMenu(e.target)} className={'salIco ico0101'}>{TeamEditorResource.ID.textRegular}</a>
				</div>
			</div>
		</TeamEditorContentComponent>
	);
}

export default TeamEditorContent;