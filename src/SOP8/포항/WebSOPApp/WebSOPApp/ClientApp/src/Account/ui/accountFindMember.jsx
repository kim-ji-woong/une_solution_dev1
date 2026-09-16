import React, { useEffect, useState } from 'react';

import { AccountFindMemberComponent } from '../styled/accountManagerStyled';
import { ModalBackground } from '../../Root/styled/theme';

import close_btn from '../../Common/images/close_btn.png';
import ProjectResource from '../../Root/resource/id';
import AccountResource from '../resource/id';

function AccountFindMember(props) {
    // 행이 6개 이상이면 Table head css값 변경
    const [rowLength, setRowLength] = useState(0);
    const [displayContent, setDisplayContent] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);

    const [allChecked, setAllChecked] = useState(true); // 테이블 전체 체크 여부에 활용 (초기상황 전파관리에서만 사용)

    useEffect(() => {
        if (props.type === "account" || props.regularMembers.length === 0) {
            search();
        }
    }, []);

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
                        <div>{props.getJobLevelName(member.clsf_no)}</div>
                        <div>{member.telno ? AccountResource.formatNumber(member.telno) : '-'}</div>
                        <div>{member.offm_telno ? AccountResource.formatNumber(member.offm_telno) : '-'}</div>
                        <div>{member.email ? member.email : '-'}</div>
                        {
                            props.type === "account" &&
                                <div>{member.hasUserInfo ? '등록됨' : '등록 가능'}</div>
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

    const onSelectMember = (member) => {
        setSelectedMember(member);
    }

    const searchEnterKey = () => {
        if (window.event && window.event.keyCode === 13) {    
            search();
        }
    }

    const search = () => {
        const text = document.getElementById('txtSearch').value;
        props.setRegularMembers(text);
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

    return (
        <ModalBackground>
        <AccountFindMemberComponent $rowLength={rowLength} $type={props.type}>
            <header>
                <h2>조직정보 불러오기</h2>
                <button onClick={() => props.handlePopup(false)} className={'closeBtn'}>
                    <img src={close_btn} alt='닫기 버튼' width={16} height={16} />
                </button>
            </header>
            <section>
                <div className='searchWrap'>
                    <input type="text" id="txtSearch" onKeyUp={searchEnterKey} placeholder='검색어를 입력해주세요.'/>
                    <button onClick={search}>검색</button>
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
                            <div>Email</div>
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
                <button className='cancle' onClick={() => props.handlePopup(false)}>취소</button>
                <button className='submit' onClick={() => onSubmitSelectedMember()}>적용</button>
            </div>
        </AccountFindMemberComponent>
        </ModalBackground>
    );
}

export default AccountFindMember;