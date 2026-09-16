import React, { useState } from 'react';

import { AccountAddUserComponent } from '../styled/accountManagerStyled';
import AccountFindMember from './accountFindMember';
import { TeamEditController } from '../../TeamEditor/services/teamEditController';
import ProjectResource from '../../Root/resource/id';
import { AccountController } from '../services/accountController';
import BoxButton from '../../Common/components/boxButton';
import InputBox from '../../Common/components/inputBox';
import DropBox from '../../Common/components/dropBox';
import AccountResource from '../resource/id';
import TextareaBox from '../../Common/components/textareaBox';

function AccountAddUser(props) {
    const [openDropId, setOpenDropId] = useState(null);

    const [showFindMemberPopup, setShowFindMemberPopup] = useState(false);
    const [regularMembers, setRegularMember] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);

    const [userID, setUserID] = useState('');       // 사용자 ID
    const [userGrade, setUserGrade] = useState(''); // 계정 권한
    const [memo, setMemo] = useState('');           // 메모

    const setRegularMembers = async (searchText) => {
        if (searchText === null || searchText === undefined) {
            setRegularMember([]);
        }
        else {
            let [members] = await TeamEditController.displayRegularMember(props.loginUserInfo.siteID, searchText);
    
            if (members && members.length > 0) {
                setRegularMember(members);
            }
            else {
                setRegularMember([]);
            }
        }
    }

    const handlePopup = (isShow) => {
        setShowFindMemberPopup(isShow);
    }

    const getJobPositionName = (jobPositionNo) => {
        const positions = props.jobPositions;

        if (positions && positions.length > 0) {
            const jobPosition = positions.find((x) => x.team_optn_no === jobPositionNo);
            return jobPosition ? jobPosition.team_optn_name : '-';
        }

        return '-';
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

    const getMemberInfo = () => {
        if (!selectedMember) return '';

        const teamName = getTeamName(props.regularDatas, selectedMember);

        return <div className='memberInfo'>
                    <p>{teamName}</p>
                    <span>|</span>
                    <p>{selectedMember.memb_name}</p>
                    <span>|</span>
                    <p>{AccountResource.formatNumber(selectedMember.telno)}</p>
                </div>
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

        const userNickName = selectedMember.memb_name;
        const regularMemberNo = selectedMember.rgl_memb_sn;
        const siteNo = ProjectResource.site_sn;

        if (!isValidUserID(userID)) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['사용자ID가 올바르지 않습니다.'], null, null);
            return;
        }

        if (!checkUserIDDuplicate(userID)) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['이미 등록된 ID입니다.'], null, null);
            return;
        }

        const [user, message] = await AccountController.createUser(userID, userNickName, userGrade, regularMemberNo, memo, siteNo);

        if (user) {
            props.handleToast("등록 되었습니다");
            props.searchAccountUsers();
            setSelectedMember(null);
            setUserID('');
            setUserGrade('');
            setMemo('');
        }
        else { 
            // Response는 true로 떨어지지만 계정 생성이 실패한 경우 (다수의 권한자가 동일한 계정 생성 등.)
            // message는 서버에서 내려주는 메시지로 콘솔출력만 하고 사용자에겐 실패 메시지만 표출한다. - 유지혜 사원 요청
            console.log(message);
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['신규등록에 실패하였습니다. 이미 만들어진 계정이거나 계정을 생성할 수 없습니다.'], null, null);
        }
    }

    const isValid =
        selectedMember !== null &&
        userID.trim() !== '' &&
        userGrade !== '';

    return (
        <>
        <AccountAddUserComponent>
            <div className='infoWrap'>
                <p>※ 신규등록 시 유의사항</p>
                <p>
                    {`· 필수항목 미 작성 또는 ID가 중복될 경우 계정 및 권한이 등록되지 않습니다.\n· 사용자 ID는 5~10자의 영문소문자,숫자와 특수기호(_),(-)만 사용 가능합니다.`}
                </p>
            </div>
            <div className='formWrap'>
                <div>
                    <label htmlFor="target">
                        지정된 사용자 <span>*</span>
                    </label>
                    <div className="targetWrap">
                        <BoxButton
                            variant="ghost"
                            size="xxs"
                            onClick={() => handlePopup(true)}
                        >
                            선택하기
                        </BoxButton>
                        {getMemberInfo() ?
                            getMemberInfo() :
                            <p>신규 계정 및 권한을 부여할 사용자를 선택하시기 바랍니다</p>
                        }
                    </div>
                </div>
                <div>
                    <label>
                        사용자 ID<span>*</span>
                    </label>
                    <InputBox
                        size='sm'
                        value={userID}
                        onChange={setUserID}
                        placeholder={"사용자 아이디를 작성하세요"}
                        onClear={() => setUserID("")}
                    />
                </div>
                <div>
                    <label>
                        계정 권한 <span>*</span>
                    </label>
                    <DropBox
                        id="grade"
                        placeholder="선택하세요"
                        value={userGrade}
                        onChange={setUserGrade}
                        // 로그인한 사용자와 동일 및 상위권한은 선택 옵션에서 제외
                        options={[
                            { value: AccountResource.accountLevelNo.master, label: "총괄관리자" },
                            { value: AccountResource.accountLevelNo.admin, label: "관리자" },
                            { value: AccountResource.accountLevelNo.user, label: "사용자" }
                        ].filter(option => option.value > props.loginUserInfo.grad_sn)}
                        openId={openDropId}
                        setOpenId={setOpenDropId}
                    />
                </div>
                <div>
                    <label>
                        메모
                    </label>
                    <TextareaBox
                        value={memo}
                        onChange={setMemo}
                        height="120px"
                        fullWidth
                        showCharCount={false}
                    />
                </div>
            </div>

            <div className='btnWrap'>
                <BoxButton
                    variant="fill"
                    size="sm"
                    onClick={() => onSubmitAddUser()}
                    disabled={!isValid}
                >
                    등록
                </BoxButton>
            </div>
        </AccountAddUserComponent>
            {showFindMemberPopup &&
                <AccountFindMember
                    type={"account"}
                    handlePopup={handlePopup}
                    showConfirmDialog={props.showConfirmDialog}
                    regularMembers={regularMembers}
                    setSelectedMember={setSelectedMember}
                    setRegularMembers={setRegularMembers}
                    getJobPositionName={getJobPositionName}
                    getTeamName={getTeamName}
                    regularDatas={props.regularDatas}
                />
            }
        </>
    );
}

export default AccountAddUser;