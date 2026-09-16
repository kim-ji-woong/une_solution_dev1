using System.Net;
using Microsoft.AspNetCore.Mvc;
using SoulbrainWebAPIServer.Managers;
using SoulbrainWebAPIServer.Model;
using SoulbrainWebAPIServer.Model.HanbitModels;
using RequestData = SoulbrainWebAPIServer.Model.HanbitModels.RequestData;

namespace SoulbrainWebAPIServer.Controllers
{
    /// <summary>
    /// Hanbit APIs
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class HanbitController : ControllerBase
    {
        private ProcessManager m_processManager = null;

        public HanbitController(ProcessManager processManager)
        {
            m_processManager = processManager;
        }
        
        /// <summary>
        /// 스캐너 내 태그 수, 정보 요청
        /// </summary>
        /// <param name="scanner">스캐너내의 태그 수, 목록</param>
        /// <returns>처리 결과</returns>
        /// <response code="200">성공</response>
        /// <response code="400">잘못된 요청</response>
        /// <response code="500">서버 내부 오류</response>
        [HttpPost]
        [Route("/tag/info")]
        [ProducesResponseType(typeof(HanbitResponse), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public IActionResult RequestTagInfo([FromBody] RequestData.RequestScannerTagInfo scanner)
        {
            HanbitResponse result = m_processManager.ProcessHanbitCurrentTagData(scanner);
            return Ok(result);
        }

        /// <summary>
        /// 스캐너 내 태그 수, 정보 요청
        /// </summary>
        /// <param name="unauth">비인가 태그 알람 신호</param>
        /// <returns>처리 결과</returns>
        /// <response code="200">성공</response>
        /// <response code="400">잘못된 요청</response>
        /// <response code="500">서버 내부 오류</response>
        [HttpPost]
        [Route("/tag/unauth")]
        [ProducesResponseType(typeof(HanbitResponse), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public IActionResult RequestUnauthTagInfo([FromBody] RequestData.RequestUnauthTagSignal unauth)
        {
            HanbitResponse result = m_processManager.ProcessHanbitUnauthData(unauth);
            return Ok(result);
        }
        
        /// <summary>
        /// 태그 비상 신호 요청
        /// </summary>
        /// <param name="sosSignal">태그 비상 알람 신호</param>
        /// <returns>처리 결과</returns>
        /// <response code="200">성공</response>
        /// <response code="400">잘못된 요청</response>
        /// <response code="500">서버 내부 오류</response>
        [HttpPost]
        [Route("/tag/sos")]
        [ProducesResponseType(typeof(HanbitResponse), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public IActionResult RequestSosSignal([FromBody] RequestData.RequestSosSignal sosSignal)
        {
            HanbitResponse result = m_processManager.ProcessHanbitSosSignalData(sosSignal);
            return Ok(result);
        }
    }
}