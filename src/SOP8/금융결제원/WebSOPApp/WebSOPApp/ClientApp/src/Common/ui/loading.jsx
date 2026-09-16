import React from "react";
import ReactDOM from "react-dom";
import styled, { css } from "styled-components";
import loadingGif from "../images/loading.gif";

const CommonLoading = ({
    isOpen,
    message = "Loading...",
    subMessage = "정보를 불러오고 있어요. 잠시만 기다려 주세요.",
    containerId = "root",
}) => {
    if (typeof document === "undefined") return null;

    const container = document.getElementById(containerId);
    if (!container) return null;

    return ReactDOM.createPortal(
        <LoadingWrapper $isOpen={isOpen}>
            <div>
                <img src={loadingGif} alt="loading" />
                <p>{message}</p>
                <p>{subMessage}</p>
            </div>
        </LoadingWrapper>,
        container
    );
};

export default CommonLoading;

export const LoadingWrapper = styled.div`
    ${({ $isOpen }) => css`
        width: 100vw;
        height: 100vh;
        position: fixed;
        z-index: 9999;
        top: 0;
        left: 0;
        display: ${$isOpen ? "flex" : "none"};
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.8);
        /* backdrop-filter: blur(4px); */

        > div {
            text-align: center;
            color: #222;
            font-size: 1.4rem;

            img {
                width: 160px;
                height: 160px;
                margin-bottom: 20px;
            }

            p:nth-child(2) {
                font-size: 1.25rem;
                font-weight: 500;
                line-height: 172%; /* 34.4px */
                letter-spacing: -0.6px;
                color: ${({ theme }) => theme.colors.grayscale.g100};
            }

            p:nth-child(3) {
                font-size: 0.875rem;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
                color: ${({ theme }) => theme.colors.primary.p500};
            }
        }

    `}
`;