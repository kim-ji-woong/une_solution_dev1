import * as THREE from "three/build/three.module.js";
import SDMSMainMenu from "../../sdmsMainMenu";
import { WorkerManager } from "./workerManager";
import { WorkerManagerNormal } from "./workerManagerNormal";
import ProjectResource from "../../../../Root/resource/id";

export class WorkerManagerVisitor extends WorkerManager {
    constructor() {
        super();

        this.typeName = "visitor";
        this.activeImage = null;
        this.passiveImage = null
        this.buildingGroupVisitorCount = {};
        this.buildingVisitorCount = {};
    }

    setVisitorImage(image, isActive) {
        if (isActive) {
            this.activeImage = image;
        }
        else {
            this.passiveImage = image;
        }
    }

    addText(tag/*: string*/, text/*: string*/, zoneID/*: number*/, id/*: number*/, x/*: number*/, y/*: number*/, z/*: number*/, fontSize/*: number*/, backgroundColor/*: rgbaColor*/, borderColor/*: rgbaColor*/, textColor/*: rgbaColor*/, borderThickness/*: number*/, textPOIManager, textLayer, workerCount, visitorCount)/*: THREE.Sprite | null*/ {
        if (visitorCount !== 0 && !visitorCount) {
            if (tag === SDMSMainMenu.BuildingGroupNameText) {
                this.buildingGroupVisitorCount[id] = visitorCount;
            }
            else if (tag === SDMSMainMenu.BuildingNameText) {
                this.buildingVisitorCount[id] = visitorCount;
            }

            return WorkerManagerNormal._addText(tag, text, zoneID, id, x, y, z, fontSize, backgroundColor, borderColor, textColor, borderThickness, textPOIManager, textLayer);
        }

        return WorkerManagerVisitor._addText(tag, text, zoneID, id, x, y, z, fontSize, backgroundColor, borderColor, textColor, borderThickness, textPOIManager, textLayer, workerCount, visitorCount, this.activeImage, this.passiveImage, this.buildingGroupVisitorCount, this.buildingVisitorCount);
    }

    static _addText(tag, text, zoneID, id, x, y, z, fontSize, backgroundColor, borderColor, textColor, borderThickness, textPOIManager, textLayer, workerCount, visitorCount, activeImage, passiveImage, buildingGroupVisitorCount, buildingVisitorCount) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context === null) {
            return null;
        }

        const originText = text;
        const textLength = text.length;
        let text2 = '';

        let xRatio = 0;
        let yRatio = 0.7;
        let iconDown = 5;

        canvas.width = 270;

        if (tag === SDMSMainMenu.BuildingGroupNameText) {
            if (buildingGroupVisitorCount) {
                buildingGroupVisitorCount[id] = visitorCount;
            }

            text2 = text + "     " + visitorCount;

            canvas.width = 0;

            for (let i = 0; i < text2.length; i++) {
                canvas.width += 25;
            }
        }
        else if (tag === SDMSMainMenu.BuildingNameText) {

            yRatio = 0.9;
            iconDown = 2;

            if (buildingVisitorCount) {
                buildingVisitorCount[id] = visitorCount;
            }

            text2 = text + "     " + visitorCount;
        }

        const fontFace = 'malgun gothic';
        //const fontFace = 'Arial';

        context.font = fontSize + "px " + fontFace;
        //context.font = "Bold " + fontSize + "px " + fontFace;
        context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
        // border color
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
        context.lineWidth = borderThickness;

        const metrics = context.measureText(text2);
        const width = metrics.width + 10;

        let w = width + borderThickness;
        const originWidth = w;

        //if (tag === SDMSMainMenu.BuildingGroupNameText) {
        //    if (text.length === 2) {
        //        if (!textPOIManager._2TextWidth) {
        //            textPOIManager._2TextWidth = w + 10;
        //        }

        //        w = textPOIManager._2TextWidth;
        //    }
        //    else if (text.length < 2) {
        //        w = textPOIManager._2TextWidth;
        //    }
        //}

        const h = fontSize * 1.4 + borderThickness;
        //const rectX = 31.5;
        const rectX = (canvas.width - w - borderThickness) / 2;
        const rectY = (canvas.height - h - borderThickness) / 2;

        // 작업자 수 표기를 위한 영역이 추가된만큼 margin 너비를 더해준다.
        const margin = 0;
        //const margin = tag === SDMSMainMenu.BuildingGroupNameText ? w - WorkerManagerNormal.getOriginTextWidth(originText, context, borderThickness, tag, textPOIManager) : 0;

        textPOIManager.roundRect(context, rectX, rectY, w + margin, h, 6);
        //Contents3D.roundRect(context, borderThickness / 2, borderThickness / 2, width + borderThickness, fontSize * 1.4 + borderThickness, 6);

        // text color
        context.fillStyle = "rgba(" + textColor.r + "," + textColor.g + "," + textColor.b + "," + textColor.a + ")";
        //context.fillStyle = "rgba(0, 0, 0, 1.0)";

        //const textY = rectY + borderThickness;
        // metrics.width보다 10만큼 크게 잡았으니 5만큼 띄워서 시작한다.
        context.fillText(text2, rectX + 5 + (w - originWidth) / 2, rectY + fontSize);
        //context.fillText(text, borderThickness + 5, fontSize + borderThickness);

        const imageSize = fontSize * 0.9;//rectX < rectY && rectX > 0 ? rectX : rectY;
        /*const image = document.getElementById("spriteIcon");
        context.drawImage(image, rectX + 5 + (w - originWidth) / 2 + originWidth * xRatio, (rectY + fontSize) * yRatio, imageSize * 0.8, imageSize * 0.8);*/

        // 센서 이름 Width
        const nameMatrics = context.measureText(text);
        const nameWidth = nameMatrics.width;

        // 첫번째 공백 Width
        const blank1 = "    ";
        const blank1Matrics = context.measureText(blank1);
        const blank1Width = blank1Matrics.width;

        // WorkerCount Width
        const visitorCountText = context.toString();
        const visitorCountTextMatrics = context.measureText(visitorCountText);
        const visitorCountWidth = visitorCountTextMatrics.width;


        //if (visitorCount > 0 && activeImage) {
        //    context.drawImage(activeImage, rectX + 5 + (w - originWidth) / 2 + originWidth * xRatio/* + margin*/ - 5, (rectY + fontSize) * yRatio - iconDown, imageSize * 1.0, imageSize * 1.0);
        //}
        //else if (visitorCount === 0 && passiveImage) {
        //    context.drawImage(passiveImage, rectX + 5 + (w - originWidth) / 2 + originWidth * xRatio/* + margin*/ - 5, (rectY + fontSize) * yRatio - iconDown, imageSize * 1.0, imageSize * 1.0);
        //}

        if (visitorCount > 0 && activeImage) {
            context.drawImage(activeImage, rectX + 5 + nameWidth + blank1Width - imageSize * 0.7 /* + margin*/, (rectY + fontSize) * yRatio - iconDown, imageSize * 1.0, imageSize * 1.0);
        }
        else if (visitorCount === 0 && passiveImage) {
            context.drawImage(passiveImage, rectX + 5 + nameWidth + blank1Width - imageSize * 0.7 /* + margin*/, (rectY + fontSize) * yRatio - iconDown, imageSize * 1.0, imageSize * 1.0);
        }

        // canvas contents will be used for a texture
        const texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        // const spriteAlignment = THREE.SpriteAlignment.topLeft;

        const spriteMaterial = new THREE.SpriteMaterial(
            { map: texture/*, useScreenCoordinates: false, alignment: spriteAlignment*/ });
        const sprite = new THREE.Sprite(spriteMaterial);
        if (ProjectResource.siteID === ProjectResource.Site.Hydrogen) {
            sprite.scale.set(16, 8, 1.0);
        }
        else {
            sprite.scale.set(100, 50, 1.0);
        }

        //sprite.material.depthWrite = false;
        //sprite.material.depthTest = false;
        sprite.position.x = x;
        sprite.position.y = y;
        sprite.position.z = z;
        sprite.name = tag + "_" + zoneID + "_" + id;
        //sprite.name = "text_" + id + "_" + text;

        sprite.userData.boundingBox = {
            tl: {
                x: x - rectX / 80,
                z: z - rectY / 80
            },
            br: {
                x: x + rectX / 80,
                z: z + rectY / 80
            }
        };

        sprite.userData.uvArea = {
            top: 0.5 + (h / sprite.scale.x) / 2,
            bottom: 0.5 - (h / sprite.scale.x) / 2,
            left: 0.5 - rectX / rectY * (h / sprite.scale.x) / 2,
            right: 0.5 + rectX / rectY * (h / sprite.scale.x) / 2
        };

        sprite.userData.text = text;

        if (textLayer !== null) {
            textLayer.add(sprite);
        }

        return sprite;
    }

    checkVisitorCount(buildingGroupID, visitorCount) {
        const prevCount = this.buildingGroupVisitorCount[buildingGroupID];
        return prevCount === visitorCount;
    }

    checkBuildingVisitorCount(buildingID, visitorCount) {
        const prevCount = this.buildingVisitorCount[buildingID];
        return prevCount === visitorCount;
    }
}
