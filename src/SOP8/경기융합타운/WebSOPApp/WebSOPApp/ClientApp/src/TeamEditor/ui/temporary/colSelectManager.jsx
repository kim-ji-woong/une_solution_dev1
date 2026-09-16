import React, { useState, useEffect } from 'react';
import { TeamEditController } from '../../services/teamEditController';

function ColSelectManager(props) {
    const [check, setCheck] = useState(false);              // 선택(라디오 체크) 유무

    useEffect(() => {
        if (props.member && props.member.check === true) {
            setCheck(true);
        }
    }, [props.member]);

    let jobPosition = "";
    if (props.member.JobPositionID != null)
        jobPosition = props.jobPositions[props.member.JobPositionID].name;

    let jobLevel = "";
    if (props.member.JobLevelID != null)
        jobLevel = props.jobLevels[props.member.JobLevelID].name;

    return (
        <>
            <td><input type="radio" name="selectMember" defaultChecked={check} /></td>
            <td>{props.index + 1}</td>
            <td className={'colTextSpan'}>{props.member.teamName}</td>
            <td className={'colTextSpan'}>{props.member.MemberName}</td>
            <td className={'colTextSpan'}>{jobPosition}</td>
            <td className={'colTextSpan'}>{jobLevel}</td>
            <td className={'colTextSpan'}>{props.member.PhoneNumber}</td>
            <td className={'colTextSpan'}>{props.member.OfficePhoneNumber}</td>
        </>
    );
}

export default ColSelectManager;