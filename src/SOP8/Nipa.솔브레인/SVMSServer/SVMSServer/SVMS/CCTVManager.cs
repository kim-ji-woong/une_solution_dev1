using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Newtonsoft.Json.Linq;

namespace SVMSServer.SVMS
{
    using Models;
    using DAL;
    using Datas;

    class CCTVManager
    {
        public const int Sensor_Type_Option_Code = 300300;
        public const int Sensor_Status_Option_Code = 300100;

        public const int CCTV_Type_Code = 300303;

        private SvmsManager m_parentManager = null;
        private int m_nSiteNo = -1;
        
        private DataManager m_dataManager = null;

        // 초순수, 설비 DB 
        private DataManager m_dataManager_Power = null;
        private DataManager m_dataManager_Facility = null;

        // Key : 고유키
        private Dictionary<string, CCTVData> m_dicCCTVs = new Dictionary<string, CCTVData>();
        // Key : CCTV ID
        private Dictionary<int, CCTVData> m_dicCCTVIDs = new Dictionary<int, CCTVData>();
        // Key : EquipZone ID
        private Dictionary<int, List<CCTVData>> m_dicEquipZoneCCTVs = new Dictionary<int, List<CCTVData>>();
        // Value : 하나의 CCTV가 연결되어 있는 EquipZone ID들
        private Dictionary<CCTVData, List<int>> m_dicCCTVEquipZoneIDs = new Dictionary<CCTVData, List<int>>();
        //private string m_strAlarmURL = "";

        private const string Safety_I_Type = "Safety-I";
        private const string RTSP_Type = "RTSP";

        private string m_strRTSPtoWebRTC_URL = null;
        private string m_strGo2rtc_URL = null;

        public CCTVManager(SvmsManager svmsManager, DataManager dataManager, DataManager dataManager_Power, DataManager dataManager_Facility, int nSiteNo)
        {
            m_parentManager = svmsManager;
            m_dataManager = dataManager;
            m_nSiteNo = nSiteNo;

            // 초순수, 전력 DB
            m_dataManager_Power = dataManager_Power;
            m_dataManager_Facility = dataManager_Facility;

            m_strRTSPtoWebRTC_URL = m_parentManager.SvmsConfig.WebRTC_URL;
            m_strGo2rtc_URL = m_parentManager.SvmsConfig.go2rtc_URL;

            ReadCCTVs();
        }

        private void ReadCCTVs()
        {
            string strErrorMessage;
            ArrayList arrDatas = m_dataManager.GetSelectManager().JoinSensorCCTV(null, out strErrorMessage);
            
            if (arrDatas == null)
            {
                Logger.Instance.Write(LogTypes.Error, "ReadCCTVs Error: " + strErrorMessage);
            }
            else
            {
                m_dicCCTVIDs.Clear();
                m_dicCCTVs.Clear();

                int nDataCount = arrDatas.Count;

                for (int i=0;i<nDataCount-1;i+=2)
                {
                    if (arrDatas[i] is Sensor && arrDatas[i + 1] is CCTV)
                    {
                        Sensor sensor = (Sensor)arrDatas[i];
                        CCTV cctv = (CCTV)arrDatas[i + 1];

                        CCTVData cctvData = new CCTVData();
                        cctvData.sensor_sn = cctv.sensor_sn;
                        cctvData.sensor_ty_optn_code = cctv.sensor_ty_optn_code;
                        cctvData.sensor_ty_code = cctv.sensor_ty_code;
                        cctvData.cctv_no = cctv.cctv_no;
                        cctvData.unq_key = cctv.unq_key;
                        cctvData.indoor_yn = cctv.indoor_yn;
                        cctvData.strmg_ty = cctv.strmg_ty;
                        cctvData.chnnl = cctv.chnnl;
                        cctvData.user_id = cctv.user_id;
                        cctvData.password = cctv.password;
                        cctvData.url = cctv.url;
                        cctvData.hd_url = cctv.hd_url;
                        cctvData.ld_url = cctv.ld_url;
                        cctvData.camera_ip = cctv.camera_ip;
                        cctvData.camera_makr_name = cctv.camera_makr_name;
                        cctvData.camera_model_name = cctv.camera_model_name;
                        cctvData.camera_name = sensor.sensor_name;
                        cctvData.enab = sensor.enab;

                        m_dicCCTVs[cctvData.unq_key] = cctvData;
                        m_dicCCTVIDs[cctvData.sensor_sn] = cctvData;
                    }
                }
            }
        }

        public void Update(ICollection<CCTVData> svmsCCTVs)
        {
            List<CCTVData> changedCCTVs = new List<CCTVData>();
            List<CCTVData> deletedCCTVs = new List<CCTVData>();
            List<CCTVData> newCCTVs = new List<CCTVData>();

            Logger.Instance.Write(LogTypes.Info, "CCTVManager.Update");
            CheckSvmsCCTVs(svmsCCTVs, changedCCTVs, deletedCCTVs, newCCTVs);

            if (changedCCTVs.Count > 0 || /*deletedCCTVs.Count > 0 || */newCCTVs.Count > 0)
            {
                //List<string> safetyI_IP_List = ReadSafetyI_IPList();

                if (newCCTVs.Count > 0)
                    AddCCTVs(newCCTVs/*, safetyI_IP_List*/);

                // CheckSvmsCCTVs 함수 안에 업데이트 진행하기 때문에 주석처리
                //if (changedCCTVs.Count > 0)
                //    ChangeCCTVs(changedCCTVs, safetyI_IP_List);

                // 삭제된 CCTV는 그냥 둔다.
                // 통신장애로 인하여 일시적으로 데이터를 못읽었을 가능성도 있다.
                /*if (deletedCCTVs.Count > 0)
                    DeleteCCTVs(deletedCCTVs);*/

                string strExeName_WebRTC = null;
                string strRunModule_WebRTC = null;
                string strJsonFile_WebRTC = null;
                string strExeName_go2rtc = null;
                string strRunModule_go2rtc = null;
                string strJsonFile_go2rtc = null;

                strExeName_WebRTC = m_parentManager.SvmsConfig.WebRTC_Name;
                strRunModule_WebRTC = m_parentManager.SvmsConfig.WebRTC_Path;
                strJsonFile_WebRTC = m_parentManager.SvmsConfig.WebRTC_Config;

                strExeName_go2rtc = m_parentManager.SvmsConfig.go2rtc_Name;
                strRunModule_go2rtc = m_parentManager.SvmsConfig.go2rtc_Path;
                strJsonFile_go2rtc = m_parentManager.SvmsConfig.go2rtc_Config;

                if (strExeName_WebRTC == null || strRunModule_WebRTC == null || strJsonFile_WebRTC == null ||
                    strExeName_go2rtc == null || strRunModule_go2rtc == null || strJsonFile_go2rtc == null)
                    return;

                if (KillProcess(strExeName_WebRTC))
                {
                    ICollection<CCTVData> cctvs = m_dicCCTVs.Values;

                    UpdateCCTV_RTSPtoWebRTC(cctvs, strJsonFile_WebRTC);
                    RunProcess(strRunModule_WebRTC);
                }

                if (KillProcess(strExeName_go2rtc))
                {
                    ICollection<CCTVData> cctvs = m_dicCCTVs.Values;

                    UpdateCCTV(cctvs, strJsonFile_go2rtc);
                    RunProcess(strRunModule_go2rtc);
                }
            }
        }

        private CCTVData FindCCTV(string strDeviceID, ICollection<CCTVData> cctvList)
        {
            foreach (CCTVData cctv in cctvList)
            {
                if (cctv.unq_key == strDeviceID)
                    return cctv;
            }

            return null;
        }

        private void AddCCTVs(List<CCTVData> newCCTVs/*, List<string> safetyI_IP_List*/)
        {
            string strErrorMessage;
            {
                int sensorNo, cctvNo;

                if (m_dataManager.GetSelectManager().GetNewCCTVInfo(out sensorNo, out cctvNo, out strErrorMessage) == false)
                {
                    Logger.Instance.Write(LogTypes.Error, "UpdateCCTV : " + strErrorMessage);
                    return;
                }

                DataManager dataManager = m_dataManager.Clone();

                DataManager dataManager_Power = null;
                DataManager dataManager_Facility = null;

                if (m_dataManager_Power != null) 
                    dataManager_Power = m_dataManager_Power.Clone();
                if (m_dataManager_Facility != null)
                    dataManager_Facility = m_dataManager_Facility.Clone();

                if (dataManager.BeginBatch() == false)
                {
                    Logger.Instance.Write(LogTypes.Error, "Transaction을 시작할 수 없습니다.");
                    return;
                }
                else
                {
                    if (dataManager_Power != null && dataManager_Power.BeginBatch() == false)
                    {
                        Logger.Instance.Write(LogTypes.Error, "dataManager_Power BeginBatch() Error");
                        dataManager_Power = null;
                    }

                    if (dataManager_Facility != null && dataManager_Facility.BeginBatch() == false)
                    {
                        Logger.Instance.Write(LogTypes.Error, "dataManager_Power BeginBatch() Error");
                        dataManager_Facility = null;
                    }
                }

                try
                {
                    foreach (CCTVData cctv in newCCTVs)
                    {
                        //string strCCTVType = IsSafetyI(cctv, safetyI_IP_List) ? Safety_I_Type : RTSP_Type;
                        string strCCTVType = RTSP_Type;
                        cctv.strmg_ty = strCCTVType;
                        //cctv.sensor_sn = sensorNo++;
                        int nCCTVNo = cctvNo++;

                        Sensor sensor = new Sensor();
                        sensor.sensor_sn = cctv.sensor_sn;
                        sensor.sensor_ty_optn_code = Sensor_Type_Option_Code;
                        sensor.sensor_ty_code = CCTV_Type_Code;
                        sensor.sensor_name = cctv.camera_name;
                        sensor.lc_name = "";
                        sensor.site_sn = m_nSiteNo;
                        sensor.sensor_sttus_optn_code = Sensor_Status_Option_Code;
                        sensor.enab = true;
                        sensor.deleted = false;
                        sensor.manual_yn = false;

                        Sensor _sensor = dataManager.GetCreateManager().CreateSensor(sensor, out strErrorMessage);
                        if (sensor == null)
                        {
                            throw new ApplicationException("CreateSensor Error : " + strErrorMessage);
                        }
                        else
                        {
                            if (dataManager_Power != null && dataManager_Power.GetCreateManager().CreateSensor_Sn(_sensor, out strErrorMessage) == null)
                                throw new ApplicationException("dataManager_Power CreateSensor_Sn Error : " + strErrorMessage);

                            if (dataManager_Facility != null && dataManager_Facility.GetCreateManager().CreateSensor_Sn(_sensor, out strErrorMessage) == null)
                                throw new ApplicationException("dataManager_Facility CreateSensor_Sn Error : " + strErrorMessage);
                        }

                        cctv.sensor_sn = _sensor.sensor_sn;
                        cctv.cctv_no = nCCTVNo;
                        cctv.sensor_ty_optn_code = Sensor_Type_Option_Code;
                        cctv.sensor_ty_code = CCTV_Type_Code;
                        cctv.user_id = "admin";
                        cctv.password = "soulbrain1@";

                        // 솔브레인 RTSP URL 관련 정보 수정 (클론에만 적용하여 메모리의 원본 URL 유지)
                        CCTV _cctvForDB = CloneCCTV(cctv);
                        string strURL = _cctvForDB.ld_url != null ? _cctvForDB.ld_url : _cctvForDB.url;
                        _cctvForDB.url = UpdateRTSPURL(strURL, _cctvForDB.sensor_sn);

                        if (dataManager.GetCreateManager().CreateCCTV(_cctvForDB, out strErrorMessage) == null)
                        {
                            throw new ApplicationException("CCTVManager.AddCCTVs, CCTV[" + cctv.sensor_sn + "], " + cctv.unq_key + ", Enabled : " + cctv.enab + ", Message: " + strErrorMessage);
                        }
                        else
                        {
                            m_dicCCTVs[cctv.unq_key] = cctv;
                            m_dicCCTVIDs[cctv.sensor_sn] = cctv;

                            Logger.Instance.Write(LogTypes.Info, "CCTVManager.AddCCTVs, CCTV[" + cctv.sensor_sn + "], " + cctv.unq_key + ", Enabled : " + cctv.enab);

                            if (dataManager_Power != null && dataManager_Power.GetCreateManager().CreateCCTV(_cctvForDB, out strErrorMessage) == null)
                                throw new ApplicationException("dataManager_Power CreateCCTV Error : " + strErrorMessage);

                            if (dataManager_Facility != null && dataManager_Facility.GetCreateManager().CreateCCTV(_cctvForDB, out strErrorMessage) == null)
                                throw new ApplicationException("dataManager_Facility CreateCCTV Error : " + strErrorMessage);
                        }
                    }

                    if (dataManager.BatchCommit() == false)
                    {
                        throw new ApplicationException("Transaction Commit Fail");
                    }
                    else
                    {
                        if (dataManager_Power?.BatchCommit() == false)
                            throw new ApplicationException("m_dataManager_Power Transaction Commit Fail");
                        if (dataManager_Facility?.BatchCommit() == false)
                            throw new ApplicationException("dataManager_Facility Transaction Commit Fail");
                    }
                }
                catch (Exception e)
                {
                    Logger.Instance.Write(LogTypes.Error, "AddCCTVs Error " + e.Message);
                    dataManager.BatchRollback();

                    if (dataManager_Power != null)
                        dataManager_Power.BatchRollback();
                    if (dataManager_Facility != null)
                        dataManager_Facility.BatchRollback();

                }
                
            }
        }

        private bool IsSafetyI(CCTVData cctv, List<string> safetyI_IP_List)
        {
            if (safetyI_IP_List == null)
                return false;

            if (cctv.url.ToLower().StartsWith("rtsp://") == false)
                return false;

            string strURL = cctv.url.ToLower().Substring("rtsp://".Length);
            int nIndex = strURL.IndexOf('/');

            if (nIndex < 0)
                return false;

            string strIP1 = strURL.Substring(0, nIndex).Trim();

            foreach (string strIP in safetyI_IP_List)
            {
                if (strIP1 == strIP)
                    return true;
            }

            string strURL2 = strURL.Substring(nIndex + 1);
            int nIndex2 = strURL2.IndexOf('_');

            if (nIndex2 < 0)
                return false;

            string strIP2 = strURL2.Substring(0, nIndex2).Trim();

            foreach (string strIP in safetyI_IP_List)
            {
                if (strIP2 == strIP)
                    return true;
            }

            return false;
        }

        private void CheckSvmsCCTVs(ICollection<CCTVData> svmsCCTVs, List<CCTVData> changedCCTVs, List<CCTVData> deletedCCTVs, List<CCTVData> newCCTVs)
        {
            // Key : Unique Key
            Dictionary<string, CCTVData> dicCopiedCCTVs = new Dictionary<string, CCTVData>();

            foreach (KeyValuePair<string, CCTVData> pair in m_dicCCTVs)
            {
                dicCopiedCCTVs[pair.Key] = pair.Value;
            }

            CCTVData _cctv;

            foreach (CCTVData cctv in svmsCCTVs)
            {
                if (dicCopiedCCTVs.TryGetValue(cctv.unq_key, out _cctv) == false)
                {
                    newCCTVs.Add(cctv);
                    continue;
                }

                if (IsSame(cctv, _cctv) == false)
                {
                    // 솔브레인 RTSP URL 관련 정보 수정
                    //string strURL = cctv.ld_url != null ? cctv.ld_url : cctv.url;
                    //strURL = UpdateRTSPURL(strURL, cctv.sensor_sn);

                    _cctv.camera_name = cctv.camera_name;
                    _cctv.url = cctv.url;
                    _cctv.hd_url = cctv.hd_url;
                    _cctv.ld_url = cctv.ld_url;
                    _cctv.enab = cctv.enab;
                    _cctv.camera_ip = cctv.camera_ip;
                    _cctv.camera_makr_name = cctv.camera_makr_name;
                    _cctv.camera_model_name = cctv.camera_model_name;
                    changedCCTVs.Add(_cctv);
                    Logger.Instance.Write(LogTypes.Info, "CCTVManager.UpdateCCTV, CCTV[" + _cctv.sensor_sn + "], " + _cctv.unq_key + ", Enabled : " + _cctv.enab);
                }

                dicCopiedCCTVs.Remove(cctv.unq_key);
            }

            string strError;
            if (!UpdateCCTVs(changedCCTVs, out strError))
                Logger.Instance.Write(LogTypes.Error, "CCTVManager.UpdateCCTV : " + strError);

            Logger.Instance.Write(LogTypes.Info, "CCTVManager.UpdateCCTV, CCTV count : " + changedCCTVs.Count);

            foreach (KeyValuePair<string, CCTVData> pair in dicCopiedCCTVs)
            {
                deletedCCTVs.Add(pair.Value);
            }
        }

        private bool UpdateCCTVs(List<CCTVData> changedCCTVs, out string strError)
        {
            strError = "";

            if (changedCCTVs == null)
            {
                strError = "업데이트 할 CCTV 리스트가 존재하지 않습니다.";
                return false;
            }

            foreach (CCTVData data in changedCCTVs)
            {
                //CCTV cctv = data;
                CCTV _cctv = CloneCCTV(data);
                string strURL = _cctv.ld_url != null ? _cctv.ld_url : _cctv.url;
                _cctv.url = UpdateRTSPURL(strURL, _cctv.sensor_sn);

                if (m_dataManager.GetUpdateManager().UpdateCCTV(_cctv, out strError) == false)
                    return false;
                else
                {
                    if (m_dataManager_Power != null && m_dataManager_Power.GetUpdateManager().UpdateCCTV(_cctv, out strError) == false)
                        Logger.Instance.Write(LogTypes.Error, "UpdateCCTVs Power UpdateCCTV Error : " + strError);

                    if (m_dataManager_Facility != null && m_dataManager_Facility.GetUpdateManager().UpdateCCTV(_cctv, out strError) == false)
                        Logger.Instance.Write(LogTypes.Error, "UpdateCCTVs Facility UpdateCCTV Error : " + strError);
                }

                

                Dictionary<Sensor.Fields, object> dicSets = new Dictionary<Sensor.Fields, object>();
                dicSets[Sensor.Fields.sensor_name] = data.camera_name;
                dicSets[Sensor.Fields.enab] = data.enab;

                Dictionary<Sensor.Fields, object> dicConditions = new Dictionary<Sensor.Fields, object>();
                dicConditions[Sensor.Fields.sensor_sn] = data.sensor_sn;

                if (m_dataManager.GetUpdateManager().UpdateSensor(dicSets, dicConditions, null, out strError) == false)
                    return false;
                else
                {
                    if (m_dataManager_Power != null && m_dataManager_Power.GetUpdateManager().UpdateSensor(dicSets, dicConditions, null, out strError) == false)
                        Logger.Instance.Write(LogTypes.Error, "UpdateCCTVs Power UpdateSensor Error : " + strError);

                    if (m_dataManager_Facility != null && m_dataManager_Facility.GetUpdateManager().UpdateSensor(dicSets, dicConditions, null, out strError) == false)
                        Logger.Instance.Write(LogTypes.Error, "UpdateCCTVs Facility UpdateSensor Error : " + strError);
                }

                
            }

            return true;
        }

        private bool IsSame(CCTVData cctv1, CCTVData cctv2)
        {
            if (cctv1.camera_name != cctv2.camera_name)
                return false;

            // 솔브레인 경우 DB url 정보에 스트리밍 url 입력으로 주석 처리
            //if (cctv1.url != cctv2.url)
            //    return false;

            if (cctv1.hd_url != cctv2.hd_url || cctv1.ld_url != cctv2.ld_url ||
                cctv1.camera_ip != cctv2.camera_ip || cctv1.camera_model_name != cctv2.camera_model_name ||
                cctv1.camera_makr_name != cctv2.camera_makr_name)
                return false;

            bool isEnabled1 = cctv1.enab;
            bool isEnabled2 = cctv2.enab;

            if (isEnabled1 != isEnabled2)
                return false;

            // Camera 이름과 URL이 같으면 같은 CCTV로 간주한다.
            // UniqueKey는 이미 같다는 전제하에서다.
            return true;
        }

        public bool UpdateCCTV(CCTVData cctv)
        {
            string strErrorMessage;
            CCTVData _cctv;

            if (m_dicCCTVs.TryGetValue(cctv.unq_key, out _cctv))
            {
                CCTV cctvinfo = cctv;

                // 솔브레인 RTSP URL 관련 정보 수정
                CCTV _cctvinfo = CloneCCTV(cctvinfo);
                string strURL = _cctvinfo.ld_url != null ? _cctvinfo.ld_url : _cctvinfo.url;
                strURL = UpdateRTSPURL(strURL, _cctvinfo.sensor_sn);
                _cctvinfo.url = strURL;

                if (m_dataManager.GetUpdateManager().UpdateCCTV(_cctvinfo, out strErrorMessage) == false)
                {
                    System.Diagnostics.Trace.WriteLine("UpdateCCTV Fail : " + strErrorMessage);
                    Logger.Instance.Write(LogTypes.Error, "UpdateCCTV Fail : " + strErrorMessage);
                    return false;
                }
                else
                {
                    Logger.Instance.Write(LogTypes.Info, "UpdateCCTV : sensor_sn: " + _cctvinfo.sensor_sn + " url: " + _cctvinfo.url);

                    if (m_dataManager_Power != null && m_dataManager_Power.GetUpdateManager().UpdateCCTV(_cctvinfo, out strErrorMessage) == false)
                        Logger.Instance.Write(LogTypes.Error, "UpdateCCTV Power UpdateCCTV Fail : " + strErrorMessage);

                    if (m_dataManager_Facility != null && m_dataManager_Facility.GetUpdateManager().UpdateCCTV(_cctvinfo, out strErrorMessage) == false)
                        Logger.Instance.Write(LogTypes.Error, "UpdateCCTV Facility UpdateCCTV Fail : " + strErrorMessage);
                }

               

                Dictionary<Sensor.Fields, object> dicSets = new Dictionary<Sensor.Fields, object>();
                dicSets[Sensor.Fields.sensor_name] = cctv.camera_name;
                dicSets[Sensor.Fields.enab] = cctv.enab;

                Dictionary<Sensor.Fields, object> dicConditions = new Dictionary<Sensor.Fields, object>();
                dicConditions[Sensor.Fields.sensor_sn] = cctv.sensor_sn;

                if (m_dataManager.GetUpdateManager().UpdateSensor(dicSets, dicConditions, null, out strErrorMessage) == false)
                {
                    System.Diagnostics.Trace.WriteLine("UpdateCCTV_Sensor Fail : " + strErrorMessage);
                    return false;
                }
                else
                {
                    if (m_dataManager_Power != null && m_dataManager_Power.GetUpdateManager().UpdateSensor(dicSets, dicConditions, null, out strErrorMessage) == false)
                        Logger.Instance.Write(LogTypes.Error, "UpdateCCTV Power UpdateSensor Fail : " + strErrorMessage);

                    if (m_dataManager_Facility != null && m_dataManager_Facility.GetUpdateManager().UpdateSensor(dicSets, dicConditions, null, out strErrorMessage) == false)
                        Logger.Instance.Write(LogTypes.Error, "UpdateCCTV Facility UpdateSensor Fail : " + strErrorMessage);
                }
                
                _cctv.user_id = cctv.user_id;
                _cctv.password = cctv.password;
                _cctv.camera_name = cctv.camera_name;
                _cctv.url = cctv.url;
                _cctv.enab = cctv.enab;
            }
            else
            {
                // CCTV 테이블 ID IDENTITY 사용 여부에 따른 조건
                {
                    int sensorNo, cctvNo;

                    if (m_dataManager.GetSelectManager().GetNewCCTVInfo(out sensorNo, out cctvNo, out strErrorMessage) == false)
                    {
                        Logger.Instance.Write(LogTypes.Error, "UpdateCCTV : " + strErrorMessage);
                        return false;
                    }

                    Sensor sensor = new Sensor();

                    sensor.sensor_sn = sensorNo;
                    sensor.sensor_ty_optn_code = Sensor_Type_Option_Code;
                    sensor.sensor_ty_code = CCTV_Type_Code;
                    sensor.sensor_name = cctv.camera_name;
                    sensor.lc_name = "";
                    sensor.site_sn = m_nSiteNo;
                    sensor.sensor_sttus_optn_code = Sensor_Status_Option_Code;
                    sensor.enab = cctv.enab;
                    sensor.deleted = false;
                    sensor.manual_yn = false;

                    if (m_dataManager.GetCreateManager().CreateSensor(sensor, out strErrorMessage) == null)
                    {
                        Logger.Instance.Write(LogTypes.Error, "UpdateCCTV Sensor : " + strErrorMessage);
                        return false;
                    }
                    else
                    {
                        if (m_dataManager_Power != null && m_dataManager_Power.GetCreateManager().CreateSensor_Sn(sensor, out strErrorMessage) == null)
                            Logger.Instance.Write(LogTypes.Error, "UpdateCCTV Power CreateSensor_Sn Fail : " + strErrorMessage);

                        if (m_dataManager_Facility != null && m_dataManager_Facility.GetCreateManager().CreateSensor_Sn(sensor, out strErrorMessage) == null)
                            Logger.Instance.Write(LogTypes.Error, "UpdateCCTV Facility CreateSensor_Sn Fail : " + strErrorMessage);
                    }                   

                    // 솔브레인 RTSP URL 관련 정보 수정
                    string strURL = cctv.ld_url != null ? cctv.ld_url : cctv.url;
                    cctv.url = UpdateRTSPURL(strURL, cctv.sensor_sn);

                    cctv.sensor_sn = sensorNo;
                    cctv.sensor_ty_optn_code = Sensor_Type_Option_Code;
                    cctv.sensor_ty_code = CCTV_Type_Code;
                    cctv.cctv_no = cctvNo;
                    cctv.strmg_ty = RTSP_Type;

                    if (m_dataManager.GetCreateManager().CreateCCTV(cctv, out strErrorMessage) == null)
                    {
                        Logger.Instance.Write(LogTypes.Error, "UpdateCCTV CCTV : " + strErrorMessage);
                        return false;
                    }
                    else
                    {
                        Logger.Instance.Write(LogTypes.Info, "UpdateCCTV Insert : sensor_sn: " + sensorNo + " url: " + strURL);

                        if (m_dataManager_Power != null && m_dataManager_Power.GetCreateManager().CreateCCTV(cctv, out strErrorMessage) == null)
                            Logger.Instance.Write(LogTypes.Error, "UpdateCCTV Power CreateCCTV Fail : " + strErrorMessage);

                        if (m_dataManager_Facility != null && m_dataManager_Facility.GetCreateManager().CreateCCTV(cctv, out strErrorMessage) == null)
                            Logger.Instance.Write(LogTypes.Error, "UpdateCCTV Facility CreateCCTV Fail : " + strErrorMessage);
                    }

                    

                    _cctv = new CCTVData(cctv);

                    int? sensorServerNo = GetSensorServerNo(m_dataManager);

                    for (int i = 900; i <= 906; i++)
                    {
                        SensorZone sensorZone = new SensorZone();

                        sensorZone.sensor_sn = sensorNo;
                        sensorZone.sensor_ty_optn_code = Sensor_Type_Option_Code;
                        sensorZone.sensor_ty_code = CCTV_Type_Code;
                        sensorZone.sensor_sub_ty_no = i;
                        sensorZone.unq_key = cctv.unq_key + "_" + i.ToString();
                        sensorZone.eqp_zone_sn = null;
                        sensorZone.alarm_yn = false;
                        sensorZone.tag_no = i;
                        sensorZone.acti = true;
                        sensorZone.sensor_server_sn = sensorServerNo;

                        SensorZone _sensorZone = m_dataManager.GetCreateManager().CreateSensorZone(sensorZone, out strErrorMessage);
                        if (_sensorZone == null)
                        {
                            Logger.Instance.Write(LogTypes.Error, "UpdateCCTV CreateSensorZone Error : " + strErrorMessage);
                            return false;
                        }

                        sensorZone.sensor_zone_sn = _sensorZone.sensor_zone_sn;

                        if (m_dataManager_Power != null && m_dataManager_Power.GetCreateManager().CreateSensorZone_Sn(sensorZone, out strErrorMessage) == null)
                            Logger.Instance.Write(LogTypes.Error, "UpdateCCTV Power CreateSensorZone_Sn Error : " + strErrorMessage);

                        if (m_dataManager_Facility != null && m_dataManager_Facility.GetCreateManager().CreateSensorZone_Sn(sensorZone, out strErrorMessage) == null)
                            Logger.Instance.Write(LogTypes.Error, "UpdateCCTV Facility CreateSensorZone_Sn Error : " + strErrorMessage);
                    }
                }

                m_dicCCTVs[_cctv.unq_key] = _cctv;
                m_dicCCTVIDs[_cctv.sensor_sn] = _cctv;
            }

            return true;
        }

        public static int? GetSensorServerNo(DataManager dataManager)
        {
            bool isNullable;
            string strCondition = string.Format("{0} = {1}", SensorZone.GetFieldName(SensorZone.Fields.sensor_ty_code, out isNullable), CCTV_Type_Code);

            string strErrorMessage;
            List<SensorZone> sensorZones = dataManager.GetSelectManager().SelectSensorZones(null, strCondition, 1, out strErrorMessage);

            if (sensorZones == null)
            {
                System.Diagnostics.Trace.WriteLine("GetSensorServerNo Error : " + strErrorMessage);
                return null;
            }

            if (sensorZones.Count == 0)
                return null;

            return sensorZones[0].sensor_server_sn;
        }

        public void RestartProcess()
        {
            string strExeName_WebRTC = null;
            string strRunModule_WebRTC = null;
            string strJsonFile_WebRTC = null;
            string strExeName_go2rtc = null;
            string strRunModule_go2rtc = null;
            string strJsonFile_go2rtc = null;

            strExeName_WebRTC = m_parentManager.SvmsConfig.WebRTC_Name;
            strRunModule_WebRTC = m_parentManager.SvmsConfig.WebRTC_Path;
            strJsonFile_WebRTC = m_parentManager.SvmsConfig.WebRTC_Config;

            strExeName_go2rtc = m_parentManager.SvmsConfig.go2rtc_Name;
            strRunModule_go2rtc = m_parentManager.SvmsConfig.go2rtc_Path;
            strJsonFile_go2rtc = m_parentManager.SvmsConfig.go2rtc_Config;

            if (strExeName_WebRTC == null || strRunModule_WebRTC == null || strJsonFile_WebRTC == null ||
                strExeName_go2rtc == null || strRunModule_go2rtc == null || strJsonFile_go2rtc == null)
                return;

            if (KillProcess(strExeName_WebRTC))
            {
                ICollection<CCTVData> cctvs = m_dicCCTVs.Values;

                UpdateCCTV_RTSPtoWebRTC(cctvs, strJsonFile_WebRTC);
                RunProcess(strRunModule_WebRTC);
            }

            if (KillProcess(strExeName_go2rtc))
            {
                ICollection<CCTVData> cctvs = m_dicCCTVs.Values;

                UpdateCCTV(cctvs, strJsonFile_go2rtc);
                RunProcess(strRunModule_go2rtc);
            }
        }

        public static bool KillProcess(string strProcessName)
        {
            System.Diagnostics.Process[] processList = System.Diagnostics.Process.GetProcesses();

            foreach (System.Diagnostics.Process process in processList)
            {
                if (process.ProcessName == strProcessName)
                {
                    try
                    {
                        process.Kill();
                    }
                    catch (Exception e)
                    {
                        System.Diagnostics.Trace.WriteLine(e.Message);
                        return false;
                    }
                }

            }

            return true;
        }

        public static void UpdateCCTV(ICollection<CCTVData> cctvs, string strJsonFile/*, string strStreamName*/)
        {
            string strConfig = "";
            StreamReader reader = new StreamReader(strJsonFile, Encoding.UTF8);

            if (reader.EndOfStream == false)
            {
                strConfig = reader.ReadToEnd();
            }

            reader.Close();

            if (strConfig.Length > 0 && strConfig.StartsWith("streams:"))
            {
                strConfig = "streams:\r\n";

                foreach (CCTVData cctv in cctvs)
                {
                    string strURL = (cctv.ld_url?.Length > 0) ? cctv.ld_url : cctv.url;

                    if (strURL == null || strURL.Length == 0 || (strURL.StartsWith("rtsp://") == false && strURL.StartsWith("RTSP://") == false))
                        continue;

                    strURL = strURL.Replace("RTSP://", "rtsp://");

                    strConfig += "    " + cctv.sensor_sn.ToString() + ":\r\n";

                    strConfig += "    - " + strURL + "\r\n";
                }

                UTF8Encoding utf8WithoutBOM = new UTF8Encoding(false);

                StreamWriter writer = new StreamWriter(strJsonFile, false, utf8WithoutBOM);
                writer.Write(strConfig);
                writer.Close();
            }
        }

        public static void UpdateCCTV_RTSPtoWebRTC(ICollection<CCTVData> cctvs, string strJsonFile)
        {
            string strJson = "";
            StreamReader reader = new StreamReader(strJsonFile, Encoding.UTF8);

            if (reader.EndOfStream == false)
            {
                strJson = reader.ReadToEnd();
            }

            reader.Close();
            // RTSPtoWebRTC 방식
            if (strJson.Length > 0)
            {
                JObject json = JObject.Parse(strJson);

                JToken temp;

                if (json.TryGetValue("streams", out temp))
                //if (json.ContainsKey("streams"))
                {
                    json.Remove("streams");
                }

                JObject streams = new JObject();
                //int index = 0;

                foreach (CCTV cctv in cctvs)
                {
                    string strURL = cctv.ld_url != null ? cctv.ld_url : cctv.url;

                    JObject url = new JObject();
                    url["on_demand"] = true;
                    url["disable_audio"] = true;
                    url["url"] = strURL;

                    streams[string.Format("{0}", cctv.sensor_sn)] = url;
                    //streams[string.Format("{0}", index++)] = url;
                    //streams[cctv.UniqueKey] = url;
                }

                json["streams"] = streams;

                UTF8Encoding utf8WithoutBOM = new UTF8Encoding(false);

                StreamWriter writer = new StreamWriter(strJsonFile, false, utf8WithoutBOM);
                writer.Write(json.ToString());
                writer.Close();
            }

        }

        public static System.Diagnostics.Process RunProcess(string strFilePath)
        {
            int nIndex = strFilePath.LastIndexOf('\\');

            string strWorkingDirectory = nIndex >= 0 ? strFilePath.Substring(0, nIndex) : ".";
            string strFileName = nIndex >= 0 ? strFilePath.Substring(nIndex + 1) : strFilePath;

            System.Diagnostics.ProcessStartInfo startInfo = new System.Diagnostics.ProcessStartInfo();
            startInfo.FileName = "cmd.exe";
            startInfo.WorkingDirectory = strWorkingDirectory;
            startInfo.ErrorDialog = true;
            startInfo.Arguments = "/C " + strFileName;

            System.Diagnostics.Process process;
            try
            {
                process = System.Diagnostics.Process.Start(startInfo);
                return process;
            }
            catch (Exception e)
            {
                System.Diagnostics.Trace.WriteLine(e.Message);
            }

            return null;
        }

        public void SendEvent(DateTime eventTime, string uniqueKey, int subSensorType)
        {
            CCTVData cctv;

            if (m_dicCCTVs.TryGetValue(uniqueKey, out cctv))
            {
                string strCondition = string.Format("{0} = {1} and {2} = {3}",
                    SensorZone.Fields.sensor_sn, cctv.sensor_sn,
                    SensorZone.Fields.sensor_sub_ty_no, subSensorType);

                string strErrorMessage;
                List<SensorZone> sensorZones = m_dataManager.GetSelectManager().SelectSensorZones(null, strCondition, null, out strErrorMessage);

                if (sensorZones == null)
                    return;

                if (sensorZones.Count > 0)
                {
                    SensorZone sensorZone = sensorZones[0];
                    if (m_parentManager.SendSensorData(sensorZone.sensor_ty_code, sensorZone.sensor_zone_sn, true, out strErrorMessage) == false)
                    {
                        Logger.Instance.Write(LogTypes.Error, "SendEvent : " + strErrorMessage);
                    }
                }
            }
        }

        public string UpdateRTSPURL(string strURL, int nID)
        {
            if (strURL == null)
                return null;

            if (strURL.IndexOf("_H264_") != -1)
            {   // RTSPtoWebRTC
                strURL = m_strRTSPtoWebRTC_URL + nID.ToString();
            }
            else
            {   // go2rtc
                strURL = m_strGo2rtc_URL + nID.ToString();
            }

            return strURL;
        }

        public CCTV CloneCCTV(CCTV cctv)
        {
            if (cctv == null)
                return null;

            CCTV _cctv = new CCTV();
            _cctv.sensor_sn = cctv.sensor_sn;
            _cctv.sensor_ty_optn_code = cctv.sensor_ty_optn_code;
            _cctv.sensor_ty_code = cctv.sensor_ty_code;
            _cctv.cctv_no = cctv.cctv_no;
            _cctv.unq_key = cctv.unq_key;
            _cctv.indoor_yn = cctv.indoor_yn;
            _cctv.strmg_ty = cctv.strmg_ty;
            _cctv.chnnl = cctv.chnnl;
            _cctv.user_id = cctv.user_id;
            _cctv.password = cctv.password;
            _cctv.url = cctv.url;
            _cctv.hd_url = cctv.hd_url;
            _cctv.ld_url = cctv.ld_url;
            _cctv.camera_ip = cctv.camera_ip;
            _cctv.camera_makr_name = cctv.camera_makr_name;
            _cctv.camera_model_name = cctv.camera_model_name;

            return _cctv;
        }
    }

    class CCTVData : CCTV
    {
        public string camera_name { get; set; }
        public bool enab { get; set; }

        public CCTVData()
        {
        }

        public CCTVData(CCTVData cctv)
        {
            this.sensor_sn = cctv.sensor_sn;
            this.sensor_ty_optn_code = cctv.sensor_ty_optn_code;
            this.sensor_ty_code = cctv.sensor_ty_code;
            this.cctv_no = cctv.cctv_no;
            this.unq_key = cctv.unq_key;
            this.indoor_yn = cctv.indoor_yn;
            this.chnnl = cctv.chnnl;
            this.user_id = cctv.user_id;
            this.password = cctv.password;
            this.url = cctv.url;
            this.hd_url = cctv.hd_url;
            this.ld_url = cctv.ld_url;
            this.camera_ip = cctv.camera_ip;
            this.camera_makr_name = cctv.camera_makr_name;
            this.camera_model_name = cctv.camera_model_name;
        }
    }
}
