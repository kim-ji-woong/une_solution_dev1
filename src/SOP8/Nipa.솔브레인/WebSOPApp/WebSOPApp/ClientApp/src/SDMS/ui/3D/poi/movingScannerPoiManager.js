import SdmsResource from "../../../resource/id";
import { HtmlTextPoiManager } from "./htmlTextPoiManager";
import { PoiManager } from "./poiManager";

export class MovingScannerPoiManager {
    static NoneType = -1;
    static NormalType = 0;
    static NormalHoverType = 1;
    static SelectedType = 2;
    static AlarmType = 3;
    static AlarmHoverType = 4;
    static AlarmSelectedType = 5;

    constructor(textPoiManager) {
        this.textPoiManager = textPoiManager;

        this.scanerInfos = [];
        this.selectedLabel = null;
        this._hoverLabel = null;
    }

    updateScanerInfo(info) {
        if (!info || info.length === 0) {
            if (this.scanerInfos.length > 0) {
                this.scanerInfos = [];
                this.updateElements();
            }
        }
        else {
            const len1 = info.length;
            const len2 = this.scanerInfos.length;

            if (len1 !== len2) {
                this.setScanerInfo(info);
                this.updateElements();
            }
            else {
                for (let i = 0; i < len1; i++) {
                    const data1 = info[i];
                    const data2 = this.scanerInfos[i];

                    if (this.isSame(data1, data2) === false) {
                        this.setScanerInfo(info);
                        this.updateElements();
                        break;
                    }
                }
            }
        }
    }

    isSame(data1, data2) {
        if (data1.sensor_sn !== data2.sensorNo) {
            return false;
        }

        if (data1.tag_prmisn_co !== data2.permission) {
            return false;
        }

        if (data1.tag_nnpmsn_co !== data2.nonPermission) {
            return false;
        }

        return true;
    }

    setScanerInfo(info) {
        const datas = [];

        for (const data of info) {
            datas.push({
                "sensorNo": data.sensor_sn,
                "permission": data.tag_prmisn_co ? data.tag_prmisn_co : 0,
                "nonPermission": data.tag_nnpmsn_co ? data.tag_nnpmsn_co : 0
            });
        }

        this.scanerInfos = datas;
    }

    updateElements() {
        const layer = this.textPoiManager.movingScannerLayer;
        //const layer = this.textPoiManager.getTextLayer(HtmlTextPoiManager.MovingScannerNPeople);

        if (layer) {
            const childCount = layer.children.length;

            for (let i = 0; i < childCount; i++) {
                const label = layer.children[i];

                const sensorNo = label.userData.sensorNo;
                const permission = label.userData.permission;
                const nonPermission = label.userData.nonPermission;

                if (sensorNo === 0 || sensorNo) {
                    const [permissionCount, nonPermissionCount] = this.getScanerInfo(sensorNo);

                    if (permissionCount !== permission || nonPermissionCount !== nonPermission) {
                        this.updateScanerText(label, permissionCount, nonPermissionCount);
                    }
                }
            }
        }
    }

    updatePoiPosition(sensorNo, x, y, z, poiManager) {
        // Label 위치 갱신
        const layer = this.textPoiManager.movingScannerLayer;

        if (layer) {
            const childCount = layer.children.length;

            for (let i = 0; i < childCount; i++) {
                const label = layer.children[i];

                if (label.userData.sensorNo === sensorNo) {
                    label.position.set(x, y, z);
                    break;
                }
            }
        }

        // Circle 위치 갱신 (POI sprite의 userData.circle을 통해)
        if (poiManager) {
            this.updateCirclePosition(sensorNo, x, y, z, poiManager);
        }
    }

    updateCirclePosition(sensorNo, x, y, z, poiManager) {
        const sensorPois = poiManager.sensorPois;

        for (const key in sensorPois) {
            const poi = sensorPois[key];

            if (poi.userData?.sensor?.sensor_sn === sensorNo ||
                key.includes("_" + sensorNo + "_")) {
                if (poi.userData?.circle?.group) {
                    poi.userData.circle.group.position.set(
                        x,
                        poi.userData.circle.group.position.y,
                        z
                    );
                }
                return;
            }
        }
    }

    removeLabel(sensorNo) {
        const layer = this.textPoiManager.movingScannerLayer;

        if (layer) {
            const childCount = layer.children.length;

            for (let i = 0; i < childCount; i++) {
                const label = layer.children[i];

                if (label.userData.sensorNo === sensorNo) {
                    label.parent.remove(label);
                    return;
                }
            }
        }
    }

    getScanerInfo(sensorNo) {
        const scanerInfos = [...this.scanerInfos];

        for (const scanerInfo of scanerInfos) {
            if (scanerInfo.sensorNo === sensorNo) {
                return [scanerInfo.permission, scanerInfo.nonPermission];
            }
        }

        return [0, 0];
    }

    make00Text(data) {
        if (data < 10) {
            return "0" + data.toString();
        }

        return data.toString();
    }

    updateScanerText(label, permissionCount, nonPermissionCount) {
        for (const child of label.element.children) {
            if (child.tagName === "UL") {
                const liCount = child.children.length;
                let index = 0;

                for (let i = 0; i < liCount; i++) {
                    const li = child.children[i];

                    if (li.tagName === "LI") {
                        for (const p of li.children) {
                            if (p.tagName === "P") {
                                if (index++ === 0) {
                                    p.innerText = this.make00Text(permissionCount) + "명";
                                }
                                else {
                                    p.innerText = this.make00Text(nonPermissionCount) + "명";
                                }
                            }
                        }
                    }
                }
            }
        }

        label.userData.permission = permissionCount;
        label.userData.nonPermission = nonPermissionCount;
    }

    showPoiLayers(layers, visible) {
        const header = SdmsResource.facilityType.MOBILE_SCANNER.toString();

        for (const layerName in layers) {
            if (layerName !== PoiManager.MovingScanerLabel) {
                if (layerName.startsWith(header)) {
                    const layer = layers[layerName];
                    layer.visible = visible;
                }
            }
        }
    }

    setEditMode(isEditMode, poiManager) {
        const layer = this.textPoiManager.movingScannerLayer;
        const poiParentLayer = poiManager.getSensorLayer(PoiManager.MovingScanerPoi);

        if (layer?.parent && poiParentLayer) {
            if (poiParentLayer.children.length > 0) {
                const poiLayer = poiParentLayer.children[0];

                if (isEditMode) {
                    layer.visible = false;
                    //this.showPoiLayers(sensorLayers, true);
                    poiLayer.visible = true;
                }
                else {
                    layer.visible = true;
                    //this.showPoiLayers(sensorLayers, false);
                    poiLayer.visible = false;
                }
            }
        }
    }

    getNormalImage() {
        return "/resource/image/icon/poi/movingscaner.png";
    }

    getNormalHoverImage() {
        return "/resource/image/icon/poi/movingscaner_hover.png";
    }

    getSelectedImage() {
        return "/resource/image/icon/poi/movingscaner_selected.png";
    }

    getAlarmImage() {
        return "/resource/image/icon/poi/movingscaner_alarm.png";
    }

    getAlarmHoverImage() {
        return "/resource/image/icon/poi/movingscaner_alarm_hover.png";
    }

    getAlarmSelectedImage() {
        return "/resource/image/icon/poi/movingscaner_alarm_selected.png";
    }

    selectLabel(label) {
        if (label === this.selectedLabel) {
            return;
        }

        if (label) {
            if (this.selectedLabel) {
                this.setLabelImage(this.selectedLabel, this.getSelectedImageType(this.selectedLabel, false));
            }

            const imageType = this.getSelectedImageType(label, true);
            this.setLabelImage(label, imageType);
        }
        else {
            if (this.selectedLabel) {
                const imageType = this.getSelectedImageType(this.selectedLabel, false);
                this.setLabelImage(this.selectedLabel, imageType);
            }
        }

        this.selectedLabel = label;
    }

    setLabelImage(label, imageType) {
        if (!label.element) {
            return;
        }

        const [imageUrl, scale] = this.getImageUrl(imageType);

        for (const child of label.element.children) {
            if (child.tagName === "IMG") {
                this.setChangeImageUrl(child, imageUrl);
                child.style.transform = "scale(" + scale + ")";
                return;
            }
        }
    }

    setChangeImageUrl(element, imageUrl) {
        if (!element.src) {
            return;
        }

        const index = imageUrl.indexOf('/');
        let header = null;

        if (index === 0) {
            const index1 = imageUrl.indexOf('/', index + 1);

            if (index1 < 0) {
                return;
            }

            header = imageUrl.substring(0, index1);
        }
        else {
            header = imageUrl.substring(0, index);
        }

        const index2 = element.src.indexOf(header);

        if (index2 < 0) {
            return;
        }

        const baseUrl = element.src.substring(0, index2);
        element.src = baseUrl + imageUrl;
    }

    getSelectedImageType(label, isSelected) {
        const [imageType, element] = this.getImageType(label);

        if (isSelected) {
            if (imageType === MovingScannerPoiManager.AlarmType ||
                imageType === MovingScannerPoiManager.AlarmHoverType ||
                imageType === MovingScannerPoiManager.AlarmSelectedType) {
                return MovingScannerPoiManager.AlarmSelectedType;
            }
            else {
                return MovingScannerPoiManager.SelectedType;
            }
        }
        else {
            if (imageType === MovingScannerPoiManager.AlarmType ||
                imageType === MovingScannerPoiManager.AlarmHoverType ||
                imageType === MovingScannerPoiManager.AlarmSelectedType) {
                return MovingScannerPoiManager.AlarmType;
            }
            else {
                return MovingScannerPoiManager.NormalType;
            }
        }

        return MovingScannerPoiManager.NoneType;
    }

    getImageType(label) {
        let element = null;

        for (const child of label.element.children) {
            if (child.tagName === "IMG") {
                element = child;
                break;
            }
        }

        if (!element) {
            return [MovingScannerPoiManager.NoneType, null];
        }

        if (element.src.includes(this.getNormalImage())) {
            return [MovingScannerPoiManager.NormalType, element];
        }
        else if (element.src.includes(this.getNormalHoverImage())) {
            return [MovingScannerPoiManager.NormalHoverType, element];
        }
        else if (element.src.includes(this.getSelectedImage())) {
            return [MovingScannerPoiManager.SelectedType, element];
        }
        else if (element.src.includes(this.getAlarmImage())) {
            return [MovingScannerPoiManager.AlarmType, element];
        }
        else if (element.src.includes(this.getAlarmHoverImage())) {
            return [MovingScannerPoiManager.AlarmHoverType, element];
        }
        else if (element.src.includes(this.getAlarmSelectedImage())) {
            return [MovingScannerPoiManager.AlarmSelectedType, element];
        }

        return [MovingScannerPoiManager.NoneType, null];
    }

    setHover(label, isHover) {
        const [currentImageType, element] = this.getImageType(label);

        if (isHover) {
            if (currentImageType === MovingScannerPoiManager.NormalType) {
                this.setChangeImageUrl(element, this.getNormalHoverImage());
            }
            else if (currentImageType === MovingScannerPoiManager.AlarmType) {
                this.setChangeImageUrl(element, this.getAlarmHoverImage());
            }
        }
        else {
            if (currentImageType === MovingScannerPoiManager.NormalHoverType) {
                this.setChangeImageUrl(element, this.getNormalImage());
            }
            else if (currentImageType === MovingScannerPoiManager.AlarmHoverType) {
                this.setChangeImageUrl(element, this.getAlarmImage());
            }
        }
    }

    getImageUrl(imageType) {
        if (imageType === MovingScannerPoiManager.NormalType) {
            return [this.getNormalImage(), 1.0];
        }
        else if (imageType === MovingScannerPoiManager.NormalHoverType) {
            return [this.getNormalHoverImage(), 1.0];
        }
        else if (imageType === MovingScannerPoiManager.SelectedType) {
            return [this.getSelectedImage(), PoiManager.SelectedPoiScale];
        }
        else if (imageType === MovingScannerPoiManager.AlarmType) {
            return [this.getAlarmImage(), 1.0];
        }
        else if (imageType === MovingScannerPoiManager.AlarmHoverType) {
            return [this.getAlarmHoverImage(), 1.0];
        }
        else if (imageType === MovingScannerPoiManager.AlarmSelectedType) {
            return [this.getAlarmSelectedImage(), PoiManager.SelectedPoiScale];
        }

        return ["", 1.0];
    }

    hitTest(event) {
        const layer = this.textPoiManager?.movingScannerLayer;

        if (layer) {
            const x = event.clientX;
            const y = event.clientY;
            const childCount = layer.children.length;

            for (let i = 0; i < childCount; i++) {
                const label = layer.children[i];

                if (!label.element) {
                    continue;
                }

                const rect = label.element.getBoundingClientRect();

                if (rect.width <= 0 || rect.height <= 0) {
                    continue;
                }

                if (x >= rect.left && x <= rect.right &&
                    y >= rect.top && y <= rect.bottom) {
                    return label;
                }
            }
        }

        return null;
    }

    hoverLabel(label) {
        if (label === this._hoverLabel) {
            return;
        }

        if (label) {
            if (this._hoverLabel) {
                this.setHover(this._hoverLabel, false);
            }

            this.setHover(label, true);
        }
        else {
            if (this._hoverLabel) {
                this.setHover(this._hoverLabel, false);
            }
        }

        this._hoverLabel = label;
    }

    setAlarmLabel(sensorNo, isAlarm) {
        const layer = this.textPoiManager?.movingScannerLayer;

        if (layer) {
            for (const label of layer.children) {
                if (label.userData.sensorNo === sensorNo) {
                    const [currentImageType, element] = this.getImageType(label);

                    if (isAlarm) {
                        if (currentImageType === MovingScannerPoiManager.NormalType) {
                            this.setChangeImageUrl(element, this.getAlarmImage());
                        }
                        else if (currentImageType === MovingScannerPoiManager.NormalHoverType) {
                            this.setChangeImageUrl(element, this.getAlarmHoverImage());
                        }
                        else if (currentImageType === MovingScannerPoiManager.SelectedType) {
                            this.setChangeImageUrl(element, this.getAlarmSelectedImage());
                        }
                    }
                    else {
                        if (currentImageType === MovingScannerPoiManager.AlarmType) {
                            this.setChangeImageUrl(element, this.getNormalImage());
                        }
                        else if (currentImageType === MovingScannerPoiManager.AlarmHoverType) {
                            this.setChangeImageUrl(element, this.getNormalHoverImage());
                        }
                        else if (currentImageType === MovingScannerPoiManager.AlarmSelectedType) {
                            this.setChangeImageUrl(element, this.getSelectedImage());
                        }
                    }

                    break;
                }
            }
        }
    }

    static removeElement(obj) {
        if (obj?.children) {
            const childCount = obj.children.length;

            for (let i = childCount - 1; i >= 0; i--) {
                const child = obj.children[i];

                if (child.element?.parentNode) {
                    child.element.parentNode.removeChild(child.element);
                }

                obj.remove(child);
            }
        }

        if (obj.element?.parentNode) {
            obj.element.parentNode.removeChild(obj.element);
        }
    }

    // 이동식 스캐너 poi를 감싸고 있는 원을 끄고 켠다.
    static setVisible(layer, visible) {
        if (layer?.children) {
            for (const child of layer.children) {
                if (child.userData.circle) {
                    if (visible && child.visible === false) {
                        continue;
                    }

                    child.userData.circle.circle.visible = visible;
                    child.userData.circle.group.visible = visible;
                }

                for (const poi of child.children) {
                    if (poi.userData.circle) {
                        if (visible === false || (visible === true && poi.visible === true)) {
                            poi.userData.circle.circle.visible = visible;
                            poi.userData.circle.group.visible = visible;
                        }
                    }
                }
            }
        }
    }
}
