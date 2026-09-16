import React, { useState } from 'react';
import { EditCCTVMappingComponent } from '../../styled/sdmsPopupsStyled';
import PopupDraggable from '../popups/popupDraggable';
import SdmsResource from '../../resource/id';
import Icon from '../../../Common/components/Icon/Icon';
import IconButton from '../../../Common/components/iconButton';
import SearchInputBox from '../../../Common/components/searchInputBox';
import Button from '../../../Common/components/button';

function EditCCTVMapping(props) {
    const [searchText, setSearchText] = useState("");
    
    const handleSubmit = (value) => {
        console.log(value);
    };

    const temp = [
        {label: "CCTV 명", status: true},
        {label: "CCTV 명", status: false},
        {label: "CCTV 명", status: true},
        {label: "CCTV 명", status: false},
        {label: "CCTV 명", status: true},
        {label: "CCTV 명", status: false},
        {label: "CCTV 명", status: false},
        {label: "CCTV 명", status: false},
        {label: "CCTV 명", status: false},
        {label: "CCTV 명", status: false},
        {label: "CCTV 명", status: false},
        {label: "CCTV 명", status: false},
        {label: "CCTV 명", status: false},
        {label: "CCTV 명", status: false},
        {label: "CCTV 명", status: false},
        {label: "CCTV 명", status: false},
        {label: "CCTV 명", status: false},
        {label: "CCTV 명", status: false},
        {label: "CCTV 명", status: false},
        {label: "CCTV 명", status: false},
        {label: "CCTV 명", status: false},
        {label: "CCTV 명", status: false},
        {label: "CCTV 명", status: false},
    ];

    return (
        <EditCCTVMappingComponent id={props.popupType} className='UI_Section editMode_cctvMappindg' $resize={false}>
            <PopupDraggable
                id={props.popupType}
                popupMinWidth={340}
                popupMinHeight={480}
                topSize={40}
                popupState={props.popupState}
                setActiveDragPopup={props.setActiveDragPopup}
                setPopupState={props.setPopupState}
                usePopupResize={false}
            >
                <div className='dslTop'>
                    <h5 className='dslTitle'>
                        {SdmsResource.ID.menu.editMode_cctvMapping}
                    </h5>
                    <IconButton
                        variant="unfill"
                        size="xxs"
                        icon={<Icon.Closer size={"xxs"} />}
                        onClick={() => props.setShowEditCCTVMapping(false)}
                    >
                        닫기
                    </IconButton>
                </div>
                <div className={'content'}>
                    <div className='searchWrap'>
                        <SearchInputBox
                            value={searchText}
                            onChange={setSearchText}
                            placeholder={"검색하세요"}
                            onSubmit={handleSubmit}
                            onClear={() => console.log("clear")}
                            fullWidth={false}
                        />
                        <p>총 00건</p>
                    </div>
                    <ul className='listWrap'>
                        {
                            temp.map((item) => 
                                <li className={item.status ? 'on' : null}>
                                    <p>{item.label}</p>
                                    {
                                        item.status ? 
                                        <IconButton
                                            variant="unfill_white"
                                            size="xxxs"
                                            icon={<Icon.Minus size={"xxxxxs"} />}
                                        >
                                            삭제
                                        </IconButton> :
                                        <span />
                                    }
                                </li>
                            )
                        }
                    </ul>
                    <div className='btnWrap'>
                        <Button variant="fill" size="md">
                            영상정보 보기
                        </Button>
                    </div>
                </div>
            </PopupDraggable>
        </EditCCTVMappingComponent>
    );
}

export default EditCCTVMapping;