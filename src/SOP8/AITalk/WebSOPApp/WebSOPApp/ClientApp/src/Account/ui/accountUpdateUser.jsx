import React, { useEffect, useRef, useState } from 'react';

import { AccountUpdateUserComponent } from '../styled/accountManagerStyled';
import { ModalBackground } from '../../Root/styled/theme';

import close_btn from '../../Common/images/close_btn.png';
import tooltip_icon from '../../Settings/images/tooltip-icon.png';
import ProjectResource from '../../Root/resource/id';
import { AccountController } from '../services/accountController';
import IconButton from '../../Common/components/iconButton';
import Icon from '../../Common/components/Icon/Icon';
import Button from '../../Common/components/button';

function AccountUpdateUser(props) {
    const [gradeNo, setGradeNo] = useState('');
    const [memo, setMemo] = useState('');

    const [isEditMode, setIsEditMode] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [isValid, setIsValid] = useState(false);

    const refOption = useRef(null);
    const refMemo = useRef(null);

    const initialGradeNoRef = useRef('');
    const initialMemoRef = useRef('');

    useEffect(() => {
        if (!isEditMode) return;

        const g = props.selectedUser?.gradeNo?.toString() || '';
        const m = props.selectedUser?.memo || '';

        initialGradeNoRef.current = g;
        initialMemoRef.current = m;

        setGradeNo(g);
        setMemo(m);
        setIsUpdated(false);
        setIsValid(false);
    }, [isEditMode, props.selectedUser]);

    const onEditMode = (isOn) => {
        if (isOn) {
            setIsEditMode(true);
        } else {
            if (isUpdated) {
                props.showConfirmDialog(
                    ProjectResource.dialogTypes.QUESTION,
                    ['변경한 내용을 저장하시겠습니까?', '취소 버튼 클릭 시 변경사항은 저장되지않습니다'],
                    ['취소', '저장하기'],
                    updateUserComfirm
                );
            } else {
                handleEditMode();
            }
        }
    };

    const onClickDeleteUser = () => {
        props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['삭제하시겠습니까?', '삭제된 데이터는 되돌릴 수 없습니다'], ['취소', '삭제하기'], deleteUserInfo);
    }

    const deleteUserInfo = async (index) => {
        if (index === 0) {
            props.onCloseConfirmDialog();
        }
        else if (index === 1) {
            const userNo = props.selectedUser.userNo;
    
            if (!userNo) return;
    
            const [success, message] = await AccountController.deleteUser(userNo);
    
            if (success) {
                props.searchAccountUsers();
                props.handleToast('삭제되었습니다');
                props.onCloseConfirmDialog();
                props.handlePopup(false);
            }
            else {
                props.handleToast(message);
            }
        }
    }

    const updateUserInfo = async () => {
        const userNo = props.selectedUser.userNo;
        if (!userNo || !gradeNo) return;

        const [success, message] = await AccountController.updateUserInfo(userNo, null, gradeNo, memo);
        
        if (success) {
            props.searchAccountUsers();
            props.handleToast('저장되었습니다');
            // 저장 후 팝업 닫기
            props.handlePopup(false);
        } else {
            props.handleToast(message);
        }
    };

    const computeChanged = (nextGradeNo, nextMemo) => {
        const changed =
            (nextGradeNo ?? gradeNo) !== initialGradeNoRef.current ||
            (nextMemo ?? memo) !== initialMemoRef.current;
        setIsUpdated(changed);
        setIsValid(changed);           // ← 버튼 활성화 플래그
    };

    const onChangeGrade = (e) => {
        const val = e.target.value.toString();
        setGradeNo(val);
        computeChanged(val, undefined);
    };

    const onChangeMemo = (e) => {
        const val = e.target.value;
        setMemo(val);
        computeChanged(undefined, val);
    };

    const updateUserComfirm = (index) => {
        if (index === 0) {
            handleEditMode();
        } else if (index === 1) {
            updateUserInfo();
        }
    }
    
    const handleEditMode = () => {
        props.onCloseConfirmDialog();
        setIsEditMode(false);
    }

    const handlePopup = () => {
        props.onCloseConfirmDialog();
        props.handlePopup(false);
    }

    return (
        <ModalBackground>
        <AccountUpdateUserComponent $isEditMode={isEditMode}>
            <header>
                <h2>{isEditMode ? '사용자 정보 편집하기' : '사용자 정보'}</h2>
                <div>
                    {
                        !isEditMode &&
                            <>
                                <IconButton
                                    variant="unfill"
                                    size="xxs"
                                    icon={<Icon.PencilIcon size={'xxs'} />}
                                    onClick={() => onEditMode(true)}
                                >
                                    편집
                                </IconButton>
                                <IconButton
                                    variant="unfill"
                                    size="xxs"
                                    icon={<Icon.Trash size={'xxs'} />}
                                    onClick={() => onClickDeleteUser()}
                                >
                                    삭제
                                </IconButton>
                                <IconButton
                                    variant="unfill"
                                    size="xxs"
                                    icon={<Icon.Closer size={'xxs'} />}
                                    onClick={() => props.handlePopup(false)}
                                >
                                    닫기
                                </IconButton>
                            </>
                    }
                </div>
            </header>
            <section>
                <ul>
                    <li>
                        <div>이름</div>
                        <div className={isEditMode ? 'disable' : null}>
                            <p>{props.selectedUser?.memberName ? props.selectedUser.memberName : '-'}</p>
                        </div>
                    </li>
                    <li>
                        <div>소속 조직</div>
                        <div className={isEditMode ? 'disable' : null}>
                            <p>{props.selectedUser?.teamName ? props.selectedUser.teamName : '-'}</p> 
                        </div>
                    </li>
                    <li>
                        <div>직위</div>
                        <div className={isEditMode ? 'disable' : null}>
                            <p>{props.selectedUser?.jobLevel ? props.selectedUser.jobLevel : '-'}</p>
                        </div>
                    </li>
                    <li>
                        <div>아이디</div>
                        <div className={isEditMode ? 'disable' : null}>
                            <p>{props.selectedUser?.userID ? props.selectedUser.userID : '-'}</p>
                        </div>
                    </li>
                    <li>
                        <div>
                            권한
                            <span>*</span>
                            {
                                !isEditMode &&
                                    <div id='tooltip' data-tooltip="상위 권한 및 동일 권한은 편집이 불가합니다">
                                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                                    </div>
                            }
                        </div>
                        <div>
                            {
                                isEditMode ? 
                                    <select value={gradeNo} onChange={onChangeGrade}>
                                        {props.grades?.map((grade) => (
                                            <option key={grade.grad_sn} value={grade.grad_sn}>
                                                {grade.grad_name}
                                            </option>
                                        ))}
                                    </select>
                                    : <p>{props.selectedUser?.grade || '-'}</p>
                            }
                        </div>
                    </li>
                    <li>
                        <div>메모</div>
                        <div>
                            {
                                isEditMode ?
                                    <textarea className="edit" value={memo} onChange={onChangeMemo} />
                                    : <textarea value={props.selectedUser?.memo || ''} disabled />
                            }
                        </div>
                    </li>
                </ul>
            </section>
            {
                isEditMode &&
                    <div className='btnWrap'>
                        <Button
                            className="cancle"
                            variant="outline"
                            size="xs"
                            onClick={() => onEditMode(false)}
                        >
                            취소
                        </Button>
                        <Button
                            variant="fill"
                            size="xs"
                            disabled={!isValid}
                            onClick={() => updateUserInfo()}
                        >
                            저장하기
                        </Button>
                    </div>
            }
        </AccountUpdateUserComponent>
        </ModalBackground>
    );
}

export default AccountUpdateUser;