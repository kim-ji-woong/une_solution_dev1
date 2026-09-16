import React, { useState } from 'react';

import { AccountAddUserComponent } from '../styled/accountManagerStyled';
import AccountFindMember from './accountFindMember';

function AccountAddUser(props) {
    const [showFindMemberPopup, setShowFindMemberPopup] = useState(false);

    const handlePopup = (isShow) => {
        setShowFindMemberPopup(isShow);
    }

    return (
        <>
        <AccountAddUserComponent>
            <div className='infoWrap'>
                <p>신규등록 시 유의사항</p>
                <p>정책내용 1</p>
                <p>정책내용 2</p>
            </div>
            <div className='listWrap'>
                <ul className='accountList'>
                    <li className='head'>
                        <div>소속 조직</div>
                        <div>이름</div>
                        <div>직위</div>
                        <div>사용자ID</div>
                        <div>권한</div>
                    </li>
                    <li className='body'>
                        <div>
                            <button
                                onClick={() => handlePopup(true)}
                            >
                                조직정보 불러오기
                            </button>
                        </div>
                        {/* <ul>
                            <li>
                                <div>부산산단_안전관리팀</div>
                                <div>홍길동</div>
                                <div>과장</div>
                                <div>
                                    <input type='text' />
                                </div>
                                <div>
                                    <select defaultValue="">
                                        <option value="" disabled>권한을 지정해주세요.</option>
                                        <option value="1">마스터</option>
                                        <option value="2">관리자</option>
                                        <option value="3">총괄관리자</option>
                                    </select>
                                </div>
                            </li>
                        </ul> */}
                    </li>
                </ul>
            </div>
            <div className='btnWrap'>
                <button className='cancle'>취소</button>
                <button className='submit'>등록</button>
            </div>
        </AccountAddUserComponent>
        {
            showFindMemberPopup &&
            <AccountFindMember
                handlePopup={handlePopup}
            />
        }
        </>
    );
}

export default AccountAddUser;