import React, {useEffect, useState} from 'react';
import styled, { keyframes } from "styled-components";
import ProjectResource from '../../Root/resource/id';

import close_btn from '../images/close_btn_bk.png';
import dialog_error from '../images/dialog_error.svg';
import dialog_warning from '../images/dialog_warning.svg';
import dialog_success from '../images/dialog_success.svg';
import dialog_info from '../images/dialog_info.svg';
import dialog_question from '../images/dialog_question.svg';
import socketStore from "../../SDMS/webSocket/socketStore";

export default function ConfirmDialog({ type, messages, buttons, onClickButton, onCloseConfirmDialog, check, checkMessage }) {

    /*
    * 1. type
    * -> ERROR, WARNING, SUCCESS, INFO, QUESTION
    *
    * 2. 버튼 규칙
    * -> 확인 버튼은 항상 우측에 위치함.
    * -> 전달된 함수가 있다면 index에 따라 구분할 것.
    */

    let dialogColor = '#757575';
    if (type === ProjectResource.dialogTypes.ERROR) {
        dialogColor = '#D32F2F';
    } else if (type === ProjectResource.dialogTypes.WARNING) {
        dialogColor = '#F9A825';
    } else if (type === ProjectResource.dialogTypes.SUCCESS) {
        dialogColor = '#4CAF50';
    } else if (type === ProjectResource.dialogTypes.INFO || 
                type === ProjectResource.dialogTypes.QUESTION) {
        dialogColor = '#0091EA';
    }

    const [isCheck, setIsCheck] = useState(check);
    
    useEffect(() => {
        return () => {
            const wsMgr = socketStore.getState().wsMgr;
            if (wsMgr && wsMgr.connected) {
                wsMgr.sendClosePopup();
            }
        }
    }, []);

    const getMessage = () => {
        const confirmMessages = [];

        messages.map((message, index) => 
            confirmMessages.push(<p key={"message_" + index}>{message}</p>
        ));

        return (
            <main>
                <div>{confirmMessages}</div>
            </main>
        );
    }

    const getButtons = () => {
        const confirmButtons = [];

        if (!buttons || buttons.length === 0) {
            confirmButtons.push(
                <button key={"button_0"} className={'confirmClose'} onClick={onCloseConfirmDialog}>확인</button>
            );
        }
        else {
            buttons.map((button, index) => {
                if (onClickButton) {
                    confirmButtons.push(
                        <button key={"button_" + index} className={'confirmClose'} onClick={() => onClickButton(index)}>{button}</button>
                    );
                }
                else {
                    confirmButtons.push(
                        <button key={"button_" + index} className={'confirmClose'} onClick={onCloseConfirmDialog}>{button}</button>
                    );
                }
            });
        }

        return (
            <footer>
                {confirmButtons}
            </footer>
        );
    }
    
    return (
        <ModalBackground>
        <ConfirmDialogComponent className='UI_Section' $dialogType={type} $dialogColor={dialogColor}>
            <section className='body'>
                {
                    getMessage()
                }
                {
                    getButtons()
                }
                <button className='closeBtn' onClick={onCloseConfirmDialog}>
                    <img src={close_btn} alt='닫기버튼' />
                </button>
            </section>
        </ConfirmDialogComponent>
        </ModalBackground>
    );
}


// 알림창 animation
const dialogShow = keyframes`
    from {
        opacity: 0;
        margin-top: -50px;
        display: none;
    }

    to {
        opacity: 1;
        margin-top: 0;
        display: block;
    }
`

export const ConfirmDialogComponent = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    border-left: 12px solid ${(props) => props.$dialogColor};
    animation: ${dialogShow} 0.5s;

    ${(props) => props.theme.userSelect()};

    .body {
        width: 480px;
        height: 170px;
        background: #FFF;
        box-shadow: 0px 12px 21px 0px rgba(0, 0, 0, 0.12);
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        font-size: 1.8rem;

        main {
            width: 100%;
            height: 113px;
            padding-left: 30px;
            font-weight: 700;
            position: relative;

            background: ${(props) => {
                if(props.$dialogType === ProjectResource.dialogTypes.ERROR)
                    return `url(${dialog_error})`
                else if(props.$dialogType === ProjectResource.dialogTypes.WARNING)
                    return `url(${dialog_warning})`
                else if(props.$dialogType === ProjectResource.dialogTypes.SUCCESS)
                    return `url(${dialog_success})`
                else if(props.$dialogType === ProjectResource.dialogTypes.INFO)
                    return `url(${dialog_info})`
                else if(props.$dialogType === ProjectResource.dialogTypes.QUESTION)
                    return `url(${dialog_question})`
            }} no-repeat center right;
            background-size: 113px;
            background-position-y: 0;
            overflow: hidden;

            div {
                position: absolute;
                bottom: 20%;
                padding-right: 30px;

                p {
                    color: #000;
                    font-size: 1.8rem;
                    font-weight: 700;
                }

                p:not(:first-child) {
                    font-size: 1.4rem;
                    font-weight: 400;
                    color: #757575;
                    margin-top: 8px;
                }
            }
        }

        footer {
            width: 100%;
            height: 57px;
            border-top: 1px solid #E0E0E0;
            padding: 12px;
            text-align: right;

            > div {
                display: flex;
                padding-left: 18px;

                input[type=checkbox] {
                    border: 1px solid #757575;
                }

                input[type=checkbox]:checked {
                    border: 0;
                }

                label {
                    color: #757575;
                }
            }

            button {
                height: 33px;
                color: #FFF;
                font-size: 1.4rem;
                font-weight: 700;
                background-color: #757575;
                border-radius: 4px;
                margin-left: 8px;
                padding: 0 16px;
            }

            button:last-child {
                background-color: ${(props) => props.$dialogColor};
            }
        }

        .closeBtn {
            position: absolute;
            top: 16px;
            right: 16px;

            img {
                width: 16px;
                height: 16px;
            }
        }
    }
`;

export const ModalBackground = styled.div`
    position: fixed;
    top:0; 
    left: 0; 
    bottom: 0; 
    right: 0;
    background: transparent;
    opacity: 1;
    z-index: 9999;
`