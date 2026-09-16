import React from 'react';
import styled from 'styled-components';

export default function ToggleSwitchNipa({ leftcolor, rightcolor, leftbgcolor, rightbgcolor, circleColor, type, setChecked, isChecked, isDisabled }) {

    return (
        <Wrapper $isDisabled={isDisabled}>
            <CheckBox
                $leftcolor={leftcolor}
                $rightcolor={rightcolor}
                $leftbgcolor={leftbgcolor}
                $rightbgcolor={rightbgcolor}
                $circleColor={circleColor}
                $isDisabled={isDisabled}
                onChange={(e) => {if(!isDisabled) {type === 'normal' ? setChecked(!isChecked) : setChecked(e.target, type)}}}
                type="checkbox"
                checked={isChecked || ''}
            />
        </Wrapper>
    );
}


// css
const Wrapper = styled.div`
    justify-content: center;
    align-items: center;
    display: flex;
    z-index: 0;
    user-select: ${(props) => props.$isDisabled ? 'none' : 'all'};
`;

const CheckBox = styled.input`
    width: 36px !important;
    height: 16px !important;
    background: ${(props) => props.$leftbgcolor ?? 'gray'} !important;
    border-radius: 13px !important;
    border: 0 !important;
    cursor: ${(props) => props.$isDisabled ? 'default !important' : 'pointer'};
    opacity: ${(props) => props.$isDisabled ? '.5' : '1'};

    /* OFF 원 */
    &::after {
        position: relative;
        content: '';
        display: block;
        border-radius: 50%;
        width: 20px !important;
        height: 20px !important;
        top: -2px;
        left: 0;
        background: #fff !important;
        box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.04), 0 1px 5px 0 rgba(0, 0, 0, 0.08);

        /* 원 이동 트랜지션 */
        transition: all 0.2s ease-in-out;
    }

    &:checked {
        width: 36px !important;
        height: 16px !important;
        border-radius: 13px !important;
        border: 0 !important;
        background: ${(props) => props.$rightbgcolor ?? 'black'} !important;

        /* 배경색 변경 트랜지션 */
        transition: all 0.2s ease-in-out;

        /* ON 원 */
        &::after {
            content: '';
            z-index: 2;
            width: 20px !important;
            height: 20px !important;
            top: -2px;
            left: 16px;
            display: block;
            border-radius: 50%;
            background: ${(props) => props.$circleColor ?? '#fff'} !important;
            position: relative;

            /* 원 이동 트랜지션 */
            transition: all 0.2s ease-in-out;
        }
    }
`;