using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Pohang.Model
{
    public class PublicAirKorea : Table
    {
        public enum Fields { lc_name, address, tm, pm10_value, pm25_value, o3_value, co_value, so2_value }
        public enum WriteFields { lc_name, address, tm, pm10_value, pm25_value, o3_value, co_value, so2_value }
        
        public string lc_name { get; set; }
        public string address { get; set; }
        public DateTime tm { get; set; }
        public double pm10_value { get; set; }
        public double pm25_value { get; set; }
        public double o3_value { get; set; }
        public double co_value { get; set; }
        public double so2_value { get; set; }
        
        public static string TableName
        {
            get { return "ex_public_air"; }
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