using System.Collections.Generic;

namespace Base.History.IBLL.Request
{
    using Models.History;

    // 선택 다운로드
    public class RequestExcelPartialDetectHistory : RequestExcelDetectHistory
    {
        private List<SensorDetectHistory> m_histories = new List<SensorDetectHistory>();

        public List<SensorDetectHistory> Histories
        {
            get { return m_histories; }
            set { m_histories = value; }
        }

        public RequestExcelPartialDetectHistory()
        {
        }

        public RequestExcelPartialDetectHistory(RequestExcelDetectHistory data)
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
            this.UseDetectStatus = data.UseDetectStatus;
            this.UseClearType = data.UseClearType;
            this.UseAlarmDepthName = data.UseAlarmDepthName;
            this.UseSopName = data.UseSopName;
            this.UseMemo = data.UseMemo;
            this.SubjectName = data.SubjectName;
        }
    }
}
