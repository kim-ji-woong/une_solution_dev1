import * as THREE from "three/build/three.module.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Vertex2D from "../../../Common/util/Vertex2D";
import Geometry from "../../../Common/util/Geometry";
import Vertex3D from "../../../Common/util/Vertex3D";
import { SDMSController } from '../../services/sdmsController';
import SessionString from '../../../Common/js/sessionString';
import ProjectResource from '../../../Root/resource/id';

export class WalkingAvatar {
	static BottomElevations = [
		[new Vertex2D(110, -40), 20],
		[new Vertex2D(110, -140), 25],
		[new Vertex2D(110, -240), 30],
		[new Vertex2D(110, 90), 13],
		[new Vertex2D(110, 180), 9],
		[new Vertex2D(-100, -40), 22],
		[new Vertex2D(300, -40), 17],
		[new Vertex2D(300, 105), 10],
		[new Vertex2D(500, 35), 11],
		[new Vertex2D(580, -35), 14],
		[new Vertex2D(680, -165), 19],
		[new Vertex2D(610, -85), 15],
		[new Vertex2D(450, -230), 25],
		[new Vertex2D(-85, 180), 11],
		[new Vertex2D(-85, 90), 15],
		[new Vertex2D(550, -146), 20],
		[new Vertex2D(620, -91), 16],
		[new Vertex2D(387, -325), 33],
		[new Vertex2D(350, -287), 33],
		[new Vertex2D(349, -368), 33]
	];

	static OptionName = 'walkingAvatar';

	constructor() {
		this.idleAction = null;
		this.walkAction = null;
		this.runAction = null;
		this.idleWeight = null;
		this.walkWeight = null;
		this.runWeight = null;
		this.actions = null;
		this.settings = null;

		this.mixer = null;
		this.model = null;
		this.skeleton = null;

		this.singleStepMode = false;
		this.sizeOfNextStep = 0;
		this.camera = null;
		this.cameraDir = new THREE.Vector3(0, 0, -1);
		this.contents3D = null;

		this.distanceRatio = 1.0;
		this.cameraElevation = 0.0;
		// Radian
		this.cameraVerticalAngle = 0.0;
		// Radian
		this.cameraHorizontalAngle = 0.0;
		this.rightRatio = 0.0;
		this.cameraOriginPosition = null;

		this.optionID = -1;

		this.crossFadeControls = [];

		this.rotationY = 0;
	}

	loadModel(file, contents3D, normalType = false, rotationY = null) {
		this.contents3D = contents3D;
		const scene = contents3D.scene;

		const loader = new GLTFLoader();
		const _this = this;

		loader.load(file, function (gltf) {
			_this.model = gltf.scene;
			scene.add(_this.model);

			_this.initModel();

			_this.model.traverse(function (object) {
				if (object.isMesh)
					object.castShadow = true;
			});

			//
			_this.skeleton = new THREE.SkeletonHelper(_this.model);
			_this.skeleton.visible = false;
			scene.add(_this.skeleton);

			//
			_this.createPanel();

			//
			const animations = gltf.animations;

			_this.mixer = new THREE.AnimationMixer(_this.model);

			if (normalType) {
				_this.animationMixer = _this.mixer;
				const actions = [];

				for (let i = 0; i < animations.length; i++) {
					const action = _this.mixer.clipAction(animations[i]);
					action.play();
					actions.push(action);
				}

				_this.actions = actions;
			}
			else {
				_this.idleAction = _this.mixer.clipAction(animations[0]);
				_this.walkAction = _this.mixer.clipAction(animations[3]);
				_this.runAction = _this.mixer.clipAction(animations[1]);

				_this.actions = [_this.idleAction, _this.walkAction, _this.runAction];

				_this.activateAllActions();
			}

			if (rotationY) {
				_this.rotationY = rotationY;
				_this.model.rotation.y = _this.rotationY;
            }

			_this.readWriteOptions();
		});
	}

	async readWriteOptions() {
		await this.readOptions();

		if (this.optionID < 0) {
			this.writeOptions();
		}
    }

	async writeOptions() {
		const property1 = this.makeModelPositionNRotation();
		const property2 = this.makeCameraPositions();
		const property3 = this.makeEtc();
		const property4 = this.makeCameraDirectionNScale();

		// 세션에서 DB의 유저 key값 획득, 전체 팝업 좌표를 호출한다.
		let userInfo = ProjectResource.getUserInfo();
		if (userInfo === null || userInfo === undefined)
			return;

		if (this.optionID < 0) {
			const result = await SDMSController.requestSaveOption(this.optionID, userInfo.id, WalkingAvatar.OptionName, "moving", property1, property2, property3, property4);

			if (typeof result !== 'undefined' && result[0] && result[1] != null) {
				if (result[1].length > 0) {
					const data = result[1][0];
					this.optionID = data.id;
				}
			}
		}
		else {
			SDMSController.requestSaveOption(this.optionID, userInfo.id, WalkingAvatar.OptionName, "moving", property1, property2, property3, property4);
        }
    }

	async readOptions() {
		// 세션에서 DB의 유저 key값 획득, 전체 팝업 좌표를 호출한다.
		let userInfo = ProjectResource.getUserInfo();
		if (userInfo === null || userInfo === undefined)
			return;

		const result = await SDMSController.requestGetOption(userInfo.id, WalkingAvatar.OptionName);

		/*
		 * propertyValue1 - model position, rotation
		 * propertyValue2 - camera position, camera original position
		 * propertyValue3 - distanceRatio, cameraElevation, verticalAngle, horizontalAngle, rightRatio
		 * propertyValue4 - camera direction, model scale
		*/
		if (typeof result !== 'undefined' && result[0] && result[1] != null) {
			if (this.model) {
				for (var i = 0; i < result[1].length; i++) {
					const data = result[1][i];

					this.optionID = data.id;
					this.readModelPositionNRotation(data.propertyValue1);
					this.readCameraPositions(data.propertyValue2);
					this.readEtc(data.propertyValue3);
					this.readCameraDirectionNScale(data.propertyValue4);

					break;
				}
			}
		}
	}

	makeCameraDirectionNScale() {
		const x = this.cameraDir.x.toFixed(2);
		const y = this.cameraDir.y.toFixed(2);
		const z = this.cameraDir.z.toFixed(2);

		const scaleX = this.model.scale.x.toFixed(2);
		const scaleY = this.model.scale.y.toFixed(2);
		const scaleZ = this.model.scale.z.toFixed(2);

		return x + "," + y + "," + z + "," + scaleX + "," + scaleY + "," + scaleZ;
    }

	readCameraDirectionNScale(value) {
		if (value === null || value === undefined) {
			return;
		}

		const datas = value.split(',');

		if (datas.length >= 3) {
			const x = Number(datas[0].trim());
			const y = Number(datas[1].trim());
			const z = Number(datas[2].trim());

			if (isNaN(x) || isNaN(y) || isNaN(z)) {
				return;
			}

			this.cameraDir.set(x, y, z);

			if (datas.length === 6) {
				const scaleX = Number(datas[3].trim());
				const scaleY = Number(datas[4].trim());
				const scaleZ = Number(datas[5].trim());

				if (isNaN(scaleX) || isNaN(scaleY) || isNaN(scaleZ)) {
					return;
				}

				this.model.scale.set(scaleX, scaleY, scaleZ);
            }
		}
	}

	makeEtc() {
		const distanceRatio = this.distanceRatio.toFixed(2);
		const cameraElevation = this.cameraElevation.toFixed(2);
		const cameraVerticalAngle = this.cameraVerticalAngle.toFixed(2);
		const cameraHorizontalAngle = this.cameraHorizontalAngle.toFixed(2);
		const rightRatio = this.rightRatio.toFixed(2);

		return distanceRatio + "," + cameraElevation + "," + cameraVerticalAngle + "," + cameraHorizontalAngle + "," + rightRatio;
    }

	readEtc(value) {
		if (value === null || value === undefined) {
			return;
		}

		const datas = value.split(',');

		if (datas.length === 5) {
			const distanceRatio = Number(datas[0].trim());
			const cameraElevation = Number(datas[1].trim());
			const verticalAngle = Number(datas[2].trim());
			const horizontalAngle = Number(datas[3].trim());
			const rightRatio = Number(datas[4].trim());

			if (isNaN(distanceRatio) || isNaN(cameraElevation) || isNaN(verticalAngle) || isNaN(horizontalAngle) || isNaN(rightRatio)) {
				return;
			}

			this.distanceRatio = distanceRatio;
			this.cameraElevation = cameraElevation;
			this.cameraVerticalAngle = verticalAngle;
			this.cameraHorizontalAngle = horizontalAngle;
			this.rightRatio = rightRatio;
		}
	}

	makeCameraPositions() {
		const posX = this.camera.position.x.toFixed(2);
		const posY = this.camera.position.y.toFixed(2);
		const posZ = this.camera.position.z.toFixed(2);

		const originPositionX = this.cameraOriginPosition.x.toFixed(2);
		const originPositionY = this.cameraOriginPosition.y.toFixed(2);
		const originPositionZ = this.cameraOriginPosition.z.toFixed(2);

		return posX + "," + posY + "," + posZ + "," + originPositionX + "," + originPositionY + "," + originPositionZ;
    }

	readCameraPositions(value) {
		if (value === null || value === undefined) {
			return;
		}

		const datas = value.split(',');

		if (datas.length === 6) {
			const posX = Number(datas[0].trim());
			const posY = Number(datas[1].trim());
			const posZ = Number(datas[2].trim());

			if (isNaN(posX) || isNaN(posY) || isNaN(posZ)) {
				return;
			}

			const originPosX = Number(datas[3].trim());
			const originPosY = Number(datas[4].trim());
			const originPosZ = Number(datas[5].trim());

			if (isNaN(originPosX) || isNaN(originPosY) || isNaN(originPosZ)) {
				return;
			}

			this.camera.position.set(posX, posY, posZ);
			this.cameraOriginPosition.set(originPosX, originPosY, originPosZ);
		}
	}

	makeModelPositionNRotation() {
		const posX = this.model.position.x.toFixed(2);
		const posY = this.model.position.y.toFixed(2);
		const posZ = this.model.position.z.toFixed(2);

		const rotateX = this.model.rotation.x.toFixed(2);
		const rotateY = (this.model.rotation.y - this.rotationY).toFixed(2);
		const rotateZ = this.model.rotation.z.toFixed(2);

		return posX + "," + posY + "," + posZ + "," + rotateX + "," + rotateY + "," + rotateZ;
    }

	readModelPositionNRotation(value) {
		if (value === null || value === undefined) {
			return;
		}

		const datas = value.split(',');

		if (datas.length === 6) {
			const posX = Number(datas[0].trim());
			const posY = Number(datas[1].trim());
			const posZ = Number(datas[2].trim());

			if (isNaN(posX) || isNaN(posY) || isNaN(posZ)) {
				return;
			}

			const rotateX = Number(datas[3].trim());
			const rotateY = Number(datas[4].trim());
			const rotateZ = Number(datas[5].trim());

			if (isNaN(rotateX) || isNaN(rotateY) || isNaN(rotateZ)) {
				return;
			}

			this.model.position.set(posX, posY, posZ);
			this.model.rotation.set(rotateX, rotateY + this.rotationY, rotateZ);
        }
    }

	initModel() {
		this.model.position.set(110, 20, -40);
		this.model.scale.set(10, 10, 10);

		this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);
		this.cameraOriginPosition = new THREE.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z);
		this.moveCamera(this.model.position);
	}

	setGlobalCamera() {
		this.contents3D.camera = this.contents3D.perspectiveCamera;
	}

	setAvatarCamera() {
		this.contents3D.camera = this.camera;
		this.moveCamera(this.model.position);
	}

	createPanel() {
		//const panel = new GUI({ width: 310 });

		//const folder1 = panel.addFolder('Visibility');
		//const folder2 = panel.addFolder('Activation/Deactivation');
		//const folder3 = panel.addFolder('Pausing/Stepping');
		//const folder4 = panel.addFolder('Crossfading');
		//const folder5 = panel.addFolder('Blend Weights');
		//const folder6 = panel.addFolder('General Speed');

		this.settings = {
			'show model': true,
			'show skeleton': false,
			'deactivate all': this.deactivateAllActions,
			'activate all': this.activateAllActions,
			'pause/continue': this.pauseContinue,
			'make single step': this.toSingleStepMode,
			'modify step size': 0.05,
			'from walk to idle': function () {
				this.prepareCrossFade(this.walkAction, this.idleAction, 1.0);
			},
			'from idle to walk': function () {
				this.prepareCrossFade(this.idleAction, this.walkAction, 0.5);
			},
			'from walk to run': function () {
				this.prepareCrossFade(this.walkAction, this.runAction, 2.5);
			},
			'from run to walk': function () {
				this.prepareCrossFade(this.runAction, this.walkAction, 5.0);
			},
			'use default duration': true,
			'set custom duration': 3.5,
			'modify idle weight': 0.0,
			'modify walk weight': 1.0,
			'modify run weight': 0.0,
			'modify time scale': 1.0
		};

		//folder1.add(this.settings, 'show model').onChange(this.showModel);
		//folder1.add(this.settings, 'show skeleton').onChange(this.showSkeleton);
		//folder2.add(this.settings, 'deactivate all');
		//folder2.add(this.settings, 'activate all');
		//folder3.add(this.settings, 'pause/continue');
		//folder3.add(this.settings, 'make single step');
		//folder3.add(this.settings, 'modify step size', 0.01, 0.1, 0.001);
		//this.crossFadeControls.push(folder4.add(this.settings, 'from walk to idle'));
		//this.crossFadeControls.push(folder4.add(this.settings, 'from idle to walk'));
		//this.crossFadeControls.push(folder4.add(this.settings, 'from walk to run'));
		//this.crossFadeControls.push(folder4.add(this.settings, 'from run to walk'));
		//folder4.add(this.settings, 'use default duration');
		//folder4.add(this.settings, 'set custom duration', 0, 10, 0.01);
		//folder5.add(this.settings, 'modify idle weight', 0.0, 1.0, 0.01).listen().onChange(function (weight) {
		//	this.setWeight(this.idleAction, weight);
		//});
		//folder5.add(this.settings, 'modify walk weight', 0.0, 1.0, 0.01).listen().onChange(function (weight) {
		//	this.setWeight(this.walkAction, weight);
		//});
		//folder5.add(this.settings, 'modify run weight', 0.0, 1.0, 0.01).listen().onChange(function (weight) {
		//	this.setWeight(this.runAction, weight);
		//});
		//folder6.add(this.settings, 'modify time scale', 0.0, 1.5, 0.01).onChange(this.modifyTimeScale);

		//folder1.open();
		//folder2.open();
		//folder3.open();
		//folder4.open();
		//folder5.open();
		//folder6.open();

		//this.crossFadeControls.forEach(function (control) {
		//	control.classList1 = control.domElement.parentElement.parentElement.classList;
		//	control.classList2 = control.domElement.previousElementSibling.classList;

		//	control.setDisabled = function () {
		//		control.classList1.add('no-pointer-events');
		//		control.classList2.add('control-disabled');
		//	};

		//	control.setEnabled = function () {
		//		control.classList1.remove('no-pointer-events');
		//		control.classList2.remove('control-disabled');
		//	};
		//});
	}

	showModel = (visibility) => {
		this.model.visible = visibility;
	}

	showSkeleton = (visibility) => {
		this.skeleton.visible = visibility;
	}

	modifyTimeScale = (speed) => {
		this.mixer.timeScale = speed;
	}

	deactivateAllActions = () => {
		this.actions.forEach(function (action) {
			action.stop();
		});
	}

	activateAllActions = () => {
		this.setWeight(this.idleAction, this.settings['modify idle weight']);
		this.setWeight(this.walkAction, this.settings['modify walk weight']);
		this.setWeight(this.runAction, this.settings['modify run weight']);

		this.actions.forEach(function (action) {
			action.play();
		});
	}

	pauseContinue = () => {
		if (this.singleStepMode) {
			this.singleStepMode = false;
			this.unPauseAllActions();
		}
		else {
			if (this.idleAction.paused) {
				this.unPauseAllActions();
			}
			else {
				this.pauseAllActions();
			}
		}
	}

	pauseAllActions = () => {
		this.actions.forEach(function (action) {
			action.paused = true;
		});
	}

	unPauseAllActions = () => {
		this.actions.forEach(function (action) {
			action.paused = false;
		});
	}

	toSingleStepMode = () => {
		this.unPauseAllActions();

		this.singleStepMode = true;
		this.sizeOfNextStep = this.settings['modify step size'];
	}

	prepareCrossFade = (startAction, endAction, defaultDuration) => {
		// Switch default / custom crossfade duration (according to the user's choice)
		const duration = this.setCrossFadeDuration(defaultDuration);

		// Make sure that we don't go on in singleStepMode, and that all actions are unpaused
		this.singleStepMode = false;
		this.unPauseAllActions();

		// If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
		// else wait until the current action has finished its current loop
		if (startAction === this.idleAction) {
			this.executeCrossFade(startAction, endAction, duration);
		}
		else {
			this.synchronizeCrossFade(startAction, endAction, duration);
		}
	}

	setCrossFadeDuration = (defaultDuration) => {
		// Switch default crossfade duration <-> custom crossfade duration
		if (this.settings['use default duration']) {
			return defaultDuration;
		}
		else {
			return this.settings['set custom duration'];
		}
	}

	synchronizeCrossFade = (startAction, endAction, duration) => {
		this.mixer.addEventListener('loop', onLoopFinished);
		const _this = this;

		function onLoopFinished(event) {
			if (event.action === startAction) {
				_this.mixer.removeEventListener('loop', onLoopFinished);
				_this.executeCrossFade(startAction, endAction, duration);
			}
		}
	}

	executeCrossFade = (startAction, endAction, duration) => {
		// Not only the start action, but also the end action must get a weight of 1 before fading
		// (concerning the start action this is already guaranteed in this place)
		this.setWeight(endAction, 1);
		endAction.time = 0;

		// Crossfade with warping - you can also try without warping by setting the third parameter to false
		startAction.crossFadeTo(endAction, duration, true);
	}

	// This function is needed, since animationAction.crossFadeTo() disables its start action and sets
	// the start action's timeScale to ((start animation's duration) / (end animation's duration))
	setWeight = (action, weight) => {
		action.enabled = true;
		action.setEffectiveTimeScale(1);
		action.setEffectiveWeight(weight);
	}

	// Called by the render loop
	updateWeightSliders = () => {
		this.settings['modify idle weight'] = this.idleWeight;
		this.settings['modify walk weight'] = this.walkWeight;
		this.settings['modify run weight'] = this.runWeight;
	}

	// Called by the render loop
	updateCrossFadeControls = () => {
		/*this.crossFadeControls.forEach(function (control) {
			control.setDisabled();
		});

		if (this.idleWeight === 1 && this.walkWeight === 0 && this.runWeight === 0) {
			this.crossFadeControls[1].setEnabled();
		}

		if (this.idleWeight === 0 && this.walkWeight === 1 && this.runWeight === 0) {
			this.crossFadeControls[0].setEnabled();
			this.crossFadeControls[2].setEnabled();
		}

		if (this.idleWeight === 0 && this.walkWeight === 0 && this.runWeight === 1) {
			this.crossFadeControls[3].setEnabled();
		}*/
	}

	animate(delta) {
		if (!this.actions || !this.model) {
			return;
		}

		if (this.idleAction && this.walkAction && this.runAction) {
			this.idleWeight = this.idleAction.getEffectiveWeight();
			this.walkWeight = this.walkAction.getEffectiveWeight();
			this.runWeight = this.runAction.getEffectiveWeight();

			// Update the panel values if weights are modified from "outside" (by crossfadings)
			this.updateWeightSliders();

			// Enable/disable crossfade controls according to current weight values
			this.updateCrossFadeControls();
		}

		// If in single step mode, make one step and then do nothing (until the user clicks again)
		if (this.singleStepMode) {
			delta = this.sizeOfNextStep;
			this.sizeOfNextStep = 0;
		}

		// Update the animation mixer, the stats panel, and render this frame
		this.mixer.update(delta);
	}

	move(event) {
		if (!this.actions) {
			return;
        }
		/*if (!this.idleAction || !this.walkAction || !this.runAction) {
			return;
		}*/

		let pos = this.model.position;
		const movingDistance = 1;

		if (event.key === "ArrowLeft") {
			// 제자리에서 왼쪽으로 회전
			this.rotate(0.1);
		}
		else if (event.key === "ArrowRight") {
			// 제자리에서 오른쪽으로 회전
			this.rotate(-0.1);
		}
		else if (event.key === "a" || event.key === "A" || event.key === "ㅁ") {
			// 왼쪽으로 이동
			const v1 = new Vertex2D(pos.x, pos.z);
			const v2 = new Vertex2D(this.cameraOriginPosition.x + this.cameraDir.x * 100, this.cameraOriginPosition.z + this.cameraDir.z * 100);
			const v3 = Geometry.getRightVertex(v1, v2, -movingDistance);

			pos.x = v3.x;
			pos.z = v3.y;
			this.moveCamera(pos);
		}
		else if (event.key === "d" || event.key === "D" || event.key === "ㅇ") {
			// 오른쪽으로 이동
			const v1 = new Vertex2D(pos.x, pos.z);
			const v2 = new Vertex2D(this.cameraOriginPosition.x + this.cameraDir.x * 100, this.cameraOriginPosition.z + this.cameraDir.z * 100);
			const v3 = Geometry.getRightVertex(v1, v2, movingDistance);

			pos.x = v3.x;
			pos.z = v3.y;
			this.moveCamera(pos);
		}
		else if (event.key === "ArrowUp" || event.key === "w" || event.key === "W" || event.key === "ㅈ" || event.key === "ㅉ") {
			// 위쪽으로 이동
			pos.x += this.cameraDir.x * movingDistance;
			pos.y += this.cameraDir.y * movingDistance;
			pos.z += this.cameraDir.z * movingDistance;

			this.moveCamera(pos);
		}
		else if (event.key === "ArrowDown" || event.key === "s" || event.key === "S" || event.key === "ㄴ") {
			// 아래쪽으로 이동
			pos.x -= this.cameraDir.x * movingDistance;
			pos.y -= this.cameraDir.y * movingDistance;
			pos.z -= this.cameraDir.z * movingDistance;

			this.moveCamera(pos);
		}
		else if (event.key === "q" || event.key === "Q" || event.key === "ㅂ" || event.key === "ㅃ") {
			// 왼쪽으로 돌면서 전진
			this.rotate(0.1);

			pos.x += this.cameraDir.x * movingDistance;
			pos.y += this.cameraDir.y * movingDistance;
			pos.z += this.cameraDir.z * movingDistance;

			this.moveCamera(pos);
		}
		else if (event.key === "e" || event.key === "E" || event.key === "ㄷ" || event.key === "ㄸ") {
			// 오른쪽으로 돌면서 전진
			this.rotate(-0.1);

			pos.x += this.cameraDir.x * movingDistance;
			pos.y += this.cameraDir.y * movingDistance;
			pos.z += this.cameraDir.z * movingDistance;

			this.moveCamera(pos);
		}

		/*if (event.ctrlKey) {
			this.rotate(0.1);
		}
		else if (event.altKey) {
			this.rotate(-0.1);
		}

		let pos = this.model.position;
		const movingDistance = 1;

		if (event.key === "ArrowUp") {
			pos.x += this.cameraDir.x * movingDistance;
			pos.y += this.cameraDir.y * movingDistance;
			pos.z += this.cameraDir.z * movingDistance;

			this.moveCamera(pos);
		}
		else if (event.key === "ArrowDown") {
			pos.x -= this.cameraDir.x * movingDistance;
			pos.y -= this.cameraDir.y * movingDistance;
			pos.z -= this.cameraDir.z * movingDistance;

			if (event.ctrlKey) {
				this.cameraDir.x *= -movingDistance;
				this.cameraDir.y *= -movingDistance;
				this.cameraDir.z *= -movingDistance;

				this.model.rotation.y += Math.PI;
			}

			this.moveCamera(pos);
		}
		else if (event.key === "ArrowRight") {
			if (event.ctrlKey) {
				this.cameraDir = this.turnRight(this.cameraDir, -1);
				this.model.rotation.y -= Math.PI / 2;
			}
			else {
				const v1 = new Vertex2D(pos.x, pos.z);
				const v2 = new Vertex2D(this.camera.position.x + this.cameraDir.x * 100, this.camera.position.z + this.cameraDir.z * 100);
				const v3 = Geometry.getRightVertex(v1, v2, movingDistance);

				pos.x = v3.x;
				pos.z = v3.y;
			}

			this.moveCamera(pos);
		}
		else if (event.key === "ArrowLeft") {
			if (event.ctrlKey) {
				this.cameraDir = this.turnRight(this.cameraDir, 1);
				this.model.rotation.y += Math.PI / 2;
			}
			else {
				const v1 = new Vertex2D(pos.x, pos.z);
				const v2 = new Vertex2D(this.camera.position.x + this.cameraDir.x * 100, this.camera.position.z + this.cameraDir.z * 100);
				const v3 = Geometry.getRightVertex(v1, v2, -movingDistance);

				pos.x = v3.x;
				pos.z = v3.y;
			}

			this.moveCamera(pos);
		}*/
	}

	rotate(theta) {
		const angle = (this.model.rotation.y - this.rotationY) + theta;

		this.cameraDir.x = -Math.sin(angle);
		this.cameraDir.z = -Math.cos(angle);
		this.model.rotation.y = angle + this.rotationY;

		this.moveCamera(this.model.position);
	}

	moveCamera(pos) {
		const vPos = this.getCameraPosition(pos);
		const cameraElevation = this.model.scale.y * this.cameraElevation;

		this.camera.position.set(vPos.x, vPos.y + cameraElevation, vPos.z);
		const target = this.getCameraTarget();
		this.camera.lookAt(target);

		if (this.contents3D.isIndoor() === false) {
			// 바닥 높이가 일정하지 않기 때문에 통계자료에 근거하여 계산한다.
			const modelElevation = WalkingAvatar.getBottomElevation(pos.x, pos.z);

			if (modelElevation !== null) {
				this.model.position.set(pos.x, modelElevation, pos.z);
			}
		}

		this.writeOptions();
	}

	static pushElevationPoint(pos, elevation, distance, datas) {
		const dataCount = datas.length;

		for (let i = 0; i < dataCount; i++) {
			const data = datas[i];

			if (distance < data[2]) {
				datas.splice(i, 0, [pos, elevation, distance]);
				return;
            }
		}

		datas.push([pos, elevation, distance]);
	}

	static getTriangle(arrDatas) {
		const dataCount = arrDatas.length;
		const result = [];

		const _v1 = arrDatas[0][0];
		const _v2 = arrDatas[1][0];
		const v1 = new Vertex3D(_v1.x, arrDatas[0][1], _v1.y);
		const v2 = new Vertex3D(_v2.x, arrDatas[1][1], _v2.y);

		result.push(v1);
		result.push(v2);

		for (let i = 2; i < dataCount; i++) {
			const data = arrDatas[i];
			const vertex = data[0];

			const distance = Geometry.getDistanceFromLine3(vertex.x, vertex.y, 0, _v1.x, _v1.y, 0, _v2.x, _v2.y, 0, true);

			if (distance > Geometry.Tolerance) {
				const v3 = new Vertex3D(vertex.x, data[1], vertex.y);
				result.push(v3);
				return result;
            }
		}

		return null;
    }

	static getBottomElevation(x, z) {
		const vPos = new Vertex2D(x, z);
		const dataCount = WalkingAvatar.BottomElevations.length;

		const arrDatas = [];

		for (let i = 0; i < dataCount; i++) {
			const data = WalkingAvatar.BottomElevations[i];
			const distance = vPos.getDistance(data[0]);

			WalkingAvatar.pushElevationPoint(data[0], data[1], distance, arrDatas);
		}

		const triangle = WalkingAvatar.getTriangle(arrDatas);

		if (triangle !== null) {
			// (x, z)와 가장 가까운 세 점을 구하여 세 점이 이루는 평면에서 (x, z)의 위치를 찾아 y값을 구한다.
			const v1 = triangle[0];
			const v2 = triangle[1];
			const v3 = triangle[2];

			const v12 = new Vertex3D(v2.x - v1.x, v2.y - v1.y, v2.z - v1.z);
			const v13 = new Vertex3D(v3.x - v1.x, v3.y - v1.y, v3.z - v1.z);
			const vCross = Vertex3D.crossProduct(v12, v13);

			// vCrosss * [(x, y, z) - v1] = 0
			// 평면의 방정식(ax + by + cz + d = 0)
			const a = vCross.x;
			const b = vCross.y;
			const c = vCross.z;
			const d = -vCross.x * v1.x - vCross.y * v1.y - vCross.z * v1.z;

			const y = (-a * x - c * z - d) / b;
			return y;
		}

		return null;
	}

	getCameraPosition(pos) {
		const distance1 = this.model.scale.z * this.distanceRatio;
		this.cameraOriginPosition.set(pos.x - this.cameraDir.x * distance1, pos.y + this.model.scale.y * 2 - this.cameraDir.y * distance1, pos.z - this.cameraDir.z * distance1);

		const v1 = new Vertex2D(pos.x, pos.z);
		const v2 = new Vertex2D(v1.x - this.cameraDir.x * distance1, v1.y - this.cameraDir.z * distance1);

		const distance2 = this.model.scale.z * this.rightRatio;
		const v3 = Geometry.getRightVertex(v2, v1, distance2);

		return new THREE.Vector3(v3.x, pos.y + this.model.scale.y * 2 - this.cameraDir.y * distance1, v3.y);
    }

	getCameraTarget() {
		const distance = 100;
		const cosData = Math.cos(this.cameraVerticalAngle);
		const sinData = Math.sin(this.cameraVerticalAngle);

		const target1 = new THREE.Vector3(this.camera.position.x + this.cameraDir.x * distance * cosData, this.camera.position.y + this.cameraDir.y * distance * cosData, this.camera.position.z + this.cameraDir.z * distance * cosData);
		const target2 = new THREE.Vector3(target1.x, target1.y + distance * sinData, target1.z);

		const vCenter = new Vertex2D(this.camera.position.x, this.camera.position.z);
		const v1 = new Vertex2D(target1.x, target1.z);
		const radius = vCenter.getDistance(v1);

		const vTop = new Vertex2D(vCenter.x, vCenter.y - radius);
		let angle = Geometry.getAngle(vTop, vCenter, v1);

		if (v1.x < vCenter.x) {
			angle = Math.PI * 2 - angle;
		}

		const theta = angle + this.cameraHorizontalAngle;
		const x = vCenter.x + radius * Math.sin(theta);
		const z = vCenter.y - radius * Math.cos(theta);

		return new THREE.Vector3(x, target2.y, z);
    }

	farFromModel(faraway) {
		if (faraway) {
			this.distanceRatio += 0.1;
		}
		else {
			this.distanceRatio -= 0.1;
		}

		this.moveCamera(this.model.position);
		return this.model.scale.z * this.distanceRatio;
	}

	goUpCamera(upper) {
		if (upper) {
			this.cameraElevation += 0.1;
		}
		else {
			this.cameraElevation -= 0.1;
		}

		this.moveCamera(this.model.position);
		return this.model.scale.y * this.cameraElevation;
	}

	rotateVerticalCamera(upper) {
		let angle = this.cameraVerticalAngle;

		if (upper) {
			angle += 0.1;
		}
		else {
			angle -= 0.1;
		}

		const _2PI = Math.PI * 2;

		while (angle > _2PI) {
			angle = angle - _2PI;
		}

		while (angle < 0) {
			angle += _2PI;
		}

		const degree = angle * 180 / Math.PI;

		if (degree > 70 && degree < 290) {
			// 이 각도는 사용하지 않는다.
			// 카메라의 up vector를 바꿔야 한다.
			return;
		}
		else {
			this.cameraVerticalAngle = angle;
        }

		this.moveCamera(this.model.position);
		return this.cameraVerticalAngle;
	}

	rotateHorizontalCamera(upper) {
		if (upper) {
			this.cameraHorizontalAngle += 0.1;
		}
		else {
			this.cameraHorizontalAngle -= 0.1;
		}

		this.moveCamera(this.model.position);
		return this.cameraHorizontalAngle;
	}

	cameraToRight(right) {
		if (right) {
			this.rightRatio += 0.1;
		}
		else {
			this.rightRatio -= 0.1;
		}

		this.moveCamera(this.model.position);
    }

	// 오른쪽으로 90도 꺽는다.
	turnRight(cameraDir, yAxis) {
		const v1 = new THREE.Vector3(0, yAxis, 0);
		// y값을 0으로 만든다.
		const v2 = new THREE.Vector3(cameraDir.x, 0, cameraDir.z);

		const vRight = v1.cross(v2);

		// 벡터의 외적을 구한뒤 원래 y값을 넣어준다.
		vRight.y = cameraDir.y;

		return vRight;
	}

	moveToZone(zoneID) {
		if (this.contents3D?.props._3dOptions) {
			const pos = this.getZoneBottomPosition(zoneID);
			this.model.position.set(pos.x, pos.y, pos.z);
		}
	}

	getZoneBottomPosition(zoneID) {
		const _3dOptions = this.contents3D.props._3dOptions;

		let zone = _3dOptions.zones[zoneID];

		if (!zone) {
			zone = _3dOptions.outdoorZones[zoneID];
		}

		if (zone) {
			if (zone.datas?.fakeWallElevation) {
				return new THREE.Vector3(zone[4], zone.datas.fakeWallElevation, zone[6]);
			}
			else if (zone.length >= 7 &&
				zone[4] !== null && zone[4] !== undefined &&
				zone[5] !== null && zone[5] !== undefined &&
				zone[6] !== null && zone[6] !== undefined) {
				return new THREE.Vector3(zone[4], zone[5], zone[6]);
            }
		}

		return new THREE.Vector3(0, 0, 0);
    }
}