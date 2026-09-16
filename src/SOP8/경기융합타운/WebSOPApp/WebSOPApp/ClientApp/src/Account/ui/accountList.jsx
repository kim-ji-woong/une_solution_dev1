import React, { useState } from 'react';

import { AccountListComponent } from '../styled/accountManagerStyled';
import AccountUpdateUser from './accountUpdateUser';

function AccountList(props) {
    const [showUpdateUserPopup, setShowUpdateUserPopup] = useState(false);

    const updateUser = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('selectUser');
        handlePopup(true);
    }

    const handlePopup = (isShow) => {
        if(!isShow) {
            let element = document.getElementsByClassName('selectUser');
            element = Array.prototype.slice.call(element);

            // 사용자 선택 팝업 닫히면 선택된 li tag의 클래스도 삭제
            element.length > 0 &&
                element.map((item) => item.classList.remove('selectUser'));
        }
        setShowUpdateUserPopup(isShow);
    }

    return (
        <>
        <AccountListComponent>
            <div className='searchWrap'>
                <input type="text" id="txtSearch" placeholder='검색어를 입력해주세요.'/>
                <button>검색</button>
            </div>
            <div className='listWrap'>
                <ul className='accountList'>
                    <li className='head'>
                        <div>NO</div>
                        <div>
                            <div className='sort'>
                                <span>소속 조직</span>
                                <button className='sortBtn az' />
                            </div>
                        </div>
                        <div>이름</div>
                        <div>
                            <div className='sort'>
                                <span>직위</span>
                                <button className='sortBtn az' />
                            </div>
                        </div>
                        <div>사용자ID</div>
                        <div>
                            <div className='sort'>
                                <span>권한</span>
                                <button className='sortBtn az' />
                            </div>
                        </div>
                    </li>
                    <li className='body'>
                        <ul>
                        {
                            Array.from(Array(14), x =>
                            <li onClick={updateUser}>
                                <div>1</div>
                                <div>부산산단_안전관리팀</div>
                                <div>홍길동</div>
                                <div>과장</div>
                                <div>SDFFRRD0124</div>
                                <div>총괄관리자</div>
                            </li>
                            )
                        }
                        </ul>
                    </li>
                </ul>
                <div className='pagenation'>
                    <button className='first'>맨앞</button>
                    <button className='prev'>이전</button>
                    <ul>
                        <li className='on'><button>1</button></li>
                        <li><button>2</button></li>
                        <li><button>3</button></li>
                    </ul>
                    <button className='next'>다음</button>
                    <button className='last'>맨뒤</button>
                </div>
            </div>
        </AccountListComponent>
        {
            showUpdateUserPopup &&
            <AccountUpdateUser
                handlePopup={handlePopup}
                showConfirmDialog={props.showConfirmDialog}
                onCloseConfirmDialog={props.onCloseConfirmDialog}
            />
        }
        </>
    );
}

export default AccountList;