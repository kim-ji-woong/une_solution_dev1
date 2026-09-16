export class AnimationModel {
    constructor(mixer, model) {
        this.mixer = mixer;
        this.model = model;

        // 모델 파일별 Animation
        // Key : ModelFile Name
        // Value : AnimationModel
        this.modelAnimations = {};
        this.currentAnimationModels = [];
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