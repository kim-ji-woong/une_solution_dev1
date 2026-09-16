import * as THREE from "three/build/three.module.js";

export class EditPoiManager {
    constructor(editModeManager) {
        this.editModeManager = editModeManager;

        this.selectedPoi = null;
        this.camera = null;
    }

    selectPoi(poi, camera) {
        if (this.selectedPoi !== null && this.selectedPoi === poi) {
            this.selectedPoi = null;
            this.camera = null;
            this.editModeManager.onMove(poi);
        }
        else {
            this.selectedPoi = poi;
            this.camera = camera;
        }
    }

    move(event) {
        const poi = this.selectedPoi;
        const camera = this.camera;

        if (poi && camera) {
            const [x, z] = this.screenToGlobal(event, camera);
            poi.position.set(x, poi.position.y, z);
        }
    }

    screenToGlobal(event, camera) {
        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        return [raycaster.ray.origin.x, raycaster.ray.origin.z];
    }
}
