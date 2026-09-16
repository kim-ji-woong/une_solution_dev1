using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Pohang.Model
{
    public class PublicWeather : Table
    {
        public enum Fields { region_name, tm, temp_value, humi_value, wind_speed_value, wind_direction_value, air_pressure_value, insolation_value }
        public enum WriteFields { region_name, tm, temp_value, humi_value, wind_speed_value, wind_direction_value, air_pressure_value, insolation_value }
        
        public string region_name { get; set; }
        public DateTime tm { get; set; }
        public double temp_value { get; set; }
        public double humi_value { get; set; }
        public double wind_speed_value { get; set; }
        public double wind_direction_value { get; set; }
        public double air_pressure_value { get; set; }
        public double insolation_value { get; set; }
        
        public static string TableName
        {
            get { return "ex_public_weather"; }
        }
        
        public override string GetTableName()
        {
            return TableName;
        }
        
        public override string GetPrimaryCondition()
        {
            return string.Empty;
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