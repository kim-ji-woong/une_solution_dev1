import ProjectResource from "../../Root/resource/id";
import { SDMSController } from "../services/sdmsController";

export class SensorManager {
    async requestSensorList() {
        let siteNos = null;

        const [result, message] = await SDMSController.requestSensorList(siteNos);
        
        if (result === null) {
            console.log(message);
            this.setState({});
        }
        else {
            const sensorList = {};
            if (result.fireSensors) {
                sensorList['fireSensors'] = result.fireSensors;
            }
            if (result.psmSensors) {
                sensorList['psmSensors'] = result.psmSensors;
            }
            if (result.etcSensors) {
                sensorList['etcSensors'] = result.etcSensors;
            }
            if (result.cctvs) {
                sensorList['cctvs'] = result.cctvs;
            }
            if (result.earthquakeSensors) {
                sensorList['earthquakeSensors'] = result.earthquakeSensors;
            }
            if (result.strongWindSensors) {
                sensorList['strongWindSensors'] = result.strongWindSensors;
            }
            if (result.environmentSensors) {
                sensorList['environmentSensors'] = result.environmentSensors;
            }
            if (result.manufactureSensors) {
                sensorList['manufactureSensors'] = result.manufactureSensors;
            }
            if (result.emergencyBellSensors) {
                sensorList['emergencyBellSensors'] = result.emergencyBellSensors;
            }
            if (result.laserSensors) {
                sensorList['laserSensors'] = result.laserSensors;
            }
            if (result.doorSensors) {
                sensorList['doorSensors'] = result.doorSensors;
            }

            this.setState({ sensorList: sensorList });
            await this.set3DOptions(sensorList);
        }
    }

    async set3DOptions(sensorList) {
        let siteNos = null;
        const userInfo = await ProjectResource.initUserInfo();
        if (userInfo?.site_sn) {
            siteNos = [userInfo.site_sn];
        }

        const [buildingGroupList, outdoorZones, errorMessage] = await SDMSController.requestBuildingGroupList(siteNos);

        const site3dOptions = await SDMSDataManager.get3DOptions(buildingGroupList, outdoorZones, errorMessage, userInfo ? userInfo.user_sn : 0, siteIDs);

        const isMultiSite = ProjectResource.IsMultiSite;
        const showSiteNo = userInfo?.showSiteNo;

        let first3DOptions = null;
        let firstSiteNo = null;

        for (const site_sn in site3dOptions) {
            const _3dOptions = site3dOptions[site_sn];

            if (!first3DOptions) {
                first3DOptions = _3dOptions;
                firstSiteNo = site_sn;
            }

            // 멀티사이트 경우 시작 사이트 설정 확인
            if (isMultiSite === true && showSiteNo > 0 && showSiteNo.toString() === site_sn) {
                first3DOptions = _3dOptions;
                firstSiteNo = site_sn;
                break;
            }
        }

        this.setSensorList(site3dOptions, sensorList);

        if (ProjectResource.siteID >= ProjectResource.Site.GG_A && ProjectResource.siteID <= ProjectResource.Site.GG_H) {
            const siteID = ProjectResource.siteID === ProjectResource.Site.GG_A ? null : ProjectResource.siteID;
            await this.setFirstAidEquipments(site3dOptions, siteID);
        }

        this.setState({ loading: false, site3dOptions: site3dOptions, currentSiteID: firstSiteID, _3dOptions: first3DOptions, buildingGroupList, viewMode: userInfo?.options?.viewMode });
        //this.setState({ loading: false, _3dOptions, buildingGroupList });


        // 타이틀바 siteID 선택
        const _firstSiteID = parseInt(firstSiteID);
        if (_firstSiteID !== NaN) {
            this.titleBarSiteID = _firstSiteID;
        }
    }

    setSensorList(site3dOptions, sensorList) {
        if (!sensorList || !site3dOptions) {
            console.log('[error] sensorList가 없음');
        }
        else {
            const fireSensors = sensorList['fireSensors'];
            const psmSensors = sensorList['psmSensors'];
            const etcSensors = sensorList['etcSensors'];
            const cctvs = sensorList['cctvs'];
            const earthquakeSensors = sensorList['earthquakeSensors'];
            const strongWindSensors = sensorList['strongWindSensors'];
            const environmentSensors = sensorList['environmentSensors'];
            const manufactureSensors = sensorList['manufactureSensors'];
            const emergencyBellSensors = sensorList['emergencyBellSensors'];

            if (fireSensors) {
                this.setFireSensors(fireSensors, site3dOptions);
            }
            if (psmSensors) {
                this.setPSMSensors(psmSensors, site3dOptions);
            }
            if (etcSensors) {
                this.setEtcSensors(etcSensors, site3dOptions);
            }
            if (cctvs) {
                this.setCCTVs(cctvs, site3dOptions);
            }
            if (earthquakeSensors) {
                this.setEarthquakeSensors(earthquakeSensors, site3dOptions);
            }
            if (strongWindSensors) {
                this.setStrongWindSensors(strongWindSensors, site3dOptions);
            }
            if (environmentSensors) {
                this.setEnvironmentSensors(environmentSensors, site3dOptions);
            }
            if (manufactureSensors) {
                this.setManufactureSensors(manufactureSensors, site3dOptions);
            }
            if (emergencyBellSensors) {
                this.setEmergencyBellSensors(emergencyBellSensors, site3dOptions);
            }
        }
    }
}
