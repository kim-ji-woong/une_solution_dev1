
import styled from 'styled-components';

import NextArrow from '../../SOPManager/image/sopNextIcon.png';

/*********************************************************************/

export const NewSOPOptionsComponent = styled.div`
    display: block;
    height: 100%;
    position: relative;
    padding: 80px 30px 50px 30px;
    border-radius: 6px;
    background: ${(props) => props.theme.sopBoxBackground};

    /* .speWrap{
        display: block;
        height: 100%;
        position: relative;
        padding: 80px 30px 50px 30px;
        border-radius: 6px;
        background: #1B212C;
    } */

    .speTop{
        display: flex;
        height: 50px;
        align-items: center;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        background: ${(props) => props.theme.sopTitleBackground};
        border-top: solid 1px #1D2023;
        padding: 10px 25px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;

        > h3{
            color: ${(props) => props.theme.primary};
            flex: 1;
            font-size: 18px;
            font-weight: 700;
        }
        
        > div {
        
            input {
                margin-left: 20px;
            }
        
            label {
                margin-left: 5px;
                position: relative;
                top: -1px;
            }
        }
    }

    /* .labelInputRadio{
        display: inline-block;
        color: ${(props) => props.theme.fontPrimary};
        font-size: 16px;
        margin-right: 5px;
    } */

    .labelInputRadio{
        display: flex;
        align-items: center;
    }

    input[type=radio] {
        background: ${(props) => props.theme.fontPrimary};
    }

    input[type=radio]:checked {
        border: solid 1.5px ${(props) => props.theme.primary} !important;
    }

    input[type=radio]:checked:after {
    }

    .speRow{
        display: flex;
        height: 97%;
        margin: 0 -5px;
        
        input[type=radio] {
            border: solid 1.5px #485775;
        }
        
        input[type=radio]:checked {
            border: solid 1.5px ${(props) => props.theme.primary};
        }
    }

    .speContFirst{
        display: block;
        width: 33%;
        height: 100%;
        background: #EBEBEB;
        float: left;
        position: relative;
        border-radius: 6px;
        border: solid 3px ${(props) => props.theme.primary};

        > div > div > h4{
            height: 46px;
            line-height: 46px;
            background: ${(props) => props.theme.primary};
            text-align: center;
            font-size: 18px;
            color: #202020;
            font-weight: bold;
        }
    }

    .speChk{
        position: absolute;
        left: 0;
        top: 60px;
    }

    .scrollWrapper{
        overflow:auto;
        padding: 0 !important;
        position: relative;
    }

    .scrollbarOuter{
        height: calc(100vh - 310px);
        overflow-y: auto;

        ${(props) => props.theme.scroll()};
    }

    .speScr{

    }
    .speGry{
        > li{
            float: left;
            width: 100%;
            padding: 15px 20px;
            border-bottom: dashed 1px #BDBDBD;
        }
        > li > label{
            cursor: pointer;
            font-size: 16px;
            margin-right: 15px;
            margin-left: 0;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        > li > label > span{
            margin-left: 3px;
            color: #000000;
            position: relative;
            top: 2px;
        }
        > li > img{
            display: block;
            width: 100px;
            margin-bottom: 5px;
        }
        > li > span{
            font-size: 16px;
            margin-left: 10px;
            vertical-align: middle;
            
        }
    }

    .nextStageIcon{
        display: inline-block;
        width: 27px;
        height: 100%;
        padding: 0 42px;
        background: url(${ NextArrow }) no-repeat;
        background-position: center;
    }

    .speContSecond{
        display: block;
        width: 33%;
        height: 100%;
        background: #EBEBEB;
        float: left;
        position: relative;
        border-radius: 6px;
        border: solid 3px ${(props) => props.theme.primary};
        
        > div > div > h4{
            height: 46px;
            line-height: 46px;
            background: ${(props) => props.theme.primary};
            text-align: center;
            font-size: 18px;
            color: #202020;
            font-weight: bold;
        }
    }

    .speLst{
        display: block;
        width: 100%;

        > li{
            float: left;
            width: 100%;
            padding: 15px 20px;
            border-bottom: dashed 1px #BDBDBD;
        }
        > li > span > label{
            color: #202020;
            position: relative;
            top: -1px;
            margin-left: 8px;
            cursor: pointer;
        }
    }

    .speContThird{
        display: block;
        width: 33%;
        height: 100%;
        background: #EBEBEB;
        float: left;
        position: relative;
        border-radius: 6px;
        border: solid 3px ${(props) => props.theme.primary};

        > div > div > h4{
            height: 46px;
            line-height: 46px;
            background: ${(props) => props.theme.primary};
            text-align: center;
            font-size: 18px;
            color: #202020;
            font-weight: bold;
        }
    }

    .speIpt{
        display: block;
        width: 100%;
        
        > li{
            display: flex;
            align-items: center;
            position: relative;
            height: 50px;
            line-height: 50px;
            padding-left: 20px;
            border-bottom: dashed 1px #485775;
        }
        
        > li > span > label{
            color: #202020;
            position: relative;
            top: -1px;
            margin-left: 8px;
            cursor: pointer;
        }
    }

    .labelInputTextBlack{
        display: block;
        width: 100%;
        height: 31px;
        line-height: 31px;
        color: ${(props) => props.theme.fontPrimary};
        font-size: 12px;
        margin-right: 5px;

        > input[type=text] {
            position: relative;
            width: calc(100% - 20px);
            height: 31px;
            line-height: 31px;
            cursor: pointer;
            border-radius: 4px;
            background:none;
            border: 1px solid #485775;
            margin-left: 10px;
            padding-left: 5px;
            color: #202020;
        }
    }

    .speBot{
        display: block;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 20px;
        height: 50px;
        text-align: right;
        padding: 10px 25px;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        
        > a:nth-child(1){
            display: inline-block;
            width: 150px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 14px;
            font-weight: 700;
            background: ${(props) => props.theme.sopBoxBackground};
            border: 1px solid #29313E;
            color: ${(props) => props.theme.fontPrimary};
            padding: 0 30px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 6px;
        }
        > a:nth-child(2){
            display: inline-block;
            width: 150px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            font-size: 14px;
            font-weight: 700;
            background: ${(props) => props.theme.primary};
            color: ${(props) => props.theme.defaultFontColor};
            padding: 0 30px;
            border-radius: 4px;
            cursor: pointer;
        }
    }
`;
