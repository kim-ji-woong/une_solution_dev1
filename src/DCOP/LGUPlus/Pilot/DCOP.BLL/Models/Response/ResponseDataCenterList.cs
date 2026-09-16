using System.Collections.Generic;

namespace DCOP.BLL.Models.Response
{
    using Request;

    public class ResponseDataCenterList : MessageResult
    {
        private List<DataCenterData> m_datas = new List<DataCenterData>();

        public List<DataCenterData> Datas
        {
            get { return m_datas; }
            set { m_datas = value; }
        }

        public ResponseDataCenterList()
            : base()
        {
        }

        public ResponseDataCenterList(bool success, string message)
            : base(success, message)
        {
        }
    }
}
