using System.Collections.Generic;
using Response;

namespace Base.SOPManager.IBLL.Response
{
    using Models.Category;

    public class ResponseActionStepDatas : MessageResult
    {
        private List<ActionStepData> m_actionStepDatas = new List<ActionStepData>();

        public List<ActionStepData> ActionStepDatas
        {
            get { return m_actionStepDatas; }
        }

        public ResponseActionStepDatas()
            : base()
        {
        }

        public ResponseActionStepDatas(bool success, string strMessage)
            : base(success, strMessage)
        {
        }
    }
}
