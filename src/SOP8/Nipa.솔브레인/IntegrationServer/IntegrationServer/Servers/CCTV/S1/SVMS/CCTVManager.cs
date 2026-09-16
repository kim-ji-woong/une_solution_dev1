using Base.Model.Sensor;
using Base.Model.Sensor.CCTV;
using dnsDapperDBUtil.DataAccessLayer.DAL;
using dnsData.CommonCode;
using IntegrationServer.Datas;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text;
using static dnsData.CommonCode.SdmsSensor;

namespace IntegrationServer.Servers.CCTV.S1.SVMS
{
    public class CCTVManager
    {
        private SvmsManager m_parentManager = null;
        private int m_nServerSeqNo = -1;
        public int ServerSeqNo { get { return m_nServerSeqNo; } }
        private int m_nSiteID { get; set; }
        public int ServerType { get { return dnsData.CommonCode.SdmsSensor.ServerType.CCTV_S1_SVMS; } }

        private DataManager m_dataManager = null;

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

        public CCTVManager(SvmsManager svmsManager, DataManager dataManager, int nServerSeqNo, int nSiteID)
        {
            m_parentManager = svmsManager;
            m_dataManager = dataManager;
            m_nServerSeqNo = nServerSeqNo;
            m_nSiteID = nSiteID;

            ReadCCTVs();

            //m_strAlarmURL = ConfigurationManager.AppSettings.Get("Alarm_Security_URL");
        }

        private void ReadCCTVs()
        {
            string strErrorMessage;
            string strSQL = string.Format($@"
                                    select cctv.{Base.Model.Sensor.CCTV.CCTV.Fields.sensor_sn}, cctv.{Base.Model.Sensor.CCTV.CCTV.Fields.sensor_ty_optn_code}, cctv.{Base.Model.Sensor.CCTV.CCTV.Fields.sensor_ty_code}, cctv.{Base.Model.Sensor.CCTV.CCTV.Fields.cctv_no}, 
                                    cctv.{Base.Model.Sensor.CCTV.CCTV.Fields.unq_key}, cctv.{Base.Model.Sensor.CCTV.CCTV.Fields.indoor_yn}, cctv.{Base.Model.Sensor.CCTV.CCTV.Fields.strmg_ty}, cctv.{Base.Model.Sensor.CCTV.CCTV.Fields.chnnl}, 
                                    cctv.{Base.Model.Sensor.CCTV.CCTV.Fields.user_id}, cctv.{Base.Model.Sensor.CCTV.CCTV.Fields.password}, cctv.{Base.Model.Sensor.CCTV.CCTV.Fields.url}, cctv.{Base.Model.Sensor.CCTV.CCTV.Fields.hd_url}, 
                                    cctv.{Base.Model.Sensor.CCTV.CCTV.Fields.ld_url}, cctv.{Base.Model.Sensor.CCTV.CCTV.Fields.camera_ip}, cctv.{Base.Model.Sensor.CCTV.CCTV.Fields.camera_makr_name}, cctv.{Base.Model.Sensor.CCTV.CCTV.Fields.camera_model_name},
                                    sensor.{Sensor.Fields.sensor_name}, sensor.{Sensor.Fields.enab} 
                                    from {Base.Model.Sensor.CCTV.CCTV.TableName} cctv    
                                    inner join {Sensor.TableName} sensor on sensor.{Sensor.Fields.sensor_sn} = cctv.{Base.Model.Sensor.CCTV.CCTV.Fields.sensor_sn}");



            IEnumerable<dynamic> dynamics = m_dataManager.GetSelect().Select(strSQL, out strErrorMessage);
            if (dynamics != null)
            {
                m_dicCCTVIDs.Clear();
                m_dicCCTVs.Clear();

                foreach (var item in dynamics)
                {
                    CCTVData cctv = new CCTVData();
                    cctv.sensor_sn = item.sensor_sn;
                    cctv.sensor_ty_optn_code = item.sensor_ty_optn_code;
                    cctv.sensor_ty_code = item.sensor_ty_code;
                    cctv.cctv_no = item.cctv_no;
                    cctv.unq_key = item.unq_key;
                    cctv.indoor_yn = item.indoor_yn;
                    cctv.strmg_ty = item.strmg_ty;
                    cctv.chnnl = item.chnnl;
                    cctv.user_id = item.user_id;
                    cctv.password = item.password;
                    cctv.url = item.url;
                    cctv.hd_url = item.hd_url;
                    cctv.ld_url = item.ld_url;
                    cctv.camera_ip = item.camera_ip;
                    cctv.camera_makr_name = item.camera_makr_name;
                    cctv.camera_model_name = item.camera_model_name;
                    cctv.camera_name = item.sensor_name;
                    cctv.enab = item.enab;

                    m_dicCCTVs[cctv.unq_key] = cctv;
                    m_dicCCTVIDs[cctv.sensor_sn] = cctv;
                }
            }

            IEnumerable<EquipZoneCCTV> equipZoneCCTVs = m_dataManager.GetSelect().Select<EquipZoneCCTV>(null, out strErrorMessage);
            if (equipZoneCCTVs != null)
            {
                m_dicEquipZoneCCTVs.Clear();
                m_dicCCTVEquipZoneIDs.Clear();

                foreach (EquipZoneCCTV equipZoneCCTV in equipZoneCCTVs)
                {
                    CheckEquipZoneCCTV(equipZoneCCTV.eqp_zone_sn, equipZoneCCTV.cctv_1);
                    CheckEquipZoneCCTV(equipZoneCCTV.eqp_zone_sn, equipZoneCCTV.cctv_2);
                    CheckEquipZoneCCTV(equipZoneCCTV.eqp_zone_sn, equipZoneCCTV.cctv_3);
                    CheckEquipZoneCCTV(equipZoneCCTV.eqp_zone_sn, equipZoneCCTV.cctv_4);
                }
            }
        }

        private void CheckEquipZoneCCTV(int nEquipZoneID, int? cctvID)
        {
            if (cctvID == null)
                return;

            CCTVData cctv;

            if (m_dicCCTVIDs.TryGetValue((int)cctvID, out cctv) == false)
                return;

            List<CCTVData> cctvs;

            if (m_dicEquipZoneCCTVs.TryGetValue(nEquipZoneID, out cctvs) == false)
            {
                cctvs = new List<CCTVData>();
                m_dicEquipZoneCCTVs[nEquipZoneID] = cctvs;
            }

            cctvs.Add(cctv);

            List<int> equipZoneIDs;

            if (m_dicCCTVEquipZoneIDs.TryGetValue(cctv, out equipZoneIDs) == false)
            {
                equipZoneIDs = new List<int>();
                m_dicCCTVEquipZoneIDs[cctv] = equipZoneIDs;
            }

            if (equipZoneIDs.Contains(nEquipZoneID) == false)
                equipZoneIDs.Add(nEquipZoneID);
        }

        public void Update(ICollection<CCTVData> svmsCCTVs)
        {
            List<CCTVData> changedCCTVs = new List<CCTVData>();
            List<CCTVData> deletedCCTVs = new List<CCTVData>();
            List<CCTVData> newCCTVs = new List<CCTVData>();

            m_parentManager.Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, "CCTVManager.Update");
            CheckSvmsCCTVs(svmsCCTVs, changedCCTVs, deletedCCTVs, newCCTVs);

            if (changedCCTVs.Count > 0 || /*deletedCCTVs.Count > 0 || */newCCTVs.Count > 0)
            {
                //List<string> safetyI_IP_List = ReadSafetyI_IPList();

                if (newCCTVs.Count > 0)
                    AddCCTVs(newCCTVs/*, safetyI_IP_List*/);

                // CheckSvmsCCTVs 함수 안에 업데이트 진행하기 때문에 주석처리
                //if (changedCCTVs.Count > 0)
                //    ChangeCCTVs(changedCCTVs, safetyI_IP_List);

                /*if (deletedCCTVs.Count > 0)
                    DeleteCCTVs(deletedCCTVs);*/

                // 삭제된 CCTV는 그냥 둔다.
                // 통신장애로 인하여 일시적으로 데이터를 못읽었을 가능성도 있다.

                string strExeName = null;
                string strRunModule = null;
                string strJsonFile = null;

                Dictionary<ServerProperty, object> serverProperties = m_parentManager.ServerProperties;

                foreach (KeyValuePair<ServerProperty, object> pair in serverProperties)
                {
                    ServerProperty key = pair.Key;

                    if (pair.Value == null)
                        continue;

                    if (key == ServerProperty.RtspServerName)
                        strExeName = pair.Value.ToString();
                    else if (key == ServerProperty.RtspServerName)
                        strRunModule = pair.Value.ToString();
                    else if (key == ServerProperty.CctvConfig)
                        strJsonFile = pair.Value.ToString();
                }

                if (strExeName == null || strRunModule == null || strJsonFile == null)
                    return;

                if (KillProcess(strExeName))
                {
                    ICollection<CCTVData> cctvs = m_dicCCTVs.Values;

                    UpdateCCTV(cctvs, strJsonFile/*, strStreamName*/);
                    RunProcess(strRunModule);
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

        //private List<string> ReadSafetyI_IPList()
        //{
        //    string strErrorMessage;
        //    IEnumerable<OptionSDMS> result = m_dataManager.GetSelect().Select<OptionSDMS>("PropertyName='Safety-I IP'", out strErrorMessage);
        //    if (result == null)
        //        return null;

        //    List<OptionSDMS> options = result.ToList();
        //    if (options.Count == 0)
        //        return null;

        //    string[] ips = options[0].PropertyValue.Trim().Split('/');

        //    List<string> ipList = new List<string>();

        //    foreach (string strIP in ips)
        //    {
        //        ipList.Add(strIP.Trim());
        //    }

        //    return ipList;
        //}

        private void AddCCTVs(List<CCTVData> newCCTVs/*, List<string> safetyI_IP_List*/)
        {
            string strErrorMessage;
            {
                dynamic max = m_dataManager.GetSelect().SelectFirst($"select ISNULL(max({Base.Model.Sensor.CCTV.CCTV.Fields.sensor_sn}) + 1, 1) ID, ISNULL(max({Base.Model.Sensor.CCTV.CCTV.Fields.cctv_no}) + 1, 1) NO from {Base.Model.Sensor.CCTV.CCTV.TableName}", out strErrorMessage);
                if (max == null)
                {
                    m_parentManager.Logger.Write(LogTypes.Error, ServerType, ServerSeqNo, "UpdateCCTV : " + strErrorMessage);
                    return;
                }

                int nMaxID = max.ID;
                int nMaxNO = max.NO;

                foreach (CCTVData cctv in newCCTVs)
                {
                    //string strCCTVType = IsSafetyI(cctv, safetyI_IP_List) ? Safety_I_Type : RTSP_Type;
                    string strCCTVType = RTSP_Type;
                    cctv.strmg_ty = strCCTVType;
                    cctv.sensor_sn = nMaxID++;
                    int nCCTVNo = nMaxNO++;

                    string strSQL = $@"
                    insert into {Sensor.TableName} ({Sensor.Fields.sensor_sn}, {Sensor.Fields.sensor_ty_optn_code}, {Sensor.Fields.sensor_ty_optn_code}, {Sensor.Fields.sensor_name}, {Sensor.Fields.site_sn}, {Sensor.Fields.sensor_sttus_optn_code}, {Sensor.Fields.enab}, {Sensor.Fields.deleted})
                    values ({cctv.sensor_sn}, {(int)CodeType.SensorType}, {SensorType.CCTV}, '{cctv.camera_name}', {m_nSiteID}, {(int)CodeType.SensorStatus}, {(cctv.enab == false ? 0 : 1)}, 0)";
                    if (m_dataManager.GetCreate().Insert(strSQL, out strErrorMessage) == false)
                    {
                        m_parentManager.Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "CCTVManager.AddCCTVs, Sensor[" + cctv.sensor_sn + "], Enabled : " + cctv.enab);
                        continue;
                    }                       

                    strSQL = $@"
                    insert into {Base.Model.Sensor.CCTV.CCTV.TableName} ({Base.Model.Sensor.CCTV.CCTV.Fields.sensor_sn}, {Base.Model.Sensor.CCTV.CCTV.Fields.sensor_ty_optn_code}, {Base.Model.Sensor.CCTV.CCTV.Fields.sensor_ty_code}, 
                    {Base.Model.Sensor.CCTV.CCTV.Fields.cctv_no}, {Base.Model.Sensor.CCTV.CCTV.Fields.unq_key}, {Base.Model.Sensor.CCTV.CCTV.Fields.indoor_yn}, {Base.Model.Sensor.CCTV.CCTV.Fields.strmg_ty}, {Base.Model.Sensor.CCTV.CCTV.Fields.user_id}, 
                    {Base.Model.Sensor.CCTV.CCTV.Fields.password}, {Base.Model.Sensor.CCTV.CCTV.Fields.url}, {Base.Model.Sensor.CCTV.CCTV.Fields.hd_url}, {Base.Model.Sensor.CCTV.CCTV.Fields.ld_url}, {Base.Model.Sensor.CCTV.CCTV.Fields.camera_ip},
                    {Base.Model.Sensor.CCTV.CCTV.Fields.camera_makr_name}, {Base.Model.Sensor.CCTV.CCTV.Fields.camera_model_name})
                    values ({cctv.sensor_sn}, {(int)CodeType.SensorType}, {SensorType.CCTV}, {nCCTVNo}, '{cctv.unq_key}', {(cctv.indoor_yn == false ? 0 : 1)}, '{strCCTVType}', '{cctv.user_id}', '{cctv.password}', '{cctv.url}', '{cctv.hd_url}', '{cctv.ld_url}', 
                    '{cctv.camera_ip}', '{cctv.camera_makr_name}', '{cctv.camera_model_name}')";
                    if (m_dataManager.GetCreate().Insert(strSQL, out strErrorMessage))
                    {
                        m_dicCCTVs[cctv.unq_key] = cctv;
                        m_dicCCTVIDs[cctv.sensor_sn] = cctv;

                        m_parentManager.Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, "CCTVManager.AddCCTVs, CCTV[" + cctv.sensor_sn + "], " + cctv.unq_key + ", Enabled : " + cctv.enab);
                    }
                    else
                        m_parentManager.Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "CCTVManager.AddCCTVs, CCTV[" + cctv.sensor_sn + "], " + cctv.unq_key + ", Enabled : " + cctv.enab);
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

        //private void ChangeCCTVs(List<CCTV> changedCCTVs, List<string> safetyI_IP_List)
        //{
        //    string strErrorMessage;

        //    foreach (CCTV cctv in changedCCTVs)
        //    {
        //        if (IsSafetyI(cctv, safetyI_IP_List))
        //            cctv.Type = Safety_I_Type;
        //        else
        //            cctv.Type = RTSP_Type;
        //    }

        //    if (!m_dataManager.GetUpdate().Update<CCTV>(changedCCTVs, out strErrorMessage))
        //        m_parentManager.Logger.Write(LogTypes.Error, ServerType, ServerSeqNo, "CCTVManager.ChangeCCTVs : " + strErrorMessage);
        //}

        //private void DeleteCCTVs(List<CCTV> deletedCCTVs)
        //{
        //    string strErrorMessage;
        //    string strIDs = string.Join(",", deletedCCTVs.Select(p => p.ID));
        //    if (strIDs.Length == 0)
        //        return;

        //    string strConditions = string.Format("ID in ({0})", strIDs);
        //    if (!m_dataManager.GetDelete().Delete<CCTV>(strConditions, out strErrorMessage))
        //        m_parentManager.Logger.Write(LogTypes.Error, ServerType, ServerSeqNo, "CCTVManager.DeleteCCTVs, CCTV[" + strIDs + "]");
        //}

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
                    {
                        _cctv.camera_name = cctv.camera_name;
                        _cctv.url = cctv.url;
                        _cctv.hd_url = cctv.hd_url;
                        _cctv.ld_url = cctv.ld_url;
                        _cctv.enab = cctv.enab;
                        _cctv.camera_ip = cctv.camera_ip;
                        _cctv.camera_makr_name = cctv.camera_makr_name;
                        _cctv.camera_model_name = cctv.camera_model_name;
                        changedCCTVs.Add(_cctv);
                        m_parentManager.Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, "CCTVManager.UpdateCCTV, CCTV[" + _cctv.sensor_sn + "], " + _cctv.unq_key + ", Enabled : " + _cctv.enab);
                    }
                }

                dicCopiedCCTVs.Remove(cctv.unq_key);
            }

            string strError;
            if (!UpdateCCTVs(changedCCTVs, out strError))
                m_parentManager.Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "CCTVManager.UpdateCCTV : " + strError);

            m_parentManager.Logger.Write(LogTypes.Info, ServerType, m_nServerSeqNo, "CCTVManager.UpdateCCTV, CCTV count : " + changedCCTVs.Count);

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
                Base.Model.Sensor.CCTV.CCTV cctv = data;

                if (m_dataManager.GetUpdate().Update<Base.Model.Sensor.CCTV.CCTV>(cctv, null, out strError) == false)
                    return false;



                Dictionary<Sensor.Fields, object> dicSets = new Dictionary<Sensor.Fields, object>();
                dicSets[Sensor.Fields.sensor_name] = data.camera_name;
                dicSets[Sensor.Fields.enab] = data.enab;

                string strConditions = $"{Sensor.Fields.sensor_sn} = {data.sensor_sn}";

                if (m_dataManager.GetUpdate().Update<Sensor, Sensor.Fields>(dicSets, strConditions, out strError) == false)
                    return false;
            }

            return true;
        }

        private bool IsSame(CCTVData cctv1, CCTVData cctv2)
        {
            if (cctv1.camera_name != cctv2.camera_name)
                return false;

            if (cctv1.url != cctv2.url)
                return false;

            if (cctv1.hd_url != cctv2.hd_url || cctv1.ld_url != cctv2.ld_url ||
                cctv1.camera_ip != cctv2.camera_ip || cctv1.camera_model_name != cctv2.camera_model_name ||
                cctv1.camera_makr_name != cctv2.camera_makr_name)
                return false;

            bool isEnabled1 = cctv1.enab == null || (bool)cctv1.enab;
            bool isEnabled2 = cctv2.enab == null || (bool)cctv2.enab;

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
                Base.Model.Sensor.CCTV.CCTV cctvinfo = cctv;
                if (m_dataManager.GetUpdate().Update<Base.Model.Sensor.CCTV.CCTV>(cctvinfo, null, out strErrorMessage) == false)
                {
                    System.Diagnostics.Trace.WriteLine("UpdateCCTV Fail : " + strErrorMessage);
                    return false;
                }
                    

                Dictionary<Sensor.Fields, object> dicSets = new Dictionary<Sensor.Fields, object>();
                dicSets[Sensor.Fields.sensor_name] = cctv.camera_name;
                dicSets[Sensor.Fields.enab] = cctv.enab;

                string strConditions = $"{Sensor.Fields.sensor_sn} = {cctv.sensor_sn}";

                if (m_dataManager.GetUpdate().Update<Sensor, Sensor.Fields>(dicSets, strConditions, out strErrorMessage) == false)
                {
                    System.Diagnostics.Trace.WriteLine("UpdateCCTV_Sensor Fail : " + strErrorMessage);
                    return false;
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
                    dynamic max = m_dataManager.GetSelect().SelectFirst($"select ISNULL(max({Base.Model.Sensor.CCTV.CCTV.Fields.sensor_sn}) + 1, 1) ID, ISNULL(max({Base.Model.Sensor.CCTV.CCTV.Fields.cctv_no}) + 1, 1) NO from {Base.Model.Sensor.CCTV.CCTV.TableName}", out strErrorMessage);
                    if (max == null)
                    {
                        m_parentManager.Logger.Write(LogTypes.Error, ServerType, ServerSeqNo, "UpdateCCTV : " + strErrorMessage);
                        return false;
                    }

                    int nMaxID = max.ID;
                    int nMaxNO = max.NO;

                    string strSQL = $@"
                    insert into {Sensor.TableName} ({Sensor.Fields.sensor_sn}, {Sensor.Fields.sensor_ty_optn_code}, {Sensor.Fields.sensor_ty_optn_code}, {Sensor.Fields.sensor_name}, {Sensor.Fields.site_sn}, {Sensor.Fields.sensor_sttus_optn_code}, {Sensor.Fields.enab}, {Sensor.Fields.deleted})
                    values ({nMaxID}, {(int)CodeType.SensorType}, {SensorType.CCTV}, '{cctv.camera_name}', {m_nSiteID}, {(int)CodeType.SensorStatus}, {(cctv.enab == false ? 0 : 1)}, 0)";
                    if (m_dataManager.GetCreate().Insert(strSQL, out strErrorMessage) == false)
                    {
                        m_parentManager.Logger.Write(LogTypes.Error, ServerType, ServerSeqNo, "UpdateCCTV Sensor : " + strErrorMessage);
                        return false;
                    }

                    strSQL = $@"
                    insert into {Base.Model.Sensor.CCTV.CCTV.TableName} ({Base.Model.Sensor.CCTV.CCTV.Fields.sensor_sn}, {Base.Model.Sensor.CCTV.CCTV.Fields.sensor_ty_optn_code}, {Base.Model.Sensor.CCTV.CCTV.Fields.sensor_ty_code}, 
                    {Base.Model.Sensor.CCTV.CCTV.Fields.cctv_no}, {Base.Model.Sensor.CCTV.CCTV.Fields.unq_key}, {Base.Model.Sensor.CCTV.CCTV.Fields.indoor_yn}, {Base.Model.Sensor.CCTV.CCTV.Fields.strmg_ty}, {Base.Model.Sensor.CCTV.CCTV.Fields.user_id}, 
                    {Base.Model.Sensor.CCTV.CCTV.Fields.password}, {Base.Model.Sensor.CCTV.CCTV.Fields.url}, {Base.Model.Sensor.CCTV.CCTV.Fields.hd_url}, {Base.Model.Sensor.CCTV.CCTV.Fields.ld_url}, {Base.Model.Sensor.CCTV.CCTV.Fields.camera_ip},
                    {Base.Model.Sensor.CCTV.CCTV.Fields.camera_makr_name}, {Base.Model.Sensor.CCTV.CCTV.Fields.camera_model_name})
                    values ({nMaxID}, {(int)CodeType.SensorType}, {SensorType.CCTV}, {nMaxNO}, '{cctv.unq_key}', {(cctv.indoor_yn == false ? 0 : 1)}, '{RTSP_Type}', '{cctv.user_id}', '{cctv.password}', '{cctv.url}', '{cctv.hd_url}', '{cctv.ld_url}', 
                    '{cctv.camera_ip}', '{cctv.camera_makr_name}', '{cctv.camera_model_name}')";
                    if (m_dataManager.GetCreate().Insert(strSQL, out strErrorMessage) == false)
                    {
                        m_parentManager.Logger.Write(LogTypes.Error, ServerType, ServerSeqNo, "UpdateCCTV CCTV : " + strErrorMessage);
                        return false;
                    }

                    _cctv = new CCTVData();
                    _cctv.sensor_sn = nMaxID;
                    _cctv.camera_name = cctv.camera_name;
                    //_cctv.PositionName = cctv.;
                    _cctv.unq_key = cctv.unq_key;
                    _cctv.strmg_ty = RTSP_Type;
                    _cctv.user_id = cctv.user_id;
                    _cctv.password = cctv.password;
                    _cctv.url = cctv.url;
                    _cctv.enab = cctv.enab;
                    _cctv.camera_ip = cctv.camera_ip;
                    _cctv.camera_makr_name = cctv.camera_makr_name;
                    _cctv.camera_model_name = cctv.camera_model_name;
                }


                m_dicCCTVs[_cctv.unq_key] = _cctv;
                m_dicCCTVIDs[_cctv.sensor_sn] = _cctv;
            }

            return true;
        }

        public void RestartProcess()
        {
            string strExeName = null;
            string strRunModule = null;
            string strJsonFile = null;

            Dictionary<ServerProperty, object> serverProperties = m_parentManager.ServerProperties;

            foreach (KeyValuePair<ServerProperty, object> pair in serverProperties)
            {
                ServerProperty key = pair.Key;

                if (pair.Value == null)
                    continue;

                if (key == ServerProperty.RtspServerName)
                    strExeName = pair.Value.ToString();
                else if (key == ServerProperty.RunRtspServer)
                    strRunModule = pair.Value.ToString();
                else if (key == ServerProperty.CctvConfig)
                    strJsonFile = pair.Value.ToString();
            }

            if (strExeName == null || strRunModule == null || strJsonFile == null)
                return;

            if (KillProcess(strExeName))
            {
                ICollection<CCTVData> cctvs = m_dicCCTVs.Values;

                UpdateCCTV(cctvs, strJsonFile/*, strStreamName*/);
                RunProcess(strRunModule);
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

        public static Process RunProcess(string strFilePath)
        {
            int nIndex = strFilePath.LastIndexOf('\\');

            string strWorkingDirectory = nIndex >= 0 ? strFilePath.Substring(0, nIndex) : ".";
            string strFileName = nIndex >= 0 ? strFilePath.Substring(nIndex + 1) : strFilePath;

            ProcessStartInfo startInfo = new ProcessStartInfo();
            startInfo.FileName = "cmd.exe";
            startInfo.WorkingDirectory = strWorkingDirectory;
            startInfo.ErrorDialog = true;
            startInfo.Arguments = "/C " + strFileName;

            Process process;
            try
            {
                process = Process.Start(startInfo);
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
                string strSQL = $@"
                    select sz.{SensorZone.Fields.sensor_zone_sn} SensorZoneID, sz.{SensorZone.Fields.sensor_ty_code} SensorType 
                      from {SensorZone.TableName} sz
                     where sz.{SensorZone.Fields.sensor_sub_ty_no}={subSensorType}
                       and sz.{SensorZone.Fields.sensor_sn}={cctv.sensor_sn}";

                string strError;
                dynamic arrDatas = m_dataManager.GetSelect().SelectFirst(strSQL, out strError);
                if (arrDatas == null)
                    return;

                if (m_parentManager.SendSensorData(arrDatas.SensorType, arrDatas.SensorZoneID, true, out string strErrorMessage) == false)
                {
                    m_parentManager.Logger.Write(LogTypes.Error, ServerType, m_nServerSeqNo, "SendEvent : " + strErrorMessage);
                }
            }
        }
    }

    public class CCTVData : Base.Model.Sensor.CCTV.CCTV
    {
        public string camera_name { get; set; }
        public bool enab { get; set; }
    }
}
