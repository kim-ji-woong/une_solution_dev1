using System.Collections.Generic;
using Response;
using Base.Model.Alarm;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using dnsData.CommonCode;
using SOPWebServer.IBLL.Models.Request;
using Base.DAL;
using System.Collections;
using Base.Model.History;
using Base.Model.Sop.Config;

namespace SOPWebServer.BLL.Server
{
    public class SopServer
    {
        private IDataManager m_dataManager = null;

        public SopServer(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public MessageResult BeginAlarmSop(RequestRunAlarmSop data, Base.SOPSimulator.IBLL.IProcessManager sopSimulatorProcessManager)
        {
            string strErrorMessage;
            string strCondition = string.Format("a.{0} = {1}", Current.Fields.sensor_zone_hist_sn, data.SensorZoneHistoryNo);

            IDataManager dataManager = m_dataManager.Clone();

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, ErrorMessage.ToMessage(ErrorMessage.FAIL_BEGIN_TRANSACTION));

            JoinManager joinManager = new JoinManager(dataManager);
            ArrayList arrDatas = joinManager.JoinCurrentAlarmHistorySensorZone(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return new MessageResult(false, strErrorMessage);

            int nDataCount = arrDatas.Count;
            /*IEnumerable<Current> currentAlarms = dataManager.GetSelect().Select<Current>(strCondition, out strErrorMessage);

            if (currentAlarms == null)
                return new MessageResult(false, strErrorMessage);*/

            Dictionary<Current.Fields, object> dicSets = new Dictionary<Current.Fields, object>();
            dicSets[Current.Fields.sop_sttus_optn_code] = (int)CodeType.SopStatus;

            strCondition = string.Format("{0} = {1}", Current.Fields.sensor_zone_hist_sn, data.SensorZoneHistoryNo);

            for (int i=0;i<nDataCount-1;i+=2)
            //foreach (Current alarm in currentAlarms)
            {
                Current alarm = (Current)arrDatas[i];
                SensorZone sensorZoneHistory = (SensorZone)arrDatas[i + 1];

                LinkedSop linkedSop = sopSimulatorProcessManager.GetLinkedSop(sensorZoneHistory.zone_sn, sensorZoneHistory.sensor_ty_code, sensorZoneHistory.site_sn, out strErrorMessage);

                if (linkedSop != null)
                {
                    dicSets[Current.Fields.sop_sttus_code] = History.SopStatus.RequestSOP;
                    dicSets[Current.Fields.user_sn] = data.UserNo;

                    if (dataManager.GetUpdate().Update<Current, Current.Fields>(dicSets, strCondition, out strErrorMessage) == false)
                    {
                        string strTemp;
                        dataManager.BatchRollback(out strTemp);
                        return new MessageResult(false, strErrorMessage);
                    }
                }
                else
                {
                    if (strErrorMessage != null)
                    {
                        string strTemp;
                        dataManager.BatchRollback(out strTemp);
                        return new MessageResult(false, strErrorMessage);
                    }
                }
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, ErrorMessage.ToMessage(ErrorMessage.FAIL_COMMIT_TRANSACTION));
            }

            return new MessageResult(true, "");
        }
    }
}
