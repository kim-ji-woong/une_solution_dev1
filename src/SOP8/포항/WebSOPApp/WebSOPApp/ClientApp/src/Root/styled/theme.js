import { css, styled } from "styled-components";

const theme = {
    background: "#141B27",
    primary: "#0095FF",
    primaryHover: "#27A5FF",
    secondary: "#7C8DA9",
    fontPrimary: "#FFFFFF",
    fontSecondary: "#9E9E9E",
    fontTertiary: "#D7EFFF",
    warning: "#D32F2F",

    defaultFontColor: "#000000",
    error: "#FF0000",
    systemMainBackground: "#222A38",
    sopBoxBackground: "#1B212C",
    sopTitleBackground: "#1D2023",
    sopGridBtnBackground: "#424242",

    button: {
        primary: (width= '100%', height= '32px', fontSize= '14px', fontWeight= '500') => css`
            width: ${width};
            height: ${height};
            font-size: ${fontSize};
            font-weight: ${fontWeight};
            background-color: #0095FF;
            color: #0D121A;
            border-radius: 4px;
            line-height: 172%;
            
            &:hover {
                background-color: #27A5FF;
            }
        `,
        secondary: (width= '100%', height= '32px', fontSize= '14px', fontWeight= '500') => css`
            width: ${width};
            height: ${height};
            font-size: ${fontSize};
            font-weight: ${fontWeight};
            color: #fff;
            border-radius: 4px;
            border: 1px solid #29313E;
            line-height: 172%;
            
            &:hover {
                border: 1px solid #27A5FF;
            }
        `,
    },

    flex: (justify= 'space-between', align= 'center') => css `
        display: flex;
        justify-content:${justify};
        align-items:${align};
    `,

    scroll: (backgroundColor= '#0D121A', barColor= theme.primary) => css `
        &::-webkit-scrollbar {
            width: 6px;
            background: ${backgroundColor};
        }
        
        &::-webkit-scrollbar-thumb {
            background-color: ${barColor};
        }

        &::-webkit-scrollbar-track {
            background-color: rgba(0,0,0,0);
        }

        &::-webkit-scrollbar-corner {
            display: none;
        }
    `,

    overText: () => css `
        white-space: nowrap; 
        text-overflow: ellipsis; 
        overflow: hidden;
    `, 

    userSelect: () => css `
        user-select: none;
    `
};

export default theme;

//  ${(props) => props.theme.primary};
//  ${(props) => props.theme.flex()};

export const ModalBackground = styled.div`
    position: fixed;
    top:0; 
    left: 0; 
    bottom: 0; 
    right: 0;
    background: rgba(0, 0, 0, 0.3);
    opacity: 1;
    z-index: 99;
`