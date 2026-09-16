import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

import check_mark from '../../Common/images/check_mark.png';
import select_arrow from '../../Common/images/select_arrow.svg';
import select_arrow_on from '../../Common/images/select_arrow_on.svg';
import select_arrow_disabled from '../../Common/images/select_arrow_disabled.png';
import searchIcon from '../../Account/images/searchIcon.svg';

const GlobalStyles = createGlobalStyle`
    ${reset}

    a{
        text-decoration: none !important;
        color: inherit;
    }

    *{
        box-sizing: border-box;
    }

    html {
        font-size: 62.5%;   // 10px
    }

    html, body, div, span, h1, h2, h3, h4, h5, h6, p, 
    a, dl, dt, dd, ol, ul, li, form, label, table, button {
        margin: 0;
        padding: 0;
        border: 0;
        vertical-align: baseline;
        font-family: 'Spoqa Han Sans Neo', 'Noto Sans KR', sans-serif !important;
        color: ${(props) => props.theme.fontPrimary};
    }

    body{
        line-height: 1;
        background-color: rgba(1,1,1,0);
        color: ${(props) => props.theme.fontPrimary};
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        font-size: 1.6rem;
    }

    ol, ul, li {
        list-style: none;
    }

    button {
        border: 0;
        background: transparent;
        cursor: pointer;
    }

    button:focus {
        outline: none;
        border: none;
        box-shadow: 0 0 0 0;
    }

    *:focus {
        outline: 0;
    }

    input {
        border:0 solid black;
    }

    .searchWrap {
        height: 30px;
        position: relative;
        padding-right: 30px;
        margin: 10px 15px 10px 0;

        input {
            height: 30px !important;
            background: none;
            color: #fff;
            font-size: 12px;
            border-radius: 2px 0 0 2px !important;
            border: 1px solid ${(props) => props.theme.secondary};
            border-right: 0;
            padding: 8px 40px 8px 10px !important;

            &.on {
                border: 1px solid ${(props) => props.theme.primary};
            }
        }

        input::placeholder {
            color: ${(props) => props.theme.secondary};
        }

        input::-webkit-input-placeholder{
            color: ${(props) => props.theme.secondary};
        }

        input:-ms-input-placeholder{
            color: ${(props) => props.theme.secondary};
        }

        .searchBtn {
            display: block;
            width: 30px;
            height: 30px;
            position: absolute;
            right: 0;
            top: 0;
            text-indent: -9999px;
            background: ${(props) => props.theme.secondary} url(${searchIcon}) no-repeat center center;
            border-radius: 0 2px 2px 0;
            border: 1px solid ${(props) => props.theme.secondary};

            &.on {
                background: ${(props) => props.theme.primary} url(${searchIcon}) no-repeat center center;
                border: 1px solid ${(props) => props.theme.primary};
            }
        }

        .clearBtn {
            position: absolute;
            right: 44px;
            top: 50%;
            transform: translate(0, -60%);
        }
    }

    label,img,input,select,textarea,button,a {
        vertical-align: middle;
    }

    table {
        width: 100%;
        border-spacing: 0;
        border-collapse: collapse;
    }

    select {
        appearance: none;
        width: 120px;
        height: 26px;
        line-height: 24px;
        color: ${(props) => props.theme.fontPrimary};
        border-radius: 2px;
        border: 0;
        cursor: pointer;
        background: ${(props) => props.theme.background} url(${select_arrow}) 95% 49% no-repeat;
        font-size: 12px !important;
        padding: 0 27px 0 10px;

        &.short {
            width: 66px;
            background: ${(props) => props.theme.background} url(${select_arrow}) 90% 49% no-repeat;
            padding: 0 26px 0 10px;

            &:focus {
                background: #384355 url(${select_arrow_on}) 90% 49% no-repeat;
            }
        }

        &:disabled {
            cursor: default;
            background: #384355 url(${select_arrow_disabled}) 95% 49% no-repeat;
        }

        &:focus {
            background: #384355 url(${select_arrow_on}) 95% 49% no-repeat;
        }

        &::-webkit-scrollbar {
            width: 5px;
            background: ${(props) => props.theme.background};
        }
        
        &::-webkit-scrollbar-thumb {
            background-color: ${(props) => props.theme.primary};
        }

        &::-webkit-scrollbar-track {
            background-color: rgba(0,0,0,0);
        }
    }

    option {
        font-size: 12px !important;
        color: ${(props) => props.theme.fontPrimary};
        background: ${(props) => props.theme.background};
    }

    select option[value=""][disabled] {
        display: none;
    }

    select::-ms-expand { 
        display:none;
    }

    input[type="search"]::-webkit-search-decoration,
    input[type="search"]::-webkit-search-cancel-button,
    input[type="search"]::-webkit-search-results-button,
    input[type="search"]::-webkit-search-results-decoration,
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button { 
        -webkit-appearance: none;
    }

    input[type="number"]{ 
        -moz-appearance:textfield;
    }

    input[type="number"],
    input[type="text"],
    input[type="password"],
    input[type="url"],
    input[type="email"],
    input[type="tel"],
    input[type="date"], 
    textarea { 
        -webkit-appearance:none; 
        -moz-appearance:none; 
        appearance:none; 
        -webkit-border-radius:0; 
        outline:0;
    }

    textarea { 
        resize: none;
        ${(props) => props.theme.scroll("transparent")};
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
        -webkit-text-fill-color: ${(props) => props.theme.backgroundColor};
        -webkit-box-shadow: 0 0 0px 1000px transparent inset;
        box-shadow: 0 0 0px 1000px transparent inset;
        transition: background-color 5000s ease-in-out 0s;
    }

    input:autofill,
    input:autofill:hover,
    input:autofill:focus,
    input:autofill:active {
        -webkit-text-fill-color: ${(props) => props.theme.lightGray};
        -webkit-box-shadow: 0 0 0px 1000px transparent inset;
        box-shadow: 0 0 0px 1000px transparent inset;
        transition: background-color 5000s ease-in-out 0s;
    }

    input:-webkit-autofill::first-line {
        font-size: 14px;
    }

    input[type=checkbox] {
        width: 16px;
        height: 16px;
        border: 1.5px solid #fff;
        border-radius: 3px;
        cursor: pointer;
        -webkit-appearance:none; 
        -moz-appearance:none; 
        appearance:none; 
        position: relative; 
    }

    input[type=checkbox]:checked {
        background: url(${check_mark}) no-repeat center center; 
        background-size: 16px auto !important;
        border: 0;
    }

    input[type=checkbox] + label {
        display: inline; 
        vertical-align: middle; 
        margin-left: 5px; 
        font-size: 14px; 
        font-weight: 400; 
    }

    input[type=radio] {
        display: inline-block;
        vertical-align: middle;
        width: 16px;
        height: 16px;
        border: solid 1.5px #fff;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        position: relative;
        cursor: pointer;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
    }

    input[type=radio]:checked {
        border: solid 1.5px ${(props) => props.theme.primary} !important;
    }

    input[type=radio]:checked:after {
        content: "";
        display: block;
        background: ${(props) => props.theme.primary};
        position: absolute;
        left: 4px;
        right: 4px;
        top: 4px;
        bottom: 4px;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
    }

    input[type=radio]:disabled {
        border: solid 1.5px #565B69 !important;
        background: transparent;
    }

    label {
        cursor: pointer;
        font-size: 14px;
    }

    input[type=text], input[type=password] {
        width: 100%;
        border: 1px solid ${(props) => props.theme.secondary};
        border-radius: 2px;
        background: none;
        height: 30px;
        padding: 8px 10px;
        font-size: 14px;
        color: ${(props) => props.theme.fontPrimary};
    }

    input:disabled {
        background: gray;
        cursor: default;
    }

    caption, legend {
        line-height: 0;
        font-size: 1px;
        overflow: hidden;
    }

    a {
        cursor: pointer;
    }

    .dsiSel label:hover::after {
        content:attr(data-title); 
        position: absolute; 
        white-space: nowrap;
        height: 20px;
        line-height: 10px;
        top: 30px;
        left: 50%; 
        transform: translate(-50%, 0);
        padding: 5px; 
        background: transparent linear-gradient(180deg, #222A31 0%, #000000 100%) 0% 0% no-repeat padding-box;
        border-radius: 2px;
        font-size: 10px; 
        color: ${(props) => props.theme.fontPrimary};
        text-align: center; 
        z-index: 100;
    }
    
    #sdms-tooltip-area {
        position: absolute;
        padding: 5px;
        background: transparent linear-gradient(180deg, #222A31 0%, #000000 100%) 0% 0% no-repeat padding-box;
        color: ${(props) => props.theme.fontPrimary};
        font-size: 10px; 
        border-radius: 2px;
        z-index: 9999;
        white-space: nowrap;
    }
`;

export default GlobalStyles;
