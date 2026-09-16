using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Soulbrain.Model.Facility;

namespace Soulbrain.BLL.Process
{
    using global::Response;
    using Soulbrain.BLL.Request;
    using Soulbrain.BLL.Response;
    using Soulbrain.Model.Gltf;
    using System;
    using System.Linq;
    using static dnsDataSoulbrain.CommonCode.Facility;
    using static dnsDataSoulbrain.CommonCode.FacilityData;

    class FacilityModeManager
    {
        private IDataManager m_dataManager = null;
        private Dictionary<string, string> m_dicTagNames = new Dictionary<string, string>();

        private const string MB_Polisher_ID = "F_MBP";
        private const string F_EDI_ID = "F_EDI";
        private const string RO_SAFETY_FILTER_ID = "F_PFL";

        private const string TAG_VRS = "Vrs";
        private const string TAG_VTR = "Vtr";
        private const string TAG_VST = "Vst";
        private const string TAG_AR = "Ar";
        private const string TAG_AS = "As";
        private const string TAG_AT = "At";
        private const string TAG_POWER = "전력";
        private const string TAG_ACTIVE = "유효전력량";
        private const string TAG_FACTOR = "역률";
        private const string TAG_FREQUENCY = "주파수";
        private const string TAG_LEAKAGE = "누설전류";
        private const string TAG_DEMAND = "수요전력 최대값";
        private const string TAG_FORECAST = "전력예측값";
        private const string TAG_TEMP = "온도";
        private const string TAG_HUM = "습도";
        private const string TAG_POWERACTIVE = "전력사용량";


        public FacilityModeManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;

            InitTagNames();
        }

        public string GetTagName(string mesure_id)
        {
            string strTagName = null;

            if (m_dicTagNames.ContainsKey(mesure_id))
            {
                strTagName = m_dicTagNames[mesure_id];
            }            

            return strTagName;
        }

        public string ChangePowerTagName(string strTagName)
        {            
            string strPowerTagName = null;

            if (strTagName == null)
                strPowerTagName = null;
            else if (strTagName.IndexOf("Vrs") > 0)
                strPowerTagName = TAG_VRS;
            else if (strTagName.IndexOf("Vst") > 0)
                strPowerTagName = TAG_VST;
            else if (strTagName.IndexOf("Vtr") > 0)
                strPowerTagName = TAG_VTR;
            else if (strTagName.IndexOf("Ar") > 0)
                strPowerTagName = TAG_AR;
            else if (strTagName.IndexOf("As") > 0)
                strPowerTagName = TAG_AS;
            else if (strTagName.IndexOf("At") > 0)
                strPowerTagName = TAG_AT;
            else if (strTagName.IndexOf("전력예측값") > 0 || strTagName.IndexOf("전력 예측값") > 0)
                strPowerTagName = TAG_FORECAST;
            else if (strTagName.IndexOf("유효전력량") > 0)
                strPowerTagName = TAG_ACTIVE;
            else if (strTagName.IndexOf("수요전력 최대값") > 0)
                strPowerTagName = TAG_DEMAND;
            else if (strTagName.IndexOf("전력사용량") > 0)
                strPowerTagName = TAG_POWERACTIVE;
            else if (strTagName.IndexOf("전력") > 0)
                strPowerTagName = TAG_POWER;            
            else if (strTagName.IndexOf("역률") > 0)
                strPowerTagName = TAG_FACTOR;
            else if (strTagName.IndexOf("주파수") > 0)
                strPowerTagName = TAG_FREQUENCY;
            else if (strTagName.IndexOf("누설전류") > 0)
                strPowerTagName = TAG_LEAKAGE;                     
            else if (strTagName.IndexOf("온도") > 0)
                strPowerTagName = TAG_TEMP;
            else if (strTagName.IndexOf("습도") > 0)
                strPowerTagName = TAG_HUM;

            return strPowerTagName;
        }

        public ResponseFacilityModelList GetFacilityModelList()
        {
            ResponseFacilityModelList response = null;

            try
            {
                string strErrorMessage = null;
                string strCondition = null;

                response = new ResponseFacilityModelList();

                // 모델 정보 불러오기
                IEnumerable<FacilityZoneModel> models = m_dataManager.GetSelect().Select<FacilityZoneModel>(strCondition, out strErrorMessage);
                if (models == null)
                {
                    throw new ApplicationException(strErrorMessage);
                }

                List<int> modelIDs = new List<int>();
                //List<int> codeIDs = new List<int>();

                List<ResFacilityModelData> faModelDatas = new List<ResFacilityModelData>();
                response.Models = faModelDatas;

                foreach (var model in models)
                {
                    modelIDs.Add(model.gltf_fclty_zone_model_sn);
                    ResFacilityModelData data = new ResFacilityModelData(model);
                    data.TypeName = FacilityType.GetServerText(model.fclty_type_code);

                    faModelDatas.Add(data);

                    //if (codeIDs.Contains(model.fclty_type_code) == false)
                    //    codeIDs.Add(model.fclty_type_code);
                }
                


                if (modelIDs.Count > 0)
                {
                    strCondition = $"{FacilityZoneModelData.Fields.gltf_fclty_zone_model_sn} in ({string.Join(",", modelIDs.ToArray())})";

                    IEnumerable<FacilityZoneModelData> modelDatas = m_dataManager.GetSelect().Select<FacilityZoneModelData>(strCondition, out strErrorMessage);
                    if (modelDatas == null)
                    {
                        throw new ApplicationException(strErrorMessage);
                    }

                    // 존 정보 불러오기
                    List<int> zoneIDs = new List<int>();

                    foreach (var modelData in modelDatas)
                    {
                        if (zoneIDs.Contains(modelData.zone_sn) == false)
                            zoneIDs.Add(modelData.zone_sn);                        
                    }

                    if (zoneIDs.Count == 0)
                    {
                        throw new ApplicationException("FacilityZoneModelData 데이터가 존재하지 않습니다.");
                    }

                    strCondition = $"{Base.Model.Spatial.Zone.Fields.zone_sn} in ({string.Join(",", zoneIDs.ToArray())})";

                    IEnumerable<Base.Model.Spatial.Zone> zones = m_dataManager.GetSelect().Select<Base.Model.Spatial.Zone>(strCondition, out strErrorMessage);
                    if (zones == null)
                    {
                        throw new ApplicationException(strErrorMessage);
                    }

                    // 빌딩 정보 불러오기
                    List<int> buildingIDs = new List<int>();

                    foreach (var zone in zones)
                    {
                        if (zone.buld_sn.HasValue && buildingIDs.Contains(zone.buld_sn.Value) == false)
                            buildingIDs.Add(zone.buld_sn.Value);
                    }

                    List<Base.Model.Spatial.Building> buildingList = new List<Base.Model.Spatial.Building>();
                    IEnumerable<Base.Model.Spatial.Building> buildings = null;

                    if (buildingIDs.Count > 0)
                    {
                        strCondition = $"{Base.Model.Spatial.Building.Fields.buld_sn} in ({string.Join(",", buildingIDs.ToArray())})";

                        buildings = m_dataManager.GetSelect().Select<Base.Model.Spatial.Building>(strCondition, out strErrorMessage);
                        if (buildings == null)
                        {
                            throw new ApplicationException(strErrorMessage);
                        }

                        buildingList.AddRange(buildings);
                    }                   

                    List<Base.Model.Spatial.Zone> zoneList = new List<Base.Model.Spatial.Zone>();
                    zoneList.AddRange(zones);

                    // 데이터 정리
                    foreach (var modelData in modelDatas)
                    {
                        ResFacilityZoneData faZoneData = new ResFacilityZoneData(modelData);

                        Base.Model.Spatial.Zone zone = zoneList.Find(x => x.zone_sn == modelData.zone_sn);
                        if (zone == null)
                        {
                            throw new ApplicationException($"{modelData.zone_sn} 해당하는 Zone 데이터가 존재하지 않습니다.");
                        }

                        faZoneData.ZoneName = zone.name;
                        faZoneData.ZoneDisplayName = zone.disp_text;

                        ResFacilityModelData faModelData = faModelDatas.Find(x => x.gltf_fclty_zone_model_sn == modelData.gltf_fclty_zone_model_sn);
                        if (faModelData == null)
                        {
                            throw new ApplicationException($"{modelData.gltf_fclty_zone_model_sn} 해당하는 FacilityZoneModel 데이터가 존재하지 않습니다.");
                        }

                        // 해당 건물 정보가 없다면
                        if (faModelData.BuildingDisplayName == null && buildings != null && zone.buld_sn.HasValue)
                        {
                            Base.Model.Spatial.Building building = buildingList.Find(x => x.buld_sn == zone.buld_sn.Value);
                            if (building != null)
                            {
                                faModelData.buld_sn = building.buld_sn;
                                faModelData.BuildingDisplayName = building.disp_text;
                            }
                        }

                        
                        if (faModelData.ZoneData == null)
                            faModelData.ZoneData = new List<ResFacilityZoneData>();

                        faModelData.ZoneData.Add(faZoneData);

                        if (faModelData.SiteNo == null)
                            faModelData.SiteNo = zone.site_sn;
                    }
                }

                response.Success = true;
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
            }
         
            return response;
        }


        public MessageResult SaveFcltyViewport(RequestSaveFcltyViewport data)
        {
            string strCondition = null;
            string strErrorMessage;

            MessageResult response = new MessageResult();

            try
            {
                if (data.ZoneNo > 0)
                {
                    // 설비 층 뷰 업데이트
                    strCondition = $"{FacilityZoneModelData.Fields.gltf_fclty_zone_model_sn} = {data.FcltyNo} and {FacilityZoneModelData.Fields.zone_sn} = {data.ZoneNo}";

                    FacilityZoneModelData modelData = m_dataManager.GetSelect().SelectFirst<FacilityZoneModelData>(strCondition, out strErrorMessage);
                    if (modelData == null)
                    {
                        throw new ApplicationException($"FcltyNo: {data.FcltyNo}, ZoneNo: {data.ZoneNo} 해당하는 FacilityZoneModelData 데이터가 존재하지 않습니다.");
                    }

                    modelData.camera_lc_x = data.CameraPositionX;
                    modelData.camera_lc_y = data.CameraPositionY;
                    modelData.camera_lc_z = data.CameraPositionZ;
                    modelData.camera_rtate_x = data.CameraRotationX;
                    modelData.camera_rtate_y = data.CameraRotationY;
                    modelData.camera_rtate_z = data.CameraRotationZ;
                    modelData.orbit_x = data.OrbitTargetX;
                    modelData.orbit_y = data.OrbitTargetY;
                    modelData.orbit_z = data.OrbitTargetZ;

                    if (m_dataManager.GetUpdate().Update<FacilityZoneModelData>(modelData, null, out strErrorMessage) == false)
                    {
                        throw new ApplicationException($"FacilityZoneModelData Update Error: {strErrorMessage}");
                    }
                }
                else
                {
                    // 설비 전체 뷰 업데이트
                    strCondition = $"{FacilityZoneModel.Fields.gltf_fclty_zone_model_sn} = {data.FcltyNo}";

                    FacilityZoneModel model = m_dataManager.GetSelect().SelectFirst<FacilityZoneModel>(strCondition, out strErrorMessage);
                    if (model == null)
                    {
                        throw new ApplicationException($"FcltyNo: {data.FcltyNo} 해당하는 FacilityZoneModel 데이터가 존재하지 않습니다.");
                    }

                    model.camera_lc_x = data.CameraPositionX;
                    model.camera_lc_y = data.CameraPositionY;
                    model.camera_lc_z = data.CameraPositionZ;
                    model.camera_rtate_x = data.CameraRotationX;
                    model.camera_rtate_y = data.CameraRotationY;
                    model.camera_rtate_z = data.CameraRotationZ;
                    model.orbit_x = data.OrbitTargetX;
                    model.orbit_y = data.OrbitTargetY;
                    model.orbit_z = data.OrbitTargetZ;

                    if (m_dataManager.GetUpdate().Update<FacilityZoneModel>(model, null, out strErrorMessage) == false)
                    {
                        throw new ApplicationException($"FacilityZoneModel Update Error: {strErrorMessage}");
                    }
                }

                response.Success = true;
            }
            catch (Exception e)
            {
                response.Success = false;
                response.Message = e.Message;
            }

            return response;
        }

        public ResponseSimulationPoi GetSimulationPois()
        {
            string strErrorMessage;
            IEnumerable<SimulationPoi> pois = m_dataManager.GetSelect().Select<SimulationPoi>(null, out strErrorMessage);

            if (pois == null)
                return new ResponseSimulationPoi(false, strErrorMessage);

            ResponseSimulationPoi response = new ResponseSimulationPoi(true, "");

            foreach (var poi in pois)
            {
                SimulationPoiEx poiEx = new SimulationPoiEx(poi);
                response.Pois.Add(poiEx);
            }

            return response;
        }

        public ResponseFacilityHistory GetFacilityHistory(int nSensorID)
        {
            ResponseFacilityHistory res = new ResponseFacilityHistory();

            try
            {
                string strConditions = $"{FacilityPresv.Fields.sensor_sn} = {nSensorID}";

                FacilityPresv presv = m_dataManager.GetSelect().SelectFirst<FacilityPresv>(strConditions, out string strErrMsg);
                if (presv == null)
                {
                    throw new ApplicationException("SelectFirst FacilityPresv Error: " + strErrMsg);
                }

                res.fclty_name = presv.fclty_presv_name;

                // 24시간 이전 기록 불러오기
                DateTime date = DateTime.Now.AddHours(-24);

                strConditions = $"{Model.History.FacilityPresv.Fields.fclty_id} = '{presv.fclty_id}' and {Model.History.FacilityPresv.Fields.mesure_tm} >= '{date.ToString("yyyy-MM-dd HH:mm:ss")}' and {Model.History.FacilityPresv.Fields.mesure_tm} <= '{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}' " +
                    $"              order by {Model.History.FacilityPresv.Fields.mesure_tm}";

                IEnumerable<Model.History.FacilityPresv> presvHis = m_dataManager.GetSelect().Select<Model.History.FacilityPresv>(strConditions, out strErrMsg);
                if (presvHis == null)
                {
                    throw new ApplicationException("Select History.FacilityPresv Error: " + strErrMsg);
                }

                List<Model.History.FacilityPresv> presvHisDatas = presvHis.ToList();

                //if (presvHisDatas.Count == 0)
                //{
                //    throw new ApplicationException($"{date.ToString("yyyy-MM-dd HH:mm:ss")}부터 {presv.fclty_id}의 데이터가 존재하지 않습니다.");
                //}                

                res.FacilityInfos = new List<FacilityInfo>();

                foreach (Model.History.FacilityPresv data in presvHisDatas)
                {
                    FacilityInfo facilityInfo = res.FacilityInfos.Find(x => x.mesure_id == data.mesure_id);

                    if (facilityInfo == null)
                    {
                        facilityInfo = new FacilityInfo();

                        string strTagName = GetTagName(data.mesure_id);
                        if (strTagName == null)
                            continue;

                        facilityInfo.TagName = strTagName;

                        facilityInfo.fclty_presv_name = presv.fclty_presv_name;
                        facilityInfo.mesure_id = data.mesure_id;

                        if (presv.presv_mesure_id == facilityInfo.mesure_id)
                        {
                            facilityInfo.IsAlarmFacility = true;

                            if (presv.fclty_id == MB_Polisher_ID)
                            {
                                facilityInfo.max_y = 10;

                                facilityInfo.nLimit1 = 7.252;
                                facilityInfo.nLimit2 = 7.765;
                                facilityInfo.nLimit3 = 8.279;
                                facilityInfo.nLimit4 = 8.792;
                            }
                            else if (presv.fclty_id == RO_SAFETY_FILTER_ID)
                            {
                                facilityInfo.max_y = 0.32;

                                facilityInfo.nLimit1 = 0.177;
                                facilityInfo.nLimit2 = 0.214;
                                facilityInfo.nLimit3 = 0.252;
                                facilityInfo.nLimit4 = 0.29;
                            }
                        }
                            

                        facilityInfo.mesure_uom = data.mesure_uom;

                        facilityInfo.Predicts = new List<FacilityHistoryData>();
                        facilityInfo.Mesures = new List<FacilityHistoryData>();

                        res.FacilityInfos.Add(facilityInfo);
                    }

                    List<FacilityHistoryData> facilityHistoryDatas;

                    if (data.data_ty_code == FacilityDataType.Measurement)
                    {   // 계측 이력
                        facilityHistoryDatas = facilityInfo.Mesures;
                    }
                    else
                    {   // 예측 이력                         
                        facilityHistoryDatas = facilityInfo.Predicts;
                    }

                    FacilityHistoryData historyData = new FacilityHistoryData();
                    historyData.mesure_tm = data.mesure_tm;
                    historyData.mesure_value = Math.Round(data.mesure_value, 3);

                    // 예측치 관련 Y축 최대 값 관련
                    if (data.data_ty_code == FacilityDataType.Prediction && historyData.mesure_value > 0 && historyData.mesure_value > facilityInfo.max_y)
                    {
                        facilityInfo.max_y = historyData.mesure_value;
                    }

                    facilityHistoryDatas.Add(historyData);
                }

                // MB_Polisher는 두개의 설비 데이터를 바라봄
                if (presv.fclty_id == MB_Polisher_ID)
                {
                    strConditions = $"{Model.History.FacilityPresv.Fields.fclty_id} = '{F_EDI_ID}' and {Model.History.FacilityPresv.Fields.mesure_tm} >= '{date.ToString("yyyy-MM-dd HH:mm:ss")}' and {Model.History.FacilityPresv.Fields.mesure_tm} <= '{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}' order by {Model.History.FacilityPresv.Fields.mesure_tm}";

                    presvHis = m_dataManager.GetSelect().Select<Model.History.FacilityPresv>(strConditions, out strErrMsg);
                    if (presvHis == null)
                    {
                        throw new ApplicationException("Select History.FacilityPresv F_EDI_ID Error: " + strErrMsg);
                    }

                    presvHisDatas = presvHis.ToList();

                    foreach (Model.History.FacilityPresv data in presvHisDatas)
                    {
                        FacilityInfo facilityInfo = res.FacilityInfos.Find(x => x.mesure_id == data.mesure_id);

                        if (facilityInfo == null)
                        {
                            facilityInfo = new FacilityInfo();

                            string strTagName = GetTagName(data.mesure_id);
                            if (strTagName == null)
                                continue;

                            facilityInfo.TagName = strTagName;

                            facilityInfo.fclty_presv_name = presv.fclty_presv_name;
                            facilityInfo.mesure_id = data.mesure_id;

                            if (presv.presv_mesure_id == facilityInfo.mesure_id)
                                facilityInfo.IsAlarmFacility = true;

                            facilityInfo.mesure_uom = data.mesure_uom;

                            facilityInfo.Predicts = new List<FacilityHistoryData>();
                            facilityInfo.Mesures = new List<FacilityHistoryData>();

                            res.FacilityInfos.Add(facilityInfo);
                        }

                        List<FacilityHistoryData> facilityHistoryDatas;

                        // 계측 이력만 존재
                        facilityHistoryDatas = facilityInfo.Mesures;

                        FacilityHistoryData historyData = new FacilityHistoryData();
                        historyData.mesure_tm = data.mesure_tm;
                        historyData.mesure_value = Math.Round(data.mesure_value, 3);

                        facilityHistoryDatas.Add(historyData);
                    }
                }


                string strSQL = @$"SELECT his.{Model.History.FacilityPresv.Fields.mesure_id}, his.{Model.History.FacilityPresv.Fields.mesure_value}, his.{Model.History.FacilityPresv.Fields.mesure_uom}
                                    FROM {Model.History.FacilityPresv.TableName} his
                                    INNER JOIN (
                                        SELECT {Model.History.FacilityPresv.Fields.mesure_id}, MAX({Model.History.FacilityPresv.Fields.mesure_tm}) AS MaxTime
                                        FROM {Model.History.FacilityPresv.TableName}
                                        WHERE {Model.History.FacilityPresv.Fields.data_ty_code} = {FacilityDataType.Measurement}
                                        GROUP BY {Model.History.FacilityPresv.Fields.mesure_id}                                        
                                    ) AS his2
                                    ON his.{Model.History.FacilityPresv.Fields.mesure_id} = his2.{Model.History.FacilityPresv.Fields.mesure_id} AND his.{Model.History.FacilityPresv.Fields.mesure_tm} = his2.MaxTime
                                    WHERE his.{Model.History.FacilityPresv.Fields.fclty_id} IN ('{presv.fclty_id}' {(presv.fclty_id == MB_Polisher_ID ? ", '" + F_EDI_ID + "'": "")}) AND his.{Model.History.FacilityPresv.Fields.data_ty_code} = {FacilityDataType.Measurement}";

                IEnumerable<dynamic> result = m_dataManager.GetSelect().Select(strSQL, out strErrMsg);

                if (result == null)
                {
                    throw new ApplicationException($"INNER JOIN Error; {strErrMsg}");
                }

                res.FacilityDatas = new List<MesureData>();

                foreach (var item in result)
                {
                    string mesure_id = item.mesure_id;
                    double mesure_value = item.mesure_value;
                    string mesure_uom = item.mesure_uom;

                    string strTagName = GetTagName(mesure_id);
                    if (strTagName == null)
                        continue;

                    MesureData data = new MesureData();
                    data.mesure_id = mesure_id;
                    data.mesure_uom = mesure_uom;
                    data.mesure_value = Math.Round(mesure_value, 3);
                    data.TagName = strTagName;

                    res.FacilityDatas.Add(data);
                }

                res.Success = true;
            }
            catch (Exception e)
            {
                res.Success = false;
                res.Message = $"GetFacilityHistory Error: {e.Message}";
            }

            return res;
        }

        public ResponsePowerHistory GetPowerHistory(int nSensorID)
        {
            ResponsePowerHistory res = new ResponsePowerHistory();

            try
            {
                string strConditions = $"{FacilityPresv.Fields.sensor_sn} = {nSensorID}";

                FacilityPresv presv = m_dataManager.GetSelect().SelectFirst<FacilityPresv>(strConditions, out string strErrMsg);
                if (presv == null)
                {
                    throw new ApplicationException("SelectFirst FacilityPresv Error: " + strErrMsg);
                }

                res.fclty_name = presv.fclty_presv_name;

                // 오늘 하루 데이터
                DateTime date = DateTime.Today;

                strConditions = @$"{Model.History.FacilityPresv.Fields.fclty_id} = '{presv.fclty_id}' and {Model.History.FacilityPresv.Fields.mesure_tm} >= '{date.ToString("yyyy-MM-dd 00:00:00")}' and {Model.History.FacilityPresv.Fields.mesure_tm} <= '{DateTime.Now.ToString("yyyy-MM-dd 23:59:59")}' 
                                    order by {Model.History.FacilityPresv.Fields.mesure_tm}";

                IEnumerable<Model.History.FacilityPresv> presvHis = m_dataManager.GetSelect().Select<Model.History.FacilityPresv>(strConditions, out strErrMsg);
                if (presvHis == null)
                {
                    throw new ApplicationException("Select History.FacilityPresv Error: " + strErrMsg);
                }

                List<Model.History.FacilityPresv> presvHisDatas = presvHis.ToList();

                res.PowerInfos = new List<FacilityInfo>();

                double dMaxY = 0;

                foreach (Model.History.FacilityPresv data in presvHisDatas)
                {
                    //FacilityInfo facilityInfo = res.PowerInfo;
                    FacilityInfo facilityInfo = res.PowerInfos.Find(x => x.mesure_id == data.mesure_id);

                    if (facilityInfo == null)
                    {
                        facilityInfo = new FacilityInfo();

                        string strTagName = GetTagName(data.mesure_id);
                        if (strTagName == null)
                            continue;

                        strTagName = ChangePowerTagName(strTagName);
                        if (strTagName == null)
                            continue;

                        facilityInfo.TagName = strTagName;

                        facilityInfo.fclty_presv_name = presv.fclty_presv_name;
                        facilityInfo.mesure_id = data.mesure_id;

                        facilityInfo.IsAlarmFacility = true;

                        facilityInfo.mesure_uom = data.mesure_uom;

                        facilityInfo.Predicts = new List<FacilityHistoryData>();
                        facilityInfo.Mesures = new List<FacilityHistoryData>();

                        res.PowerInfos.Add(facilityInfo);
                    }

                    List<FacilityHistoryData> facilityHistoryDatas;

                    // Y축 최대 값 관련
                    if ((facilityInfo.TagName == TAG_FORECAST || facilityInfo.TagName == TAG_POWERACTIVE) &&
                        data.mesure_value > 0 && (data.mesure_value > dMaxY))
                    {
                        dMaxY = Math.Round(data.mesure_value, 3);
                    }

                    if (data.data_ty_code == FacilityDataType.Measurement)
                    {   // 계측 이력
                        facilityHistoryDatas = facilityInfo.Mesures;
                    }
                    else
                    {   // 예측 이력

                        // 예측 데이터에만 임계치 정보가 존재                        
                        if (data.mesure_lim_level_1 != null && data.mesure_lim_level_2 != null && data.mesure_lim_level_3 != null && data.mesure_lim_level_4 != null && data.mesure_lim_level_5 != null)
                        {
                            facilityInfo.nLimit1 = Math.Round(data.mesure_lim_level_2 == null ? 0 : data.mesure_lim_level_2.Value, 3);
                            facilityInfo.nLimit2 = Math.Round(data.mesure_lim_level_3 == null ? 0 : data.mesure_lim_level_3.Value, 3);
                            facilityInfo.nLimit3 = Math.Round(data.mesure_lim_level_4 == null ? 0 : data.mesure_lim_level_4.Value, 3);
                            facilityInfo.nLimit4 = Math.Round(data.mesure_lim_level_5 == null ? 0 : data.mesure_lim_level_5.Value, 3);


                            //facilityInfo.max_y = facilityInfo.nLimit4 + (facilityInfo.nLimit4 - facilityInfo.nLimit3);
                            //if (facilityInfo.max_y.HasValue)
                            //    facilityInfo.max_y = Math.Round(facilityInfo.max_y.Value, 3);
                            double max_y = facilityInfo.nLimit4 + (facilityInfo.nLimit4 - facilityInfo.nLimit3);
                            max_y = Math.Round(max_y, 3);

                            if (facilityInfo.max_y == null || max_y > facilityInfo.max_y)
                            {
                                facilityInfo.max_y = max_y;
                            }
                            if (dMaxY > facilityInfo.max_y)
                            {
                                facilityInfo.max_y = dMaxY;
                            }                            
                        }

                        facilityHistoryDatas = facilityInfo.Predicts;
                    }

                    FacilityHistoryData historyData = new FacilityHistoryData();
                    historyData.mesure_tm = data.mesure_tm;
                    historyData.mesure_value = Math.Round(data.mesure_value, 3);
                   
                    facilityHistoryDatas.Add(historyData);
                }

                string strSQL = @$"SELECT his.{Model.History.FacilityPresv.Fields.mesure_id}, his.{Model.History.FacilityPresv.Fields.mesure_value}, his.{Model.History.FacilityPresv.Fields.mesure_uom}
                                    FROM {Model.History.FacilityPresv.TableName} his
                                    INNER JOIN (
                                        SELECT {Model.History.FacilityPresv.Fields.mesure_id}, MAX({Model.History.FacilityPresv.Fields.mesure_tm}) AS MaxTime
                                        FROM {Model.History.FacilityPresv.TableName}
                                        WHERE {Model.History.FacilityPresv.Fields.data_ty_code} = {FacilityDataType.Measurement}
                                        GROUP BY {Model.History.FacilityPresv.Fields.mesure_id}                                        
                                    ) AS his2
                                    ON his.{Model.History.FacilityPresv.Fields.mesure_id} = his2.{Model.History.FacilityPresv.Fields.mesure_id} AND his.{Model.History.FacilityPresv.Fields.mesure_tm} = his2.MaxTime
                                    WHERE his.{Model.History.FacilityPresv.Fields.fclty_id} = '{presv.fclty_id}' AND his.{Model.History.FacilityPresv.Fields.data_ty_code} = {FacilityDataType.Measurement}";

                IEnumerable<dynamic> result = m_dataManager.GetSelect().Select(strSQL, out strErrMsg);

                if (result == null)
                {
                    throw new ApplicationException($"INNER JOIN Error; {strErrMsg}");
                }

                res.PowerDatas = new List<MesureData>();

                foreach (var item in result)
                {
                    string mesure_id = item.mesure_id;
                    double mesure_value = item.mesure_value;
                    string mesure_uom = item.mesure_uom;

                    string strTagName = GetTagName(mesure_id);
                    if (strTagName == null)
                        continue;

                    strTagName = ChangePowerTagName(strTagName);
                    if (strTagName == null)
                        continue;

                    MesureData data = new MesureData();
                    data.mesure_id = mesure_id;
                    data.mesure_uom = mesure_uom;
                    data.mesure_value = Math.Round(mesure_value, 3);
                    data.TagName = strTagName;

                    res.PowerDatas.Add(data);
                }

                res.Success = true;
            }
            catch (Exception e)
            {
                res.Success = false;
                res.Message = $"GetPowerHistory Error: {e.Message}";
            }

            return res;
        }

        public ResponseFacilityMesureData GetFacilityMesureData(int presvNo)
        {
            ResponseFacilityMesureData res = new ResponseFacilityMesureData();

            try
            {
                string strConditions = $"{FacilityPresv.Fields.fclty_presv_sn} = {presvNo}";

                FacilityPresv presv = m_dataManager.GetSelect().SelectFirst<FacilityPresv>(strConditions, out string strErrMsg);
                if (presv == null)
                {
                    throw new ApplicationException("SelectFirst FacilityPresv Error: " + strErrMsg);
                }

                string strSQL = @$"SELECT his.{Model.History.FacilityPresv.Fields.mesure_id}, his.{Model.History.FacilityPresv.Fields.mesure_value}, his.{Model.History.FacilityPresv.Fields.mesure_uom}
                                    FROM {Model.History.FacilityPresv.TableName} his
                                    INNER JOIN (
                                        SELECT {Model.History.FacilityPresv.Fields.mesure_id}, MAX({Model.History.FacilityPresv.Fields.mesure_tm}) AS MaxTime
                                        FROM {Model.History.FacilityPresv.TableName}
                                        GROUP BY {Model.History.FacilityPresv.Fields.mesure_id}
                                    ) AS his2
                                    ON his.{Model.History.FacilityPresv.Fields.mesure_id} = his2.{Model.History.FacilityPresv.Fields.mesure_id} AND his.{Model.History.FacilityPresv.Fields.mesure_tm} = his2.MaxTime
                                    WHERE his.{Model.History.FacilityPresv.Fields.fclty_id} = '{presv.fclty_id}'";

                IEnumerable<dynamic> result = m_dataManager.GetSelect().Select(strSQL, out strErrMsg);

                if (result == null)
                {
                    throw new ApplicationException($"INNER JOIN Error; {strErrMsg}");
                }

                res.fclty_presv_name = presv.fclty_presv_name;

                res.Mesures = new List<MesureData>();

                foreach (var item in result)
                {
                    string mesure_id = item.mesure_id;
                    double mesure_value = item.mesure_value;
                    string mesure_uom = item.mesure_uom;

                    string strTagName = GetTagName(mesure_id);
                    if (strTagName == null)
                        continue;

                    MesureData data = new MesureData();
                    data.mesure_id = mesure_id;
                    data.mesure_uom = mesure_uom;
                    data.mesure_value = Math.Round(mesure_value, 3);
                    data.TagName = strTagName;

                    res.Mesures.Add(data);
                }

                res.Success = true;
            }
            catch (Exception e)
            {
                res.Success = false;
                res.Message = $"GetFacilityMesureData Error: {e.Message}";
            }

            return res;
        }


        public ResponseFcltyPresvList GetFcltyPresvList()
        {
            ResponseFcltyPresvList res = new ResponseFcltyPresvList();

            try
            {
                IEnumerable<FacilityPresv> _presvs = m_dataManager.GetSelect().Select<FacilityPresv>(null, out string strErrMsg);
                if (_presvs == null)
                {
                    throw new ApplicationException("Select FacilityPresv Error: " + strErrMsg);
                }

                List<FacilityPresv> presvs = _presvs.ToList();

                res.FcltyPresvInfos = presvs;

                res.Success = true;
            }
            catch (Exception e)
            {
                res.Success = false;
                res.Message = $"GetFcltyPresvList Error: {e.Message}";
            }

            return res;
        }

        public ResponseFcltyAnalysis GetFcltyAnalysis(int nSensorID)
        {
            ResponseFcltyAnalysis res = new ResponseFcltyAnalysis();

            try
            {
                string strConditions = $"{FacilityPresv.Fields.sensor_sn} = {nSensorID}";

                FacilityPresv presv = m_dataManager.GetSelect().SelectFirst<FacilityPresv>(strConditions, out string strErrMsg);
                if (presv == null)
                {
                    throw new ApplicationException("SelectFirst FacilityPresv Error: " + strErrMsg);
                }

                res.fclty_name = presv.fclty_presv_name;


                if (presv.fclty_ty_code == FacilityType.PreTreatment)
                {    // 설비

                    // 24시간 이전 기록 불러오기
                    DateTime date = DateTime.Now.AddHours(-24);
                    strConditions = @$"{Model.History.FacilityPresv.Fields.fclty_id} = '{presv.fclty_id}' and {Model.History.FacilityPresv.Fields.mesure_tm} >= '{date.ToString("yyyy-MM-dd HH:mm:ss")}' and {Model.History.FacilityPresv.Fields.mesure_tm} <= '{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")}' 
                                        AND {Model.History.FacilityPresv.Fields.mesure_id} = '{presv.presv_mesure_id}' order by {Model.History.FacilityPresv.Fields.mesure_tm}";

                    IEnumerable<Model.History.FacilityPresv> presvHis = m_dataManager.GetSelect().Select<Model.History.FacilityPresv>(strConditions, out strErrMsg);
                    if (presvHis == null)
                    {
                        throw new ApplicationException("Select History.FacilityPresv Error: " + strErrMsg);
                    }

                    List<Model.History.FacilityPresv> presvHisDatas = presvHis.ToList();

                    if (presv.fclty_id == MB_Polisher_ID)
                    {
                        res.max_y = 10;

                        res.nLimit1 = 7.252;
                        res.nLimit2 = 7.765;
                        res.nLimit3 = 8.279;
                        res.nLimit4 = 8.792;
                    }
                    else if (presv.fclty_id == RO_SAFETY_FILTER_ID)
                    {
                        res.max_y = 0.32;

                        res.nLimit1 = 0.177;
                        res.nLimit2 = 0.214;
                        res.nLimit3 = 0.252;
                        res.nLimit4 = 0.29;
                    }

                    res.Predicts = new List<FacilityHistoryData>();

                    foreach (Model.History.FacilityPresv data in presvHisDatas)
                    {
                        FacilityHistoryData historyData = new FacilityHistoryData();
                        historyData.mesure_tm = data.mesure_tm;
                        historyData.mesure_value = Math.Round(data.mesure_value, 3);

                        // Y축 최대 값 관련
                        if (historyData.mesure_value > 0 && historyData.mesure_value > res.max_y)
                        {
                            res.max_y = historyData.mesure_value;
                        }

                        res.Predicts.Add(historyData);
                    }                    
                }
                else if (presv.fclty_ty_code == FacilityType.PowerMonitoring)
                {   // 전력
                    DateTime date = DateTime.Today;
                    strConditions = @$"{Model.History.FacilityPresv.Fields.fclty_id} = '{presv.fclty_id}' and {Model.History.FacilityPresv.Fields.mesure_tm} >= '{date.ToString("yyyy-MM-dd 00:00:00")}' and {Model.History.FacilityPresv.Fields.mesure_tm} <= '{DateTime.Now.ToString("yyyy-MM-dd 23:59:59")}' 
                                        order by {Model.History.FacilityPresv.Fields.mesure_tm}";

                    IEnumerable<Model.History.FacilityPresv> presvHis = m_dataManager.GetSelect().Select<Model.History.FacilityPresv>(strConditions, out strErrMsg);
                    if (presvHis == null)
                    {
                        throw new ApplicationException("Select History.FacilityPresv Error: " + strErrMsg);
                    }

                    List<Model.History.FacilityPresv> presvHisDatas = presvHis.ToList();

                    List<FacilityInfo> facilityInfos = new List<FacilityInfo>();

                    double dMaxY = 0;

                    foreach (Model.History.FacilityPresv data in presvHisDatas)
                    {
                        FacilityInfo facilityInfo = facilityInfos.Find(x => x.mesure_id == data.mesure_id);

                        if (facilityInfo == null)
                        {
                            facilityInfo = new FacilityInfo();

                            string strTagName = GetTagName(data.mesure_id);
                            if (strTagName == null)
                                continue;

                            strTagName = ChangePowerTagName(strTagName);
                            if (strTagName == null)
                                continue;

                            facilityInfo.TagName = strTagName;

                            facilityInfo.fclty_presv_name = presv.fclty_presv_name;
                            facilityInfo.mesure_id = data.mesure_id;

                            facilityInfo.IsAlarmFacility = true;

                            facilityInfo.mesure_uom = data.mesure_uom;

                            facilityInfo.Predicts = new List<FacilityHistoryData>();
                            facilityInfo.Mesures = new List<FacilityHistoryData>();

                            facilityInfos.Add(facilityInfo);
                        }

                        List<FacilityHistoryData> facilityHistoryDatas;


                        // Y축 최대 값 관련
                        if ((facilityInfo.TagName == TAG_FORECAST || facilityInfo.TagName == TAG_POWERACTIVE) &&
                            data.mesure_value > 0 && (data.mesure_value > dMaxY))
                        {
                            dMaxY = Math.Round(data.mesure_value, 3);
                        }

                        if (data.data_ty_code == FacilityDataType.Measurement)
                        {   // 계측 이력
                            facilityHistoryDatas = facilityInfo.Mesures;
                        }
                        else
                        {   // 예측 이력

                            // 예측 데이터에만 임계치 정보가 존재                        
                            if (data.mesure_lim_level_1 != null && data.mesure_lim_level_2 != null && data.mesure_lim_level_3 != null && data.mesure_lim_level_4 != null && data.mesure_lim_level_5 != null)
                            {
                                facilityInfo.nLimit1 = Math.Round(data.mesure_lim_level_2 == null ? 0 : data.mesure_lim_level_2.Value, 3);
                                facilityInfo.nLimit2 = Math.Round(data.mesure_lim_level_3 == null ? 0 : data.mesure_lim_level_3.Value, 3);
                                facilityInfo.nLimit3 = Math.Round(data.mesure_lim_level_4 == null ? 0 : data.mesure_lim_level_4.Value, 3);
                                facilityInfo.nLimit4 = Math.Round(data.mesure_lim_level_5 == null ? 0 : data.mesure_lim_level_5.Value, 3);

                                //facilityInfo.max_y = facilityInfo.nLimit4 + (facilityInfo.nLimit4 - facilityInfo.nLimit3);
                                //if (facilityInfo.max_y.HasValue)
                                //    facilityInfo.max_y = Math.Round(facilityInfo.max_y.Value, 3);
                                double max_y = facilityInfo.nLimit4 + (facilityInfo.nLimit4 - facilityInfo.nLimit3);
                                max_y = Math.Round(max_y, 3);

                                if (facilityInfo.max_y == null || max_y > facilityInfo.max_y)
                                {
                                    facilityInfo.max_y = max_y;
                                }
                                if (dMaxY > facilityInfo.max_y)
                                {
                                    facilityInfo.max_y = dMaxY;
                                }
                            }

                            facilityHistoryDatas = facilityInfo.Predicts;
                        }

                        FacilityHistoryData historyData = new FacilityHistoryData();
                        historyData.mesure_tm = data.mesure_tm;
                        historyData.mesure_value = Math.Round(data.mesure_value, 3);

                        // Y축 최대 값 관련
                        //if ((facilityInfo.TagName == TAG_FORECAST || facilityInfo.TagName == TAG_POWERACTIVE) &&
                        //    historyData.mesure_value > 0 && historyData.mesure_value > facilityInfo.max_y)
                        //{
                        //    facilityInfo.max_y = historyData.mesure_value;
                        //}

                        facilityHistoryDatas.Add(historyData);
                    }

                    foreach (FacilityInfo facilityInfo in facilityInfos)
                    {
                        if (facilityInfo.TagName == TAG_FORECAST)
                        {
                            res.Predicts = facilityInfo.Predicts;

                            // 예측 데이터에만 임계치 정보가 존재
                            res.nLimit1 = Math.Round(facilityInfo.nLimit1, 3);
                            res.nLimit2 = Math.Round(facilityInfo.nLimit2, 3);
                            res.nLimit3 = Math.Round(facilityInfo.nLimit3, 3);
                            res.nLimit4 = Math.Round(facilityInfo.nLimit4, 3);

                            res.max_y = facilityInfo.max_y != null ? facilityInfo.max_y.Value : 0;
                            res.max_y = Math.Round(res.max_y, 3);
                        }
                        else if (facilityInfo.TagName == TAG_POWERACTIVE)
                        {
                            res.Mesures = facilityInfo.Mesures;
                        }
                    }
                }
                else
                {
                    throw new ApplicationException("presv fclty_ty_code 값이 올바르지 않습니다.: " + presv.fclty_ty_code);
                }

                res.Success = true;
            }
            catch (Exception e)
            {
                res.Success = false;
                res.Message = $"GetFcltyAnalysis Error: {e.Message}";
            }

            return res;
        }

        public void InitTagNames()
        {
            m_dicTagNames["7e8f90a1b-f678-407e-8ff0-3f7a012345f6"] = "전단 유량(m³/hr)";
            m_dicTagNames["b9c0d1e2-f3a4-418f-9001-408b123456a7"] = "수위(%)";
            m_dicTagNames["7e8f90a1b-8f01-43a1-b223-62ad901234a5"] = "B Outlet Flow 유량(m³/hr)";
            m_dicTagNames["b9c0d1e2-f3a4-44b2-c334-73be012345b6"] = "A Outlet Flow 유량(m³/hr)";
            m_dicTagNames["d1e2f3a4-b5c6-48f6-0778-b7f2456789f0"] = "수위(%)";
            m_dicTagNames["a1b2c3d4-e6f7-4907-1889-c803567890a1"] = "수위(%)";
            m_dicTagNames["59e0a241-11d2-4e94-9642-4f81017e8841"] = "전단 압력센서";
            m_dicTagNames["601c20e5-7975-47e2-a083-d53347c617c5"] = "후단 압력센서";
            m_dicTagNames["749170ac-4131-4171-8742-b06222e92c55"] = "전단 유량센서(m³/hr)";
            m_dicTagNames["8f2e1b4a-5d6c-7e8f-9a0b-1c2d3e4f5a6b"] = "전처리 필터 이상치";
            m_dicTagNames["c0d1e2f3-a4b5-43a1-b223-62ad345678c9"] = "온도(°C)";
            m_dicTagNames["a8b9c0d1-e2f3-4f6d-7eef-2e69901234e5"] = "후단 전도도(μS/cm)";
            m_dicTagNames["d4e5f67a-b9c0-4c3a-4bbc-fbb6234567f8"] = "후단 전도도(μS/cm)";
            m_dicTagNames["8f90a1b2-9012-45c3-d445-84cf123456c7"] = "수위(%)";
            m_dicTagNames["c3d4e5f6-a8b9-4a18-299a-d914012345d6"] = "전단 전도도(μS/cm)";
            m_dicTagNames["90a1b2c3-a123-47e5-f667-a6e1345678e9"] = "수위(%)";
            m_dicTagNames["3a4b5c6d-4bcd-4b29-3aab-eaf5123456e7"] = "후단 전도도(μS/cm)";
            m_dicTagNames["1e2f3a4b-b234-4a18-299a-d914678901b2"] = "후단 전도도(μS/cm)";
            m_dicTagNames["0815339d-21d4-42f1-a185-177b949989a1"] = "B 저항률(MΩ·cm)";
            m_dicTagNames["271c6d86-06a1-424a-b51f-6184589255a0"] = "C 저항률(MΩ·cm)";
            m_dicTagNames["3b0f5125-9e32-411a-826f-a892b1a37c38"] = "D 저항률(MΩ·cm)";
            m_dicTagNames["459a997d-c23d-426b-9528-761c569269d0"] = "후단 저항률(MΩ·cm)";
            m_dicTagNames["513a854d-d7e7-449e-8c34-8c813a44f9f7"] = "후단 유량(m³/hr)";
            m_dicTagNames["9f6c019d-7e28-4c8d-8a1e-8e4f1a2b3c4d"] = "MB Polisher 이상치";
            m_dicTagNames["4b5c6d7e-5cde-4d4b-5ccd-0c47345678a9"] = "온도(°C)";
            m_dicTagNames["c0d1e2f3-a4b5-46d4-e556-95d0234567d8"] = "수위(%)";
            m_dicTagNames["e5f67a8b-c0d1-4e5c-6dde-1d58456789b0"] = "전단 온도(°C)";
            m_dicTagNames["2f3a4b5c-3abc-4907-1889-c803901234c5"] = "후단 저항률(MΩ·cm)";
            m_dicTagNames["b2c3d4e5-f7a8-48f6-0778-b7f2890123b4"] = "후단 저항률(MΩ·cm)";
            m_dicTagNames["1e2f3a4b-29ab-47e5-f667-a6e1789012a3"] = "후단 저항률(MΩ·cm)";
            m_dicTagNames["a8b9c0d1-e2f3-4290-a112-519c890123f4"] = "후단 유량(m³/hr)";
            m_dicTagNames["6d7e8f90-e567-4e5c-6dde-1d58890123d4"] = "입자(Particle)(ppb)";
            m_dicTagNames["90a1b2c3-189a-44b2-c334-73be456789d0"] = "TOC(ppb)";
            m_dicTagNames["d1e2f3a4-b5c6-45c3-d445-84cf567890e1"] = "Boron(ppb)";
            m_dicTagNames["6d7e8f90-7ef0-418f-9001-408b789012e3"] = "후단 유량(m³/hr)";
            m_dicTagNames["8f90a1b2-0789-4290-a112-519c234567b8"] = "압력(Mpa)";
            m_dicTagNames["a1b2c3d4-e6f7-46d4-e556-95d0678901f2"] = "저항률(MΩ·cm)";
            m_dicTagNames["5c6d7e8f-6def-4f6d-7eef-2e69567890c1"] = "전단 유량(m³/hr)";
            m_dicTagNames["f67a8b9c-d1e2-407e-8ff0-3f7a678901d2"] = "후단 유량(m³/hr)";
            m_dicTagNames["1e2f3a4b-7e8f-4e5c-6dde-1d58012345d6"] = "ATS-01-1 Vrs(V)";
            m_dicTagNames["b2c3d4e5-f7a8-4f6d-7eef-2e69123456e7"] = "ATS-01-1 Vst(V)";
            m_dicTagNames["2f3a4b5c-8f90-407e-8ff0-3f7a234567f8"] = "ATS-01-1 Vtr(V)";
            m_dicTagNames["c3d4e5f6-a8b9-418f-9001-408b345678a9"] = "ATS-01-1 Ar(A)";
            m_dicTagNames["3a4b5c6d-90a1-4290-a112-519c456789b0"] = "ATS-01-1 As(A)";
            m_dicTagNames["d4e5f67a-b9c0-43a1-b223-62ad567890c1"] = "ATS-01-1 At(A)";
            m_dicTagNames["4b5c6d7e-a1b2-44b2-c334-73be678901d2"] = "ATS-01-1 전력(kW)";
            m_dicTagNames["e5f67a8b-c0d1-45c3-d445-84cf789012e3"] = "ATS-01-1 유효전력량(kWh)";
            m_dicTagNames["5c6d7e8f-b2c3-46d4-e556-95d0890123f4"] = "ATS-01-1 역률(%)";
            m_dicTagNames["f67a8b9c-d1e2-47e5-f667-a6e1901234a5"] = "ATS-01-1 주파수(Hz)";
            m_dicTagNames["6d7e8f90-c3d4-48f6-0778-b7f2012345b6"] = "ATS-01-1 누설전류(mA)";
            m_dicTagNames["18f6a7b8-c9d0-4345-b678-90a1b2c3d4e5"] = "ATS-01-1 전력예측값(kWh)";
            m_dicTagNames["a8b9c0d1-e2f3-4907-1889-c803123456c7"] = "ATS-01-1 수요전력 최대값(kW)";
            m_dicTagNames["0a1b2c3d-4e5f-4012-8345-67890a1b2c3d"] = "ATS-01-2 Vrs(V)";
            m_dicTagNames["1b2c3d4e-5f6a-4123-9456-7890a1b2c3d4"] = "ATS-01-2 Vst(V)";
            m_dicTagNames["2c3d4e5f-6a7b-4234-a567-890a1b2c3d4e"] = "ATS-01-2 Vtr(V)";
            m_dicTagNames["3d4e5f6a-7b8c-4345-b678-90a1b2c3d4e5"] = "ATS-01-2 Ar(A)";
            m_dicTagNames["4e5f6a7b-8c9d-4456-c789-a1b2c3d4e5f6"] = "ATS-01-2 As(A)";
            m_dicTagNames["5f6a7b8c-9d0e-4567-d890-b2c3d4e5f6a7"] = "ATS-01-2 At(A)";
            m_dicTagNames["6a7b8c9d-0e1f-4678-e901-c3d4e5f6a7b8"] = "ATS-01-2 전력(kW)";
            m_dicTagNames["7b8c9d0e-1f2a-4789-f012-d4e5f6a7b8c9"] = "ATS-01-2 유효전력량(kWh)";
            m_dicTagNames["8c9d0e1f-2a3b-4890-0123-e5f6a7b8c9d0a"] = "ATS-01-2 역률(%)";
            m_dicTagNames["9d0e1f2a-3b4c-4901-1234-f6a7b8c9d0e1b"] = "ATS-01-2 주파수(Hz)";
            m_dicTagNames["a1b2c3d4-e5f6-4a12-2345-07b8c9d0e1f2c"] = "ATS-01-2 누설전류(mA)";
            m_dicTagNames["b2c3d4e5-f6a7-4b23-3456-18c9d0e1f2a3d"] = "ATS-01-2 수요전력 최대값(kW)";
            m_dicTagNames["2907b8c9-d0e1-4456-c789-a1b2c3d4e5f6"] = "ATS-01-2 전력예측값(kWh)";
            m_dicTagNames["c3d4e5f6-a7b8-4c34-4567-29d0e1f2a3b4e"] = "ATS-01-3 Vrs(V)";
            m_dicTagNames["d4e5f6a7-b8c9-4d45-5678-3a1e2f3a4b5c6"] = "ATS-01-3 Vst(V)";
            m_dicTagNames["e5f6a7b8-c9d0-4e56-6789-4b2f3a4b5c6d7"] = "ATS-01-3 Vtr(V)";
            m_dicTagNames["f6a7b8c9-d0e1-4f67-7890-5c3a4b5c6d7e8"] = "ATS-01-3 Ar(A)";
            m_dicTagNames["07b8c9d0-e1f2-4078-8901-6d4b5c6d7e8f9"] = "ATS-01-3 As(A)";
            m_dicTagNames["18c9d0e1-f2a3-4189-9012-7e5c6d7e8f90a"] = "ATS-01-3 At(A)";
            m_dicTagNames["29d0e1f2-a3b4-4290-a123-8f6d7e8f90a1b"] = "ATS-01-3 전력(kW)";
            m_dicTagNames["3a1e2f3a-4b5c-43a1-b234-907e8f90a1b2c"] = "ATS-01-3 유효전력량(kWh)";
            m_dicTagNames["4b2f3a4b-5c6d-44b2-c345-a18f90a1b2c3d"] = "ATS-01-3 역률(%)";
            m_dicTagNames["5c3a4b5c-6d7e-45c3-d456-b290a1b2c3d4e"] = "ATS-01-3 주파수(Hz)";
            m_dicTagNames["6d4b5c6d-7e8f-46d4-e567-c3a1b2c3d4e5f"] = "ATS-01-3 누설전류(mA)";
            m_dicTagNames["7e5c6d7e-8f90-47e5-f678-d4b2c3d4e5f6a"] = "ATS-01-3 수요전력 최대값(kW)";
            m_dicTagNames["3a18c9d0-e1f2-4567-d890-b2c3d4e5f607"] = "ATS-01-3 전력예측값(kWh)";
            m_dicTagNames["8f6d7e8f-90a1b-48f6-0789-e5c3d4e5f6a7b"] = "ATS-01-6 Vrs(V)";
            m_dicTagNames["907e8f90-a1b2c-4907-189a-f6d4e5f6a7b8c"] = "ATS-01-6 Vst(V)";
            m_dicTagNames["a18f90a1-b2c3d-4a18-29ab-07e5f6a7b8c9d"] = "ATS-01-6 Vtr(V)";
            m_dicTagNames["b290a1b2-c3d4e-4b29-3abc-18f6a7b8c9d0e"] = "ATS-01-6 Ar(A)";
            m_dicTagNames["c3a1b2c3-d4e5f-4c3a-4bcd-2907b8c9d0e1f"] = "ATS-01-6 As(A)";
            m_dicTagNames["d4b2c3d4-e5f6a-4d4b-5cde-3a18c9d0e1f2a"] = "ATS-01-6 At(A)";
            m_dicTagNames["e5c3d4e5-f6a7b-4e5c-6def-4b29d0e1f2a3b"] = "ATS-01-6 전력(kW)";
            m_dicTagNames["f6d4e5f6-a7b8c-4f6d-7ef0-5c3a1e2f3a4b5"] = "ATS-01-6 유효전력량(kWh)";
            m_dicTagNames["07e5f6a7-b8c9d-407e-8f01-6d4b2f3a4b5c6"] = "ATS-01-6 역률(%)";
            m_dicTagNames["18f6a7b8-c9d0e-418f-9012-7e5c3a4b5c6d7"] = "ATS-01-6 주파수(Hz)";
            m_dicTagNames["2907b8c9-d0e1f-4290-a123-8f6d4b5c6d7e8"] = "ATS-01-6 누설전류(mA)";
            m_dicTagNames["3a18c9d0-e1f2a-43a1-b234-907e5c6d7e8f9"] = "ATS-01-6 수요전력 최대값(kW)";
            m_dicTagNames["4b29d0e1-f2a3-4678-e901-c3d4e5f60718"] = "ATS-01-6 전력예측값(kWh)";
            m_dicTagNames["4b29d0e1f-2a3b-44b2-c345-a18f6d7e8f90a"] = "ATS-01-8 Vrs(V)";
            m_dicTagNames["5c3a1e2f-3a4b-45c3-d456-b2907e8f90a1b"] = "ATS-01-8 Vst(V)";
            m_dicTagNames["6d4b2f3a-4b5c-46d4-e567-c3a18f90a1b2c"] = "ATS-01-8 Vtr(V)";
            m_dicTagNames["7e5c3a4b-5c6d-47e5-f678-d4b290a1b2c3d"] = "ATS-01-8 Ar(A)";
            m_dicTagNames["8f6d4b5c-6d7e-48f6-0789-e5c3a1b2c3d4e"] = "ATS-01-8 As(A)";
            m_dicTagNames["907e5c6d-7e8f-4907-189a-f6d4b2c3d4e5f"] = "ATS-01-8 At(A)";
            m_dicTagNames["a18f6d7e-8f90-4a18-29ab-07e5c3d4e5f6a"] = "ATS-01-8 전력(kW)";
            m_dicTagNames["b2907e8f-90a1-4b29-3abc-18f6d4e5f6a7b"] = "ATS-01-8 유효전력량(kWh)";
            m_dicTagNames["c3a18f90-a1b2-4c3a-4bcd-2907e5f6a7b8c"] = "ATS-01-8 역률(%)";
            m_dicTagNames["d4b290a1b-2c3d-4d4b-5cde-3a18f6a7b8c9d"] = "ATS-01-8 주파수(Hz)";
            m_dicTagNames["e5c3a1b2-c3d4-4e5c-6def-4b2907b8c9d0e"] = "ATS-01-8 누설전류(mA)";
            m_dicTagNames["f6d4b2c3-d4e5-4f6d-7ef0-5c3a18c9d0e1f"] = "ATS-01-8 수요전력 최대값(kW)";
            m_dicTagNames["5c3a1e2f-3a4b-4789-f012-d4e5f6071829"] = "ATS-01-8 전력예측값(kWh)";
            m_dicTagNames["8d9e0f1a-2b3c-4d45-5678-9abcde56789a"] = "L-01-2 Vrs(V)";
            m_dicTagNames["f4a5b6c7-d8e9-4e56-6789-abcde6789ab0"] = "L-01-2 Vst(V)";
            m_dicTagNames["9e0f1a2b-3c4d-4f67-789a-bcde789ab12c"] = "L-01-2 Vtr(V)";
            m_dicTagNames["0f1a2b3c-4d5e-4078-89ab-cde789ab234d"] = "L-01-2 Ar(A)";
            m_dicTagNames["a2b3c4d5-e6f7-4189-9abc-de89ab3456e5"] = "L-01-2 As(A)";
            m_dicTagNames["1a2b3c4d-4e5f-429a-abcde-f90ab45678f6"] = "L-01-2 At(A)";
            m_dicTagNames["b3c4d5e6-f7a8-43a1-bcdef-0a1b567890a7"] = "L-01-2 전력(kW)";
            m_dicTagNames["2b3c4d5e-5f6a-44b2-cdef0-1b2c678901b8"] = "L-01-2 유효전력량(kWh)";
            m_dicTagNames["c4d5e6f7-a8b9-45c3-def01-2c3d789012c9"] = "L-01-2 역률(%)";
            m_dicTagNames["3c4d5e6f-6a7b-46d4-ef012-3d4e890123d0"] = "L-01-2 주파수(Hz)";
            m_dicTagNames["d5e6f7a8-b9c0-47e5-f0123-4e5f901234e1"] = "L-01-2 누설전류(mA)";
            m_dicTagNames["4d5e6f7a-7b8c-48f6-01234-5f6a012345f2"] = "L-01-2 수요전력 최대값(kW)";
            m_dicTagNames["7e5c3a4b-5c6d-4907-189a-f60718293a4b"] = "L-01-2 전력예측값(kWh)";
            m_dicTagNames["f6a7b8c9-d0e1-46d4-8d9e-0f1a2b3c4d5e"] = "L-01-3 Vrs(V)";
            m_dicTagNames["5b6c7d8e-9f0a-47e5-9e0f-1a2b3c4d5e6f"] = "L-01-3 Vst(V)";
            m_dicTagNames["0001f2f8-9a0b-411c-a2d3-4e5f67a8b9c0"] = "L-01-3 Vtr(V)";
            m_dicTagNames["f1f2f3f4-5678-4012-89ab-cdef01234567"] = "L-01-3 Ar(A)";
            m_dicTagNames["a2d3e4f5-6789-4234-9abc-def012345678"] = "L-01-3 As(A)";
            m_dicTagNames["3f4e5d6c-7b8a-4345-bcde-f0123456789a"] = "L-01-3 At(A)";
            m_dicTagNames["8e9f0a1b-2c3d-4456-cdef-0123456789ab"] = "L-01-3 전력(kW)";
            m_dicTagNames["4f5e6d7c-8b9a-4567-def0-123456789abc"] = "L-01-3 유효전력량(kWh)";
            m_dicTagNames["b0c1d2e3-f4a5-4678-e012-3456789abcde"] = "L-01-3 역률(%)";
            m_dicTagNames["5a6b7c8d-9e0f-4789-f123-456789abcdef"] = "L-01-3 주파수(Hz)";
            m_dicTagNames["c1d2e3f4-a5b6-4890-0123-456789abcde0"] = "L-01-3 누설전류(mA)";
            m_dicTagNames["6b7c8d9e-0f1a-4901-1234-56789abcde12"] = "L-01-3 수요전력 최대값(kW)";
            m_dicTagNames["8f6d4b5c-6d7e-4a18-29ab-0718293a4b5c"] = "L-01-3 전력예측값(kWh)";
            m_dicTagNames["c69e20a4-7b8c-4d1f-8e3b-9a0c1d2e3f45"] = "L-01-4 Vrs(V)";
            m_dicTagNames["3f4e5d6c-7b8a-4a2e-9c1d-0e3f4a5b6c7d"] = "L-01-4 Vst(V)";
            m_dicTagNames["a1b2c3d4-e5f6-4b3f-a0c1-d2e3f4a5b6c8"] = "L-01-4 Vtr(V)";
            m_dicTagNames["0d1e2f3a-4b5c-4c40-b1d2-e3f4a5b6c7d9"] = "L-01-4 Ar(A)";
            m_dicTagNames["b2c3d4e5-f6a7-4d51-c2e3-f4a5b6c7d8e0"] = "L-01-4 As(A)";
            m_dicTagNames["1e2f3a4b-5c6d-4e62-d3f4-a5b6c7d8e9f1"] = "L-01-4 At(A)";
            m_dicTagNames["c3d4e5f6-a7b8-4f73-e4a5-b6c7d8e9f0a2"] = "L-01-4 전력(kW)";
            m_dicTagNames["2f3a4b5c-6d7e-4084-f5b6-c7d8e9f0a1b3"] = "L-01-4 유효전력량(kWh)";
            m_dicTagNames["d4e5f6a7-b8c9-4195-06c7-d8e9f0a1b2c4"] = "L-01-4 역률(%)";
            m_dicTagNames["4b5c6d7e-8f90-42a6-17d8-e9f0a1b2c3d5"] = "L-01-4 주파수(Hz)";
            m_dicTagNames["e5f6a7b8-c9d0-43b7-28e9-f0a1b2c3d4e6"] = "L-01-4 누설전류(mA)";
            m_dicTagNames["5c6d7e8f-90a1-44c8-39f0-a1b2c3d4e5f7"] = "L-01-4 수요전력 최대값(kW)";
            m_dicTagNames["907e5c6d-7e8f-4b29-3abc-18293a4b5c6d"] = "L-01-4 전력예측값(kWh)";
            m_dicTagNames["6e8f90a1-b2c3-4d45-5678-90a1b2c3d4e5"] = "L-01-5 Vrs(V)";
            m_dicTagNames["7f90a1b2-c3d4-4e56-6789-a1b2c3d4e5f6"] = "L-01-5 Vst(V)";
            m_dicTagNames["80a1b2c3-d4e5-4f67-7890-b2c3d4e5f607"] = "L-01-5 Vtr(V)";
            m_dicTagNames["91b2c3d4-e5f6-4078-8901-c3d4e5f60718"] = "L-01-5 Ar(A)";
            m_dicTagNames["a2c3d4e5-f607-4189-9012-d4e5f6071829"] = "L-01-5 As(A)";
            m_dicTagNames["b3d4e5f6-0718-429a-a123-e5f60718293a"] = "L-01-5 At(A)";
            m_dicTagNames["c4e5f607-1829-43b1-b234-f60718293a4b"] = "L-01-5 전력(kW)";
            m_dicTagNames["d5f60718-293a-44c2-c345-0718293a4b5c"] = "L-01-5 유효전력량(kWh)";
            m_dicTagNames["e6071829-3a4b-45d3-d456-18293a4b5c6d"] = "L-01-5 역률(%)";
            m_dicTagNames["f718293a-4b5c-46e4-e567-293a4b5c6d7e"] = "L-01-5 주파수(Hz)";
            m_dicTagNames["08293a4b-5c6d-47f5-f678-3a4b5c6d7e8f"] = "L-01-5 누설전류(mA)";
            m_dicTagNames["193a4b5c-6d7e-4806-0789-4b5c6d7e8f90"] = "L-01-5 수요전력 최대값(kW)";
            m_dicTagNames["a18f6d7e-8f90-4c3a-4bcd-293a4b5c6d7e"] = "L-01-5 전력예측값(kWh)";
            m_dicTagNames["4bbf61bf-3823-4a7a-9270-5f6b4db68869"] = "L-01-6 Vrs(V)";
            m_dicTagNames["71e2f69c-e766-409c-b6e6-b6a7a984a6f0"] = "L-01-6 Vst(V)";
            m_dicTagNames["2c6014a8-95ac-4a45-afc1-6b25bba8fdcc"] = "L-01-6 Vtr(V)";
            m_dicTagNames["e6f7a8b9-c0d1-4907-12345-6a7b123456a3"] = "L-01-6 Ar(A)";
            m_dicTagNames["5e6f7a8b-8c9d-4a18-23456-7b8c234567b4"] = "L-01-6 As(A)";
            m_dicTagNames["f7a8b9c0-d1e2-4b29-34567-8c9d345678c5"] = "L-01-6 At(A)";
            m_dicTagNames["6f7a8b9c-9d0e-4c3a-45678-9d0e456789d6"] = "L-01-6 전력(kW)";
            m_dicTagNames["a8b9c0d1-e2f3-4d4b-56789-0e1f567890e7"] = "L-01-6 유효전력량(kWh)";
            m_dicTagNames["7a8b9c0d-a1b2-4e5c-67890-1f2a678901f8"] = "L-01-6 역률(%)";
            m_dicTagNames["b9c0d1e2-f3a4-4f6d-78901-2a3b789012a9"] = "L-01-6 주파수(Hz)";
            m_dicTagNames["8b9c0d1e-b2c3-407e-89012-3b4c890123b0"] = "L-01-6 누설전류(mA)";
            m_dicTagNames["c0d1e2f3-a4b5-418f-90123-4c5d901234c1"] = "L-01-6 수요전력 최대값(kW)";
            m_dicTagNames["b2907e8f-90a1b-4d4b-5cde-3a4b5c6d7e8f"] = "L-01-6 전력예측값(kWh)";
            m_dicTagNames["9c0d1e2f-c3d4-4290-a1234-5d6e012345d2"] = "L-01-8 Vrs(V)";
            m_dicTagNames["d1e2f3a4-b5c6-43a1-b2345-6e7f123456e3"] = "L-01-8 Vst(V)";
            m_dicTagNames["a2b3c4d5-e6f7-44b2-c3456-7f8a234567f4"] = "L-01-8 Vtr(V)";
            m_dicTagNames["1e2f3a4b-d7e8-45c3-d4567-8a9b345678a5"] = "L-01-8 Ar(A)";
            m_dicTagNames["b3c4d5e6-f7a8-46d4-e5678-9b0c456789b6"] = "L-01-8 As(A)";
            m_dicTagNames["2f3a4b5c-e8f9-47e5-f6789-a0c1567890c7"] = "L-01-8 At(A)";
            m_dicTagNames["c4d5e6f7-a8b9-48f6-0789a-b1d2678901d8"] = "L-01-8 전력(kW)";
            m_dicTagNames["3a4b5c6d-f90a-4907-189ab-c2e3789012e9"] = "L-01-8 유효전력량(kWh)";
            m_dicTagNames["d5e6f7a8-b9c0-4a18-29abc-d3f4890123f0"] = "L-01-8 역률(%)";
            m_dicTagNames["4b5c6d7e-0a1b-4b29-3aabc-e4a5901234a1"] = "L-01-8 주파수(Hz)";
            m_dicTagNames["e6f7a8b9-c0d1-4c3a-4bbcd-f5b6012345b2"] = "L-01-8 누설전류(mA)";
            m_dicTagNames["5c6d7e8f-1b2c-4d4b-5ccde-06c7123456c3"] = "L-01-8 수요전력 최대값(kW)";
            m_dicTagNames["c3a18f90-a1b2c-4e5c-6def-4b5c6d7e8f90"] = "L-01-8 전력예측값(kWh)";
            m_dicTagNames["d4e5f67a-8b9c-4f01-2345-67890a1b2c3d"] = "L-01-9 Vrs(V)";
            m_dicTagNames["7b8c9d0e-1f2a-4345-6789-a0b1c2d3e4f5"] = "L-01-9 Vst(V)";
            m_dicTagNames["e5f67a8b-9c0d-4e1f-2a3b-4c5d6e7f8a9c"] = "L-01-9 Vtr(V)";
            m_dicTagNames["8c9d0e1f-2a3b-4567-890a-b1c2d3e4f568"] = "L-01-9 Ar(A)";
            m_dicTagNames["f67a8b9c-0d1e-4f2a-3b4c-5d6e7f8a9b0c"] = "L-01-9 As(A)";
            m_dicTagNames["9d0e1f2a-3b4c-4678-90a1-b2c3d4e5f67a"] = "L-01-9 At(A)";
            m_dicTagNames["0e1f2a3b-4c5d-4789-0a1b-2c3d4e5f678b"] = "L-01-9 전력(kW)";
            m_dicTagNames["a1b2c3d4-e5f6-4890-1234-567890a1b2c3"] = "L-01-9 유효전력량(kWh)";
            m_dicTagNames["1e2f3a4b-5c6d-4901-2345-67890a1b2c3e"] = "L-01-9 역률(%)";
            m_dicTagNames["b2c3d4e5-f67a-4a1b-2c3d-4e5f67a8b9c0"] = "L-01-9 주파수(Hz)";
            m_dicTagNames["2f3a4b5c-6d7e-4b2c-3d4e-5f67a8b9c0d1"] = "L-01-9 누설전류(mA)";
            m_dicTagNames["c3d4e5f6-7a8b-4c3d-4e5f-67a8b9c0d1e2"] = "L-01-9 수요전력 최대값(kW)";
            m_dicTagNames["d4b290a1b-2c3d-4f6d-7ef0-5c6d7e8f90a1"] = "L-01-9 전력예측값(kWh)";
            m_dicTagNames["f7a8b9c0-d1e2-4e5c-6dde-17d8234567d4"] = "L-01-10 Vrs(V)";
            m_dicTagNames["6d7e8f90-2c3d-4f6d-7eef-28e9345678e5"] = "L-01-10 Vst(V)";
            m_dicTagNames["a8b9c0d1-e2f3-407e-8ff0-39f0456789f6"] = "L-01-10 Vtr(V)";
            m_dicTagNames["7e8f90a1b-3d4e-418f-9001-40a1567890a7"] = "L-01-10 Ar(A)";
            m_dicTagNames["b9c0d1e2-f3a4-4290-a112-51b2678901b8"] = "L-01-10 As(A)";
            m_dicTagNames["8f90a1b2-4e5f-43a1-b223-62c3789012c9"] = "L-01-10 At(A)";
            m_dicTagNames["c0d1e2f3-a4b5-44b2-c334-73d4890123d0"] = "L-01-10 전력(kW)";
            m_dicTagNames["90a1b2c3-5f6a-45c3-d445-84e5901234e1"] = "L-01-10 유효전력량(kWh)";
            m_dicTagNames["d1e2f3a4-b5c6-46d4-e556-95f6012345f2"] = "L-01-10 역률(%)";
            m_dicTagNames["a1b2c3d4-e6f7-47e5-f667-a6a7123456a3"] = "L-01-10 주파수(Hz)";
            m_dicTagNames["1e2f3a4b-6a7b-48f6-0778-b7b8234567b4"] = "L-01-10 누설전류(mA)";
            m_dicTagNames["b2c3d4e5-f7a8-4907-1889-c8c9345678c5"] = "L-01-10 수요전력 최대값(kW)";
            m_dicTagNames["90741b5f-5ba5-4a7a-807f-b930ca1526fb"] = "L-01-10 전력예측값(kWh)";
            m_dicTagNames["d2e3f4a5-b6c7-4a12-2345-6789abcde234"] = "L-01-11 Vrs(V)";
            m_dicTagNames["7c8d9e0f-1a2b-4b23-3456-789abcde3456"] = "L-01-11 Vst(V)";
            m_dicTagNames["e3f4a5b6-c7d8-4c34-4567-89abcde45678"] = "L-01-11 Vtr(V)";
            m_dicTagNames["9f2803f0-5bae-4d82-9a2b-f03361554206"] = "L-01-11 Ar(A)";
            m_dicTagNames["dd6febaa-99b3-4d20-aba1-bbddcaa481ee"] = "L-01-11 As(A)";
            m_dicTagNames["6f903cd3-66ac-4fff-ac22-81ca53881a56"] = "L-01-11 At(A)";
            m_dicTagNames["910d77fd-b2c3-4f4c-be29-7aeb12417107"] = "L-01-11 전력(kW)";
            m_dicTagNames["549cd21f-d978-4d93-8f57-e7b445fd0d61"] = "L-01-11 유효전력량(kWh)";
            m_dicTagNames["a9cbfc4c-0ae2-4110-93e0-23d63ac8246d"] = "L-01-11 역률(%)";
            m_dicTagNames["69210cb8-e718-4382-a02b-c13aba04d424"] = "L-01-11 주파수(Hz)";
            m_dicTagNames["e5006f18-9e21-4f7f-9ac4-dc2751b7874d"] = "L-01-11 누설전류(mA)";
            m_dicTagNames["1b47dd43-6d99-48ac-9ac1-c521d5ff9a24"] = "L-01-11 수요전력 최대값(kW)";
            m_dicTagNames["40b73772-7be9-414a-b9c5-21c79f08fa51"] = "L-01-11 전력예측값(kWh)";
            m_dicTagNames["e5f67a8b-c0d1-4290-a112-518c890123b4"] = "L-01-12 Vrs(V)";
            m_dicTagNames["5c6d7e8f-9b0c-43a1-b223-629d901234c5"] = "L-01-12 Vst(V)";
            m_dicTagNames["f67a8b9c-d1e2-44b2-c334-73ae012345d6"] = "L-01-12 Vtr(V)";
            m_dicTagNames["6d7e8f90-a3b4-45c3-d445-84bf123456e7"] = "L-01-12 Ar(A)";
            m_dicTagNames["a8b9c0d1-e2f3-46d4-e556-95c0234567f8"] = "L-01-12 As(A)";
            m_dicTagNames["7e8f90a1b-4b5c-47e5-f667-a6d1345678a9"] = "L-01-12 At(A)";
            m_dicTagNames["b9c0d1e2-f3a4-48f6-0778-b7e2456789b0"] = "L-01-12 전력(kW)";
            m_dicTagNames["8f90a1b2-5c6d-4907-1889-c8f3567890c1"] = "L-01-12 유효전력량(kWh)";
            m_dicTagNames["c0d1e2f3-a4b5-4a18-299a-d904678901d2"] = "L-01-12 역률(%)";
            m_dicTagNames["90a1b2c3-6d7e-4b29-3aab-eaf5789012e3"] = "L-01-12 주파수(Hz)";
            m_dicTagNames["d1e2f3a4-b5c6-4c3a-4bbc-fbb6890123f4"] = "L-01-12 누설전류(mA)";
            m_dicTagNames["a1b2c3d4-e6f7-4d4b-5ccd-0c47901234c5"] = "L-01-12 수요전력 최대값(kW)";
            m_dicTagNames["baa30f9f-e28f-4256-bc49-dd8a588192ae"] = "L-01-12 전력예측값(kWh)";
            m_dicTagNames["90a1b2c3-d4e5-490a-1b2c-3d4e5f67a8b9"] = "L-02-1 Vrs(V)";
            m_dicTagNames["d1e2f3a4-b5c6-4a1b-2c3d-4e5f67a8b9c0"] = "L-02-1 Vst(V)";
            m_dicTagNames["a1b2c3d4-e5f6-4b2c-3d4e-5f67a8b9c0d1"] = "L-02-1 Vtr(V)";
            m_dicTagNames["e2f3a4b5-c6d7-4c3d-4e5f-67a8b9c0d1e2"] = "L-02-1 Ar(A)";
            m_dicTagNames["b2c3d4e5-f67a-4d4e-5f67-a8b9c0d1e2f3"] = "L-02-1 As(A)";
            m_dicTagNames["f3a4b5c6-d7e8-4e5f-67a8-b9c0d1e2f3a4"] = "L-02-1 At(A)";
            m_dicTagNames["c3d4e5f6-7a8b-4f67-a8b9-c0d1e2f3a4b5"] = "L-02-1 전력(kW)";
            m_dicTagNames["00d0e74f-561b-4191-88c9-0268529242d5"] = "L-02-1 유효전력량(kWh)";
            m_dicTagNames["6611f7c3-3118-4710-85f0-6c9968434771"] = "L-02-1 역률(%)";
            m_dicTagNames["d6f3164a-250c-403d-82c5-16d7a5b3e2f0"] = "L-02-1 주파수(Hz)";
            m_dicTagNames["8b38a7c2-1e9f-402a-9e4c-1d7f6b9a8c53"] = "L-02-1 누설전류(mA)";
            m_dicTagNames["8f6d7e8f-90a1-4a12-2345-0718293a4b5c"] = "L-02-1 전력예측값(kWh)";
            m_dicTagNames["7c2a1b9f-5d3e-4f0e-b1c4-8a7d6e5c3b21"] = "L-02-1 수요전력 최대값(kW)";
            m_dicTagNames["5a6b7c8d-9e0f-4012-8345-67890a1b2c3d"] = "L-02-2 Vrs(V)";
            m_dicTagNames["6b7c8d9e-0f1a-4123-9456-7890a1b2c3d4"] = "L-02-2 Vst(V)";
            m_dicTagNames["7c8d9e0f-1a2b-4234-a567-890a1b2c3d4e"] = "L-02-2 Vtr(V)";
            m_dicTagNames["8d9e0f1a-2b3c-4345-b678-90a1b2c3d4e5"] = "L-02-2 Ar(A)";
            m_dicTagNames["9e0f1a2b-3c4d-4456-c789-a1b2c3d4e5f6"] = "L-02-2 As(A)";
            m_dicTagNames["a0f1b2c3-4d5e-4567-d890-b2c3d4e5f607"] = "L-02-2 At(A)";
            m_dicTagNames["b1c2d3e4-5f6a-4678-e901-c3d4e5f60718"] = "L-02-2 전력(kW)";
            m_dicTagNames["c2d3e4f5-6a7b-4789-f012-d4e5f6071829"] = "L-02-2 유효전력량(kWh)";
            m_dicTagNames["d3e4f5a6-7b8c-4890-0123-e5f60718293a"] = "L-02-2 역률(%)";
            m_dicTagNames["e4f5a6b7-8c9d-4901-1234-f60718293a4b"] = "L-02-2 주파수(Hz)";
            m_dicTagNames["f5a6b7c8-9d0e-4a12-2345-0718293a4b5c"] = "L-02-2 누설전류(mA)";
            m_dicTagNames["907e8f90-a1b2-4b23-3456-18293a4b5c6d"] = "L-02-2 전력예측값(kWh)";
            m_dicTagNames["06b7c8d9-e0f1-4b23-3456-18293a4b5c6d"] = "L-02-2 수요전력 최대값(kW)";
            m_dicTagNames["17c8d9e0-f1a2-4c34-4567-293a4b5c6d7e"] = "L-02-3 Vrs(V)";
            m_dicTagNames["28d9e0f1-a2b3-4d45-5678-3a4b5c6d7e8f"] = "L-02-3 Vst(V)";
            m_dicTagNames["39e0f1a2-b3c4-4e56-6789-4b5c6d7e8f90"] = "L-02-3 Vtr(V)";
            m_dicTagNames["4a0f1b2c-3d4e-4f67-7890-5c6d7e8f90a1"] = "L-02-3 Ar(A)";
            m_dicTagNames["5b1c2d3e-4f5a-4078-8901-6d7e8f90a1b2"] = "L-02-3 As(A)";
            m_dicTagNames["6c2d3e4f-5a6b-4189-9012-7e8f90a1b2c3"] = "L-02-3 At(A)";
            m_dicTagNames["7d3e4f5a-6b7c-4290-a123-8f90a1b2c3d4"] = "L-02-3 전력(kW)";
            m_dicTagNames["8e4f5a6b-7c8d-43a1-b234-90a1b2c3d4e5"] = "L-02-3 유효전력량(kWh)";
            m_dicTagNames["9f5a6b7c-8d9e-44b2-c345-a1b2c3d4e5f6"] = "L-02-3 역률(%)";
            m_dicTagNames["a06b7c8d-9e0f-45c3-d456-b2c3d4e5f607"] = "L-02-3 주파수(Hz)";
            m_dicTagNames["b17c8d9e-0f1a-46d4-e567-c3d4e5f60718"] = "L-02-3 누설전류(mA)";
            m_dicTagNames["a18f90a1-b2c3-4c34-4567-293a4b5c6d7e"] = "L-02-3 전력예측값(kWh)";
            m_dicTagNames["c28d9e0f-1a2b-47e5-f678-d4e5f6071829"] = "L-02-3 수요전력 최대값(kW)";
            m_dicTagNames["9b0c1d2e-3f4a-4a18-c3d4-e5f6a7b8c9d0"] = "L-02-5 Vrs(V)";
            m_dicTagNames["f0a1b2c3-d4e5-4b29-d5e6-f7a8b9c0d1e2"] = "L-02-5 Vst(V)";
            m_dicTagNames["a1b2c3d4-e5f6-4c3a-e7f8-a9b0c1d2e3f4"] = "L-02-5 Vtr(V)";
            m_dicTagNames["0c1d2e3f-4a5b-4d4b-f90a-1b2c3d4e5f6a"] = "L-02-5 Ar(A)";
            m_dicTagNames["b2c3d4e5-f6a7-4e5c-0b1c-2d3e4f5a6b7c"] = "L-02-5 As(A)";
            m_dicTagNames["1d2e3f4a-5b6c-4f6d-1c2d-3e4f5a6b7c8d"] = "L-02-5 At(A)";
            m_dicTagNames["c3d4e5f6-a7b8-407e-2d3e-4f5a6b7c8d9e"] = "L-02-5 전력(kW)";
            m_dicTagNames["2e3f4a5b-6c7d-418f-3e4f-5a6b7c8d9e0f"] = "L-02-5 유효전력량(kWh)";
            m_dicTagNames["d4e5f6a7-b8c9-4290-4f5a-6b7c8d9e0f1a"] = "L-02-5 역률(%)";
            m_dicTagNames["3f4a5b6c-7d8e-43a1-5a6b-7c8d9e0f1a2b"] = "L-02-5 주파수(Hz)";
            m_dicTagNames["e5f6a7b8-c9d0-44b2-6b7c-8d9e0f1a2b3c"] = "L-02-5 누설전류(mA)";
            m_dicTagNames["4a5b6c7d-8e9f-45c3-7c8d-9e0f1a2b3c4d"] = "L-02-5 수요전력 최대값(kW)";
            m_dicTagNames["b290a1b2-c3d4-4d45-5678-3a4b5c6d7e8f"] = "L-02-5 전력예측값(kWh)";
            m_dicTagNames["e0c1d2e3-f4a5-4678-e901-23456789abcd"] = "L-02-6 Vrs(V)";
            m_dicTagNames["f1d2e3f4-a5b6-4789-f012-3456789abcde"] = "L-02-6 Vst(V)";
            m_dicTagNames["02e3f4a5-b6c7-4890-0123-456789abcdef"] = "L-02-6 Vtr(V)";
            m_dicTagNames["13f4a5b6-c7d8-4901-1234-56789abcde01"] = "L-02-6 Ar(A)";
            m_dicTagNames["24a5b6c7-d8e9-4a12-2345-6789abcde012"] = "L-02-6 As(A)";
            m_dicTagNames["35b6c7d8-e9f0-4b23-3456-789abcde0123"] = "L-02-6 At(A)";
            m_dicTagNames["46c7d8e9-f01a-4c34-4567-89abcde01234"] = "L-02-6 전력(kW)";
            m_dicTagNames["57d8e9f0-1a2b-4d45-5678-9abcde012345"] = "L-02-6 유효전력량(kWh)";
            m_dicTagNames["68e9f01a-2b3c-4e56-6789-abcde0123456"] = "L-02-6 역률(%)";
            m_dicTagNames["79f01a2b-3c4d-4f67-7890-bcde01234567"] = "L-02-6 주파수(Hz)";
            m_dicTagNames["8a01b2c3-4d5e-4078-8901-cde012345678"] = "L-02-6 누설전류(mA)";
            m_dicTagNames["9b12c3d4-5e6f-4189-9012-de0123456789"] = "L-02-6 수요전력 최대값(kW)";
            m_dicTagNames["c3a1b2c3-d4e5-4e56-6789-4b5c6d7e8f90"] = "L-02-6 전력예측값(kWh)";
            m_dicTagNames["8f90a1b2-3b4c-46d4-e556-95d0678901f8"] = "L-02-7 Vrs(V)";
            m_dicTagNames["c0d1e2f3-a4b5-47e5-f667-a6e1789012a9"] = "L-02-7 Vst(V)";
            m_dicTagNames["90a1b2c3-4c5d-48f6-0778-b7f2890123b0"] = "L-02-7 Vtr(V)";
            m_dicTagNames["d1e2f3a4-b5c6-4907-1889-c803901234c1"] = "L-02-7 Ar(A)";
            m_dicTagNames["a1b2c3d4-e6f7-4a18-299a-d914012345d2"] = "L-02-7 As(A)";
            m_dicTagNames["1e2f3a4b-5d6e-4b29-3aab-eaf5123456e3"] = "L-02-7 At(A)";
            m_dicTagNames["b2c3d4e5-f7a8-4c3a-4bbc-fbb6234567f4"] = "L-02-7 전력(kW)";
            m_dicTagNames["2f3a4b5c-6e7f-4d4b-5ccd-0c37345678c9"] = "L-02-7 유효전력량(kWh)";
            m_dicTagNames["c3d4e5f6-a8b9-4e5c-6dde-1d48456789d0"] = "L-02-7 역률(%)";
            m_dicTagNames["3a4b5c6d-7f8a-4f6d-7eef-2e59567890e1"] = "L-02-7 주파수(Hz)";
            m_dicTagNames["d4e5f67a-b9c0-407e-8ff0-3f6a678901f2"] = "L-02-7 누설전류(mA)";
            m_dicTagNames["4b5c6d7e-8a9b-418f-9001-407b789012a3"] = "L-02-7 수요전력 최대값(kW)";
            m_dicTagNames["d4b2c3d4-e5f6-4f67-7890-5c6d7e8f90a1"] = "L-02-7 전력예측값(kWh)";
            m_dicTagNames["d4e5f67a-b9c0-46d4-e556-95d0456789d0"] = "L-02-8 Vrs(V)";
            m_dicTagNames["4b5c6d7e-3abc-47e5-f667-a6e1567890e1"] = "L-02-8 Vst(V)";
            m_dicTagNames["e5f67a8b-c0d1-48f6-0778-b7f2678901f2"] = "L-02-8 Vtr(V)";
            m_dicTagNames["5c6d7e8f-4bcd-4907-1889-c803789012a3"] = "L-02-8 Ar(A)";
            m_dicTagNames["f67a8b9c-d1e2-4a18-299a-d914890123b4"] = "L-02-8 As(A)";
            m_dicTagNames["6d7e8f90-5cde-4b29-3aab-eaf5901234c5"] = "L-02-8 At(A)";
            m_dicTagNames["a8b9c0d1-e2f3-4c3a-4bbc-fbb6012345d6"] = "L-02-8 전력(kW)";
            m_dicTagNames["7e8f90a1b-6def-4d4b-5ccd-0c47123456e7"] = "L-02-8 유효전력량(kWh)";
            m_dicTagNames["b9c0d1e2-f3a4-4e5c-6dde-1d58234567f8"] = "L-02-8 역률(%)";
            m_dicTagNames["8f90a1b2-7ef0-4f6d-7eef-2e69345678a9"] = "L-02-8 주파수(Hz)";
            m_dicTagNames["c0d1e2f3-a4b5-407e-8ff0-3f7a456789b0"] = "L-02-8 누설전류(mA)";
            m_dicTagNames["90a1b2c3-8f01-418f-9001-408b567890c1"] = "L-02-8 수요전력 최대값(kW)";
            m_dicTagNames["e5c3d4e5-f6a7-4078-8901-6d7e8f90a1b2"] = "L-02-8 전력예측값(kWh)";
            m_dicTagNames["6c3d4e5f-6a7b-4012-8345-67890a1b2c3d"] = "L-02-9 Vrs(V)";
            m_dicTagNames["7d4e5f6a-7b8c-4123-9456-7890a1b2c3d4"] = "L-02-9 Vst(V)";
            m_dicTagNames["8e5f6a7b-8c9d-4234-a567-890a1b2c3d4e"] = "L-02-9 Vtr(V)";
            m_dicTagNames["9f6a7b8c-9d0e-4345-b678-90a1b2c3d4e5"] = "L-02-9 Ar(A)";
            m_dicTagNames["a07b8c9d-0e1f-4456-c789-a1b2c3d4e5f6"] = "L-02-9 As(A)";
            m_dicTagNames["b18c9d0e-1f2a-4567-d890-b2c3d4e5f607"] = "L-02-9 At(A)";
            m_dicTagNames["c29d0e1f-2a3b-4678-e901-c3d4e5f60718"] = "L-02-9 전력(kW)";
            m_dicTagNames["d3a0e1f2-3b4c-4789-f012-d4e5f6071829"] = "L-02-9 유효전력량(kWh)";
            m_dicTagNames["e4b1f2a3-4c5d-4890-0123-e5f60718293a"] = "L-02-9 역률(%)";
            m_dicTagNames["f5c2a3b4-5d6e-4901-1234-f60718293a4b"] = "L-02-9 주파수(Hz)";
            m_dicTagNames["06d3b4c5-6e7f-4a12-2345-0718293a4b5c"] = "L-02-9 누설전류(mA)";
            m_dicTagNames["17e4c5d6-7f8a-4b23-3456-18293a4b5c6d"] = "L-02-9 수요전력 최대값(kW)";
            m_dicTagNames["07e5f6a7-b8c9-4290-a123-8f90a1b2c3d4"] = "L-02-9 전력예측값(kWh)";
            m_dicTagNames["28f5d6e7-8a9b-4c34-4567-293a4b5c6d7e"] = "L-02-10 Vrs(V)";
            m_dicTagNames["3906e7f8-9b0c-4d45-5678-3a4b5c6d7e8f"] = "L-02-10 Vst(V)";
            m_dicTagNames["4a17f890-a0c1-4e56-6789-4b5c6d7e8f90"] = "L-02-10 Vtr(V)";
            m_dicTagNames["5b2890a1-b1d2-4f67-7890-5c6d7e8f90a1"] = "L-02-10 Ar(A)";
            m_dicTagNames["6c390a1b-c2e3-4078-8901-6d7e8f90a1b2"] = "L-02-10 As(A)";
            m_dicTagNames["7d4a1b2c-d3f4-4189-9012-7e8f90a1b2c3"] = "L-02-10 At(A)";
            m_dicTagNames["8e5b2c3d-e405-4290-a123-8f90a1b2c3d4"] = "L-02-10 전력(kW)";
            m_dicTagNames["9f6c3d4e-f516-43a1-b234-90a1b2c3d4e5"] = "L-02-10 유효전력량(kWh)";
            m_dicTagNames["a07d4e5f-0627-44b2-c345-a1b2c3d4e5f6"] = "L-02-10 역률(%)";
            m_dicTagNames["b18e5f60-1738-45c3-d456-b2c3d4e5f607"] = "L-02-10 주파수(Hz)";
            m_dicTagNames["c29f6071-2849-46d4-e567-c3d4e5f60718"] = "L-02-10 누설전류(mA)";
            m_dicTagNames["d3a07182-395a-47e5-f678-d4e5f6071829"] = "L-02-10 수요전력 최대값(kW)";
            m_dicTagNames["18f6a7b8-c9d0-43a1-b234-90a1b2c3d4e5"] = "L-02-10 전력예측값(kWh)";
            m_dicTagNames["2d5f8a7c-3b1e-4c9d-8f0a-6e5d4c3b2a19"] = "L-02-11 Vrs(V)";
            m_dicTagNames["e9f4c1b3-6d7a-48e0-a2b5-9c8d1e3f7a4b"] = "L-02-11 Vst(V)";
            m_dicTagNames["4c1b3e9f-7a4d-40c2-9b5a-3e8f1c7d6b9a"] = "L-02-11 Vtr(V)";
            m_dicTagNames["b1c4d5e6-7f8a-40b3-9e4c-1d7f6b9a8c54"] = "L-02-11 Ar(A)";
            m_dicTagNames["5d3e2c1f-9a8b-47d0-a1c3-6e5f8a7c2b1d"] = "L-02-11 As(A)";
            m_dicTagNames["1e8f7d6c-5b4a-43f2-8c1d-9e0f1a2b3c4d"] = "L-02-11 At(A)";
            m_dicTagNames["6b4a5d3e-2c1f-44e1-9a7b-0c2d3e4f5a6b"] = "L-02-11 전력(kW)";
            m_dicTagNames["c7d8e9f0-1a2b-45c3-8e9f-0a1b2c3d4e5f"] = "L-02-11 유효전력량(kWh)";
            m_dicTagNames["7f8a9b0c-1d2e-46d4-a7b8-c9d0e1f2a3b4"] = "L-02-11 역률(%)";
            m_dicTagNames["d8e9f0a1-b2c3-47e5-8f0a-1b2c3d4e5f67"] = "L-02-11 주파수(Hz)";
            m_dicTagNames["8a9b0c1d-2e3f-48f6-a9b0-c1d2e3f4a5b6"] = "L-02-11 누설전류(mA)";
            m_dicTagNames["e9f0a1b2-c3d4-4907-b1c2-d3e4f5a6b7c8"] = "L-02-11 수요전력 최대값(kW)";
            m_dicTagNames["2907b8c9-d0e1-44b2-c345-a1b2c3d4e5f6"] = "L-02-11 전력예측값(kWh)";
            m_dicTagNames["2f3a4b5c-7b8c-4a18-299a-d9d0456789d6"] = "L-02-12 Vrs(V)";
            m_dicTagNames["c3d4e5f6-a8b9-4b29-3aab-eaf1567890e7"] = "L-02-12 Vst(V)";
            m_dicTagNames["3a4b5c6d-8c9d-4c3a-4bbc-fbb2678901f8"] = "L-02-12 Vtr(V)";
            m_dicTagNames["d4e5f67a-b9c0-4d4b-5ccd-0c4d789012c9"] = "L-02-12 Ar(A)";
            m_dicTagNames["4b5c6d7e-9d0e-4e5c-6dde-1d5e890123d0"] = "L-02-12 As(A)";
            m_dicTagNames["e5f67a8b-c0d1-4f6d-7eef-2e6f901234e1"] = "L-02-12 At(A)";
            m_dicTagNames["5c6d7e8f-0e1f-407e-8ff0-3f7a012345f2"] = "L-02-12 전력(kW)";
            m_dicTagNames["f67a8b9c-d1e2-418f-9001-408b123456a3"] = "L-02-12 유효전력량(kWh)";
            m_dicTagNames["6d7e8f90-1f2a-4290-a112-519c234567b4"] = "L-02-12 역률(%)";
            m_dicTagNames["a8b9c0d1-e2f3-43a1-b223-62ad345678c5"] = "L-02-12 주파수(Hz)";
            m_dicTagNames["7e8f90a1b-2a3b-44b2-c334-73be456789d6"] = "L-02-12 누설전류(mA)";
            m_dicTagNames["b9c0d1e2-f3a4-45c3-d445-84cf567890e7"] = "L-02-12 수요전력 최대값(kW)";
            m_dicTagNames["3a18c9d0-e1f2-45c3-d456-b2c3d4e5f607"] = "L-02-12 전력예측값(kWh)";
            m_dicTagNames["3a4b5c6d-7e8f-4d4e-5f67-a8b9c0d1e2f3"] = "L-02-13 Vrs(V)";
            m_dicTagNames["d4e5f67a-8b9c-4e5f-67a8-b9c0d1e2f3a4"] = "L-02-13 Vst(V)";
            m_dicTagNames["4b5c6d7e-8f90-4f67-a8b9-c0d1e2f3a4b5"] = "L-02-13 Vtr(V)";
            m_dicTagNames["e5f67a8b-9c0d-4078-b9c0-d1e2f3a4b5c6"] = "L-02-13 Ar(A)";
            m_dicTagNames["5c6d7e8f-90a1-4189-c0d1-e2f3a4b5c6d7"] = "L-02-13 As(A)";
            m_dicTagNames["f67a8b9c-0d1e-4290-d1e2-f3a4b5c6d7e8"] = "L-02-13 At(A)";
            m_dicTagNames["6d7e8f90-a1b2-43a1-e2f3-a4b5c6d7e8f9"] = "L-02-13 전력(kW)";
            m_dicTagNames["a8b9c0d1-e2f3-44b2-f3a4-b5c6d7e8f90a"] = "L-02-13 유효전력량(kWh)";
            m_dicTagNames["7e8f90a1b-2c3d-45c3-d4e5-f67a8b9c0d1e"] = "L-02-13 역률(%)";
            m_dicTagNames["b9c0d1e2-f3a4-46d4-e5f6-7a8b9c0d1e2f"] = "L-02-13 주파수(Hz)";
            m_dicTagNames["8f90a1b2-c3d4-47e5-f67a-8b9c0d1e2f3a"] = "L-02-13 누설전류(mA)";
            m_dicTagNames["c0d1e2f3-a4b5-48f6-7a8b-9c0d1e2f3a4b"] = "L-02-13 수요전력 최대값(kW)";
            m_dicTagNames["4b29d0e1f-2a3b-46d4-e567-c3d4e5f60718"] = "L-02-13 전력예측값(kWh)";
            m_dicTagNames["e5f6a7b8-c9d0-4012-8345-67890a1b2c3d"] = "L-02-14 Vrs(V)";
            m_dicTagNames["f6a7b8c9-d0e1-4123-9456-7890a1b2c3d4"] = "L-02-14 Vst(V)";
            m_dicTagNames["07b8c9d0-e1f2-4234-a567-890a1b2c3d4e"] = "L-02-14 Vtr(V)";
            m_dicTagNames["18c9d0e1-f2a3-4345-b678-90a1b2c3d4e5"] = "L-02-14 Ar(A)";
            m_dicTagNames["29d0e1f2-a3b4-4456-c789-a1b2c3d4e5f6"] = "L-02-14 As(A)";
            m_dicTagNames["3a1e2f3a-4b5c-4567-d890-b2c3d4e5f607"] = "L-02-14 At(A)";
            m_dicTagNames["4b2f3a4b-5c6d-4678-e901-c3d4e5f60718"] = "L-02-14 전력(kW)";
            m_dicTagNames["5c3a4b5c-6d7e-4789-f012-d4e5f6071829"] = "L-02-14 유효전력량(kWh)";
            m_dicTagNames["a28d46aa-58db-42a7-9a3a-067a227fd3d5"] = "L-02-14 역률(%)";
            m_dicTagNames["0388c425-f396-4885-a3d9-ab4535458445"] = "L-02-14 주파수(Hz)";
            m_dicTagNames["dcbccb92-baf0-456e-a4ef-f16a1e4a5b03"] = "L-02-14 누설전류(mA)";
            m_dicTagNames["5c3a1e2f-3a4b-47e5-f678-d4e5f6071829"] = "L-02-14 전력예측값(kWh)";
            m_dicTagNames["1c966a0d-39d0-4b2f-9188-f470a5e40c8f"] = "L-02-14 수요전력 최대값(kW)";
            m_dicTagNames["bb589a5a-c5bd-4584-9d3c-5f144fc57047"] = "L-02-15 Vrs(V)";
            m_dicTagNames["52ac5709-a216-480d-8aea-b87a99e6a018"] = "L-02-15 Vst(V)";
            m_dicTagNames["1f79b426-49ce-4601-bdba-aee8a04bcac8"] = "L-02-15 Vtr(V)";
            m_dicTagNames["18c148aa-1339-48a5-9a54-226fc4d53320"] = "L-02-15 Ar(A)";
            m_dicTagNames["ec809000-4282-4e68-b8fa-827a45ccd80c"] = "L-02-15 As(A)";
            m_dicTagNames["f6d4e5f6-a7b8-4189-9012-7e8f90a1b2c3"] = "L-02-15 At(A)";
            m_dicTagNames["415d45f6-80c0-4104-a201-001495af51ac"] = "L-02-15 전력(kW)";
            m_dicTagNames["ceac75ed-fc41-416d-ba53-bf9a8ada275b"] = "L-02-15 유효전력량(kWh)";
            m_dicTagNames["848a12c7-eafa-4280-8619-c2e0feb1e554"] = "L-02-15 역률(%)";
            m_dicTagNames["20365625-2ff0-4cd5-b5f7-46415cf0784d"] = "L-02-15 주파수(Hz)";
            m_dicTagNames["153b7f6f-d367-4206-9b93-399e7aef9d23"] = "L-02-15 누설전류(mA)";
            m_dicTagNames["6d4b2f3a-4b5c-48f6-0789-e5f60718293a"] = "L-02-15 전력예측값(kWh)";
            m_dicTagNames["0852279d-d626-4a21-bfa0-a53c5313e4f9"] = "L-02-15 수요전력 최대값(kW)";
            m_dicTagNames["4e8243a7-0383-4edd-b8e1-d1fc43fa12ab"] = "L-02-16 Vrs(V)";
            m_dicTagNames["38d9b03b-108f-41ce-b94d-758b4128484e"] = "L-02-16 Vst(V)";
            m_dicTagNames["de2f2548-1dc4-4ba5-ae71-094c275fecc6"] = "L-02-16 Vtr(V)";
            m_dicTagNames["a86e41ab-d18e-4599-b0cc-358ce5c0d193"] = "L-02-16 Ar(A)";
            m_dicTagNames["a6b7920a-9a09-44f9-bd28-c407052c954b"] = "L-02-16 As(A)";
            m_dicTagNames["faee4b75-d321-40a8-b39d-4b2e1b63b257"] = "L-02-16 At(A)";
            m_dicTagNames["f736d0c6-40fd-411a-adb0-335001bfdeea"] = "L-02-16 전력(kW)";
            m_dicTagNames["14fd2deb-489b-464e-9559-4fbc51fb620f"] = "L-02-16 유효전력량(kWh)";
            m_dicTagNames["006e0973-80ab-4342-898a-4e70ae94fb09"] = "L-02-16 역률(%)";
            m_dicTagNames["d8a72a21-9d15-4566-9964-45e5ebcf376d"] = "L-02-16 주파수(Hz)";
            m_dicTagNames["6b58066f-4c60-4f31-8458-d1fd6504a7b0"] = "L-02-16 누설전류(mA)";
            m_dicTagNames["80943b66-1626-43ee-8bb7-2b531bec7bb8"] = "L-02-16 전력예측값(kWh)";
            m_dicTagNames["696d41b6-736b-4957-864c-c37435fc66ef"] = "L-02-16 수요전력 최대값(kW)";
            m_dicTagNames["7e8f90a1b-d4e5-4a18-299a-d914234567d8"] = "L-03-1 Vrs(V)";
            m_dicTagNames["b9c0d1e2-f3a4-4b29-3aab-eaf5345678e9"] = "L-03-1 Vst(V)";
            m_dicTagNames["8f90a1b2-e5f6-4c3a-4bbc-fbb6456789f0"] = "L-03-1 Vtr(V)";
            m_dicTagNames["c0d1e2f3-a4b5-4d4b-5ccd-0c47567890a1"] = "L-03-1 Ar(A)";
            m_dicTagNames["90a1b2c3-f67a-4e5c-6dde-1d58678901b2"] = "L-03-1 As(A)";
            m_dicTagNames["d1e2f3a4-b5c6-4f6d-7eef-2e69789012c3"] = "L-03-1 At(A)";
            m_dicTagNames["a1b2c3d4-e6f7-407e-8ff0-3f7a890123d4"] = "L-03-1 전력(kW)";
            m_dicTagNames["1e2f3a4b-0789-418f-9001-408b901234e5"] = "L-03-1 유효전력량(kWh)";
            m_dicTagNames["b2c3d4e5-f7a8-4290-a112-519c012345f6"] = "L-03-1 역률(%)";
            m_dicTagNames["2f3a4b5c-189a-43a1-b223-62ad123456a7"] = "L-03-1 주파수(Hz)";
            m_dicTagNames["c3d4e5f6-a8b9-44b2-c334-73be234567b8"] = "L-03-1 누설전류(mA)";
            m_dicTagNames["3a4b5c6d-29ab-45c3-d445-84cf345678c9"] = "L-03-1 수요전력 최대값(kW)";
            m_dicTagNames["07e5f6a7-b8c9-4234-a567-890a1b2c3d4e"] = "L-03-1 전력 예측값(kWh)";
            m_dicTagNames["793a0273-04d2-4b2a-a92c-63b2f5117397"] = "L-03-2 Vrs(V)";
            m_dicTagNames["87884841-f404-4530-9b36-701389270e4c"] = "L-03-2 Vst(V)";
            m_dicTagNames["9161a491-9c60-4963-8a9d-541579d4999f"] = "L-03-2 Vtr(V)";
            m_dicTagNames["a09990e6-81c0-4e3f-8461-8411d95b5468"] = "L-03-2 Ar(A)";
            m_dicTagNames["a5d89771-081c-4b68-80f0-c558c42c2628"] = "L-03-2 As(A)";
            m_dicTagNames["aa2a1773-677a-4c28-9844-3d98c25f4648"] = "L-03-2 At(A)";
            m_dicTagNames["b17c2f0f-6228-44d5-81a1-8d262b9a1170"] = "L-03-2 전력(kW)";
            m_dicTagNames["b51e0653-529a-4770-985e-99f8d59101f2"] = "L-03-2 유효전력량(kWh)";
            m_dicTagNames["c1981a8b-302a-463d-82c5-5a507a21698b"] = "L-03-2 역률(%)";
            m_dicTagNames["c96a3240-527e-4623-b1d5-783685a666e8"] = "L-03-2 주파수(Hz)";
            m_dicTagNames["d24c0846-9917-4952-878f-6242c7333a2a"] = "L-03-2 누설전류(mA)";
            m_dicTagNames["d50c704f-6d27-4638-953e-51c3d0b2f159"] = "L-03-2 수요전력 최대값(kW)";
            m_dicTagNames["7c5f8e1a-4d9c-2b3f-8e4a-1c6d9f8e7a2b"] = "L-03-2 전력 예측값(kWh)";
            m_dicTagNames["e08f2384-93e1-4148-812f-9815e98544d6"] = "L-03-3 Vrs(V)";
            m_dicTagNames["f10672e6-993d-4c3d-9d7a-181165e31782"] = "L-03-3 Vst(V)";
            m_dicTagNames["f581729b-0081-424b-97e3-08696c56886e"] = "L-03-3 Vtr(V)";
            m_dicTagNames["f97b668d-8e54-4776-857c-87d268d80f84"] = "L-03-3 Ar(A)";
            m_dicTagNames["02c38865-6677-49f3-851f-66299d63c200"] = "L-03-3 As(A)";
            m_dicTagNames["0a5a044e-a129-411c-99f5-177a4a98b1e4"] = "L-03-3 At(A)";
            m_dicTagNames["10c41097-f135-43a9-9836-3987f0b54359"] = "L-03-3 전력(kW)";
            m_dicTagNames["138a0673-8a29-4c54-8e1c-52968f9b9777"] = "L-03-3 유효전력량(kWh)";
            m_dicTagNames["18f2674e-6e4d-44a8-9a4f-561b68a4d46f"] = "L-03-3 역률(%)";
            m_dicTagNames["1a6c118e-4a6f-474c-b476-d33a6473138f"] = "L-03-3 주파수(Hz)";
            m_dicTagNames["2593b482-628d-4f2b-8a1a-3e54b6d3a8a3"] = "L-03-3 누설전류(mA)";
            m_dicTagNames["353a1526-724f-4a0b-932f-762269a83852"] = "L-03-3 수요전력 최대값(kW)";
            m_dicTagNames["6f8e2c4a-9b1d-3e5f-7a9c-0b2d4e6f8a0b"] = "L-03-3 전력 예측값(kWh)";
            m_dicTagNames["c5254ed4-1ed9-416b-867a-f4de9d0f9ecc"] = "L-03-4 Vrs(V)";
            m_dicTagNames["fecef291-c990-4a66-a1dc-d80a54929977"] = "L-03-4 Vst(V)";
            m_dicTagNames["07c1a397-aff9-4803-8d77-dbff73cc02ce"] = "L-03-4 Vtr(V)";
            m_dicTagNames["98a0f3c0-cfaf-4bb7-af3c-8f452fde049d"] = "L-03-4 Ar(A)";
            m_dicTagNames["63e7b322-8b64-4e4d-a3a7-1be457889342"] = "L-03-4 As(A)";
            m_dicTagNames["8845ed61-328e-4561-81b7-f89f33a30ef7"] = "L-03-4 At(A)";
            m_dicTagNames["12146230-3bd3-4f2b-9722-abf19a8b8080"] = "L-03-4 전력(kW)";
            m_dicTagNames["e1e3848b-a71b-4722-a76c-d5e1cf0bfab6"] = "L-03-4 유효전력량(kWh)";
            m_dicTagNames["feeeefa6-4062-40e3-91ec-aee1bf8f095e"] = "L-03-4 역률(%)";
            m_dicTagNames["9fbb2e54-4fda-4ddf-8e6e-aa100b64220e"] = "L-03-4 주파수(Hz)";
            m_dicTagNames["8ed72df2-d896-4536-89c0-f4749da7a9e3"] = "L-03-4 누설전류(mA)";
            m_dicTagNames["a42858b4-c7e7-477e-b6d2-e767fab7755a"] = "L-03-4 수요전력 최대값(kW)";
            m_dicTagNames["d01e290d-add7-4a4e-ac83-b37a17759a09"] = "L-03-4 전력 예측값(kWh)";
            m_dicTagNames["87884102-3907-4e76-8a74-d4b998d49a62"] = "L-03-5 Vrs(V)";
            m_dicTagNames["87e65f3f-4277-4c4c-9f79-2453c25b81b2"] = "L-03-5 Vst(V)";
            m_dicTagNames["91118182-4a0b-4770-ae40-e7f09a5b32e0"] = "L-03-5 Vtr(V)";
            m_dicTagNames["979a32c7-01d0-43a4-9e79-88a442a98f7e"] = "L-03-5 Ar(A)";
            m_dicTagNames["987f6202-e2d6-4448-b40b-74b8849b28f7"] = "L-03-5 As(A)";
            m_dicTagNames["98c088f1-c852-47d0-8f92-563b7e28989f"] = "L-03-5 At(A)";
            m_dicTagNames["9930f789-f538-4e11-8557-0744e83c2420"] = "L-03-5 전력(kW)";
            m_dicTagNames["a113d07e-128c-4a11-85e0-d467812f865f"] = "L-03-5 유효전력량(kWh)";
            m_dicTagNames["a8c98e1f-1c4b-4497-b2e1-4a1c518d601d"] = "L-03-5 역률(%)";
            m_dicTagNames["b1e8d641-a18c-411a-826f-a892b1a37c38"] = "L-03-5 주파수(Hz)";
            m_dicTagNames["b8696417-1014-41d3-a4e9-0b1a0e0e1a1b"] = "L-03-5 누설전류(mA)";
            m_dicTagNames["c0989f66-319a-41d9-93e1-38f36c4b2661"] = "L-03-5 수요전력 최대값(kW)";
            m_dicTagNames["8e4d1f2a-9c7b-3e5f-1a9d-4c7b2e6a8f1d"] = "L-03-5 전력 예측값(kWh)";
            m_dicTagNames["35d0b439-d352-45e0-b6f7-b0870933758b"] = "L-03-6 Vrs(V)";
            m_dicTagNames["3a9b1c71-c0e8-48b6-8a7e-1a5c60c238b1"] = "L-03-6 Vst(V)";
            m_dicTagNames["4b5c777e-2d5f-4d2a-a9e9-158a77d549f3"] = "L-03-6 Vtr(V)";
            m_dicTagNames["50c77a3d-c19b-4e8c-859a-8e2b26c7102e"] = "L-03-6 Ar(A)";
            m_dicTagNames["5b7e8880-6d43-4f99-a9a7-96102660d1b3"] = "L-03-6 As(A)";
            m_dicTagNames["62c823f6-4a4a-4712-9c1c-4b3e86c1236d"] = "L-03-6 At(A)";
            m_dicTagNames["658b14e5-9c59-42b7-8742-8987114b7e93"] = "L-03-6 전력(kW)";
            m_dicTagNames["69a08990-2c7c-4a37-9759-e93540b6e949"] = "L-03-6 유효전력량(kWh)";
            m_dicTagNames["6a858e7f-6e82-4581-8051-76a08466e31e"] = "L-03-6 역률(%)";
            m_dicTagNames["74a001a1-37f2-4543-980b-29d91a92e3a1"] = "L-03-6 주파수(Hz)";
            m_dicTagNames["77148a04-582c-474c-87d3-0d258b3569e5"] = "L-03-6 누설전류(mA)";
            m_dicTagNames["843b0185-502a-4315-99d9-c4331e21b06d"] = "L-03-6 수요전력 최대값(kW)";
            m_dicTagNames["1d3e5a7b-8c9d-0f1e-2a3b-4c5d6e7f8a9b"] = "L-03-6 전력 예측값(kWh)";
            m_dicTagNames["d1e2f3a4-b5c6-4290-a112-519c678901d2"] = "L-03-7 Vrs(V)";
            m_dicTagNames["a1b2c3d4-e6f7-43a1-b223-62ad789012e3"] = "L-03-7 Vst(V)";
            m_dicTagNames["1e2f3a4b-9012-44b2-c334-73be890123f4"] = "L-03-7 Vtr(V)";
            m_dicTagNames["b2c3d4e5-f7a8-45c3-d445-84cf901234a5"] = "L-03-7 Ar(A)";
            m_dicTagNames["2f3a4b5c-a123-46d4-e556-95d0012345b6"] = "L-03-7 As(A)";
            m_dicTagNames["c3d4e5f6-a8b9-47e5-f667-a6e1123456c7"] = "L-03-7 At(A)";
            m_dicTagNames["3a4b5c6d-b234-48f6-0778-b7f2234567d8"] = "L-03-7 전력(kW)";
            m_dicTagNames["d4e5f67a-b9c0-4907-1889-c803345678e9"] = "L-03-7 유효전력량(kWh)";
            m_dicTagNames["4b5c6d7e-c345-4a18-299a-d914456789f0"] = "L-03-7 역률(%)";
            m_dicTagNames["e5f67a8b-c0d1-4b29-3aab-eaf5567890a1"] = "L-03-7 주파수(Hz)";
            m_dicTagNames["5c6d7e8f-d456-4c3a-4bbc-fbb6678901b2"] = "L-03-7 누설전류(mA)";
            m_dicTagNames["f67a8b9c-d1e2-4d4b-5ccd-0c47789012c3"] = "L-03-7 수요전력 최대값(kW)";
            m_dicTagNames["43b7c47b-abfd-446c-99f3-99f07f157966"] = "L-03-7 전력 예측값(kWh)";
            m_dicTagNames["f1295e86-35a8-44d4-9f20-1e35a1d7f6c3"] = "L-03-8 Vrs(V)";
            m_dicTagNames["1b8c2d9a-5f37-4b72-a0e6-9c4d2f8b3a10"] = "L-03-8 Vst(V)";
            m_dicTagNames["a54b6c7d-8e9f-410a-b2c3-d4e5f67a8b9c"] = "L-03-8 Vtr(V)";
            m_dicTagNames["2c1e4f3a-7d9b-46e8-9a0c-5b6d7e8f1a23"] = "L-03-8 Ar(A)";
            m_dicTagNames["9d8c7b6a-4e5f-4d32-8a1b-c3d4e5f67890"] = "L-03-8 As(A)";
            m_dicTagNames["3a2b1c4d-6e7f-4890-a1b2-c3d4e5f67891"] = "L-03-8 At(A)";
            m_dicTagNames["b7c8d9e0-1a2b-4c3d-5e6f-7a8b9c0d1e23"] = "L-03-8 전력(kW)";
            m_dicTagNames["4f3e2d1c-8b7a-4903-b2c1-d4e5f67a8b9d"] = "L-03-8 유효전력량(kWh)";
            m_dicTagNames["8a9b0c1d-2e3f-4567-890a-b1c2d3e4f567"] = "L-03-8 역률(%)";
            m_dicTagNames["5e6f7a8b-9c0d-4e1f-2a3b-4c5d6e7f8a9b"] = "L-03-8 주파수(Hz)";
            m_dicTagNames["c3d4e5f6-7a8b-4d9e-a0b1-c2d3e4f56789"] = "L-03-8 누설전류(mA)";
            m_dicTagNames["6a7b8c9d-0e1f-4234-5678-90a1b2c3d4e5"] = "L-03-8 수요전력 최대값(kW)";
            m_dicTagNames["f6d4e5f6-a7b8-4123-9456-7890a1b2c3d4"] = "L-03-8 전력 예측값(kWh)";
            m_dicTagNames["6d4b5c6d-7e8f-4012-8345-67890a1b2c3d"] = "L-03-9 Vrs(V)";
            m_dicTagNames["7e5c6d7e-8f90-4123-9456-7890a1b2c3d4"] = "L-03-9 Vst(V)";
            m_dicTagNames["8f6d7e8f-90a1-4234-a567-890a1b2c3d4e"] = "L-03-9 Vtr(V)";
            m_dicTagNames["907e8f90-a1b2-4345-b678-90a1b2c3d4e5"] = "L-03-9 Ar(A)";
            m_dicTagNames["a18f90a1-b2c3-4456-c789-a1b2c3d4e5f6"] = "L-03-9 As(A)";
            m_dicTagNames["b290a1b2-c3d4-4567-d890-b2c3d4e5f607"] = "L-03-9 At(A)";
            m_dicTagNames["c3a1b2c3-d4e5-4678-e901-c3d4e5f60718"] = "L-03-9 전력(kW)";
            m_dicTagNames["d4b2c3d4-e5f6-4789-f012-d4e5f6071829"] = "L-03-9 유효전력량(kWh)";
            m_dicTagNames["e5c3d4e5-f6a7-4890-0123-e5f60718293a"] = "L-03-9 역률(%)";
            m_dicTagNames["f6d4e5f6-a7b8-4901-1234-f60718293a4b"] = "L-03-9 주파수(Hz)";
            m_dicTagNames["07e5f6a7-b8c9-4a12-2345-0718293a4b5c"] = "L-03-9 누설전류(mA)";
            m_dicTagNames["18f6a7b8-c9d0-4b23-3456-18293a4b5c6d"] = "L-03-9 수요전력 최대값(kW)";
            m_dicTagNames["6d4b5c6d-7e8f-4890-0123-e5f60718293a"] = "L-03-9 전력 예측값(kWh)";
            m_dicTagNames["c226a457-4148-4e02-b258-294025d2904e"] = "L-03-10 Vrs(V)";
            m_dicTagNames["c5e13d10-e7a9-4a92-96ae-b4721473919e"] = "L-03-10 Vst(V)";
            m_dicTagNames["c7e3f837-1473-455b-b9d6-574f8414342a"] = "L-03-10 Vtr(V)";
            m_dicTagNames["cb6064f5-562a-41f2-895c-9c9861e670d8"] = "L-03-10 Ar(A)";
            m_dicTagNames["d3a04c10-5386-4f4a-8d69-d5a2307c0827"] = "L-03-10 As(A)";
            m_dicTagNames["d613e54b-4028-4061-82d3-1d4d03986a43"] = "L-03-10 At(A)";
            m_dicTagNames["d89b6574-e3c3-4d76-b6b6-3c224c3e8783"] = "L-03-10 전력(kW)";
            m_dicTagNames["db649660-3162-4211-9f93-5182a4d31d1d"] = "L-03-10 유효전력량(kWh)";
            m_dicTagNames["dbf798b1-39e2-482a-8d18-9128f70356c9"] = "L-03-10 역률(%)";
            m_dicTagNames["e5659837-c837-4d1a-85d0-4d56d1f9a2e3"] = "L-03-10 주파수(Hz)";
            m_dicTagNames["e7b0c34e-7b7d-4b9e-9d8a-6415f9b4f0b2"] = "L-03-10 누설전류(mA)";
            m_dicTagNames["f12c1c65-2761-4c12-9c4c-47348982a7f0"] = "L-03-10 수요전력 최대값(kW)";
            m_dicTagNames["e5c3d4e5-f6a7-4012-8345-67890a1b2c3d"] = "L-03-10 전력 예측값(kWh)";
            m_dicTagNames["2907b8c9-d0e1-4c34-4567-293a4b5c6d7e"] = "L-03-11 Vrs(V)";
            m_dicTagNames["3a18c9d0-e1f2-4d45-5678-3a4b5c6d7e8f"] = "L-03-11 Vst(V)";
            m_dicTagNames["4b29d0e1f-2a3b-4e56-6789-4b5c6d7e8f90"] = "L-03-11 Vtr(V)";
            m_dicTagNames["5c3a1e2f-3a4b-4f67-7890-5c6d7e8f90a1"] = "L-03-11 Ar(A)";
            m_dicTagNames["6d4b2f3a-4b5c-4078-8901-6d7e8f90a1b2"] = "L-03-11 As(A)";
            m_dicTagNames["7e5c3a4b-5c6d-4189-9012-7e8f90a1b2c3"] = "L-03-11 At(A)";
            m_dicTagNames["8f6d4b5c-6d7e-4290-a123-8f90a1b2c3d4"] = "L-03-11 전력(kW)";
            m_dicTagNames["907e5c6d-7e8f-43a1-b234-90a1b2c3d4e5"] = "L-03-11 유효전력량(kWh)";
            m_dicTagNames["a18f6d7e-8f90-44b2-c345-a1b2c3d4e5f6"] = "L-03-11 역률(%)";
            m_dicTagNames["b2907e8f-90a1b-45c3-d456-b2c3d4e5f607"] = "L-03-11 주파수(Hz)";
            m_dicTagNames["c3a18f90-a1b2c-46d4-e567-c3d4e5f60718"] = "L-03-11 누설전류(mA)";
            m_dicTagNames["d4b290a1-b2c3d-47e5-f678-d4e5f6071829"] = "L-03-11 수요전력 최대값(kW)";
            m_dicTagNames["7e5c6d7e-8f90-4901-1234-f60718293a4b"] = "L-03-11 전력 예측값(kWh)";
            m_dicTagNames["5097e8eb-3466-4c40-94f4-61b076e86337"] = "TR-1 온도";
            m_dicTagNames["006625ad-7454-419c-9424-6b404c3fc9b1"] = "TR-2 온도";
            m_dicTagNames["cc74e6c1-8e4a-49b0-9200-40f6d5237734"] = "TR-3 온도";
            m_dicTagNames["9228e36b-847b-4847-90fc-a5fc96faecdd"] = "충전설비-1 온도";
            m_dicTagNames["d66cd912-2ded-4afc-9cbd-b31be8aab300"] = "충전설비-1 습도";
            m_dicTagNames["14f4d379-ae46-4162-83be-5cc2d7f7da6b"] = "LP-유독물1층 온도";
            m_dicTagNames["b7ac0844-a34f-403c-9fca-b62b0dcb0d35"] = "LP-유독물1층 습도";
            m_dicTagNames["4dcd8a0a-4e60-4ae3-96bb-50b44b56703a"] = "LP-01 온도";
            m_dicTagNames["720d5d73-a228-4915-ae30-697b393d362a"] = "LP-01 습도";
            m_dicTagNames["e30ea9e1-5204-43d4-bded-cb908bbbd208"] = "DEMI. WATER 온도";
            m_dicTagNames["d7de5392-5abf-4ef4-8e70-1c4f87607566"] = "DEMI. WATER 습도";
            m_dicTagNames["340e0f7f-fb26-4ae0-9259-f75b4630fe24a"] = "CHILLER CIR. PUMP-1 온도";
            m_dicTagNames["3b608b85-b50b-49b2-95f5-6e1266d5f395"] = "CHILLER CIR. PUMP-1 습도";
            m_dicTagNames["e821bf95-9828-4a81-b297-034c143d4159"] = "NTPA공조설비 온도";
            m_dicTagNames["c7ca7c0a-7a04-4a75-9ae8-5a7978f1a23f"] = "NTPA공조설비 습도";
            m_dicTagNames["be17b89e-8604-4083-97ca-71537c2598d6"] = "EHT-2 온도";
            m_dicTagNames["176719a4-6ca7-46b1-b87c-15d4002713b5"] = "EHT-2 습도";
            m_dicTagNames["dc9523f3-3f71-4141-835a-fe00e811f370"] = "LP-유독물3층 온도";
            m_dicTagNames["f65c8f1f-c016-4a1f-8a53-d1c27a25f88d"] = "LP-유독물3층 습도";
            m_dicTagNames["cdc23bfe-2353-48f2-8383-fd5a0d49d8ac"] = "LP-02 온도";
            m_dicTagNames["a827f642-c902-4053-8e99-84a8e32735ac"] = "LP-02 습도";
            m_dicTagNames["97a45ed8-0cb9-404c-9674-77f0db4dadc8"] = "UPS SYSTEM 온도";
            m_dicTagNames["a46afe53-8ee7-44b3-ad20-628a1fb7e7df"] = "UPS SYSTEM 습도";
            m_dicTagNames["0540b8a0-83f5-40d2-b83e-65fc56071217"] = "MCC-100 온도";
            m_dicTagNames["2e1d1c34-c642-4489-8c46-90a7c83ce321"] = "MCC-100 습도";
            m_dicTagNames["da8f5b5b-695a-46d1-bdb6-f30b761d5757"] = "MCC-200 온도";
            m_dicTagNames["fa693ed4-db42-469c-9bab-536baf53833c"] = "MCC-200 습도";
            m_dicTagNames["00df4305-8249-4038-a632-2bc73d62cf1e"] = "MCC-300 온도";
            m_dicTagNames["561eba47-d8ff-42f4-946d-f727b79d8bbd"] = "MCC-300 습도";
            m_dicTagNames["2f2fcae6-4d5e-46bb-bf6c-de6884bfe56e"] = "MCC-400 온도";
            m_dicTagNames["23564b40-597c-4353-ae41-becd82005306"] = "MCC-400 습도";
            m_dicTagNames["cd30bfe4-80cf-432a-a31f-adcc6296f3b4"] = "MB-N1 양산설비 온도";
            m_dicTagNames["a4da0f31-0afd-4873-9f94-df2eec2ba06b"] = "MB-N1 양산설비 습도";
            m_dicTagNames["2aaaa75b-8e8a-49fe-a4bd-b5c7e14fd691"] = "BOILER PKG. 온도";
            m_dicTagNames["bec71ff8-8fe9-4ed8-9d2a-8ec300c991f2"] = "BOILER PKG. 습도";
            m_dicTagNames["7448838c-dd86-468b-8d80-50b3f2be9e7f"] = "SCRUBBER LCP 온도";
            m_dicTagNames["38e8c30e-65c8-4e9a-86f0-7501fc543dfb"] = "SCRUBBER LCP 습도";
            m_dicTagNames["eda3add1-a4d1-4a2b-a5b7-82053883b3ad"] = "FF-01(살수) 온도";
            m_dicTagNames["3512ee30-46fe-4f8a-a11f-9324e5f5de0c"] = "FF-01(살수) 습도";
            m_dicTagNames["4e3df909-bc31-4cc3-bc69-d3d9754507f6"] = "LP-HVAC1 온도";
            m_dicTagNames["eeab78b3-b802-418b-b0cc-2b663f908f47"] = "LP-HVAC1 습도";
            m_dicTagNames["d2a0a708-7beb-4843-bd5e-a2d1031674d2"] = "LP-COMP 온도";
            m_dicTagNames["6655a2d0-68b0-4115-ac79-c2e18cab00d1"] = "LP-COMP 습도";
            m_dicTagNames["437346fd-5543-4e5d-8626-8bba3ccf8be4"] = "LP-위험물1층 온도";
            m_dicTagNames["daadf464-b0b9-42ad-b044-1dcc513ee904"] = "LP-위험물1층 습도";
            m_dicTagNames["979b091b-6b71-433c-9e62-da87a48d423f"] = "충전설비-2 온도";
            m_dicTagNames["6fd4272b-f99f-4cc7-b8f2-c112f7dd2218"] = "충전설비-2 습도";
            m_dicTagNames["a71e6b07-2c84-4769-9aab-af0c515ac45b"] = "LP-03 온도";
            m_dicTagNames["552b3ae7-f796-43f8-8673-f0ca7725d953"] = "LP-03 습도";
            m_dicTagNames["c141a6e3-799e-495e-bc3e-6ab120a692ae"] = "LP-04 온도";
            m_dicTagNames["36b0f954-b962-4c9e-8367-bbb414d28a71"] = "LP-04 습도";
            m_dicTagNames["83de156f-337f-4191-992e-74291d826ecb"] = "EHT-1 온도";
            m_dicTagNames["ac6e15a2-e564-4b56-9a2b-4a22c7f03435"] = "EHT-1 습도";
            m_dicTagNames["3f559c9a-d4bf-4b70-95be-7c925e60c8bc"] = "LP-HVAC2 온도";
            m_dicTagNames["4ebf3265-e73c-4e08-9015-2310f8848eb8"] = "LP-HVAC2 습도";
            m_dicTagNames["35304f0b-5a62-4076-bf6c-7b287ef60de7"] = "HVrnC-3(AHU-5) Vrn";
            m_dicTagNames["f7a3355b-85e3-4cf4-a719-731eb0d4566b"] = "HVrnC-3(AHU-5) Vsn";
            m_dicTagNames["c51cc430-d72d-491e-9b42-0a04de5f6485"] = "HVrnC-3(AHU-5) Vtn";
            m_dicTagNames["2f70439a-77e2-4202-ad2b-bb120061f426"] = "HVrnC-3(AHU-5) Vrs";
            m_dicTagNames["be73dcd9-bd33-41f2-91ee-f8787c0b13f2"] = "HVrnC-3(AHU-5) Vst";
            m_dicTagNames["fd28d10c-b6b1-4794-a05c-6cbd9e303712"] = "HVrnC-3(AHU-5) Vtr";
            m_dicTagNames["c76da9ac-4915-4245-a887-c59e3a6a5dc1"] = "HVrnC-3(AHU-5) Ar";
            m_dicTagNames["8176df53-38cc-49d8-986c-728af5e33566"] = "HVrnC-3(AHU-5) As";
            m_dicTagNames["cb8afd0b-bbf1-4e7f-ba18-99e1e46d6cf8"] = "HVrnC-3(AHU-5) At";
            m_dicTagNames["bb312c21-c3f4-40e3-b75d-fb14f9ea7838"] = "HVrnC-3(AHU-5) kW";
            m_dicTagNames["d79871a5-aa0d-4ecf-81e6-665f3f2e8f25"] = "HVrnC-3(AHU-5) kVar";
            m_dicTagNames["4267c55a-fec5-45fe-8f40-97a392b9dda6"] = "HKVAC-3(AHU-5) KVA";
            m_dicTagNames["84498899-ba17-46b7-9709-6093a1f28bef"] = "HVrnC-3(AHU-5) Hz";
            m_dicTagNames["c0adc0ff-01ee-4628-84ee-7586b8197b89"] = "HVrnC-3(AHU-5) PF";
            m_dicTagNames["5157b01b-8757-4fba-b8d0-7f187933d1a6"] = "HVrnC-3(AHU-5) KWh";
            m_dicTagNames["cba0bcc7-5e18-4e7f-8f76-de6e026604d2"] = "HVrnC-3(AHU-5) kVarh";
            m_dicTagNames["e4755e12-d047-4160-a214-27d0d5da0139"] = "HVrnC-2(AHU-4) Vrn";
            m_dicTagNames["5a94e2cc-bf30-4a06-949d-6d6a0ade4fac"] = "HVrnC-2(AHU-4) Vsn";
            m_dicTagNames["4a9c5d0d-64ea-4238-a04a-3a36ca50be45"] = "HVrnC-2(AHU-4) Vtn";
            m_dicTagNames["2085d266-e2e2-47d5-a545-a48ab44aafa8"] = "HVrnC-2(AHU-4) Vrs";
            m_dicTagNames["275cefb0-1e94-4f6a-a941-105bf6789df4"] = "HVrnC-2(AHU-4) Vst";
            m_dicTagNames["ed7e57dc-68b2-4c3e-8351-71d958960440"] = "HVrnC-2(AHU-4) Vtr";
            m_dicTagNames["e5edda8c-db24-4f9f-b8c7-8eb49984a89a"] = "HVrnC-2(AHU-4) Ar";
            m_dicTagNames["a54e70aa-2f17-41d4-bbd4-00e3ff3297ae"] = "HVrnC-2(AHU-4) As";
            m_dicTagNames["504cc165-2e4e-4f2d-b4b5-bc04a82d6e54"] = "HVrnC-2(AHU-4) At";
            m_dicTagNames["0650d0f8-7a74-4eec-aded-53ed6d3e1c57"] = "HVrnC-2(AHU-4) kW";
            m_dicTagNames["70d3eaf4-ac07-4853-ba53-e6f0b0c389a3"] = "HVrnC-2(AHU-4) kVar";
            m_dicTagNames["0d1b8151-462b-4729-bb5a-11cb9cf5d8c8"] = "HKVAC-2(AHU-4) KVA";
            m_dicTagNames["f997addf-2255-4381-a719-56f72d42d160"] = "HVrnC-2(AHU-4) Hz";
            m_dicTagNames["846b4301-3ceb-4e96-9ff1-efa388f98d1a"] = "HVrnC-2(AHU-4) PF";
            m_dicTagNames["d94c6ab3-ff44-45d6-bbef-05fc8c046931"] = "HVrnC-2(AHU-4) KWh";
            m_dicTagNames["9cffcd91-30fa-4723-b0bb-3cd245299b27"] = "HVrnC-2(AHU-4) kVarh";
            m_dicTagNames["61201485-c58a-4e5c-ac9c-e181dc53fe67"] = "HVrnC-1(AHU-3) Vrn";
            m_dicTagNames["01294418-84c7-4a6f-8e12-2821291907d7"] = "HVrnC-1(AHU-3) Vsn";
            m_dicTagNames["9752ec4b-b5e5-4a23-8264-b5e049996a59"] = "HVrnC-1(AHU-3) Vtn";
            m_dicTagNames["7c0dd5e6-9ee8-41f4-a352-9a1b48efbcaa"] = "HVrnC-1(AHU-3) Vrs";
            m_dicTagNames["dce31e78-d0cc-45da-bfd3-d1273868045e"] = "HVrnC-1(AHU-3) Vst";
            m_dicTagNames["8e2647c7-a4a2-42fd-958b-9bd60ff2220f"] = "HVrnC-1(AHU-3) Vtr";
            m_dicTagNames["d084b47f-1d4c-4cd3-a424-7ada445d022e"] = "HVrnC-1(AHU-3) Ar";
            m_dicTagNames["26230c83-9331-4713-bf6c-ee98a98a5ab1"] = "HVrnC-1(AHU-3) As";
            m_dicTagNames["093b121b-79b2-4afa-a4bc-772d46dfc107"] = "HVrnC-1(AHU-3) At";
            m_dicTagNames["2fb46399-f595-430c-a8c9-6c1dbaf39a57"] = "HVrnC-1(AHU-3) kW";
            m_dicTagNames["abab01a0-5ba4-449a-a63d-a155ef8a7d41"] = "HVrnC-1(AHU-3) kVar";
            m_dicTagNames["a336701a-5269-4fa1-ac4c-35f6ee4dfdb5"] = "HKVAC-1(AHU-3) KVA";
            m_dicTagNames["72b09b7a-4924-4107-b6a8-488459f5af12"] = "HVrnC-1(AHU-3) Hz";
            m_dicTagNames["8ca5c8d9-7031-4a4f-88df-3bf07fc8f5a6"] = "HVrnC-1(AHU-3) PF";
            m_dicTagNames["f5e93404-f091-4ecc-8f33-a9b31f4675b7"] = "HVrnC-1(AHU-3) KWh";
            m_dicTagNames["1d640755-3b48-40cd-bdcc-b04dabddb513"] = "HVrnC-1(AHU-3) kVarh";
            m_dicTagNames["84ce7bac-430e-41c8-a5ab-752fe6b28edc"] = "AI COOLER Vrn";
            m_dicTagNames["2a453596-9ea2-437b-9cc3-42d8bbf85940"] = "AI COOLER Vsn";
            m_dicTagNames["f931464c-6889-424e-98fe-9a092ef126a0"] = "AI COOLER Vtn";
            m_dicTagNames["a60febd7-5947-40f4-b1da-608da8f7f5e2"] = "AI COOLER Vrs";
            m_dicTagNames["e82d7490-940a-4e24-9a5d-58e69ec28cbe"] = "AI COOLER Vst";
            m_dicTagNames["92831fa2-7b63-4687-a769-afd5cb82ff76"] = "AI COOLER Vtr";
            m_dicTagNames["02156176-e685-4fcb-82c4-07a9f8aa77b1"] = "AI COOLER Ar";
            m_dicTagNames["8974a22d-6bba-480f-8b38-15c6b864cc80"] = "AI COOLER As";
            m_dicTagNames["13ec82d0-c0ec-44a7-a599-0ac19f89c3a6"] = "AI COOLER At";
            m_dicTagNames["96dea8ff-82ea-4658-9419-cddd3df11f4f"] = "AI COOLER kW";
            m_dicTagNames["2267adbf-c751-4e82-8b47-d2e7854b4f81"] = "AI COOLER kVar";
            m_dicTagNames["ca39ead5-9d35-4618-b08e-47bccbe1c93e"] = "AI COOLER KVA";
            m_dicTagNames["7e473cfa-9c76-4af7-a451-878a08f5f4c2"] = "AI COOLER Hz";
            m_dicTagNames["b129f47c-55c5-4d53-adbf-029ac4e10400"] = "AI COOLER PF";
            m_dicTagNames["afa88894-2f0a-4ec8-9042-5a2df3acebf4"] = "AI COOLER KWh";
            m_dicTagNames["0c323713-5e2b-4b74-9bb5-00f847183e6d"] = "AI COOLER kVarh";
            m_dicTagNames["8aa2b7ae-aa9a-4f5f-8dbd-f4f9403a4368"] = "흡착식 드라이어 Vrn";
            m_dicTagNames["aeb5002f-4856-499d-b93b-4ce916cdbb5a"] = "흡착식 드라이어 Vsn";
            m_dicTagNames["a8fc5603-cddd-46eb-a3d3-f4f20b9a8ef5"] = "흡착식 드라이어 Vtn";
            m_dicTagNames["0bc44966-ca4f-419f-8198-1c0db1e28fc1"] = "흡착식 드라이어 Vrs";
            m_dicTagNames["dfc4ad95-20ac-476f-983c-6651fdd11ec5"] = "흡착식 드라이어 Vst";
            m_dicTagNames["3767635a-4207-42c7-85f6-8690ba3943a8"] = "흡착식 드라이어 Vtr";
            m_dicTagNames["508dcced-d559-4f74-8f06-2a69577a6f2e"] = "흡착식 드라이어 Ar";
            m_dicTagNames["8a12bb99-a960-4eed-89e1-a47975e94547"] = "흡착식 드라이어 As";
            m_dicTagNames["dfbab8e5-acec-43f2-bcc8-bd7d8586abc0"] = "흡착식 드라이어 At";
            m_dicTagNames["e6740008-9393-40df-9369-0fcb35681e46"] = "흡착식 드라이어 kW";
            m_dicTagNames["55a991ef-8d2a-42f0-be62-d2d301524de0"] = "흡착식 드라이어 kVar";
            m_dicTagNames["ac38f4ca-c095-4562-b5c0-c4996a58b6fe"] = "흡착식 드라이어 KVA";
            m_dicTagNames["b389b9a6-cb09-4f0d-a191-b3a1635d329e"] = "흡착식 드라이어 Hz";
            m_dicTagNames["4636b015-731d-4f4b-9e4b-5dc751c88170"] = "흡착식 드라이어 PF";
            m_dicTagNames["f4aef0c2-d26b-4477-840b-1da2c1efde30"] = "흡착식 드라이어 KWh";
            m_dicTagNames["5c291638-24a7-45ba-b5d3-09ddcf565540"] = "흡착식 드라이어 kVarh";
            m_dicTagNames["93d6711f-0288-43ba-b73b-53e1e4449268"] = "에어 드라이어 Vrn";
            m_dicTagNames["c023194c-5be7-4339-b3f4-228b95f26197"] = "에어 드라이어 Vsn";
            m_dicTagNames["3135866d-5c8b-435c-aeb1-28c64abee3d5"] = "에어 드라이어 Vtn";
            m_dicTagNames["b6bd1b13-0a55-40ed-a89e-9db3d0c68ac8"] = "에어 드라이어 Vrs";
            m_dicTagNames["97830748-6298-4c8a-8e8d-06e246105bab"] = "에어 드라이어 Vst";
            m_dicTagNames["33308dbc-9fc8-405c-8451-e8b9a767a8da"] = "에어 드라이어 Vtr";
            m_dicTagNames["b1bf0a70-aff6-4f1f-b57f-13d41aace8d7"] = "에어 드라이어 Ar";
            m_dicTagNames["fd7f9b3a-c8d7-4b7c-928f-de26c36bcb0a"] = "에어 드라이어 As";
            m_dicTagNames["703d593b-654b-4b19-b49d-326dbdb47fff"] = "에어 드라이어 At";
            m_dicTagNames["8afd68f5-600b-4b96-aa02-5baa5200366d"] = "에어 드라이어 kW";
            m_dicTagNames["379401e8-77e2-404e-a23f-eaf4a2efeb84"] = "에어 드라이어 kVar";
            m_dicTagNames["93becfaf-8072-401b-8a4a-67dda4e89dc0"] = "에어 드라이어 KVA";
            m_dicTagNames["ea82c676-3f46-4df3-b69e-c1abf21cf741"] = "에어 드라이어 Hz";
            m_dicTagNames["4f556282-2980-489a-a7c7-69b403a26461"] = "에어 드라이어 PF";
            m_dicTagNames["49aff2e8-77c9-49a4-9e51-a745a88b7acc"] = "에어 드라이어 KWh";
            m_dicTagNames["e37444cf-39b0-425f-969f-a967493e7402"] = "에어 드라이어 kVarh";
            m_dicTagNames["56a08f13-b33f-4e00-9ec0-254bcc2f68f3"] = "COMP-1 Vrn";
            m_dicTagNames["f26f13ec-737c-40d1-af6e-b9f08e4be132"] = "COMP-1 Vsn";
            m_dicTagNames["fb58e526-a846-4959-bc5b-bc231a3ef9dd"] = "COMP-1 Vtn";
            m_dicTagNames["53773ab4-45a6-4afd-8b40-59ee4edd40b5"] = "COMP-1 Vrs";
            m_dicTagNames["905afac1-d994-42c6-a2e5-b0ddee15353c"] = "COMP-1 Vst";
            m_dicTagNames["f2ebbeb8-fc8d-4403-b816-4456efa3afa1"] = "COMP-1 Vtr";
            m_dicTagNames["858e0775-30e7-40cd-89a5-d381b63c0a90"] = "COMP-1 Ar";
            m_dicTagNames["fe180f62-eca2-4da7-94fb-29a64282a804"] = "COMP-1 As";
            m_dicTagNames["8bd55ce6-e3df-4c0a-a3a1-467615b27e6c"] = "COMP-1 At";
            m_dicTagNames["aeb0c1e0-d677-43a2-88df-b5a987607b38"] = "COMP-1 kW";
            m_dicTagNames["d3551bcf-0974-4fe1-ba85-a913db654652"] = "COMP-1 kVar";
            m_dicTagNames["e95daa99-8727-4afe-a5b9-5671610ab5a7"] = "COMP-1 KVA";
            m_dicTagNames["714fb38c-3bc1-4319-9695-0216a0feaf8e"] = "COMP-1 Hz";
            m_dicTagNames["26c67026-2e84-4acc-91e6-b8d679618ae2"] = "COMP-1 PF";
            m_dicTagNames["9bb6f8ae-cb81-4968-a3d5-16ca8b851144"] = "COMP-1 KWh";
            m_dicTagNames["0e019100-7926-4c55-9231-090b7639c143"] = "COMP-1 kVarh";
            m_dicTagNames["90ddb5b8-77fe-4665-9ea8-6a5bec79fd25"] = "COMP-2 Vrn";
            m_dicTagNames["9618774c-207e-493d-9d1a-8fc873f2ebc1"] = "COMP-2 Vsn";
            m_dicTagNames["4beadcac-2026-45db-af56-af14a9693fbe"] = "COMP-2 Vtn";
            m_dicTagNames["0936c4df-05f5-4dd8-a7ac-4fd8be46c607"] = "COMP-2 Vrs";
            m_dicTagNames["c8058d71-082a-45d1-8552-8d05f7b0b308"] = "COMP-2 Vst";
            m_dicTagNames["22943198-af28-4e60-a441-7cb296fd691c"] = "COMP-2 Vtr";
            m_dicTagNames["8ba614e1-b64b-4524-ae55-1f60fa517d74"] = "COMP-2 Ar";
            m_dicTagNames["579aae32-79a2-465d-909c-e642a197540a"] = "COMP-2 As";
            m_dicTagNames["4e20a501-4faf-4c5f-9327-29d1323432b0"] = "COMP-2 At";
            m_dicTagNames["a644fe0b-aef3-4056-a5f5-a92e7754999c"] = "COMP-2 kW";
            m_dicTagNames["8718d42d-fbe8-424d-befd-01935a361485"] = "COMP-2 kVar";
            m_dicTagNames["7b415343-bc70-48ef-9d5f-8a64564a106e"] = "COMP-2 KVA";
            m_dicTagNames["8b2e7163-87fb-45e4-a176-4610ae4dbb52"] = "COMP-2 Hz";
            m_dicTagNames["c62342fa-bd9b-4600-a633-e4bb9e07e5e0"] = "COMP-2 PF";
            m_dicTagNames["cc986168-9dae-4be9-91ce-3551acbb9f35"] = "COMP-2 KWh";
            m_dicTagNames["878e6c3d-47c4-473c-a231-1997bffbdaff"] = "COMP-2 kVarh";
            m_dicTagNames["d83f7695-5b67-4d12-bfb8-bb69ac37c789"] = "BOiILER-1 Vrn";
            m_dicTagNames["da93bb33-a2d7-4691-9a52-689c1d574760"] = "BOiILER-1 Vsn";
            m_dicTagNames["937aa75d-e91e-4b10-9bee-275b2dcd2795"] = "BOiILER-1 Vtn";
            m_dicTagNames["011369c1-12d3-45ab-bf02-f9856e29fdf3"] = "BOiILER-1 Vrs";
            m_dicTagNames["ac5f28b6-d7ae-45a7-b236-296528bb102f"] = "BOiILER-1 Vst";
            m_dicTagNames["6ce25c49-ce23-4330-8b9a-e051bda1073f"] = "BOiILER-1 Vtr";
            m_dicTagNames["ba2e37bc-190e-4f40-bf26-b7ab82ba1cc5"] = "BOiILER-1 Ar";
            m_dicTagNames["f79b039e-6f9c-43e5-96ae-187064052817"] = "BOiILER-1 As";
            m_dicTagNames["955e0a8d-8d0e-4ad1-b019-bc2cb812c0c8"] = "BOiILER-1 At";
            m_dicTagNames["ad2654a1-1146-4e63-8340-a1aaad355baf"] = "BOiILER-1 kW";
            m_dicTagNames["1b0f3e61-15dc-4464-be96-2145aae91c5c"] = "BOiILER-1 kVar";
            m_dicTagNames["e4865b12-5e40-42ec-9c91-9b2132c18a87"] = "BOiILER-1 KVA";
            m_dicTagNames["6065334f-01d7-4da7-9fc9-eec1821e1983"] = "BOiILER-1 Hz";
            m_dicTagNames["c5b9ecc1-112f-4710-a164-22e5acc459a4"] = "BOiILER-1 PF";
            m_dicTagNames["070efe51-0629-4ce4-88ec-52c9c4c61165"] = "BOiILER-1 KWh";
            m_dicTagNames["6b0b3613-77d0-49e7-8bdb-e37bb82bd39d"] = "BOiILER-1 kVarh";
            m_dicTagNames["a747e99a-6fe2-4e8e-8164-83a41d0c7a98"] = "BOiILER-2 Vrn";
            m_dicTagNames["407901cc-3045-4a2e-9c2c-d48f04571dcd"] = "BOiILER-2 Vsn";
            m_dicTagNames["08430a8b-0ac6-4aff-8b84-5f6b5ab87329"] = "BOiILER-2 Vtn";
            m_dicTagNames["2815cdd3-7432-40de-aebe-b83ef368e175"] = "BOiILER-2 Vrs";
            m_dicTagNames["c26a20bb-ff5e-4cfe-9862-f025fe0bcd4b"] = "BOiILER-2 Vst";
            m_dicTagNames["7c61fcc3-bfd2-4ce9-b64c-07bad8e6cae1"] = "BOiILER-2 Vtr";
            m_dicTagNames["dd320a8f-bbb8-4fff-9388-201474e58f92"] = "BOiILER-2 Ar";
            m_dicTagNames["e9b25442-0d94-44a5-88ed-1187f9a5d90d"] = "BOiILER-2 As";
            m_dicTagNames["c0b764a9-0925-4dda-955a-3b08a6a4f580"] = "BOiILER-2 At";
            m_dicTagNames["abbdcce8-472b-49eb-9cc3-069da2e995a8"] = "BOiILER-2 kW";
            m_dicTagNames["c1688e44-19c9-4a25-9ca2-1913f370dddd"] = "BOiILER-2 kVar";
            m_dicTagNames["394d8392-f752-4443-9091-99202b65348b"] = "BOiILER-2 KVA";
            m_dicTagNames["976f0e00-e49c-4beb-beb8-908bb73bf062"] = "BOiILER-2 Hz";
            m_dicTagNames["07d7bf26-b4bc-4ddf-9386-a5d8337afe3d"] = "BOiILER-2 PF";
            m_dicTagNames["8fa70290-806c-4f0a-9427-b681d18898c3"] = "BOiILER-2 KWh";
            m_dicTagNames["9b53ac29-c909-4bb5-85fa-b98ef7e30a3d"] = "BOiILER-2 kVarh";
            m_dicTagNames["00a57e2b-bd20-47f5-9e65-8a00503409b4"] = "BOiILER-3 Vrn";
            m_dicTagNames["3c5c69a6-915b-4b60-ae6a-5e2f7226357c"] = "BOiILER-3 Vsn";
            m_dicTagNames["37971260-211e-4c22-b332-d93dbc1cc88b"] = "BOiILER-3 Vtn";
            m_dicTagNames["a80c93d2-d08d-4a8a-948b-52db588007e6"] = "BOiILER-3 Vrs";
            m_dicTagNames["e32672ce-329e-456b-acaa-920d11f1c165"] = "BOiILER-3 Vst";
            m_dicTagNames["6575ad7a-a69c-445d-9f24-4ca89656cb56"] = "BOiILER-3 Vtr";
            m_dicTagNames["6096c592-dc9d-4c21-8f07-46d7aa8a7d40"] = "BOiILER-3 Ar";
            m_dicTagNames["5137647c-b6da-4fc5-b274-36160d3da6e0"] = "BOiILER-3 As";
            m_dicTagNames["8006507c-813b-4ae4-b22b-610fa0ef8bba"] = "BOiILER-3 At";
            m_dicTagNames["19eb07b1-79d3-4187-bf5a-6def8875de4f"] = "BOiILER-3 kW";
            m_dicTagNames["3947aab9-09b6-4f55-852d-e533e3740739"] = "BOiILER-3 kVar";
            m_dicTagNames["d567bc96-ddd1-45fb-92f0-4d8a3ba1e35b"] = "BOiILER-3 KVA";
            m_dicTagNames["76b0b0ce-7fbc-43a2-aab7-faf7e115ae26"] = "BOiILER-3 Hz";
            m_dicTagNames["bf5bbb42-c526-47b3-a1e2-3150f7a848df"] = "BOiILER-3 PF";
            m_dicTagNames["6f06cfef-b5a6-4e45-8630-d2e3ae47189a"] = "BOiILER-3 KWh";
            m_dicTagNames["5e1655cf-f66d-4762-be3f-80d93923c131"] = "BOiILER-3 kVarh";
            m_dicTagNames["4a30d293-6a1b-4799-8bec-f1f12b173ef3"] = "부스터 펌프 Vrn";
            m_dicTagNames["f61178de-fe58-4882-8630-16fd2def861a"] = "부스터 펌프 Vsn";
            m_dicTagNames["73c40097-3207-4ca9-b79b-7b83df1c6e02"] = "부스터 펌프 Vtn";
            m_dicTagNames["26eb22d1-d02b-4d45-a284-e220c000d42e"] = "부스터 펌프 Vrs";
            m_dicTagNames["a7eaaa93-744c-420d-865c-f3627f54b204"] = "부스터 펌프 Vst";
            m_dicTagNames["6e69d5dd-488c-4aaa-a761-d554c1a03e4b"] = "부스터 펌프 Vtr";
            m_dicTagNames["fbaa6e5a-a214-4479-9d4f-bb23df63409f"] = "부스터 펌프 Ar";
            m_dicTagNames["8d1f3e10-e253-4494-b111-c8c996d3a0be"] = "부스터 펌프 As";
            m_dicTagNames["bdc2181a-f211-4cd8-92dd-9ad8d4f8371c"] = "부스터 펌프 At";
            m_dicTagNames["cc5fe9a0-2f2c-4ad4-9059-c9e7741042fc"] = "부스터 펌프 kW";
            m_dicTagNames["71a4c86c-629d-4112-a5da-2c4d13db7ebb"] = "부스터 펌프 kVar";
            m_dicTagNames["6aa06c6d-4d09-471b-a74b-2b4e6c91cfb9"] = "부스터 펌프 KVA";
            m_dicTagNames["fb390d40-f7ef-4cea-b35b-68e2735216fa"] = "부스터 펌프 Hz";
            m_dicTagNames["9c89627b-3c5f-4ef8-8315-5453d70cc30e"] = "부스터 펌프 PF";
            m_dicTagNames["4d60cab2-3e53-4ac5-af03-c0a3d18c6739"] = "부스터 펌프 KWh";
            m_dicTagNames["1f6133f6-f2af-4b1e-87cd-70aeb6fd8aff"] = "부스터 펌프 kVarh";
            m_dicTagNames["456641eb-afd7-41fb-b71a-c6d538dd2d3d"] = "실외기#1 Vrn";
            m_dicTagNames["a5989002-58b1-4861-ab9a-b62c5d03ab75"] = "실외기#1 Vsn";
            m_dicTagNames["2e1dc5ba-5f73-4d2c-be9e-b64ec313ceb4"] = "실외기#1 Vtn";
            m_dicTagNames["cf065611-8599-4a7e-a0a6-70e0f8c3ae38"] = "실외기#1 Vrs";
            m_dicTagNames["bc2df811-ee5b-4ad6-b286-19deae5acfea"] = "실외기#1 Vst";
            m_dicTagNames["4e2091d8-ff41-440f-99f0-d9e809ef3a22"] = "실외기#1 Vtr";
            m_dicTagNames["2ba94afd-3404-4266-918a-974d8e3d927e"] = "실외기#1 Ar";
            m_dicTagNames["e660b775-c56d-4fa6-9a9d-83750685a435"] = "실외기#1 As";
            m_dicTagNames["60906357-d45a-4c75-9cb7-0d532bc86d40"] = "실외기#1 At";
            m_dicTagNames["4f24310e-c803-49aa-9a86-1a1f54668411"] = "실외기#1 kW";
            m_dicTagNames["e7fd1888-b512-469b-9243-0f56721f46b8"] = "실외기#1 kVar";
            m_dicTagNames["090b1fb7-ab17-44c3-bcaf-df988038b812"] = "실외기#1 KVA";
            m_dicTagNames["b0143575-a349-4d5d-8e5c-4483ea776c25"] = "실외기#1 Hz";
            m_dicTagNames["ddec598b-54ca-4bb8-bb45-68431ef7cfc3"] = "실외기#1 PF";
            m_dicTagNames["9ac6f625-8818-40a3-b524-2d28d9b4f5a9"] = "실외기#1 KWh";
            m_dicTagNames["67a6fc7d-13a2-4fc5-887c-c20eb453840a"] = "실외기#1 kVarh";
            m_dicTagNames["9588e3af-e294-463f-8c42-721dad09aac8"] = "실외기#2 Vrn";
            m_dicTagNames["0e283ef5-db81-47e8-81c7-3d4e3c50d082"] = "실외기#2 Vsn";
            m_dicTagNames["38a394d7-2a95-4392-affd-35fa2a7222f5"] = "실외기#2 Vtn";
            m_dicTagNames["02cb963e-6337-4447-9794-a9ce5dcdd79a"] = "실외기#2 Vrs";
            m_dicTagNames["a97365b6-c533-4624-8504-d07494d549b2"] = "실외기#2 Vst";
            m_dicTagNames["9a40b996-14c7-4a58-b3f8-504900bd58ee"] = "실외기#2 Vtr";
            m_dicTagNames["cfd6d9e4-c245-44fe-b04f-63c6537c87cd"] = "실외기#2 Ar";
            m_dicTagNames["e4cb98d1-7382-40db-b7d4-65ac53d18436"] = "실외기#2 As";
            m_dicTagNames["c986e7fd-70d4-461e-86ee-9d85006010bd"] = "실외기#2 At";
            m_dicTagNames["02ae5506-9c73-4b07-96db-3b0115c0f2a0"] = "실외기#2 kW";
            m_dicTagNames["d23b0128-e387-4787-ace6-188b4c7d005c"] = "실외기#2 kVar";
            m_dicTagNames["40ae954d-c95e-41ce-b761-5641c9504bd6"] = "실외기#2 KVA";
            m_dicTagNames["96fb55f2-1d90-4123-bb41-4bdeba65454c"] = "실외기#2 Hz";
            m_dicTagNames["51d3f107-e4f0-40dc-89a3-6e08da51e4a6"] = "실외기#2 PF";
            m_dicTagNames["5083aaec-cc0f-4efa-b519-fdf437bbdee2"] = "실외기#2 KWh";
            m_dicTagNames["2b6dae43-1ab1-46d8-ab8a-b79ecff9f923"] = "실외기#2 kVarh";
            m_dicTagNames["69ac7a34-7663-46f0-9e77-5c53f6c2422d"] = "실외기#3 Vrn";
            m_dicTagNames["184ff6c4-f986-4b94-b6fd-cb928d7c1dc3"] = "실외기#3 Vsn";
            m_dicTagNames["e620bfb0-9000-44d0-8f80-cf8c17824ca1"] = "실외기#3 Vtn";
            m_dicTagNames["f9205ca5-35bc-40cf-825d-e670461f8d54"] = "실외기#3 Vrs";
            m_dicTagNames["d2fac266-9e21-44fb-8210-bb28839331a6"] = "실외기#3 Vst";
            m_dicTagNames["ec5b43bd-e99f-49c2-8a45-14b30e30d455"] = "실외기#3 Vtr";
            m_dicTagNames["f377ed04-dbd2-4077-83f3-df6cb7907af4"] = "실외기#3 Ar";
            m_dicTagNames["07887672-ca56-4a80-8b47-d012cb08e5f7"] = "실외기#3 As";
            m_dicTagNames["d2e79a88-3287-4e87-b31b-5aab0a266a8c"] = "실외기#3 At";
            m_dicTagNames["d0004e91-aec9-4b84-aa48-fd9bd26df3f4"] = "실외기#3 kW";
            m_dicTagNames["7b2f6e5e-0095-4bbb-bc04-8e4f5d4a7fbf"] = "실외기#3 kVar";
            m_dicTagNames["42dc14cb-b9fb-4b3c-8951-a4e4d2628824"] = "실외기#3 KVA";
            m_dicTagNames["25f07c8b-051a-452e-845f-cf5ef14268cb"] = "실외기#3 Hz";
            m_dicTagNames["741d39b7-aabf-462f-8fff-27795f32344d"] = "실외기#3 PF";
            m_dicTagNames["740cc341-61b0-4b27-bc5a-04b1de878517"] = "실외기#3 KWh";
            m_dicTagNames["512f48b4-1278-4aa5-9c9d-c1c2c3be3f01"] = "실외기#3 kVarh";
            m_dicTagNames["93e694c6-481c-4b07-a561-a6c9a44bd868"] = "실외기#4 Vrn";
            m_dicTagNames["5c33d4ad-9894-4b4e-a84e-066ff76d5c11"] = "실외기#4 Vsn";
            m_dicTagNames["07de2d57-afdb-4175-bff0-05a1d2452032"] = "실외기#4 Vtn";
            m_dicTagNames["ea70b86a-4b00-4d8e-825b-7544c4cb177e"] = "실외기#4 Vrs";
            m_dicTagNames["de1ab8dc-c795-4c63-8950-42fe6cb75c45"] = "실외기#4 Vst";
            m_dicTagNames["e8c8b7cd-c76b-466f-ae47-4369ecaac713"] = "실외기#4 Vtr";
            m_dicTagNames["28a82204-50dd-4621-b836-093917569962"] = "실외기#4 Ar";
            m_dicTagNames["f779d932-1f49-45b6-b8fe-5f2cf38a7e27"] = "실외기#4 As";
            m_dicTagNames["d5e295e8-8342-4cb0-8a34-a330bee6cf6f"] = "실외기#4 At";
            m_dicTagNames["52585d93-e80d-40d4-84fb-c84503c42cd7"] = "실외기#4 kW";
            m_dicTagNames["c84b80a4-a84a-49d3-a6fc-f24512dc79a3"] = "실외기#4 kVar";
            m_dicTagNames["334a764d-647e-4442-a3b3-304148faa278"] = "실외기#4 KVA";
            m_dicTagNames["484505a6-a064-4d05-bf06-02906a9749bf"] = "실외기#4 Hz";
            m_dicTagNames["cec2e9e0-dc85-452c-9a6a-532702ad9b15"] = "실외기#4 PF";
            m_dicTagNames["4539f5c6-4d3e-4d07-8352-be4f03e74922"] = "실외기#4 KWh";
            m_dicTagNames["a3753a3a-eebb-4561-821a-f531d093fef9"] = "실외기#4 kVarh";
            m_dicTagNames["659c4173-cbde-4297-959c-1c86edab15d7"] = "실외기#5 Vrn";
            m_dicTagNames["48b690a8-90c8-4d4c-815f-1db910357328"] = "실외기#5 Vsn";
            m_dicTagNames["23849305-6dbf-4309-a991-9d0994478860"] = "실외기#5 Vtn";
            m_dicTagNames["a3dea309-3b25-49f7-a250-ddb9e8a34ead"] = "실외기#5 Vrs";
            m_dicTagNames["db09f9c4-2961-49d1-8ad1-f771ce0278f9"] = "실외기#5 Vst";
            m_dicTagNames["69985973-76c4-40db-bed2-f0885bbbfcc6"] = "실외기#5 Vtr";
            m_dicTagNames["f1774c71-9e00-4079-91a3-4462a3b91c20"] = "실외기#5 Ar";
            m_dicTagNames["83ff9602-7ba7-4286-92ba-5e081e983093"] = "실외기#5 As";
            m_dicTagNames["b4068b5e-49cd-48d1-ac63-60df2b70fea9"] = "실외기#5 At";
            m_dicTagNames["e751226b-2bf4-4641-b435-f4f10f1047ae"] = "실외기#5 kW";
            m_dicTagNames["6cfa7727-1302-4850-8337-773f49f03e6c"] = "실외기#5 kVar";
            m_dicTagNames["6a54298e-9f75-4b49-86fc-d93bd5e76dc4"] = "실외기#5 KVA";
            m_dicTagNames["9cfcbf01-e8e8-4f69-961a-020aaa1a526f"] = "실외기#5 Hz";
            m_dicTagNames["abb4d88e-e51f-4b24-b077-2f316264e4c9"] = "실외기#5 PF";
            m_dicTagNames["2516fa96-e115-4956-a92f-b38575461780"] = "실외기#5 KWh";
            m_dicTagNames["95c878d8-3b9a-4e24-a88e-35b3feb4303a"] = "실외기#5 kVarh";
            m_dicTagNames["35a158ba-f55b-4d1f-98aa-ce53dfb03ce8"] = "유독물 3F Vrn";
            m_dicTagNames["15e40c24-94cc-4f32-9b7f-9a2de00b3219"] = "유독물 3F Vsn";
            m_dicTagNames["45690995-a7e5-44d1-afdf-f9e49246a076"] = "유독물 3F Vtn";
            m_dicTagNames["1f59f2f3-5ec3-46c8-9fc1-3654ae5e8692"] = "유독물 3F Vrs";
            m_dicTagNames["ec443677-0bc4-442c-bb25-101451401c47"] = "유독물 3F Vst";
            m_dicTagNames["1317be51-e1cf-443f-b011-30f4a0f190bd"] = "유독물 3F Vtr";
            m_dicTagNames["98ae5ce7-f4dc-4881-b8a8-2e4c23e279ea"] = "유독물 3F Ar";
            m_dicTagNames["84838113-0763-4046-96d2-1459c434e2ae"] = "유독물 3F As";
            m_dicTagNames["8d380eab-0494-4cec-97ac-c75b5e1a5041"] = "유독물 3F At";
            m_dicTagNames["216d3fcd-e471-4716-a0bc-c52e8a173716"] = "유독물 3F kW";
            m_dicTagNames["1e462e42-850c-4faf-a286-0dcfdac7117b"] = "유독물 3F kVar";
            m_dicTagNames["dc7be700-2870-4c19-90cb-8be0ad250c6a"] = "유독물 3F KVA";
            m_dicTagNames["a1f15ac8-f2f7-43d6-aaca-3c0b08a012fb"] = "유독물 3F Hz";
            m_dicTagNames["8e0626ac-7b7b-47c9-8cf3-391546efca0f"] = "유독물 3F PF";
            m_dicTagNames["873088ef-f0e5-48e3-a28b-df03cc9f44b5"] = "유독물 3F KWh";
            m_dicTagNames["2fd600e2-92a4-4cc1-b2c7-d64ee8c40d77"] = "유독물 3F kVarh";
            m_dicTagNames["d22818da-ef20-4783-a099-4ad1412a1d46"] = "덕트라인 휀 PANEL Vrn";
            m_dicTagNames["8e397734-7af7-4506-9064-b8ba704794be"] = "덕트라인 휀 PANEL Vsn";
            m_dicTagNames["65048d5c-22be-4c8a-b9bd-20dd12d27c5a"] = "덕트라인 휀 PANEL Vtn";
            m_dicTagNames["68d38759-d1c6-4f95-be7d-8248fc0d8b27"] = "덕트라인 휀 PANEL Vrs";
            m_dicTagNames["cb093a0a-f9b1-49cf-a123-41e7b358baa4"] = "덕트라인 휀 PANEL Vst";
            m_dicTagNames["4ca7467e-d739-49ef-b39e-dde345f98d4a"] = "덕트라인 휀 PANEL Vtr";
            m_dicTagNames["1e58e50d-8f8e-4d05-8d4a-6507abda6c7e"] = "덕트라인 휀 PANEL Ar";
            m_dicTagNames["93228d90-46c0-4e59-801b-028b4451bbcf"] = "덕트라인 휀 PANEL As";
            m_dicTagNames["e467b0b2-1b9a-4223-8722-d5358bb228c9"] = "덕트라인 휀 PANEL At";
            m_dicTagNames["3a478f55-bbb9-499a-b562-bc74c24b94ab"] = "덕트라인 휀 PANEL kW";
            m_dicTagNames["07e99f0a-74a9-42c9-bf39-27a0541b1f7b"] = "덕트라인 휀 PANEL kVar";
            m_dicTagNames["f8ae0da9-08c0-4b9f-8410-25551bfeee01"] = "덕트라인 휀 PANEL KVA";
            m_dicTagNames["abee2227-1dd9-4d35-9f31-a279a4cd2c1a"] = "덕트라인 휀 PANEL Hz";
            m_dicTagNames["cb8c0b25-2043-4905-85cd-70677367c217"] = "덕트라인 휀 PANEL PF";
            m_dicTagNames["818e5689-5d71-492b-b392-0c6a5c62d12f"] = "덕트라인 휀 PANEL KWh";
            m_dicTagNames["c7f0c45b-da92-4e0d-934c-0e051dc52532"] = "덕트라인 휀 PANEL kVarh";
            m_dicTagNames["521772fc-196a-4fd1-9651-91d38a32e247"] = "포장실 PANEL Vrn";
            m_dicTagNames["5ccea068-d1a7-4101-9e8b-b18611960e72"] = "포장실 PANEL Vsn";
            m_dicTagNames["9d796fa4-eb41-4e21-a660-304ac204be9a"] = "포장실 PANEL Vtn";
            m_dicTagNames["3edccf12-8696-4ab9-a117-06e2c8a640a2"] = "포장실 PANEL Vrs";
            m_dicTagNames["025c7000-70b0-4f05-acab-a9718d903dd0"] = "포장실 PANEL Vst";
            m_dicTagNames["910c6305-31f1-4fc2-986d-acb7380f2b75"] = "포장실 PANEL Vtr";
            m_dicTagNames["88697a85-5cd0-4190-ba93-4c2af405dd85"] = "포장실 PANEL Ar";
            m_dicTagNames["461d970a-f491-4295-a41c-f8d0fe1d1b42"] = "포장실 PANEL As";
            m_dicTagNames["2acdcd53-7174-432d-8379-e7d76d5c73c3"] = "포장실 PANEL At";
            m_dicTagNames["70897e64-28d8-462e-a3d9-8c57c38b13cf"] = "포장실 PANEL kW";
            m_dicTagNames["177c134f-864f-4571-bac3-7ac4a017b9eb"] = "포장실 PANEL kVar";
            m_dicTagNames["0df78968-992a-4f7e-9edd-fe319a6d62c3"] = "포장실 PANEL KVA";
            m_dicTagNames["40803f42-86b1-4865-a166-fb41f2a3c2ad"] = "포장실 PANEL Hz";
            m_dicTagNames["5c1897fa-e976-43f3-a045-26acc7603004"] = "포장실 PANEL PF";
            m_dicTagNames["fa4abfbe-9d6a-4138-a3b1-34ac3c44fd37"] = "포장실 PANEL KWh";
            m_dicTagNames["65ef94a8-d7e8-4e71-82df-4ece772e9674"] = "포장실 PANEL kVarh";
            m_dicTagNames["b209d93e-aed1-4529-98ca-793422b422fc"] = "지게차 충전기 Vrn";
            m_dicTagNames["46e6cd7e-2b92-4ca2-829e-d517e4da8468"] = "지게차 충전기 Vsn";
            m_dicTagNames["10b80887-977c-4926-b064-12457d6a3704"] = "지게차 충전기 Vtn";
            m_dicTagNames["3b9d762b-aa64-4536-a98c-90394eb747f8"] = "지게차 충전기 Vrs";
            m_dicTagNames["64c5a0eb-9d08-4c01-ad0d-25c44e50a4e8"] = "지게차 충전기 Vst";
            m_dicTagNames["ce5ccadb-8476-4c7b-a04c-3526bee40d66"] = "지게차 충전기 Vtr";
            m_dicTagNames["db9aa2dd-8491-4d27-a10b-d348c10aac1b"] = "지게차 충전기 Ar";
            m_dicTagNames["2c2be818-687e-4ffb-89de-aad554809994"] = "지게차 충전기 As";
            m_dicTagNames["e9385e9b-be2f-4da9-b443-095cef9f851a"] = "지게차 충전기 At";
            m_dicTagNames["57accd71-0b58-4f6c-88fd-1babc1854461"] = "지게차 충전기 kW";
            m_dicTagNames["a41008ee-4e9d-4d30-acf8-c6a8f1d90e2c"] = "지게차 충전기 kVar";
            m_dicTagNames["f207dbc5-3170-4a96-9f7b-bc40d321c372"] = "지게차 충전기 KVA";
            m_dicTagNames["cbe3c6be-ab0d-49ad-bbc2-b18bafc0e799"] = "지게차 충전기 Hz";
            m_dicTagNames["73bbd7f7-36fd-414c-a899-d57c79c10159"] = "지게차 충전기 PF";
            m_dicTagNames["449968ec-30ce-4d4a-9b21-b2015d1d9798"] = "지게차 충전기 KWh";
            m_dicTagNames["01e37eb0-437b-422a-b52b-b2ea718e13f6"] = "지게차 충전기 kVarh";
            m_dicTagNames["5aa93715-3aa9-4c86-a9cd-d7ff28951d1b"] = "드럼 PANEL Vrn";
            m_dicTagNames["2b86cbbe-76b5-4600-b7bc-93a560040b60"] = "드럼 PANEL Vsn";
            m_dicTagNames["3ba12af0-afb9-4d83-87f5-0373bb6e58f5"] = "드럼 PANEL Vtn";
            m_dicTagNames["bd2bf979-5270-41bf-bbda-53de9f588607"] = "드럼 PANEL Vrs";
            m_dicTagNames["fb44a0c6-c17c-4ef1-8f58-4b70e628ccdb"] = "드럼 PANEL Vst";
            m_dicTagNames["1f984f9c-ba77-4837-810b-9bcfe06c0e87"] = "드럼 PANEL Vtr";
            m_dicTagNames["5d581704-ad15-4218-a7c9-71ef9026a1cd"] = "드럼 PANEL Ar";
            m_dicTagNames["dba2e9a1-1b6e-40a0-8a31-8849f4f54e57"] = "드럼 PANEL As";
            m_dicTagNames["6e72909a-b31b-46ad-a349-4b2295f3fd94"] = "드럼 PANEL At";
            m_dicTagNames["0a2a09ba-838d-448c-ac74-1da5822cc767"] = "드럼 PANEL kW";
            m_dicTagNames["e862cf23-0259-46a8-9ebf-7de34c5e1963"] = "드럼 PANEL kVar";
            m_dicTagNames["0606bc8c-760d-4a31-a104-528626f06fab"] = "드럼 PANEL KVA";
            m_dicTagNames["7f121b7f-aae8-4e41-bc98-369977b6a3c2"] = "드럼 PANEL Hz";
            m_dicTagNames["8745080f-7bf7-45e5-9fb9-9896601bc144"] = "드럼 PANEL PF";
            m_dicTagNames["8f0bc189-f950-4fc5-93d9-c2a27372978a"] = "드럼 PANEL KWh";
            m_dicTagNames["b3444c32-31d9-4e68-b0b5-ada6b2da53ed"] = "드럼 PANEL kVarh";
            m_dicTagNames["9d1b33c0-33d4-4bbd-b650-6fc1cc7712ed"] = "충전실 PANEL Vrn";
            m_dicTagNames["0bfc9955-1c30-4caa-83cd-48f3af823995"] = "충전실 PANEL Vsn";
            m_dicTagNames["28be7c21-0573-4917-89d2-3272d0ac0b30"] = "충전실 PANEL Vtn";
            m_dicTagNames["56d55b43-979f-4469-a092-5cac4c4b473a"] = "충전실 PANEL Vrs";
            m_dicTagNames["391541c0-380f-4ca6-ab68-05439a96afe3"] = "충전실 PANEL Vst";
            m_dicTagNames["cadf9f4e-5a87-4a11-8d2c-e257c60c5365"] = "충전실 PANEL Vtr";
            m_dicTagNames["3995225c-5e92-45dc-a8df-346d6c0e5651"] = "충전실 PANEL Ar";
            m_dicTagNames["f664eced-0c6a-4e0e-8ef7-bf99e081013b"] = "충전실 PANEL As";
            m_dicTagNames["227d34b2-9f45-4ee3-a156-a82c570fba35"] = "충전실 PANEL At";
            m_dicTagNames["c428e21a-543c-4c9c-a6ea-ec5dc0a81712"] = "충전실 PANEL Kw";
            m_dicTagNames["318da624-709f-4f71-97a3-dfe43096c4e9"] = "충전실 PANEL kVar";
            m_dicTagNames["6affb8b0-f48f-4a8c-abac-ea9b11392e16"] = "충전실 PANEL KVA";
            m_dicTagNames["cc778c2c-2315-4537-b70d-c38b9ac10981"] = "충전실 PANEL Hz";
            m_dicTagNames["04848ea3-6a33-4b40-ac98-4648efd0255a"] = "충전실 PANEL PF";
            m_dicTagNames["352a98ff-3a61-4d33-8a5b-78442935912e"] = "충전실 PANEL KWh";
            m_dicTagNames["41b55966-a8b9-4ce8-88da-dacab9517c9f"] = "충전실 PANEL kVarh";
            m_dicTagNames["140ed8f5-93c4-49cd-96b8-f1f806b85ad3"] = "칠러 브라인펌프 811A(비상용) Vrn";
            m_dicTagNames["dee3ff07-0156-42a0-a8c4-a1d19cca3d46"] = "칠러 브라인펌프 811A(비상용) Vsn";
            m_dicTagNames["4257f29d-4437-4e41-9b8f-f49acae81a36"] = "칠러 브라인펌프 811A(비상용) Vtn";
            m_dicTagNames["f5db359a-6e6a-458b-9083-d4a919aa80be"] = "칠러 브라인펌프 811A(비상용) Vrs";
            m_dicTagNames["a0634b34-0fb1-4275-9f8c-24125c053665"] = "칠러 브라인펌프 811A(비상용) Vst";
            m_dicTagNames["b647d63f-b8e6-41f3-8f05-42e9c1511026"] = "칠러 브라인펌프 811A(비상용) Vtr";
            m_dicTagNames["03784540-9ac9-4021-a03b-daf66c7ff0da"] = "칠러 브라인펌프 811A(비상용) Ar";
            m_dicTagNames["e1e89886-2e3e-40b0-8745-23dddfbe47ac"] = "칠러 브라인펌프 811A(비상용) As";
            m_dicTagNames["56350df5-c028-4b47-b3f8-c47feed052b9"] = "칠러 브라인펌프 811A(비상용) At";
            m_dicTagNames["67172f7e-328f-4e32-9f34-53a62228a0a3"] = "칠러 브라인펌프 811A(비상용) kW";
            m_dicTagNames["44eecd75-21b1-4263-9c1b-7350501921a2"] = "칠러 브라인펌프 811A(비상용) kVar";
            m_dicTagNames["bec53edb-6a84-427d-add5-9f065cb93043"] = "칠러 브라인펌프 811A(비상용) KVA";
            m_dicTagNames["5eb65f2c-1594-4fd6-b8f2-b0ec92af9f33"] = "칠러 브라인펌프 811A(비상용) Hz";
            m_dicTagNames["516f7fa7-e4de-4872-aeed-05659b909521"] = "칠러 브라인펌프 811A(비상용) PF";
            m_dicTagNames["663dfc89-16a3-474f-b4e3-563f0f16f606"] = "칠러 브라인펌프 811A(비상용) KWh";
            m_dicTagNames["d364670a-f6f5-4211-ab2a-e5b6fb355f42"] = "칠러 브라인펌프 811A(비상용) kVarh";
            m_dicTagNames["ce76dcac-fa9e-48f9-b133-7e86969bbab0"] = "칠러 브라인펌프 811B(비상용) Vrn";
            m_dicTagNames["344bfa91-0f3f-424c-97b7-ed6fe383212a"] = "칠러 브라인펌프 811B(비상용) Vsn";
            m_dicTagNames["e14c06af-3efd-49ba-b9da-c2dabad8fab3"] = "칠러 브라인펌프 811B(비상용) Vtn";
            m_dicTagNames["32354bb4-17ec-4851-acd3-cf8deadf4956"] = "칠러 브라인펌프 811B(비상용) Vrs";
            m_dicTagNames["e526b42f-0544-487c-81ee-039772a4c376"] = "칠러 브라인펌프 811B(비상용) Vst";
            m_dicTagNames["28004a56-7d79-4b10-8a55-51f5f9c7348f"] = "칠러 브라인펌프 811B(비상용) Vtr";
            m_dicTagNames["a8c8fcce-8018-4b2c-bb86-2a76c4db0a92"] = "칠러 브라인펌프 811B(비상용) Ar";
            m_dicTagNames["d39eb849-a3b1-45bc-8a96-3cfe7f841306"] = "칠러 브라인펌프 811B(비상용) As";
            m_dicTagNames["37f44a7d-cac9-4a73-be6c-520de952d908"] = "칠러 브라인펌프 811B(비상용) At";
            m_dicTagNames["04d2d7cb-b28f-4c93-8c0e-47288b9da799"] = "칠러 브라인펌프 811B(비상용) kW";
            m_dicTagNames["b8d2a7c2-d164-4b27-965b-3562505dc2a3"] = "칠러 브라인펌프 811B(비상용) kVar";
            m_dicTagNames["389802ed-83aa-479b-b42b-2ab62797d068"] = "칠러 브라인펌프 811B(비상용) KVA";
            m_dicTagNames["d7fc5bd4-0fc6-4fa0-bbc6-626e2bea0f2e"] = "칠러 브라인펌프 811B(비상용) Hz";
            m_dicTagNames["541932ca-33b4-41ea-a6c8-4fd56ce60f57"] = "칠러 브라인펌프 811B(비상용) PF";
            m_dicTagNames["3a81f0f6-31ea-4602-af8f-ece13da13198"] = "칠러 브라인펌프 811B(비상용) KWh";
            m_dicTagNames["14fc4de5-f76a-4d36-bce2-0861ae7a6530"] = "칠러 브라인펌프 811B(비상용) kVarh";
            m_dicTagNames["4c6781b9-0b55-4c1b-8800-2315fe655485"] = "칠러 브라인펌프 810A(상용) Vrn";
            m_dicTagNames["3243cc41-60b5-4404-ad3f-6cb980770900"] = "칠러 브라인펌프 810A(상용) Vsn";
            m_dicTagNames["09273165-eb43-4ba4-8224-d65c9ce683a7"] = "칠러 브라인펌프 810A(상용) Vtn";
            m_dicTagNames["2bc536f2-1ab0-4ed6-b666-868a1a861546"] = "칠러 브라인펌프 810A(상용) Vrs";
            m_dicTagNames["fe9296ee-0988-4aa5-ba67-8b7f9ac76dae"] = "칠러 브라인펌프 810A(상용) Vst";
            m_dicTagNames["d8e6f6cb-0593-422f-93a6-571b8428bc77"] = "칠러 브라인펌프 810A(상용) Vtr";
            m_dicTagNames["f233eb4f-96a0-416e-9629-efe03537b522"] = "칠러 브라인펌프 810A(상용) Ar";
            m_dicTagNames["59929a69-9ef6-426a-8405-3533399693fb"] = "칠러 브라인펌프 810A(상용) As";
            m_dicTagNames["0b6f4a7d-9dd8-49c4-ba78-f835ff8f166a"] = "칠러 브라인펌프 810A(상용) At";
            m_dicTagNames["59074b97-cce2-4798-8b08-18013f9b6a77"] = "칠러 브라인펌프 810A(상용) kW";
            m_dicTagNames["9b494264-fd81-4a8a-9e73-c7b555d893d6"] = "칠러 브라인펌프 810A(상용) kVar";
            m_dicTagNames["717da9ac-e523-432e-94d2-cb3c1642346c"] = "칠러 브라인펌프 810A(상용) KVA";
            m_dicTagNames["693b16b7-cbec-4412-a82c-9de0e21d8cc9"] = "칠러 브라인펌프 810A(상용) Hz";
            m_dicTagNames["fc581fa2-c7af-4459-bfb8-5c14772230a0"] = "칠러 브라인펌프 810A(상용) PF";
            m_dicTagNames["4fd63aa2-5ac7-46d9-84e3-f186daf480ba"] = "칠러 브라인펌프 810A(상용) KWh";
            m_dicTagNames["84a1fdcd-2bd7-4ef1-9430-24386310f521"] = "칠러 브라인펌프 810A(상용) kVarh";
            m_dicTagNames["841b7ce4-e882-4361-9ec5-3858b3efdfa7"] = "칠러 브라인펌프 810B(상용) Vrn";
            m_dicTagNames["e5991bc3-a0db-4aae-9580-1143461a517c"] = "칠러 브라인펌프 810B(상용) Vsn";
            m_dicTagNames["f15f7e4f-6389-4627-9acc-9d2d3f17f5b8"] = "칠러 브라인펌프 810B(상용) Vtn";
            m_dicTagNames["e03d509c-c9d4-4b7e-9431-4eeaa66024ed"] = "칠러 브라인펌프 810B(상용) Vrs";
            m_dicTagNames["103bcde8-f563-4060-814a-a3878ee8e640"] = "칠러 브라인펌프 810B(상용) Vst";
            m_dicTagNames["5726d60a-a430-4373-9335-6533354ca4d4"] = "칠러 브라인펌프 810B(상용) Vtr";
            m_dicTagNames["3e9cb8f5-eb8c-4c3d-9df9-f9b73543cc75"] = "칠러 브라인펌프 810B(상용) Ar";
            m_dicTagNames["2be8f566-575a-4227-affd-1ac944e3ab77"] = "칠러 브라인펌프 810B(상용) As";
            m_dicTagNames["4254fe3f-1383-4040-9c6b-9ee3d5b4440d"] = "칠러 브라인펌프 810B(상용) At";
            m_dicTagNames["3dcb65a7-1f76-4d52-93a0-df7b0fb4090d"] = "칠러 브라인펌프 810B(상용) kW";
            m_dicTagNames["087b7c1b-f69d-49fe-98b6-aa1ac7d4f412"] = "칠러 브라인펌프 810B(상용) kVar";
            m_dicTagNames["1a526c72-43cc-4421-a6f8-eac74d319581"] = "칠러 브라인펌프 810B(상용) KVA";
            m_dicTagNames["bb96fa4c-1d3e-4203-8c8a-c236eb19b457"] = "칠러 브라인펌프 810B(상용) Hz";
            m_dicTagNames["4171d44d-2b88-47c4-8c07-6d0835d5c05e"] = "칠러 브라인펌프 810B(상용) PF";
            m_dicTagNames["3e6604f6-eabd-4d84-8d1a-1fb780a1246b"] = "칠러 브라인펌프 810B(상용) KWh";
            m_dicTagNames["b65c7191-05a3-4def-9803-a94801fb292a"] = "칠러 브라인펌프 810B(상용) kVarh";
            m_dicTagNames["48f7f3f1-e096-44fe-a3a3-267e05f9dcb1"] = "칠러 브라인펌프 810C(상용) Vrn";
            m_dicTagNames["6d10a4ef-e698-46c6-b14d-6ae030f15609"] = "칠러 브라인펌프 810C(상용) Vsn";
            m_dicTagNames["ad82ae1f-971c-4f39-bc7f-c08a43fd38d0"] = "칠러 브라인펌프 810C(상용) Vtn";
            m_dicTagNames["896d89c2-e0be-45e1-a42d-94e5b9dcf3b1"] = "칠러 브라인펌프 810C(상용) Vrs";
            m_dicTagNames["1cbbd40a-2634-45c3-900e-f3adc6e62c52"] = "칠러 브라인펌프 810C(상용) Vst";
            m_dicTagNames["ffcc288d-9354-4558-9b3a-b1d4b7b0873e"] = "칠러 브라인펌프 810C(상용) Vtr";
            m_dicTagNames["147fca8d-93e1-40de-91f3-6eb4f1f0b9d1"] = "칠러 브라인펌프 810C(상용) Ar";
            m_dicTagNames["c47f9b70-a6df-4ecf-b6cf-a41962ac6ef9"] = "칠러 브라인펌프 810C(상용) As";
            m_dicTagNames["411b79c8-3fb4-4763-b729-c6d8ee0d213b"] = "칠러 브라인펌프 810C(상용) At";
            m_dicTagNames["50534144-453f-4e0b-bb2a-6cc26b793c30"] = "칠러 브라인펌프 810C(상용) kW";
            m_dicTagNames["546bfac4-d766-4e81-a437-62d141b266cb"] = "칠러 브라인펌프 810C(상용) kVar";
            m_dicTagNames["ee60c531-b549-43ca-a5ef-7902a3352e8d"] = "칠러 브라인펌프 810C(상용) KVA";
            m_dicTagNames["d53b1fc0-75dd-41c5-9610-7fe62aff5f13"] = "칠러 브라인펌프 810C(상용) Hz";
            m_dicTagNames["84146685-5834-4b94-adaf-f116b0c965f4"] = "칠러 브라인펌프 810C(상용) PF";
            m_dicTagNames["a3318b41-a83d-4987-878e-60a3baaa2765"] = "칠러 브라인펌프 810C(상용) KWh";
            m_dicTagNames["2543b821-f0dc-4979-b56e-16cea62045ba"] = "칠러 브라인펌프 810C(상용) kVarh";
            m_dicTagNames["6ea021f4-64b3-4097-a8f2-3831c568b7c6"] = "칠러 브라인펌프 816A(상용) Vrn";
            m_dicTagNames["38be8a2a-d740-447d-957f-ec483c3d505c"] = "칠러 브라인펌프 816A(상용) Vsn";
            m_dicTagNames["210d27fb-7da2-4807-bffc-5293c625f56a"] = "칠러 브라인펌프 816A(상용) Vtn";
            m_dicTagNames["195acb67-2642-4bea-9bb7-f9f7fa42778b"] = "칠러 브라인펌프 816A(상용) Vrs";
            m_dicTagNames["9e032f0a-bc37-4da9-a363-529cf8260b38"] = "칠러 브라인펌프 816A(상용) Vst";
            m_dicTagNames["92dfde8d-c2df-4acd-ab33-1199351ddaac"] = "칠러 브라인펌프 816A(상용) Vtr";
            m_dicTagNames["97b85873-99cf-46d1-ab8a-240afcfeabe0"] = "칠러 브라인펌프 816A(상용) Ar";
            m_dicTagNames["b0182afc-0bb8-4061-91fe-8fbea47c8236"] = "칠러 브라인펌프 816A(상용) As";
            m_dicTagNames["c482a7e2-f091-4a24-839f-839646f98764"] = "칠러 브라인펌프 816A(상용) At";
            m_dicTagNames["f61d1dcd-f7ff-41d9-a5c1-be36648f48eb"] = "칠러 브라인펌프 816A(상용) kW";
            m_dicTagNames["23e760e7-1f9a-4c02-82d1-471872b1f47d"] = "칠러 브라인펌프 816A(상용) kVar";
            m_dicTagNames["7e22181c-be26-467e-a23c-f395297d21da"] = "칠러 브라인펌프 816A(상용) KVA";
            m_dicTagNames["7bc4195e-30ca-4f9c-81ce-cb8ba960b17f"] = "칠러 브라인펌프 816A(상용) Hz";
            m_dicTagNames["d46e569f-16b3-4092-9a0d-4eea51aba956"] = "칠러 브라인펌프 816A(상용) PF";
            m_dicTagNames["4daa10b4-d25c-473e-ac77-773fb7b3c4f7"] = "칠러 브라인펌프 816A(상용) KWh";
            m_dicTagNames["1ce0a356-cd5c-42fd-895a-73e67b216d42"] = "칠러 브라인펌프 816A(상용) kVarh";
            m_dicTagNames["0f009993-8988-45d4-80b6-539e712efe03"] = "칠러 브라인펌프 816B(상용) Vrn";
            m_dicTagNames["fe9121fc-bbdc-48c4-a515-4f9858cd7194"] = "칠러 브라인펌프 816B(상용) Vsn";
            m_dicTagNames["dbb4b7fd-81e0-4ad9-88f6-ef4d74c09b57"] = "칠러 브라인펌프 816B(상용) Vtn";
            m_dicTagNames["e6ffee91-7243-4c43-8813-c045724c7c6e"] = "칠러 브라인펌프 816B(상용) Vrs";
            m_dicTagNames["3d99c79d-4273-4586-b7e0-6fbb90a03b3e"] = "칠러 브라인펌프 816B(상용) Vst";
            m_dicTagNames["e2bdde5f-cb22-43f1-bc50-a1c9a7abc6ee"] = "칠러 브라인펌프 816B(상용) Vtr";
            m_dicTagNames["9145dd3c-d701-4a6a-a402-f2f35434d7cc"] = "칠러 브라인펌프 816B(상용) Ar";
            m_dicTagNames["d50573be-5870-41c4-97fa-af08c44d3fce"] = "칠러 브라인펌프 816B(상용) As";
            m_dicTagNames["415489d0-9722-46fa-b028-2b1e10fbe363"] = "칠러 브라인펌프 816B(상용) At";
            m_dicTagNames["36dbd3f4-215e-429b-9c8e-146d10008b78"] = "칠러 브라인펌프 816B(상용) kW";
            m_dicTagNames["52c2cfb4-6434-4a84-b665-e269d7a2b35c"] = "칠러 브라인펌프 816B(상용) kVar";
            m_dicTagNames["9a7aa578-230c-48e8-ab6b-d7b5ee59e3fc"] = "칠러 브라인펌프 816B(상용) KVA";
            m_dicTagNames["8068cb7c-51bb-4478-b5fa-cb5385d46ef2"] = "칠러 브라인펌프 816B(상용) Hz";
            m_dicTagNames["8c82c27e-4de4-4cd1-a014-f17003579315"] = "칠러 브라인펌프 816B(상용) PF";
            m_dicTagNames["eb2335b4-2b17-4c60-b8ef-1bc399f6b2d8"] = "칠러 브라인펌프 816B(상용) KWh";
            m_dicTagNames["b2313410-f36c-42a8-92be-b62bc5a442c2"] = "칠러 브라인펌프 816B(상용) kVarh";
            m_dicTagNames["bb191b82-f998-4a72-922a-5345b603352f"] = "칠러 브라인펌프 815A(상용) Vrn";
            m_dicTagNames["a2a6ad16-d0d7-4de2-b0dc-b0fc60418b94"] = "칠러 브라인펌프 815A(상용) Vsn";
            m_dicTagNames["9eb6f718-2a5c-4801-954f-02bbb96f1d3f"] = "칠러 브라인펌프 815A(상용) Vtn";
            m_dicTagNames["6f0400c7-6d74-4fb2-bba3-88591555ff22"] = "칠러 브라인펌프 815A(상용) Vrs";
            m_dicTagNames["cb8c79f5-e2cd-4d05-bc88-98522aa7ca36"] = "칠러 브라인펌프 815A(상용) Vst";
            m_dicTagNames["f2544c60-8d9c-40f8-99ef-63d227d728e5"] = "칠러 브라인펌프 815A(상용) Vtr";
            m_dicTagNames["dbe86284-92bb-4eb0-b8d2-d48d41e85aeb"] = "칠러 브라인펌프 815A(상용) Ar";
            m_dicTagNames["33e3be8f-2f98-4ab2-a95c-9aeb155f18fc"] = "칠러 브라인펌프 815A(상용) As";
            m_dicTagNames["6bb5283a-db5a-413f-9794-b0b5f9808f74"] = "칠러 브라인펌프 815A(상용) At";
            m_dicTagNames["799080e2-064f-4db8-ae3a-4e6444b46b6b"] = "칠러 브라인펌프 815A(상용) kW";
            m_dicTagNames["8689de2f-58c3-4bd2-83b9-50be44f4e092"] = "칠러 브라인펌프 815A(상용) kVar";
            m_dicTagNames["c27b2b5a-5f87-40ad-901c-d1cd042ea81b"] = "칠러 브라인펌프 815A(상용) KVA";
            m_dicTagNames["bdc2f4db-3995-4cb9-b8f3-b6d54159fa2f"] = "칠러 브라인펌프 815A(상용) Hz";
            m_dicTagNames["7e2602ff-8c69-40a4-bc3a-716f1eee457b"] = "칠러 브라인펌프 815A(상용) PF";
            m_dicTagNames["ca26b5c1-6cd6-4fc3-a9b4-516bf2515243"] = "칠러 브라인펌프 815A(상용) KWh";
            m_dicTagNames["846f295e-e5f5-418d-aa0f-a1065ea6356c"] = "칠러 브라인펌프 815A(상용) kVarh";
            m_dicTagNames["8ba97019-cf7f-4b7c-b4b4-f1ea21e991ef"] = "칠러 브라인펌프 815B(상용) Vrn";
            m_dicTagNames["ba71e8d4-d871-41e3-b609-2bc9fd0796bc"] = "칠러 브라인펌프 815B(상용) Vsn";
            m_dicTagNames["1dca090e-af73-4fd6-9148-3e9595d3de6a"] = "칠러 브라인펌프 815B(상용) Vtn";
            m_dicTagNames["55a0f810-d457-48a6-b85b-b36fcb793f85"] = "칠러 브라인펌프 815B(상용) Vrs";
            m_dicTagNames["ce4c751b-e806-42ed-8108-5051566d0bc0"] = "칠러 브라인펌프 815B(상용) Vst";
            m_dicTagNames["18701623-b8f9-4b91-878c-de828706de2b"] = "칠러 브라인펌프 815B(상용) Vtr";
            m_dicTagNames["7cf8e491-5cc6-4141-8c5e-db89ef7bd259"] = "칠러 브라인펌프 815B(상용) Ar";
            m_dicTagNames["50590858-f72b-4899-ab99-b8190ae79ecb"] = "칠러 브라인펌프 815B(상용) As";
            m_dicTagNames["98f58569-fbd8-41de-96c8-58f738459926"] = "칠러 브라인펌프 815B(상용) At";
            m_dicTagNames["77da0a4f-81b7-45e0-8598-6dc6af977392"] = "칠러 브라인펌프 815B(상용) kW";
            m_dicTagNames["173d680b-1513-480f-8935-915e92149ce7"] = "칠러 브라인펌프 815B(상용) kVar";
            m_dicTagNames["f45c13d1-8cc0-49c1-bba5-4de39b3b6e18"] = "칠러 브라인펌프 815B(상용) KVA";
            m_dicTagNames["93a8589d-9bce-4ec4-b879-527aabf89243"] = "칠러 브라인펌프 815B(상용) Hz";
            m_dicTagNames["9040aef7-207b-4c1a-868b-ba1df45b006b"] = "칠러 브라인펌프 815B(상용) PF";
            m_dicTagNames["f09f7036-2cfa-40b5-a842-813a88b19dde"] = "칠러 브라인펌프 815B(상용) KWh";
            m_dicTagNames["bf2a0b9e-26f7-4284-a12d-0e03ac9915a5"] = "칠러 브라인펌프 815B(상용) kVarh";
            m_dicTagNames["adc1b6cc-61ec-493c-a8ee-56d200a1301b"] = "LEVEL";
            m_dicTagNames["c1f35601-a48a-486c-b54d-ed0145c8b8e0"] = "INLET FLOW";
            m_dicTagNames["5be27e35-d014-4cb6-8809-ba87d158e7ef"] = "COOLER OUTLET TEMPRATURE";
            m_dicTagNames["b226f81f-a548-49aa-bbab-5a30eafe5de4"] = "LINLET RESITIVITY";
            m_dicTagNames["737b707e-7ff1-4109-b6a5-d77a306af5cc"] = "OUTLET RESITIVITY";
            m_dicTagNames["151f7e01-866f-4699-b82c-03150cf6ae38"] = "POU SUPPLY RESITIVITY";
            m_dicTagNames["3d88e7e1-4bdc-4aae-b4de-0a595460c506"] = "POU RETURN RESITIVITY";
            m_dicTagNames["2569ee07-4fba-4861-8b4b-3616b6dbfe9e"] = "POU RETURN PRESSURE";
            m_dicTagNames["994bc475-d788-49bc-a491-a1a99bee5c53"] = "POU SUPPLY FLOW";
            m_dicTagNames["aa2fa018-bd2b-4190-98c1-c0697b15c7ee"] = "POU SUPPLY TOC";
            m_dicTagNames["e5e706f5-12d9-4cf0-b74f-0a7d5db2ca13"] = "POU SUPPLY BORON";
            m_dicTagNames["fe7d6f10-ab69-4629-9249-f4fb09805f1e"] = "POU SUPPLY SILICA";

            m_dicTagNames["3528c89f-eaf7-4f79-b458-e8014ef7189e"] = "ATS-01-1 전력사용량15분(kWh)";
            m_dicTagNames["9a737d05-1a2f-4138-8a85-848bc38a7752"] = "ATS-01-2 전력사용량15분(kWh)";
            m_dicTagNames["085bdc92-b17d-4334-bc16-9e6d72fbf020"] = "ATS-01-3 전력사용량15분(kWh)";
            m_dicTagNames["b83345fa-a3ed-4271-a575-a454b0725ad1"] = "ATS-01-6 전력사용량15분(kWh)";
            m_dicTagNames["930207ee-8cf5-4025-8082-3e4e28ebe388"] = "ATS-01-8 전력사용량15분(kWh)";
            m_dicTagNames["36672826-565d-4bb3-9c39-c4d7692151c5"] = "L-01-2 전력사용량15분(kWh)";
            m_dicTagNames["28079e90-57de-4ddf-8825-6e762ac4cc79"] = "L-01-3 전력사용량15분(kWh)";
            m_dicTagNames["70699a7c-8efe-48f9-aa75-88bc606f5dfb"] = "L-01-4 전력사용량15분(kWh)";
            m_dicTagNames["f53c6e1f-9c0d-4f68-835a-e34e04f6fec4"] = "L-01-5 전력사용량15분(kWh)";
            m_dicTagNames["80f86012-0590-4641-8cdf-aec726c35738"] = "L-01-6 전력사용량15분(kWh)";
            m_dicTagNames["5ed78283-7c54-4a67-a3d6-090c14e2c76a"] = "L-01-8 전력사용량15분(kWh)";
            m_dicTagNames["f931cb84-ec7f-4b04-a7e6-caaa8be54646"] = "L-01-9 전력사용량15분(kWh)";
            m_dicTagNames["b4a13c67-6d69-40b2-9e89-a3ce835d51b7"] = "L-01-10 전력사용량15분(kWh)";
            m_dicTagNames["63a6d79b-e70a-47d6-a727-51b824646c72"] = "L-01-11 전력사용량15분(kWh)";
            m_dicTagNames["2081e181-7040-4407-8a95-de4e04b6a81a"] = "L-01-12 전력사용량15분(kWh)";
            m_dicTagNames["fcfb8d7c-51fe-4437-b8c5-0179db2b526b"] = "L-02-1 전력사용량15분(kWh)";
            m_dicTagNames["0f09c3c4-e862-4c80-9f9a-78ca44e56641"] = "L-02-2 전력사용량15분(kWh)";
            m_dicTagNames["48cbbe70-b1fd-42e3-a91e-e6b8becb62f9"] = "L-02-3 전력사용량15분(kWh)";
            m_dicTagNames["a4dbcc0d-5156-4471-956d-18f10ec62be4"] = "L-02-5 전력사용량15분(kWh)";
            m_dicTagNames["02a80307-bd15-4211-ab5c-3c35e7d39f47"] = "L-02-6 전력사용량15분(kWh)";
            m_dicTagNames["03f9d0a3-1c00-4c25-8a12-796498adb999"] = "L-02-7 전력사용량15분(kWh)";
            m_dicTagNames["0d890048-fa96-4b69-a5f5-0ee6d1457cc9"] = "L-02-8 전력사용량15분(kWh)";
            m_dicTagNames["42194624-d45c-404a-9bfd-86badd5f6cf4"] = "L-02-9 전력사용량15분(kWh)";
            m_dicTagNames["ac5c171e-f767-4260-bbae-182bf922fe29"] = "L-02-10 전력사용량15분(kWh)";
            m_dicTagNames["e36eff15-66c2-4bca-ba39-55f3588e7891"] = "L-02-11 전력사용량15분(kWh)";
            m_dicTagNames["834aec73-9a1e-4bf0-876b-608942765691"] = "L-02-12 전력사용량15분(kWh)";
            m_dicTagNames["ebc53e48-8544-4e54-b00e-aae7277630b3"] = "L-02-13 전력사용량15분(kWh)";
            m_dicTagNames["08f6fc7c-62cf-46e0-bbe8-7bd78ec5290a"] = "L-02-14 전력사용량15분(kWh)";
            m_dicTagNames["aee10f83-96bc-430a-a6bc-c43a30023262"] = "L-02-15 전력사용량15분(kWh)";
            m_dicTagNames["d1341414-1e95-4015-ba3f-51c09bdd6c30"] = "L-02-16 전력사용량15분(kWh)";
            m_dicTagNames["6e2bde59-8de7-4d2d-8490-85663145945e"] = "L-03-1 전력사용량15분(kWh)";
            m_dicTagNames["84a07021-e2a6-49dc-9dfd-b5805baf462b"] = "L-03-2 전력사용량15분(kWh)";
            m_dicTagNames["3a3a5a2c-3a74-4b9c-b8a8-4a3a8f1d3a2e"] = "L-03-3 전력사용량15분(kWh)";
            m_dicTagNames["7b2d9b9c-bc3c-41a9-b3bd-6b4f47a7e2c1"] = "L-03-4 전력사용량15분(kWh)";
            m_dicTagNames["1c46e3a1-2b49-4a32-8b1b-3d2a9c4f6e7d"] = "L-03-5 전력사용량15분(kWh)";
            m_dicTagNames["9f3c2d1a-4b5e-4c6d-9e8f-1a2b3c4d5e6f"] = "L-03-6 전력사용량15분(kWh)";
            m_dicTagNames["5a6b7c8d-9e0f-4a1b-8c2d-3e4f5a6b7c8d"] = "L-03-7 전력사용량15분(kWh)";
            m_dicTagNames["2b3c4d5e-6f70-4a8b-9c0d-1e2f3a4b5c6d"] = "L-03-8 전력사용량15분(kWh)";
            m_dicTagNames["7e8f9a0b-1c2d-4e5f-8a9b-0c1d2e3f4a5b"] = "L-03-9 전력사용량15분(kWh)";
            m_dicTagNames["4c5d6e7f-8a9b-4c1d-8e2f-3a4b5c6d7e8f"] = "L-03-10 전력사용량15분(kWh)";
            m_dicTagNames["1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d"] = "L-03-11 전력사용량15분(kWh)";
        }
    }
}
