
import styled from 'styled-components';
import popupClose from '../../Common/images/close_btn.png';

//SOP 저장
export const SaveSOPOptionsComponent = styled.div`
    .sopPop{
        position: fixed !important;
        top:0; 
        left: 0; 
        bottom: 0; 
        right: 0;
        background: rgba(0, 0, 0, 0.3);
        opacity: 1;
        z-index: 9998;

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
        width:1011px;
        height:626px;
        margin:0 auto;
        position:relative;
        padding-top:30px;
        overflow:hidden;
        box-shadow:0px 3px 20px 0px rgba(0,0,0,0.2);
        background: #1B212C;
    }

    .sppTop{
        display: block;
        position:absolute;
        left:0;
        right:0;
        top:0;
        background: ${({ theme }) => theme.colors.background.overlay};
        height: 50px;
        
        > h4{
            float: left;
            height: 50px;
            line-height: 50px;
            color: ${({ theme }) => theme.colors.primary.p500};
            padding-left: 15px;
            font-size: 18px;
            font-weight: bold;
        }
    }

    .spprCont2{
        margin-top: 20px;
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
        border-color: #fff;
    }

    .treeview i:before,
    .treeview i:after {
        content: '';
        display: block;
        background: #1B212C;
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
        border-color: #fff;
    }

    .treeview ul {
        margin-top: 10px;
        padding-left: 15px;
        margin-bottom: 10px;
    }

    .treeview>li>h5 {
        display: inline-block;
        vertical-align: top;
        font-size: 12px;
        line-height: 18px;
        margin-top: -2px;
        cursor: pointer;
        color: ${({ theme }) => theme.colors.white};
        max-width: calc(100% - 39%);
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    .treeview>li>ul li {
        font-size: 12px !important;
        margin-bottom: 10px;
        position: relative;
    }

    .treeview>li>ul li:last-child {
        margin-bottom: 0;
    }

    .treeview>li>ul h5 {
        display: inline-block;
        font-size: 12px;
        max-width: 82%;
        cursor: pointer;
        color: ${({ theme }) => theme.colors.white};
        ${({ theme }) => theme.mixins.textEllipsis()};
    }

    .treeview i~a {
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
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
        font-size: 14px;
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
        color: #000;
        font-weight: 700;
    }

    .treeview a {
        display: inline-block;
        padding-left: 20px; 
        padding-right: 10px;
        font-size: 14px;
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
        padding: 40px 20px;
    }

    .spprCont{
    }

    .scTb {
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
        font-size: 14px; 
        color: ${({ theme }) => theme.colors.white};
        vertical-align: middle; 
        border: 1px solid ${({ theme }) => theme.colors.grayscale.g800};
        ${({ theme }) => theme.mixins.textEllipsis()};
    }
    .scTb th {
        color: ${({ theme }) => theme.colors.grayscale.g200};
        background: ${({ theme }) => theme.colors.background.overlay};
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
        font-size: 12px;
    }
    .scTb td span { 
        padding: 5px 0; 
        font-size: 14px; 
    }
    .scTb td span.fixation { 
        padding: 8px; 
    }
    .scTb.ds tr th,
    .scTb.ds tr td {
        padding: 10px; 
        font-size: 18px;
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
        background-color: #202732;
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
        text-align: right;
        padding: 15px 21px;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        border-top: 1px dashed ${({ theme }) => theme.colors.grayscale.g800};
        color: ${({ theme }) => theme.colors.grayscale.g500};

        > a{
            display: inline-block;
            width: 57px;
            height: 23px;
            line-height: 22px;
            text-align: center;
            border: 1px solid ${({ theme }) => theme.colors.grayscale.g500};
            background: transparent;
            color: ${({ theme }) => theme.colors.grayscale.g500};
            font-size: 12px;
            font-weight: 700;
            border-radius: 4px;
            cursor: pointer;
        }
    }

    .spprBot a.blu{
        background:${({ theme }) => theme.colors.primary.p500};
        border-color:${({ theme }) => theme.colors.primary.p500};
        color: ${({ theme }) => theme.colors.white};
        margin-left:5px;
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
        background: ${({ theme }) => theme.colors.background.base};
        border-bottom: dashed 1px ${({ theme }) => theme.colors.grayscale.g800};
        padding: 12px 24px;
        color: ${({ theme }) => theme.colors.white};
        z-index: 1;
        ${({ theme }) => theme.mixins.flex('flex-start', 'center', 'row', '48px')};
    }

    .sppCont{
        height: 100%;
        background: #1B212C;
        color: ${({ theme }) => theme.colors.white};
    }

    .sppLft{
        width: 200px;
        height: calc(100% - 113px);
        float: left;
        position: relative;
        margin-top: 60px;
        overflow-y: auto;
        background: rgba(255, 255, 255, 0.05);

        ${({ theme }) => theme.mixins.scroll()};
        
        .h5 {
            font-size: 16px;
        }
        
        li {
            font-size: 14px;
        }
    }

    .scrollbarOuter{
        height: 100%;
        overflow-y: auto;
        ${({ theme }) => theme.mixins.scroll()};
    }

    .sppRht{
        width: calc(100% - 200px);
        height: 100%;
        float: left;
        position: relative;
        padding-top: 60px;
        padding-bottom: 50px;
    }

    .spprCont {
        padding: 16px 24px;
    }

    .col10Pro{
        width: 10%;
    }

    .col20Pro {
        width: 20%;
    }

    .col30Pro {
        width: 30%;
    }

    .selectedTreeNode {
        color: ${({ theme }) => theme.colors.primary.p400};
        cursor: pointer;
        font-size: 12px !important;
    }

    .grayText{
        color: #485775;
    }
`;

//SOP 삭제
export const DeleteSOPOptionsComponent = styled(OpenSOPOptionsComponent)`

`;


