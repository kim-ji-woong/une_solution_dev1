import React, { useEffect, useRef, useState } from 'react';

import { AccountAddUserComponent } from '../styled/accountManagerStyled';
import AccountFindMember from './accountFindMember';
import { TeamEditController } from '../../TeamEditor/services/teamEditController';
import ProjectResource from '../../Root/resource/id';
import { AccountController } from '../services/accountController';
import Button from '../../Common/components/button';
import AccountResource from '../resource/id';

function AccountAddUser(props) {
    const [showFindMemberPopup, setShowFindMemberPopup] = useState(false);
    const [regularMembers, setRegularMember] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);

    const refUserID = useRef(null);
    const refUserGrade = useRef(null);
    const refUserMemo = useRef(null);

    const [isValid, setIsValid] = useState(false);

    // 입력값 확인 함수
    const validateForm = () => {
        const userID = refUserID.current?.value?.trim() ?? '';
        const userGrade = refUserGrade.current?.value ?? '';

        // 모든 값이 입력되었을 때 true
        setIsValid(userID !== '' && userGrade !== '' );
    };

    useEffect(() => {
        validateForm(); // selectedMember가 바뀔 때도 유효성 검사 실행
    }, [selectedMember]);

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
    };

    const getJobLevelName = (jobLevelNo) => {
        const levels = props.jobLevels;

        if (levels && levels.length > 0) {
            const jobLevel = levels.find((x) => x.team_optn_no === jobLevelNo);
            return jobLevel ? jobLevel.team_optn_name : '-';
        }
    };

    const handlePopup = (isShow) => {
        setShowFindMemberPopup(isShow);
    }

    const getgradeName = (gradeNo) => {
        const levels = props.grades;

        if (levels && levels.length > 0) {
            const grade = levels.find((x) => x.team_optn_no === gradeNo);
            return grade ? grade.team_optn_name : '-';
        }
    }

    const getGrades = () => {
        if (!props.grades) return;
        
        let ui = [];
        ui.push(
            <option key="grade_default" value="" disabled={true}>선택하세요</option>
        );

        for (const grade of props.grades) {
            ui.push(
                <option 
                    key={`grade_${grade.grad_sn}`} 
                    value={grade.grad_sn}
                >
                    {grade.grad_name}
                </option>
            );
        }
        return ui;
    };

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
        const memo = refUserMemo.current.value.toString();
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
            props.handleToast('등록 되었습니다');
            props.searchAccountUsers();
            props.setMenu(AccountResource.menu.accountList);
            setSelectedMember(null);
        }
        else { 
            props.handleToast(message);
        }
    }

    return (
        <>
        <AccountAddUserComponent>
            <div className='infoWrap'>
                <p>신규등록 시 유의사항</p>
                <p>필수항목 미 작성 또는 ID가 중복될 경우 계정 및 권한이 등록되지 않습니다.</p>
                <p>사용자 ID는 5~10자의 영문소문자,숫자와 특수기호(_),(-)만 사용 가능합니다.</p>
            </div>
            <div className='formWrap'>
                <div>
                    <label htmlFor="target">
                        지정된 사용자 <span>*</span>
                    </label>
                    <div>
                        <button 
                            type="button" 
                            id="target" 
                            onClick={() => setShowFindMemberPopup(true)}
                        >
                            선택하기
                        </button>
                        <div className='memberInfo'>
                            {
                                selectedMember ? 
                                <div>
                                    <p>{selectedMember.memb_name}</p>
                                    <p>{getTeamName(props.regularDatas, selectedMember)}</p>
                                    <p>{getJobLevelName(selectedMember.clsf_no)}</p>
                                </div>
                                : <>신규 계정 및 권한을 부여할 사용자를 선택하시기 바랍니다</>
                            }
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="userID">
                        사용자 아이디 <span>*</span>
                    </label>
                    <input 
                        type="text" 
                        ref={refUserID}
                        name="userID" 
                        placeholder="사용자 아이디를 작성하세요"
                        onChange={validateForm}
                    />
                </div>
                <div>
                    <label htmlFor="grade">
                        권한 <span>*</span>
                    </label>
                    <select
                        ref={refUserGrade}
                        id="grade" 
                        name="grade" 
                        defaultValue="" 
                        onChange={validateForm}
                    >
                        {getGrades()}
                    </select>
                </div>
                <div>
                    <label htmlFor="memo">
                        메모
                    </label>
                    <textarea
                        id="memo"
                        name="memo"
                        ref={refUserMemo}
                        placeholder="내용을 작성하세요"
                        onChange={validateForm}
                    />
                </div>
            </div>
            <div className='btnWrap'>
                <Button 
                    className="submitBtn" 
                    variant="fill" 
                    size="xs" 
                    disabled={!isValid} 
                    onClick={onSubmitAddUser}
                >
                    등록하기
                </Button>
            </div>
        </AccountAddUserComponent>
        {
            showFindMemberPopup &&
            <AccountFindMember
                type="account"
                handlePopup={handlePopup}
                showConfirmDialog={props.showConfirmDialog}
                regularMembers={regularMembers}
                setSelectedMember={setSelectedMember}
                getJobLevelName={getJobLevelName}
                setRegularMembers={setRegularMembers}
                getgradeName={getgradeName}
                getTeamName={getTeamName}
                regularDatas={props.regularDatas}
            />
        }
        </>
    );
}

export default AccountAddUser;