using System.Collections.Generic;
using Base.Model.Sop.Config;

namespace Base.SOPManager.IBLL.Request
{
    public class SaveLinkedSOPs
    {
        public int SiteNo { get; set; }
        public List<LinkedSop> LinkedSopDatas { get; set; }
    }
}
