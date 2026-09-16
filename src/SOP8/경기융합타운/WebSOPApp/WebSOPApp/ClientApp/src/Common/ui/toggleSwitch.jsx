import React from 'react';
import styled from 'styled-components';

export default function ToggleSwitch({ left, right, leftcolor, rightcolor, leftbgcolor, rightbgcolor, circleColor, sopType, setChecked, isChecked }) {

    return (
        <Wrapper>
            <CheckBox
                $left={left}
                $right={right}
                $leftcolor={leftcolor}
                $rightcolor={rightcolor}
                $leftbgcolor={leftbgcolor}
                $rightbgcolor={rightbgcolor}
                $circleColor={circleColor}
                onChange={() => setChecked(sopType)}
                type="checkbox"
                checked={isChecked}
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
`;

const CheckBox = styled.input`
    width: 53px !important;
    height: 20px !important;
    background: ${(props) => props.$leftbgcolor ?? 'gray'};
    border-radius: 13px !important;
    border: 0 !important;

    /* OFF 텍스트 */
    &::before {
        position: absolute;
        content: '${(props) => props.$left ?? 'OFF'}';
        padding-left: 11px;
        /* width: 46px; */
        height: 20px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: ${(props) => props.$leftcolor ?? '#000'};
        font-weight: 700;
        font-size: 12px;
        left: 11px;

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
        top: 3px;
        left: 5px;
        border-radius: 50%;
        background: ${(props) => props.circleColor ?? '#000'};

        /* 원 이동 트랜지션 */
        transition: all 0.2s ease-in-out;
    }

    &:checked {
        width: 53px !important;
        height: 20px !important;
        border-radius: 13px !important;
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