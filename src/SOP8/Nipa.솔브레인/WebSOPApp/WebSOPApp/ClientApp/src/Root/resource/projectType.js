import ProjectResource from "./id";

// 초순수, 전력 서비스 분리
// WATER : 초순수
// POWER : 전력
export const PROJECT_TYPE = {
    NORMAL: "normal",
    WATER: "water",
    POWER: "power",
};

export function getProjectType() {
    return ProjectResource.getUserInfo()?.options?.projectType ?? PROJECT_TYPE.NORMAL;
}

export function getProjectTypeState() {
    const projectType = getProjectType();
    const isFacilityProject = projectType === PROJECT_TYPE.WATER || projectType === PROJECT_TYPE.POWER;

    return {
        projectType,
        isNormal: projectType === PROJECT_TYPE.NORMAL,
        isWater: projectType === PROJECT_TYPE.WATER,
        isPower: projectType === PROJECT_TYPE.POWER,
        isFacilityProject,
    };
}

export function isWaterProject() {
    return getProjectType() === PROJECT_TYPE.WATER;
}

export function isPowerProject() {
    return getProjectType() === PROJECT_TYPE.POWER;
}
