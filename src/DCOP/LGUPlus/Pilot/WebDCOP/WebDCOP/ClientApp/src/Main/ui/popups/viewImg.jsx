import React, { Component } from 'react';
import { ModalBackground } from '../../../Root/styled/theme';
import MainResource from '../../resource/id';
import { ViewImgComponent } from '../../styled/mainStyled';
import sampleImg from '../../images/sampleImg.png';
import noneImg from '../../images/noneImg.svg';

class ViewImg extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <ModalBackground className='UI_Section'>
                <ViewImgComponent>
                    <div className={'head'}>
                        <h5 className={'title'} >
                            {MainResource.ID.menu.viewImg}
                        </h5>
                        <div className={'close'} onClick={() => this.props.handleModalPopup('viewImg', false)}>
                            <button>닫기버튼</button>
                        </div>
                    </div>

                    <div className={'body'}>
                        <div className='contentWrap'>
                            <div className='content'>
                                <div className='titleWrap'>
                                    <p>상부 1</p>
                                    <button>수정 버튼</button>
                                </div>
                                <div className='imgWrap'>
                                    <img src={sampleImg} />
                                </div>
                            </div>
                            <div className='content'>
                                <div className='titleWrap'>
                                    <p>상부 2</p>
                                </div>
                                <div className='imgWrap'>
                                    <img src={noneImg} width={40} height={29} />
                                </div>
                            </div>
                            <div className='content'>
                                <div className='titleWrap'>
                                    <p>상부 3</p>
                                </div>
                                <div className='imgWrap'>
                                    <img src={noneImg} width={40} height={29} />
                                </div>
                            </div>
                        </div>
                        <div className='contentWrap'>
                            <div className='content'>
                                <div className='titleWrap'>
                                    <p>하부 1</p>
                                </div>
                                <div className='imgWrap'>
                                    <img src={noneImg} width={40} height={29} />
                                </div>
                            </div>
                            <div className='content'>
                                <div className='titleWrap'>
                                    <p>하부 2</p>
                                </div>
                                <div className='imgWrap'>
                                    <img src={noneImg} width={40} height={29} />
                                </div>
                            </div>
                            <div className='content'>
                                <div className='titleWrap'>
                                    <p>하부 3</p>
                                </div>
                                <div className='imgWrap'>
                                    <img src={noneImg} width={40} height={29} />
                                </div>
                            </div>
                        </div>
                    </div>
                </ViewImgComponent>
            </ModalBackground>
        );
    }
}

export default ViewImg;