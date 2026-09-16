import React, { useRef, useState } from 'react';

import PopupDraggable from './popupDraggable';
import { CCTVInfoComponent } from '../../styled/sdmsPopupsStyled';
import SdmsResource from '../../resource/id';

import expandIcon from '../../images/expandIcon.svg';
import downsizeIcon from '../../images/downsizeIcon.svg';

function CCTVInfo(props) {
    const [fullScreenIndex, setFullScreenIndex] = useState(0);

    const refCCTV1Title = useRef();
    const refCCTV2Title = useRef();
    const refCCTV3Title = useRef();
    const refCCTV4Title = useRef();

    const getFullScreenClassName = (index) => {

        if(props.cctvList.length === 1){
            // 선택된 센서가 1개일 경우 full 사이즈로 표출
            if(index === 1) {
                return " " + 'full';
            } else {
                return " " + 'hidden';
            }
        }
        else {
            if (index === fullScreenIndex) {
                return " " + 'full';
            }
    
            if (fullScreenIndex > 0) {
                return " " + 'hidden';
            }
        }

        return "";
    }

    return (
        <CCTVInfoComponent id={props.popupType} className='UI_Section cctvInfo' $resize={true}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={300}
                popupMinHeight={314}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.cctvInfo}
                    </h5>
                    <button className='dslX'>닫기</button>
                </div>
                <div className={'content'}>
                    <div className={'viewDashboardCCTVConts'}>
                        <div className={'viewDashboardCCTVGrid'}>
                            {/* className : full/hidden */}
                            <div className={'col1row1 full'}>
                                <div id="cctv1_span" ref={refCCTV1Title} onDoubleClick={(e) => showFullScreenCCTV(1)}>
                                    <div className='titleWrap selected'>
                                        <p id="cctv1_name">CCTV 01</p>
                                        <button>
                                            <img src={downsizeIcon} alt='축소 버튼' />
                                        </button>
                                    </div>
                                    {/* <iframe id="cctv1" allowtransparency="yes" scrolling="no"></iframe> */}
                                </div>
                            </div>
                            <div className={'col2row1 hidden'}>
                                <div id="cctv2_span" ref={refCCTV2Title} onDoubleClick={(e) => showFullScreenCCTV(2)}>
                                    <div className='titleWrap'>
                                        <p id="cctv2_name">CCTV 02</p>
                                        <button>
                                            <img src={expandIcon} alt='확대 버튼' />
                                        </button>
                                    </div>
                                    {/* <iframe id="cctv2" allowtransparency="yes" scrolling="no"></iframe> */}
                                </div>
                            </div>
                            <div className={'col1row2 hidden'}>
                                <div id="cctv3_span" ref={refCCTV3Title} onDoubleClick={(e) => showFullScreenCCTV(3)}>
                                    <div className='titleWrap'>
                                        <p id="cctv3_name">CCTV 03</p>
                                        <button>
                                            <img src={expandIcon} alt='확대 버튼' />
                                        </button>
                                    </div>
                                    {/* <iframe id="cctv3" allowtransparency="yes" scrolling="no"></iframe> */}
                                </div>
                            </div>
                            <div className={'col2row2 hidden'}>
                                <div id="cctv4_span" ref={refCCTV4Title} onDoubleClick={(e) => showFullScreenCCTV(4)}>
                                    <div className='titleWrap'>
                                        <p id="cctv4_name">CCTV 04</p>
                                        <button>
                                            <img src={expandIcon} alt='확대 버튼' />
                                        </button>
                                    </div>
                                    {/* <iframe id="cctv4" allowtransparency="yes" scrolling="no"></iframe> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PopupDraggable>
        </CCTVInfoComponent>
    );
}

export default CCTVInfo;