
import styled from 'styled-components';

import NextArrow from '../../SOPManager/images/sopNextIcon.png';

/*********************************************************************/

export const NewSOPOptionsComponent = styled.div`
    display: block;
    height: 100%;
    position: relative;
    padding: 80px 30px 50px 30px;
    border-radius: 8px;
    background: ${({ theme }) => theme.colors.background.surface};
    overflow: hidden;

    /* .speWrap{
        display: block;
        height: 100%;
        position: relative;
        padding: 80px 30px 50px 30px;
        border-radius: 6px;
        background: ${({ theme }) => theme.colors.background.surface};
    } */

    .speTop{
        display: flex;
        height: 56px;
        align-items: center;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        background: #0D121A;
        border-top: solid 1px #0D121A;
        padding: 0 25px;

        > h3{
            color: ${({ theme }) => theme.colors.primary.p500};
            flex: 1;
            font-size: 1.125rem;
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
        color: ${({ theme }) => theme.colors.white};
        font-size: 1rem;
        margin-right: 5px;
    } */

    .labelInputRadio{
        display: flex;
        align-items: center;

        > label {
            font-size: 1rem;
        }
    }

    .speRow{
        display: flex;
        height: 95%;
        margin: 0 -5px;
    }

    .speContFirst{
        display: block;
        width: 33%;
        height: 100%;
        background: #EBEBEB;
        float: left;
        position: relative;
        border-radius: 6px;
        border: solid 3px ${({ theme }) => theme.colors.primary.p500};

        > div > div > h4{
            height: 54px;
            line-height: 54px;
            background: ${({ theme }) => theme.colors.primary.p500};
            text-align: center;
            font-size: 1.125rem;
            color: ${({ theme }) => theme.colors.white};
            font-weight: 500;
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

        ${({ theme }) => theme.mixins.scroll()};
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
            font-size: 1rem;
            margin-right: 15px;
            margin-left: 0;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        > li > label > span{
            margin-left: 3px;
            color: ${({ theme }) => theme.colors.black};
            position: relative;
            top: 2px;
        }
        > li > img{
            display: block;
            width: 100px;
            margin-bottom: 5px;
        }
        > li > span{
            font-size: 1rem;
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
        border: solid 3px ${({ theme }) => theme.colors.primary.p500};
        
        > div > div > h4{
            height: 54px;
            line-height: 54px;
            background: ${({ theme }) => theme.colors.primary.p500};
            text-align: center;
            font-size: 1.125rem;
            color: ${({ theme }) => theme.colors.white};
            font-weight: 500;
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
            color: ${({ theme }) => theme.colors.black};
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
        border: solid 3px ${({ theme }) => theme.colors.primary.p500};

        > div > div > h4{
            height: 54px;
            line-height: 54px;
            background: ${({ theme }) => theme.colors.primary.p500};
            text-align: center;
            font-size: 1.125rem;
            color: ${({ theme }) => theme.colors.white};
            font-weight: 500;
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
            border-bottom: dashed 1px #BDBDBD;
        }
        
        > li > span > label{
            color: ${({ theme }) => theme.colors.black};
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
        color: ${({ theme }) => theme.colors.white};
        font-size: 0.75rem;
        margin-right: 5px;

        > input[type=text] {
            position: relative;
            width: calc(100% - 20px);
            height: 31px;
            line-height: 31px;
            cursor: pointer;
            border-radius: 4px;
            background:none;
            border: 1px solid ${({ theme }) => theme.colors.grayscale.g100};
            margin-left: 10px;
            padding: 0 8px;
            color: ${({ theme }) => theme.colors.black};
        }
    }

    .speBot{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 28px;
        padding: 0 25px;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        ${({ theme }) => theme.mixins.flex('flex-end', 'center', 'row', '8px')};

        > button {
            padding: 0 20px !important;
            border-radius: 8px !important;
        }
    }
`;
