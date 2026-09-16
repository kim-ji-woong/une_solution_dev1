using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Pohang.Model
{
    public class SensorHistory : Table
    {
        public enum Fields { sensor_his_no, sensor_sn, sensor_value, his_timestamp, temp_idx }
        
        public enum WriteFields { sensor_sn, sensor_value, timestamp, temp_idx }
        
        public int sensor_his_no { get; set; }
        
        public int sensor_sn { get; set; }
        
        public string sensor_value { get; set; }
        
        public DateTime his_timestamp { get; set; }
        
        public int? temp_idx { get; set; }
        
        public static string TableName
        {
            get { return "ex_sensor_his"; }
        }
        
        public override string GetTableName()
        {
            return TableName;
        }
        
        public override string GetPrimaryCondition()
        {
            return string.Format("{0} = {1} and {2} = {3} and {4} = {5} and {6} = {7}",
                Fields.sensor_sn, sensor_sn,
                Fields.sensor_value, sensor_value,
                Fields.his_timestamp, his_timestamp,
                Fields.temp_idx, temp_idx
            );
        }
        
        public override Type GetFieldType()
        {
            return typeof(Fields);
        }
        
        public override Type GetWriteFieldType()
        {
            return typeof(WriteFields);
        }
    }
}