export class AnimationModel {
    constructor(mixer, model) {
        this.mixer = mixer;
        this.model = model;
    }

    animate(delta) {
        if (this.mixer && this.model && this.model.visible) {
            this.mixer.update(delta);
        }
    }

    static animateModels(delta, models) {
        if (models) {
            models.map(model => {
                model.animate(delta);
            });
        }
    }
}
