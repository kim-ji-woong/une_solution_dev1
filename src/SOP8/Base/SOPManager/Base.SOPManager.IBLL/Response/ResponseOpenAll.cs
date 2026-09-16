using Response;
using System.Collections.Generic;

namespace Base.SOPManager.IBLL.Response
{
    using Models;

    public class ResponseOpenAll : MessageResult
    {
        private List<LargeClassData> m_largeClassDatas = new List<LargeClassData>();

        public List<LargeClassData> DisasterCategories
        {
            get { return m_largeClassDatas; }
            set { m_largeClassDatas = value; }
        }

        public ResponseOpenAll()
            : base()
        {
        }

        public ResponseOpenAll(bool success, string strMessage)
            : base(success, strMessage)
        {
        }
    }

    public class LargeClassData
    {
        private List<MiddleClassData> m_middleClassDatas = new List<MiddleClassData>();
        private string m_strName = "";
        private int m_nNo = -1;

        public List<MiddleClassData> SubDisasterCategories
        {
            get { return m_middleClassDatas; }
            set { m_middleClassDatas = value; }
        }

        public string Name
        {
            get { return m_strName; }
            set { m_strName = value; }
        }

        public int No
        {
            get { return m_nNo; }
            set { m_nNo = value; }
        }
    }

    public class MiddleClassData
    {
        private List<SOPData> m_sopDatas = new List<SOPData>();
        private string m_strName = "";
        private int m_nNo = -1;

        public List<SOPData> SopDatas
        {
            get { return m_sopDatas; }
            set { m_sopDatas = value; }
        }

        public string Name
        {
            get { return m_strName; }
            set { m_strName = value; }
        }

        public int No
        {
            get { return m_nNo; }
            set { m_nNo = value; }
        }
    }
}
