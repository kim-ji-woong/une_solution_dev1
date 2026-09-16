using System;
using System.Collections.Generic;

namespace Base.History.IBLL.Models.SOP
{
    public class SOPHistoryData
    {
        private int m_nRowNo = -1;
        private int? m_nSensorZoneHistoryNo = null;
        private int m_nActionStepHistoryNo = -1;
        private int? m_nLastAccessedUserNo = null;
        private string m_strDisasterCategoryName = "";
        private string m_strSopName = "";
        private string m_strActionStepName = "";
        private string m_strSensorName = null;
        private string m_strPosition = "";
        private DateTime m_beginTime = new DateTime();
        private DateTime? m_endTime = null;
        private string m_strUserName = null;
        private List<int> m_allSensorZoneNos = null;

        public int RowNo
        {
            get { return m_nRowNo; }
            set { m_nRowNo = value; }
        }

        public int? SensorZoneHistoryNo
        {
            get { return m_nSensorZoneHistoryNo; }
            set { m_nSensorZoneHistoryNo = value; }
        }

        public int ActionStepHistoryNo
        {
            get { return m_nActionStepHistoryNo; }
            set { m_nActionStepHistoryNo = value; }
        }

        public int? LastAccessedUserNo
        {
            get { return m_nLastAccessedUserNo; }
            set { m_nLastAccessedUserNo = value; }
        }

        public string DisasterCategoryName
        {
            get { return m_strDisasterCategoryName; }
            set { m_strDisasterCategoryName = value; }
        }

        public string SopName
        {
            get { return m_strSopName; }
            set { m_strSopName = value; }
        }

        public string ActionStepName
        {
            get { return m_strActionStepName; }
            set { m_strActionStepName = value; }
        }

        public string SensorName
        {
            get { return m_strSensorName; }
            set { m_strSensorName = value; }
        }
        
        public string Position
        {
            get { return m_strPosition; }
            set { m_strPosition = value; }
        }

        public DateTime BeginTime
        {
            get { return m_beginTime; }
            set { m_beginTime = value; }
        }

        public DateTime? EndTime
        {
            get { return m_endTime; }
            set { m_endTime = value; }
        }

        public string UserName
        {
            get { return m_strUserName; }
            set { m_strUserName = value; }
        }

        public List<int> AllSensorZoneNos
        {
            get { return m_allSensorZoneNos; }
            set { m_allSensorZoneNos = value; }
        }
    }
}
