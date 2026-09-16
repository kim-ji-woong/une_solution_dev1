import React from 'react';
import styled from "styled-components";

const AutoContentTooltip = ({ direction = "bottom", color = "black", node }) => {

    if (direction === "bottom" || direction === "bottom-start" || direction === "bottom-end" || direction === "top" || direction === "top-start" || direction === "top-end" || direction === "left" || direction === "right") {

        const parentNode = node.parent.getBoundingClientRect();
        const targetNode = node.target.getBoundingClientRect();
    
        let top = 0;
        let left = 0;
        let width = 0;
        let height = 0;
        
        // 텍스트의 width가 부모의 width보다 크면 Tooltip show
        if(targetNode.width + 6 > parentNode.width) {
    
            // 아래 중앙
            if(direction === "bottom") {
                top = targetNode.top + targetNode.height + 5;
                left = parentNode.x;
                width = parentNode.width;
            }
            // 아래 왼쪽
            else if(direction === "bottom-start") {
                top = targetNode.top + targetNode.height + 5;
                left = targetNode.left - 4;
            }
            // 아래 오른쪽
            else if(direction === "bottom-end") {
                top = targetNode.top + targetNode.height + 5;
                left = parentNode.right - 14;
            }
            // 위 중앙
            else if(direction === "top") {
                top = targetNode.top - targetNode.height + 3;
                left = parentNode.x;
                width = parentNode.width;
            }
            // 위 왼쪽
            else if(direction === "top-start") {
                top = targetNode.top - targetNode.height + 3;
                left = targetNode.left - 4;
            }
            // 위 오른쪽
            else if(direction === "top-end") {
                top = targetNode.top - targetNode.height + 3;
                left = parentNode.right - 14;
            }
            // 왼쪽
            else if(direction === "left") {
                top = parentNode.top;
                left = parentNode.left - parentNode.width;
                width = parentNode.width;
                height = parentNode.height;
            }
            // 오른쪽
            else if(direction === "right") {
                top = parentNode.top;
                left = parentNode.right;
                width = parentNode.width;
                height = parentNode.height;
            }
    
            return (
                <AutoContentTooltipComponent 
                    $top={top} 
                    $left={left} 
                    $width={width}
                    $height={height}
                    $colorType={color}
                    $direction={direction}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="6" viewBox="0 0 11 6" fill="none">
                        <path d="M5.5 4.80825e-07L0.73686 5.25L10.2631 5.25L5.5 4.80825e-07Z" fill="black"/>
                    </svg>
                    <div>
                        <p>{node.target.innerHTML}</p>
                    </div>
                </AutoContentTooltipComponent>
            );
        }
        else {
            return (
                <></>
            )
        }
    }
};

export default AutoContentTooltip;


const AutoContentTooltipComponent = styled.div`
    width: ${props => props.$width + 'px'};
    height: ${props => props.$height + 'px'};

    position: absolute;
    top: ${props => props.$top + 'px'};
    left: ${props => props.$left + 'px'};
    z-index: 9999;

    ${props => {
        if (props.$direction === 'top' || props.$direction === 'bottom')
            return `text-align: center;`
    }};

    > div {
        max-width: 400px;
        display: inline-flex;
        white-space: nowrap;
        background-color: ${props => props.$colorType};
        padding: 5px 10px;
        border-radius: 2px;
        font-size: 10px;
        font-weight: 500;
        filter: drop-shadow(0px 5px 8px rgba(0, 0, 0, 0.07));
    
        position: absolute;
        ${props => {
            if (props.$direction === 'bottom')
                return `top: 11px; left: 50%; transform: translate(-50%, 0);`
            else if (props.$direction === 'bottom-start')
                return `top: 11px; left: -3px;`
            else if (props.$direction === 'bottom-end')
                return `top: 11px; right: -14px;`
            else if (props.$direction === 'top')
                return `top: -14px; left: 50%; transform: translate(-50%, 0);`
            else if (props.$direction === 'top-start')
                return `top: -14px; left: -3px;`
            else if (props.$direction === 'top-end')
                return `top: -14px; right: -14px;`
            else if (props.$direction === 'left')
                return `top: 50%; right: 0; transform: translate(0, -50%);`
            else if (props.$direction === 'right')
                return `top: 50%; left: 0; transform: translate(0, -50%);`
        }};
            
        @media screen and (min-width: 2200px) {
            font-size: 16px;
            max-width: 630px;

            ${props => {
                if (props.$direction === 'bottom' || props.$direction === 'bottom-start' || props.$direction === 'bottom-end')
                    return `top: 12px;`
                else if (props.$direction === 'top' || props.$direction === 'top-start' || props.$direction === 'top-end')
                    return `top: -21px;`
            }};
        }

        > p {
            overflow: hidden;
            color: ${props => props.$colorType === 'black' ? '#fff' : '#000'};
        }
    }

    > svg {
        ${props => {
            if (props.$direction === 'top' || props.$direction === 'top-start' || props.$direction === 'top-end')
                return `transform:rotate(180deg); position: relative; top: -3px`
            else if (props.$direction === 'left')
                return `position: absolute; transform:rotate(90deg) translate(0, -50%); top: calc(50% - 3px); right: -3px;`
            else if (props.$direction === 'right')
                return `position: absolute; transform:rotate(270deg) translate(0, -50%); top: calc(50% - 3px); left: -3px;`
        }};

        ${props => {
            if (props.$colorType === 'white')
                return `filter: invert(99%) sepia(0%) saturate(1638%) hue-rotate(134deg) brightness(110%) contrast(100%);`
        }};
    }
`;