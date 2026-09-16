import ProjectResource from "../../../../Root/resource/id";
import { FloorMaterialManager } from "./floorMaterialManager";

export class OptionManager {
    constructor(scene, contents3D) {
        this.m_optionTypes = [];
        this.m_modelSizes = {};

        const userInfo = ProjectResource.getUserInfo();

        if (userInfo) {
            this.m_optionTypes.push(new FloorMaterialManager(userInfo.options, scene, this));
            this.m_optionTypes.push(contents3D.poiManager);

            if (contents3D) {
                if (contents3D.textPOIManager) {
                    contents3D.textPOIManager.setSmoothVisible(userInfo.options);
                }

                if (contents3D.poiManager) {
                    contents3D.poiManager.setSmoothVisible(userInfo.options);
                }
            }
        }
    }

    setModelSize(modelName, worldBox) {
        this.m_modelSizes[modelName] = worldBox;
    }

    getModelSize(modelName) {
        return this.m_modelSizes[modelName];
    }

    onPrevChangeView = (zoneID, isOutdoor, modelName) => {
        for (const optionType of this.m_optionTypes) {
            if (optionType.onPrevChangeView) {
                optionType.onPrevChangeView(zoneID, isOutdoor, modelName);
            }
        }
    }

    onPostChangeView = (zoneID, isOutdoor, modelName) => {
        for (const optionType of this.m_optionTypes) {
            if (optionType.onPostChangeView) {
                optionType.onPostChangeView(zoneID, isOutdoor, modelName);
            }
        }
    }

    onLoadingComplete = (zoneID, isOutdoor, modelName) => {
        for (const optionType of this.m_optionTypes) {
            if (optionType.onLoadingComplete) {
                optionType.onLoadingComplete(zoneID, isOutdoor, modelName);
            }
        }
    }

    onPrevMouseMove = (event) => {
        for (const optionType of this.m_optionTypes) {
            if (optionType.onPrevMouseMove) {
                optionType.onPrevMouseMove(event);
            }
        }
    }

    onPostMouseMove = (event) => {
        for (const optionType of this.m_optionTypes) {
            if (optionType.onPostMouseMove) {
                optionType.onPostMouseMove(event);
            }
        }
    }

    onPrevClick = (event) => {
        for (const optionType of this.m_optionTypes) {
            if (optionType.onPrevClick) {
                optionType.onPrevClick(event);
            }
        }
    }

    onPostClick = (event) => {
        for (const optionType of this.m_optionTypes) {
            if (optionType.onPostClick) {
                optionType.onPostClick(event);
            }
        }
    }
}