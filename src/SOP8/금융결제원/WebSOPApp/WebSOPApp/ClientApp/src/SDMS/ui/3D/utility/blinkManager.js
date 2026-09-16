export class BlinkManager {
    constructor() {
        this.blinkDatas = [];
    }

    // interval : 초
    addBlink(modelNode, interval, wait) {
        modelNode.visible = false;

        const blink = {
            model: modelNode,
            interval: interval,
            wait: wait,
            delta: 0,
            visible: modelNode.visible
        };

        this.blinkDatas.push(blink);
    }

    removeBlink(modelNode, visible) {
        const blinkCount = this.blinkDatas.length;

        for (let i = 0; i < blinkCount; i++) {
            const blink = this.blinkDatas[i];

            if (blink.model === modelNode) {
                this.blinkDatas.splice(i, 1);
                break;
            }
        }

        modelNode.visible = visible;
    }

    clearBlink(visible) {
        const blinkCount = this.blinkDatas.length;

        for (let i = 0; i < blinkCount; i++) {
            const blink = this.blinkDatas[i];
            blink.model.visible = visible;
        }

        this.blinkDatas = [];
    }

    blink(delta) {
        const blinkDatas = [...this.blinkDatas];
        const blinkCount = blinkDatas.length;

        for (let i = 0; i < blinkCount; i++) {
            const blinkData = blinkDatas[i];
            const visible = blinkData.visible;
            const _delta = blinkData.delta + delta;
            const targetTime = visible ? blinkData.interval : blinkData.wait;

            if (_delta >= targetTime) {
                blinkData.model.visible = !visible;
                blinkData.visible = !visible;
                blinkData.delta = _delta - targetTime;
            }
            else {
                blinkData.delta = _delta;
            }
        }
    }
}