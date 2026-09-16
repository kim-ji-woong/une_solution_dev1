import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

import check_mark from '../../Common/images/check_mark.svg';
import select_arrow from '../../Common/images/select_arrow.svg';
import select_arrow_disabled from '../../Common/images/select_arrow_disabled.png';

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
        font-size: 100%;
    }

    html, body, div, span, h1, h2, h3, h4, h5, h6, p, 
    a, dl, dt, dd, ol, ul, li, form, label, table, button {
        margin: 0;
        padding: 0;
        border: 0;
        vertical-align: baseline;
        font-family: 'Spoqa Han Sans Neo', 'Noto Sans KR', sans-serif !important;
        color: ${({ theme }) => theme.colors.white};
    }

    body { 
        line-height: 1;
        background-color: rgba(1,1,1,0);
        color: ${({ theme }) => theme.colors.white};
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        font-size: 1rem;
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

    label,img,input,select,textarea,button,a {
        vertical-align: middle;
    }

    textarea {
        ${({ theme }) => theme.mixins.scroll()};
    }

    table {
        width: 100%;
        border-spacing: 0;
        border-collapse: collapse;
    }

    select {
        appearance: none;
        width: 120px;
        height: 32px;
        color: ${({ theme }) => theme.colors.white};
        border-radius: 4px;
        border: 0;
        cursor: pointer;
        background: #0D121A url(${select_arrow}) 95% 49% no-repeat;
        font-size: 0.875rem !important;
        padding: 0 27px 0 10px;

        &.short {
            width: 80px;
            background: #0D121A url(${select_arrow}) 86% 49% no-repeat;
            padding: 0 26px 0 10px;
        }

        &:disabled {
            cursor: default;
            background: #384355 url(${select_arrow_disabled}) 95% 49% no-repeat;
        }

        &::-webkit-scrollbar {
            width: 6px;
            background: ${({ theme }) => theme.colors.background.base};
        }
        
        &::-webkit-scrollbar-thumb {
            background-color: ${({ theme }) => theme.colors.primary.p500};
        }

        &::-webkit-scrollbar-track {
            background-color: rgba(0,0,0,0);
        }
    }

    option {
        font-size: 0.75rem !important;
        color: ${({ theme }) => theme.colors.white};
        background: ${({ theme }) => theme.colors.background.base};
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
        ${({ theme }) => theme.mixins.scroll("transparent")}
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
        -webkit-text-fill-color: ${({ theme }) => theme.colors.background.base};
        -webkit-box-shadow: 0 0 0px 1000px transparent inset;
        box-shadow: 0 0 0px 1000px transparent inset;
        transition: background-color 5000s ease-in-out 0s;
    }

    input:autofill,
    input:autofill:hover,
    input:autofill:focus,
    input:autofill:active {
        -webkit-text-fill-color: ${({ theme }) => theme.colors.background.secondary};
        -webkit-box-shadow: 0 0 0px 1000px transparent inset;
        box-shadow: 0 0 0px 1000px transparent inset;
        transition: background-color 5000s ease-in-out 0s;
    }

    input:-webkit-autofill::first-line {
        font-size: 0.875rem;
    }

    input[type=checkbox] {
        width: 20px;
        height: 20px;
        border: 1px solid #CECFD2;
        border-radius: 4px;
        cursor: pointer;
        -webkit-appearance:none; 
        -moz-appearance:none; 
        appearance:none; 
        position: relative; 
        background: ${({ theme }) => theme.colors.white};
    }

    input[type=checkbox]:hover {
        border: 1px solid ${({ theme }) => theme.colors.primary.p500};
        background: #F6F8FF;;
    }

    input[type=checkbox]:checked {
        border: 1px solid ${({ theme }) => theme.colors.primary.p500};
        background: ${({ theme }) => theme.colors.primary.p50} url(${check_mark}) no-repeat center center; 
    }

    input[type=checkbox] + label, input[type=radio] + label {
        display: inline; 
        vertical-align: middle; 
        margin-left: 12px; 
        font-size: 0.875rem; 
        font-weight: 400; 
    }

    input[type=checkbox]:disabled {
        border: 1px solid ${({ theme }) => theme.colors.grayscale.g100};
        background: ${({ theme }) => theme.colors.grayscale.g50};
    }

    input[type=radio] {
        display: inline-block;
        vertical-align: middle;
        width: 20px;
        height: 20px;
        background: ${({ theme }) => theme.colors.white};
        border: solid 1px ${({ theme }) => theme.colors.grayscale.g100};
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        position: relative;
        cursor: pointer;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
    }

    input[type=radio]:hover {
        border: solid 1px ${({ theme }) => theme.colors.primary.p500};
    }

    input[type=radio]:checked {
        border: solid 4px ${({ theme }) => theme.colors.primary.p500} !important;
    }

    input[type=radio]:disabled {
        border: solid 1px ${({ theme }) => theme.colors.grayscale.g100} !important;
        background: ${({ theme }) => theme.colors.grayscale.g50};
    }

    label {
        cursor: pointer;
    }

    input[type=text], input[type=password] {
        width: 100%;
        border: 1px solid #384355;
        border-radius: 2px;
        background: none;
        height: 30px;
        padding: 8px 10px;
        font-size: 0.875rem;
        color: ${({ theme }) => theme.colors.white};
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
        font-size: 0.625rem; 
        color: ${({ theme }) => theme.colors.white};
        text-align: center; 
        z-index: 100;
    }
    
    #sdms-tooltip-area {
        position: absolute;
        padding: 5px;
        background: transparent linear-gradient(180deg, #222A31 0%, #000000 100%) 0% 0% no-repeat padding-box;
        color: ${({ theme }) => theme.colors.white};
        font-size: 0.625rem; 
        border-radius: 2px;
        z-index: 9999;
        white-space: nowrap;
    }
`;

export default GlobalStyles;
