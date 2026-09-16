using Base.Model.Sensor;
using Base.Model.Spatial;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using IntegrationServer.Datas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static dnsData.CommonCode.SdmsSensor;

namespace IntegrationServer.Managers
{
    public class SensorManager
    {
        private static SensorManager m_instance = null;
        public static SensorManager Instance { get { return m_instance; } }
        private IDataManager m_dataManager = null;

        // <Key:SensorServerID, <Key:SensorZoneID>>
        private Dictionary<int, Dictionary<int, SensorZoneInfo>> m_dicSensorZoneInfo = new Dictionary<int, Dictionary<int, SensorZoneInfo>>();

        public SensorManager(IDataManager dataManager)
        {
            m_instance = this;
            m_dataManager = dataManager;
        }

        public void Stop()
        {
        }

        public bool LoadData(List<ServerData> serverDatas)
        {
            m_dicSensorZoneInfo.Clear();
            if (serverDatas.Count == 0)
            {
                Logger.Instance.Write(LogTypes.Error, ServerType.None, -1, "LoadData : 조회할 SensorServerID가 없음");
                return false;
            }

            foreach (ServerData serverData in serverDatas)
            {
                if (!serverData.Use)
                    continue;

                string strSQL = string.Empty;

                strSQL = $@"
                        select {SensorZone.Fields.sensor_zone_sn}, {SensorZone.Fields.sensor_ty_code}, {SensorZone.Fields.sensor_sn}, {SensorZone.Fields.sensor_server_sn}, {SensorZone.Fields.unq_key}, {SensorZone.Fields.descp}
                          from {SensorZone.TableName}
                         where {SensorZone.Fields.sensor_server_sn} = ({serverData.SeqNo})";

                string strError;
                IEnumerable<dynamic> dynamics = m_dataManager.GetSelect().Select(strSQL, out strError);
                if (dynamics == null)
                {
                    Logger.Instance.Write(LogTypes.Error, ServerType.None, -1, "LoadData : " + strError);
                    continue;
                }

                foreach (var item in dynamics)
                {
                    int nSensorZoneID = item.sensor_zone_sn;
                    int nSensorType = item.sensor_ty_code;
                    int nSensorID = (int)item.sensor_sn;
                    int nSensorServerID = item.sensor_server_sn;
                    string strUniqueKey = item.unq_key;
                    string strDescription = item.descp;

                    SensorZoneInfo sensor = null;

                    sensor = new SensorZoneInfo()
                    {
                        ID = nSensorZoneID,
                        SensorType = nSensorType,
                        UniqueKey = strUniqueKey,
                        SensorID = nSensorID,
                        SensorServerID = nSensorServerID,
                        Description = strDescription
                    };

                    if (sensor != null)
                    {

                        if (!m_dicSensorZoneInfo.ContainsKey(nSensorServerID))
                            m_dicSensorZoneInfo.Add(nSensorServerID, new Dictionary<int, SensorZoneInfo>());

                        if (m_dicSensorZoneInfo[nSensorServerID].ContainsKey(nSensorZoneID))
                            continue;

                        m_dicSensorZoneInfo[nSensorServerID].Add(nSensorZoneID, sensor);
                    }
                }
            }

            return true;
        }

        public bool LoadData(List<int> sensorServerIDs)
        {
            m_dicSensorZoneInfo.Clear();
            if (sensorServerIDs.Count == 0)
            {
                Logger.Instance.Write(LogTypes.Error, ServerType.None, -1, "LoadData : 조회할 SensorServerID가 없음");
                return false;
            }

            string strSensorServerIDs = string.Join(",", sensorServerIDs);

            string strSQL = $@"
                        select {SensorZone.Fields.sensor_zone_sn}, {SensorZone.Fields.sensor_ty_code}, {SensorZone.Fields.sensor_sn}, {SensorZone.Fields.sensor_server_sn}, {SensorZone.Fields.unq_key}, {SensorZone.Fields.descp}
                          from {SensorZone.TableName}
                         where {SensorZone.Fields.sensor_server_sn} in ({strSensorServerIDs})";

            string strError;
            IEnumerable<dynamic> dynamics = m_dataManager.GetSelect().Select(strSQL, out strError);
            if (dynamics == null)
            {
                Logger.Instance.Write(LogTypes.Error, ServerType.None, -1, "LoadData : " + strError);
                return false;
            }

            foreach (var item in dynamics)
            {
                int nSensorZoneID = item.sensor_zone_sn;
                int nSensorType = item.sensor_ty_code;
                int nSensorID = item.sensor_sn;
                int nSensorServerID = item.sensor_server_sn;
                string strUniqueKey = item.unq_key;
                string strDescription = item.descp;

                SensorZoneInfo sensorZoneInfo = new SensorZoneInfo()
                {
                    ID = nSensorZoneID,
                    SensorType = nSensorType,
                    UniqueKey = strUniqueKey,
                    SensorID = nSensorID,
                    SensorServerID = nSensorServerID,
                    Description = strDescription
                };

                if (!m_dicSensorZoneInfo.ContainsKey(nSensorServerID))
                    m_dicSensorZoneInfo.Add(nSensorServerID, new Dictionary<int, SensorZoneInfo>());

                if (m_dicSensorZoneInfo[nSensorServerID].ContainsKey(nSensorZoneID))
                    continue;

                m_dicSensorZoneInfo[nSensorServerID].Add(nSensorZoneID, sensorZoneInfo);
            }

            return true;
        }

        public static Dictionary<int, SensorZoneInfo> LoadSensors(IDataManager dataManager, int nSiteID, int nSensorType)
        {
            string strSensorID = Sensor.Fields.sensor_sn.ToString();
            string strSensorSiteID = Sensor.Fields.site_sn.ToString();
            string strSensorTable = Sensor.TableName;

            string strSQL = string.Format($@"
                                            select sz.{SensorZone.Fields.sensor_zone_sn} SensorZoneID, sz.{SensorZone.Fields.sensor_sn} SensorID, sz.{SensorZone.Fields.sensor_server_sn} SensorServerID, sz.{SensorZone.Fields.unq_key} UniqueKey, sz.{SensorZone.Fields.descp} Description 
                                                from {SensorZone.TableName} sz 
                                                inner join {Sensor.TableName} sensor 
                                                on sensor.{Sensor.Fields.sensor_sn} = sz.{SensorZone.Fields.sensor_sn} 
                                                and sz.{SensorZone.Fields.sensor_ty_code} = {nSensorType} 
                                                and sensor.{strSensorSiteID} = {nSiteID}");

            string strError;
            IEnumerable<dynamic> dynamics = dataManager.GetSelect().Select(strSQL, out strError);
            if (dynamics == null)
            {
                Logger.Instance.Write(LogTypes.Error, ServerType.None, -1, "LoadSensors : " + strError);
                return null;
            }

            Dictionary<int, SensorZoneInfo> dicSensorZoneInfos = new Dictionary<int, SensorZoneInfo>();

            foreach (var item in dynamics)
            {
                int nSensorZoneID = item.SensorZoneID;
                int nSensorID = item.SensorID;
                int nSensorServerID = item.SensorServerID;
                string strUniqueKey = item.UniqueKey;
                string strDescription = item.Description;

                SensorZoneInfo sensorZoneInfo = new SensorZoneInfo()
                {
                    ID = nSensorZoneID,
                    SensorType = nSensorType,
                    UniqueKey = strUniqueKey,
                    SensorID = nSensorID,
                    SensorServerID = nSensorServerID,
                    Description = strDescription
                };

                dicSensorZoneInfos[nSensorZoneID] = sensorZoneInfo;
            }

            return dicSensorZoneInfos;
        }

        private static int? GetFirstZoneID(string strZoneIDs)
        {
            if (strZoneIDs == null || strZoneIDs.Length == 0)
                return null;

            string[] tokens = strZoneIDs.Split(',');

            foreach (string strToken in tokens)
            {
                int zoneID;

                if (int.TryParse(strToken.Trim(), out zoneID))
                    return zoneID;
            }

            return null;
        }

        private static int? GetFirstZoneID(IDataManager dataManager, int nEquipZoneID)
        {
            if (dataManager == null || nEquipZoneID < 1)
                return null;

            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", EquipmentZoneLinkedZone.Fields.eqp_zone_sn, nEquipZoneID);
            EquipmentZoneLinkedZone linkedZone = dataManager.GetSelect().SelectFirst<EquipmentZoneLinkedZone>(strCondition, out strErrorMessage);

            int? zoneID = null;

            if (linkedZone != null)
                zoneID = linkedZone.zone_sn;

            return zoneID;
        }

        // Key : Zone ID
        public static Dictionary<int, List<SensorZoneInfo>> LoadZoneSensors(IDataManager dataManager, int nSiteID, int nSensorType)
        {
            string strSensorID = Sensor.Fields.sensor_sn.ToString();
            string strSensorSiteID = Sensor.Fields.site_sn.ToString();
            string strSensorTable = Sensor.TableName;

            string strSQL = string.Format($@"
                                    select sz.{SensorZone.Fields.sensor_zone_sn} SensorZoneID, sz.{SensorZone.Fields.sensor_sn} SensorID, sz.{SensorZone.Fields.sensor_server_sn} SensorServerID, sz.{SensorZone.Fields.unq_key} UniqueKey, sz.{SensorZone.Fields.descp} Description, sz.{SensorZone.Fields.eqp_zone_sn} EquipZoneID 
                                    from {SensorZone.TableName} sz    
                                    inner join {Sensor.TableName} sensor on sensor.{strSensorID} = sz.{SensorZone.Fields.sensor_sn} and sz.{SensorZone.Fields.sensor_ty_code} = {nSensorType} and sensor.{Sensor.Fields.site_sn} = {nSiteID} 
                                    inner join {EquipmentZone.TableName} ez on sz.{SensorZone.Fields.eqp_zone_sn} = ez.{EquipmentZone.Fields.eqp_zone_sn}");


            string strError;
            IEnumerable<dynamic> dynamics = dataManager.GetSelect().Select(strSQL, out strError);
            if (dynamics == null)
            {
                Logger.Instance.Write(LogTypes.Error, ServerType.None, -1, "LoadSensors : " + strError);
                return null;
            }

            Dictionary<int, List<SensorZoneInfo>> dicZoneSensorZoneInfos = new Dictionary<int, List<SensorZoneInfo>>();

            foreach (var item in dynamics)
            {
                int nSensorZoneID = item.SensorZoneID;
                int nSensorID = item.SensorID;
                int nSensorServerID = item.SensorServerID;
                string strTagNo = item.UniqueKey;
                string strDescription = item.Description;
                int nEquipZoneID = item.EquipZoneID;

                int? zoneID = GetFirstZoneID(dataManager, nEquipZoneID);

                if (zoneID == null)
                    continue;

                List<SensorZoneInfo> sensorZoneInfos = null;

                if (dicZoneSensorZoneInfos.TryGetValue((int)zoneID, out sensorZoneInfos) == false)
                {
                    sensorZoneInfos = new List<SensorZoneInfo>();
                    dicZoneSensorZoneInfos[(int)zoneID] = sensorZoneInfos;
                }

                SensorZoneInfo sensorZoneInfo = new SensorZoneInfo()
                {
                    ID = nSensorZoneID,
                    SensorType = nSensorType,
                    UniqueKey = strTagNo,
                    SensorID = nSensorID,
                    SensorServerID = nSensorServerID,
                    Description = strDescription
                };

                sensorZoneInfos.Add(sensorZoneInfo);
            }

            return dicZoneSensorZoneInfos;
        }

        /// <summary>
        /// SensorZone.UniqueKey 로 센서 찾기
        /// </summary>
        /// <param name="nSensorServerID"></param>
        /// <param name="strUniqueKey"></param>
        /// <returns></returns>
        public SensorZoneInfo FindSensor(int nSensorServerID, string strUniqueKey)
        {
            Dictionary<int, SensorZoneInfo> sensorZoneInfos;
            if (m_dicSensorZoneInfo.TryGetValue(nSensorServerID, out sensorZoneInfos))
            {
                foreach (KeyValuePair<int, SensorZoneInfo> item in sensorZoneInfos)
                {
                    if (item.Value.UniqueKey == strUniqueKey)
                        return item.Value;
                }
            }

            return null;
        }

        /// <summary>
        /// SensorID로 센서 찾기
        /// </summary>
        /// <param name="nSensorServerID"></param>
        /// <param name="nSensorID"></param>
        /// <returns></returns>
        public SensorZoneInfo FindSensorBySensorID(int nSensorServerID, int nSensorID)
        {
            Dictionary<int, SensorZoneInfo> sensorZoneInfos;
            if (m_dicSensorZoneInfo.TryGetValue(nSensorServerID, out sensorZoneInfos))
            {
                foreach (KeyValuePair<int, SensorZoneInfo> item in sensorZoneInfos)
                {
                    if (item.Value.SensorID == nSensorID)
                        return item.Value;
                }
            }

            return null;
        }

        /// <summary>
        /// SensorZone.ID로 센서 찾기
        /// </summary>
        /// <param name="nSensorServerID"></param>
        /// <param name="nSensorZoneID"></param>
        /// <returns></returns>
        public SensorZoneInfo FindSensorByTagID(int nSensorServerID, int nSensorZoneID)
        {
            Dictionary<int, SensorZoneInfo> sensorZoneInfos;
            if (m_dicSensorZoneInfo.TryGetValue(nSensorServerID, out sensorZoneInfos))
            {
                SensorZoneInfo sensorZoneInfo;
                if (sensorZoneInfos.TryGetValue(nSensorZoneID, out sensorZoneInfo))
                    return sensorZoneInfo;
            }

            return null;
        }

        public Dictionary<int, SensorZoneInfo> FindSensors(int nSensorServerID)
        {
            Dictionary<int, SensorZoneInfo> sensorZoneInfos;
            if (m_dicSensorZoneInfo.TryGetValue(nSensorServerID, out sensorZoneInfos))
            {
                return sensorZoneInfos;
            }

            return null;
        }       
    }

    public class SensorZoneInfo
    {
        private int m_nID = 0;
        private int m_nSensorType = 0;
        private string m_strUniqueKey = "";
        private int m_nSensorID = 0;
        private int m_nSensorServerID = 0;
        private string m_strDescription = string.Empty;

        /// <summary>
        /// SensorZone 테이블 ID
        /// </summary>
        public int ID
        {
            get { return m_nID; }
            set { m_nID = value; }
        }

        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        public string UniqueKey
        {
            get { return m_strUniqueKey; }
            set { m_strUniqueKey = value; }
        }

        public int SensorID
        {
            get { return m_nSensorID; }
            set { m_nSensorID = value; }
        }

        public int SensorServerID
        {
            get { return m_nSensorServerID; }
            set { m_nSensorServerID = value; }
        }

        public string Description
        {
            get { return m_strDescription; }
            set { m_strDescription = value; }
        }
    }

    public class AlarmInfo
    {
        public int SensorZoneHistoryID { get; set; }
        public DateTime TimeStamp { get; set; }
        public int DetectionType { get; set; }
        public int SopStatus { get; set; }
        public int AlarmLevel { get; set; }
        public int SensorZoneID { get; set; }
    }
}
