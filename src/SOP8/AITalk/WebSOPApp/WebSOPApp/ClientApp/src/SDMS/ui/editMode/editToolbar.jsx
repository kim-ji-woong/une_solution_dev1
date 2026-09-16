import React, { useEffect, useState } from 'react';
import { EditToolbarComponent, EditToolButtonComponent } from '../../styled/sdmsPopupsStyled';
import Icon from '../../../Common/components/Icon/Icon';
import IconButton from '../../../Common/components/iconButton';
import SdmsResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';

function EditToolbar(props) {
    const [isChanged, setIsChanged] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState({
        editMenu: SdmsResource.ID.menu.editMode_poi,
        subMenu: null
    });

    useEffect(() => {
        const mgr = props.editModeManager;
        if (!mgr) return;

        if (typeof mgr.isChanged === 'function') {
            const first = Boolean(mgr.isChanged());
            setIsChanged(first);
        }

        const handler = (changed) => {
            setIsChanged(Boolean(changed));
        };
        mgr.onChange = handler;

        return () => {
            if (mgr.onChange === handler) mgr.onChange = null;
        };
    }, [props.editModeManager]);


    const onClickSubMenu = (editMenu, subMenu) => {
        if (editMenu === SdmsResource.ID.menu.editMode_poi && subMenu === 1) {
            props.setShowEditAddPoi(true);
        }
        else if (editMenu === SdmsResource.ID.menu.editMode_areaName && subMenu === 3) {
            props.setShowEditCCTVMapping(true);
        }

        props.editModeManager.setSubMenu(editMenu, subMenu);

        setSelectedMenu({
            editMenu: editMenu,
            subMenu: subMenu
        });
    };

    const onClickClose = () => {
        if (isChanged) {
            props.showConfirmDialog(ProjectResource.dialogTypes.QUESTION, ["편집 중인 내용을 저장하시겠습니까?", "취소 버튼 클릭 시 변경사항은 적용되지않습니다"], ["취소", "저장하기"], handleReset);
        }
        else {
            handleReset(0);
        }
    }

    const handleReset = (index) => {
        if (index === 0) {
            // 내부 변경 내역 초기화
            props.editModeManager.resetChanges?.();
            props.setShowEditAddPoi?.(false);
            props.setShowEditCCTVMapping?.(false);
            props.handleControlMode(SdmsResource.controlMode.editMode, false);
        }
        else if (index === 1) {
            onClickSave();
        }

        props.handleControlMode(SdmsResource.controlMode.editMode, false);
    };

    const onClickSave = async () => {
        const userInfo = ProjectResource.getUserInfo();

        if (userInfo) {
            const [success, message] = await props.editModeManager.save(userInfo.user_sn);
            props.handleToast(success ? "저장되었습니다" : message);

            if (success) {
                setIsChanged(false);
            }
        }
    }

    const getMenuBtn = () => {
        let ui = [];

        if (props.selectedMenu === SdmsResource.ID.menu.editMode_poi) {
            return (
                <>
                    <EditToolButtonComponent
                        $disabled={false}
                        className={selectedMenu.editMenu === SdmsResource.ID.menu.editMode_poi && selectedMenu.subMenu === 1 ? 'plus on' : 'plus'}
                        onClick={() => onClickSubMenu(SdmsResource.ID.menu.editMode_poi, 1)}
                    >
                        <Icon.PlusIcon size={"xxs"} />
                        추가
                    </EditToolButtonComponent>
                    <EditToolButtonComponent
                        $disabled={false}
                        className={selectedMenu.editMenu === SdmsResource.ID.menu.editMode_poi && selectedMenu.subMenu === 2 ? 'on' : null}
                        onClick={() => onClickSubMenu(SdmsResource.ID.menu.editMode_poi, 2)}
                    >
                        <Icon.PaperPlaneIcon size={"sm"} />
                        위치 수정
                    </EditToolButtonComponent>
                </>
            );
        }
        else if (props.selectedMenu === SdmsResource.ID.menu.editMode_fakeWall) {
            return (
                <>
                    <EditToolButtonComponent
                        $disabled={false}
                        className={selectedMenu.editMenu === SdmsResource.ID.menu.editMode_fakeWall && selectedMenu.subMenu === 1 ? 'plus on' : 'plus'}
                        onClick={() => onClickSubMenu(SdmsResource.ID.menu.editMode_fakeWall, 1)}
                    >
                        <Icon.PlusIcon size={"xxs"} />
                        추가
                    </EditToolButtonComponent>
                    <EditToolButtonComponent
                        $disabled={false}
                        className={selectedMenu.editMenu === SdmsResource.ID.menu.editMode_fakeWall && selectedMenu.subMenu === 2 ? 'on' : null}
                        onClick={() => onClickSubMenu(SdmsResource.ID.menu.editMode_fakeWall, 2)}
                    >
                        <Icon.PaperPlaneIcon size={"sm"} />
                        위치 수정
                    </EditToolButtonComponent>
                    <EditToolButtonComponent
                        $disabled={false}
                        className={selectedMenu.editMenu === SdmsResource.ID.menu.editMode_fakeWall && selectedMenu.subMenu === 3 ? 'on' : null}
                        onClick={() => onClickSubMenu(SdmsResource.ID.menu.editMode_fakeWall, 3)}
                    >
                        <Icon.RulerIcon size={"sm"} />
                        길이 수정
                    </EditToolButtonComponent>
                    <EditToolButtonComponent
                        $disabled={false}
                        className={selectedMenu.editMenu === SdmsResource.ID.menu.editMode_fakeWall && selectedMenu.subMenu === 4 ? 'on' : null}
                        onClick={() => onClickSubMenu(SdmsResource.ID.menu.editMode_fakeWall, 4)}
                    >
                        <Icon.RotateIcon size={"sm"} />
                        회전
                    </EditToolButtonComponent>
                    <EditToolButtonComponent
                        $disabled={false}
                        className={selectedMenu.editMenu === SdmsResource.ID.menu.editMode_fakeWall && selectedMenu.subMenu === 5 ? 'on' : null}
                        onClick={() => onClickSubMenu(SdmsResource.ID.menu.editMode_fakeWall, 5)}
                    >
                        <Icon.Trash size={"sm"} />
                        삭제
                    </EditToolButtonComponent>
                </>
            );
        }
        else if (props.selectedMenu === SdmsResource.ID.menu.editMode_areaName) {
            return (
                <>
                    <EditToolButtonComponent
                        $disabled={false}
                        className={selectedMenu.editMenu === SdmsResource.ID.menu.editMode_areaName && selectedMenu.subMenu === 1 ? 'on' : null}
                        onClick={() => onClickSubMenu(SdmsResource.ID.menu.editMode_areaName, 1)}
                    >
                        <Icon.PaperPlaneIcon size={"sm"} />
                        위치 수정
                    </EditToolButtonComponent>
                    <EditToolButtonComponent
                        $disabled={false}
                        className={selectedMenu.editMenu === SdmsResource.ID.menu.editMode_areaName && selectedMenu.subMenu === 2 ? 'on' : null}
                        onClick={() => onClickSubMenu(SdmsResource.ID.menu.editMode_areaName, 2)}
                    >
                        <Icon.PencilIcon size={"sm"} />
                        명칭 수정
                    </EditToolButtonComponent>
                    <EditToolButtonComponent
                        $disabled={false}
                        className={selectedMenu.editMenu === SdmsResource.ID.menu.editMode_areaName && selectedMenu.subMenu === 3 ? 'on' : null}
                        onClick={() => onClickSubMenu(SdmsResource.ID.menu.editMode_areaName, 3)}
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
                <h2>{`${props.selectedMenu} 편집모드`}</h2>
                <div>
                    <IconButton
                        variant="unfill"
                        size="sm"
                        icon={<Icon.SaveIcon size={"xs"} />}
                        disabled={!isChanged ? true : false}
                        onClick={() => onClickSave()}
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