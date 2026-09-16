using System.Collections.Generic;
using DCOP.Model;

namespace DCOP.BLL.Models.Request
{
    public class RequestDataMain
    {
        private bool? m_requestDataCenterList = null;

        public bool? RequestDataCenterList
        {
            get { return m_requestDataCenterList; }
            set { m_requestDataCenterList = value; }
        }
    }

    public class DataCenterData
    {
        private Region m_region = null;
        private List<DataCenter> m_dataCenters = new List<DataCenter>();

        public Region Region
        {
            get { return m_region; }
            set { m_region = value; }
        }

        public List<DataCenter> DataCenters
        {
            get { return m_dataCenters; }
            set { m_dataCenters = value; }
        }
    }
}
