import * as THREE from 'three';

export class DoorPointManager {
    constructor(contents3D) {
        this.contents3D = contents3D;
    }

    getNumbers(doorPoint) {
        const numbers = [];

        for (const number of doorPoint.numbers) {
            if (number.color === null) {
                numbers.push(<li><span>{number.no}</span></li>);
            }
            else {
                numbers.push(<li className={number.color}><span>{number.no}</span></li>);
            }
        }

        return numbers;
    }

    getPoiWorldSize(poi, camera) {
        // 카메라 기준 방향 벡터
        const camRight = new THREE.Vector3();
        const camUp = new THREE.Vector3();
        const camForward = new THREE.Vector3();

        camera.matrixWorld.extractBasis(camRight, camUp, camForward);

        // Sprite scale은 이미 world unit
        const halfWidth = poi.scale.x * 0.5;
        const halfHeight = poi.scale.y * 0.5;

        const worldRight = camRight.clone().multiplyScalar(halfWidth);
        const worldUp = camUp.clone().multiplyScalar(halfHeight);

        const widthWorld = worldRight.length() * 2;
        const heightWorld = worldUp.length() * 2;

        // 보정값
        const adjust = 0.459;

        return [widthWorld - adjust, heightWorld - adjust];
    }

    getPoiScreenSize(poi, camera, canvas) {
        const vCenter = new THREE.Vector3();
        poi.getWorldPosition(vCenter);

        const [width, height] = this.getPoiWorldSize(poi, camera);

        const _right = new THREE.Vector3();
        const up = new THREE.Vector3();
        const forward = new THREE.Vector3();

        camera.matrixWorld.extractBasis(_right, up, forward);

        const vTop = new THREE.Vector3(vCenter.x + up.x * height / 2, vCenter.y + up.y * height / 2, vCenter.z + up.z * height / 2);
        const vRight = new THREE.Vector3(vCenter.x + _right.x * width / 2, vCenter.y + _right.y * width / 2, vCenter.z + _right.z * width / 2);
        const vTR = new THREE.Vector3(vRight.x - vCenter.x + vTop.x, vRight.y - vCenter.y + vTop.y, vRight.z - vCenter.z + vTop.z);

        // NDC 좌표로 변환
        vTR.project(camera);
        
        // 카메라 기준 방향
        const camRight = new THREE.Vector3();
        const camUp = new THREE.Vector3();

        camera.matrixWorld.extractBasis(camRight, camUp, new THREE.Vector3());

        // scale 반영 (월드 단위)
        const halfWidth = poi.scale.x * 0.5;
        const halfHeight = poi.scale.y * 0.5;

        const right = vCenter.clone().add(camRight.multiplyScalar(halfWidth));
        const left = vCenter.clone().add(camRight.multiplyScalar(-halfWidth));
        const top = vCenter.clone().add(camUp.multiplyScalar(halfHeight));
        const bottom = vCenter.clone().add(camUp.multiplyScalar(-halfHeight));

        right.project(camera);
        left.project(camera);
        top.project(camera);
        bottom.project(camera);

        const widthPx = parseInt(Math.abs(right.x - left.x) * 0.5 * canvas.clientWidth);
        const heightPx = parseInt(Math.abs(top.y - bottom.y) * 0.5 * canvas.clientHeight);
        return { width: widthPx, height: heightPx, target: vTR };
    }

    getDoorPointPosition(poi) {
        const camera = this.contents3D._3dMaster.camera;
        const canvas = this.contents3D._3dMaster.renderer.domElement;
        const poiSize = this.getPoiScreenSize(poi, camera, canvas);

        // NDC => 화면 픽셀 좌표
        const x = (poiSize.target.x * 0.5 + 0.5) * canvas.clientWidth;
        const y = (-poiSize.target.y * 0.5 + 0.5) * canvas.clientHeight;

        // 이미지의 높이는 이미지의 너비와 같다.
        const scale = poiSize.width * 0.8 / 31;
        
        return [parseInt(x), parseInt(y), scale];
    }

    getDoorPointList() {
        const items = [];

        if (this.contents3D.state.visibleDoorPoint && this.contents3D.props.isEditMode === false) {
            const doorPointList = [...this.contents3D.state.doorPointList];
            const count = doorPointList.length;

            for (let i = 0; i < count; i++) {
                const doorPoint = doorPointList[i];

                if (!doorPoint.poi) {
                    continue;
                }

                const [x, y, scale] = this.getDoorPointPosition(doorPoint.poi);

                items.push(
                    <ul
                        key={"doorPoint_" + i}
                        className='doorList'
                        style={{
                            position: 'absolute',
                            top: y,
                            left: x,
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left'
                        }}
                    >
                        {
                            this.getNumbers(doorPoint)
                        }
                    </ul>
                )
            }
        }

        if (items.length === 0) {
            return <></>
        }

        return items;
    }

    isSamePointList(doorPointList) {
        const currentList = [...this.contents3D.state.doorPointList];

        const len1 = currentList.length;
        const len2 = doorPointList.length;

        if (len1 === len2) {
            for (let i = 0; i < len1; i++) {
                const poi1 = currentList[i].poi;
                const poi2 = doorPointList[i].poi;

                if (poi1 !== poi2) {
                    return false;
                }

                const numbers1 = currentList[i].numbers;
                const numbers2 = doorPointList[i].numbers;

                if (!numbers1 && !numbers2) {
                    continue;
                }
                else if (!numbers1 || !numbers2) {
                    return false;
                }

                const count1 = numbers1.length;
                const count2 = numbers2.length;

                if (count1 !== count2) {
                    return false;
                }

                for (let j = 0; j < count1; j++) {
                    const number1 = numbers1[j];
                    const number2 = numbers2[j];

                    if (number1.color !== number2.color ||
                        number1.no !== number2.no) {
                        return false;
                    }
                }
            }

            return true;
        }

        return false;
    }

    getDoorPointFloorCountPosition(poi) {
        const camera = this.contents3D._3dMaster.camera;
        const canvas = this.contents3D._3dMaster.renderer.domElement;
        const poiSize = this.getPoiScreenSize(poi, camera, canvas);

        // NDC => 화면 픽셀 좌표
        const x = (poiSize.target.x * 0.5 + 0.5) * canvas.clientWidth;
        const y = (-poiSize.target.y * 0.5 + 0.5) * canvas.clientHeight;

        const scale = poiSize.height * 1 / 28;
        return [parseInt(x), parseInt(y), scale];
    }

    getDoorPointFloorCount() {
        const doorPointFloorCount = this.contents3D.state.doorPointFloorCount;

        if (!doorPointFloorCount || this.contents3D.props.isEditMode) {
            return <></>
        }

        const floorCount = doorPointFloorCount.floorCount;
        const poi = doorPointFloorCount.poi;

        if (this.contents3D.state.visibleDoorPoint && floorCount > 0 && poi) {
            const count = floorCount < 10 ? "0" + floorCount : floorCount.toString();
            const text = count + "개 층 경유";
            const [x, y, scale] = this.getDoorPointFloorCountPosition(poi);

            return (
                <div
                    className='elevator'
                    style={{
                        position: 'absolute',
                        top: y,
                        left: x,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left'
                    }}
                >
                    <span>{text}</span>
                </div>
                );
        }

        return <></>
    }
}
