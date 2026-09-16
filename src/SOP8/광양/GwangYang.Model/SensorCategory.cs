using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Gwangyang.Model
{
    public class SensorCategory : Table
    {
        public enum Fields { sensor_category_idx, sensor_category_name };
        
        public enum WriteFields { sensor_category_idx, sensor_category_name};
        
        public int sensor_category_idx { get; set; }
        
        public string sensor_category_name { get; set; }
        
        
        public static string TableName
        {
            get { return "ex_sensor_category"; }
        }

        public override string GetTableName()
        {
            return TableName;
        }

        public override string GetPrimaryCondition()
        {
            return string.Format("{0} = {1} and {2} = {3}", 
                Fields.sensor_category_idx, sensor_category_idx,
                Fields.sensor_category_name, sensor_category_name
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