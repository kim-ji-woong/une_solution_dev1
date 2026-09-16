import styled from "styled-components";


/**********************************************************************/
// SDMS root

export const SDMSComponent = styled.div`
    display: flex;
    flex-direction: row-reverse;

    /* 활성화 */
    .dslGrdAct {
        background-color: #007abdc7;
    }

    .posiHeaderWrap {
        position: absolute;
        right: 0;
        top: 0;
        height: 60px;
        padding: 8px 20px 0;
        display: inline-block;
        z-index: 2;
    }
    
    .posiHeaderWrap:after {
        content: "";
        position: absolute;
        right: 0;
        top: 0;
        width: 100%;
        border-left: 50px solid transparent;
        border-top: 60px solid #060817;
        z-index: 1;
    }

    .appHeaderWrap {
        width: 100%;
        height: 90px;
        padding: 20px 30px;
        background-color: #060817;
    }

    .appHeaderWrap a,
    em,
    h2 {
        color: #fff;
    }

    .normalTextBox{
        display: block;
        height: 27px;
        border: solid 1px #fff;
        border-radius: 21px;
        background: linear-gradient(180deg, #FFFFFF, #DBDBDB)no-repeat;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.6px;
        text-align: center;
        padding: 7px 10px; 
        position: absolute;
        left: 0;
        top: 0;
        z-index: 99;
    }

    .activeTextBox{
        display: block;
        height: 41px;
        border: solid 1px #fff;
        border-radius: 21px;
        background: linear-gradient(180deg, #5398FF, #00AFFF)no-repeat;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.8px;
        color: #000000;
        text-align: center;
        padding: 11px 20px; 
        position: absolute;
        left: 0;
        top: 30px;
        z-index: 99;
    }
`;