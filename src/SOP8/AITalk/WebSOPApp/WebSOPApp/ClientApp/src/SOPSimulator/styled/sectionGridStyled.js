import styled from 'styled-components';

import btnArrowUp_normal from '../../Common/images/chart/btnArrowUp_normal.png'
import btnArrowUp_dark from '../../Common/images/chart/btnArrowUp_dark.png'
import btnArrowDown_normal from '../../Common/images/chart/btnArrowDown_normal.png'
import btnArrowDown_dark from '../../Common/images/chart/btnArrowDown_dark.png'
import btnArrowLeft_normal from '../../Common/images/chart/btnArrowLeft_normal.png'
import btnArrowLeft_dark from '../../Common/images/chart/btnArrowLeft_dark.png'
import btnArrowRight_normal from '../../Common/images/chart/btnArrowRight_normal.png'
import btnArrowRight_dark from '../../Common/images/chart/btnArrowRight_dark.png'
import check_component from '../../Common/images/check_component.png';


export const ArrowButtonComponent = styled.div`
    .btnArrowTop {
        position: absolute;
        width: 20px;
        height: 12px;
        top: -20px;
        background-image: url(${btnArrowUp_normal});
        background-size: 20px 12px;
        opacity: 0;
        z-index: 1;
    }

    .decisionArrowBox .btnArrowTop,
    .annotationArrowBox .btnArrowTop,
    .internalArrowBox .btnArrowTop {
        top: -15px;
    }

    .btnArrowTop:hover {
        background-image: url(${btnArrowUp_dark});
    }

    .btnArrowBottom {
        position: absolute;
        width: 20px;
        height: 12px;
        bottom: -20px;
        background-image: url(${btnArrowDown_normal});
        background-size: 20px 12px;
        opacity: 0;
        z-index: 1;
    }

    .decisionArrowBox .btnArrowBottom,
    .annotationArrowBox .btnArrowBottom,
    .internalArrowBox .btnArrowBottom {
        bottom: -15px;
    }

    .btnArrowBottom:hover {
        background-image: url(${btnArrowDown_dark});
    }

    .btnArrowLeft {
        position: absolute;
        width: 12px;
        height: 20px;
        left: -20px;
        background-image: url(${btnArrowLeft_normal});
        background-size: 12px 20px;
        opacity: 0;
        z-index: 1;
    }

    .decisionArrowBox .btnArrowLeft,
    .annotationArrowBox .btnArrowLeft,
    .internalArrowBox .btnArrowLeft {
        left: -15px;
    }

    .btnArrowLeft:hover {
        background-image: url(${btnArrowLeft_dark});
    }

    .btnArrowRight {
        position: absolute;
        width: 12px;
        height: 20px;
        right: -20px;
        background-image: url(${btnArrowRight_normal});
        background-size: 12px 20px;
        opacity: 0;
        z-index: 1;
    }

    .decisionArrowBox .btnArrowRight,
    .annotationArrowBox .btnArrowRight,
    .internalArrowBox .btnArrowRight {
        right: -15px;
    }

    .btnArrowRight:hover {
        background-image: url(${btnArrowRight_dark});
    }
`

export const SvgComponent = styled.svg`
    .svgPolyline {
        fill: none;
        stroke-width: 2;
        stroke: blueviolet;
    }
`;


// sectionGridColumn.jsx
export const SectionGridColumnComponent = styled.div`

`
// sectionGridCell.jsx
export const SectionGridCellComponent = styled.div`

`

// sectionGrid.jsx
export const SectionGridComponent = styled.div`
    position: relative;
    width: 2100px;
    height: 1400px;
    display: flex;
    flex-wrap: nowrap;
    margin-top: 50px;
    margin-left: 50px;

    > .sectionGridColumn > .sectionGridCell:after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-right: 1px dotted #eb134b;
        border-bottom: 1px dotted #eb134b;
    }

    &.disableBorder > .sectionGridColumn > .sectionGridCell:after {
        border: 0;
    }

    .sectionGridColumn {
        width: 300px;
        height: 100%;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        flex-shrink: 0;
    }

    .sectionGridColumn {
        flex-wrap: nowrap;
    }

    .sectionGridCell {
        position: relative;
        width: 100%;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .sectionGridCell.selected {
        background-color: rgba(180, 180, 180, 0.3);
    }

    > .sectionGridColumn > .sectionGridCell {
        flex-shrink: 0;
    }

    > svg {
        width: 10000px;
        height: 10000px;
        position: absolute;
        top: 0;
        left: 0;
    }
    
    > .disableBorder > svg {
        background-color: ${({ theme }) => theme.colors.background.surface};
    }

    > .sectionGridColumn > .sectionGridCell:first-child {
        border-top: 0;
    }

    .sectionComponent {
        position: relative;
        width: calc(100% - 50px - 50px);
        height: calc(100% - 60px - 60px);
        background-color: #f0f5fd;
        border: 5px solid #9cbaf3;
        box-sizing: border-box;
        text-align: center;
        font-size: 1.0em;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        color: ${({ theme }) => theme.colors.black};
    }

    .sectionGrid.disableBorder > .sectionGridColumn> .sectionGridCell > 
    #selectedComponent {
        border: 5px solid ${({ theme }) => theme.colors.primary.p500};
        background-color: ${({ theme }) => theme.colors.primary.p500};
        color: ${({ theme }) => theme.colors.black};
    }

    .skipComponent {
        background-color: #4D5967;
        border: ${({ theme }) => theme.colors.primary.p500};
        color: #485775;
    }
    
    .arrowText {
        fill: #F7F7F7;
    }
    
    .noDrag {
        user-select: none;
    }
    
    .svgPolyline {
        fill: none;
        stroke-width: 2;
        stroke: blueviolet;
    }
    
    .defaultGrid {
        margin-top: 50px;
        margin-left: 50px;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    
    .defaultGridArea {
        width: 60%;
        height: 60%;
        background-color: gray;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border: 3px dashed black;
    }
    
    .defaultButtonAreaV {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: center;
    }
    
    .defaultButtonAreaH {
        width: 350px;
        height: 100%;
        display: flex;
        justify-content: space-between;
    }

    .defaultButtonAreaH button {
        width: 100px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: ${({ theme }) => theme.colors.white};
        background: #3764BA;
        border-radius: 4px;
    }



    //프로세스 컴포넌트
    .sectionProcess {
        width: calc(100% - 50px - 50px);
        height: calc(100% - 60px - 60px);
    }

    .sectionComponent.process.round {
        width: 100%;
        height: 100%;
        border-radius: 12px;
    }

    .sectionMarkArea {
        position: relative;
        display: flex;
        width: 100%;
        height: 30px;
    }

    .sectionMarkArea.process {
        margin-top: -30px;
    }
    
    .sectionMark {
        position: relative;
        border-radius: 50%;
        border: 2px solid black;
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 27px;
        font-size: 11px;
        font-weight: bold;
        z-index: 2;
        white-space: nowrap;
    }

    .sectionMark.process.checkComponent {
        position: absolute;
        float: right;
        right: -12px;
        top: 20px;
        border: none;
        background: url(${check_component}) 50% 50% no-repeat;
        background-size: 24px;
    }

    .sectionMark.auto {
        border: 1px solid #0073d4;
        background-color: #0073d4;
        color: white;
    }

    .sectionMark.auto.process {
        left: -12px;
        bottom: 18px;
    }

    #selectedComponent {
        border: 5px solid #FF4E4E;
    }

    #currentComponent {
        border: 5px solid ${({ theme }) => theme.colors.primary.p500};
        background-color: ${({ theme }) => theme.colors.primary.p500};
        color: ${({ theme }) => theme.colors.black};
    }

    .runComponent {
        background-color: ${({ theme }) => theme.colors.background.base};
        border: 5px solid ${({ theme }) => theme.colors.primary.p500};
        color: ${({ theme }) => theme.colors.white};
    }

    .doneComponent {
        background-color: ${({ theme }) => theme.colors.background.base};
        border: 5px solid ${({ theme }) => theme.colors.background.base};
        color: #485775 !important;
    }

    .waitComponent {
        background-color: #485775;
        border: 5px solid #485775;
        color: #EEEEEE;
    }

    
    //설명 컴포넌트
    .annotationArrowBox {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: calc(100% - 50px - 50px);
        height: calc(100% - 60px - 60px);
    }

    .sectionComponent.annotation {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #9cbaf3;
        clip-path: polygon(0 0, 0 100%, 100% 100%, 100% 30px, calc(100% - 27px) 0);
    }

    .sectionComponent.annotation.selected,
    .sectionComponent.annotation.runAnnoBorder.selected {
        background-color: #FF4E4E;
    }

    .sectionComponent.annotation.selected .inner,
    .sectionComponent.annotation .inner {
        width: 100%;
        height: 100%;
        background-color: #f0f5fd;
        clip-path: polygon(0 0, 0 100%, 100% 100%, 100% 27px, calc(100% - 25px) 0);
    }

    .sectionComponent.annotation.selected .edge,
    .sectionComponent.annotation .edge {
        width: 25px;
        height: 27px;
        position: absolute;
        top: 0px;
        right: 0px;
        border-left: 5px solid #9cbaf3;
        border-bottom: 5px solid #9cbaf3;
    }

    .sectionGrid.disableBorder > .sectionGridColumn > .sectionGridCell > 
    .annotationArrowBox > .sectionComponent.annotation.selected .inner.selected,
    .sectionGrid.disableBorder > .sectionGridColumn > .sectionGridCell > 
    .annotationArrowBox > .sectionComponent.annotation .inner.selected {
        background-color: #FF4E4E;
    }


    .sectionComponent.annotation.selected .inner.selected.waitAnnoFill,
    .sectionComponent.annotation .inner.selected.waitAnnoFill,
    .sectionComponent.annotation .inner.waitAnnoFill {
        background-color: #485775;
        color: #EEEEEE;
    }
    
    .sectionComponent.annotation.selected .inner.runAnnoFill,
    .sectionComponent.annotation .inner.runAnnoFill {
        background-color: ${({ theme }) => theme.colors.background.base};
    }
    
    .sectionComponent.annotation.selected .inner.doneAnnoFill,
    .sectionComponent.annotation .inner.doneAnnoFill {
        background-color: ${({ theme }) => theme.colors.background.base};
    }
    
    .sectionComponent.annotation.runAnnoBorder {
        border: 5px solid ${({ theme }) => theme.colors.primary.p500};
        background-color: ${({ theme }) => theme.colors.primary.p500};
    }
    
    .sectionComponent.annotation.waitAnnoBorder {
        border: 5px solid #485775;
        background-color: #485775;
    }
    
    .sectionComponent.annotation.runAnnoBorder .edge {
        width: 25px;
        height: 27px;
        position: absolute;
        top: 0px;
        right: 0px;
        border-left: 5px solid ${({ theme }) => theme.colors.primary.p500};
        border-bottom: 5px solid ${({ theme }) => theme.colors.primary.p500};
    }
    
    .sectionComponent.annotation.waitAnnoBorder .edge {
        width: 25px;
        height: 27px;
        position: absolute;
        top: 0px;
        right: 0px;
        border-left: 5px solid #485775;
        border-bottom: 5px solid #485775;
    }
    
    .sectionComponent.annotation.doneAnnoBorder {
        border: 5px solid ${({ theme }) => theme.colors.background.base};
        background-color: ${({ theme }) => theme.colors.background.base};
    }

    .sectionComponent.annotation.doneAnnoBorder .edge {
        width: 25px;
        height: 27px;
        position: absolute;
        top: 0px;
        right: 0px;
        border-left: 5px solid ${({ theme }) => theme.colors.background.base};
        border-bottom: 5px solid ${({ theme }) => theme.colors.background.base};
    } 


    //상황전파 컴포넌트
    .sectionInternal {
        position: relative;
        width: calc(100% - 50px - 50px);
        height: calc(100% - 60px - 60px);
    }

    .sectionMark.sms {
        border: 1px solid #ffa500;
        background-color: #ffa500;
        padding: 0px 4px;
    }

    .sectionMark.sms.internal {
        left: -12px;
        top: -5px;
    }
    
    .sectionMark.auto.internal {
        left: -12px;
        bottom: 53px;
    }

    .sectionMark.email {
        border: 1px solid #5eba7d;
        background-color: #5eba7d;
        padding: 0px 4px;
    }

    .sectionMark.email.internal {
        left: -12px;
        top: -5px;
    }  
    
    .sectionMark.broad {
        border: 1px solid #e91915;
        background-color: #e91915;
        color: ${({ theme }) => theme.colors.white};
        padding: 0px 4px;
    }

    .sectionMark.broad.internal {
        left: -12px;
        top: -5px;
    }

    .sectionMark.internal.checkComponent {
        position: absolute;
        float: right;
        right: -12px;
        top: -9px;
        border: none;
        background: url(${check_component}) 50% 50% no-repeat;
        background-size: 24px;
    }

    .internalArrowBox {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        top: -30px;
        z-index: 1;
    }

    .internalOuter {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #9cbaf3;
        clip-path: polygon(0 8px, 0 calc(100% - 8px), 100% 100%, 100% 0);
        z-index: 1;
    }

    .internalOuter.exec {
        background-color: ${({ theme }) => theme.colors.primary.p500};
    }

    .internalOuter.selected,
    .internalOuter.runBorder.selected,
    .internalOuter.doneBorder.selected {
        background-color: #FF4E4E;
    }

    .internalOuter.current {
        background-color: ${({ theme }) => theme.colors.primary.p500};
    }

    .sectionGrid.disableBorder > .sectionGridColumn > .sectionGridCell > 
    .internalArrowBox > .internalOuter.selected {
        background-color: ${({ theme }) => theme.colors.primary.p500};
    }

    .sectionGrid.disableBorder > .sectionGridColumn > .sectionGridCell > 
    .internalArrowBox > .internalOuter.runBorder {
        background-color: ${({ theme }) => theme.colors.primary.p500};
    }

    .sectionComponent.internal {
        position: absolute;
        margin-bottom: 0px;
        top: 0;
        width: 100%;
        height: 100%;
        clip-path: polygon(0 12px, 0 calc(100% - 12px), 100% calc(100% - 5px), 100% 5px);
        line-height: 72px;
    }

    .sectionComponent.internal.selected {
        border: 5px solid #FF4E4E;
    }

    .sectionComponent.internal.current {
        border: 5px solid ${({ theme }) => theme.colors.primary.p500};
        color: ${({ theme }) => theme.colors.black};
        background-color: ${({ theme }) => theme.colors.primary.p500};
    } 

    .sectionGrid.disableBorder > .sectionGridColumn > .sectionGridCell > 
    .internalArrowBox > .internalOuter > .sectionComponent.internal.selected {
        border: 5px solid ${({ theme }) => theme.colors.primary.p500};
        background-color: ${({ theme }) => theme.colors.primary.p500};
        color: ${({ theme }) => theme.colors.black};
    }

    .sectionGrid.disableBorder > .sectionGridColumn > .sectionGridCell > 
    .internalArrowBox > .internalOuter > .sectionComponent.internal.runComponent {
        border: 5px solid ${({ theme }) => theme.colors.primary.p500};
        background-color: ${({ theme }) => theme.colors.background.base};
        color: ${({ theme }) => theme.colors.white};
    }

    .sectionGrid.disableBorder > .sectionGridColumn > .sectionGridCell > 
    .internalArrowBox > .internalOuter.selected > .sectionComponent.internal.runComponent {
        border: 5px solid ${({ theme }) => theme.colors.primary.p500};
    }

    .internalOuter.runBorder {
        background-color: ${({ theme }) => theme.colors.primary.p500};
    }

    .internalOuter.current.runBorder {
        background-color: ${({ theme }) => theme.colors.primary.p500};
    }

    .internalOuter.doneBorder {
        background-color: ${({ theme }) => theme.colors.background.base};
    }

    .internalOuter.waitBorder {
        background-color: #485775;
    }


    //판단 컴포넌트
    .decisionArrowBox {
        position: relative;
        ${({ theme }) => theme.mixins.flex('center', 'center')};
        width: calc(100% - 50px - 50px);
        height: calc(100% - 60px);
        z-index: 1;
    }

    .decisionOuter {
        position: relative;
        ${({ theme }) => theme.mixins.flex('center', 'center')};
        width: 100%;
        height: 100%;
        background-color: #9cbaf3;
        clip-path: polygon(50% 0, 0 50%, 50% 100%, 100% 50%);
        z-index: 1;
    }

    .decisionTxtWrap {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
        ${({ theme }) => theme.mixins.flex('center', 'center')};
        line-height: 20px;
        color: ${({ theme }) => theme.colors.black};

        &.waitComponentTxt,
        &.doneComponentTxt {
            color: #EEEEEE !important;
        }
    }

    .decisionOuter.exec {
        background-color: ${({ theme }) => theme.colors.primary.p500};
    }

    .decisionOuter.selected,
    .decisionOuter.runBorder.selected,
    .decisionOuter.doneBorder.selected {
        background-color: #FF4E4E;
    }

    .sectionGrid.disableBorder > .sectionGridColumn > .sectionGridCell > 
    .decisionArrowBox > .decisionOuter.selected {
        background-color: ${({ theme }) => theme.colors.primary.p500};
    }

    .decisionOuter.runBorder {
        background-color: ${({ theme }) => theme.colors.primary.p500};
    }

    .decisionOuter.doneBorder {
        background-color: ${({ theme }) => theme.colors.primary.p500};
    }

    .decisionOuter.waitBorder {
        background-color: #485775;
    }

    /* .decision.selected.runComponent,
    .decision.selected.doneComponent {
        background-color: #FF4E4E;
    } */

    .sectionGrid.disableBorder > .sectionGridColumn > .sectionGridCell > 
    .decisionArrowBox > .decisionOuter > .decision.selected {
        background-color: ${({ theme }) => theme.colors.primary.p500};
        color: ${({ theme }) => theme.colors.black};
    }

    .sectionGrid.disableBorder > .sectionGridColumn > .sectionGridCell > 
    .decisionArrowBox > .decisionOuter > .decision.selected.runComponent {
        background-color: ${({ theme }) => theme.colors.primary.p500};
        color: ${({ theme }) => theme.colors.black};
    }

    .sectionComponent.decision {
        width: 100%;
        height: 100%;
        margin-bottom: 0;
        z-index: 1;
    }
    .decisionInner {
        position: absolute;
        margin: auto;
        font-size: 1.5em;
    }


    //시작, 종료 컴포넌트
    .sectionComponent.endpoint {
        border-radius: 50px;
        /* line-height: 72px; */
    }
`;


