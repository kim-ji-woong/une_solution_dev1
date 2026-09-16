import React, { useState, useEffect, use } from 'react';
import { withRouter } from 'react-router-dom';

import { AccountManagerComponent } from '../styled/accountManagerStyled';
import { ModalBackground } from '../../Root/styled/theme';
import AccountResource from '../resource/id';
import ConfirmDialog from '../../Common/ui/confirmDialog';

import AccountList from './accountList';
import AccountAddUser from './accountAddUser';
import { AccountController } from '../services/accountController';
import { TeamEditController } from '../../TeamEditor/services/teamEditController';
import IconButton from '../../Common/components/iconButton';
import Icon from '../../Common/components/Icon/Icon';
import { useToast } from '../../Common/components/Toast/ToastProvider';
import ProjectResource from '../../Root/resource/id';

function AccountManager(props) {
    const { onShowToast } = useToast();

    const [loginUserInfo, setLoginUserInfo] = useState(null);

    const [menu, setMenu] = useState(AccountResource.menu.accountList);
    const [accountUsers, setAccountUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [grades, setGrades] = useState([]);
    const [jobPositions, setJobPositions] = useState([]);
    const [regularDatas, setRegularDatas] = useState([]);
    const [sortOrder, setSortOrder] = useState({
        teamName: 'desc',
        jobPosition: 'desc',
        grade: 'desc'
    });

    const [pageIndex, setPageIndex] = useState(1);
    const [pageRowCount, setPageRowCount] = useState(13);
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

        const userInfo = ProjectResource.getUserInfo();
        if (userInfo) setLoginUserInfo(userInfo);
    }, [])

    useEffect(() => {
        searchAccountUsers();
    }, [searchText, pageIndex])

    const init = async () => {
        const [grades] = await AccountController.requestGradeList();
        const [jobPositions] = await TeamEditController.getJobPositions(); // 직위
        let [regularDatas] = await TeamEditController.displayRegular();

        if (grades && grades.length > 0) {
            setGrades(grades);
        }

        if (jobPositions && jobPositions.length > 0) {
            setJobPositions(jobPositions);
        }

        if (regularDatas && regularDatas.length > 0) {
            setRegularDatas(regularDatas);
        }
    }

    const searchAccountUsers = async () => {
        const [users, totalCount] =
            await AccountController.requestUserList(searchText, pageIndex, pageRowCount);

        if (users && users.length > 0) {
            const newTotalCount = Math.ceil(totalCount / pageRowCount);

            // userNo(user_sn) 기준 내림차순 정렬
            const sortedUsers = [...users].sort((a, b) => b.userNo - a.userNo);

            setAccountUsers(sortedUsers);
            setTotalCount(newTotalCount);
            setListCount(totalCount);
        }
    };

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

    const handleToast = (message) => {
        onShowToast(message);
    };

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
        else if (sortType === AccountResource.sortType.jobPosition) {
            newSortOrder = sortOrder.jobPosition === 'asc' ? 'desc' : 'asc';
            sortOrders.jobPosition = newSortOrder;
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
    
        switch (sortType) {
            case AccountResource.sortType.teamName:
                sorted.sort((a, b) => 
                    sortOrder === 'desc' 
                        ? b.teamName.localeCompare(a.teamName) 
                        : a.teamName.localeCompare(b.teamName)
                );
                break;
            case AccountResource.sortType.jobPosition:
                sorted.sort((a, b) => 
                    sortOrder === 'desc' 
                        ? b.jobPosition.localeCompare(a.jobPosition) 
                        : a.jobPosition.localeCompare(b.jobPosition)
                );
                break;
            case AccountResource.sortType.grade:
                sorted.sort((a, b) => 
                    sortOrder === 'desc' 
                        ? b.grade.localeCompare(a.grade) 
                        : a.grade.localeCompare(b.grade)
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
                    handleToast={handleToast}
                    loginUserInfo={loginUserInfo}
                />
            );
        }
        else if (menu === AccountResource.menu.accountAddUser) {
            ui.push(
                <AccountAddUser
                    key="AccountManager_AccountAddUser"
                    showConfirmDialog={showConfirmDialog}
                    onCloseConfirmDialog={onCloseConfirmDialog}
                    jobPositions={jobPositions}
                    regularDatas={regularDatas}
                    handlePopup={props.handlePopup}
                    grades={grades}
                    accountUsers={accountUsers}
                    searchAccountUsers={searchAccountUsers}
                    handleToast={handleToast}
                    setMenu={setMenu}
                    loginUserInfo={loginUserInfo}
                />
            );
        }
        
        return ui;
    }

    return (
        <ModalBackground>
        <AccountManagerComponent>
            <div className='container'>
                <IconButton
                    className='closeBtn'
                    variant="unfill"
                    size="xxs"
                    icon={<Icon.Closer size={"xs"} />}
                    onClick={() => props.handlePopup('accountManager', false)}
                >
                    닫기
                </IconButton>
                <div className='menuWrap'>
                    <h2>계정 및 권한관리</h2>
                    <ul>
                        <li className={menu === AccountResource.menu.accountList ? 'on' : null} onClick={() => onClickMenu(AccountResource.menu.accountList)}>{AccountResource.ID.menu.accountList}</li>
                        <li className={menu === AccountResource.menu.accountAddUser ? 'on' : null} onClick={() => onClickMenu(AccountResource.menu.accountAddUser)}>{AccountResource.ID.menu.accountAddUser}</li>
                    </ul>
                </div>
                {getDisplayView()}
            </div>
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