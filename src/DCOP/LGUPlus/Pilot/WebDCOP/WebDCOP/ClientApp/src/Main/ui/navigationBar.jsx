import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { NavigationBarComponent } from '../styled/mainStyled';
import DCOP_logo from '../../Common/images/DCOP_logo.svg';
import ProjectResource from '../../Root/resource/id';
import MainResource from '../resource/id';
import Main from './main';

class NavigationBar extends Component { 
    constructor(props) {
        super(props);
    }

    getQuickButtonClassName = (name) => {
        return this.props.personalView || this.props.thermalView ? 'disable' : (this.props.visiblePopups[name] ? 'on' : 'off');
    }

    goDashboard = () => {
        this.props.history.push(ProjectResource.path.dashboard);
    }

    render() {
        return (
            <NavigationBarComponent className='UI_Section'>
                <div className='headWrap'>
                    <div className='logo' onClick={() => this.goDashboard()}>
                        <img src={DCOP_logo} width={38} height={44} />
                        <h2>DCOP</h2>
                    </div>
                    <ul className='navList'>
                        <li className={this.getQuickButtonClassName(Main.menu.statusInfo) + " " + 'navBtn statusInfo'} onClick={() => this.props.setVisiblePopups(Main.menu.statusInfo)}>
                            <button id={"dsBot_" + MainResource.popupLayer.statusInfo} className={'statusInfoIcon'} />
                        </li>
                        <li className={this.props.personalView || this.props.thermalView ? 'disable navBtn assets3DInfo' : (this.props.showAssets3DInfoPopup ? 'on navBtn assets3DInfo' : 'off navBtn assets3DInfo')} onClick={() => this.props.handleModalPopup('assetsInfo', true)}>
                            <button className={'assets3DInfoIcon'} />
                        </li>
                        {
                            this.props.selectedDataCenter?.dataCenterNo === ProjectResource.dataCenter.bakdal &&
                                <li className={this.getQuickButtonClassName(Main.menu.dataCenterInfo) + " " + 'navBtn dataCenterInfo'} onClick={() => this.props.setVisiblePopups(Main.menu.dataCenterInfo)}>
                                    <button id={"dsBot_" + MainResource.popupLayer.dataCenterInfo} className={'dataCenterInfoIcon'} />
                                </li>
                        }
                    </ul>
                </div>
                <div className={this.props.showMyPagePopup ? 'myPage on' : 'myPage'} onClick={() => this.props.handleModalPopup('myPage', true)}>
                    <button type='button'>마이페이지</button>
                </div>
            </NavigationBarComponent>
        );
    }
}

export default withRouter(NavigationBar);