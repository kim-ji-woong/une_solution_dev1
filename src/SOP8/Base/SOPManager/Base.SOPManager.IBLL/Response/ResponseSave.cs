using Base.Model.Sop.Category;
using Base.Model.Sop.Component;
using Response;

namespace Base.SOPManager.IBLL.Response
{
    using Models;

    public class ResponseSave : MessageResult
    {
        private SOPData m_sopData = null;
        private ActionStep m_errorActionStep = null;
        private Component m_errorSection = null;

        // XML 옵션
        private string m_strXMLData = "";
        private string m_strXMLFileName = "";

        public SOPData SOPData
        {
            get { return m_sopData; }
            set { m_sopData = value; }
        }

        public string XMLData
        {
            get { return m_strXMLData; }
            set { m_strXMLData = value; }
        }

        public string XMLFileName
        {
            get { return m_strXMLFileName; }
            set { m_strXMLFileName = value; }
        }

        // 문제가 발생한 Section
        public Component ErrorSection
        {
            get { return m_errorSection; }
            set { m_errorSection = value; }
        }

        // 문제가 발생한 ActionStep
        public ActionStep ErrorActionStep
        {
            get { return m_errorActionStep; }
            set { m_errorActionStep = value; }
        }

        public ResponseSave()
            : base()
        {
        }

        public ResponseSave(bool success, string message)
            : base(success, message)
        {
        }
    }
}
