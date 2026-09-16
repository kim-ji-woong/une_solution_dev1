using System;

namespace Base.SOPSimulator.IBLL.Request
{
    public class RequestExecuteSOP
    {
        private int m_nSmallClassNo = -1;
        private DateTime? m_beginTime = null;
        private int m_nActionStepNo = -1;
        private string m_strPosition = null;
        private int? m_lastAccessedUserNo = null;
        private int? m_sensorZoneHistoryNo = null;
        private DecisionValue m_decisionValue = null;

        public int SmallClassNo
        {
            get { return m_nSmallClassNo; }
            set { m_nSmallClassNo = value; }
        }

        public DateTime? BeginTime
        {
            get { return m_beginTime; }
            set { m_beginTime = value; }
        }

        public int ActionStepNo
        {
            get { return m_nActionStepNo; }
            set { m_nActionStepNo = value; }
        }

        public string Position
        {
            get { return m_strPosition; }
            set { m_strPosition = value; }
        }

        public int? LastAccessedUserNo
        {
            get { return m_lastAccessedUserNo; }
            set { m_lastAccessedUserNo = value; }
        }

        public int? SensorZoneHistoryNo
        {
            get { return m_sensorZoneHistoryNo; }
            set { m_sensorZoneHistoryNo = value; }
        }

        public DecisionValue DecisionValue
        {
            get { return m_decisionValue; }
            set { m_decisionValue = value; }
        }
    }
}
