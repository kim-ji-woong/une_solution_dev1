using Common.BLL.Models.Response;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebSOPApp.Areas.Commons.Controllers
{
    [Area("Commons")]
    public class CommonsController : ControllerBase
    {
        private global::Common.BLL.ProcessManager m_commonProcessManager = null;
        public CommonsController(global::SOPManager.IDAL.IDataManager sopDataManager, global::Common.IDAL.IDataManager commonDataManager, global::TeamEditor.IDAL.IDataManager teamDataManager)
        {
            m_commonProcessManager = new global::Common.BLL.ProcessManager(commonDataManager, sopDataManager, teamDataManager, null);
        }

        [HttpPost]
        public IActionResult RequestGetSiteNo()
        {
            ResponseSite sites = m_commonProcessManager.GetLoadManager().GetSites();
            return Ok(sites);
        }
    }
}
