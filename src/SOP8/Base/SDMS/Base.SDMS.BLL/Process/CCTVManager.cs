using System.Collections.Generic;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using Base.SDMS.IBLL.Request;
using Base.SDMS.IBLL.Response;
using Base.Model.Sensor.CCTV;
using Response;
using Base.SDMS.IBLL.Models;
using Base.Model.Sensor;

namespace Base.SDMS.BLL.Process
{
    class CCTVManager
    {
        private IDataManager m_dataManager = null;

        public CCTVManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseEquipZoneCCTVList GetEquipZoneCCTVList(RequestEquipZoneCCTV data)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", EquipZoneCCTV.Fields.eqp_zone_sn, data.EquipZoneNo);
            EquipZoneCCTV equipZoneCCTV = m_dataManager.GetSelect().SelectFirst<EquipZoneCCTV>(strCondition, out strErrorMessage);

            if (equipZoneCCTV == null)
            {
                if (strErrorMessage != null)
                    return null;
                else
                    return new ResponseEquipZoneCCTVList(true, "");
            }

            strCondition = GetCCTVCondition(equipZoneCCTV.cctv_1, equipZoneCCTV.cctv_2, equipZoneCCTV.cctv_3, equipZoneCCTV.cctv_4);

            if (strCondition == null)
                return new ResponseEquipZoneCCTVList(true, "");

            IEnumerable<CCTV> cctvs = m_dataManager.GetSelect().Select<CCTV>(strCondition, out strErrorMessage);

            if (cctvs == null)
                return new ResponseEquipZoneCCTVList(false, strErrorMessage);

            IEnumerable<CctvEx> cctvList = ToCctvExList(cctvs, out strErrorMessage);

            if (cctvList == null)
                return new ResponseEquipZoneCCTVList(false, strErrorMessage);

            ResponseEquipZoneCCTVList response = new ResponseEquipZoneCCTVList(true, "");
            response.Cctvs.AddRange(cctvList);
            response.EquipZoneNo = data.EquipZoneNo;
            return response;
        }

        public ResponseSensorZoneCCTVList GetSensorZoneCCTVList(RequestSensorZoneCCTV data)
        {
            string strErrorMessage;
            string strCondition = string.Format("{0} = {1}", SensorZoneCCTV.Fields.sensor_zone_sn, data.SensorZoneNo);
            SensorZoneCCTV sensorZoneCCTV = m_dataManager.GetSelect().SelectFirst<SensorZoneCCTV>(strCondition, out strErrorMessage);

            if (sensorZoneCCTV == null)
            {
                if (strErrorMessage != null)
                    return null;
                else
                    return new ResponseSensorZoneCCTVList(true, "");
            }

            strCondition = GetCCTVCondition(sensorZoneCCTV.cctv_1, sensorZoneCCTV.cctv_2, sensorZoneCCTV.cctv_3, sensorZoneCCTV.cctv_4);

            if (strCondition == null)
                return new ResponseSensorZoneCCTVList(true, "");

            IEnumerable<CCTV> cctvs = m_dataManager.GetSelect().Select<CCTV>(strCondition, out strErrorMessage);

            if (cctvs == null)
                return new ResponseSensorZoneCCTVList(false, strErrorMessage);

            IEnumerable<CctvEx> cctvList = ToCctvExList(cctvs, out strErrorMessage);

            if (cctvList == null)
                return new ResponseSensorZoneCCTVList(false, strErrorMessage);

            ResponseSensorZoneCCTVList response = new ResponseSensorZoneCCTVList(true, "");
            response.Cctvs.AddRange(cctvList);
            response.SensorZoneNo = data.SensorZoneNo;
            return response;
        }

        public MessageResult SaveEquipZoneCCTVList(SaveEquipZoneCCTVList data)
        {
            string strErrorMessage;
            Dictionary<int, EquipZoneCCTV> dicEquipZoneCCTVs = ReadEquipZoneCCTVs(data, out strErrorMessage);

            if (dicEquipZoneCCTVs == null)
                return new MessageResult(false, strErrorMessage);

            IDataManager dataManager = m_dataManager.Clone();

            List<EquipZoneCCTV> updateList = new List<EquipZoneCCTV>();
            List<EquipZoneCCTV> insertList = new List<EquipZoneCCTV>();

            foreach (var equipZoneCCTV in data.EquipZoneCCTVs)
            {
                if (dicEquipZoneCCTVs.ContainsKey(equipZoneCCTV.eqp_zone_sn))
                    updateList.Add(equipZoneCCTV);
                else
                    insertList.Add(equipZoneCCTV);
            }

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, "시스템 데이터베이스의 트랜잭션을 시작할 수 없습니다.", ErrorCode.BeginTransactionFail);

            if (dataManager.GetUpdate().Update<EquipZoneCCTV>(updateList, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, strErrorMessage);
            }

            if (dataManager.GetCreate().Insert<EquipZoneCCTV>(insertList, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, strErrorMessage);
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new ResponseAlarmNotification(false, "데이터베이스의 트랜잭션을 정상적으로 종료시키지 못하였습니다.", ErrorCode.CommitTransactionFail);
            }

            return new MessageResult(true, "");
        }

        public MessageResult SaveSensorZoneCCTVList(SaveSensorZoneCCTVList data)
        {
            string strErrorMessage;
            Dictionary<int, SensorZoneCCTV> dicSensorZoneCCTVs = ReadSensorZoneCCTVs(data, out strErrorMessage);

            if (dicSensorZoneCCTVs == null)
                return new MessageResult(false, strErrorMessage);

            IDataManager dataManager = m_dataManager.Clone();

            List<SensorZoneCCTV> updateList = new List<SensorZoneCCTV>();
            List<SensorZoneCCTV> insertList = new List<SensorZoneCCTV>();

            foreach (var sensorZoneCCTV in data.SensorZoneCCTVs)
            {
                if (dicSensorZoneCCTVs.ContainsKey(sensorZoneCCTV.sensor_zone_sn))
                    updateList.Add(sensorZoneCCTV);
                else
                    insertList.Add(sensorZoneCCTV);
            }

            if (dataManager.BeginBatch(out strErrorMessage) == false)
                return new MessageResult(false, "시스템 데이터베이스의 트랜잭션을 시작할 수 없습니다.", ErrorCode.BeginTransactionFail);

            if (dataManager.GetUpdate().Update<SensorZoneCCTV>(updateList, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, strErrorMessage);
            }

            if (dataManager.GetCreate().Insert<SensorZoneCCTV>(insertList, out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new MessageResult(false, strErrorMessage);
            }

            if (dataManager.BatchCommit(out strErrorMessage) == false)
            {
                string strTemp;
                dataManager.BatchRollback(out strTemp);
                return new ResponseAlarmNotification(false, "데이터베이스의 트랜잭션을 정상적으로 종료시키지 못하였습니다.", ErrorCode.CommitTransactionFail);
            }

            return new MessageResult(true, "");
        }

        private IEnumerable<CctvEx> ToCctvExList(IEnumerable<CCTV> cctvs, out string strErrorMessage)
        {
            Dictionary<int, CctvEx> dicCctvs = new Dictionary<int, CctvEx>();
            string strSensorNos = null;

            foreach (CCTV cctv in cctvs)
            {
                if (strSensorNos == null)
                    strSensorNos = cctv.sensor_sn.ToString();
                else
                    strSensorNos += "," + cctv.sensor_sn.ToString();

                dicCctvs[cctv.sensor_sn] = new CctvEx(cctv);
            }

            strErrorMessage = null;

            if (strSensorNos == null)
                return new List<CctvEx>();

            string strCondition = string.Format("{0} in ({1})", Sensor.Fields.sensor_sn, strSensorNos);
            IEnumerable<Sensor> sensors = m_dataManager.GetSelect().Select<Sensor>(strCondition, out strErrorMessage);

            if (sensors == null)
                return null;

            foreach (Sensor sensor in sensors)
            {
                CctvEx cctv;

                if (dicCctvs.TryGetValue(sensor.sensor_sn, out cctv))
                {
                    cctv.CameraName = sensor.sensor_name;
                }
            }

            return dicCctvs.Values;
        }

        private Dictionary<int, SensorZoneCCTV> ReadSensorZoneCCTVs(SaveSensorZoneCCTVList data, out string strErrorMessage)
        {
            string strCondition = null;

            foreach (SensorZoneCCTV sensorZoneCCTV in data.SensorZoneCCTVs)
            {
                if (strCondition == null)
                    strCondition = sensorZoneCCTV.sensor_zone_sn.ToString();
                else
                    strCondition += "," + sensorZoneCCTV.sensor_zone_sn.ToString();
            }

            strErrorMessage = null;

            if (strCondition == null)
                return new Dictionary<int, SensorZoneCCTV>();

            strCondition = string.Format("{0} in ({1})", SensorZoneCCTV.Fields.sensor_zone_sn, strCondition);
            IEnumerable<SensorZoneCCTV> sensorZoneCCTVs = m_dataManager.GetSelect().Select<SensorZoneCCTV>(strCondition, out strErrorMessage);

            if (sensorZoneCCTVs == null)
                return null;

            Dictionary<int, SensorZoneCCTV> dicSensorZoneCCTVs = new Dictionary<int, SensorZoneCCTV>();

            foreach (var sensorZoneCCTV in sensorZoneCCTVs)
            {
                dicSensorZoneCCTVs[sensorZoneCCTV.sensor_zone_sn] = sensorZoneCCTV;
            }

            return dicSensorZoneCCTVs;
        }

        private Dictionary<int, EquipZoneCCTV> ReadEquipZoneCCTVs(SaveEquipZoneCCTVList data, out string strErrorMessage)
        {
            string strCondition = null;

            foreach (EquipZoneCCTV equipZoneCCTV in data.EquipZoneCCTVs)
            {
                if (strCondition == null)
                    strCondition = equipZoneCCTV.eqp_zone_sn.ToString();
                else
                    strCondition += "," + equipZoneCCTV.eqp_zone_sn.ToString();
            }

            strErrorMessage = null;

            if (strCondition == null)
                return new Dictionary<int, EquipZoneCCTV>();

            strCondition = string.Format("{0} in ({1})", EquipZoneCCTV.Fields.eqp_zone_sn, strCondition);
            IEnumerable<EquipZoneCCTV> equipZoneCCTVs = m_dataManager.GetSelect().Select<EquipZoneCCTV>(strCondition, out strErrorMessage);

            if (equipZoneCCTVs == null)
                return null;

            Dictionary<int, EquipZoneCCTV> dicEquipZoneCCTVs = new Dictionary<int, EquipZoneCCTV>();

            foreach (var equipZoneCCTV in equipZoneCCTVs)
            {
                dicEquipZoneCCTVs[equipZoneCCTV.eqp_zone_sn] = equipZoneCCTV;
            }

            return dicEquipZoneCCTVs;
        }

        private string GetCCTVCondition(int? cctv1, int? cctv2, int? cctv3, int? cctv4)
        {
            string strCondition = null;

            if (cctv1 != null)
                strCondition = string.Format("{0}", (int)cctv1);

            if (cctv2 != null)
            {
                if (strCondition != null)
                    strCondition += string.Format(", {0}", (int)cctv2);
                else
                    strCondition = string.Format("{0}", (int)cctv2);
            }

            if (cctv3 != null)
            {
                if (strCondition != null)
                    strCondition += string.Format(", {0}", (int)cctv3);
                else
                    strCondition = string.Format("{0}", (int)cctv3);
            }

            if (cctv4 != null)
            {
                if (strCondition != null)
                    strCondition += string.Format(", {0}", (int)cctv4);
                else
                    strCondition = string.Format("{0}", (int)cctv4);
            }

            if (strCondition == null)
                return null;

            return string.Format("{0} in ({1})", CCTV.Fields.sensor_sn, strCondition);
        }
    }
}
