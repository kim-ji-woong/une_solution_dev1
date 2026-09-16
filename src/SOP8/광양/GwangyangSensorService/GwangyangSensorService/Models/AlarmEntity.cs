namespace GwangyangSensorService.Models
{
    public class AlarmEntity
    {
        public class AlarmData
        {
            private const int DefalutAlarmLevel = 1;
            
            public int SensorZoneNo { get; set; }
            
            public int SensorType { get; set; }
            
            public int SensorData { get; set; }
            
            public int AlarmLevel { get; set; }
            
            public AlarmData (int sensorZoneNo, int sensorType, int sensorData, int alarmLevel = DefalutAlarmLevel) {
                SensorZoneNo = sensorZoneNo;
                SensorType = sensorType;
                SensorData = sensorData;
                AlarmLevel = alarmLevel;
            }
        }

        public const int Atmosphere = 300331;
        public const int Water = 300333;
        public const int WaterDisaster = 300334;

        public const string UseAtmosphereType = "SDMS/UseReceiveAtmosphere";
        public const string UseWaterType = "SDMS/UseReceiveWater";
        public const string UseWaterDisasterType = "SDMS/UseReceiveWaterDisaster";
    }
}