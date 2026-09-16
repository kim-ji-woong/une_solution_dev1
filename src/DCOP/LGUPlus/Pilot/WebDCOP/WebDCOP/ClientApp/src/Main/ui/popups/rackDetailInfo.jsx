import React, { Component } from 'react';
import Main from '../main';
import { RackDetailInfoComponent } from '../../styled/mainStyled';
import MainResource from '../../resource/id';
import { ModalBackground } from '../../../Root/styled/theme';

class RackDetailInfo extends Component {
    constructor(props) {
        super(props);
    }

    getRackInfo = () => {
        let ui = [];
        const rack = this.props.selectedRackInfo;

        if (rack) {
            ui.push(
                <React.Fragment key='rackDetailInfo'>
                    <p>{rack.rackName}</p>
                    <div className='imgWrap'>
                        <div className='img_front'>
                            <img src={rack.rackType.imageUrl} alt='랙 앞면 이미지' />
                        </div>
                        <div className='img_back'>
                            <img src={rack.rackType.imageUrl} alt='랙 뒷면 이미지' />
                        </div>
                    </div>
                    <ul>
                        <li>
                            <p>모델명</p>
                            <p>{rack.rackType.modelName}</p>
                        </li>
                        <li>
                            <p>제조사</p>
                            <p>{rack.companyName}</p>
                        </li>
                        <li>
                            <p>크기</p>
                            <p>{`${rack.rackType.width ? rack.rackType.width : '-'} x ${rack.rackType.depth ? rack.rackType.depth : '-'} x ${rack.rackType.height ? rack.rackType.height : '-'} (mm)`}</p>
                        </li>
                        <li>
                            <p>Unit</p>
                            <p>{`${rack.rackType.unit} U`}</p>
                        </li>
                        <li>
                            <p>종류</p>
                            <p>{rack.rackType.type}</p>
                        </li>
                        <li>
                            <p>등록일자</p>
                            <p>{rack.regTime.slice(0, 10)}</p>
                        </li>
                    </ul>
                </React.Fragment>
            );
        }

        return ui;
    }

    render() {
        const rackInfo = this.getRackInfo();

        return (
            <ModalBackground className='UI_Section'>
                <RackDetailInfoComponent>
                    <div className={'head'}>
                        <h5 className={'title'} >
                            {MainResource.ID.menu.rackDetailInfo}
                        </h5>
                        <div className={'close'} onClick={() => this.props.handleModalPopup('rackInfo', false)}>
                            <button>닫기버튼</button>
                        </div>
                    </div>

                    <div className={'body'}>
                        {rackInfo}
                    </div>
                </RackDetailInfoComponent>
            </ModalBackground>
        );
    }
}

export default RackDetailInfo;