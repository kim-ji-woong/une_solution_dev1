import * as THREE from "three/build/three.module.js";
import { TextPoiManager } from "../textPoiManager";
import { WorkerManager } from "./workerManager";

export class WorkerManagerNormal extends WorkerManager {
    constructor(spatialManager, buildingGroupTextLayer, buildingTextLayer) {
        super(spatialManager, buildingGroupTextLayer, buildingTextLayer);
        this.typeName = "normal";
    }

    addText(tag/*: string*/, text/*: string*/, zoneNo/*: number*/, no/*: number*/, x/*: number*/, y/*: number*/, z/*: number*/, fontSize/*: number*/, backgroundColor/*: rgbaColor*/, borderColor/*: rgbaColor*/, textColor/*: rgbaColor*/, borderThickness/*: number*/, textPOIManager, textLayer, workerCount, visitorCount)/*: THREE.Sprite | null*/ {
        if (!textLayer) {
            return null;
        }

        return WorkerManagerNormal._addText(tag, text, zoneNo, no, x, y, z, fontSize, backgroundColor, borderColor, textColor, borderThickness, textPOIManager, textLayer, workerCount, visitorCount);
    }

    static _addText(tag, text, zoneNo, no, x, y, z, fontSize, backgroundColor, borderColor, textColor, borderThickness, textPOIManager, textLayer, workerCount, visitorCount) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context === null) {
            return null;
        }

        const fontScale = TextPoiManager.getFontScale(fontSize, text);
        fontSize *= fontScale;

        const fontFace = 'malgun gothic';

        context.font = fontSize + "px " + fontFace;
        context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
        // border color
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
        context.lineWidth = borderThickness;

        const padding = 10;
        const metrics = context.measureText(text);
        let width = metrics.width + padding;

        let w = width + borderThickness;
        const originWidth = w;

        if (tag === TextPoiManager.BuildingGroupNameText) {
            if (text.length === 2) {
                if (!textPOIManager.buildingGroupTextWidth) {
                    textPOIManager.buildingGroupTextWidth = w + padding;
                }

                w = textPOIManager.buildingGroupTextWidth;
            }
            else if (text.length < 2) {
                w = textPOIManager.buildingGroupTextWidth;
            }
        }

        const h = fontSize * 1.4 + borderThickness;
        const rectX = (canvas.width - w - borderThickness) / 2;
        const rectY = (canvas.height - h - borderThickness) / 2;

        textPOIManager.roundRect(context, rectX, rectY, w, h, 6);

        // text color
        context.fillStyle = "rgba(" + textColor.r + "," + textColor.g + "," + textColor.b + "," + textColor.a + ")";

        let startX = rectX + padding / 2 + (w - originWidth) / 2;

        context.fillText(text, startX/*rectX + 5 + (w - originWidth) / 2*/, rectY + fontSize);

        // canvas contents will be used for a texture
        const texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        const spriteMaterial = new THREE.SpriteMaterial(
            { map: texture/*, useScreenCoordinates: false, alignment: spriteAlignment*/ });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(100 / fontScale, 50 / fontScale, 1.0 / fontScale);

        sprite.position.x = x;
        sprite.position.y = y;
        sprite.position.z = z;
        sprite.name = tag + "_" + zoneNo + "_" + no;

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

        if (tag === TextPoiManager.BuildingGroupNameText) {
            if (text.length === 2) {
                if (!textPOIManager.buildingGroupTextWidth) {
                    textPOIManager.buildingGroupTextWidth = w + 10;
                }

                w = textPOIManager.buildingGroupTextWidth;
            }
            else if (text.length < 2) {
                w = textPOIManager.buildingGroupTextWidth;
            }
        }

        return w;
    }
}
