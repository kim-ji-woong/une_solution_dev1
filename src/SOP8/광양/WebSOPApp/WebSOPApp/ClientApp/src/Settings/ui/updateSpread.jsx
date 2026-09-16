import React, { useState, useEffect, useRef } from 'react';

import { ModalBackground } from '../../Root/styled/theme';
import { UpdateSpreadComponent } from '../styled/settingsStyled';

import ProjectResource from '../../Root/resource/id';
import AccountResource from '../../Account/resource/id';
import SettingsResource from '../resource/id';
import tooltip_icon from '../../Settings/images/tooltip_icon.svg';
import { SettingController } from '../services/settingController';
import TextButton from '../../Common/components/textButton';
import IconButton from '../../Common/components/iconButton';
import Icon from '../../Common/components/Icon/Icon';
import TextareaBox from '../../Common/components/textareaBox';
import InputBox from '../../Common/components/inputBox';
import DropBox from '../../Common/components/dropBox';
import BoxButton from '../../Common/components/boxButton';
import TextToggleSwitch from '../../Common/ui/textToggleSwitch';

function UpdateSpread(props) {
    const [openDropId, setOpenDropId] = useState(null);

    // 취소 버튼 클릭 시 입력될 항목별 초기값
    const initialValuesRef = useRef({
        notificationName: props.selectedSpread?.notificationName || '-',
        detectType: SettingsResource.convertDetectTypeStringToName(props.selectedSpread?.detectType),
        sensorType: props.selectedSpread?.sensorType || '-',
        notifyMessage: props.selectedSpread?.notifyMessage || '',
        isActive: props.selectedSpread?.isActive,
    });

    const [spreadMembersList, setSpreadMembersList] = useState([]);

    const [notificationName, setNotificationName] = useState(initialValuesRef.current.notificationName);
    const [detectType, setDetectType] = useState(initialValuesRef.current.detectType);
    const [sensorType, setSensorType] = useState(initialValuesRef.current.sensorType);
    const [notifyMessage, setNotifyMessage] = useState(initialValuesRef.current.notifyMessage);
    const [isActive, setIsActive] = useState(initialValuesRef.current.isActive);

    useEffect(() => {
        if (!props.selectedSpread) return;
        setSpreadMembersList(props.selectedSpread.regularMembers);
    }, [props.isEditMode, props.selectedSpread]);

    useEffect(() => {
        if (!props.isEditMode) return;
        if (!props.selectedMembers) return;

        setSpreadMembersList(props.selectedMembers);

    }, [props.selectedMembers]);

    const getSensorTypes = () => {
		let ui = [];

		if (props.sensorTypes) {
			for (const sensorType of props.sensorTypes) {
                ui.push({ value: sensorType.co_code, label: sensorType.sensor_type_name });
            }
        }

		return ui;
    }

    const onEditMode = (isOn) => {
        if(isOn) {
            props.setIsEditMode(isOn);
        } else {
            handleEditMode();
        }
    }

    const onClickDeleteSpread = () => {
        props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['삭제하시겠습니까?', '삭제된 데이터는 되돌릴 수 없습니다'], ['취소', '삭제하기'], deleteSpread);
    }

    const deleteSpread = async (index) => {
        if (index === 0) {
            props.onCloseConfirmDialog();
            return;
        }
        
        const [success, message] = await SettingController.deleteSpreadMessage(props.selectedSpread.notificationNo);

        if (success) {
            props.handleToast('삭제되었습니다.')
            handlePopup();
            props.searchSpreadList();
        }
        else {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
    }

    const handleEditMode = () => {
        props.onCloseConfirmDialog();

        const initial = initialValuesRef.current;

        setNotificationName(initial.notificationName);
        setDetectType(initial.detectType);
        setSensorType(initial.sensorType);
        setNotifyMessage(initial.notifyMessage);
        setIsActive(initial.isActive);
        
        props.setIsEditMode(false);
    }

    const handlePopup = () => {
        props.onCloseConfirmDialog();
        props.handlePopup(false);
    }

    const getSpreadMembers = () => {
        if (!props.isEditMode && spreadMembersList.length === 0) {
            return '';
        }

        const renderMemberItem = (member, index, isSearch = false) => {
            const teamName = props.getTeamName(props.regularDatas, member);

            return (
                <div key={`${isSearch ? 'search_' : ''}member_${index}`}>
                    <span>{index + 1}</span>
                    <span>{member.memb_name}</span>
                    <span className='line' />
                    <span>{teamName}</span>
                    <span className='line' />
                    <span>{member.telno ? AccountResource.formatNumber(member.telno) : '-'}</span>
                </div>
            );
        };

        const memberItems = spreadMembersList.map((member, index) =>
            renderMemberItem(member, index)
        );

        return <div className="spreadMembersCont">{memberItems}</div>;
    };

    const updateSpread = () => {
        const notificationNo = props.selectedSpread.notificationNo;
        props.updateSpread(notificationName, detectType, sensorType, notifyMessage, spreadMembersList, isActive, notificationNo);
    }

    const onClickFindMember = async () => {
        await props.setRegularMembers('');
        props.setShowFindMemberPopup(true);
    };

    const isMembersChanged = () => {
        const initialMembers = props.selectedSpread?.regularMembers || [];

        if (initialMembers.length !== spreadMembersList.length) {
            return true;
        }

        const initialIds = initialMembers.map(m => Number(m.rgl_memb_sn)).sort();
        const currentIds = spreadMembersList.map(m => Number(m.rgl_memb_sn)).sort();

        return initialIds.some((id, index) => id !== currentIds[index]);
    };

    const isChanged =
        notificationName !== initialValuesRef.current.notificationName ||
        detectType !== initialValuesRef.current.detectType ||
        sensorType !== initialValuesRef.current.sensorType ||
        notifyMessage !== initialValuesRef.current.notifyMessage ||
        isActive !== initialValuesRef.current.isActive ||
        isMembersChanged();

    const isValid =
        notificationName.trim() !== '' &&
        spreadMembersList.length > 0;
    
    const canSave = isChanged && isValid;


    return (
        <ModalBackground>
            <UpdateSpreadComponent $isEditMode={props.isEditMode}>
                <header>
                    <h2>{props.isEditMode ? '상세 정보 편집' : '상세 정보'}</h2>
                    {!props.isEditMode &&
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
                                onClick={() => onClickDeleteSpread()}
                            >
                                삭제
                            </IconButton>
                        </div>
                    }
                </header>
                <section>
                    <ul>
                        <li>
                            <div>전파관리명</div>
                            <div>
                                {props.isEditMode ?
                                    <InputBox
                                        size='sm'
                                        fullWidth
                                        value={notificationName}
                                        onChange={setNotificationName}
                                        placeholder={"전파관리명"}
                                        onClear={() => setNotificationName("")}
                                    /> :
                                    <p>{props.selectedSpread?.notificationName}</p> 
                                }
                            </div>
                        </li>
                        <li>
                            <div>전파구분</div>
                            <div>
                                {props.isEditMode ?
                                    <DropBox
                                        id="detectType"
                                        placeholder="전파구분명"
                                        fullWidth
                                        value={detectType}
                                        onChange={setDetectType}
                                        options={[
                                            { value: SettingsResource.detectType.센서탐지, label: '센서탐지' },
                                            { value: SettingsResource.detectType.재난신고, label: '재난신고' }
                                        ]}
                                        openId={openDropId}
                                        setOpenId={setOpenDropId}
                                    /> :
                                    <p>{props.selectedSpread?.detectType ? props.selectedSpread.detectType : '-'}</p> 
                                }
                            </div>
                        </li>
                        <li>
                            <div>센서유형</div>
                            <div>
                                {props.isEditMode ?
                                    <DropBox
                                        id="sensorType"
                                        placeholder="전파구분명"
                                        fullWidth
                                        value={sensorType}
                                        onChange={setSensorType}
                                        options={getSensorTypes()}
                                        openId={openDropId}
                                        setOpenId={setOpenDropId}
                                    /> :
                                    <p>{props.selectedSpread?.sensorTypeName ? props.selectedSpread.sensorTypeName : '-'}</p> 
                                }
                            </div>
                        </li>
                        <li className='spreadMembersWrap'>
                            <div className='head'>
                                <div>
                                    지정된 사용자
                                    <span>
                                        {!props.isEditMode && `(${spreadMembersList.length}명)`}
                                    </span>
                                </div>
                                {props.isEditMode &&
                                    <BoxButton
                                        variant="ghost"
                                        size="xxs"
                                        onClick={onClickFindMember}
                                    >
                                        불러오기
                                    </BoxButton>
                                }
                            </div>
                            {getSpreadMembers()}
                        </li>
                        <li>
                            <div>
                                전파내용
                                {props.isEditMode &&
                                    <div id='tooltip' data-tooltip="{ location } : 재난발생위치 / { date } : 재난발생시간 특수문자 사용가능" >
                                        <img src={tooltip_icon} alt='도움말 아이콘' width={14} height={14} />
                                    </div>
                                }
                            </div>
                            <div>
                                <TextareaBox
                                    value={notifyMessage}
                                    onChange={setNotifyMessage}
                                    height="120px"
                                    fullWidth
                                    showCharCount={false}
                                    isEditMode={props.isEditMode}
                                />
                            </div>
                        </li>
                        <li>
                            <div>활성화 여부</div>
                            <div>
                                {props.isEditMode ?
                                    <TextToggleSwitch
                                        checked={isActive}
                                        onChange={setIsActive}
                                        leftText="활성화"
                                        rightText="비활성화"
                                        leftIcon={<Icon.Check size='xxs' />}
                                        rightIcon={<Icon.IconCancel size='xxs' />}
                                    /> :
                                    <p>
                                        {isActive ? 
                                            <span className='yes'>
                                                <Icon.Check size='xxs' fill='#37B44A' />
                                                활성화
                                            </span> :
                                            <span className='no'>
                                                <Icon.IconCancel size='xxs' fill='#FB5454' />
                                                비활성화
                                            </span>
                                        }
                                    </p> 
                                }
                            </div>
                        </li>
                    </ul>
                </section>
                <div className='btnWrap'>
                    {props.isEditMode ?
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
                                onClick={() => updateSpread()}
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
            </UpdateSpreadComponent>
        </ModalBackground>
    );
}

export default UpdateSpread;