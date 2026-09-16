using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Gwangyang.Model
{
    public class WeatherData : Table
    {
        public enum Fields { lc_sn, lc_name, temp_value, rain_per_hour_value, sky_status_value, humi_value, rain_status_value, lightning_value, wind_direction_value, wind_speed_value, last_update_tm }
        
        public enum WriteFields { lc_name, temp_value, rain_per_hour_value, sky_status_value, humi_value, rain_status_value, lightning_value, wind_direction_value, wind_speed_value, last_update_tm }
        
        public int lc_sn { get; set; }
        
        public string lc_name { get; set; }
        
        public double temp_value { get; set; }
        
        public double rain_per_hour_value { get; set; }
        
        public int sky_status_value { get; set; }
        
        public double humi_value { get; set; }
        
        public int rain_status_value { get; set; }
        
        public double lightning_value { get; set; }
        
        public double wind_direction_value { get; set; }
        
        public double wind_speed_value { get; set; }
        
        public DateTime last_update_tm { get; set; }
        
        public static string TableName
        {
            get { return "ex_wt_data"; }
        }
        
        public override string GetTableName()
        {
            return TableName;
        }       
        
        public override string GetPrimaryCondition()
        {
            return string.Format("{0} = {1}", Fields.lc_sn, lc_sn);
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
