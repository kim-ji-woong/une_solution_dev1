import React from 'react';
import styled from "styled-components";

const AutoContentTooltip = ({ direction = "bottom", color = "black", node }) => {

    if (direction === "bottom" || direction === "bottom-start" || direction === "bottom-end" || direction === "top" || direction === "top-start" || direction === "top-end" || direction === "left" || direction === "right") {

        const parentNode = node.parent.getBoundingClientRect();
        const targetNode = node.target.getBoundingClientRect();
        const isOverflowed = node.target.scrollWidth > node.target.clientWidth;
    
        let top = 0;
        let left = 0;
        let width = 0;
        let height = 0;
        
        // 텍스트의 width가 부모의 width보다 크면 Tooltip show
        if(isOverflowed) {
    
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
                    <span className="tooltipArrow" />
                    <div>
                        <p>{node.target.textContent}</p>
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
    z-index: 2;

    ${props => {
        if (props.$direction === 'top' || props.$direction === 'bottom')
            return `text-align: center;`
    }};

    > div {
        max-width: 400px;
        display: inline-flex;
        white-space: nowrap;
        background-color: #FFFFFF;
        padding: 4px 8px;
        border-radius: 8px;
        font-size: 0.75rem;
        font-weight: 400;
        line-height: 170%;
        letter-spacing: -0.0225rem;
        text-align: center;
    
        position: absolute;
        ${props => {
            if (props.$direction === 'bottom')
                return `top: 9px; left: 50%; transform: translate(-50%, 0);`
            else if (props.$direction === 'bottom-start')
                return `top: 9px; left: 50%; transform: translate(-50%, 0);`
            else if (props.$direction === 'bottom-end')
                return `top: 9px; left: 50%; transform: translate(-50%, 0);`
            else if (props.$direction === 'top')
                return `top: -9px; left: 50%; transform: translate(-50%, -100%);`
            else if (props.$direction === 'top-start')
                return `top: -9px; left: -3px; transform: translate(0, -100%);`
            else if (props.$direction === 'top-end')
                return `top: -9px; right: -14px; transform: translate(0, -100%);`
            else if (props.$direction === 'left')
                return `top: 50%; right: 0; transform: translate(0, -50%);`
            else if (props.$direction === 'right')
                return `top: 50%; left: 0; transform: translate(0, -50%);`
        }};
            
        > p {
            overflow: hidden;
            color: ${({ theme }) => theme.colors.grayscale.g700};
        }
    }

    > .tooltipArrow {
        position: absolute;
        ${props => {
            if (props.$direction === 'top' || props.$direction === 'top-start' || props.$direction === 'top-end')
                return `
                    top: -5px;
                    left: 50%;
                    transform: translate(-50%, 0) rotate(180deg);
                    width: 0;
                    border-bottom: 5px solid #FFFFFF;
                    border-right: 5px solid transparent;
                    border-left: 5px solid transparent;
                `
            else if (props.$direction === 'bottom' || props.$direction === 'bottom-start' || props.$direction === 'bottom-end')
                return `
                    top: 4px;
                    left: 50%;
                    transform: translate(-50%, 0);
                    width: 0;
                    border-bottom: 5px solid #FFFFFF;
                    border-right: 5px solid transparent;
                    border-left: 5px solid transparent;
                `
            else if (props.$direction === 'left')
                return `position: absolute; transform:rotate(90deg) translate(0, -50%); top: calc(50% - 3px); right: -3px;`
            else if (props.$direction === 'right')
                return `position: absolute; transform:rotate(270deg) translate(0, -50%); top: calc(50% - 3px); left: -3px;`
        }};
    }
`;
