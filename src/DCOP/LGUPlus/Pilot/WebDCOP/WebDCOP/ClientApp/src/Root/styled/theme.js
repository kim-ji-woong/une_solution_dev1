import { css, styled } from "styled-components";

const theme = {
    primary: "#4BE5DD",
    primaryHover: "#99E4DD",
    primaryActive: "#0FCBB9",
    secondary: "#222B33",
    fontPrimary: "#fff",
    fontSecondary: "#888C94",
    error: "#FB5454",
    background: "#171D23",
    

    flex: (justify= 'space-between', align= 'center') => css `
        display: flex;
        justify-content:${justify};
        align-items:${align};
    `,

    scroll: (backgroundColor= theme.secondary, barColor= theme.background) => css `
        &::-webkit-scrollbar {
            width: 4px;
            background: ${backgroundColor};
        }
        
        &::-webkit-scrollbar-thumb {
            background-color: ${barColor};
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

//  ${(props) => props.theme.secondary};
//  ${(props) => props.theme.flex()};

export const ModalBackground = styled.div`
    position: fixed;
    top:0; 
    left: 0; 
    bottom: 0; 
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    opacity: 1;
    z-index: 9999;
`