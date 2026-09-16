using Microsoft.AspNetCore.Mvc;
using Base.TeamEditor.IBLL;
using Base.TeamEditor.IBLL.Request;
using Base.TeamEditor.IBLL.Response;
using Response;
using dnsExcelReport.Models;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace Base.Controller
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TeamEditorController : ControllerBase
    {
        private IProcessManager m_processManager = null;

        public TeamEditorController(IProcessManager processManager)
        {
            m_processManager = processManager;
        }

        [HttpPost]
        public IActionResult DisplayRegular([FromBody] DisplayRegular data)
        {
            ResponseDisplayRegular response = m_processManager.LoadRegulars(data.site_sn);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult DisplayRegularMember([FromBody] DisplayRegularMember data)
        {
            ResponseDisplayRegularMember response = m_processManager.LoadRegularMembers(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult DisplayTemporary([FromBody] DisplayTemporary param)
        {
            ResponseDisplayTemporary response = m_processManager.LoadTemporaries(param.IsNormal, param.site_sn);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult DisplayTemporaryMember([FromBody] DisplayTemporaryMember data)
        {
            ResponseDisplayTemporaryMember response = m_processManager.DisplayTemporaryMember(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult RequestTemporaryMembers()
        {
            ResponseTemporaryMembers response = m_processManager.LoadTemporaryMembers();
            return Ok(response);
        }

        [HttpPost]
        public IActionResult SaveUpdateData([FromBody] RequestSaveUpdateData data)
        {
            MessageResult response = m_processManager.SaveUpdateData(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult GetJobLevels()
        {
            ResponseJobLevels response = m_processManager.LoadJobLevel();
            return Ok(response);
        }

        [HttpPost]
        public IActionResult GetJobPositions()
        {
            ResponseJobPositions response = m_processManager.LoadJobPosition();
            return Ok(response);
        }

        [HttpPost]
        public IActionResult UpdateRegularMember([FromBody] RequestUpdateRegularMember data)
        {
            ResponseUpdateRegularMember response = m_processManager.UpdateRegularMember(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult RemoveRegularMembers([FromBody] RequestRemoveRegularMember data)
        {
            MessageResult response = m_processManager.RemoveRegularMembers(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult UpdateTemporaryMember([FromBody] RequestUpdateTemporaryMember data)
        {
            ResponseUpdateTemporaryMember response = m_processManager.UpdateTemporaryMember(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult RemoveTemporaryMembers([FromBody] RequestRemoveTemporaryMember data)
        {
            MessageResult response = m_processManager.RemoveTemporaryMembers(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult UpdateRegularTeam([FromBody] RequestUpdateRegularTeam data)
        {
            ResponseUpdateRegularTeam response = m_processManager.UpdateRegularTeam(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult RemoveRegularTeams([FromBody] RequestRemoveRegularTeam data)
        {
            MessageResult response = m_processManager.RemoveRegularTeams(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult UpdateTemporaryTeam([FromBody] RequestUpdateTemporaryTeam data)
        {
            ResponseUpdateTemporaryTeam response = m_processManager.UpdateTemporaryTeam(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult RemoveTemporaryTeams([FromBody] RequestRemoveTemporaryTeam data)
        {
            MessageResult response = m_processManager.RemoveTemporaryTeams(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult GetTemporaryRoleList()
        {
            ResponseTemporaryRoleList response = m_processManager.LoadTemporaryRoleList();
            return Ok(response);
        }

        [HttpPost]
        public IActionResult DownloadRegularTeam([FromBody] RequestDownloadRegularTeam data)
        {
            ResponseExcelInfo response = m_processManager.DownloadExcelRegularTeam(data);

            if (response.Success == false || response.Bytes == null)
                return Ok(response);

            return File(response.Bytes, "application/vnd.ms-excel", response.FileName);
        }

        [HttpPost]
        public IActionResult UploadRegularTeam(IFormFile file, IFormFile fileData)
        {
            var filePath = Path.GetTempFileName();
            string strFilePath = "";

            if (file != null)
            {
                string strFileName = file.FileName;

                using (var stream = new FileStream(strFileName, FileMode.Create))
                {
                    file.CopyTo(stream);
                    strFilePath = stream.Name;
                }

                int? siteNo = null;
                int data;

                if (fileData != null && int.TryParse(fileData.FileName, out data))
                    siteNo = data;

                MessageResult result = m_processManager.UploadRegularTeam(strFilePath, siteNo);
                System.IO.File.Delete(strFilePath);

                return Ok(result);
            }

            return BadRequest();
        }
    }
}
