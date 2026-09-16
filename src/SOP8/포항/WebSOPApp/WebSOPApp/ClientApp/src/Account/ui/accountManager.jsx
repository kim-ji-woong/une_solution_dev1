import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import { AccountManagerComponent } from '../styled/accountManagerStyled';
import { ModalBackground } from '../../Root/styled/theme';
import AccountResource from '../resource/id';
import ConfirmDialog from '../../Common/ui/confirmDialog';

import close_btn from '../../Common/images/close_btn.png';
import AccountList from './accountList';
import AccountAddUser from './accountAddUser';
import { AccountController } from '../services/accountController';
import { TeamEditController } from '../../TeamEditor/services/teamEditController';

function AccountManager(props) {
    const [menu, setMenu] = useState(AccountResource.menu.accountList);
    const [accountUsers, setAccountUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [grades, setGrades] = useState([]);
    const [jobLevels, setJobLevels] = useState([]);
    const [regularDatas, setRegularDatas] = useState([]);
    const [sortOrder, setSortOrder] = useState({
        teamName: 'desc',
        jobLevel: 'desc',
        grade: 'desc'
    });

    const [pageIndex, setPageIndex] = useState(1);
    const [pageRowCount, setPageRowCount] = useState(14);
    const [totalCount, setTotalCount] = useState(0);
    const [listCount, setListCount] = useState(0);

    const [confirmMessage, setConfirmMessage] = useState({
        visible: false,
        type: null,
        messages: [""],
        buttons: ["확인"],
        onClickButton: null
    });

    useEffect(() => {
        init();
    }, [])

    useEffect(() => {
        searchAccountUsers();
    }, [searchText, pageIndex])

    const init = async () => {
        const [grades] = await AccountController.requestGradeList();
        const [jobLevels] = await TeamEditController.getJobLevels(); // 직위
        let [regularDatas] = await TeamEditController.displayRegular();

        if (grades && grades.length > 0) {
            setGrades(grades);
        }

        if (jobLevels && jobLevels.length > 0) {
            setJobLevels(jobLevels);
        }

        if (regularDatas && regularDatas.length > 0) {
            setRegularDatas(regularDatas);
        }
    }

    const searchAccountUsers = async () => {
        const [users, totalCount] = await AccountController.requestUserList(searchText, pageIndex, pageRowCount);

        if (users && users.length > 0) {
            const newTotalCount = Math.ceil(totalCount / pageRowCount);

            setAccountUsers(users);
            setTotalCount(newTotalCount);
			setListCount(totalCount);
        }
    }

    const showConfirmDialog = (type, messages, buttons, onClickButton) => {
        const confirmInfo = {};
        confirmInfo.visible = true;
		confirmInfo.type = type;
        confirmInfo.messages = messages;
		confirmInfo.buttons = buttons;
		confirmInfo.onClickButton = onClickButton;

        if (!messages) {
            confirmInfo.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmInfo.messages = messages;
        }
        else {
            confirmInfo.messages = [messages];
        }

        setConfirmMessage(confirmInfo);
    }

    const onCloseConfirmDialog = () => {
		const confirmInfo = {};
		confirmInfo.visible = false;

        setConfirmMessage(confirmInfo);
	}

    const onClickMenu = (menu) => {
        setMenu(menu);

        if (menu === AccountResource.menu.accountList && pageIndex !== 1) {
            setPageIndex(1);
        }
    }

    const setPage = (page) => {
		setPageIndex(page);
    }

    const onClickSortUsers = (sortType) => {
        let sortOrders = { ...sortOrder };
    
        let newSortOrder = null;
    
        if (sortType === AccountResource.sortType.teamName) {
            newSortOrder = sortOrder.teamName === 'asc' ? 'desc' : 'asc';
            sortOrders.teamName = newSortOrder;
        }
        else if (sortType === AccountResource.sortType.jobLevel) {
            newSortOrder = sortOrder.jobLevel === 'asc' ? 'desc' : 'asc';
            sortOrders.jobLevel = newSortOrder;
        }
        else if (sortType === AccountResource.sortType.grade) {
            newSortOrder = sortOrder.grade === 'asc' ? 'desc' : 'asc';
            sortOrders.grade = newSortOrder;
        }
    
        const sortedUsers = getSortUsers(accountUsers, sortType, newSortOrder);
        setAccountUsers(sortedUsers);
        setSortOrder(sortOrders);
    };

    const getSortUsers = (users, sortType, sortOrder) => {
        const sorted = [...users];
    
        const getValue = (val) => val ?? '';  // 데이터가 null or undefined이면 ''로 변환
    
        switch (sortType) {
            case AccountResource.sortType.teamName:
                sorted.sort((a, b) =>
                    sortOrder === 'desc'
                        ? getValue(b.teamName).localeCompare(getValue(a.teamName))
                        : getValue(a.teamName).localeCompare(getValue(b.teamName))
                );
                break;
            case AccountResource.sortType.jobLevel:
                sorted.sort((a, b) =>
                    sortOrder === 'desc'
                        ? getValue(b.jobLevel).localeCompare(getValue(a.jobLevel))
                        : getValue(a.jobLevel).localeCompare(getValue(b.jobLevel))
                );
                break;
            case AccountResource.sortType.grade:
                sorted.sort((a, b) =>
                    sortOrder === 'desc'
                        ? getValue(b.grade).localeCompare(getValue(a.grade))
                        : getValue(a.grade).localeCompare(getValue(b.grade))
                );
                break;
        }
    
        return sorted;
    };

    const getDisplayView = () => {
        let ui = [];

        if (menu === AccountResource.menu.accountList) {
            ui.push(
                <AccountList
                    key="AccountManager_AccountList"
                    showConfirmDialog={showConfirmDialog}
                    onCloseConfirmDialog={onCloseConfirmDialog}
                    grades={grades}
                    accountUsers={accountUsers}
                    searchAccountUsers={searchAccountUsers}
                    setSearchText={setSearchText}
                    sortOrder={sortOrder}
                    onClickSortUsers={onClickSortUsers}
                    pageIndex={pageIndex}
                    pageRowCount={pageRowCount}
                    listCount={listCount}
                    totalCount={totalCount}
                    setPage={setPage}
                    setPageIndex={setPageIndex}
                />
            );
        }
        else if (menu === AccountResource.menu.accountAddUser) {
            ui.push(
                <AccountAddUser
                    key="AccountManager_AccountAddUser"
                    showConfirmDialog={showConfirmDialog}
                    onCloseConfirmDialog={onCloseConfirmDialog}
                    jobLevels={jobLevels}
                    regularDatas={regularDatas}
                    grades={grades}
                    accountUsers={accountUsers}
                    searchAccountUsers={searchAccountUsers}
                />
            );
        }
        
        return ui;
    }

    return (
        <ModalBackground className='UI_Section'>
        <AccountManagerComponent>
        <button onClick={() => props.handlePopup('accountManager', false)} className={'closeBtn'}>
            <img src={close_btn} alt='닫기 버튼' width={16} height={16} />
        </button>
        <div className='menuWrap'>
            <h2>계정 및 권한관리</h2>
            <ul>
                <li className={menu === AccountResource.menu.accountList ? 'on' : null} onClick={() => onClickMenu(AccountResource.menu.accountList)}>{AccountResource.ID.menu.accountList}</li>
                <li className={menu === AccountResource.menu.accountAddUser ? 'on' : null} onClick={() => onClickMenu(AccountResource.menu.accountAddUser)}>{AccountResource.ID.menu.accountAddUser}</li>
            </ul>
        </div>
        {getDisplayView()}
        </AccountManagerComponent>
        {
            /* alert창 대신 사용 */
            confirmMessage.visible &&
            <ConfirmDialog 
                type={confirmMessage.type}
                messages={confirmMessage.messages} 
                buttons={confirmMessage.buttons} 
                onClickButton={confirmMessage.onClickButton}
                onCloseConfirmDialog={onCloseConfirmDialog}
            />
        } 
        </ModalBackground>
    );
}

export default withRouter(AccountManager);