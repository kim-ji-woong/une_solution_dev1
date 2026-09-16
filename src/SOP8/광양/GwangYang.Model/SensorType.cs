using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Gwangyang.Model
{
    public class SensorType : Table
    {
        public enum Fields { sensor_type_idx, sensor_type_name, co_code, sensor_category_idx, alarm_yn };
        
        public enum WriteFields { sensor_type_idx, sensor_type_name, co_code, sensor_category_idx, alarm_yn };
        
        public int sensor_type_idx { get; set; }
        
        public string sensor_type_name { get; set; }
        
        public int co_code { get; set; }
        
        public int sensor_category_idx { get; set; }
        
        public bool alarm_yn { get; set; }
        
        public static string TableName
        {
            get { return "ex_sensor_type"; }
        }

        public override string GetTableName()
        {
            return TableName;
        }

        public override string GetPrimaryCondition()
        {
            return string.Format("{0} = {1} and {2} = {3} and {4} = {5} and {6} = {7} and {8} = {9}", 
                Fields.sensor_type_idx, sensor_type_idx,
                Fields.sensor_type_name, sensor_type_name, 
                Fields.co_code, co_code,
                Fields.sensor_category_idx, sensor_category_idx,
                Fields.alarm_yn, alarm_yn
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