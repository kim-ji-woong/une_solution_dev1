 using Microsoft.AspNetCore.Mvc;
using SoulbrainWebAPIServer.Managers;
using SoulbrainWebAPIServer.Managers.UniAETAPIManagers;
using SoulbrainWebAPIServer.Model.UniAETModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace SoulbrainWebAPIServer.Controllers
{
    /// <summary>
    /// UniAET APIs
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class UniAETController : ControllerBase
    {
        private ProcessManager m_processManager = null;

        public UniAETController(ProcessManager processManager)
        {
            m_processManager = processManager;
        }

        /// <summary>
        /// 설비 계측 데이터 수신
        /// </summary>
        /// <returns>처리 결과</returns>
        /// <response resultCode="202">성공</response>
        /// <response resultCode="400">잘못된 요청</response>
        /// <response resultCode="500">서버 내부 오류</response>
        [HttpPost]
        [Route("/dt/pm/ingest")]
        [ProducesResponseType(typeof(ResponseUniAET), (int)ResponseUniAET.HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public IActionResult RequestFcltyIngest([FromBody] RequestIngest req)
        {
            ResponseUniAET result = m_processManager.ReadIngestData(req);
            return Ok(result);
        }

        /// <summary>
        /// 설비 분석 데이터 수신
        /// </summary>
        /// <returns>처리 결과</returns>
        /// <response resultCode="202">성공</response>
        /// <response resultCode="400">잘못된 요청</response>
        /// <response resultCode="500">서버 내부 오류</response>
        [HttpPost]
        [Route("/dt/pm/analysis")]
        [ProducesResponseType(typeof(ResponseUniAET), (int)ResponseUniAET.HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public IActionResult RequestFcltyAnalysis([FromBody] RequestFcltyAnalysis req)
        {
            ResponseUniAET result = m_processManager.ReadFcltyAnalysisData(req);
            return Ok(result);
        }

        /// <summary>
        /// 설비 알람 데이터 수신
        /// </summary>
        /// <returns>처리 결과</returns>
        /// <response resultCode="202">성공</response>
        /// <response resultCode="400">잘못된 요청</response>
        /// <response resultCode="500">서버 내부 오류</response>
        [HttpPost]
        [Route("/dt/pm/alert")]
        [ProducesResponseType(typeof(ResponseUniAET), (int)ResponseUniAET.HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public IActionResult RequestFcltyAlert([FromBody] RequestFcltyAnalysis req)
        {
            ResponseUniAET result = m_processManager.RequestAlert(req, UniAETManager.SENSOR_SUB_TYPE_PRESV_REAL);
            return Ok(result);
        }






        /// <summary>
        /// 전력 계측 데이터 수신
        /// </summary>
        /// <returns>처리 결과</returns>
        /// <response resultCode="202">성공</response>
        /// <response resultCode="400">잘못된 요청</response>
        /// <response resultCode="500">서버 내부 오류</response>
        [HttpPost]
        [Route("/dt/power/ingest")]
        [ProducesResponseType(typeof(ResponseUniAET), (int)ResponseUniAET.HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public IActionResult RequestPowerIngest([FromBody] RequestIngest req)
        {
            ResponseUniAET result = m_processManager.ReadIngestData(req);
            return Ok(result);
        }

        /// <summary>
        /// 전력 계측 하루 분석 데이터 수신
        /// </summary>
        /// <returns>처리 결과</returns>
        /// <response resultCode="202">성공</response>
        /// <response resultCode="400">잘못된 요청</response>
        /// <response resultCode="500">서버 내부 오류</response>
        [HttpPost]
        [Route("/dt/power/analysis")]
        [ProducesResponseType(typeof(ResponseUniAET), (int)ResponseUniAET.HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public IActionResult RequestPowerAnalysis([FromBody] RequestPowerAnalysis req)
        {
            ResponseUniAET result = m_processManager.ReadPowerAnalysis(req);
            return Ok(result);
        }

        /// <summary>
        /// 전력 사용량 분석 예측으로 임계치 초과 15분 전 알람 데이터 수신
        /// </summary>
        /// <returns>처리 결과</returns>
        /// <response resultCode="202">성공</response>
        /// <response resultCode="400">잘못된 요청</response>
        /// <response resultCode="500">서버 내부 오류</response>
        [HttpPost]
        [Route("/dt/power/alert/anaysis")]
        [ProducesResponseType(typeof(ResponseUniAET), (int)ResponseUniAET.HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public IActionResult RequestPowerAlert([FromBody] RequestFcltyAnalysis req)
        {
            ResponseUniAET result = m_processManager.RequestAlert(req, UniAETManager.SENSOR_SUB_TYPE_POWER_ANALYS);
            return Ok(result);
        }

        /// <summary>
        /// 전력 사용량 임계치 초과 알람 데이터 수신
        /// </summary>
        /// <returns>처리 결과</returns>
        /// <response resultCode="202">성공</response>
        /// <response resultCode="400">잘못된 요청</response>
        /// <response resultCode="500">서버 내부 오류</response>
        [HttpPost]
        [Route("/dt/power/alert/live")]
        [ProducesResponseType(typeof(ResponseUniAET), (int)ResponseUniAET.HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public IActionResult RequestPowerLive([FromBody] RequestFcltyAnalysis req)
        {
            ResponseUniAET result = m_processManager.RequestAlert(req, UniAETManager.SENSOR_SUB_TYPE_POWER_REAL);
            return Ok(result);
        }



        /// <summary>
        /// 전력사용량 계측 데이터 15분 간격 수신
        /// </summary>
        /// <returns>처리 결과</returns>
        /// <response resultCode="202">성공</response>
        /// <response resultCode="400">잘못된 요청</response>
        /// <response resultCode="500">서버 내부 오류</response>
        [HttpPost]
        [Route("/dt/power/analysis/diff")]
        [ProducesResponseType(typeof(ResponseUniAET), (int)ResponseUniAET.HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        [ProducesResponseType((int)HttpStatusCode.InternalServerError)]
        public IActionResult RequestPowerIngestDiff([FromBody] RequestIngest req)
        {
            ResponseUniAET result = m_processManager.ReadIngestData(req, true);
            return Ok(result);
        }
    }
}
