import { css, styled } from "styled-components";

const theme = {
    primary: "#5398FF",
    secondary: "#757575",
    fontPrimary: "#fff",
    fontSecondary: "#9E9E9E",
    defaultFontColor: "#000000",
    warning: "#D32F2F",
    error: "#FF0000",
    background: "#0E162D",
    systemMainBackground: "#222A38",
    sopBoxBackground: "#1B212C",
    sopTitleBackground: "#1D2023",
    sopGridBtnBackground: "#424242",
    

    flex: (justify= 'space-between', align= 'center') => css `
        display: flex;
        justify-content:${justify};
        align-items:${align};
    `,

    scroll: (backgroundColor= theme.background, barColor= theme.primary) => css `
        &::-webkit-scrollbar {
            width: 6px;
            background: ${backgroundColor};
        }
        
        &::-webkit-scrollbar-thumb {
            background-color: #525868;
            border-radius: 10px;
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

//  ${(props) => props.theme.background};
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