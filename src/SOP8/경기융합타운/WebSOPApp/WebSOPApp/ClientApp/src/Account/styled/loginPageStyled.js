
import styled from 'styled-components';

import idIcon from '../images/login_id_icon.png';
import pwdIcon from '../images/login_pwd_icon.png';
import errorIcon from '../images/login_error_icon.png';
import login_img_Gyeonggi1 from '../images/login_img_Gyeonggi1.png';
import login_img_Gyeonggi2 from '../images/login_img_Gyeonggi2.png';
import login_img_Gyeonggi3 from '../images/login_img_Gyeonggi3.png';
import mailIcon from '../images/login_mail_icon.png';


/**********************************************************************/
// 로그인 페이지

export const LoginPageComponent = styled.div`
    background: #0E162D;
    overflow: hidden;
    color: #ffffff;
    font-size: 16px;
    padding: 0 60px;
    height: 100vh;;

    .blind {
        position: absolute;
        clip: rect(0 0 0 0);
        width: 1px;
        height: 1px;
        margin: -1px;
        overflow: hidden;
    }

    .slick-slider {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
    }

    .slick-prev::before,
    .slick-next::before {
        opacity: 0;
        display: none;
    }

    .slick-dots {
        position: absolute;
        bottom: 100px;
        display: block;
        width: 100%;
        padding: 0;
        margin: 0;
        list-style: none;
        text-align: center;

        li {
            position: relative;
            left: -810px;
            bottom: 4px;
            display: inline-block;
            margin: 0 30px;
            padding: 0;
            cursor: pointer;

            button {
                font-size: 0;
                line-height: 0;
                display: block;
                padding: 5px;
                cursor: pointer;
                color: transparent;
                border: 0;
                outline: none;
                background: transparent;

                &:before {
                    position: absolute;
                    top: 0;
                    left: 0;
                    content: '';
                    width: 60px;
                    height: 4px;
                    background-color: #ffffff;
                    opacity: .3;
                    border-radius: 3px;
                    color: #ffffff;
                }
            }
        }

        li.slick-active {
            button:before {
                opacity: 1;
                color: #ffffff;
            }
        }
    }

    @media screen and (min-width: 1921px) {
        .slick-dots {
            position: absolute;
            bottom: 100px;
            display: block;
            width: 100%;
            padding: 0;
            margin: 0;
            list-style: none;
            text-align: center;

            li {
                position: relative;
                left: -1130px;
                bottom: 4px;
                display: inline-block;
                margin: 0 30px;
                padding: 0;
                cursor: pointer;

                button {
                    font-size: 0;
                    line-height: 0;
                    display: block;
                    padding: 5px;
                    cursor: pointer;
                    color: transparent;
                    border: 0;
                    outline: none;
                    background: transparent;

                    &:before {
                        position: absolute;
                        top: 0;
                        left: 0;
                        content: '';
                        width: 60px;
                        height: 4px;
                        background-color: #ffffff;
                        opacity: .3;
                        border-radius: 3px;
                        color: #ffffff;
                    }
                }
            }

            li.slick-active {
                button:before {
                    opacity: 1;
                    color: #ffffff;
                }
            }
        }

    }

    .company-img1 {
        width: 100%;
        height: 100vh;
        background-image: url(${login_img_Gyeonggi1});
        background-position: 50% 50%;
        background-size: cover;
        opacity: 0.2;
    }
    
    .company-img2 {
        width: 100%;
        height: 100vh;
        background-image: url(${login_img_Gyeonggi2});
        background-position: 50% 50%;
        background-size: cover;
        opacity: 0.2;
    }
    
    .company-img3 {
        width: 100%;
        height: 100vh;
        background-image: url(${login_img_Gyeonggi3});
        background-position: 50% 50%;
        background-size: cover;
        opacity: 0.2;
    }

    .gradient-bg {
        position: fixed;
        top: 0px;
        left: 50%;
        width: calc(100vw / 2);
        height: 100%;
        background: transparent linear-gradient(90deg, #1C232D00 0%, #0E162DB3 24%, #0E162D 59%, #0E162DE6 100%) no-repeat padding-box;
        z-index: 0;
    }

    > header {
        position : relative;
        height: 120px;
        color: #B3B3B3;

        .find-pwd-wrap {
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            padding: 60px 0 0 0;

            .find-pwd {
                width: 131px;
                height: 53px;
                background: #ffffff 0% 0% no-repeat padding-box;
                border-radius: 10px;
                opacity: 1;
                margin-left: 20px;
                color: #0E162D;
                font-weight: 600;
                font-size: 16px;
            }
        }
    }

    .content-wrap {
        position : relative;
        float: right;
        margin-right: 160px;
        top: 50%;
        left: 0;
        transform: translate(-6%, -72%);
        display: flex;
        flex-direction: column;

        p {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 11px;
        }

        form {
            div {
                display: flex;
                flex-direction: column;
                /* margin-top: 40px; */
            }

            div:nth-child(1):before { 
                content: url(${idIcon});
                position:relative; 
                left: 20px;
                top: 77px;
                width:18px; 
                height:20px;
            }

            div:nth-child(2):before { 
                content:url(${pwdIcon}); 
                position:relative; 
                left: 20px;
                top: 79px;
                width: 18px; 
                height: 24px;
            }

            input {
                width: 520px;
                height: 63px;
                border: 1px solid #B3B3B3;
                border-radius: 10px;
                background-color: transparent;
                margin-top: 20px;
                padding-left:57px;
                color: #B3B3B3;
                font-size: 16px;
            }

            input:focus {
                border: 1px solid #004BB9;
            }

            input:-webkit-autofill,
            input:-webkit-autofill:hover,
            input:-webkit-autofill:focus,
            input:-webkit-autofill:active {
                -webkit-text-fill-color: #B3B3B3;
                -webkit-box-shadow: 0 0 0px 1000px transparent inset;
                box-shadow: 0 0 0px 1000px transparent inset;
                transition: background-color 5000s ease-in-out 0s;
            }

            input:autofill,
            input:autofill:hover,
            input:autofill:focus,
            input:autofill:active {
                -webkit-text-fill-color: #B3B3B3;
                -webkit-box-shadow: 0 0 0px 1000px transparent inset;
                box-shadow: 0 0 0px 1000px transparent inset;
                transition: background-color 5000s ease-in-out 0s;
            }

            input:-webkit-autofill::first-line {
                font-size: 16px;
            }

            label:nth-child(3) {
                margin-top: 60px;
            }

            button {
                width: 520px;
                height: 63px;
                color : #ffffff;
                background: #004BB9;
                border-radius: 10px;
                opacity: 1;
                margin-top: 60px;
                font-size: 16px;
            }
        }

        .error-msg {
            color: #FF5353;
            position: absolute;
            left: 0px;
            top: 470px;

            p:before {
                content: url(${errorIcon}); 
                vertical-align: middle;
                margin-right: 8px;
            }

            p {
                font-size: 16px;
                font-weight: normal;
                width: 520px;
            }
        }
    }

    > footer {
        height: 80px;
        position: absolute;
        bottom: 0px;

        p {
            font-weight: 300;
            color : #ffffff;
            opacity: 0.3;
            font-weight: lighter;
            letter-spacing: 0.5px;
        }
    }

`


/**********************************************************************/
// 비밀번호 찾기 페이지

export const AccountFindPwdWrap = styled(LoginPageComponent)`
    .content-wrap {
        transform: translate(-6%, -49%);

        .description {
            font-size: 16px;
            font-weight: 400;
            color: #B3B3B3;
            margin-top: 7px;
            margin-bottom: 38px;
        }

        ul {
            display: flex;
            align-items: center;
            flex-direction: row;
            gap: 20px;

            li {
                span {
                    margin-left: 10px;
                    vertical-align: middle;
                }
            }
        }
        
        form {
            div:first-child {
                margin-top: 0;
            }

            div:nth-child(2):before { 
                content:url(${mailIcon}); 
                position:relative; 
                left: 20px;
                top: 74px;
                width: 18px;
                height: 13px;
            }
        }

        .error-msg {
            color: #FF5353;
            position: absolute;
            left: 0px;
            top: 500px;

            p:before {
                content: url(${errorIcon});
                vertical-align: middle;
                margin-right: 8px;
            }

            p {
                font-size: 16px;
                font-weight: normal;
                width: 520px;
            }
        }

        .button-wrap {
            width: 100%;
            display: flex;
            justify-content: space-between;
            flex-direction: row;
            align-items: center;
            gap: 20px;
            margin: 0;



            button {
                width: 50%;

                &:last-child {
                    background-color: #272E42;
                }
            }
        }
    }
`;