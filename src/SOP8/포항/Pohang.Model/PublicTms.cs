using System;
using dnsDapperDBUtil.DataAccessLayer.IDAL;

namespace Pohang.Model
{
    public class PublicTms : Table
    {
        public enum Fields { company_name, address, tm, sox_value, nox_value, co_value, tsp_value, hcl_value, hf_value, nh3_value }
        public enum WriteFields { company_name, address, tm, sox_value, nox_value, co_value, tsp_value, hcl_value, hf_value, nh3_value }
        
        public string company_name { get; set; }
        public string address { get; set; }
        public DateTime tm { get; set; }
        public double sox_value { get; set; }
        public double nox_value { get; set; }
        public double co_value { get; set; }
        public double tsp_value { get; set; }
        public double hcl_value { get; set; }
        public double hf_value { get; set; }
        public double nh3_value { get; set; }

        public static string TableName
        {
            get { return "ex_public_tms"; }
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