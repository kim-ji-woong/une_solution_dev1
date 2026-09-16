import React, { useState, useEffect } from 'react';
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
import useToast from '../../Common/hooks/useToast';
import ProjectResource from '../../Root/resource/id';

function AccountManager(props) {
    const { onShowToast } = useToast();

    const [loginUserInfo, setLoginUserInfo] = useState(null);

    const [menu, setMenu] = useState(AccountResource.menu.accountList);
    const [accountUsers, setAccountUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [grades, setGrades] = useState([]);
    const [jobLevels, setJobLevels] = useState([]);
    const [jobPositions, setJobPositions] = useState([]);
    const [regularDatas, setRegularDatas] = useState([]);
    const [sortOrder, setSortOrder] = useState({
        memberName: 'desc',
        userID: 'desc',
        grade: 'desc'
    });
    const [sortType, setSortType] = useState(null);
    const [sortMethod, setSortMethod] = useState(false);

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
    }, [searchText, pageIndex, sortType, sortMethod])

    const init = async () => {
        const userInfo = await ProjectResource.initUserInfo();
        if (userInfo) setLoginUserInfo(userInfo);

        const [grades] = await AccountController.requestGradeList();
        const [jobLevels] = await TeamEditController.getJobLevels();
        const [jobPositions] = await TeamEditController.getJobPositions();
        let [regularDatas] = await TeamEditController.displayRegular();

        if (grades && grades.length > 0) {
            setGrades(grades);
        }

        if (jobLevels && jobLevels.length > 0) {
            setJobLevels(jobLevels);
        }

        if (jobPositions && jobPositions.length > 0) {
            setJobPositions(jobPositions);
        }

        if (regularDatas && regularDatas.length > 0) {
            setRegularDatas(regularDatas);
        }
    }

    const searchAccountUsers = async () => {
        const [users, totalCount] = await AccountController.requestUserList(searchText, pageIndex, pageRowCount, true, true, true, true, true, true, true, true, null, sortType, sortMethod);

        if (users && users.length > 0) {
            const newTotalCount = Math.ceil(totalCount / pageRowCount);

            setAccountUsers(users);
            setTotalCount(newTotalCount);
			setListCount(totalCount);
        }
    }

    const handleToast = (message, status) => {
        onShowToast(message, status);
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

    const onClickMenu = (menu) => {
        setMenu(menu);

        if (menu === AccountResource.menu.accountList && pageIndex !== 1) {
            setPageIndex(1);
        }
    }

    const setPage = (page) => {
		setPageIndex(page);
    }

    const onClickSortUsers = (nextSortType) => {
        const sortOrders = { ...sortOrder };
        let nextSortOrder = null;

        if (nextSortType === AccountResource.sortType.memberName) {
            nextSortOrder = sortOrder.memberName === 'asc' ? 'desc' : 'asc';
            sortOrders.memberName = nextSortOrder;
        }
        else if (nextSortType === AccountResource.sortType.userID) {
            nextSortOrder = sortOrder.userID === 'asc' ? 'desc' : 'asc';
            sortOrders.userID = nextSortOrder;
        }
        else if (nextSortType === AccountResource.sortType.grade) {
            nextSortOrder = sortOrder.grade === 'asc' ? 'desc' : 'asc';
            sortOrders.grade = nextSortOrder;
        }

        setSortOrder(sortOrders);
        setSortType(nextSortType);
        setSortMethod(nextSortOrder === 'asc');
        setPageIndex(1);
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
                    searchText={searchText}
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
                    jobLevels={jobLevels}
                    jobPositions={jobPositions}
                    regularDatas={regularDatas}
                    grades={grades}
                    accountUsers={accountUsers}
                    searchAccountUsers={searchAccountUsers}
                    handleToast={handleToast}
                    loginUserInfo={loginUserInfo}
                />
            );
        }
        
        return ui;
    }

    return (
        <ModalBackground className='UI_Section'>
            <AccountManagerComponent>
                <div>
                    <div className='menuWrap'>
                        <div>
                            <h2>계정 관리</h2>
                            <IconButton
                                variant="unfill"
                                size="md"
                                icon={<Icon.Closer />}
                                onClick={() => props.handlePopup('accountManager', false)}
                            >
                                닫기
                            </IconButton>
                        </div>
                        <ul>
                            <li 
                                className={menu === AccountResource.menu.accountList ? 'on' : null} 
                                onClick={() => onClickMenu(AccountResource.menu.accountList)}
                            >
                                {AccountResource.ID.menu.accountList
                            }</li>
                            {/* 신규등록 탭은 총괄관리자, 관리자에게만 표출 */}
                            {(loginUserInfo?.grad_sn === AccountResource.accountLevelNo.master || 
                            loginUserInfo?.grad_sn === AccountResource.accountLevelNo.admin) &&
                                <li 
                                    className={menu === AccountResource.menu.accountAddUser ? 'on' : null} 
                                    onClick={() => onClickMenu(AccountResource.menu.accountAddUser)}
                                >
                                    {AccountResource.ID.menu.accountAddUser}
                                </li>
                            }
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
