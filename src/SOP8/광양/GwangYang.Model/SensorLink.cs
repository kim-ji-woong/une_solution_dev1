using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Gwangyang.Model
{
    public class SensorLink : Table
    {
        public enum Fields { node_id, sensor_name, sensor_type_idx, zone_sn, location, lat, lon }
        
        public enum WriteFields { node_id, sensor_name, sensor_type_idx, zone_sn, lat, lon };
        
        public int node_id { get; set; }
        
        public string sensor_name { get; set; }
        
        public int sensor_type_idx { get; set; }
        
        public int zone_sn { get; set; }
        
        public string location { get; set; }
        
        public double lat { get; set; }
        
        public double lon { get; set; }
        
        public static string TableName
        {
            get { return "ex_sensor_link"; }
        }

        public override string GetTableName()
        {
            return TableName;
        }

        public override string GetPrimaryCondition()
        {
            return string.Format("{0} = {1} and {2} = {3} and {4} = {5} and {6} = {7} and {8} = {9} and {10} = {11} and {12} = {13}", 
                Fields.node_id, node_id, 
                Fields.sensor_name, sensor_name,
                Fields.sensor_type_idx, sensor_type_idx,
                Fields.zone_sn, zone_sn,
                Fields.location, location,
                Fields.lat , lat,
                Fields.lon , lon
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