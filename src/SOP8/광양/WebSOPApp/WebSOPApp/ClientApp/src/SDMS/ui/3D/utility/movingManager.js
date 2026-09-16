import Geometry from "../../../../Common/util/Geometry";

export class MovingManager {
    constructor() {
        this.movingDatas = [];
    }

    addMoving(movingGroup, movingChildren, interval) {
        movingGroup.visible = true;

        const moving = {
            models: movingChildren,
            interval: interval,
            delta: 0
        };

        this.movingDatas.push(moving);
    }

    clearMoving() {
        this.movingDatas = [];
    }

    runMoving(delta) {
        const movingDatas = [...this.movingDatas];
        const movingCount = movingDatas.length;

        for (let i = 0; i < movingCount; i++) {
            const movingData = movingDatas[i];
            const elapsed = movingData.delta + delta;

            this.moveObject(elapsed, movingData.interval, movingData.models);
            movingData.delta = elapsed;

            while (movingData.delta >= movingData.interval) {
                movingData.delta -= movingData.interval;
            }
        }
    }

    moveObject(delta, interval, models) {
        const modelCount = models.length;
        const halfTime = interval / 2;

        for (let i = 0; i < modelCount; i++) {
            const modelData = models[i];
            const model = modelData[0];
            const begin = modelData[1];
            const end = modelData[2];
            const distance = modelData[3];

            if (delta <= halfTime) {
                const pos = Geometry.getLinearVertex3(begin.x, begin.y, begin.z, end.x, end.y, end.z, delta / halfTime * distance);
                model.position.set(pos[0], pos[1], pos[2]);
            }
            else {
                const pos = Geometry.getLinearVertex3(end.x, end.y, end.z, begin.x, begin.y, begin.z, (delta - halfTime) / halfTime * distance);
                model.position.set(pos[0], pos[1], pos[2]);
            }
        }
    }
}