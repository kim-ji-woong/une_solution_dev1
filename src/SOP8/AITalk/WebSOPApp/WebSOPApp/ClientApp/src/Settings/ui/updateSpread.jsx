import React, { useState, useEffect, useRef } from 'react';

import { ModalBackground } from '../../Root/styled/theme';
import { UpdateSpreadComponent } from '../styled/settingsStyled';

import ProjectResource from '../../Root/resource/id';
import AccountResource from '../../Account/resource/id';
import tooltip_icon from '../../Settings/images/tooltip-icon.png';
import { SettingController } from '../services/settingController';
import IconButton from '../../Common/components/iconButton';
import Icon from '../../Common/components/Icon/Icon';
import { useSensorList } from '../../Common/hooks/useSensorList';
import Button from '../../Common/components/button';

function UpdateSpread(props) {
    const { sensorTypes } = useSensorList();

    // 취소 버튼 클릭 시 입력될 항목별 초기값
    const initialValuesRef = useRef({
        notificationName: props.selectedSpread?.notificationName || '-',
        sensorType: props.selectedSpread?.sensorType || '-',
        notifyMessage: props.selectedSpread?.notifyMessage || '',
        isActive: props.selectedSpread?.isActive,
        regularMembers: props.selectedSpread?.regularMembers || []
    });

    const [notificationName, setNotificationName] = useState(initialValuesRef.current.notificationName);
    const [sensorType, setSensorType] = useState(initialValuesRef.current.sensorType);
    const [notifyMessage, setNotifyMessage] = useState(initialValuesRef.current.notifyMessage);
    const [isActive, setIsActive] = useState(initialValuesRef.current.isActive);
    const [isValid, setIsValid] = useState(false);

    // 편집 화면에 표시할 리스트
    const displayMembers = props.isEditMode
        ? (props.selectedMembersDraft || [])
        : (props.selectedSpread?.regularMembers || []);

    // selectedSpread가 바뀌면 초기값 리셋
    useEffect(() => {
        if (!props.selectedSpread) return;

        const nextInitial = {
            notificationName: props.selectedSpread.notificationName ?? '-',
            sensorType: props.selectedSpread.sensorType ?? '-',
            notifyMessage: props.selectedSpread.notifyMessage ?? '',
            isActive: props.selectedSpread.isActive,
            regularMembers: props.selectedSpread.regularMembers || []
        };

        initialValuesRef.current = nextInitial;

        setNotificationName(nextInitial.notificationName);
        setSensorType(nextInitial.sensorType);
        setNotifyMessage(nextInitial.notifyMessage);
        setIsActive(nextInitial.isActive);

    }, [props.selectedSpread]);

    // 유효성 검사 (표출 기준 + 변경 여부 판단)
    useEffect(() => {
        const initial = initialValuesRef.current;

        const allFilled =
            notificationName.trim() !== '' &&
            String(sensorType) !== '' &&
            notifyMessage.trim() !== '' &&
            displayMembers.length > 0;

        const isChanged =
            notificationName !== initial.notificationName ||
            sensorType !== initial.sensorType ||
            notifyMessage !== initial.notifyMessage ||
            isActive !== initial.isActive ||
            JSON.stringify(props.selectedMembersDraft || []) !== JSON.stringify(initial.regularMembers);

        setIsValid(allFilled && isChanged);
    }, [
        notificationName,
        sensorType,
        notifyMessage,
        isActive,
        props.selectedMembersDraft,
        displayMembers.length
    ]);

    const getSensorTypes = () => {
        if (!sensorTypes) return null;

        return sensorTypes.map(st => (
            <option key={`sensorTpye_${st.sensorTypeCode}`} value={st.sensorTypeCode}>
                {st.sensorTypeName}
            </option>
        ));
    };

    const onEditMode = (isOn) => {
        if (isOn) {
            props.setIsEditMode(true);
        } else {
            handleEditModeCancel();
        }
    };

    const onClickDeleteSpread = () => {
        props.showConfirmDialog(
            ProjectResource.dialogTypes.QUESTION,
            ['삭제하시겠습니까?', '삭제된 데이터는 되돌릴 수 없습니다'],
            ['취소', '삭제하기'],
            deleteSpread
        );
    };

    const deleteSpread = async (index) => {
        if (index === 0) {
            props.onCloseConfirmDialog();
        } else if (index === 1) {
            const [success, message] = await SettingController.deleteSpreadMessage(props.selectedSpread.notificationNo);

            if (success) {
                props.handleToast('삭제되었습니다');
                handlePopupClose();
                props.searchSpreadList();
            } else {
                props.handleToast(message);
            }
        }
    };

    const handleEditModeCancel = () => {
        props.onCloseConfirmDialog();

        const initial = initialValuesRef.current;

        setNotificationName(initial.notificationName);
        setSensorType(initial.sensorType);
        setNotifyMessage(initial.notifyMessage);
        setIsActive(initial.isActive);

        props.setIsEditMode(false);
    };

    const handlePopupClose = () => {
        props.onCloseConfirmDialog();
        props.handlePopup(false);
    };

    const onClickClose = () => {
        if (isValid) {
            props.showConfirmDialog(
                ProjectResource.dialogTypes.QUESTION,
                ['변경한 내용을 저장하시겠습니까?', '취소 버튼 클릭 시 변경사항은 저장되지않습니다'],
                ['취소', '저장하기'],
                updateSpreadConfirm
            );
        } else {
            onEditMode(false);
        }
    };

    const onClickUpdateSpread = () => {
        if (!notificationName || String(sensorType) === '' || !notifyMessage) {
            props.handleToast('필수 항목이 입력되지 않았습니다');
            return;
        }

        if (displayMembers.length === 0) {
            props.handleToast('전파대상자가 선택되지 않았습니다');
            return;
        }

        updateSpreadConfirm(1);
    };

    const updateSpreadConfirm = (index) => {
        if (index === 0) {
            props.onCloseConfirmDialog();
            onEditMode(false);
        } else if (index === 1) {
            const notificationNo = props.selectedSpread.notificationNo;
            
            props.updateSpread(
                notificationName,
                sensorType,
                notifyMessage,
                props.selectedMembersDraft || [],
                isActive,
                notificationNo
            );
        }
    };

    const getSpreadMembers = () => {
        if (!props.isEditMode && displayMembers.length === 0) {
            return null;
        }

        const renderMemberItem = (member, index) => {
            const teamName = props.getTeamName(props.regularDatas, member);
            const stableKey = member.rgl_memb_sn ?? member.unq_key ?? `${member.memb_name}-${index}`;

            return (
                <div key={`member_${stableKey}`}>
                    <span>{index + 1}</span>
                    <span>{member.memb_name}</span>
                    <span className='line' />
                    <span>{teamName}</span>
                    <span className='line' />
                    <span>{member.telno ? AccountResource.formatNumber(member.telno) : '-'}</span>
                </div>
            );
        };

        return (
            <div className="spreadMembersCont">
                {displayMembers.map((m, i) => renderMemberItem(m, i))}
            </div>
        );
    };

    return (
        <ModalBackground>
            <UpdateSpreadComponent $isEditMode={props.isEditMode}>
                <header>
                    <h2>{props.isEditMode ? '상세정보 편집하기' : '상세정보'}</h2>
                    <div>
                        {
                            !props.isEditMode &&
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
                                        onClick={onClickDeleteSpread}
                                    >
                                        삭제
                                    </IconButton>
                                    <IconButton
                                        variant="unfill"
                                        size="xxs"
                                        icon={<Icon.Closer size={'xxs'} />}
                                        onClick={handlePopupClose}
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
                            <div>전파관리 명<span>*</span></div>
                            <div>
                                {
                                    props.isEditMode ?
                                        <input
                                            type="text"
                                            name="name"
                                            value={notificationName}
                                            onChange={(e) => setNotificationName(e.target.value)}
                                        /> :
                                        <p>{props.selectedSpread?.notificationName}</p>
                                }
                            </div>
                        </li>
                        <li>
                            <div>이벤트 유형<span>*</span></div>
                            <div>
                                {
                                    props.isEditMode ?
                                        <select
                                            id="type"
                                            name="type"
                                            value={sensorType}
                                            onChange={(e) => setSensorType(Number(e.target.value))}
                                        >
                                            {getSensorTypes()}
                                        </select> :
                                        <p>{props.selectedSpread?.sensorTypeName ? props.selectedSpread.sensorTypeName : '-'}</p>
                                }
                            </div>
                        </li>
                        <li>
                            <div>전파내용<span>*</span>
                                {
                                    props.isEditMode &&
                                        <div id='tooltip' data-tooltip="{ location } : 재난발생위치 / { date } : 재난발생시간 특수문자 사용가능" >
                                            <img src={tooltip_icon} alt='도움말 아이콘' />
                                        </div>
                                }
                            </div>
                            <div>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={notifyMessage}
                                    onChange={(e) => setNotifyMessage(e.target.value)}
                                    readOnly={!props.isEditMode}
                                />
                            </div>
                        </li>
                        <li className='spreadMembersWrap'>
                            <div>
                                <div>
                                    지정된 사용자<span>*</span>
                                    <span className='memberCount'>{`(${displayMembers.length}명)`}</span>
                                </div>
                                {
                                    props.isEditMode &&
                                        <Button
                                            className='edit'
                                            variant="outline"
                                            size="xxs"
                                            onClick={() => props.setShowFindMemberPopup(true)}
                                        >
                                            편집하기
                                        </Button>
                                }
                            </div>
                            {getSpreadMembers()}
                        </li>

                        <li>
                            <div>활성화 여부<span>*</span></div>
                            <div>
                                {
                                    props.isEditMode ?
                                        <select
                                            id="active"
                                            name="active"
                                            value={String(isActive)}
                                            onChange={(e) => setIsActive(e.target.value === 'true')}
                                        >
                                            <option value="true">YES</option>
                                            <option value="false">NO</option>
                                        </select> :
                                        <p className={isActive ? 'active yes' : 'active no'}>{isActive ? 'YES' : 'NO'}</p>
                                }
                            </div>
                        </li>
                    </ul>
                </section>
                {
                    props.isEditMode &&
                        <div className='btnWrap'>
                            <Button
                                className="cancle"
                                variant="outline"
                                size="xs"
                                onClick={onClickClose}
                            >
                                취소
                            </Button>
                            <Button
                                variant="fill"
                                size="xs"
                                disabled={!isValid}
                                onClick={onClickUpdateSpread}
                            >
                                저장하기
                            </Button>
                        </div>
                }
            </UpdateSpreadComponent>
        </ModalBackground>
    );
}

export default UpdateSpread;