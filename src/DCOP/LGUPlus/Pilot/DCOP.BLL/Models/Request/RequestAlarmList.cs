namespace DCOP.BLL.Models.Request
{
    public class RequestAlarmList
    {
        private int m_nDataCenterNo = -1;

        public int DataCenterNo
        {
            get { return m_nDataCenterNo; }
            set { m_nDataCenterNo = value; }
        }
    }
}
