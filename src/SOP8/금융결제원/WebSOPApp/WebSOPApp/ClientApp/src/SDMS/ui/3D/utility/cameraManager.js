import Geometry from "../../../../Common/util/Geometry";

export class CameraManager {
    constructor() {
        this.movingData = null;
    }

    // interval : seconds
    ready(postMethod, postParam, currentCamera, controls, nextCamera, interval) {
        const beginData = {
            position: { ...currentCamera.position },
            rotation: {
                x: currentCamera.rotation.x,
                y: currentCamera.rotation.y,
                z: currentCamera.rotation.z
            }
        };

        const endData = {
            position: {
                x: nextCamera.position[0],
                y: nextCamera.position[1],
                z: nextCamera.position[2]
            },
            rotation: {
                x: nextCamera.rotation[0],
                y: nextCamera.rotation[1],
                z: nextCamera.rotation[2]
            }
        };

        const distance1 = Geometry.getDistance3(beginData.position.x, beginData.position.y, beginData.position.z, endData.position.x, endData.position.y, endData.position.z);
        const distance2 = Geometry.getDistance3(beginData.rotation.x, beginData.rotation.y, beginData.rotation.z, endData.rotation.x, endData.rotation.y, endData.rotation.z);

        const moving = {
            postMethod,
            postParam,
            camera: currentCamera,
            controls,
            orbit: nextCamera.targetControl ? nextCamera.targetControl : nextCamera.orbit,
            models: [beginData, endData, distance1, distance2],
            interval: interval,
            zoom: nextCamera.zoom,
            delta: 0
        };

        this.movingData = moving;
    }

    stop() {
        this.movingData = null;
    }

    run(delta) {
        const movingData = this.movingData;

        if (movingData?.camera) {
            const elapsed = movingData.delta + delta;

            const isComplete = this.moveObject(elapsed, movingData.interval, movingData.camera, movingData.models, movingData.postMethod, movingData.postParam);
            movingData.delta = elapsed;

            if (isComplete) {
                if (movingData.orbit) {
                    movingData.controls.target.set(movingData.orbit[0], movingData.orbit[1], movingData.orbit[2]);
                }

                this.stop();

                if (movingData.zoom) {
                    movingData.camera.zoom = movingData.zoom;
                    movingData.camera.up.set(0, 1, 0);
                    movingData.camera.updateProjectionMatrix();
                }
            }
        }
    }

    moveObject(delta, interval, camera, models, postMethod, postParam) {
        if (interval <= 0) {
            if (postMethod) {
                this.runMethod(postMethod, postParam);
                /*if (postParam !== null && postParam !== undefined) {
                    postMethod(postParam);
                }
                else {
                    postMethod();
                }*/
            }

            return true;
        }

        const modelData = models;
        const begin = modelData[0];
        const end = modelData[1];
        const distancePosition = modelData[2];
        const distanceRotation = modelData[3];

        const pos = this.move(delta, interval, begin.position, end.position, distancePosition)
        const rot = this.move(delta, interval, begin.rotation, end.rotation, distanceRotation)

        camera.position.set(pos[0], pos[1], pos[2]);
        camera.rotation.set(rot[0], rot[1], rot[2]);
        camera.quaternion.setFromEuler(camera.rotation);

        if (delta >= interval) {
            if (postMethod) {
                this.runMethod(postMethod, postParam);
                /*if (postParam !== null && postParam !== undefined) {
                    postMethod(postParam);
                }
                else {
                    postMethod();
                }*/
            }

            return true;
        }

        return false;
    }

    runMethod(methods, parameters) {
        const methodCount = methods.length;
        const parameterCount = parameters.length;

        if (methodCount === parameterCount) {
            for (let i = 0; i < methodCount; i++) {
                const method = methods[i];
                const parameter = parameters[i];

                if (parameter !== null && parameter !== undefined) {
                    method(parameter);
                }
                else {
                    method();
                }
            }
        }
    }

    move(delta, interval, begin, end, distance) {
        if (delta >= interval) {
            return [end.x, end.y, end.z];
        }

        return Geometry.getLinearVertex3(begin.x, begin.y, begin.z, end.x, end.y, end.z, delta / interval * distance);
    }

    getCurrentCameraData(currentModel, spatialManager, isEditMode) {
        const siteNo = currentModel?.currentSiteNo;

        if (siteNo) {
            if (currentModel.currentZoneNo) {
                const zone = spatialManager.getZone(currentModel.currentZoneNo);

                if (zone?.model) {
                    if (isEditMode) {
                        return zone.model.cameraOrtho;
                    }
                    else {
                        return zone.model.camera;
                    }
                }
            }
            else {
                const buildingGroupList = spatialManager.sites[siteNo];

                if (isEditMode) {
                    if (buildingGroupList.model?.cameraOrtho) {
                        return { ...buildingGroupList.model.cameraOrtho };
                    }
                }
                else {
                    if (buildingGroupList.model?.camera) {
                        return { ...buildingGroupList.model.camera };
                    }
                }
            }
        }

        return null;
    }

    getZoomValue(camera, controls, isEditMode) {
        if (camera) {
            if (isEditMode) {
                return camera.zoom;
            }

            return Geometry.getDistance3(camera.position.x, camera.position.y, camera.position.z, controls.target.x, controls.target.y, controls.target.z);
        }

        return null;
    }

    isMoving() {
        return this.movingData;
    }
}