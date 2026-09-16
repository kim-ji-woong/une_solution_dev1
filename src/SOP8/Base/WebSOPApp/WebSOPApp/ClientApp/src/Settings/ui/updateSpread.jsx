import React, { useState, useEffect, useRef } from 'react';

import { ModalBackground } from '../../Root/styled/theme';
import { UpdateSpreadComponent } from '../styled/settingsStyled';

import close_btn from '../../Common/images/close_btn.png';
import ProjectResource from '../../Root/resource/id';
import AccountResource from '../../Account/resource/id';
import SettingsResource from '../resource/id';
import tooltip_icon from '../../Settings/images/tooltip-icon.png';
import { SettingController } from '../services/settingController';

function UpdateSpread(props) {
    // 취소 버튼 클릭 시 입력될 항목별 초기값
    const initialValuesRef = useRef({
        notificationName: props.selectedSpread?.notificationName || '-',
        detectType: SettingsResource.convertDetectTypeStringToName(props.selectedSpread?.detectType),
        sensorType: props.selectedSpread?.sensorType || '-',
        notifyMessage: props.selectedSpread?.notifyMessage || '',
        isActive: props.selectedSpread?.isActive,
    });

    const refSearchText = useRef(null);

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

    const getSensorTypes = () => {
		let ui = [];

		if (props.sensorTypes) {
			for (const sensorType of props.sensorTypes) {
				ui.push(
					<option key={`sensorTpye_${sensorType.co_code}`} value={sensorType.co_code}>{sensorType.sensor_type_name}</option>
				);
            }
        }

		return ui;
    }

    const onEditMode = (isOn) => {
        if(isOn) {
            props.setIsEditMode(isOn);
        } else {
            props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['취소하시겠습니까?'], ['확인'], handleEditMode);
        }
    }

    const onClickDeleteSpread = () => {
        props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['삭제하시겠습니까?'], ['확인'], deleteSpread);
    }

    const deleteSpread = async () => {
        const [success, message] = await SettingController.deleteSpreadMessage(props.selectedSpread.notificationNo);

        if (success) {
            props.showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, ['삭제되었습니다.'], ['확인'], handlePopup);
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

    const handleSpreadMembersList = (member, isRegistering) => {
        if (isRegistering) {
            const newSpreadMembersList = [...spreadMembersList];
            newSpreadMembersList.push(member);
            setSpreadMembersList(newSpreadMembersList);
        }
        else {
            const newSpreadMembersList = spreadMembersList.filter((item) => item.rgl_memb_sn !== member.rgl_memb_sn);
            setSpreadMembersList(newSpreadMembersList);
        }
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
                    {props.isEditMode && (
                        <span>
                            {
                                isSearch ? 
                                    <button className='add' onClick={() => handleSpreadMembersList(member, true)}>등록</button>:
                                    <button className='remove' onClick={() => handleSpreadMembersList(member, false)}>삭제</button>
                            }
                        </span>
                    )}
                </div>
            );
        };

        const memberItems = spreadMembersList.map((member, index) =>
            renderMemberItem(member, index)
        );

        const filteredRegularMembers = props.regularMembers.filter(regular =>
            !spreadMembersList.some(spread => spread.rgl_memb_sn === regular.rgl_memb_sn)
        );

        const searchMemberItems = filteredRegularMembers.map((member, index) =>
            renderMemberItem(member, index, true)
        );

        if (!props.isEditMode) {
            return <div className="spreadMembersCont">{memberItems}</div>;
        }

        return (
            <div className="spreadMembersSearchWrap">
                <div>
                    <span>검색결과{`(${searchMemberItems.length}건)`}</span>
                    <div className="spreadMembersSearch">
                        {searchMemberItems}
                    </div>
                </div>
                <div>
                    <span>목록{`(${memberItems.length}건)`}</span>
                    <div className="spreadMembersList">
                        {memberItems}
                    </div>
                </div>
            </div>
        );
    };

    const searchEnterKey = (text) => {
        if (window.event && window.event.keyCode === 13) {    
            props.setRegularMembers(text);
        }
    }

    const onClickUpdateSpread = () => {
        if (!notificationName || !detectType || !sensorType || !notifyMessage) {
            props.showConfirmDialog(ProjectResource.dialogTypes.WARNING, ['필수 항목이 입력되지 않았습니다.'], null, null);
            return;
        }

        if (spreadMembersList.length === 0) {
            props.showConfirmDialog(ProjectResource.dialogTypes.WARNING, ['전파대상자가 선택되지 않았습니다.'], null, null);
            return;
        }

        props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ['저장하시겠습니까?'], ['확인'], updateSpread);
    }

    const updateSpread = () => {
        const notificationNo = props.selectedSpread.notificationNo;
        props.updateSpread(notificationName, detectType, sensorType, notifyMessage, spreadMembersList, isActive, notificationNo);
    }

    return (
        <ModalBackground>
        <UpdateSpreadComponent $isEditMode={props.isEditMode}>
            <header>
                <h2>상세정보</h2>
                <button onClick={() => props.handlePopup(false)} className={'closeBtn'}>
                    <img src={close_btn} alt='닫기 버튼' width={16} height={16} />
                </button>
            </header>
            <section>
                <div>
                    <button 
                        className={props.isEditMode ? 'on' : 'off'}
                        onClick={() => onEditMode(true)}
                    >
                        편집
                    </button>
                    <button
                        onClick={() => onClickDeleteSpread()}
                    >
                        삭제
                    </button>
                </div>
                <ul>
                    <li>
                        <div>전파관리명<span>*</span></div>
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
                        <div>전파구분<span>*</span></div>
                        <div>
                            {
                                props.isEditMode ?
                                    <select 
                                        id="category"
                                        name="category"
                                        value={detectType}
                                        onChange={(e) => setDetectType(Number(e.target.value))}
                                    >
                                        <option value={SettingsResource.detectType.센서탐지}>센서탐지</option>
                                        <option value={SettingsResource.detectType.재난신고}>재난신고</option>
                                    </select> :
                                    <p>{props.selectedSpread?.detectType ? props.selectedSpread.detectType : '-'}</p> 
                            }
                        </div>
                    </li>
                    <li>
                        <div>센서유형<span>*</span></div>
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
                    <li className='spreadMembersWrap'>
                        <div>
                            <div>전파대상자{!props.isEditMode && `(${spreadMembersList.length})`}<span>*</span>
                            </div>
                            <div className='searchWrap'>
                                <input type="text" ref={refSearchText} placeholder='검색어를 입력해주세요.' onKeyUp={() => searchEnterKey(refSearchText.current?.value ?? '')} />
                                <button onClick={() => props.setRegularMembers(refSearchText.current?.value ?? '')}>검색</button>
                            </div>
                        </div>
                        {
                            getSpreadMembers()
                        }
                    </li>
                    <li>
                        <div>전파내용<span>*</span>
                            <div id='tooltip' data-tooltip="{ location } : 재난발생위치 / { date } : 재난발생시간 특수문자 사용가능" >
                                <img src={tooltip_icon} alt='도움말 아이콘' />
                            </div>
                        </div>
                        <div>
                            <textarea
                                id="content"
                                name="content"
                                value={notifyMessage}
                                onChange={(e) => setNotifyMessage(e.target.value)}
                                readOnly={props.isEditMode ? false : true}
                            />
                        </div>
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
                                    <p>{isActive ? 'YES' : 'NO'}</p> 
                            }
                        </div>
                    </li>
                </ul>
            </section>
            {
                props.isEditMode &&
                    <div className='btnWrap'>
                        <button className='cancle' onClick={() => onEditMode(false)}>취소</button>
                        <button className='submit' onClick={() => onClickUpdateSpread()}>저장</button>
                    </div>
            }
        </UpdateSpreadComponent>
        </ModalBackground>
    );
}

export default UpdateSpread;