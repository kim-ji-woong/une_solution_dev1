using System.Collections.Generic;
using Response;

namespace Base.SOPManager.IBLL.Response
{
    public class ResponseLoadLinkedSopVersions : MessageResult
    {
        public List<int> LinkedSopNos { get; set; }

        public ResponseLoadLinkedSopVersions()
            : base()
        {
        }

        public ResponseLoadLinkedSopVersions(bool success, string strMessage)
            : base(success, strMessage)
        {
        }
    }
}
