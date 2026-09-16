using Microsoft.AspNetCore.Mvc;
using Base.SOPManager.IBLL;
using Base.SOPManager.IBLL.Request;
using Base.SOPManager.IBLL.Response;
using System.Text;
using Response;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace Base.Controller
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SOPController : ControllerBase
    {
        private IProcessManager m_processManager = null;

        public SOPController(IProcessManager processManager)
        {
            m_processManager = processManager;
        }

        /// <summary>
        /// 전체 SOP 목록을 얻어온다.
        /// 각 SOP의 상세 내용도 같이 받아온다.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult DisasterCategories([FromBody] RequestDisasterCategories data)
        {
            ResponseDisasterCategories response = m_processManager.RequestDisasterCategories(data.site_sn, data.IsNormal);
            return Ok(response);
        }

        /// <summary>
        /// 전체 SOP 목록을 얻어온다.
        /// 각 SOP의 상세 내용은 제외하고 ActionStep 까지만 가져온다.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult DisasterCategoryList([FromBody] RequestDisasterCategories data)
        {
            ResponseDisasterCategories response = m_processManager.RequestDisasterCategories(data.site_sn, data.IsNormal);
            return Ok(response);
        }

        /// <summary>
        /// 표준 ActionStep 이름 목록을 얻어온다.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult Default([FromBody] RequestDefault data)
        {
            if (data.RequestActionSteps)
                return Ok(m_processManager.RequestDefaultActionStepDatas(data.site_sn));

            return BadRequest();
        }

        /// <summary>
        /// 표준 ActionStep 이름 목록을 얻어온다.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult DefaultStepMemberData([FromBody] RequestDefaultStepMember data)
        {
            ResponseStepMemberData response = m_processManager.RequestDefaultStepMemberData(data.ActionStepNo);
            return Ok(response);
        }

        /// <summary>
        /// 특정 재난번호(SOP 번호)를 사용하여 해당 SOP에 대한 전체 버전정보를 얻어온다.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult DisasterVersions([FromBody] RequestDisasterVersions data)
        {
            ResponseDisasterVersions response = m_processManager.RequestDisasterVersions(data.DisasterNo);
            return Ok(response);
        }

        /// <summary>
        /// DB 또는 XML 파일형태로 SOP를 저장한다.
        /// </summary>
        /// <param name="data">
        /// data.Target이 0이면 DB로 저장한다.
        /// data.Target이 1이면 XML로 저장한다.
        /// </param>
        [HttpPost]
        public IActionResult Save([FromBody] RequestSave data)
        {
            if (data.Target == (int)RequestData.ContentsType.DB)
            {
                ResponseSave result = m_processManager.SaveDB(data.user_sn, data.SOPData);
                return Ok(result);
            }
            else if (data.Target == (int)RequestData.ContentsType.XML)
            {
                ResponseSave result = m_processManager.SaveXML(data.SOPData);

                if (result.Success == false)
                    return Ok(result);

                return File(MakeBytes(result.XMLData), "text/xml", result.XMLFileName);
            }

            return BadRequest();
        }

        [HttpPost]
        public IActionResult Open([FromBody] RequestOpen data)
        {
            if (data.Target == (int)RequestData.ContentsType.DB)
            {
                ResponseOpen result = m_processManager.OpenDB(data.DisasterNo);
                return Ok(result);
            }

            return BadRequest();
        }

        [HttpPost]
        public IActionResult OpenAll([FromBody] RequestOpenAll data)
        {
            ResponseOpenAll result = m_processManager.OpenAll(data.SiteNo);
            return Ok(result);
        }

        [HttpPost]
        public IActionResult OpenXML(List<IFormFile> files)
        {
            if (files != null && files.Count > 0)
            {
                int siteNo;

                if (int.TryParse(files[0].FileName, out siteNo) == false)
                    return Ok(new ResponseOpen(false, "SiteNo가 설정되어 있지 않습니다."));

                byte[] bytes = null;

                using (var fileStream = files[0].OpenReadStream())
                {
                    using (var stream = new System.IO.MemoryStream())
                    {
                        fileStream.CopyTo(stream);
                        bytes = stream.ToArray();
                    }
                }

                string strXML = Encoding.UTF8.GetString(bytes, 0, bytes.Length);

                ResponseOpen result = m_processManager.OpenXML(strXML, siteNo);
                return Ok(result);
            }
            
            return BadRequest();
        }

        private static byte[] MakeBytes(string data)
        {
            UTF8Encoding enc = new UTF8Encoding();
            return enc.GetBytes(data);
        }

        [HttpPost]
        public IActionResult Delete([FromBody] RequestDelete data)
        {
            MessageResult response = m_processManager.Delete(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult ParseSpecialMessage([FromBody] RequestParseSpecialMessage data)
        {
            ResponseParseSpecialMessage response = m_processManager.ParseSpecialMessage(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult SpecialMessageList()
        {
            ResponseSpecialMessageList response = m_processManager.GetSpecialMessageList();
            return Ok(response);
        }

        [HttpPost]
        public IActionResult LinkedSOPs([FromBody] RequestLinkedSOP data)
        {
            ResponseLinkedSOPs response = m_processManager.GetLinkedSOPs(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult SaveLinkedSOPs([FromBody] SaveLinkedSOPs data)
        {
            MessageResult response = m_processManager.SaveLinkedSOPs(data);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult LoadLinkedSopVersions([FromBody] RequestLoadLinkedSopVersions data)
        {
            ResponseLoadLinkedSopVersions response = m_processManager.LoadLinkedSopVersions(data.SiteNo, data.VersionNos);
            return Ok(response);
        }

        [HttpPost]
        public IActionResult CheckSectionData([FromBody] CheckSectionData data)
        {
            MessageResult response = m_processManager.CheckSectionData(data);
            return Ok(response);
        }
    }
}
