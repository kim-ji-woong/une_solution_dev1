namespace Base.SDMS.IBLL.Models
{
    public class SensorTypeData
    {
        private int m_nSensorTypeCode = -1;
        private int? m_sensorSubTypeNo = null;
        private string m_strSensorTypeName = "";

        public int SensorTypeCode
        {
            get { return m_nSensorTypeCode; }
            set { m_nSensorTypeCode = value; }
        }

        public int? SensorSubTypeNo
        {
            get { return m_sensorSubTypeNo; }
            set { m_sensorSubTypeNo = value; }
        }

        public string SensorTypeName
        {
            get { return m_strSensorTypeName; }
            set { m_strSensorTypeName = value; }
        }

        public long GetKey()
        {
            return MakeKey(m_nSensorTypeCode, m_sensorSubTypeNo);
        }

        public static long MakeKey(int sensorTypeNo, int? sensorSubTypeNo)
        {
            if (sensorSubTypeNo == null)
            {
                return (long)sensorTypeNo;
            }

            long hi = ((long)sensorTypeNo << 32);
            long low = (long)sensorSubTypeNo;
            return (hi | low);
        }
    }
}
