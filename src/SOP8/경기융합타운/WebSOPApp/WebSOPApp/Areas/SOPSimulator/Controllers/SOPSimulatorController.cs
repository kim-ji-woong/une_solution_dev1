using Common.Model.History;
using Microsoft.AspNetCore.Mvc;
using SOPSimulator.BLL.Models.Data;
using SOPSimulator.BLL.Models.Request;
using SOPSimulator.BLL.Models.Response;
using System;
using System.Collections.Generic;

namespace WebSOPApp.Areas.SOPSimulator.Controllers
{
    [Area("SOPSimulator")]
    public class SOPSimulatorController : Controller
    {
        private global::SOPSimulator.BLL.ProcessManager m_processManager = null;
        public SOPSimulatorController(global::SOPManager.IDAL.IDataManager sopDataManager, global::Common.IDAL.IDataManager commonDataManager, global::TeamEditor.IDAL.IDataManager teamDataManager, global::SOPSimulator.IDAL.IDataManager sopSimulatorDataManager, global::SDMS.IDAL.IDataManager sdmsManager)
        {            
            m_processManager = new global::SOPSimulator.BLL.ProcessManager(commonDataManager, sopDataManager, teamDataManager, sopSimulatorDataManager, sdmsManager);
        }

        [HttpPost]
        public IActionResult DisplaySopRun()
        {
            ResponseMonitoring res = new ResponseMonitoring();
            res.Changed = m_processManager.GetSopRunManager().Changed;            
            res.SOPRunDatas = m_processManager.GetSopRunManager().SopRunDatas;
            res.ConfirmTimeoutCloseSOPs = m_processManager.GetSopRunManager().ConfirmTimeoutCloseSOPs;
            
            ActionStepHistory last = m_processManager.GetSopRunManager().LastAccessedActionStep;
            res.LastAccessActionStepHistoryID = (last == null) ? -1 : last.ID;
            res.nChanged = m_processManager.GetSopRunManager().nChanged;
            return Ok(res);
        }

        [HttpPost]
        public IActionResult ExcuteSOP([FromBody] RequestExcuteSOP data)
        {
            //int actionStepHistoryID = m_processManager.GetCreateManager().ExcuteSOP(data);
            //return Ok(actionStepHistoryID);
            int historyID = m_processManager.GetSopRunManager().BeginSOP(data.strBeginTime, data.VersionID, data.ActionStepID, data.Position, data.SensorZoneHistoryID);
            return Ok(historyID);
        }

        [HttpPost]
        public IActionResult CloseSOPByUser([FromBody] RequestCloseSOP data)
        {
            DateTime endTime = Convert.ToDateTime(data.EndTime);
            m_processManager.GetSopRunManager().CloseSOPByUser(data.ActionStepHistoryID, endTime, data.LastAccessedUserID);
            return Ok();
        }

        [HttpPost]
        public IActionResult NextActionStep([FromBody] RequestNextActionStep data)
        {
            m_processManager.GetSopRunManager().NextActionStep(data);
            return Ok();
        }

        [HttpPost]
        public IActionResult RunSection([FromBody] RequestProgressSOP data)
        {
            m_processManager.GetSopRunManager().RunSection(data);
            return Ok();
        }

        [HttpGet]
        public IActionResult MonitorComponentHistory()
        {
            ResponseMonitor response = m_processManager.GetLoadManager().MonitorComponentHistory();
            return Ok(response);
        }

        [HttpPost]
        public IActionResult ProgressMission([FromBody] RequestProgressMission data)
        {
            bool result =m_processManager.GetSopRunManager().ProgressMission(data.SopKey,
                                                                             data.ActionStepHistoryID,
                                                                             data.ComponentType,
                                                                             data.ComponentID,
                                                                             data.DataIndex,
                                                                             data.ComponentStatus,
                                                                             data.AccessedUserID,
                                                                             data.Checked);
            return Ok(result);
        }

        [HttpPost]
        public IActionResult ProgressSpread([FromBody] RequestProgressInternalSpread data)
        {
            bool result = m_processManager.GetSopRunManager().ProgressSpread(data.SopKey,
                                                                             data.ActionStepHistoryID,
                                                                             data.ComponentType,
                                                                             data.ComponentID,
                                                                             data.DataIndex,
                                                                             data.ComponentStatus,
                                                                             data.AccessedUserID,
                                                                             data.IsSMS,
                                                                             data.IsEmail,
                                                                             data.IsBroadcast,
                                                                             data.IsSiren,
                                                                             data.Message,
                                                                             null);

            return Ok(result);
        }

        [HttpPost]
        public IActionResult ProgressInternalSpread([FromBody] RequestProgressInternalSpread data)
        {
            bool result = m_processManager.GetSopRunManager().ProgressSpread(data.SopKey,
                                                                             data.ActionStepHistoryID,
                                                                             data.ComponentType,
                                                                             data.ComponentID,
                                                                             data.DataIndex,
                                                                             data.ComponentStatus,
                                                                             data.AccessedUserID,
                                                                             data.IsSMS,
                                                                             data.IsEmail,
                                                                             data.IsBroadcast,
                                                                             data.IsSiren,
                                                                             data.Message,
                                                                             data.Teams);

            return Ok(result);
        }

        [HttpPost]
        public IActionResult ExcuteExternalProgram([FromBody] RequestExcuteExternalProgram data)
        {
            bool result = m_processManager.GetSopRunManager().ExcuteExternalProgram(data.SopKey,
                                                                                    data.ActionStepHistoryID,
                                                                                    data.ComponentType,
                                                                                    data.ComponentID,
                                                                                    data.DataIndex,
                                                                                    data.ComponentStatus,
                                                                                    data.AccessedUserID);

            return Ok(result);
        }        

       [HttpPost]
        public IActionResult RequestSensorName([FromBody] RequestSensorName data)
        {
            ResponseSensorName result = m_processManager.GetLoadManager().RequestSensorName(data.SensorZoneHistoryID);

            return Ok(result);
        }
    }
}
