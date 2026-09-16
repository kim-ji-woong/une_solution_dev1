import * as THREE from "three/build/three.module.js";
import { IOptionType } from "./optionType.js";

export class FloorMaterialManager extends IOptionType {
    /*public*/
    constructor(options, scene, optionManager) {
        super();

        this.optionManager = optionManager;
        this.option = options?.three?.floorMaterial;
        this.scene = scene;

        if (this.option) {
            this.clearanceOutdoor = this.option.clearanceOutdoor;
            this.clearanceIndoor = this.option.clearanceIndoor;
            this.indoorFloorMesh = this.setFloorMaterial(this.option.bump, this.option.diffuse, this.option.roughness, this.option.indoorRepeatCount, this.option.indoorWidth, this.option.indoorHeight);
            this.outdoorFloorMesh = this.setFloorMaterial(this.option.bump, this.option.diffuse, this.option.roughness, this.option.outdoorRepeatCount, this.option.outdoorWidth, this.option.outdoorHeight);
        }
    }

    /*private*/
    setFloorMaterial(bump, diffuse, roughness, repeatCount, width, height) {
        const floorMat = new THREE.MeshStandardMaterial({
            roughness: 1.0,
            //roughness: 0.8,
            color: 0xffffff,
            metalness: 0.0,
            //metalness: 0.2,
            bumpScale: 0.0005
        });

        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(diffuse, function (map) {
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4;
            map.repeat.set(repeatCount, repeatCount);
            //map.repeat.set(10, 24);
            map.encoding = THREE.sRGBEncoding;
            floorMat.map = map;
            floorMat.needsUpdate = true;

        });

        textureLoader.load(bump, function (map) {
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4;
            map.repeat.set(repeatCount, repeatCount);
            //map.repeat.set(10, 24);
            floorMat.bumpMap = map;
            floorMat.needsUpdate = true;

        });

        textureLoader.load(roughness, function (map) {
            map.wrapS = THREE.RepeatWrapping;
            map.wrapT = THREE.RepeatWrapping;
            map.anisotropy = 4;
            map.repeat.set(repeatCount, repeatCount);
            //map.repeat.set(10, 24);
            floorMat.roughnessMap = map;
            floorMat.needsUpdate = true;
        });

        const floorGeometry = new THREE.PlaneGeometry(width, height);
        const floorMesh = new THREE.Mesh(floorGeometry, floorMat);
        floorMesh.receiveShadow = true;
        floorMesh.rotation.x = - Math.PI / 2.0;
        floorMesh.position.y = -8;
        this.scene.add(floorMesh);

        return floorMesh;
    }

    onPrevChangeView = (zoneID, isOutdoor, modelName) => {
        // 외부모델은 실내보다 바닥이 높기 때문에 View 이동이 끝난후 처리하도록 한다.
        if (isOutdoor) {
            const worldBox = this.optionManager.getModelSize(modelName);

            if (this.outdoorFloorMesh) {
                if (worldBox) {
                    this.outdoorFloorMesh.position.y = worldBox.min.y - this.clearanceOutdoor;
                }

                this.outdoorFloorMesh.visible = true;
            }

            if (this.indoorFloorMesh)
                this.indoorFloorMesh.visible = false;
        }
    }

    onPostChangeView = (zoneID, isOutdoor, modelName) => {
        // 실내모델은 외부보다 바닥이 낮기 때문에 View 이동이 시작하기전 처리하도록 한다.
        if (!isOutdoor) {
            const worldBox = this.optionManager.getModelSize(modelName);

            if (this.outdoorFloorMesh)
                this.outdoorFloorMesh.visible = false;

            if (this.indoorFloorMesh) {
                if (worldBox) {
                    this.indoorFloorMesh.position.y = worldBox.min.y - this.clearanceIndoor;
                }

                this.indoorFloorMesh.visible = true;
            }
        }
    }

    onLoadingComplete = (zoneID, isOutdoor, modelName) => {
        if (modelName && modelName.length > 0) {
            const worldBox = this.optionManager.getModelSize(modelName);

            if (worldBox) {
                if (isOutdoor && this.outdoorFloorMesh) {
                    this.outdoorFloorMesh.position.y = worldBox.min.y - this.clearanceOutdoor;
                    this.indoorFloorMesh.visible = false;
                }
                else if (!isOutdoor && this.indoorFloorMesh) {
                    this.indoorFloorMesh.position.y = worldBox.min.y - this.clearanceIndoor;
                    this.outdoorFloorMesh.visible = false;
                }
            }
        }
    }
}