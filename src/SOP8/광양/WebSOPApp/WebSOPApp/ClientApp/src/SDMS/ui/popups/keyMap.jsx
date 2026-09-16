import React from 'react';
import { KeyMapComponent } from '../../styled/sdmsPopupsStyled';
import IconButton from '../../../Common/components/iconButton';
import Icon from '../../../Common/components/Icon/Icon';

function KeyMap(props) {

    return (
        <KeyMapComponent className={"UI_Section"}>
            <div className='dslTop'>
                <h5 className='dslTitle'>
                    <Icon.IconKeyMap size='xs' />
                    키 맵 도움말
                </h5>
                <IconButton
                    variant="unfill"
                    size="xxs"
                    icon={<Icon.Closer />}
                    onClick={() => props.setShowKeyMapPopup(false)}
                >
                    닫기
                </IconButton>
            </div>
            <div className='keyMapContent'>
                <ul>
                    <li>
                        <p>TOP</p>
                        <div>
                            <p>Ctrl</p>
                            <p>T</p>
                        </div>
                    </li>
                    <li>
                        <p>FRONT</p>
                        <div>
                            <p>Ctrl</p>
                            <p>F</p>
                        </div>
                    </li>
                    <li>
                        <p>LEFT</p>
                        <div>
                            <p>Ctrl</p>
                            <p>L</p>
                        </div>
                    </li>
                    <li>
                        <p>RIGHT</p>
                        <div>
                            <p>Ctrl</p>
                            <p>R</p>
                        </div>
                    </li>
                    <li>
                        <p>ISO</p>
                        <div>
                            <p>Ctrl</p>
                            <p>S</p>
                        </div>
                    </li>
                </ul>
            </div>
        </KeyMapComponent>
    );
}

export default KeyMap;