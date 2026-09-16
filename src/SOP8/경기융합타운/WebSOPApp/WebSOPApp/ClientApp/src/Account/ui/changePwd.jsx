import React, { useRef, useState } from 'react';
import { ChangePwdComponent  } from '../styled/myPageStyled';
import { ModalBackground } from '../../Root/styled/theme';
import close_btn from '../../Common/images/close_btn.png';

import pwd_hide from '../images/pwd_hide.png';
import pwd_show from '../images/pwd_show.png';
import ProjectResource from '../../Root/resource/id';
import { AccountController } from '../services/accountController';

function ChangePwd(props) {
    const [showMessage, setShowMessage] = useState('');

    const refPwd = useRef();
    const refPassword = useRef();
    const refRePassword = useRef();

    const onClick = () => {
        // 비밀번호 설정
        let error = "";

        const pwd = refPwd.current.value.toString().trim();
        const newPwd = refPassword.current.value.toString().trim();
        const newRePwd = refRePassword.current.value.toString().trim();

        if (pwd.length === 0) {
            error = '비밀번호를 입력하세요';
        } else if (newPwd.length === 0) {
            error = '새로운 비밀번호를 입력하세요';
        } else if (newRePwd.length === 0) {
            error = '새로운 비밀번호를 한번 더 입력하세요';
        } else if (newPwd.length > 0 && newRePwd.length > 0 && newPwd !== newRePwd) {
            error = '새로운 비밀번호가 서로 일치하지 않습니다';
        } else if (pwd === newPwd) {
            error = '같은 비밀번호로 변경하실 수 없습니다';
        }

        if (error.length > 0) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [error], null, null);
            return;
        }

        const num = newPwd.search(/[0-9]/g);
        const eng = newPwd.search(/[a-z]/ig);
        const spe = newPwd.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
        const hangulcheck = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

        if (newPwd.length < 8 || newPwd.search(/\s/) != -1 || num < 0 || spe < 0 || (eng < 0 && hangulcheck.test(newPwd) === false)) {
            error = '문자, 숫자, 특수문자를 혼합하여 8자리 이상 공백없이 설정해주세요';
        } 

        if (error.length > 0) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [error], null, null);
            return;
        }

        setPassword(pwd, newPwd);
    }

    const setPassword = async (pwd, newPwd) => {
        setShowMessage('처리 중입니다')

        // id 값 불러오기
        let user = ProjectResource.getUserInfo();
        if (user === null || user === undefined) {
            let message = '유저 정보를 불러 올 수 없습니다. 관리자에게 문의바람';
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            setShowMessage(message);
        }

        const [result, message] = await AccountController.setPassword(user.id, user.userID, pwd, newPwd);

        if (result === null) {
            setShowMessage(message);
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        } else if (result.success === true) {
            setShowMessage('비밀번호 변경 성공');
            props.showConfirmDialog(ProjectResource.dialogTypes.SUCCESS, ['비밀번호 변경 성공'], null, onClickCancle);
        } else if (result.success === false) {
            props.showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
        }
    }

    const onClickCancle = () => {
        props.handlePopup('changePwd', false);
    }

    return (
        <ModalBackground>
        <ChangePwdComponent>
            <div className={'passwordConts'}>
                <div className={'passwordBoxTitle'}>{'비밀번호 변경'}</div>

                <div className={'passwordBox'}>
                    <div className={'passwordBoxTxt'}>{showMessage}</div>
                    <table className={'tblNone'}>
                        <caption>{'게시판 입니다'}</caption>
                        <colgroup>
                            <col style={{ width: "30%" }} />
                            <col style={{ width: "*" }} />
                        </colgroup>
                        <tbody id="userInfo" >
                            <tr>
                                <td>{'비밀번호'}</td>
                                <td><input type="password" ref={refPwd} className={'DblueInput'} placeholder={'기존 비밀번호를 입력하세요'} /></td>
                            </tr>
                            <tr id="rowPassword">
                                <td>{'새 비밀번호'}</td>
                                <td><input type="password" ref={refPassword} className={'DblueInput'} placeholder={'새 비밀번호를 입력하세요'} /></td>
                            </tr>
                            <tr id="rowRepassword">
                                <td>{'새 비밀번호 확인'}</td>
                                <td><input type="password" ref={refRePassword} className={'DblueInput'} placeholder={'새 비밀번호를 입력하세요'} /></td>
                            </tr>
                        </tbody>
                    </table>

                    <div className={'gap20'}></div>

                    <div className={'btnArea'}>
                        <a onClick={onClick} className={'btnBlue'}>{'확인'}</a>
                        <a onClick={onClickCancle} className={'btnNavy'}>{'취소'}</a>
                    </div>
                </div>
            </div>
        </ChangePwdComponent>
        </ModalBackground>
    );
}

export default ChangePwd;