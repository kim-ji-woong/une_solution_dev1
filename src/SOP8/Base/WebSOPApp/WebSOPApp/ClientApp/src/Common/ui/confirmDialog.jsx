import React, { useState } from 'react';
import styled, { keyframes } from "styled-components";
import ProjectResource from '../../Root/resource/id';

import close_btn from '../images/close_btn_bk.png';
import dialog_error from '../images/dialog_error.svg';
import dialog_warning from '../images/dialog_warning.svg';
import dialog_success from '../images/dialog_success.svg';
import dialog_info from '../images/dialog_info.svg';
import dialog_question from '../images/dialog_question.svg';

export default function ConfirmDialog({ type, messages, buttons, onClickButton, onCloseConfirmDialog }) {

    /*
    * 1. type
    * -> ERROR, WARNING, SUCCESS, INFO, QUESTION
    *
    * 2. 버튼 규칙
    * -> 확인 버튼은 항상 우측에 위치함.
    * -> 전달된 함수가 있다면 index에 따라 구분할 것.
    */

    const dialogColors = {
        ERROR: '#D32F2F',
        WARNING: '#F9A825',
        SUCCESS: '#4CAF50',
        INFO: '#0091EA',
        QUESTION: '#0091EA',
    };

    const dialogColor = dialogColors[type] || '#757575';

    const getMessage = () => (
        <main>
            <div>
                {messages.map((message, index) => (
                    <p key={"message_" + index}>{message}</p>
                ))}
            </div>
        </main>
    );

    const getButtons = () => {
        if (!buttons || buttons.length === 0) {
            return (
                <footer>
                    <button className="confirmClose" onClick={onCloseConfirmDialog}>확인</button>
                </footer>
            );
        }

        return (
            <footer>
                {buttons.map((button, index) => (
                    <button
                        key={`button_${index}`}
                        className="confirmClose"
                        onClick={() => onClickButton?.(index) ?? onCloseConfirmDialog()}
                    >
                        {button}
                    </button>
                ))}
            </footer>
        );
    };
    
    return (
        <ConfirmDialogComponent $dialogType={type} $dialogColor={dialogColor}>
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

    user-select: none;

    .body {
        width: 480px;
        height: 170px;
        background: #FFF;
        box-shadow: 0px 12px 21px 0px rgba(0, 0, 0, 0.12);
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        font-size: 1.125rem;

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
                    font-size: 1.125rem;
                    font-weight: 700;
                }

                p:not(:first-child) {
                    font-size: 0.875rem;
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
                    border: 1px solid ${({ theme }) => theme.colors.border.strong};
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
                font-size: 0.875rem;
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