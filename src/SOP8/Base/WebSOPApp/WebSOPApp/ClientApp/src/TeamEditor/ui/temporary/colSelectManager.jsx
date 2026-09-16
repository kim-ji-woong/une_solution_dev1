import React from 'react';
import AccountResource from '../../../Account/resource/id';

function ColSelectManager(props) {
    let jobPosition = "";

    if (props.jobPositions !== null) {
        for (let i = 0; i < props.jobPositions.length; i++) {
            if (props.jobPositions[i].value === props.member.ofcps_no) {
                jobPosition = props.jobPositions[i].name;
                break;
            }
        }
    }

    let jobLevel = "";
    
    if (props.jobLevels !== null) {
        for (let i = 0; i < props.jobLevels.length; i++) {
            if (props.jobLevels[i].value === props.member.clsf_no) {
                jobLevel = props.jobLevels[i].name;
                break;
            }
        }
    }

    return (
        <>
            <td>{props.index + 1}</td>
            <td className={'colTextSpan'}>{props.member.teamName}</td>
            <td className={'colTextSpan'}>{props.member.memb_name}</td>
            <td className={'colTextSpan'}>{jobPosition}</td>
            <td className={'colTextSpan'}>{jobLevel}</td>
            <td className={'colTextSpan'}>{props.member.telno ? AccountResource.formatNumber(props.member.telno) : '-'}</td>
        </>
    );
}

export default ColSelectManager;