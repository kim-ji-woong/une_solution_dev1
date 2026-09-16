using System.Collections.Generic;
using Base.History.IBLL.Request;
using Base.Model.History;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.DAL;
using System.Collections;
using Base.Model.Spatial;

namespace Soulbrain.BLL.Request
{
    public class RequestSensorAnalysisHistoryEx : RequestSensorAnalysisHistory
    {
        public class _PermitZones
        {
            private List<int> m_zoneNos = null;
            private List<int> m_exceptSensorNos = null;

            public List<int> ZoneNo
            {
                get { return m_zoneNos; }
                set { m_zoneNos = value; }
            }

            public List<int> ExceptSensorNo
            {
                get { return m_exceptSensorNos; }
                set { m_exceptSensorNos = value; }
            }
        }

        private _PermitZones m_permitZones = null;
        private List<int> m_permitSensorNos = null;

        public _PermitZones PermitZones
        {
            get { return m_permitZones; }
            set { m_permitZones = value; }
        }

        public List<int> PermitSensorNo
        {
            get { return m_permitSensorNos; }
            set { m_permitSensorNos = value; }
        }

        public RequestSensorAnalysisHistoryEx()
        {
        }

        public override void CheckAdditionalCondition(ref string strSQL)
        {
            string strQuery = strSQL.ToLower();
            string strSensorZoneHistoryAlias = null, strSensorZoneAlias = null;

            if (this.PermitZones != null)
            {
                if (this.PermitZones.ZoneNo != null)
                    AddZoneCondition(this.PermitZones.ZoneNo, ref strSensorZoneHistoryAlias, ref strSQL);

                if (this.PermitZones.ExceptSensorNo != null)
                    SubSensorCondition(this.PermitZones.ExceptSensorNo, ref strSensorZoneAlias, ref strSQL);
            }

            if (this.PermitSensorNo != null)
                AddSensorCondition(this.PermitSensorNo, strSensorZoneAlias, ref strSQL);
        }

        private void AddZoneCondition(List<int> zoneNos, ref string strSensorZoneHistoryAlias, ref string strSQL)
        {
            if (zoneNos.Count == 0)
                return;

            string strNextAlias = null;
            strSensorZoneHistoryAlias = GetAlias(strSQL, SensorZone.TableName.ToLower(), ref strNextAlias);

            if (strSensorZoneHistoryAlias == null)
            {
                strSensorZoneHistoryAlias = strNextAlias;

                strSQL += string.Format(" inner join {0} {1} on a.{2} = {1}.{3}",
                    SensorZone.TableName,
                    strSensorZoneHistoryAlias,
                    SensorZoneDetail.Fields.sensor_zone_hist_sn, SensorZone.Fields.sensor_zone_hist_sn);
            }

            strSQL += string.Format(" and {0}.{1} in ({2})",
                strSensorZoneHistoryAlias,
                SensorZone.Fields.zone_sn,
                string.Join(',', zoneNos));
        }

        private void SubSensorCondition(List<int> exceptSensorNo, ref string strSensorZoneAlias, ref string strSQL)
        {
            if (exceptSensorNo.Count == 0)
                return;

            string strNextAlias = null;
            strSensorZoneAlias = GetAlias(strSQL, Base.Model.Sensor.SensorZone.TableName.ToLower(), ref strNextAlias);

            if (strSensorZoneAlias == null)
            {
                strSensorZoneAlias = strNextAlias;

                strSQL += string.Format(" inner join {0} {1} on a.{2} = {1}.{3}",
                    Base.Model.Sensor.SensorZone.TableName,
                    strSensorZoneAlias,
                    SensorZoneDetail.Fields.sensor_zone_sn, Base.Model.Sensor.SensorZone.Fields.sensor_zone_sn);
            }

            strSQL += string.Format(" and {0}.{1} not in ({2})",
                strSensorZoneAlias,
                Base.Model.Sensor.SensorZone.Fields.sensor_sn,
                string.Join(',', exceptSensorNo));
        }

        private void AddSensorCondition(List<int> exceptSensorNo, string strSensorZoneAlias, ref string strSQL)
        {
            if (exceptSensorNo.Count == 0)
                return;

            if (strSensorZoneAlias == null)
            {
                string strNextAlias = null;
                strSensorZoneAlias = GetAlias(strSQL, Base.Model.Sensor.SensorZone.TableName.ToLower(), ref strNextAlias);

                if (strSensorZoneAlias == null)
                    strSensorZoneAlias = strNextAlias;

                strSQL += string.Format(" inner join {0} {1} on a.{2} = {1}.{3}",
                    Base.Model.Sensor.SensorZone.TableName,
                    strSensorZoneAlias,
                    SensorZoneDetail.Fields.sensor_zone_sn, Base.Model.Sensor.SensorZone.Fields.sensor_zone_sn);
            }

            strSQL += string.Format(" and {0}.{1} in ({2})",
                strSensorZoneAlias,
                Base.Model.Sensor.SensorZone.Fields.sensor_sn,
                string.Join(',', exceptSensorNo));
        }

        private string GetAlias(string strSQL, string strTargetTableName, ref string strNextAlias)
        {
            strNextAlias = null;
            string strLastAlias = "a";

            string strLowerQuery = strSQL.ToLower();
            string[] tokens = strLowerQuery.Split("inner join");

            int tokenCount = tokens.Length;

            for (int i = 1; i < tokenCount; i++)
            {
                string strToken = tokens[i].Trim();
                int index = strToken.IndexOf(' ');

                if (index < 0)
                    continue;

                string strTableName = strToken.Substring(0, index).Trim();

                int index2 = strToken.IndexOf(' ', index + 1);
                string strAlias = strToken.Substring(index + 1, index2 - index - 1).Trim();

                if (strTableName == strTargetTableName)
                    return strAlias;
                else
                    strLastAlias = strAlias;
            }

            strNextAlias = GetNextAlias(strLastAlias);
            return null;
        }

        private string GetNextAlias(string strAlias)
        {
            char ch = strAlias[0];
            char next = (char)(ch + 1);
            return next.ToString();
        }

        // Key : SensorZone No
        public override bool GetLocationName(IDataManager dataManager, Dictionary<int, string> dicSensorZoneLocationNames)
        {
            if (dicSensorZoneLocationNames == null)
                return false;

            string strSensorZoneNos = null;

            foreach (KeyValuePair<int, string> pair in dicSensorZoneLocationNames)
            {
                if (strSensorZoneNos == null)
                    strSensorZoneNos = pair.Key.ToString();
                else
                    strSensorZoneNos += ", " + pair.Key.ToString();
            }

            if (strSensorZoneNos == null)
                return false;

            JoinManager joinManager = new JoinManager(dataManager);

            string strErrorMessage;
            string strCondition = string.Format("a.{0} in ({1})", Base.Model.Sensor.SensorZone.Fields.sensor_zone_sn, strSensorZoneNos);
            ArrayList arrDatas = joinManager.JoinSensorZoneEquipmentZoneZoneBuildingBuildingGroup(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return false;

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-4;i+=5)
            {
                if (arrDatas[i] is Base.Model.Sensor.SensorZone &&
                    arrDatas[i + 1] is EquipmentZone &&
                    arrDatas[i + 2] is Zone &&
                    (arrDatas[i + 3] == null || arrDatas[i + 3] is Building) &&
                    (arrDatas[i + 4] == null || arrDatas[i + 4] is BuildingGroup))
                {
                    var sensorZone = (Base.Model.Sensor.SensorZone)arrDatas[i];
                    EquipmentZone equipZone = (EquipmentZone)arrDatas[i + 1];
                    Zone zone = (Zone)arrDatas[i + 2];
                    Building building = (Building)arrDatas[i + 3];
                    BuildingGroup buildingGroup = (BuildingGroup)arrDatas[i + 4];

                    string strLocation = "";

                    if (buildingGroup == null || building == null)
                        strLocation = zone.disp_text + " > " + equipZone.disp_text;
                    else
                        strLocation = buildingGroup.disp_text + " > " + building.disp_text + " > " + zone.disp_text + " > " + equipZone.disp_text;

                    dicSensorZoneLocationNames[sensorZone.sensor_zone_sn] = strLocation;
                }
            }

            return true;
        }
    }
}
