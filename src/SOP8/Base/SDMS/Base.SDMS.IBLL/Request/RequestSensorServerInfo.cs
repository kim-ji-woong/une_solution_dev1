namespace Base.SDMS.IBLL.Request
{
    public class RequestSensorServerInfo
    {
        private int? siteNo = null;
        private int? sensorTypeCode = null;
        private int? sensorSubType = null;

        public int? SiteNo
        {
            get { return siteNo; }
            set { siteNo = value; }
        }

        public int? SensorTypeCode
        {
            get { return sensorTypeCode; }
            set { sensorTypeCode = value; }
        }

        public int? SensorSubType
        {
            get { return sensorSubType; }
            set { sensorSubType = value; }
        }
    }
}
