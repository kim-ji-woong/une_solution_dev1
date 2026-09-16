import React from 'react';

import { AccountFindMemberComponent } from '../styled/accountManagerStyled';
import { ModalBackground } from '../../Root/styled/theme';

import close_btn from '../../Common/images/close_btn.png';

function AccountFindMember(props) {
    // 행이 6개 이상이면 Table head css값 변경
    let rowLength = 10;

    return (
        <ModalBackground>
        <AccountFindMemberComponent $rowLength={rowLength}>
            <header>
                <h2>조직정보 불러오기</h2>
                <button onClick={() => props.handlePopup(false)} className={'closeBtn'}>
                    <img src={close_btn} alt='닫기 버튼' width={16} height={16} />
                </button>
            </header>
            <section>
                <div className='searchWrap'>
                    <input type="text" id="txtSearch" placeholder='검색어를 입력해주세요.'/>
                    <button>검색</button>
                </div>
                <div className='listWrap'>
                    <ul className='accountList'>
                        <li className='head'>
                            <div>선택</div>
                            <div>NO</div>
                            <div>소속 조직</div>
                            <div>이름</div>
                            <div>직위</div>
                            <div>휴대전화번호</div>
                            <div>근무처 전화번호</div>
                            <div>Email</div>
                        </li>
                        <li className='body'>
                            <div>
                                <p>찾고자 하는 조직원의 정보를 검색해주세요.</p>
                            </div>
                            {/* <ul>
                            {
                                Array.from(Array(rowLength), x =>
                                <li>
                                    <div>
                                        <input type='radio' name='selectMember' />
                                    </div>
                                    <div>1</div>
                                    <div>개발팀</div>
                                    <div>홍길동</div>
                                    <div>과장</div>
                                    <div>010-0000-0000</div>
                                    <div>000-0000-0000</div>
                                    <div>dddd@asdf.co.kr</div>
                                </li>
                                )
                            }
                            </ul> */}
                        </li>
                    </ul>
                </div>
            </section>
            <div className='btnWrap'>
                <button className='cancle' onClick={() => props.handlePopup(false)}>취소</button>
                <button className='submit'>적용</button>
            </div>
        </AccountFindMemberComponent>
        </ModalBackground>
    );
}

export default AccountFindMember;