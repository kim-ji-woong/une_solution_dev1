import * as THREE from "three/build/three.module.js";
import ProjectResource from "../../../../Root/resource/id";
import SDMSMainMenu from "../../sdmsMainMenu";
import { WorkerManager } from "./workerManager";

export class WorkerManagerNormal extends WorkerManager {
    constructor() {
        super();
        this.typeName = "normal";
    }

    addText(tag/*: string*/, text/*: string*/, zoneID/*: number*/, id/*: number*/, x/*: number*/, y/*: number*/, z/*: number*/, fontSize/*: number*/, backgroundColor/*: rgbaColor*/, borderColor/*: rgbaColor*/, textColor/*: rgbaColor*/, borderThickness/*: number*/, textPOIManager, textLayer, workerCount, visitorCount)/*: THREE.Sprite | null*/ {
        return WorkerManagerNormal._addText(tag, text, zoneID, id, x, y, z, fontSize, backgroundColor, borderColor, textColor, borderThickness, textPOIManager, textLayer, workerCount, visitorCount);
    }

    static _addText(tag, text, zoneID, id, x, y, z, fontSize, backgroundColor, borderColor, textColor, borderThickness, textPOIManager, textLayer, workerCount, visitorCount) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context === null) {
            return null;
        }

        const fontFace = 'malgun gothic';
        //const fontFace = 'Arial';

        context.font = fontSize + "px " + fontFace;
        //context.font = "Bold " + fontSize + "px " + fontFace;
        context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
        // border color
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
        context.lineWidth = borderThickness;

        const metrics = text;
        const width = metrics.width + 10;

        let w = width + borderThickness;
        const originWidth = w;

        if (tag === SDMSMainMenu.BuildingGroupNameText) {
            if (text.length === 2) {
                if (!textPOIManager._2TextWidth) {
                    textPOIManager._2TextWidth = w + 10;
                }

                w = textPOIManager._2TextWidth;
            }
            else if (text.length < 2) {
                w = textPOIManager._2TextWidth;
            }
        }

        const h = fontSize * 1.4 + borderThickness;
        const rectX = (canvas.width - w - borderThickness) / 2;
        const rectY = (canvas.height - h - borderThickness) / 2;

        textPOIManager.roundRect(context, rectX, rectY, w, h, 6);
        //Contents3D.roundRect(context, borderThickness / 2, borderThickness / 2, width + borderThickness, fontSize * 1.4 + borderThickness, 6);

        // text color
        context.fillStyle = "rgba(" + textColor.r + "," + textColor.g + "," + textColor.b + "," + textColor.a + ")";
        //context.fillStyle = "rgba(0, 0, 0, 1.0)";

        //const textY = rectY + borderThickness;
        // metrics.width보다 10만큼 크게 잡았으니 5만큼 띄워서 시작한다.
        context.fillText(text, rectX + 5 + (w - originWidth) / 2, rectY + fontSize);
        //context.fillText(text, borderThickness + 5, fontSize + borderThickness);

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

    static getOriginTextWidth(text, context, borderThickness, tag, textPOIManager) {
        const metrics = context.measureText(text);
        const width = metrics.width + 10;

        let w = width + borderThickness;

        if (tag === SDMSMainMenu.BuildingGroupNameText) {
            if (text.length === 2) {
                if (!textPOIManager._2TextWidth) {
                    textPOIManager._2TextWidth = w + 10;
                }

                w = textPOIManager._2TextWidth;
            }
            else if (text.length < 2) {
                w = textPOIManager._2TextWidth;
            }
        }

        return w;
    }
}
