using dnsData;
using System;
using System.Collections.Generic;
using System.Text;

namespace Base.SDMS.IBLL.Models
{
    public class AlarmData
    {
        public class SensorZoneData
        {
            private int m_nSensorZoneNo = -1;
            private int m_nSensorNo = -1;
            private string m_strSensorName = "";

            public int SensorZoneNo
            {
                get { return m_nSensorZoneNo; }
                set { m_nSensorZoneNo = value; }
            }

            public int SensorNo
            {
                get { return m_nSensorNo; }
                set { m_nSensorNo = value; }
            }

            public string SensorName
            {
                get { return m_strSensorName; }
                set { m_strSensorName = value; }
            }
        }

        private DateTime m_dtTime = new DateTime();
        public DateTime dtTime
        {
            get { return m_dtTime; }
            set { m_dtTime = value; }
        }

        private string m_strDateTime = "";
        public string StrDateTime
        {
            get { return m_strDateTime; }
            set { m_strDateTime = value; }
        }

        private int? m_nSensorNo = -1;
        public int? SensorNo
        {
            get { return m_nSensorNo; }
            set { m_nSensorNo = value; }
        }

        private int m_nSensorZoneNo = -1;
        public int SensorZoneNo
        {
            get { return m_nSensorZoneNo; }
            set { m_nSensorZoneNo = value; }
        }

        private int m_nSensorZoneHistoryNo = -1;
        public int SensorZoneHistoryNo
        {
            get { return m_nSensorZoneHistoryNo; }
            set { m_nSensorZoneHistoryNo = value; }
        }

        private string m_strSensorName = "";
        public string SensorName
        {
            get { return m_strSensorName; }
            set { m_strSensorName = value; }
        }

        private string m_strPositionName = "";
        public string PositionName
        {
            get { return m_strPositionName; }
            set { m_strPositionName = value; }
        }

        private int? m_buildingNo = null;
        public int? BuildingNo
        {
            get { return m_buildingNo; }
            set { m_buildingNo = value; }
        }

        private string m_strBuildingName = "";
        public string BuildingName
        {
            get { return m_strBuildingName; }
            set { m_strBuildingName = value; }
        }

        private int? m_buildingGroupNo = null;
        public int? BuildingGroupNo
        {
            get { return m_buildingGroupNo; }
            set { m_buildingGroupNo = value; }
        }

        private string m_strBuildingGroupName = "";
        public string BuildingGroupName
        {
            get { return m_strBuildingGroupName; }
            set { m_strBuildingGroupName = value; }
        }

        private string m_strZoneName = "";
        public string ZoneName
        {
            get { return m_strZoneName; }
            set { m_strZoneName = value; }
        }

        private int m_nZoneNo = -1;
        public int ZoneNo
        {
            get { return m_nZoneNo; }
            set { m_nZoneNo = value; }
        }

        private int m_nEquipZoneNo = -1;
        public int EquipZoneNo
        {
            get { return m_nEquipZoneNo; }
            set { m_nEquipZoneNo = value; }
        }

        private int m_facilityType = dnsData.CommonCode.SdmsSensor.SensorType.None;
        public int FacilityType
        {
            get { return m_facilityType; }
            set { m_facilityType = value; }
        }

        private string m_strFacilityTypeName = "";
        public string FacilityTypeName
        {
            get { return m_strFacilityTypeName; }
            set { m_strFacilityTypeName = value; }
        }

        private int? m_sensorSubType = null;
        public int? SensorSubType
        {
            get { return m_sensorSubType; }
            set { m_sensorSubType = value; }
        }

        private string m_strSensorSubTypeName = "";
        public string SensorSubTypeName
        {
            get { return m_strSensorSubTypeName; }
            set { m_strSensorSubTypeName = value; }
        }

        private string m_strMessage = "";
        public string Message
        {
            get { return m_strMessage; }
            set { m_strMessage = value; }
        }

        private int m_nSopStatus = -1;
        public int SopStatus
        {
            get { return m_nSopStatus; }
            set { m_nSopStatus = value; }
        }

        private int m_AlarmDepth = -1;
        public int AlarmDepth
        {
            get { return m_AlarmDepth; }
            set { m_AlarmDepth = value; }
        }

        private List<SensorZoneData> m_sensorZones = new List<SensorZoneData>();
        public List<SensorZoneData> SensorZones
        {
            get { return m_sensorZones; }
            set { m_sensorZones = value; }
        }

        private string m_strReleaseInfo = "";
        public string ReleaseInfo
        {
            get { return m_strReleaseInfo; }
            set { m_strReleaseInfo = value; }
        }

        private bool m_bIsAlarm = true;
        public bool IsAlarm
        {
            get { return m_bIsAlarm; }
            set { m_bIsAlarm = value; }
        }

        private string m_strReportPerson = "";
        public string ReportPerson
        {
            get { return m_strReportPerson; }
            set { m_strReportPerson = value; }
        }

        private string m_strMemo = "";
        /// <summary>
        /// 수동신고 메모
        /// </summary>
        public string Memo
        {
            get { return m_strMemo; }
            set { m_strMemo = value; }
        }

        private string m_strAlarmMemo = "";
        /// <summary>
        /// 사용자가 입력한 알람 메모
        /// </summary>
        public string AlarmMemo
        {
            get { return m_strAlarmMemo; }
            set { m_strAlarmMemo = value; }
        }

        private int? m_nMaterialType = null;
        public int? MaterialType
        {
            get { return m_nMaterialType; }
            set { m_nMaterialType = value; }
        }

        private string m_strMaterialTypeString = "";
        public string MaterialTypeString
        {
            get { return m_strMaterialTypeString; }
            set { m_strMaterialTypeString = value; }
        }

        private int m_nSiteNo = -1;
        public int SiteNo
        {
            get { return m_nSiteNo; }
            set { m_nSiteNo = value; }
        }

        private string m_strETC = null;
        /// <summary>
        /// 기타 변수
        /// </summary>
        public string ETC
        {
            get { return m_strETC; }
            set { m_strETC = value; }
        }

        private int m_nReactionType = dnsData.CommonCode.History.ReactionType.None;
        public int ReactionType
        {
            get { return m_nReactionType; }
            set { m_nReactionType = value; }
        }

        private DateTime m_reactionTime = new DateTime();
        public DateTime ReactionTime
        {
            get { return m_reactionTime; }
            set { m_reactionTime = value; }
        }

        // 수동신고된 알람인가?
        private bool m_isManual = false;
        public bool IsManual
        {
            get { return m_isManual; }
            set { m_isManual = value; }
        }

        public object Clone()
        {
            AlarmData data = new AlarmData();
            Copy(this, data);

            return data;
        }

        public static void Copy(AlarmData src, AlarmData trg)
        {
            trg.m_dtTime = src.m_dtTime;
            trg.m_strDateTime = src.m_strDateTime;
            trg.m_nSensorNo = src.m_nSensorNo;
            trg.m_nSensorZoneNo = src.m_nSensorZoneNo;
            trg.m_nSensorZoneHistoryNo = src.m_nSensorZoneHistoryNo;
            trg.m_strSensorName = src.m_strSensorName;
            trg.m_strPositionName = src.m_strPositionName;
            trg.m_strZoneName = src.m_strZoneName;
            trg.m_nZoneNo = src.m_nZoneNo;
            trg.m_nEquipZoneNo = src.m_nEquipZoneNo;
            trg.m_facilityType = src.m_facilityType;
            trg.m_strFacilityTypeName = src.m_strFacilityTypeName;
            trg.m_sensorSubType = src.m_sensorSubType;
            trg.m_strSensorSubTypeName = src.m_strSensorSubTypeName;
            trg.m_strMessage = src.m_strMessage;
            trg.m_nSopStatus = src.m_nSopStatus;
            trg.m_AlarmDepth = src.m_AlarmDepth;
            trg.m_sensorZones = src.m_sensorZones;
            trg.m_strReleaseInfo = src.m_strReleaseInfo;
            trg.m_bIsAlarm = src.m_bIsAlarm;
            trg.m_strReportPerson = src.m_strReportPerson;
            trg.m_strMemo = src.m_strMemo;
            trg.m_nMaterialType = src.m_nMaterialType;
            trg.m_strMaterialTypeString = src.m_strMaterialTypeString;
            trg.SiteNo = src.SiteNo;
            trg.AlarmMemo = src.AlarmMemo;
            trg.ETC = src.ETC;
            trg.BuildingGroupName = src.BuildingGroupName;
            trg.BuildingGroupNo = src.BuildingGroupNo;
            trg.BuildingName = src.BuildingName;
            trg.BuildingNo = src.BuildingNo;
            trg.ReactionType = src.ReactionType;
            trg.ReactionTime = src.ReactionTime;
            trg.IsManual = src.IsManual;
        }
    }
}
