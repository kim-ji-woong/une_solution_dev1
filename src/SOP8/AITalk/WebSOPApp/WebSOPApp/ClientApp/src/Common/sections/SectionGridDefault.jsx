import React, { Component } from 'react';
import SopManager from '../../SOPManager/ui/sopManager';
import SopManagerResource from '../../SOPManager/resource/id';

import { SectionGridDefaultComponent } from '../../SOPManager/styled/managerStyled';
import Button from '../components/button';
import Icon from '../components/Icon/Icon';

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
                            <Button 
                                className="clickable" 
                                variant="fill" 
                                size="md" 
                                leftIcon={<Icon.PencilIcon size={"xxs"} />}
                                onClick={(e) => this.onClickMenu(SopManagerResource.menu.newSOP)}
                            >
                                {SopManagerResource.menu.newSOP}
                            </Button>
                            <Button 
                                className="clickable" 
                                variant="fill" 
                                size="md" 
                                leftIcon={<Icon.Description size={"xxs"} />}
                                onClick={(e) => this.onClickMenu(SopManagerResource.menu.open)}
                            >
                                {SopManagerResource.menu.open}
                            </Button>
                            <Button 
                                className="clickable" 
                                variant="fill" 
                                size="md" 
                                leftIcon={<Icon.Open size={"xxs"} />}
                                onClick={(e) => this.onClickMenu(SopManagerResource.menu.openXML)}
                            >
                                {SopManagerResource.menu.openXML}
                            </Button>
                        </div>
                    </div>
                </div>
            {/* </div> */}
            </SectionGridDefaultComponent>
        );
    }
}

export default SectionGridDefault;