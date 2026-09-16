import styled, { css } from "styled-components";
import { valueSet } from "../../util/Util";

export const Svg = styled.svg`
    ${({ $width, $style }) => css`
        width: ${valueSet($width)};
        ${$style || ""}
    `}
`;
