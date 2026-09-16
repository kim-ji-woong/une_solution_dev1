import React, { useState } from 'react';
import TeamEditorResource from '../resource/id';

import { ScheduleMenuComponent } from '../../TeamEditor/styled/teamStyled';

function ScheduleMenu(props) {
	const [fixedClass, setFixedClass] = useState(cssStyles.current);
	const [currentClass, setCurrentClass] = null;

	const onClickList = (e) => {
		var target = e;

		// 각각의 state 값에 저장 한 후 해당 클래스 네임에 입력하기
		if (target.innerText == TeamEditorResource.ID.textFixed && fixedClass !== cssStyles.current) {
			setFixedClass(cssStyles.current);
			setCurrentClass(null);
			props.onChange(TeamEditorResource.ID.textFixed);
		} else if (target.innerText == TeamEditorResource.ID.textCurrent && currentClass !== cssStyles.current) {
			setFixedClass(null);
			setCurrentClass(cssStyles.current);
			props.onChange(TeamEditorResource.ID.textCurrent);
		}

		return;
	}

	return (
		<ScheduleMenuComponent>
			<div className={'saRht pt60'}>
				<div className={'sarSel'}>
					<h3>{TeamEditorResource.ID.textSchedule}</h3>
				</div>
				<div>
					<ul className={'sarList'}>
						<li><a onClick={(e) => onClickList(e.target)} className={fixedClass}>{TeamEditorResource.ID.textFixed}</a></li>
						<li><a onClick={(e) => onClickList(e.target)} className={currentClass}>{TeamEditorResource.ID.textCurrent}</a></li>
					</ul>
				</div>
			</div>
		</ScheduleMenuComponent>
	);
}

export default ScheduleMenu;