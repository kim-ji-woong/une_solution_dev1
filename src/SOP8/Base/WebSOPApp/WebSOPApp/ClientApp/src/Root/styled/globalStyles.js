import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

import check_mark from '../../Common/images/check_mark.png';
import select_arrow from '../../Common/images/select_arrow.png';
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
        color: ${({ theme }) => theme.colors.text.primary};
    }

    body {
        line-height: 1;
        background-color: rgba(1,1,1,0);
        color: ${({ theme }) => theme.colors.text.primary};
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
        color: ${({ theme }) => theme.colors.text.primary};
        border-radius: 2px;
        border: 0;
        cursor: pointer;
        background: ${({ theme }) => theme.colors.background.base} url(${select_arrow}) 95% 49% no-repeat;
        font-size: 0.75rem !important;
        padding: 0 27px 0 10px;

        &.short {
            width: 66px;
            background: ${({ theme }) => theme.colors.background.base} url(${select_arrow}) 90% 49% no-repeat;
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
            background-color: ${({ theme }) => theme.colors.primary};
        }

        &::-webkit-scrollbar-track {
            background-color: rgba(0,0,0,0);
        }
    }

    option {
        font-size: 0.75rem !important;
        color: ${({ theme }) => theme.colors.text.primary};
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
        width: 16px;
        height: 16px;
        border: 1.5px solid ${({ theme }) => theme.colors.border.light};
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
        font-size: 0.875rem; 
        font-weight: 400; 
    }

    input[type=radio] {
        display: inline-block;
        vertical-align: middle;
        width: 16px;
        height: 16px;
        border: solid 1.5px ${({ theme }) => theme.colors.border.light};
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
        border: solid 1.5px ${({ theme }) => theme.colors.primary} !important;
    }

    input[type=radio]:checked:after {
        content: "";
        display: block;
        background: ${({ theme }) => theme.colors.primary};
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
    }

    input[type=text], input[type=password] {
        width: 100%;
        border: 1px solid #384355;
        border-radius: 2px;
        background: none;
        height: 30px;
        padding: 8px 10px;
        font-size: 0.875rem;
        color: ${({ theme }) => theme.colors.text.primary};
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
        color: ${({ theme }) => theme.colors.text.primary};
        text-align: center; 
        z-index: 100;
    }
    
    #sdms-tooltip-area {
        position: absolute;
        padding: 5px;
        background: transparent linear-gradient(180deg, #222A31 0%, #000000 100%) 0% 0% no-repeat padding-box;
        color: ${({ theme }) => theme.colors.text.primary};
        font-size: 0.625rem; 
        border-radius: 2px;
        z-index: 9999;
        white-space: nowrap;
    }
`;

export default GlobalStyles;
