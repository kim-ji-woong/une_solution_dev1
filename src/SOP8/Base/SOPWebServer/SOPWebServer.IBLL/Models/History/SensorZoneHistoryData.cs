namespace SOPWebServer.IBLL.Models.History
{
    public class SensorZoneHistoryData
    {
        public Base.Model.History.SensorZone SensorZoneHistory
        {
            get; set;
        }

        public Base.Model.Sensor.SensorZone SensorZone
        {
            get; set;
        }

        public Base.Model.Sensor.Sensor Sensor
        {
            get; set;
        }

        public bool UseSensorAlarm
        {
            get; set;
        }

        public Base.Model.Spatial.EquipmentZone EquipmentZone
        {
            get; set;
        }
    }
}
