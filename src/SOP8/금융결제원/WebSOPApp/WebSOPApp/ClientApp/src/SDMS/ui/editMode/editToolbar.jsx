import React from 'react';
import { EditToolbarComponent, EditToolButtonComponent } from '../../styled/sdmsPopupsStyled';
import Icon from '../../../Common/components/Icon/Icon';
import IconButton from '../../../Common/components/iconButton';
import SdmsResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';

function EditToolbar(props) {

    const onClickSubMenu = (editMenu, subMenu) => {
        props.setEditMode(prev => ({
            ...prev,
            subMenu: props.editMode.subMenu === subMenu ? SdmsResource.ID.poi_editSubMenu.none : subMenu
        }));

        props.editModeManager.setSubMenu(editMenu, subMenu);
    };

    const onClickClose = () => {
        if (props.changedEdit) {
            props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ["편집 중인 내용을 저장하시겠습니까?"], ["취소", "저장 안 하기", "저장하기"], handleReset);
        }
        else {
            handleReset(1);
        }
    }

    const handleReset = (index) => {
        if (index === 0) { // 취소
            props.onCloseConfirmDialog();
        }
        else if (index === 1) { // 저장 안 하기
            props.onCloseEditMode();
        }
        else if (index === 2) { // 저장하기
            props.onClickSaveEditMode(true);
        }
    };

    const getMenuBtn = () => {
        let ui = [];

        if (props.editMode.selectedMenu === SdmsResource.ID.menu.editMode_poi) {
            return (
                <>
                    <EditToolButtonComponent
                        $disabled={false}
                        className={props.editMode.subMenu === SdmsResource.ID.poi_editSubMenu.add_poi ? 'plus on' : 'plus'}
                        onClick={() => onClickSubMenu(SdmsResource.ID.menu.editMode_poi, SdmsResource.ID.poi_editSubMenu.add_poi)}
                    >
                        <Icon.PlusIcon size={"xxs"} />
                        추가
                    </EditToolButtonComponent>
                    <EditToolButtonComponent
                        $disabled={false}
                        className={props.editMode.subMenu === SdmsResource.ID.poi_editSubMenu.move_poi ? 'on' : null}
                        onClick={() => onClickSubMenu(SdmsResource.ID.menu.editMode_poi, SdmsResource.ID.poi_editSubMenu.move_poi)}
                    >
                        <Icon.PaperPlaneIcon size={"sm"} />
                        위치 수정
                    </EditToolButtonComponent>
                </>
            );
        }
        else if (props.editMode.selectedMenu === SdmsResource.ID.menu.editMode_fakeWall) {
            return (
                <>
                    <EditToolButtonComponent
                        $disabled={false}
                        className={props.editMode.subMenu === SdmsResource.ID.poi_editSubMenu.add_wall ? 'plus on' : 'plus'}
                        onClick={() => onClickSubMenu(SdmsResource.ID.menu.editMode_fakeWall, SdmsResource.ID.poi_editSubMenu.add_wall)}
                    >
                        <Icon.PlusIcon size={"xxs"} />
                        추가
                    </EditToolButtonComponent>
                    <EditToolButtonComponent
                        $disabled={false}
                        className={props.editMode.subMenu === SdmsResource.ID.poi_editSubMenu.move_wall ? 'on' : null}
                        onClick={() => onClickSubMenu(SdmsResource.ID.menu.editMode_fakeWall, SdmsResource.ID.poi_editSubMenu.move_wall)}
                    >
                        <Icon.PaperPlaneIcon size={"sm"} />
                        위치 수정
                    </EditToolButtonComponent>
                    <EditToolButtonComponent
                        $disabled={false}
                        className={props.editMode.subMenu === SdmsResource.ID.poi_editSubMenu.length_wall ? 'on' : null}
                        onClick={() => onClickSubMenu(SdmsResource.ID.menu.editMode_fakeWall, SdmsResource.ID.poi_editSubMenu.length_wall)}
                    >
                        <Icon.RulerIcon size={"sm"} />
                        길이 수정
                    </EditToolButtonComponent>
                    <EditToolButtonComponent
                        $disabled={false}
                        className={props.editMode.subMenu === SdmsResource.ID.poi_editSubMenu.rotate_wall ? 'on' : null}
                        onClick={() => onClickSubMenu(SdmsResource.ID.menu.editMode_fakeWall, SdmsResource.ID.poi_editSubMenu.rotate_wall)}
                    >
                        <Icon.RotateIcon size={"sm"} />
                        회전
                    </EditToolButtonComponent>
                    <EditToolButtonComponent
                        $disabled={false}
                        className={props.editMode.subMenu === SdmsResource.ID.poi_editSubMenu.delete_wall ? 'on' : null}
                        onClick={() => onClickSubMenu(SdmsResource.ID.menu.editMode_fakeWall, SdmsResource.ID.poi_editSubMenu.delete_wall)}
                    >
                        <Icon.Trash size={"sm"} />
                        삭제
                    </EditToolButtonComponent>
                </>
            );
        }
        else if (props.editMode.selectedMenu === SdmsResource.ID.menu.editMode_areaName) {
            return (
                <>
                    <EditToolButtonComponent
                        $disabled={false}
                        className={props.editMode.subMenu === SdmsResource.ID.poi_editSubMenu.move_area ? 'on' : null}
                        onClick={() => onClickSubMenu(SdmsResource.ID.menu.editMode_areaName, SdmsResource.ID.poi_editSubMenu.move_area)}
                    >
                        <Icon.PaperPlaneIcon size={"sm"} />
                        위치 수정
                    </EditToolButtonComponent>
                    <EditToolButtonComponent
                        $disabled={false}
                        className={props.editMode.subMenu === SdmsResource.ID.poi_editSubMenu.name_area ? 'on' : null}
                        onClick={() => onClickSubMenu(SdmsResource.ID.menu.editMode_areaName, SdmsResource.ID.poi_editSubMenu.name_area)}
                    >
                        <Icon.PencilIcon size={"sm"} />
                        명칭 수정
                    </EditToolButtonComponent>
                    <EditToolButtonComponent
                        $disabled={false}
                        className={props.editMode.subMenu === SdmsResource.ID.poi_editSubMenu.cctv_area ? 'on' : null}
                        onClick={() => onClickSubMenu(SdmsResource.ID.menu.editMode_areaName, SdmsResource.ID.poi_editSubMenu.cctv_area)}
                    >
                        <Icon.EditCCTVIcon size={"sm"} />
                        CCTV 매핑
                    </EditToolButtonComponent>
                </>
            );
        }

        return ui;
    };

    return (
        <EditToolbarComponent>
            <div className='titleWrap'>
                <h2>{`${props.editMode.selectedMenu} 편집모드`}</h2>
                <div>
                    <IconButton
                        variant="unfill"
                        size="sm"
                        icon={<Icon.SaveIcon size={"xs"} />}
                        disabled={!props.changedEdit ? true : false}
                        onClick={() => props.onClickSaveEditMode(false)}
                    >
                        저장하기
                    </IconButton>
                    <IconButton
                        variant="unfill"
                        size="sm"
                        icon={<Icon.Logout size={"xxs"} />}
                        onClick={() => onClickClose()}
                    >
                        편집모드에서 나가기
                    </IconButton>
                </div>
            </div>
            <div className='menuWrap'>
                {getMenuBtn()}
            </div>
        </EditToolbarComponent>
    );
}

export default EditToolbar;