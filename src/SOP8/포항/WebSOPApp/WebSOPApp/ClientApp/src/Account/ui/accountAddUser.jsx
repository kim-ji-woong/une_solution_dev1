import React, { useRef, useState } from 'react';

import { AccountAddUserComponent } from '../styled/accountManagerStyled';
import AccountFindMember from './accountFindMember';
import { TeamEditController } from '../../TeamEditor/services/teamEditController';
import ProjectResource from '../../Root/resource/id';
import { AccountController } from '../services/accountController';

function AccountAddUser(props) {
    const [showFindMemberPopup, setShowFindMemberPopup] = useState(false);
    const [regularMembers, setRegularMember] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);

    const refUserID = useRef(null);
    const refUserGrade = useRef(null);

    const setRegularMembers = async (searchText) => {
        const userInfo = ProjectResource.getUserInfo();

        if (searchText === null || searchText === undefined) {
            setRegularMember([]);
        }
        else {
            let [members] = await TeamEditController.displayRegularMember(userInfo.siteID, searchText);
    
            if (members && members.length > 0) {
                setRegularMember(members);
            }
        }
    }

    const handlePopup = (isShow) => {
        setShowFindMemberPopup(isShow);
    }

    const getJobLevelName = (jobLevelNo) => {
        const levels = props.jobLevels;

        if (levels && levels.length > 0) {
            const jobLevel = levels.find((x) => x.team_optn_no === jobLevelNo);
            return jobLevel ? jobLevel.team_optn_name : '-';
        }
    }

    const getTeamName = (teamDatas, member) => {
        if (!teamDatas) return;

        for (const team of teamDatas) {
            if (team.No === member.rgl_sn) {
                return team.TeamName;
            }
    
            if (team.Children && team.Children.length > 0) {
                const name = getTeamName(team.Children, member);
                if (name) {
                    return name;
                }
            }
        }
        
        return null;
    };

    const getMemberInfo = () => {
        if (!selectedMember) return [];

        const teamName = getTeamName(props.regularDatas, selectedMember);
        
        return <ul>
                    <li>
                        <div>{teamName ? teamName : '-'}</div>
                        <div>{selectedMember.memb_name}</div>
                        <div>{getJobLevelName(selectedMember.clsf_no)}</div>
                        <div>
                            <input type='text' ref={refUserID} />
                        </div>
                        <div>
                            <select defaultValue="" ref={refUserGrade}>
                                <option value="" disabled>권한을 지정해주세요.</option>
                                {
                                    props.grades && props.grades.length > 0 &&
                                        props.grades.map((grade) => <option key={grade.grad_sn} value={grade.grad_sn}>{grade.grad_name}</option>)
                                }
                            </select>
                        </div>
                    </li>
                </ul>
    }

    const isValidUserID = (userID) => {
        // 사용자 ID는 5~10자의 영문소문자,숫자와 특수기호(_),(-)만 사용 가능
        const regex = /^[a-z0-9_-]{5,10}$/;
        return regex.test(userID);
    }

    const checkUserIDDuplicate = (userID) => {
        if (props.accountUsers && props.accountUsers.length > 0) {
            for (const user of props.accountUsers) {
                if (user.userID === userID) {
                    return false;
                }
            }
        }

        return true;
    }

    const onSubmitAddUser = async () => {
        if (!selectedMember) return;

        const userID = refUserID.current.value.toString();
        const grade =  refUserGrade.current.value;
        const userNickName = selectedMember.memb_name;
        const regularMemberNo = selectedMember.rgl_memb_sn;
        const memo = null;
        const siteNo = ProjectResource.site_sn;

        if (!isValidUserID(userID)) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['사용자ID가 올바르지 않습니다.'], null, null);
            return;
        }

        if (!checkUserIDDuplicate(userID)) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['이미 등록된 ID입니다.'], null, null);
            return;
        }

        if (!grade) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['필수 항목이 작성되지 않았습니다.'], null, null);
            return;
        }

        const [user, message] = await AccountController.createUser(userID, userNickName, Number(grade), regularMemberNo, memo, siteNo);

        if (user) {
            props.showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, ['신규등록 되었습니다.'], null, null);
            props.searchAccountUsers();
            setSelectedMember(null);
        }
        else { 
            // Response는 true로 떨어지지만 계정 생성이 실패한 경우 (다수의 권한자가 동일한 계정 생성 등.)
            // message는 서버에서 내려주는 메시지로 콘솔출력만 하고 사용자에겐 실패 메시지만 표출한다. - 유지혜 사원 요청
            console.log(message);
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['신규등록에 실패하였습니다. 이미 만들어진 계정이거나 계정을 생성할 수 없습니다.'], null, null);
        }
    }

    const onClickCancle = () => {
        setSelectedMember(null);
    }

    return (
        <>
        <AccountAddUserComponent>
            <div className='infoWrap'>
                <p>신규등록 시 유의사항</p>
                <p>필수항목 미 작성 또는 ID가 중복될 경우 계정 및 권한이 등록되지 않음</p>
                <p>사용자 ID는 5~10자의 영문소문자,숫자와 특수기호(_),(-)만 사용 가능</p>
            </div>
            <div className='listWrap'>
                <ul className='accountList'>
                    <li className='head'>
                        <div>소속 조직</div>
                        <div>이름</div>
                        <div>직위</div>
                        <div>사용자ID<span>*</span></div>
                        <div>권한<span>*</span></div>
                    </li>
                    <li className='body'>
                        {
                            !selectedMember ?
                            <div>
                                <button onClick={() => handlePopup(true)}>조직정보 불러오기</button>
                            </div> :
                            getMemberInfo()
                        }
                    </li>
                </ul>
            </div>
            {
                selectedMember &&
                    <div className='btnWrap'>
                        <button className='cancle' onClick={() => onClickCancle()}>취소</button>
                        <button className='submit' onClick={() => onSubmitAddUser()}>등록</button>
                    </div>
            }
        </AccountAddUserComponent>
        {
            showFindMemberPopup &&
            <AccountFindMember
                type={"account"}
                handlePopup={handlePopup}
                showConfirmDialog={props.showConfirmDialog}
                regularMembers={regularMembers}
                setSelectedMember={setSelectedMember}
                setRegularMembers={setRegularMembers}
                getJobLevelName={getJobLevelName}
                getTeamName={getTeamName}
                regularDatas={props.regularDatas}
            />
        }
        </>
    );
}

export default AccountAddUser;