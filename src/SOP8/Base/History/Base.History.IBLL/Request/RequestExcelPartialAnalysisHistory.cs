using System.Collections.Generic;

namespace Base.History.IBLL.Request
{
    using Models.History;
    using Response;

    public class RequestExcelPartialAnalysisHistory : RequestExcelAnalysisHistory
    {
        private List<SensorAnalysisHistory> m_histories = new List<SensorAnalysisHistory>();

        public List<SensorAnalysisHistory> Histories
        {
            get { return m_histories; }
            set { m_histories = value; }
        }

        public RequestExcelPartialAnalysisHistory()
        {
        }

        public RequestExcelPartialAnalysisHistory(RequestExcelAnalysisHistory data)
        {
            this.BeginYear = data.BeginYear;
            this.BeginMonth = data.BeginMonth;
            this.BeginDay = data.BeginDay;
            this.EndYear = data.EndYear;
            this.EndMonth = data.EndMonth;
            this.EndDay = data.EndDay;
            this.BuildingGroupNo = data.BuildingGroupNo;
            this.BuildingNo = data.BuildingNo;
            this.ZoneNo = data.ZoneNo;
            this.SensorNo = data.SensorNo;
            this.SensorType = data.SensorType;
            this.SensorSubTypes = data.SensorSubTypes;
            this.SensorTypeDatas = data.SensorTypeDatas;
            this.UseSensorTypeName = data.UseSensorTypeName;
            this.UseSensorName = data.UseSensorName;
            this.UseLocationName = data.UseLocationName;
            this.UseDetectCount = data.UseDetectCount;
            this.UseSensorClearCount = data.UseSensorClearCount;
            this.UseMalfunctionCount = data.UseMalfunctionCount;
            this.UseUserResetCount = data.UseUserResetCount;
            this.UseMalfunctionRatio = data.UseMalfunctionRatio;
            this.SubjectName = data.SubjectName;
    }
    }
}
