using dnsData.CommonCode;
using System.Collections.Generic;

namespace Base.SDMS.IBLL.Request
{
    using Models;

    public class RequestAlarmNotification
    {
        public static class SortTypeCode
        {
            public const int DetectType = 0;
            public const int NotificationName = 1;
            public const int SensorTypeName = 2;
            public const int IsActive = 3;
            public const int NotificationNo = 4;
        }

        public class SearchTextType
        {
            private bool m_useDetectType = true;
            private bool m_useNotificationName = true;
            private bool m_useSensorType = true;
            private bool m_useReceiver = true;
            private bool m_useActivate = false;

            private List<string> m_detectTypes = new List<string>();
            private string m_activateText = null;
            private string m_inactivateText = null;

            public bool UseDetectType
            {
                get { return m_useDetectType; }
                set { m_useDetectType = value; }
            }

            public bool UseNotificationName
            {
                get { return m_useNotificationName; }
                set { m_useNotificationName = value; }
            }

            public bool UseSensorType
            {
                get { return m_useSensorType; }
                set { m_useSensorType = value; }
            }

            public bool UseReceiver
            {
                get { return m_useReceiver; }
                set { m_useReceiver = value; }
            }

            public bool UseActivate
            {
                get { return m_useActivate; }
                set { m_useActivate = value; }
            }

            // DetectType No + "_" + DetectType String
            // 예 : 300400_신호탐지, 300401_재난신고
            public List<string> DetectTypes
            {
                get { return m_detectTypes; }
                set { m_detectTypes = value; }
            }

            public string ActivateText
            {
                get { return m_activateText; }
                set { m_activateText = value; }
            }

            public string InactivateText
            {
                get { return m_inactivateText; }
                set { m_inactivateText = value; }
            }
        }

        private int m_nSensorType = SdmsSensor.SensorType.None;
        private int? m_sensorSubType = null;
        private int? m_buildingGroupNo = null;
        private int? m_buildingNo = null;
        private int? m_zoneNo = null;
        private int m_nMessageType = SdmsSensor.NotificationType.None;
        private int m_nDetectType = SdmsSensor.DetectType.None;
        private bool? m_active = null;
        private SearchTextType m_searchTextTypes = null;
        private string m_strSearchText = null;
        private int? m_pageIndex = null;
        private int? m_pageItemCount = null;
        private List<SensorTypeData> m_sensorTypeDatas = null;
        private int? m_sortType = null;
        private bool m_sortMethod = true;

        public int SensorType
        {
            get { return m_nSensorType; }
            set { m_nSensorType = value; }
        }

        public int? SensorSubType
        {
            get { return m_sensorSubType; }
            set { m_sensorSubType = value; }
        }

        public int? BuildingGroupNo
        {
            get { return m_buildingGroupNo; }
            set { m_buildingGroupNo = value; }
        }

        public int? BuildingNo
        {
            get { return m_buildingNo; }
            set { m_buildingNo = value; }
        }

        public int? ZoneNo
        {
            get { return m_zoneNo; }
            set { m_zoneNo = value; }
        }

        public int MessageType
        {
            get { return m_nMessageType; }
            set { m_nMessageType = value; }
        }

        public int DetectType
        {
            get { return m_nDetectType; }
            set { m_nDetectType = value; }
        }

        public bool? IsActive
        {
            get { return m_active; }
            set { m_active = value; }
        }

        public SearchTextType SearchTextTypes
        {
            get { return m_searchTextTypes; }
            set { m_searchTextTypes = value; }
        }

        public string SearchText
        {
            get { return m_strSearchText; }
            set { m_strSearchText = value; }
        }

        public int? PageIndex
        {
            get { return m_pageIndex; }
            set { m_pageIndex = value; }
        }

        public int? PageItemCount
        {
            get { return m_pageItemCount; }
            set { m_pageItemCount = value; }
        }

        public List<SensorTypeData> SensorTypeDatas
        {
            get { return m_sensorTypeDatas; }
            set { m_sensorTypeDatas = value; }
        }

        // sortType : 정렬 기준 컬럼 선택값
        public int? SortType
        {
            get { return m_sortType; }
            set { m_sortType = value; }
        }

        // sortMethod : 정렬 방향(true=ASC, false=DESC)
        public bool SortMethod
        {
            get { return m_sortMethod; }
            set { m_sortMethod = value; }
        }
    }
}