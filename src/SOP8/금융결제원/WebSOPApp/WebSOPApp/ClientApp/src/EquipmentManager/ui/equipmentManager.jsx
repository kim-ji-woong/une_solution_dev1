import React, { useEffect, useState } from 'react'
import EquipmentList from './equipmentList';
import { EquipmentManagerComponent } from '../styled/equipmentManagerStyled';
import { EquipmentController } from '../services/equipmentController';
import ConfirmDialog from '../../Common/ui/confirmDialog';
import ProjectResource from '../../Root/resource/id';
import { useToast } from '../../Common/components/Toast/ToastProvider';
import EquipmentResource from '../resource/id';

function EquipmentManager(props) {
    const { onShowToast } = useToast();
    
    const [menu, setMenu] = useState(EquipmentResource.menu.상위_장비_목록);

    const [equipmentList, setEquipmentList] = useState([]);
    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const [tpsList, setTpsList] = useState([]);
    const [parentList, setParentList] = useState([]);

    const [confirmMessage, setConfirmMessage] = useState({
        visible: false,
        type: null,
        messages: [""],
        buttons: ["확인"],
        onClickButton: null
    });

    useEffect(() => {
        getEquipmentType();
        getTpsList();
        getParentItemList();
	}, []);

    useEffect(() => {
        getEquipmentList(menu);
        getParentItemList();
    }, [menu]);

    const getEquipmentList = async (menuType = menu) => {
        let equipmentList, message;

        if (menuType === EquipmentResource.menu.상위_장비_목록) {
            [equipmentList, message] = await EquipmentController.requestParentEquipmentList();
        } 
        else {
            [equipmentList, message] = await EquipmentController.requestEquipmentList();
        }

        if (equipmentList === null) {
            showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            return;
        }

        setEquipmentList(equipmentList);
    };

    const getEquipmentType = async () => {
        const [equipmentTypes, message] = await EquipmentController.requestEquipmentType();

        if (equipmentTypes === null) {
            showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            return;
        }

        setEquipmentTypes(equipmentTypes);
    }

    const getTpsList = async () => {
        const [tpsList, message] = await EquipmentController.requestTpsList();

        if (tpsList === null) {
            showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            return;
        }

        setTpsList(tpsList);
    }

    const getParentItemList = async () => {
        const [parentList, message] = await EquipmentController.requestParentItemList();

        if (parentList === null) {
            showConfirmDialog(ProjectResource.dialogTypes.ERROR, [message], null, null);
            return;
        }

        setParentList(parentList);
    }

    const showConfirmDialog = (type, messages, buttons, onClickButton) => {
        const confirmInfo = {};
        confirmInfo.visible = true;
		confirmInfo.type = type;
        confirmInfo.messages = messages;
		confirmInfo.buttons = buttons;
		confirmInfo.onClickButton = onClickButton;

        if (!messages) {
            confirmInfo.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmInfo.messages = messages;
        }
        else {
            confirmInfo.messages = [messages];
        }

        setConfirmMessage(confirmInfo);
    }

    const onCloseConfirmDialog = () => {
		const confirmInfo = {};
		confirmInfo.visible = false;

        setConfirmMessage(confirmInfo);
	}

    const handleToast = (message, status) => {
        onShowToast(message, status);
    };

    return (
        <EquipmentManagerComponent>
            <div className='menuWrap'>
                <p 
                    className={menu === EquipmentResource.menu.상위_장비_목록 ? 'on' : null}
                    onClick={() => setMenu(EquipmentResource.menu.상위_장비_목록)}
                >
                    상위 장비 목록
                </p>
                <p 
                    className={menu === EquipmentResource.menu.하위_장비_목록 ? 'on' : null}
                    onClick={() => setMenu(EquipmentResource.menu.하위_장비_목록)}
                >
                    하위 장비 목록
                </p>
            </div>
            <EquipmentList
                menu={menu}
                equipmentList={equipmentList}
                setEquipmentList={setEquipmentList}
                equipmentTypes={equipmentTypes}
                tpsList={tpsList}
                parentList={parentList}
                onRefreshParentList={getParentItemList}
                showConfirmDialog={showConfirmDialog}
                onCloseConfirmDialog={onCloseConfirmDialog}
                handleToast={handleToast}
            />
            {
                /* alert창 대신 사용 */
                confirmMessage.visible &&
                <ConfirmDialog 
                    type={confirmMessage.type}
                    messages={confirmMessage.messages} 
                    buttons={confirmMessage.buttons} 
                    onClickButton={confirmMessage.onClickButton}
                    onCloseConfirmDialog={onCloseConfirmDialog}
                />
            } 
        </EquipmentManagerComponent>
    )
};

export default EquipmentManager;
