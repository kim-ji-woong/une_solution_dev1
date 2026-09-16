using System.Collections;
using System.Collections.Generic;
using Base.DAL;
using Base.Model.Sensor;
using dnsData.CommonCode;

namespace Soulbrain.BLL.Process
{
    using Response;
    using Request;
    using dnsDapperDBUtil.DataAccessLayer.IDAL;
    using Base.Model.Sensor.CCTV;

    class CCTVManager
    {
        private IDataManager m_dataManager = null;

        public CCTVManager(IDataManager dataManager)
        {
            m_dataManager = dataManager;
        }

        public ResponseAllCCTVs GetAllCCTVs()
        {
            string strErrorMessage;
            IEnumerable<CCTV> cctvs = m_dataManager.GetSelect().Select<CCTV>(null, out strErrorMessage);

            if (cctvs == null)
                return new ResponseAllCCTVs(false, strErrorMessage);

            ResponseAllCCTVs response = new ResponseAllCCTVs(true, "");
            response.CCTVs.AddRange(cctvs);
            return response;
        }

        public ResponseCCTVList GetCCTVList(RequestCCTVList data)
        {
            string strErrorMessage;
            string strCondition = string.Format("a.{0} = {1}", Sensor.Fields.sensor_sn, data.SensorNo);

            JoinManager joinManager = new JoinManager(m_dataManager);
            ArrayList arrDatas = joinManager.JoinSensorSensorZone(strCondition, out strErrorMessage);

            if (arrDatas == null)
                return new ResponseCCTVList(false, strErrorMessage);

            string strSensorNos = null;
            Dictionary<int, CctvEx> dicCctvs = new Dictionary<int, CctvEx>();

            int nDataCount = arrDatas.Count;

            for (int i=0;i<nDataCount-1;i+=2)
            {
                if (arrDatas[i] is Sensor && arrDatas[i + 1] is SensorZone)
                {
                    Sensor sensor = (Sensor)arrDatas[i];
                    SensorZone sensorZone = (SensorZone)arrDatas[i + 1];

                    IEnumerable<CCTV> cctvs = null;
                    int? equipZoneNo = null;
                    int? sensorZoneNo = null;

                    if (IsEquipZoneCCTVType(sensor.sensor_ty_code))
                    {
                        if (sensorZone.eqp_zone_sn == null)
                            return new ResponseCCTVList(false, "구역별 CCTV를 연결하기 위한 구역정보가 설정되어 있지 않습니다.");

                        cctvs = GetEquipZoneCCTV((int)sensorZone.eqp_zone_sn, out strErrorMessage);
                        equipZoneNo = sensorZone.eqp_zone_sn;
                    }
                    else
                    {
                        cctvs = GetSensorZoneCCTV((int)sensorZone.sensor_zone_sn, out strErrorMessage);
                        sensorZoneNo = sensorZone.sensor_zone_sn;
                    }

                    if (cctvs == null)
                        return new ResponseCCTVList(false, strErrorMessage);

                    foreach (CCTV cctv in cctvs)
                    {
                        dicCctvs[cctv.sensor_sn] = new CctvEx(cctv);

                        if (strSensorNos == null)
                            strSensorNos = cctv.sensor_sn.ToString();
                        else
                            strSensorNos += "," + cctv.sensor_sn.ToString();
                    }

                    if (SetCameraName(dicCctvs, strSensorNos, out strErrorMessage) == false)
                        return new ResponseCCTVList(false, strErrorMessage);

                    ResponseCCTVList response = new ResponseCCTVList(true, "");
                    response.Cctvs.AddRange(dicCctvs.Values);
                    response.EquipZoneNo = equipZoneNo;
                    response.SensorZoneNo = sensorZoneNo;
                    return response;
                }
            }

            return new ResponseCCTVList(false, "시스템 Database에서 센서정보를 찾을수 없습니다.");
        }

        private bool SetCameraName(Dictionary<int, CctvEx> dicCctvs, string strSensorNos, out string strErrorMessage)
        {
            strErrorMessage = null;

            if (strSensorNos == null)
                return true;

            string strCondition = string.Format("{0} in ({1})", Sensor.Fields.sensor_sn, strSensorNos);
            IEnumerable<Sensor> sensors = m_dataManager.GetSelect().Select<Sensor>(strCondition, out strErrorMessage);

            if (sensors == null)
                return false;

            foreach (Sensor sensor in sensors)
            {
                CctvEx cctv;

                if (dicCctvs.TryGetValue(sensor.sensor_sn, out cctv))
                {
                    cctv.CameraName = sensor.sensor_name;
                }
            }

            return true;
        }

        private IEnumerable<CCTV> GetSensorZoneCCTV(int equipZoneNo, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", SensorZoneCCTV.Fields.sensor_zone_sn, equipZoneNo);
            SensorZoneCCTV sensorZoneCCTV = m_dataManager.GetSelect().SelectFirst<SensorZoneCCTV>(strCondition, out strErrorMessage);

            if (sensorZoneCCTV == null)
            {
                if (strErrorMessage != null)
                    return null;
                else
                    return new List<CCTV>();
            }

            strCondition = GetCCTVCondition(sensorZoneCCTV.cctv_1, sensorZoneCCTV.cctv_2, sensorZoneCCTV.cctv_3, sensorZoneCCTV.cctv_4);

            if (strCondition == null)
                return new List<CCTV>();

            return m_dataManager.GetSelect().Select<CCTV>(strCondition, out strErrorMessage);
        }

        private IEnumerable<CCTV> GetEquipZoneCCTV(int equipZoneNo, out string strErrorMessage)
        {
            string strCondition = string.Format("{0} = {1}", EquipZoneCCTV.Fields.eqp_zone_sn, equipZoneNo);
            EquipZoneCCTV equipZoneCCTV = m_dataManager.GetSelect().SelectFirst<EquipZoneCCTV>(strCondition, out strErrorMessage);

            if (equipZoneCCTV == null)
            {
                if (strErrorMessage != null)
                    return null;
                else
                    return new List<CCTV>();
            }

            strCondition = GetCCTVCondition(equipZoneCCTV.cctv_1, equipZoneCCTV.cctv_2, equipZoneCCTV.cctv_3, equipZoneCCTV.cctv_4);

            if (strCondition == null)
                return new List<CCTV>();

            return m_dataManager.GetSelect().Select<CCTV>(strCondition, out strErrorMessage);
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

        private bool IsEquipZoneCCTVType(int sensorType)
        {
            if (sensorType == SdmsSensor.SensorType.Fire ||
                sensorType == SdmsSensor.SensorType.PSM ||
                sensorType == SdmsSensor.SensorType.Etc)
            {
                return true;
            }

            return false;
        }
    }
}
