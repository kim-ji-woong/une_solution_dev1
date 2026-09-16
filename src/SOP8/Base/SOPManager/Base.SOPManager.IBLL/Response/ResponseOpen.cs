using Response;

namespace Base.SOPManager.IBLL.Response
{
    using Models;

    public class ResponseOpen : MessageResult
    {
        private SOPData m_sopData = null;

        public SOPData SOPData
        {
            get { return m_sopData; }
            set { m_sopData = value; }
        }

        public ResponseOpen()
            : base()
        {
        }

        public ResponseOpen(bool success, string strMessage)
            : base(success, strMessage)
        {
        }
    }
}
