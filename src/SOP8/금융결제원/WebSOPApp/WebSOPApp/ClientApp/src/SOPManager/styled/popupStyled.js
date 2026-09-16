
import styled from 'styled-components';
import popupClose from '../../Common/images/close_btn.png';

//SOP 저장
export const SaveSOPOptionsComponent = styled.div`
    .sopPop{
        display: block;
        position: fixed;
        z-index: 1000;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        
        > div{
            display: table;
            width: 100%;
            height: 100%;
        }
        > div > div{
            display: table-cell;
            vertical-align: middle;
        }
    }

    .spPop{
        display: block;
        width:950px;
        height:620px;
        margin:0 auto;
        position:relative;
        padding-top:30px;
        overflow:hidden;
        border-radius:8px;
    }

    .sppTop{
        display: block;
        position:absolute;
        left:0;
        right:0;
        top:0;
        background: #0D121A;
        padding: 16px 24px;
        
        > h4{
            color: ${({ theme }) => theme.colors.primary.p500};
            font-size: 1.125rem;
            font-weight: 700;
        }
    }

    .spprCont2{
        padding: 16px 24px;
        background: ${({ theme }) => theme.colors.background.surface};
    }

    .scrollWrapper {
        overflow:auto;
        padding: 0 !important;
        position: relative;
    }

    .scrollWrapper > .scrollContent {
        border: none !important;
        box-sizing: content-box !important;
        height: auto;
        left: 0;
        margin: 0;
        max-height: none;
        max-width: none !important;
        overflow: scroll !important;
        padding: 0;
        position: relative !important;
        top: 0;
        width: auto !important;
    }

    .scrollWrapper > .scrollContent::-webkit-scrollbar {
        height: 0;
        width: 0;
    }

    .scrollbarOuter { 
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        ${({ theme }) => theme.mixins.scroll()};
    }

    .sarTree {
        cursor: pointer;
        padding: 15px;
        color: ${({ theme }) => theme.colors.white};
        overflow-y: auto;
    }

    .sarTree::-webkit-scrollbar {
        width: 6px;
        background: ${({ theme }) => theme.colors.background.base};
    }

    .sarTree::-webkit-scrollbar-thumb {
        background-color: ${({ theme }) => theme.colors.primary.p500};
    }

    .sarTree::-webkit-scrollbar-track {
        background-color: rgba(0,0,0,0);
    }

    .treeview>li {
        margin-bottom: 10px;
        position: relative;
    }

    .treeview>li:last-child {
        margin-bottom: 0;
    }

    .treeview i {
        display: inline-block;
        vertical-align: top;
        width: 14px;
        height: 14px;
        margin-right: 6px;
        border: solid 1px #888;
        position: relative;
        cursor: pointer;
        text-indent: -9999px;
        border-radius: 2px;
        background: ${({ theme }) => theme.colors.white};
        border-color: ${({ theme }) => theme.colors.white};
    }

    .treeview i:before,
    .treeview i:after {
        content: '';
        display: block;
        background: ${({ theme }) => theme.colors.background.surface};
        position: absolute;
        left: 50%;
        top: 50%;
    }

    .treeview i:before {
        width: 10px;
        height: 2px;
        margin-top: -1px;
        margin-left: -5px;
    }

    .treeview i:after {
        width: 2px;
        height: 10px;
        margin-top: -5px;
        margin-left: -1px;
        display: none;
    }

    .treeview i.fa-plus:after {
        display: block;
    }

    .treeview i.fa-minus,
    .treeview i:hover,
    .treeview i:active,
    .treeview i:focus {
        background: ${({ theme }) => theme.colors.white};
        border-color: ${({ theme }) => theme.colors.white};
    }

    .treeview ul {
        margin-top: 10px;
        padding-left: 15px;
        margin-bottom: 10px;
    }

    .treeview>li>h5 {
        display: inline-block;
        vertical-align: top;
        font-size: 1.125rem;
        line-height: 18px;
        margin-top: -2px;
        cursor: pointer;
        color: ${({ theme }) => theme.colors.white};
        max-width: calc(100% - 39%);
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    .treeview>li>ul li {
        margin-bottom: 10px;
        position: relative;
    }

    .treeview>li>ul li:last-child {
        margin-bottom: 0;
    }

    .treeview>li>ul h5 {
        display: inline-block;
        vertical-align: top;
        font-size: 0.875rem;
        max-width: 82%;
        cursor: pointer;
        color: ${({ theme }) => theme.colors.white};
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    .treeview i~a {
        display: inline-block;
        vertical-align: top;
        font-size: 0.875rem;
        line-height: 22px;
        max-width: 75%;
        margin-top: -2px;
        cursor: normal;
        padding-left: 0;
    }

    .treeview i~a:before {
        display: none;
    }

    .treeview i~a:hover,
    .treeview i~a:active,
    .treeview i~a:focus {
        font-weight: 700;
        background: none;
    }

    .treeview.wk a:focus,
    .treeview.wk a:hover {
        background: #000;
        color: ${({ theme }) => theme.colors.white};
        text-decoration: none;
        border-radius: 4px;
    }

    .treeview.wk a:focus:before,
    .treeview.wk a:hover:before {
        background: ${({ theme }) => theme.colors.white};
    }

    .treeview.wk i~a {
        display: inline-block;
        vertical-align: top;
        font-size: 0.875rem;
        line-height: 22px;
        max-width: 75%;
        margin-top: -2px;
        cursor: normal;
        padding-left: 0;
    }

    .treeview.wk i~a:before {
        display: none;
    }

    .treeview.wk i~a:hover,
    .treeview.wk i~a:active,
    .treeview.wk i~a:focus {
        font-weight: 700;
        background: none;
        color: #333;
    }

    .treeview.wkd a {
        color: #aaa;
    }

    .treeview.wkd a:focus {
        text-decoration: none;
        color: ${({ theme }) => theme.colors.black};
        font-weight: 700;
    }

    .treeview a {
        display: inline-block;
        padding-left: 20px; 
        padding-right: 10px;
        font-size: 0.875rem;
        max-width: calc(100% - 25%);
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    .treeview a:hover {
        color: ${({ theme }) => theme.colors.primary.p500};
    }

    #pos_relative {
        position: relative;
    }

    #saveSOP_scrollContent {
        height: 561px;
        margin-bottom: 0px;
        margin-right: 0px;
        max-height: none;
    }

    .spprCont{
    }

    .scTb {
        margin-top: 20px; 
        background: ${({ theme }) => theme.colors.background.base}; 
        color: ${({ theme }) => theme.colors.white};
        padding: 6px; 
        table-layout: fixed; 
    }
    .scTb tr { 
        height: 34px; 
        cursor: pointer; 
    }
    .scTb tr.on {
        background: ${({ theme }) => theme.colors.primary.p500};
    }
    .scTb th,
    .scTb td {
        text-align: center; 
        font-size: 0.875rem; 
        color: ${({ theme }) => theme.colors.white};
        vertical-align: middle; 
        border: 1px solid #384355;
        ${({ theme }) => theme.mixins.textEllipsis()};
    }
    .scTb th {
        font-weight: 500; 
        color: ${({ theme }) => theme.colors.white};
    }
    .scTb td select {
        display: block; 
        width: 100%; 
        height:30px;
    }
    .scTb td input[type="text"] {
        display: block; 
        width: calc(100% - 6px); 
        text-align: center; 
        height:25px;     
        margin: 0 auto;
        font-size: 0.75rem;
    }
    .scTb td span { 
        padding: 5px 0; 
        font-size: 0.875rem; 
    }
    .scTb td span.fixation { 
        padding: 8px; 
    }
    .scTb.ds tr th,
    .scTb.ds tr td {
        padding: 10px; 
        font-size: 1.125rem;
    }
    .scTb.ds tr.on {
        background: #f7fcfb;
    }
    .scTb.ds tr.on td {
        color: #009c79; 
        text-decoration: underline; 
        font-weight: 500;
    }
    .scTb tbody { 
        background-color: ${({ theme }) => theme.colors.background.surface};
    }

    .width_10Pro{
        width: 10%;
    }

    .width_20Pro{
        width: 20%;
    }

    .width_35Pro{
        width: 35%;
    }

    .spprBot{
        padding: 10px 20px;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        border-top: 1px dashed #384355;
        ${({ theme }) => theme.mixins.flex('flex-end', 'center', 'row', '8px')};

        > a {
            width: 100px;
            height: 40px;
            border-radius: 8px;
            cursor: pointer;
            display: inline-block;
            text-align: center;
            font-size: 0.875rem;
            line-height: 172%; /* 24.08px */
            letter-spacing: -0.42px;
            ${({ theme }) => theme.mixins.flex('center', 'center')};
        }

        .submit{
            border-radius: 8px;
            border: 1px solid ${({ theme }) => theme.colors.primary.p500};
            background: ${({ theme }) => theme.colors.primary.p500};
            color: ${({ theme }) => theme.colors.white};

            &.disabled {
                color: ${({ theme }) => theme.colors.grayscale.g400} !important;
                background: ${({ theme }) => theme.colors.grayscale.g700} !important;
                border: 1px solid ${({ theme }) => theme.colors.grayscale.g700} !important;
                cursor: not-allowed;
                pointer-events: none;
            }
        }

        .cancel{
            border-radius: 8px;
            border: 1px solid ${({ theme }) => theme.colors.grayscale.g400};
            background: ${({ theme }) => theme.colors.white};
            color: ${({ theme }) => theme.colors.grayscale.g600};
        }
    }
`;

//SOP 열기
export const OpenSOPOptionsComponent = styled(SaveSOPOptionsComponent)`

    .sppSel{
        display: block;
        position: absolute;
        left: 0;
        right: 0;
        top: 50px;
        background: ${({ theme }) => theme.colors.background.surface};
        border-bottom: dashed 1px #384355;
        padding: 10px 15px;
        color: ${({ theme }) => theme.colors.white};
        z-index: 1;

        > h5{
            display: inline-block;
            vertical-align: middle;
            font-size: 1.125rem;
            margin-right: 30px;
        }
        > label{
            cursor: pointer;
            margin-right: 20px;
        }
    }

    .labelInputRadio{
        display: flex;
        align-items: center;
    }

    input[type=radio] {
        margin-right: 5px;
    }

    .sppCont{
        height: 100%;
        background: ${({ theme }) => theme.colors.background.surface};
        color: ${({ theme }) => theme.colors.white};
    }

    .sppLft{
        width: 200px;
        height: 90%;
        float: left;
        position: relative;
        margin-top: 60px;
        box-shadow: 0px 2px 15px 0px rgba(0,0,0,0.25);
        overflow-y: auto;

        ${({ theme }) => theme.mixins.scroll()};
        
        .h5 {
            font-size: 1rem;
        }
        
        .treeview > li > ul h5 {
            font-size: 1rem;
            position: relative;
            top: 3px;
        }
        
        li {
            font-size: 0.875rem;
        }
    }

    .scrollbarOuter{
        height: 100%;
    }

    .sppRht{
        width: 750px;
        height: 100%;
        float: left;
        position: relative;
        padding-top: 30px;
        padding-bottom: 59px;
    }

    .spprCont {
        padding: 20px; 
        margin-top: 20px; 
    }

    .col10Pro{
        width: 10%;
    }

    .col20Pro {
        width: 20%;
    }

    .col40Pro {
        width: 40%;
    }

    .selectedTreeNode {
        color: ${({ theme }) => theme.colors.primary.p500};
        font-weight: bold;
        cursor: pointer;
    }

    .grayText{
        color: #384355;
    }
`;

//SOP 삭제
export const DeleteSOPOptionsComponent = styled(SaveSOPOptionsComponent)`

    .sppSel{
        display: flex;
        position: absolute;
        left: 0;
        right: 0;
        top: 50px;
        background: ${({ theme }) => theme.colors.background.surface};
        border-bottom: dashed 1px #384355;
        padding: 10px 15px;
        color: ${({ theme }) => theme.colors.white};
        z-index: 1;

        > h5{
            display: inline-block;
            vertical-align: middle;
            font-size: 1.125rem;
            margin-right: 30px;
        }
        > label{
            cursor: pointer;
            margin-right: 20px;
        }
    }

    .labelInputRadio{
        display: flex;
        align-items: center;
    }

    input[type=radio] {
        margin-right: 5px;
    }

    .sppLft{
        width: 200px;
        height: 90%;
        float: left;
        position: relative;
        margin-top: 60px;
        box-shadow: 0px 2px 15px 0px rgba(0,0,0,0.25);
        overflow-y: auto;

        ${({ theme }) => theme.mixins.scroll()};
        
        .h5 {
            font-size: 1rem;
        }
        
        .treeview > li > ul h5 {
            font-size: 1rem;
            position: relative;
            top: 3px;
        }
        
        li {
            font-size: 0.875rem;
        }
    }

    .sppCont{
        height: 100%;
        background: ${({ theme }) => theme.colors.background.surface};
        color: ${({ theme }) => theme.colors.white};
    }

    .scrollbarOuter{
        height: 100%;
    }

    .sppRhtDelete{
        width: 750px;
        height: 100%;
        float: left;
        position: relative;
        padding-bottom: 59px;
        padding-left: 20px;
        padding-top: 60px;
    }

    .col5Pro{
        width: 5%;
    }

    .col12Pro{
        width: 12%;
    }

    .col25Pro{
        width: 25%;
    }

    .col40Pro{
        width: 40%;
    }

    .scTb {
        width: calc(100% - 20px);
        margin-bottom: 20px;
    }

    .scTb tr.on {
        background-color: rgba(59, 67, 73, 1);
    }

    .scTb tr.on td {
        color: ${({ theme }) => theme.colors.primary.p500};
    }

    .scTb tr.on td span {
        color: ${({ theme }) => theme.colors.primary.p500};
    }

    .selectedTreeNode {
        color: ${({ theme }) => theme.colors.primary.p500};
        font-weight: bold;
        cursor: pointer;
    }

    .grayText{
        color: #384355;
    }
`;


