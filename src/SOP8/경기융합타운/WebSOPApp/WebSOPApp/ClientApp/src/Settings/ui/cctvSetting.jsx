import React from 'react';
import { withRouter } from 'react-router-dom';
import { CCTVSettingComponent } from '../styled/settingsStyled';
import tooltip_icon from '../images/tooltip-icon.png';

function CCTVSetting(props) {
    const onChangeCCTVSetting = (e, cctv, type) => {
		if(type === 'name') {
			cctv.name = e.target.value;
		}
		if(type === 'url') {
			cctv.url = e.target.value;
		}

		const nvrList = props.nvrList;
		for (let i = 0; i < nvrList.length; i++) {
			if (nvrList[i].id === cctv.id) {
				nvrList[i] = cctv;
			}
		}

		props.updateCCTVSettings(nvrList);
	}

    return (
        <CCTVSettingComponent>
            <ul className='contents'>
                <li className='item'>
                    <div>
                        <p>CCTV 설정</p>
                        <span>입주기관 선택</span>
                        <select>
                            <option>도본청·도의회</option>
                        </select>
                    </div>
                    <div id='tooltip' data-tooltip="입주기관의 CCTV를 설정합니다." >
                        <img src={tooltip_icon} alt='도움말 아이콘' width={16} height={16} />
                    </div>
                </li>
                <li className='item list'>
                    {
                        Array.from(Array(9), x =>
                            <div>
                                <div className='title'>
                                    <p>SERVER 01</p>
                                    <p>도청 25F~08F / 1~60</p>
                                </div>
                                <div className='server'>
                                    <div>
                                        <label>이름</label>
                                        <input type='text' defaultValue={'MGIST-SERVER01'} /*onBlur={(e) => onChangeCCTVSetting(e, item, 'name')}*/ />
                                    </div>
                                    <div>
                                        <label>IP/PORT</label>
                                        <input type='text' defaultValue={'192.168.81.11:11707'} /*onBlur={(e) => onChangeCCTVSetting(e, item, 'url')}*/ />
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </li>
            </ul>
        </CCTVSettingComponent>
    );
}

export default withRouter(CCTVSetting);