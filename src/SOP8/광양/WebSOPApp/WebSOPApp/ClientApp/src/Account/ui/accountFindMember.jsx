import React, { useEffect, useState } from 'react';

import { AccountFindMemberComponent } from '../styled/accountManagerStyled';
import { ModalBackground } from '../../Root/styled/theme';

import ProjectResource from '../../Root/resource/id';
import AccountResource from '../resource/id';
import InputBox from '../../Common/components/inputBox';
import Icon from '../../Common/components/Icon/Icon';
import BoxButton from '../../Common/components/boxButton';

function AccountFindMember(props) {
    // 행이 6개 이상이면 Table head css값 변경
    const [rowLength, setRowLength] = useState(0);
    const [displayContent, setDisplayContent] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [searchText, setSearchText] = useState(''); 

    const [allChecked, setAllChecked] = useState(true); // 테이블 전체 체크 여부에 활용 (초기상황 전파관리에서만 사용)

    useEffect(() => {
        let ui = [];

        if (props.regularMembers && props.regularMembers.length > 0) {
            let allListChecked = true;

            let index = 1;

            for (let i = 0; i < props.regularMembers.length; i++) {
                const member = props.regularMembers[i];

                const teamName = props.getTeamName(props.regularDatas, member);

                ui.push(
                    <li key={`member_${index}`} className={(props.type === "account" && member.hasUserInfo) ? 'disable' : null}>
                        <div>
                            {
                                props.type === "account" ? 
                                    <input type='radio' name='selectMember' onChange={() => onSelectMember(member)} disabled={member.hasUserInfo} /> :
                                    <input type="checkbox" className='clickArea' checked={member.checked || false} onChange={(e) => props.onCheckedRow(e.target.checked, i)} />
                            }
                        </div>
                        <div>{index}</div>
                        <div>{teamName}</div>
                        <div>{member.memb_name}</div>
                        <div>{props.getJobPositionName(member.ofcps_no)}</div>
                        <div>{member.telno ? AccountResource.formatNumber(member.telno) : '-'}</div>
                        <div>{member.offm_telno ? AccountResource.formatNumber(member.offm_telno) : '-'}</div>
                        {
                            props.type === "account" &&
                                <div className="accountStatus">{member.hasUserInfo ? '등록됨' : '등록 가능'}</div>
                        }
                    </li>
                );

                index++;

                if (!member.checked) {
					allListChecked = false;
				}
            }

            setDisplayContent(ui);
            setAllChecked(allListChecked);
            setRowLength(index);
        }
        else {
            setAllChecked(false);
            setDisplayContent([]);
        }
    }, [props.regularMembers]);

    useEffect(() => {
        if (props.type !== "spread") return;
        if (!props.selectedMembers?.length) return;
        if (!props.regularMembers?.length) return;

        const updated = props.regularMembers.map(member => ({
            ...member,
            checked: props.selectedMembers.some(
                selected =>
                    Number(selected.rgl_memb_sn) === Number(member.rgl_memb_sn)
            )
        }));

        props.setRegularMemberList(updated);

    }, [props.selectedMembers]);

    useEffect(() => {
        if (props.type !== "account" && props.regularMembers.length > 0) {
            return;
        }

        props.setRegularMembers(searchText);
    }, [searchText]);

    const onSelectMember = (member) => {
        setSelectedMember(member);
    }

    const onSubmitSelectedMember = () => {
        if (props.type === "account") {
            if (!selectedMember) {
                props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['사용자를 선택해주세요.'], null, null);
                return;
            }

            if (!selectedMember.telno) {
                props.showConfirmDialog(ProjectResource.dialogTypes.WARNING, ['필수 항목이 입력되지 않은 조직원입니다.', '조직관리 페이지로 이동해 휴대전화번호 정보를 입력해주세요.'], null, null);
                return;
            }

            props.setSelectedMember(selectedMember);
        }

        if (props.type === "spread") {
            props.updateSelectedMembers();
        }

        props.handlePopup(false);
    };

    const handleSubmit = (value) => {
        setSearchText((value ?? "").trim());
    };

    const isApplyDisabled = () => {
        if (props.type === "account") {
            return !selectedMember;
        }

        if (props.type === "spread") {
            return !props.regularMembers?.some(member => member.checked);
        }

        return true;
    };

    return (
        <ModalBackground>
            <AccountFindMemberComponent $rowLength={rowLength} $type={props.type}>
                <header>
                    <h2>{props.type === "account" ? '조직정보 불러오기' : '지정된 사용자 불러오기'}</h2>
                </header>
                <section>
                    <div className='searchWrap'>
                        <InputBox
                            size="sm"
                            value={searchText}
                            onChange={setSearchText}
                            placeholder={"검색"}
                            onSubmit={handleSubmit}
                            onClear={() => setSearchText("")}
                            fullWidth={true}
                            leftIcon={<Icon.Search size={"xxs"} />}
                        />
                    </div>
                    <div className='listWrap'>
                        <ul className='accountList'>
                            <li className='head'>
                                {
                                    props.type === "account" ?
                                        <div>선택</div> 
                                        : <div><input type="checkbox" checked={allChecked} onChange={(e) => props.onCheckedRow(e.target.checked, -1)} /></div>
                                }
                                <div>NO</div>
                                <div>소속 조직</div>
                                <div>이름</div>
                                <div>직위</div>
                                <div>휴대전화번호</div>
                                <div>근무처 전화번호</div>
                                {
                                    props.type === "account" &&
                                        <div>계정 현황</div>
                                }
                            </li>
                            <li className='body'>
                                <ul>
                                    {displayContent}
                                </ul>
                            </li>
                        </ul>
                    </div>
                </section>
                <div className='btnWrap'>
                    <BoxButton 
                        variant="ghost"
                        size="sm"
                        onClick={() => props.handlePopup(false)}
                    >
                        취소
                    </BoxButton>
                    <BoxButton  
                        variant="fill"
                        size="sm"
                        onClick={() => onSubmitSelectedMember()}
                        disabled={isApplyDisabled()}
                    >
                        적용
                    </BoxButton>
                </div>
            </AccountFindMemberComponent>
        </ModalBackground>
    );
}

export default AccountFindMember;