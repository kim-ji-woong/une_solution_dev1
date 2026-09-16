import styled, { keyframes } from "styled-components";
import ProjectResource from "../../Root/resource/id";

import dialog_error from '../images/dialog_error.svg';
import dialog_warning from '../images/dialog_warning.svg';
import dialog_success from '../images/dialog_success.svg';
import dialog_info from '../images/dialog_info.svg';
import dialog_question from '../images/dialog_question.svg';

/**********************************************************************/

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

/**********************************************************************/
// 알림창

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

            div {
                position: absolute;
                bottom: 20%;

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