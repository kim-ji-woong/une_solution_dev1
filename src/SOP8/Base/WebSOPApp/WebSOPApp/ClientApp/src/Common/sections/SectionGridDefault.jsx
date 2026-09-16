import React, { Component } from 'react';
import SopManager from '../../SOPManager/ui/sopManager';
import SopManagerResource from '../../SOPManager/resource/id';

import { SectionGridDefaultComponent } from '../../SOPManager/styled/managerStyled';

class SectionGridDefault extends Component {
    onClickMenu(menu) {
        this.props.content(menu, null);
    }

	render() {
        return (
            <SectionGridDefaultComponent>
            {/* <div className={'defaultGrid'}> */}
                <div className={'defaultGridArea'}>
                    <div className={'defaultButtonAreaV'}>
                        <div className={'defaultButtonAreaH'}>
                            <button className={'clickable'} onClick={(e) => this.onClickMenu(SopManagerResource.menu.newSOP)}><span className={'newSopIconN'}></span>{SopManagerResource.menu.newSOP}</button>
                            <button className={'clickable'} onClick={(e) => this.onClickMenu(SopManagerResource.menu.open)}><span className={'sopOpenIconN'}></span>{SopManagerResource.menu.open}</button>
                            <button className={'clickable'} onClick={(e) => this.onClickMenu(SopManagerResource.menu.openXML)}><span className={'fileOpenIconP'}></span>{SopManagerResource.menu.openXML}</button>
                        </div>
                    </div>
                </div>
            {/* </div> */}
            </SectionGridDefaultComponent>
        );
    }
}

export default SectionGridDefault;