using System;

namespace BusanSensorServer.Model.Sensor
{
    public class ValueHistory
    {
        public enum Fields { SensorNo, TimeStamp, Value, OriginTimeStamp }
        
        public int SensorNo { get; set; }
        public DateTime TimeStamp { get; set; }
        public double Value { get; set; }
        public DateTime OriginTimeStamp { get; set; }
        
        public static string TableName { get { return "BusanSensorValueHistory"; } }
        
        public static string GetFieldName(Fields field, out bool isNullable)
        {
            if (field == Fields.Value ||
                field == Fields.OriginTimeStamp)
                isNullable = true;
            else
                isNullable = false;
            
            return field.ToString();
        }
    }
}