using System.Collections.Generic;

namespace Base.SOPManager.IBLL.Response
{
    using Models.Category;

    public class ResponseDisasterCategories : global::Response.MessageResult
    {
        private List<DisasterCategoryData> m_disasterCategoryDatas = new List<DisasterCategoryData>();

        public List<DisasterCategoryData> DisasterCategoryDatas
        {
            get { return m_disasterCategoryDatas; }
        }

        public ResponseDisasterCategories()
            : base()
        {
        }

        public ResponseDisasterCategories(bool success, string strMessage)
            : base(success, strMessage)
        {
        }
    }

    public class ResponseActionStepNames : global::Response.MessageResult
    {
        public List<string> ActionStepNames { get; set; }

        public ResponseActionStepNames()
            : base()
        {
        }

        public ResponseActionStepNames(bool success, string strMessage)
            : base(success, strMessage)
        {
        }
    }
}
