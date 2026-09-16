import React, { useEffect, useState } from 'react';
import { AccountFindMemberComponent } from '../styled/accountManagerStyled';
import { ModalBackground } from '../../Root/styled/theme';
import ProjectResource from '../../Root/resource/id';
import AccountResource from '../resource/id';
import Button from '../../Common/components/button';

function AccountFindMember(props) {
    const [rowLength, setRowLength] = useState(0);
    const [displayContent, setDisplayContent] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [allChecked, setAllChecked] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const [localDraft, setLocalDraft] = useState([]);

    const selectedArray = props.mode === 'edit'
        ? localDraft
        : (props.regularMembers || []).filter(m => m.checked);

    const selectedSet = new Set(selectedArray.map(m => m.rgl_memb_sn));

    useEffect(() => {
        if (props.type === 'account' || (props.regularMembers || []).length === 0) {
            search();
        }
    }, []);

    useEffect(() => {
        if (props.mode === 'edit') {
                setLocalDraft(
                props.selectedMembersDraft ||
                props.selectedSpread?.regularMembers ||
                []
            );
        }
    }, []);

    useEffect(() => {
        const list = props.regularMembers || [];
        let ui = [];
        let index = 1;
        let allListChecked =
            list.length > 0 &&
            list.every(m => selectedSet.has(m.rgl_memb_sn));

        for (let i = 0; i < list.length; i++) {
            const member = list[i];
            const teamName = props.getTeamName(props.regularDatas, member);

            ui.push(
                <li
                    key={`member_${member.rgl_memb_sn ?? index}`}
                    className={(props.type === 'account' && member.hasUserInfo) ? 'disable' : null}
                >
                    <div>
                        {
                            props.type === 'account'
                                ? (
                                    <input
                                        type='radio'
                                        name='selectMember'
                                        onChange={() => onSelectMember(member)}
                                        disabled={member.hasUserInfo}
                                    />
                                ) : (
                                    <input
                                        type='checkbox'
                                        className='clickArea'
                                        checked={selectedSet.has(member.rgl_memb_sn)}
                                        onChange={(e) => {
                                            const checked = e.target.checked;

                                            if (props.mode === 'edit') {
                                                // 편집
                                                setLocalDraft(prev => {
                                                    if (checked) {
                                                    // 중복 방지
                                                    if (prev.some(m => m.rgl_memb_sn === member.rgl_memb_sn)) {
                                                        return prev;
                                                    }
                                                    return [...prev, member];
                                                    } else {
                                                        return prev.filter(
                                                            m => m.rgl_memb_sn !== member.rgl_memb_sn
                                                        );
                                                    }
                                                });
                                            } else {
                                                // 신규등록
                                                props.onCheckedRow?.(e.target.checked, i);
                                            }
                                        }}
                                    />
                                )
                        }
                    </div>
                    <div>{index}</div>
                    <div>{member.memb_name}</div>
                    <div>{teamName}</div>
                    <div>{props.getJobPositionName(member.ofcps_no)}</div>
                    <div>{member.telno ? AccountResource.formatNumber(member.telno) : '-'}</div>
                    <div>{member.offm_telno ? AccountResource.formatNumber(member.offm_telno) : '-'}</div>
                    <div>{member.email ? member.email : '-'}</div>
                    {props.type === 'account' && (
                        <div className={member.hasUserInfo ? 'no' : 'yes'}>
                            {member.hasUserInfo ? 'NO' : 'YES'}
                        </div>
                    )}
                </li>
            );
            index++;
        }

        setDisplayContent(ui);
        setAllChecked(allListChecked);
        setRowLength(index);

        // 버튼 활성화
        if (props.type === 'account') {
            setIsValid(!!selectedMember);
        } else {
            setIsValid(selectedArray.length > 0);
        }
    }, [
        props.regularMembers,
        props.selectedMembers,
        props.selectedMembersDraft,
        props.selectedSpread,
        props.mode,
        selectedMember,
        localDraft
    ]);

    const onSelectMember = (member) => {
        setSelectedMember(member);
        setIsValid(true);
    };

    const searchEnterKey = () => {
        if (window.event && window.event.keyCode === 13) {
            search();
        }
    };

    const search = () => {
        const text = document.getElementById('txtSearch').value;
        props.setRegularMembers(text);
    };

    const onSubmitSelectedMember = () => {
        if (props.type === 'account') {
            if (!selectedMember) {
                props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['사용자를 선택해주세요.'], null, null);
                return;
            }
            if (!selectedMember.telno) {
                props.showConfirmDialog(
                    ProjectResource.dialogTypes.WARNING,
                    ['필수 항목이 입력되지 않은 조직원입니다.', '조직관리 페이지로 이동해 휴대전화번호 정보를 입력해주세요.'],
                    null,
                    null
                );
                return;
            }
            props.setSelectedMember(selectedMember);
        }

        if (props.type === 'spread') {
            if (props.mode === 'add') {
                // 신규등록: 체크 플래그 → selectedMembers 로 확정
                props.updateSelectedMembers?.();
            } else if (props.mode === 'edit') {
                props.setSelectedMembersDraft?.(localDraft);
            }
        }

        props.handlePopup(false);
    };

    return (
        <ModalBackground
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <AccountFindMemberComponent $rowLength={rowLength} $type={props.type}>
                <header>
                    <h2>
                        {props.type === 'spread' ? 
                            '사용자 편집하기' : '사용자 선택하기'    
                        }
                    </h2>
                </header>
                <section>
                    <div className='searchWrap'>
                        <div className='searchBox'>
                            <input
                                type='text'
                                id='txtSearch'
                                onKeyUp={searchEnterKey}
                                placeholder='검색어를 입력해주세요.'
                            />
                            <button onClick={search}>검색</button>
                        </div>
                        <p className='resultCount'>총 {props.regularMembers?.length || 0}건</p>
                    </div>
                    <div className='listWrap'>
                        <ul className='accountList'>
                            <li className='head'>
                                {
                                    props.type === 'account'
                                        ? <div>선택</div>
                                        : (
                                            <div>
                                                <input
                                                    type='checkbox'
                                                    checked={allChecked}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;

                                                        if (props.mode === 'edit') {
                                                            if (checked) {
                                                                setLocalDraft(props.regularMembers || []);
                                                            } else {
                                                                setLocalDraft([]);
                                                            }
                                                        } else {
                                                            props.onCheckedRow?.(checked, -1);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )
                                }
                                <div>NO</div>
                                <div>이름</div>
                                <div>소속 조직</div>
                                <div>직위</div>
                                <div>핸드폰 번호</div>
                                <div>근무처 전화번호</div>
                                <div>이메일</div>
                                {props.type === 'account' && <div>등록 가능 여부</div>}
                            </li>
                            <li className='body'>
                                <ul>{displayContent}</ul>
                            </li>
                        </ul>
                    </div>
                </section>
                <div className='btnWrap'>
                    <Button
                        className='cancle'
                        variant='outline'
                        size='xs'
                        onClick={() => props.handlePopup(false)}
                    >
                        취소
                    </Button>
                    <Button
                        variant='fill'
                        size='xs'
                        disabled={!isValid}
                        onClick={onSubmitSelectedMember}
                    >
                        선택하기
                    </Button>
                </div>
            </AccountFindMemberComponent>
        </ModalBackground>
    );
}

export default AccountFindMember;