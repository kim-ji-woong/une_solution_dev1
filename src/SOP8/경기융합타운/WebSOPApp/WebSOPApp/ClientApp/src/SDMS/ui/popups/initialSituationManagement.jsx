import React, { useState } from 'react';

import { ModalBackground } from '../../../Root/styled/theme';
import { InitialSituationManagementComponent, EditReceiverComponent } from '../../styled/sdmsPopupsStyled';

import close_btn from '../../../Common/images/close_btn.png';
import tooltip_icon from '../../../Settings/images/tooltip-icon.png';
import binIcon from '../../../Settings/images/binIcon.svg';

function InitialSituationManagement(props) {
    const [showEditReceiver, setShowEditReceiver] = useState(false);

    const handlePopup = (value) => {
        setShowEditReceiver(value);
    }

    return (
        <ModalBackground>
        <InitialSituationManagementComponent>
            <button onClick={() => props.handlePopups('initialSituationManagement', false)} className={'closeBtn'}>
                <img src={close_btn} alt='닫기 버튼' width={16} height={16} />
            </button>
            <div className='menuWrap'>
                <h2>초기상황 전파관리</h2>
            </div>
            <section>
                <div className='filterWrap'>
                    <select>
                        <option>전체</option>
                        <option>대기센서</option>
                        <option>저감설비</option>
                        <option>배출설비</option>
                    </select>
                    <select>
                        <option>전체</option>
                    </select>
                    <select disabled>
                        <option>재난위치2</option>
                    </select>
                    <button 
                        className={showEditReceiver ? 'on' : null}
                        onClick={() => handlePopup(true)}
                    >
                        <p>전파 대상자 지정</p>
                    </button>
                </div>
                <div className='receiverWrap'>
                    <p>수신자 :</p>
                    <ul>
                        <li>홍길동</li>
                        <li>홍길동</li>
                    </ul>
                </div>
                <div className='contentWrap'>
                    <div className='header'>
                        <p>문자내용 작성</p>
                        <div id='tooltip' data-tooltip="{ location } : 재난발생위치 / { date } : 재난발생시간 특수문자 사용가능" >
                            <img src={tooltip_icon} alt='도움말 아이콘' />
                        </div>
                    </div>
                    <div className='content'>
                        <textarea></textarea>
                    </div>
                </div>
            </section>
            <div className='btnWrap'>
                <button className='cancle' onClick={() => props.handlePopups('initialSituationManagement', false)}>취소</button>
                <button className='submit'>적용</button>
            </div>
        </InitialSituationManagementComponent>
        {
            showEditReceiver &&
            <EditReceiver
                handlePopup={handlePopup}
            />
        }
        </ModalBackground>
    );
}

export default InitialSituationManagement;



// 수신자 편집
function EditReceiver(props) {

    return (
    <ModalBackground>
    <EditReceiverComponent>
        <button onClick={() => props.handlePopup(false)} className={'closeBtn'}>
            <img src={close_btn} alt='닫기 버튼' width={16} height={16} />
        </button>
        <h2>수신자 편집</h2>

        <section>
            <div className='selectWrap'>
                <div className='teamList'>
                    <p>부산산단</p>
                    <div className='scroll'>
                        <ul className={'teamTree'}>
                            {
                                Array.from(Array(5), x => 
                                <li>
                                    <div className='depth1 on'>
                                        <h2>부산산단</h2>
                                    </div>
                                    <ul className='on'>
                                        <li>
                                            <div className='depth2 on'>
                                                <h2>물류팀</h2>
                                            </div>
                                            <ul className='on'>
                                                <li>
                                                    <div className='depth3'>
                                                        <h2>물류1팀</h2>
                                                    </div>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
                <div className='memberList'>
                    <p>팀원</p>
                    <ul className='scroll'>
                        <li className='selected'>
                            <p>홍길동</p>
                        </li>
                        <li className='selected'>
                            <p>홍길동</p>
                        </li>
                        <li><p>홍길동</p></li>
                        <li><p>홍길동</p></li>
                        <li><p>홍길동</p></li>
                        <li><p>홍길동</p></li>
                    </ul>
                </div>
            </div>
            
            <div className='selectedMemberList'>
                <ul className='selectedMember'>
                    <li className='head'>
                        <div>NO</div>
                        <div>
                            <div className='sort'>
                                <span>이름</span>
                                {/*
                                    className='az' -> 가나다라 순
                                    className='za' -> 역순
                                */}
                                <button className='sortBtn az' />
                            </div>
                        </div>
                        <div>삭제</div>
                    </li>
                    {/* {linkedSopDataUI} */}
                    <li className='body'>
                        <ul>
                        {
                            Array.from(Array(10), x =>
                            <li>
                                <div>1</div>
                                <div>홍길동</div>
                                <div>
                                    <button className={'binIcon'}>
                                        <img src={binIcon} alt='삭제 아이콘' />
                                    </button>
                                </div>
                            </li>
                            )
                        }
                        </ul>
                    </li>
                </ul>
            </div>
        </section>

        <div className='btnWrap'>
            <button className='cancle' onClick={() => props.handlePopup(false)}>초기화</button>
            <button className='submit'>적용</button>
        </div>
    </EditReceiverComponent>
    </ModalBackground>
    );
}