using dnsData.CommonCode;
using dnsDapperDBUtil.DataAccessLayer.IDAL;
using System.Collections.Generic;

namespace Sop7ToSop8.Migration.Sensor
{
    class SensorManager
    {
        private IMigrationClient m_client = null;
        private int m_nSop8SiteNo = -1;

        public SensorManager(IMigrationClient client, int sop8SiteNo)
        {
            m_client = client;
            m_nSop8SiteNo = sop8SiteNo;
        }

        public bool Run()
        {
            SensorServerInfoManager sensorServerManager = new SensorServerInfoManager(m_client, m_nSop8SiteNo);

            if (sensorServerManager.Run() == false)
                return false;

            FireSensorManager fireSensorManager = new FireSensorManager(m_client, m_nSop8SiteNo);

            if (fireSensorManager.Run() == false)
                return false;

            PsmSensorManager psmSensorManager = new PsmSensorManager(m_client, m_nSop8SiteNo);

            if (psmSensorManager.Run() == false)
                return false;

            EtcSensorManager etcSensorManager = new EtcSensorManager(m_client, m_nSop8SiteNo);

            if (etcSensorManager.Run() == false)
                return false;

            CCTVManager cctvManager = new CCTVManager(m_client, m_nSop8SiteNo);

            if (cctvManager.Run() == false)
                return false;

            return true;
        }

        // sop7의 sensorZone ID를 sop8의 sensorZone 번호로 바꾼다.
        // dicSensorZones : Key(SensorZone ID), Value(OrgSensor ID)
        public static int ConvertSensorZoneID(int sop7SensorZoneID, int sensorType, Dictionary<int, int> dicSensorZones)
        {
            if (sensorType == 0)
                return FireSensorManager.ConvertSensorZoneID(sop7SensorZoneID, dicSensorZones);
            else if (sensorType == 11)
                return PsmSensorManager.ConvertSensorZoneID(sop7SensorZoneID, dicSensorZones);
            else if (sensorType == 21)
                return EtcSensorManager.ConvertSensorZoneID(sop7SensorZoneID, dicSensorZones);
            else if (sensorType >= 900 && sensorType <= 906)
                return CCTVManager.ConvertSensorZoneID(sop7SensorZoneID);

            return -1;
        }
    }
}
