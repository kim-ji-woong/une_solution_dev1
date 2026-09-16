import { css, styled } from "styled-components";
import * as mixins from './mixins';
import { colors } from './colors';

const theme = {
    colors,
    mixins,
};

export default theme;

//  ${({ theme }) => theme.colors.primary.p500};
//  ${({ theme }) => theme.mixins.scroll()};

export const ModalBackground = styled.div`
    position: fixed !important;
    top:0; 
    left: 0; 
    bottom: 0; 
    right: 0;
    background: rgba(0, 0, 0, 0.3);
    opacity: 1;
    z-index: 9998;
`