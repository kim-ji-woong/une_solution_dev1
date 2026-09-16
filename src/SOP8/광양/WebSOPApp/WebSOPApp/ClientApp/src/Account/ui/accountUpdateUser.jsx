import React, { useRef, useState, useEffect } from 'react';

import { AccountUpdateUserComponent } from '../styled/accountManagerStyled';
import { ModalBackground } from '../../Root/styled/theme';

import ProjectResource from '../../Root/resource/id';
import { AccountController } from '../services/accountController';
import IconButton from '../../Common/components/iconButton';
import Icon from '../../Common/components/Icon/Icon';
import TextButton from '../../Common/components/textButton';
import AccountResource from '../resource/id';
import TextareaBox from '../../Common/components/textareaBox';
import DropBox from '../../Common/components/dropBox';

function AccountUpdateUser(props) {
    const [openDropId, setOpenDropId] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // 취소 버튼 클릭 시 입력될 항목별 초기값
    const initialValuesRef = useRef({
        gradeNo: props.selectedUser?.gradeNo || '',
        memo: props.selectedUser?.memo || ''
    });

    const [userGrade, setUserGrade] = useState(initialValuesRef.current.gradeNo);
    const [memo, setMemo] = useState(initialValuesRef.current.memo);

    // selectedUser 변경 시 초기값 갱신
    useEffect(() => {
        if (!props.selectedUser) return;

        const initial = {
            gradeNo: props.selectedUser.gradeNo || '',
            memo: props.selectedUser.memo || ''
        };

        initialValuesRef.current = initial;
        setUserGrade(initial.gradeNo);
        setMemo(initial.memo);

    }, [props.selectedUser]);

    const onEditMode = (isOn) => {
        if (isOn) {
            if (props.loginUserInfo.grad_sn >= props.selectedUser.gradeNo) {
                props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['편집 권한이 없습니다.'], null, null);
                return;
            }

            setIsEditMode(true);
        } else {
            handleEditMode();
        }
    };

    const handleEditMode = () => {
        props.onCloseConfirmDialog();

        // 초기값으로 복원
        const initial = initialValuesRef.current;
        setUserGrade(initial.gradeNo);
        setMemo(initial.memo);

        setIsEditMode(false);
    };

    const handlePopup = () => {
        props.onCloseConfirmDialog();
        props.handlePopup(false);
    };

    const onClickDeleteUser = () => {
        if (props.loginUserInfo.grad_sn >= props.selectedUser.gradeNo) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, ['삭제 권한이 없습니다.'], null, null);
            return;
        }

        props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['삭제하시겠습니까?', '삭제된 계정은 로그인 할 수 없으며, 조직원 정보는 유지됩니다.'], ['취소', '삭제하기'], deleteUserInfo);
    };

    const deleteUserInfo = async (index) => {
        if (index === 0) {
            props.onCloseConfirmDialog();
            return;
        }

        const userNo = props.selectedUser.userNo;
        if (!userNo) return;

        const [success, message] = await AccountController.deleteUser(userNo);

        if (success) {
            props.searchAccountUsers();
            props.handleToast('삭제되었습니다');
            handlePopup();
        } else {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
    };

    const updateUserInfo = async () => {
        const userNo = props.selectedUser.userNo;
        if (!userNo) return;

        const [success, message] = await AccountController.updateUserInfo(userNo, null, userGrade, memo);

        if (success) {
            // ref 초기값을 저장된 값으로 갱신
            initialValuesRef.current = {
                gradeNo: userGrade,
                memo: memo
            };

            // 2) 목록 재조회
            props.searchAccountUsers();

            props.handleToast('저장되었습니다');
            setIsEditMode(false);
        } else {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
    };

    // 변경 여부 체크
    const isChanged =
        userGrade !== initialValuesRef.current.gradeNo ||
        memo !== initialValuesRef.current.memo;

    const isValid = userGrade !== '';

    const canSave = isChanged && isValid;

    return (
        <ModalBackground>
            <AccountUpdateUserComponent>
                <header>
                    <h2>{isEditMode ? "계정 정보 편집" : "계정 정보"}</h2>

                    {/* 로그인 사용자보다 하위 권한의 계정만 편집/삭제 가능 */}
                    {(!isEditMode && props.loginUserInfo?.grad_sn < props.selectedUser?.gradeNo) &&
                        <div>
                            <IconButton
                                variant="unfill"
                                size="xs"
                                icon={<Icon.Edit />}
                                onClick={() => onEditMode(true)}
                            >
                                수정
                            </IconButton>
                            <IconButton
                                variant="unfill"
                                size="xs"
                                icon={<Icon.Trash />}
                                onClick={() => onClickDeleteUser()}
                            >
                                삭제
                            </IconButton>
                        </div>
                    }
                </header>

                <section>
                    <div>
                        <Icon.InfoCircleIcon size='xxs' fill='grayscale.g100' />
                        <span>기본 정보</span>
                    </div>
                    <ul>
                        <li>
                            <div>소속 조직</div>
                            <div>
                                <p>{props.selectedUser?.teamName || '-'}</p>
                            </div>
                        </li>
                        <li>
                            <div>이름</div>
                            <div>
                                <p>{props.selectedUser?.memberName || '-'}</p>
                            </div>
                        </li>
                        <li>
                            <div>휴대전화번호</div>
                            <div>
                                <p>
                                    {props.selectedUser?.phoneNumber
                                        ? AccountResource.formatNumber(props.selectedUser.phoneNumber)
                                        : '-'}
                                </p>
                            </div>
                        </li>
                        <li>
                            <div>사용자 ID</div>
                            <div>
                                <p>{props.selectedUser?.userID || '-'}</p>
                            </div>
                        </li>
                        <li>
                            <div>권한</div>
                            <div>
                                {isEditMode ?
                                    <DropBox
                                        id="grade"
                                        placeholder="선택하세요"
                                        fullWidth
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
                                    :
                                    <p>{props.selectedUser?.grade || '-'}</p>
                                }
                            </div>
                        </li>
                        <li>
                            <div>메모</div>
                            <div>
                                <TextareaBox
                                    value={memo}
                                    onChange={setMemo}
                                    height="120px"
                                    fullWidth
                                    showCharCount={false}
                                    isEditMode={isEditMode}
                                />
                            </div>
                        </li>
                    </ul>
                </section>

                <div className='btnWrap'>
                    {isEditMode ?
                        <>
                            <TextButton
                                variant="unfill"
                                size="xs"
                                onClick={() => onEditMode(false)}
                            >
                                취소
                            </TextButton>
                            <TextButton
                                variant="unfill"
                                size="xs"
                                onClick={updateUserInfo}
                                disabled={!canSave}
                            >
                                저장
                            </TextButton>
                        </>
                        :
                        <TextButton
                            variant="unfill"
                            size="xs"
                            onClick={() => props.handlePopup(false)}
                        >
                            닫기
                        </TextButton>
                    }
                </div>
            </AccountUpdateUserComponent>
        </ModalBackground>
    );
}

export default AccountUpdateUser;