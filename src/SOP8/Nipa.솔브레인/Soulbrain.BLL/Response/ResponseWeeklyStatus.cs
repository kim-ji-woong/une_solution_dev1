using System;
using System.Collections.Generic;
using Response;

namespace Soulbrain.BLL.Response
{
    public class ResponseWeeklyStatus : MessageResult
    {
        private List<AlarmInfo> m_alarmInfos = new List<AlarmInfo>();

        public List<AlarmInfo> AlarmInfos
        {
            get { return m_alarmInfos; }
            set { m_alarmInfos = value; }
        }

        public ResponseWeeklyStatus()
            : base()
        {
        }

        public ResponseWeeklyStatus(bool success, string message)
            : base(success, message)
        {
        }
    }

    public class AlarmInfo
    {
        private DateTime m_dtTime = new DateTime();
        private int? m_sensorNo = null;
        private int m_nSensorZoneNo = -1;
        private int m_nZoneNo = -1;
        private int? m_buildingNo = -1;
        private int? m_buildingGroupNo = -1;
        private int m_siteNo = -1;
        private int m_equipZoneNo = -1;
        private int m_nSensorTypeNo = -1;
        private int? m_sensorSubTypeNo = null;
        private bool m_isManual = false;

        public DateTime Time
        {
            get { return m_dtTime; }
            set { m_dtTime = value; }
        }

        public int? SensorNo
        {
            get { return m_sensorNo; }
            set { m_sensorNo = value; }
        }

        public int SensorZoneNo
        {
            get { return m_nSensorZoneNo; }
            set { m_nSensorZoneNo = value; }
        }

        public int ZoneNo
        {
            get { return m_nZoneNo; }
            set { m_nZoneNo = value; }
        }

        public int? BuildingNo
        {
            get { return m_buildingNo; }
            set { m_buildingNo = value; }
        }

        public int? BuildingGroupNo
        {
            get { return m_buildingGroupNo; }
            set { m_buildingGroupNo = value; }
        }

        public int SiteNo
        {
            get { return m_siteNo; }
            set { m_siteNo = value; }
        }

        public int EquipZoneNo
        {
            get { return m_equipZoneNo; }
            set { m_equipZoneNo = value; }
        }

        public int SensorTypeNo
        {
            get { return m_nSensorTypeNo; }
            set { m_nSensorTypeNo = value; }
        }

        public int? SensorSubTypeNo
        {
            get { return m_sensorSubTypeNo; }
            set { m_sensorSubTypeNo = value; }
        }

        public bool IsManual
        {
            get { return m_isManual; }
            set { m_isManual = value; }
        }
    }
}
