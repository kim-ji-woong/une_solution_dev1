import React, { useEffect, useState } from 'react';

import { AccountListComponent } from '../styled/accountManagerStyled';
import AccountUpdateUser from './accountUpdateUser';
import Pagination from '../../Common/ui/pagination';
import AccountResource from '../resource/id';

function AccountList(props) {
    const [showUpdateUserPopup, setShowUpdateUserPopup] = useState(false);
    const [displayContent, setDisplayContent] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        let ui = [];

        if (props.accountUsers && props.accountUsers.length > 0) {
            let index = 1;

            if (props.pageIndex > 1) {
                index = props.pageIndex * props.pageRowCount - (props.pageRowCount - 1);
            }

            for (const user of props.accountUsers) {
                if (props.loginUserInfo.user_sn === user.userNo) continue;  // 로그인한 본인 계정은 확인 불가
                
                ui.push(
                    <li key={`user_${index}`} onClick={(e) => updateUser(e, user)}>
                        <div>{index}</div>
                        <div>{user.memberName ? user.memberName : '-'}</div>
                        <div>{user.teamName ? user.teamName : '-'}</div>
                        <div>{user.jobPosition ? user.jobPosition : '-'}</div>
                        <div>{user.userID ? user.userID : '-'}</div>
                        <div>{user.grade ? user.grade : '-'}</div>
                    </li>
                );
                index++;
            }
            setDisplayContent(ui);
        }
        else {
			setDisplayContent([]);
		}
    }, [props.accountUsers])

    const updateUser = (e, user) => {
        e.preventDefault();
        e.currentTarget.classList.add('selectUser');
        setSelectedUser(user);
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

    const searchEnterKey = () => {
        if (window.event && window.event.keyCode === 13) {    
            search();
        }
    }

    const search = () => {
        const text = document.getElementById('txtSearch').value;
        props.setSearchText(text);
        props.setPageIndex(1);
    }

    return (
        <>
        <AccountListComponent>
            <div className='searchWrap'>
                <div className='searchBox'>
                    <input
                        type='text'
                        id='txtSearch'
                        onKeyUp={searchEnterKey}
                        placeholder='검색어를 입력하세요'
                    />
                    <button onClick={search}>검색</button>
                </div>
                <p className='resultCount'>총 {displayContent?.length || 0}건</p>
            </div>
            <div className='listWrap'>
                <ul className='accountList'>
                    <li className='head'>
                        <div>NO</div>
                        <div>이름</div>
                        <div>
                            <div className='sort'>
                                <span>소속 조직</span>
                                <button className={props.sortOrder.teamName === 'asc' ? 'az' : 'za'} onClick={() => props.onClickSortUsers(AccountResource.sortType.teamName)} />
                            </div>
                        </div>
                        <div>
                            <div className='sort'>
                                <span>직위</span>
                                <button className={props.sortOrder.jobPosition === 'asc' ? 'az' : 'za'} onClick={() => props.onClickSortUsers(AccountResource.sortType.jobPosition)} />
                            </div>
                        </div>
                        <div>아이디</div>
                        <div>
                            <div className='sort'>
                                <span>권한</span>
                                <button className={props.sortOrder.grade === 'asc' ? 'az' : 'za'} onClick={() => props.onClickSortUsers(AccountResource.sortType.grade)} />
                            </div>
                        </div>
                    </li>
                    <li className='body'>
                        <ul>
                        {
                            displayContent
                        }
                        </ul>
                    </li>
                </ul>
            </div>
            {
                (props.listCount > 0) &&
                <Pagination
                    totalPage={props.totalCount}
                    limit={props.pageRowCount}
                    page={props.pageIndex}
                    setPage={props.setPage}
                    className='account'
                />
            }
        </AccountListComponent>
        {
            showUpdateUserPopup &&
            <AccountUpdateUser
                handlePopup={handlePopup}
                showConfirmDialog={props.showConfirmDialog}
                onCloseConfirmDialog={props.onCloseConfirmDialog}
                selectedUser={selectedUser}
                grades={props.grades}
                searchAccountUsers={props.searchAccountUsers}
                handleToast={props.handleToast}
                loginUserInfo={props.loginUserInfo}
            />
        }
        </>
    );
}

export default AccountList;