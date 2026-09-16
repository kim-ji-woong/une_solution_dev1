import React from 'react';
import { withRouter } from 'react-router-dom';

import { SopLinkComponent } from '../styled/settingsStyled';
import { ModalBackground } from '../../Root/styled/theme';
import close_btn from '../../Common/images/close_btn.png';
import binIcon from '../images/binIcon.svg';


function SopLink(props) {

    return (
        <ModalBackground>
        <SopLinkComponent>
            <div className='listWrap'>
                <h5>이벤트 발생 시 실행 SOP 설정</h5>
                <button onClick={() => props.handlePopup(false)} className='closeBtn'>
                    <img src={close_btn} alt='닫기 버튼' width={16} height={16} />
                </button>
            </div>

            <div className='stgList'>
                <div className='sopTreeArea'>
                    <div className='sopTreeBox sopLocationBox'>
                        <span className='sopDisableText sopActiveText'>
                            위치 : <span>{/*zoneName*/}</span>
                        </span>
                        <div className='sopLTree sopScroll'>
                            {/* 데이터 가져온 후 ui 다시 잡을 것 */}
                            {/* {spatialUI} */}
                            <ul className={'sopTree'}>
                                {
                                    Array.from(Array(5), x => 
                                    <li key={Math.random()}>
                                        <div className='depth1 on'>
                                            <h2>A동</h2>
                                        </div>
                                        <ul className='on'>
                                            <li>
                                                <div className='depth2 on'>
                                                    <h2>A-1</h2>
                                                </div>
                                                <ul className='on'>
                                                    <li>
                                                        <div className='depth3'>
                                                            <h2>A-1_1F</h2>
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

                    <div className='sopTreeBox sopTypeBox'>
                        <span className='sopDisableText sopActiveText'>센서유형 : </span>
                        <div className='sopLTree sopScroll'>
                            <ul className='sopTree'>
                                {/* {sensorTypesUI} */}
                                {
                                    Array.from(Array(10), x => 
                                    <li key={Math.random()}>
                                        <div className='sensorTxt'>대기오염 센서</div>
                                    </li>
                                    )
                                }
                                
                            </ul>
                        </div>
                    </div>
                    
                    <div className='sopTreeBox sopListBox'>
                        <span className='sopDisableTextF'>
                            <span className='sopListFlex'>SOP 목록 (재난분야 &gt; 재난종류 &gt; SOP 명)</span>
                            <span className='editIcon'></span>
                        </span>
                        <div className='sopLTree sopScroll'>
                            {/* {disasterUI} */}
                            <ul className={'sopTree'}>
                                {
                                    Array.from(Array(5), x => 
                                    <li key={Math.random()}>
                                        <div className='depth1 on'>
                                            <h2>누출</h2>
                                        </div>
                                        <ul className='on'>
                                            <li>
                                                <div className='depth2 on'>
                                                    <h2>가스 누출</h2>
                                                </div>
                                                <ul className='on'>
                                                    <li>
                                                        <div className='depth3'>
                                                            <h2>가스 누출에 의한 알람발생</h2>
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
                </div>

                <div className='sopListArea'>
                    <ul className='sopList'>
                        <li className='head'>
                            <div>NO</div>
                            <div>
                                <div className='sort'>
                                    <span>위치</span>
                                    <button className='sortBtn az' />
                                </div>
                            </div>
                            <div>
                                <div className='sort'>
                                    <span>센서유형</span>
                                    <button className='sortBtn az' />
                                </div>
                            </div>
                            <div>
                                <div className='sort'>
                                    <span>재난분야</span>
                                    <button className='sortBtn az' />
                                </div>
                            </div>
                            <div>
                                <div className='sort'>
                                    <span>재난종류</span>
                                    {/*
                                        className='az' -> 가나다라 순
                                        className='za' -> 역순
                                    */}
                                    <button className='sortBtn za' />
                                </div>
                            </div>
                            <div>SOP 명</div>
                            <div>삭제</div>
                        </li>
                        {/* {linkedSopDataUI} */}
                        <li className='body'>
                            <ul>
                            {
                                Array.from(Array(10), x =>
                                <li key={Math.random()}>
                                    <div>1</div>
                                    <div>A동</div>
                                    <div>대기오염 센서</div>
                                    <div>누출</div>
                                    <div>가스 누출</div>
                                    <div>가스 누출에 의한 알람발생</div>
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
            </div>

            <div className='btnWrap sopLink'>
                <button className='cancle'>초기화</button>
                <button className='submit'>적용</button>
            </div>
        </SopLinkComponent>
        </ModalBackground>
    );
}

export default withRouter(SopLink);