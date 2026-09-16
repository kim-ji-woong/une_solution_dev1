using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.SOPSimulator.IBLL;
using Base.SOPSimulator.IBLL.Request;
using SOPWebServer.Models;

namespace SOPWebServer.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class PohangExternalController : ControllerBase
    {
        private readonly IProcessManager m_sopSimulatorProcessManager;
        private readonly IDataManager m_dataManager;
        private readonly ILogger<PohangExternalController> m_logger;

        public PohangExternalController(IProcessManager sopSimulatorProcessManager, IDataManager dataManager, ILogger<PohangExternalController> logger)
        {
            m_sopSimulatorProcessManager = sopSimulatorProcessManager;
            m_dataManager = dataManager;
            m_logger = logger;
        }

        [HttpPost]
        public IActionResult RunSop([FromBody] RequestExternalRunSop data)
        {
            if (data == null)
                return BadRequest();

            try
            {
                // IP 화이트리스트 검사
                IPAddress remoteAddr = HttpContext.Connection.RemoteIpAddress;
                string remoteIp;
                if (remoteAddr == null)
                    remoteIp = string.Empty;
                else if (remoteAddr.IsIPv4MappedToIPv6)
                    remoteIp = remoteAddr.MapToIPv4().ToString();
                else
                    remoteIp = remoteAddr.ToString();

                string[] allowedIps = Startup.ConfigManager.ExternalAccess.AllowedIps;
                bool isAllowed = Array.IndexOf(allowedIps, remoteIp) >= 0;

                if (!isAllowed)
                {
                    m_logger.LogWarning("IP 접근 거부: remoteIp={RemoteIp}", remoteIp);
                    return StatusCode(403, new ResponseExternalRunSop
                    {
                        Success = false,
                        Message = "Forbidden"
                    });
                }

                // SclasSn 설정값 검사
                int sclasSn = Startup.ConfigManager.ExternalSop.SclasSn;

                if (sclasSn <= 0)
                {
                    m_logger.LogWarning("SOP 미설정: sclasSn={SclasSn}, remoteIp={RemoteIp}", sclasSn, remoteIp);
                    return Ok(new ResponseExternalRunSop
                    {
                        Success = false,
                        Message = "SOP not configured."
                    });
                }

                // alarmLevel 범위 검사
                if (data.AlarmLevel < 1 || data.AlarmLevel > 4)
                {
                    m_logger.LogWarning("alarmLevel 범위 오류: alarmLevel={AlarmLevel}, remoteIp={RemoteIp}", data.AlarmLevel, remoteIp);
                    return Ok(new ResponseExternalRunSop
                    {
                        Success = false,
                        Message = "Invalid alarmLevel."
                    });
                }

                // alarmLevel → levelName 매핑
                string levelName;
                switch (data.AlarmLevel)
                {
                    case 1: levelName = "관심"; break;
                    case 2: levelName = "주의"; break;
                    case 3: levelName = "경계"; break;
                    default: levelName = "심각"; break;
                }

                // so_ctgry_action_step에서 actionStepSn 조회
                string strErr;
                string actionStepCondition = string.Format("{0} = {1} AND {2} = '{3}'",
                    Base.Model.Sop.Category.ActionStep.Fields.sclas_sn, sclasSn,
                    Base.Model.Sop.Category.ActionStep.Fields.action_step_name, levelName);

                Base.Model.Sop.Category.ActionStep actionStep =
                    m_dataManager.GetSelect().SelectFirst<Base.Model.Sop.Category.ActionStep>(actionStepCondition, out strErr);

                if (actionStep == null)
                {
                    m_logger.LogWarning("action step 미발견: sclasSn={SclasSn}, alarmLevel={AlarmLevel}, remoteIp={RemoteIp}", sclasSn, data.AlarmLevel, remoteIp);
                    return Ok(new ResponseExternalRunSop
                    {
                        Success = false,
                        Message = "Action step not found for level."
                    });
                }

                int actionStepSn = actionStep.action_step_sn;

                // position 기본값 처리
                string position = string.IsNullOrWhiteSpace(data.Position) ? "포항산단" : data.Position;

                // occurredAt 파싱(nullable) — {time} 치환에만 사용, SOP 시작시각은 항상 DateTime.Now
                DateTime? occurredAtValue = null;
                if (!string.IsNullOrEmpty(data.OccurredAt))
                {
                    DateTime parsedOccurredAt;
                    if (DateTime.TryParse(data.OccurredAt, out parsedOccurredAt))
                        occurredAtValue = parsedOccurredAt;
                }

                // dedup: 시간창 내 동일 신호(position·occurredAt 일치)만 retry로 차단
                // position·occurredAt은 SQL에 포함하지 않고 메모리에서 비교한다.
                int dedupWindowSec = Startup.ConfigManager.ExternalSop.DedupWindowSeconds;
                DateTime dedupThreshold = DateTime.Now.AddSeconds(-dedupWindowSec);
                string dedupCondition = string.Format("{0} = {1} AND {2} >= '{3}'",
                    Base.Model.History.ActionStep.Fields.action_step_sn,
                    actionStepSn,
                    Base.Model.History.ActionStep.Fields.begin_time,
                    dedupThreshold.ToString("yyyy-MM-dd HH:mm:ss"));

                string dedupErr;
                IEnumerable<Base.Model.History.ActionStep> recentHistories =
                    m_dataManager.GetSelect().Select<Base.Model.History.ActionStep>(dedupCondition, out dedupErr);

                if (recentHistories != null)
                {
                    bool isDuplicate = recentHistories.Any(r =>
                        string.Equals(r.lc, position, StringComparison.Ordinal)
                        && DateTimeEquals(r.detct_time, occurredAtValue));

                    if (isDuplicate)
                    {
                        m_logger.LogInformation("retry 중복 차단: actionStepSn={ActionStepSn}, position={Position}, occurredAt={OccurredAt}, window={Window}s",
                            actionStepSn, position, occurredAtValue?.ToString("yyyy-MM-dd HH:mm:ss") ?? "(null)", dedupWindowSec);
                        return Ok(new ResponseExternalRunSop
                        {
                            Success = true,
                            Message = "Duplicate signal ignored.",
                            Deduped = true
                        });
                    }
                }
                else if (!string.IsNullOrEmpty(dedupErr))
                {
                    // dedup 쿼리 실패 시 SOP 실행을 막지 않고 진행 — 긴급 SOP 누락 방지
                    m_logger.LogWarning("dedup 쿼리 오류(fail-open): actionStepSn={ActionStepSn}, remoteIp={RemoteIp}, err={DedupErr}", actionStepSn, remoteIp, dedupErr);
                }

                // BeginSOP 호출
                RequestExecuteSOP req = new RequestExecuteSOP
                {
                    SmallClassNo = sclasSn,
                    ActionStepNo = actionStepSn,
                    BeginTime = DateTime.Now,
                    Position = position,
                    LastAccessedUserNo = null,
                    SensorZoneHistoryNo = null,
                    DecisionValue = null
                };

                Base.SOPSimulator.IBLL.Response.ResponseExecuteSOP result = m_sopSimulatorProcessManager.BeginSOP(req);

                if (result != null && result.Success)
                {
                    m_logger.LogInformation("BeginSOP 성공: remoteIp={RemoteIp}, sclasSn={SclasSn}, alarmLevel={AlarmLevel}, actionStepHistoryNo={ActionStepHistoryNo}", remoteIp, sclasSn, data.AlarmLevel, result.ActionStepHistoryNo);

                    // occurredAt이 있을 때만 detct_time 기록 — {time} 특수문자 치환에 사용됨
                    if (result.ActionStepHistoryNo > 0 && occurredAtValue.HasValue)
                    {
                        try
                        {
                            string detctTimeErr;
                            Dictionary<Base.Model.History.ActionStep.Fields, object> dicDetctTime = new Dictionary<Base.Model.History.ActionStep.Fields, object>();
                            dicDetctTime[Base.Model.History.ActionStep.Fields.detct_time] = occurredAtValue.Value;
                            string detctTimeCondition = string.Format("{0} = {1}", Base.Model.History.ActionStep.Fields.action_step_hist_sn, result.ActionStepHistoryNo);
                            bool detctTimeUpdated = m_dataManager.GetUpdate().Update<Base.Model.History.ActionStep, Base.Model.History.ActionStep.Fields>(dicDetctTime, detctTimeCondition, out detctTimeErr);
                            if (!detctTimeUpdated)
                                m_logger.LogWarning("detct_time 업데이트 실패(best-effort): actionStepHistoryNo={ActionStepHistoryNo}, err={Err}", result.ActionStepHistoryNo, detctTimeErr);
                        }
                        catch (Exception detctEx)
                        {
                            m_logger.LogWarning(detctEx, "detct_time 업데이트 예외(best-effort): actionStepHistoryNo={ActionStepHistoryNo}", result.ActionStepHistoryNo);
                        }
                    }

                    return Ok(new ResponseExternalRunSop
                    {
                        Success = true,
                        Message = "SOP executed.",
                        Deduped = false
                    });
                }
                else
                {
                    string failMsg = result != null ? result.Message : "BeginSOP returned null.";
                    m_logger.LogWarning("BeginSOP 실패: remoteIp={RemoteIp}, sclasSn={SclasSn}, alarmLevel={AlarmLevel}, message={FailMsg}", remoteIp, sclasSn, data.AlarmLevel, failMsg);
                    return Ok(new ResponseExternalRunSop
                    {
                        Success = false,
                        Message = failMsg,
                        Deduped = false
                    });
                }
            }
            catch (Exception ex)
            {
                m_logger.LogError(ex, "RunSop 예외: remoteIp={RemoteIp}", HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? string.Empty);
                return Ok(new ResponseExternalRunSop
                {
                    Success = false,
                    Message = "Internal error."
                });
            }
        }

        // 두 시각이 같은 신호인지 판정한다(초 단위 비교, 둘 다 null이면 동일로 간주).
        private static bool DateTimeEquals(DateTime? a, DateTime? b)
        {
            if (a == null && b == null)
                return true;
            if (a == null || b == null)
                return false;
            return a.Value.ToString("yyyy-MM-dd HH:mm:ss") == b.Value.ToString("yyyy-MM-dd HH:mm:ss");
        }
    }
}
