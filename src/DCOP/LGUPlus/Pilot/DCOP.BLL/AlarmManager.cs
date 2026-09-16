using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using DCOP.Model;
using System.Collections;
using DCOP.DAL;

namespace DCOP.BLL
{
    using Models.Response;

    public class AlarmManager
    {
        private IDataManager m_dataManager = null;

        public AlarmManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseAlarmList GetAlarmList(int dataCenterNo)
        {
            string strErrorMessage;
            string strCondition = string.Format("a.{0} is null and a.{1} in (Select {2} from {3} where {4} = {5})",
                Alarm.Fields.ClearTime,
                Alarm.Fields.ItemNo,
                Item.Fields.ItemNo,
                Item.TableName,
                Item.Fields.DataCenterNo,
                dataCenterNo);

            ArrayList arrDatas = JoinManager.JoinAlarmItemRU(m_dataManager, strCondition, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseAlarmList(false, strErrorMessage);

            int nDataCount = arrDatas.Count;

            ResponseAlarmList response = new ResponseAlarmList(true, "");
            response.DataCenterNo = dataCenterNo;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Alarm && arrDatas[i + 1] is Item_RU)
                {
                    Alarm alarm = (Alarm)arrDatas[i];
                    Item_RU ru = (Item_RU)arrDatas[i + 1];

                    response.Alarms.Add(new AlarmEx(alarm, ru.UPos));
                }
            }

            return response;
            /*string strCondition = string.Format("{0} is null and {1} in (Select {2} from {3} where {4} = {5})",
                Alarm.Fields.ClearTime,
                Alarm.Fields.ItemNo,
                Item.Fields.ItemNo,
                Item.TableName,
                Item.Fields.DataCenterNo,
                dataCenterNo);

            IEnumerable<Alarm> alarms = m_dataManager.GetSelect().Select<Alarm>(strCondition, out strErrorMessage);

            if (alarms == null)
                return new ResponseAlarmList(false, strErrorMessage);

            ResponseAlarmList response = new ResponseAlarmList(true, "");
            response.DataCenterNo = dataCenterNo;
            response.Alarms.AddRange(alarms);
            return response;*/
        }
    }
}
