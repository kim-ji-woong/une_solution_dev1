using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Pohang.Model
{
    public class SensorTypeSubTypes : Table
    {
        public enum Fields { sensor_type_idx, sensor_sub_types }
        
        public enum WriteFields { sensor_type_idx, sensor_sub_types }
        
        public int sensor_type_idx { get; set; }
        
        public string sensor_sub_types { get; set; }
        
        public static string TableName
        {
            get { return "ex_sensor_type_sub_types"; }
        }
        
        public override string GetTableName()
        {
            return TableName;
        }
        
        public override string GetPrimaryCondition()
        {
            return string.Format("{0} = {1} and {2} = {3}", 
                Fields.sensor_type_idx, sensor_type_idx,
                Fields.sensor_sub_types, sensor_sub_types
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