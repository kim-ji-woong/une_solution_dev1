using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Gwangyang.Model
{
    public class POIInfo : Table
    {
        public enum Fields { node_id, sensor_type_idx, x, y, z, zone_no }
        
        public enum WriteFields { node_id, sensor_type_idx, x, y, z, zone_no }
        
        public int node_id { get; set; }
        
        public int sensor_type_idx { get; set; }
        
        public double x { get; set; }
        
        public double y { get; set; }
        
        public double z { get; set; }
        
        public int zone_no { get; set; }
        
        public static string TableName
        {
            get { return "ex_poi_info"; }
        }
        
        public override string GetTableName()
        {
            return TableName;
        }
        
        public override string GetPrimaryCondition()
        {
            return string.Format("{0} = {1} and {2} = {3} and {4} = {5} and {6} = {7}",
                Fields.node_id, node_id,
                Fields.sensor_type_idx, sensor_type_idx,
                Fields.x, x,
                Fields.y, y
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