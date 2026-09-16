namespace DCOP.BLL.Models.Request
{
    public class RequestSensorList
    {
        private int m_nDataCenterNo = 0;

        public int DataCenterNo
        {
            get { return m_nDataCenterNo; }
            set { m_nDataCenterNo = value; }
        }
    }
}
