import React, { useEffect, useState } from 'react';

import { AccountListComponent } from '../styled/accountManagerStyled';
import AccountUpdateUser from './accountUpdateUser';
import Pagination from '../../Common/ui/pagination';
import AccountResource from '../resource/id';
import InputBox from '../../Common/components/inputBox';
import Icon from '../../Common/components/Icon/Icon';

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
                ui.push(
                    <li key={`user_${index}`} onClick={(e) => updateUser(e, user)}>
                        <div>{index}</div>
                        <div>{user.teamName ? user.teamName : '-'}</div>
                        <div>{user.memberName ? user.memberName : '-'}</div>
                        <div>{user.phoneNumber ? AccountResource.formatNumber(user.phoneNumber) : '-'}</div>
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
    }, [props.accountUsers]);

    useEffect(() => {
        if (!selectedUser || !props.accountUsers) return;

        const updatedUser = props.accountUsers.find(
            user => user.userNo === selectedUser.userNo
        );

        if (updatedUser) {
            setSelectedUser(updatedUser);
        }
    }, [props.accountUsers]);

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

    const handleSubmit = (value) => {
        const text = (value ?? "").trim();
        props.setSearchText(text);
        props.setPageIndex(1);   // 검색 시 1페이지로
    };

    return (
        <>
        <AccountListComponent>
            <div className='searchWrap'>
                <InputBox
                    size="sm"
                    value={props.searchText}
                    onChange={(value) => {
                        props.setSearchText(value);
                        props.setPageIndex(1);
                    }}
                    placeholder={"검색"}
                    onSubmit={handleSubmit}
                    onClear={() => props.setSearchText("")}
                    fullWidth={true}
                    leftIcon={<Icon.Search size={"xxs"} />}
                />
            </div>
            <div className='listWrap'>
                <ul className='accountList'>
                    <li className='head'>
                        <div>NO</div>
                        <div>
                            <span>소속 조직</span>
                        </div>
                        <div>
                            <div className='sort'>
                                <span>이름</span>
                                <button className={props.sortOrder.memberName === 'asc' ? 'az' : 'za'} onClick={() => props.onClickSortUsers(AccountResource.sortType.memberName)} />
                            </div>
                        </div>
                        <div>
                            <span>휴대전화번호</span>
                        </div>
                        <div>
                            <div className='sort'>
                                <span>사용자 ID</span>
                                <button className={props.sortOrder.userID === 'asc' ? 'az' : 'za'} onClick={() => props.onClickSortUsers(AccountResource.sortType.userID)} />
                            </div>
                        </div>
                        <div>
                            <div className='sort'>
                                <span>계정 권한</span>
                                <button className={props.sortOrder.grade === 'asc' ? 'az' : 'za'} onClick={() => props.onClickSortUsers(AccountResource.sortType.grade)} />
                            </div>
                        </div>
                    </li>
                    <li className='body'>
                        <ul>
                            {displayContent}
                        </ul>
                    </li>
                </ul>
                {(props.listCount > 0) &&
                    <Pagination
                        totalPage={props.totalCount}
                        limit={props.pageRowCount}
                        page={props.pageIndex}
                        setPage={props.setPage}
                        bottom={"28px"}
                    />
                }
            </div>
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