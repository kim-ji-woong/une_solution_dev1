using Response;
using System;
using System.Collections.Generic;
using System.Text;

namespace Kftc.BLL.Response
{

    public class ResponseParentList : MessageResult
    {
        public List<ParentListData> ParentList { get; set; }
    }

    public class ParentListData
    {
        public int ParentNo { get; set; }
        public string ParentName { get; set; }
        public string ZoneName { get; set; }
    }
}
