using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Soulbrain.BLL;
using Soulbrain.BLL.Request;
using dnsExcelReport.Models;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using System.IO;
using Response;

namespace WebSOPApp.Areas.Settings.Controllers
{
    [EnableCors("UnEPolicy")]
    [Route("Settings/[controller]/[action]")]
    [ApiController]
    public class SettingsController : Controller
    {
        private ProcessManager m_processManager = null;

        public SettingsController(IDataManager dataManager)
        {
            m_processManager = new ProcessManager(dataManager);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult DownloadFacilityData(RequestDownloadFacilityData data)
        {
            ResponseExcelInfo response = m_processManager.DownloadFacilityData(data);

            if (response.Success == false || response.Bytes == null)
                return Ok(response);

            return File(response.Bytes, "application/vnd.ms-excel", response.FileName);
        }

        [EnableCors("UnEPolicy")]
        [HttpPost]
        public IActionResult UploadFacilityData(List<IFormFile> files, string strSiteNo)
        {
            int? siteNo;
            string strFilePath = GetFilePath(files, strSiteNo, out siteNo);

            MessageResult result = m_processManager.UploadFacilityData(strFilePath, siteNo);
            System.IO.File.Delete(strFilePath);

            return Ok(result);
        }

        private string GetFilePath(List<IFormFile> files, string strSiteNo, out int? siteNo)
        {
            var filePath = Path.GetTempFileName();
            string strFileName = "";
            string strFilePath = "";

            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {
                    strFileName = files[0].FileName;

                    using (var stream = new FileStream(strFileName, FileMode.Create))
                    {
                        formFile.CopyTo(stream);
                        strFilePath = stream.Name;
                    }

                    if (strFilePath.Length > 0)
                        break;
                }
            }

            siteNo = null;

            if (strSiteNo != null)
            {
                int _siteNo;

                if (int.TryParse(strSiteNo.Trim(), out _siteNo))
                    siteNo = _siteNo;
            }

            return strFilePath;
        }
    }
}
