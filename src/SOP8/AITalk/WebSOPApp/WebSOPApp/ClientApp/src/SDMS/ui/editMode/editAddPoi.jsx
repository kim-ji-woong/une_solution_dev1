import React, { useState } from 'react';
import { EditAddPoiComponent } from '../../styled/sdmsPopupsStyled';
import PopupDraggable from '../popups/popupDraggable';
import SdmsResource from '../../resource/id';
import Icon from '../../../Common/components/Icon/Icon';
import IconButton from '../../../Common/components/iconButton';
import SearchInputBox from '../../../Common/components/searchInputBox';

function EditAddPoi(props) {
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
        <EditAddPoiComponent id={props.popupType} className='UI_Section editMode_addPoi' $resize={false}>
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
                        {SdmsResource.ID.menu.editMode_addPoi}
                    </h5>
                    <IconButton
                        variant="unfill"
                        size="xxs"
                        icon={<Icon.Closer size={"xxs"} />}
                        onClick={() => props.setShowEditAddPoi(false)}
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
                                <li>
                                    <p>{item.label}</p>
                                    <p>{item.status ? <Icon.PoiCheckIcon /> : <Icon.PoiXIcon />}</p>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </PopupDraggable>
        </EditAddPoiComponent>
    );
}

export default EditAddPoi;