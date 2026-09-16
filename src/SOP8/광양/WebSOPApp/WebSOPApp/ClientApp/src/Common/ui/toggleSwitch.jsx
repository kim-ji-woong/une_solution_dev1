import React from 'react';
import styled from 'styled-components';

export default function ToggleSwitch({ left, right, leftcolor, rightcolor, leftbgcolor, rightbgcolor, circleColor, sopType, setChecked, isChecked, isDisabled }) {

    return (
        <Wrapper $isDisabled={isDisabled}>
            <CheckBox
                $left={left}
                $right={right}
                $leftcolor={leftcolor}
                $rightcolor={rightcolor}
                $leftbgcolor={leftbgcolor}
                $rightbgcolor={rightbgcolor}
                $circleColor={circleColor}
                $isDisabled={isDisabled}
                onChange={(e) => {if(!isDisabled) {setChecked(e.target, sopType)}}}
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
    width: 52px !important;
    height: 22px !important;
    background: ${(props) => props.$leftbgcolor ?? 'gray'} !important;
    border-radius: 13px !important;
    border: 0 !important;
    cursor: ${(props) => props.$isDisabled ? 'default !important' : 'pointer'};
    opacity: ${(props) => props.$isDisabled ? '.5' : '1'};

    /* OFF 텍스트 */
    &::before {
        position: absolute;
        content: '${(props) => props.$left ?? 'OFF'}';
        padding-left: 11px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: ${(props) => props.$leftcolor ?? '#000'};
        font-size: 12px;
        font-weight: 700;
        line-height: 170%; /* 20.4px */
        letter-spacing: -0.36px;
        left: 11px;
        top: 50%;
        transform: translateY(-50%);

        /* 텍스트 트랜지션 */
        transition: all 0.2s ease-in-out;
    }

    /* OFF 원 */
    &::after {
        position: relative;
        content: '';
        display: block;
        width: 14px;
        height: 14px;
        top: 4px;
        left: 5px;
        border-radius: 50%;
        background: ${(props) => props.circleColor ?? '#686D78'};

        /* 원 이동 트랜지션 */
        transition: all 0.2s ease-in-out;
    }

    &:checked {
        border: 0 !important;
        background: ${(props) => props.$rightbgcolor ?? 'black'}!important;

        /* 배경색 변경 트랜지션 */
        transition: all 0.2s ease-in-out;

        /* ON 텍스트 */
        &::before {
            position: absolute;
            content: '${(props) => props.$right ?? 'ON'}';
            align-items: center;
            justify-content: flex-end;
            color: ${(props) => props.$rightcolor ?? '#fff'};
            left: 0;
        }

        /* ON 원 */
        &::after {
            content: '';
            z-index: 2;
            width: 14px;
            height: 14px;
            top: 3px;
            left: 34px;
            display: block;
            border-radius: 50%;
            background: ${(props) => props.circleColor ?? '#fff'};
            position: relative;
        }
    }
`;